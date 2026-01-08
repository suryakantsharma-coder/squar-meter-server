"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const units_service_1 = __importDefault(require("../services/units.service"));
const config_1 = __importDefault(require("../config"));
const router = express_1.default.Router();
/** Get all units for a project */
router.get('/project/:projectId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!projectId)
            return res.status(400).json({ message: 'Project ID is required' });
        const units = await units_service_1.default.getUnitsByProject(projectId);
        res.status(200).json({
            message: 'Units fetched successfully',
            total: units.length,
            units,
        });
    }
    catch (err) {
        console.error('Error fetching units:', err);
        res.status(400).json({ message: err.message });
    }
});
/** Get single unit */
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const unit = await units_service_1.default.getUnitById(id);
        if (!unit)
            return res.status(404).json({ message: 'Unit not found' });
        res.status(200).json({ message: 'Unit fetched successfully', unit });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
/** cretae a search route for unit */
router.get('/:id/:term', auth_1.authenticateToken, async (req, res) => {
    try {
        const { term, id } = req.params;
        const units = await units_service_1.default.getUnitByIdSearch(id, term);
        res.status(200).json({
            message: 'Units fetched successfully',
            total: units.length,
            units,
        });
    }
    catch (err) {
        console.error('Error searching units:', err);
        res.status(400).json({ message: err.message });
    }
});
/** Create new unit */
router.post('/create', auth_1.authenticateToken, async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        const data = req.body;
        const isValid = (0, validation_1.validateFields)(true, data);
        if (!isValid)
            throw new Error('All fields are required');
        data.listingUser = decoded?.email;
        const unit = await units_service_1.default.createUnit(data);
        res.status(201).json({ message: 'Unit Created', unit });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
/** Update unit */
router.put('/update/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!id)
            throw new Error('Unit ID is required');
        const updatedUnit = await units_service_1.default.updateUnit(id, updates);
        res.status(200).json({ message: 'Unit Updated', unit: updatedUnit });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
/** Delete unit */
router.delete('/delete/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new Error('Unit ID is required');
        const deleted = await units_service_1.default.deleteUnit(id);
        res.status(200).json({ message: 'Unit Deleted', deleted });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.default = router;
