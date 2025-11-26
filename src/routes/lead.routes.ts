import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth';
import { validateFields } from '../utils/validation';
import config from '../config';
import { ILead, Lead } from '../models/lead.model';
import { createNewLead, deleteLead, getLeads, updateLead } from '../services/leads.service';

const router = express.Router();

// Lead routes would go here

router.post('/create', authenticateToken, async (req: any, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    const decoded: any = jwt.verify(token, config.jwtSecret);

    const data = req.body;

    const isValid = validateFields(true, data);
    if (!isValid) throw new Error('All fields are required');

    const leadData: ILead = { ...data };

    //   check if lead already created with same phone
    const existingLead = await Lead.findOne({
      'contact.phone': req.body.contact.phone,
    });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: 'Lead already exists',
        lead: existingLead,
      });
    }

    const lead = await createNewLead(leadData);
    res.status(201).json({ message: 'lead Created', lead });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/update/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!id) throw new Error('Lead ID is required');

    const updatedLead = await updateLead(id, updates);
    res.status(200).json({ message: 'Lead Updated', lead: updatedLead });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/delete/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!id) throw new Error('Lead ID is required');
    const deleted = await deleteLead(id);
    res.status(200).json({ message: 'Lead Deleted', deleted });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const filters = req.query || {};
    const leads = await getLeads(filters);
    res.status(200).json({
      message: 'Leads fetched successfully',
      total: leads.length,
      leads,
    });
  } catch (err: any) {
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

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex metacharacters
}

router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) throw new Error('Search query is required');

    console.log({ query });

    const escaped = escapeRegex(query as string);
    const regex = new RegExp(escaped, 'i'); // case-insensitive

    const leads = await Lead.find({
      $or: [{ name: regex }, { 'contact.phone': regex }],
    })
      .lean()
      .populate('interestedProjects.units');

    res.status(200).json({ message: 'Search results', total: leads.length, leads });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// aslo create a curl of search route
// curl -X GET "http://localhost:3000/leads/search?query=example" -H "Authorization: Bearer <token>"

export default router;
