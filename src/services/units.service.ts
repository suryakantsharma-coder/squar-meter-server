import { Types } from 'mongoose';
import { IUnit, Unit } from '../models/units.model';

class UnitsService {
  async createUnit(data: any) {
    try {
      const unit = await Unit.create(data);
      return unit;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create unit');
    }
  }

  async getUnitsByProject(projectId: string) {
    try {
      return await Unit.find({ projectId: new Types.ObjectId(projectId) }).sort({
        block: 1,
        unitNumber: 1,
      });
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fetch units');
    }
  }

  async getUnitById(unitId: string) {
    try {
      return await Unit.findById(unitId);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fetch unit');
    }
  }

  async updateUnit(unitId: string, updateData: any) {
    try {
      return await Unit.findByIdAndUpdate(unitId, updateData, { new: true });
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update unit');
    }
  }

  async deleteUnit(unitId: string) {
    try {
      return await Unit.findByIdAndDelete(unitId);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete unit');
    }
  }
}

export default new UnitsService();
