"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const config_1 = __importDefault(require("../config"));
const lead_model_1 = require("../models/lead.model");
const leads_service_1 = require("../services/leads.service");
const router = express_1.default.Router();
// Lead routes would go here
router.post('/create', auth_1.authenticateToken, async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        const data = req.body;
        const isValid = (0, validation_1.validateFields)(true, data);
        if (!isValid)
            throw new Error('All fields are required');
        const leadData = { ...data };
        //   check if lead already created with same phone
        const existingLead = await lead_model_1.Lead.findOne({
            'contact.phone': req.body.contact.phone,
        });
        if (existingLead) {
            return res.status(409).json({
                success: false,
                message: 'Lead already exists',
                lead: existingLead,
            });
        }
        const lead = await (0, leads_service_1.createNewLead)(leadData);
        res.status(201).json({ message: 'lead Created', lead });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.put('/update/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        if (!id)
            throw new Error('Lead ID is required');
        const updatedLead = await (0, leads_service_1.updateLead)(id, updates);
        res.status(200).json({ message: 'Lead Updated', lead: updatedLead });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.delete('/delete/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        if (!id)
            throw new Error('Lead ID is required');
        const deleted = await (0, leads_service_1.deleteLead)(id);
        res.status(200).json({ message: 'Lead Deleted', deleted });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// router.get('/', authenticateToken, async (req: any, res) => {
//   try {
//     const filters = req.query || {};
//     const leads = await getLeads(filters);
//     res.status(200).json({
//       message: 'Leads fetched successfully',
//       total: leads.length,
//       leads,
//     });
//   } catch (err: any) {
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
        const total = await lead_model_1.Lead.countDocuments(filters);
        // paginated data
        const leads = await lead_model_1.Lead.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean()
            .populate('interestedProjects.projectId')
            .populate('interestedProjects.units'); // Use lean() for better performance
        res.status(200).json({
            message: 'Leads fetched successfully',
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            leads,
        });
    }
    catch (err) {
        console.error('Error fetching leads:', err);
        res.status(400).json({ message: err.message });
    }
});
// router.get('/:id', authenticateToken, async (req: any, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) throw new Error('Lead ID is required');
//     const lead = await Lead.findById(id)
//       .lean()
//       .populate('interestedProjects.projectId')
//       .populate('interestedProjects.units');
//     console.log({ lead, id });
//     if (!lead) {
//       return res.status(404).json({ message: 'Lead not found' });
//     }
//     res.status(200).json({ message: 'Lead fetched successfully', lead });
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// });
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new Error('Unit ID is required');
        const lead = await lead_model_1.Lead.find({
            'interestedProjects.units': id,
        })
            .lean()
            .populate('interestedProjects.projectId')
            .populate('interestedProjects.units');
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found for this unit' });
        }
        console.log({ lead, id });
        res.status(200).json({
            message: 'Lead fetched successfully by unit',
            lead,
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// create a search route here for the leads like get request also remove ase sensitive
// router.get('/search', authenticateToken, async (req: any, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) throw new Error('Search query is required');
//     const leads = await Lead.find({
//       $or: [
//         { 'contact.name': { $regex: query, $options: 'i' } },
//         { 'contact.email': { $regex: query, $options: 'i' } },
//         { 'contact.phone': { $regex: query, $options: 'i' } },
//         { company: { $regex: query, $options: 'i' } },
//       ],
//     });
//     res.status(200).json({
//       message: 'Search results',
//       total: leads.length,
//       leads,
//     });
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// });
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex metacharacters
}
router.get('/search', auth_1.authenticateToken, async (req, res) => {
    try {
        const { query } = req.query;
        if (!query)
            throw new Error('Search query is required');
        console.log({ query });
        const escaped = escapeRegex(query);
        const regex = new RegExp(escaped, 'i'); // case-insensitive
        const leads = await lead_model_1.Lead.find({
            $or: [{ name: regex }, { 'contact.phone': regex }],
        })
            .lean()
            .populate('interestedProjects.units');
        res.status(200).json({ message: 'Search results', total: leads.length, leads });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// aslo create a curl of search route
// curl -X GET "http://localhost:3000/leads/search?query=example" -H "Authorization: Bearer <token>"
exports.default = router;
