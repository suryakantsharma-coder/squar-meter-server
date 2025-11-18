import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth';
import { validateFields } from '../utils/validation';
import {
  createNewProject,
  deleteProject,
  getProjectDetails,
  getProjects,
  updateProject,
} from '../services/project.service';
import { IProject } from '../models/project.model';
import config from '../config';

const router = express.Router();

router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { name, type, status, state } = req.query;

    const filters: Record<string, any> = {};
    if (name) filters.name = { $regex: new RegExp(name as string, 'i') };
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (state) filters.state = state;

    const projects = await getProjects(filters);

    res.status(200).json({
      message: 'Projects fetched successfully',
      total: projects?.length,
      projects,
    });
  } catch (err: any) {
    console.error('Error fetching projects:', err);
    res.status(400).json({ message: err.message });
  }
});

router.get('/:name', authenticateToken, async (req: any, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await getProjects({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (!project || project.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      message: 'Project fetched successfully',
      project: project[0], // if only one expected
    });
  } catch (err: any) {
    console.error('Error fetching project:', err);
    res.status(400).json({ message: err.message });
  }
});

router.post('/add_new_project', authenticateToken, async (req: any, res) => {
  try {
    const {
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
    } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    const decoded: any = jwt.verify(token, config.jwtSecret);
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
      listingUser: decoded?.email as string,
    };

    const isValidData = validateFields(true, params);
    if (!isValidData) throw new Error('all fields are required');
    const project = await createNewProject(params as IProject);
    console.log('Created Project:', project);
    res.status(201).json({ message: 'Project Created', project });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// create a search route to search projects by name, type, status, state
router.get('/search', authenticateToken, async (req: any, res) => {
  try {
    const { name, type, status, state } = req.query;
    console.log({ name, type, status, state });

    const filters: Record<string, any> = {};
    if (name) filters.name = { $regex: new RegExp(name as string, 'i') };
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (state) filters.state = state;

    console.log({ filters });

    const projects = await getProjects(filters);

    res.status(200).json({
      message: 'Projects fetched successfully',
      total: projects?.length,
      projects,
    });
  } catch (err: any) {
    console.error('Error searching projects:', err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/update_project/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    const decoded: any = jwt.verify(token, config.jwtSecret);

    if (!id) throw new Error('Project ID is required');

    const projectDetails: any = await getProjectDetails(id);

    if (decoded?.email !== projectDetails?.listingUser)
      throw new Error('you are not autheroized for the operation.');

    const updatedProject = await updateProject(id, updates);
    res.status(200).json({ message: 'Project Updated', project: updatedProject });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/delete_project/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    const decoded: any = jwt.verify(token, config.jwtSecret);

    if (!id) throw new Error('Project ID is required');

    const projectDetails: any = await getProjectDetails(id);

    if (decoded?.email !== projectDetails?.listingUser)
      throw new Error('you are not autheroized for the operation.');

    const deleted = await deleteProject(id);
    res.status(200).json({ message: 'Project Deleted', deleted });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
