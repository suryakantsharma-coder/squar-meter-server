"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const units_model_1 = require("../models/units.model");
class UnitsService {
    async createUnit(data) {
        try {
            const unit = await units_model_1.Unit.create(data);
            return unit;
        }
        catch (err) {
            throw new Error(err.message || 'Failed to create unit');
        }
    }
    async getUnitsByProject(projectId) {
        try {
            return await units_model_1.Unit.find({ projectId: new mongoose_1.Types.ObjectId(projectId) }).sort({
                block: 1,
                unitNumber: 1,
            });
        }
        catch (err) {
            throw new Error(err.message || 'Failed to fetch units');
        }
    }
    async getUnitById(unitId) {
        try {
            return await units_model_1.Unit.findById(unitId);
        }
        catch (err) {
            throw new Error(err.message || 'Failed to fetch unit');
        }
    }
    async getUnitByIdSearch(unitId, searchTerm) {
        try {
            return await units_model_1.Unit.findById(unitId).find({
                $or: [
                    { unitNumber: { $regex: new RegExp(searchTerm, 'i') } },
                    { block: { $regex: new RegExp(searchTerm, 'i') } },
                ],
            });
        }
        catch (err) {
            throw new Error(err.message || 'Failed to fetch unit');
        }
    }
    async updateUnit(unitId, updateData) {
        try {
            return await units_model_1.Unit.findByIdAndUpdate(unitId, updateData, { new: true });
        }
        catch (err) {
            throw new Error(err.message || 'Failed to update unit');
        }
    }
    async deleteUnit(unitId) {
        try {
            return await units_model_1.Unit.findByIdAndDelete(unitId);
        }
        catch (err) {
            throw new Error(err.message || 'Failed to delete unit');
        }
    }
}
exports.default = new UnitsService();
