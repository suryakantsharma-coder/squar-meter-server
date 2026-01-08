"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeads = exports.deleteLead = exports.updateLead = exports.createNewLead = void 0;
const lead_model_1 = require("../models/lead.model");
const createNewLead = async (leadData) => {
    const lead = new lead_model_1.Lead(leadData);
    await lead.save();
    return lead;
};
exports.createNewLead = createNewLead;
const updateLead = async (id, updates) => {
    const lead = await lead_model_1.Lead.findByIdAndUpdate(id, updates, { new: true });
    return lead;
};
exports.updateLead = updateLead;
const deleteLead = async (id) => {
    const lead = await lead_model_1.Lead.findByIdAndDelete(id);
    if (!lead) {
        return { message: 'Lead not found' };
    }
    return { message: 'Lead deleted successfully', lead };
};
exports.deleteLead = deleteLead;
const getLeads = async (filters) => {
    const leads = await lead_model_1.Lead.find(filters)
        .sort({ createdAt: -1 })
        .populate('interestedProjects.projectId')
        .populate('interestedProjects.units');
    return leads;
};
exports.getLeads = getLeads;
