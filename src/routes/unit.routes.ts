import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth';
import { validateFields } from '../utils/validation';
import UnitsService from '../services/units.service';
import config from '../config';

const router = express.Router();

/** Get all units for a project */
router.get('/project/:projectId', authenticateToken, async (req: any, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) return res.status(400).json({ message: 'Project ID is required' });

    const units = await UnitsService.getUnitsByProject(projectId);

    res.status(200).json({
      message: 'Units fetched successfully',
      total: units.length,
      units,
    });
  } catch (err: any) {
    console.error('Error fetching units:', err);
    res.status(400).json({ message: err.message });
  }
});

/** Get single unit */
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const unit = await UnitsService.getUnitById(id);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });

    res.status(200).json({ message: 'Unit fetched successfully', unit });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/** cretae a search route for unit */
router.get('/:id/:term', authenticateToken, async (req: any, res) => {
  try {
    const { term, id } = req.params;
    const units = await UnitsService.getUnitByIdSearch(id, term);

    res.status(200).json({
      message: 'Units fetched successfully',
      total: units.length,
      units,
    });
  } catch (err: any) {
    console.error('Error searching units:', err);
    res.status(400).json({ message: err.message });
  }
});

/** Create new unit */
router.post('/create', authenticateToken, async (req: any, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    const decoded: any = jwt.verify(token, config.jwtSecret);

    const data = req.body;

    const isValid = validateFields(true, data);
    if (!isValid) throw new Error('All fields are required');

    data.listingUser = decoded?.email;

    const unit = await UnitsService.createUnit(data);
    res.status(201).json({ message: 'Unit Created', unit });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/** Update unit */
router.put('/update/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) throw new Error('Unit ID is required');

    const updatedUnit = await UnitsService.updateUnit(id, updates);
    res.status(200).json({ message: 'Unit Updated', unit: updatedUnit });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/** Delete unit */
router.delete('/delete/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error('Unit ID is required');

    const deleted = await UnitsService.deleteUnit(id);
    res.status(200).json({ message: 'Unit Deleted', deleted });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
