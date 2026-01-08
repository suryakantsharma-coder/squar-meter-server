"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectDetails = exports.getProjects = exports.deleteProject = exports.updateProject = exports.createNewProject = void 0;
const project_model_1 = require("../models/project.model");
const createNewProject = async ({ name, type, totalUnits, status, completion, location, priceRange, availableUnits, soldUnits, pincode, assets, listingUser, }) => {
    const existing = await project_model_1.Project.findOne({ name });
    if (existing)
        throw new Error('Project Already exists');
    console.log({ assets });
    const project = await project_model_1.Project.create({
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
exports.createNewProject = createNewProject;
const updateProject = async (id, updates) => {
    const project = await project_model_1.Project.findById(id);
    if (!project)
        throw new Error('Project not found');
    Object.assign(project, updates);
    await project.save();
    return project;
};
exports.updateProject = updateProject;
const deleteProject = async (id) => {
    const project = await project_model_1.Project.findByIdAndDelete(id);
    if (!project)
        throw new Error('Project not found');
    return { message: 'Project deleted successfully', project };
};
exports.deleteProject = deleteProject;
const getProjects = async (filters) => {
    const projects = await project_model_1.Project.find(filters).sort({ createdAt: -1 });
    return projects;
};
exports.getProjects = getProjects;
const getProjectDetails = async (id) => {
    const project = await project_model_1.Project.findById(id);
    return project;
};
exports.getProjectDetails = getProjectDetails;
