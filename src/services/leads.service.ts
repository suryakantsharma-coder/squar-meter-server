import { ILead, Lead } from '../models/lead.model';

const createNewLead = async (leadData: Partial<ILead>): Promise<ILead> => {
  const lead = new Lead(leadData);
  await lead.save();
  return lead;
};

const updateLead = async (id: string, updates: Partial<ILead>): Promise<ILead | null> => {
  const lead = await Lead.findByIdAndUpdate(id, updates, { new: true });
  return lead;
};

const deleteLead = async (id: string): Promise<{ message: string; lead?: ILead | null }> => {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    return { message: 'Lead not found' };
  }
  return { message: 'Lead deleted successfully', lead };
};

const getLeads = async (filters: any): Promise<ILead[]> => {
  const leads = await Lead.find(filters)
    .sort({ createdAt: -1 })
    .populate('interestedProjects.projectId')
    .populate('interestedProjects.units');
  return leads;
};

export { createNewLead, updateLead, deleteLead, getLeads };
