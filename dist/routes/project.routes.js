"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const project_service_1 = require("../services/project.service");
const project_model_1 = require("../models/project.model");
const config_1 = __importDefault(require("../config"));
const router = express_1.default.Router();
// router.get('/', authenticateToken, async (req: any, res) => {
//   try {
//     const { name, type, status, state } = req.query;
//     const filters: Record<string, any> = {};
//     if (name) filters.name = { $regex: new RegExp(name as string, 'i') };
//     if (type) filters.type = type;
//     if (status) filters.status = status;
//     if (state) filters.state = state;
//     const projects = await getProjects(filters);
//     res.status(200).json({
//       message: 'Projects fetched successfully',
//       total: projects?.length,
//       projects,
//     });
//   } catch (err: any) {
//     console.error('Error fetching projects:', err);
//     res.status(400).json({ message: err.message });
//   }
// });
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        // Extract pagination params first
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        // Create filters object without pagination params
        const filters = { ...req.query };
        delete filters.page;
        delete filters.limit;
        // total documents count with filters
        const total = await project_model_1.Project.countDocuments(filters);
        // paginated data
        const projects = await project_model_1.Project.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance
        res.status(200).json({
            message: 'Projects fetched successfully',
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            projects,
        });
    }
    catch (err) {
        console.error('Error fetching projects:', err);
        res.status(400).json({ message: err.message });
    }
});
router.get('/:name', auth_1.authenticateToken, async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({ message: 'Project name is required' });
        }
        const project = await (0, project_service_1.getProjects)({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (!project || project.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({
            message: 'Project fetched successfully',
            project: project[0], // if only one expected
        });
    }
    catch (err) {
        console.error('Error fetching project:', err);
        res.status(400).json({ message: err.message });
    }
});
router.post('/add_new_project', auth_1.authenticateToken, async (req, res) => {
    try {
        const { name, type, totalUnits, status, completion, location, priceRange, availableUnits, soldUnits, pincode, assets, } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        console.log('Decoded Token:', decoded);
        const params = {
            name,
            type,
            totalUnits,
            status,
            completion,
            location,
            priceRange,
            availableUnits,
            soldUnits,
            pincode,
            assets,
            listingUser: decoded?.email,
        };
        const isValidData = (0, validation_1.validateFields)(true, params);
        if (!isValidData)
            throw new Error('all fields are required');
        const project = await (0, project_service_1.createNewProject)(params);
        console.log('Created Project:', project);
        res.status(201).json({ message: 'Project Created', project });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// create a search route to search projects by name, type, status, state
router.get('/search', auth_1.authenticateToken, async (req, res) => {
    try {
        const { name, type, status, state } = req.query;
        console.log({ name, type, status, state });
        const filters = {};
        if (name)
            filters.name = { $regex: new RegExp(name, 'i') };
        if (type)
            filters.type = type;
        if (status)
            filters.status = status;
        if (state)
            filters.state = state;
        console.log({ filters });
        const projects = await (0, project_service_1.getProjects)(filters);
        res.status(200).json({
            message: 'Projects fetched successfully',
            total: projects?.length,
            projects,
        });
    }
    catch (err) {
        console.error('Error searching projects:', err);
        res.status(400).json({ message: err.message });
    }
});
router.put('/update_project/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        if (!id)
            throw new Error('Project ID is required');
        const projectDetails = await (0, project_service_1.getProjectDetails)(id);
        if (decoded?.email !== projectDetails?.listingUser)
            throw new Error('you are not autheroized for the operation.');
        const updatedProject = await (0, project_service_1.updateProject)(id, updates);
        res.status(200).json({ message: 'Project Updated', project: updatedProject });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.delete('/delete_project/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        if (!id)
            throw new Error('Project ID is required');
        const projectDetails = await (0, project_service_1.getProjectDetails)(id);
        if (decoded?.email !== projectDetails?.listingUser)
            throw new Error('you are not autheroized for the operation.');
        const deleted = await (0, project_service_1.deleteProject)(id);
        res.status(200).json({ message: 'Project Deleted', deleted });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.default = router;
