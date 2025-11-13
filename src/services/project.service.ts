import { IProject, Project } from '../models/project.model';

export const createNewProject = async ({
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
  listingUser,
}: IProject) => {
  const existing = await Project.findOne({ name });
  if (existing) throw new Error('Project Already exists');

  console.log({ assets });

  const project = await Project.create({
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
    listingUser,
  });
  return project;
};

export const updateProject = async (id: string, updates: Partial<IProject>) => {
  const project = await Project.findById(id);
  if (!project) throw new Error('Project not found');

  Object.assign(project, updates);
  await project.save();

  return project;
};

export const deleteProject = async (id: string) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) throw new Error('Project not found');

  return { message: 'Project deleted successfully', project };
};

export const getProjects = async (filters: any) => {
  const projects = await Project.find(filters).sort({ createdAt: -1 });
  return projects;
};

export const getProjectDetails = async (id: string) => {
  const project = await Project.findById(id);
  return project;
};
