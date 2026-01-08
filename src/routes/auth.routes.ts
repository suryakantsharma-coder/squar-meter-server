import express from 'express';
import { registerUser, loginUser, refreshAccessToken, logoutUser } from '../services/auth.service';
import { authenticateToken } from '../middleware/auth';
import { Types } from 'mongoose';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await registerUser(email, password, name);
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    // @ts-expect-error -- err type
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await loginUser(
      email,
      password,
      req.ip,
      req.headers['user-agent'],
    );
    res.json({ accessToken, refreshToken, user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const newAccess = await refreshAccessToken(refreshToken);
    res.json({ accessToken: newAccess });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
});

router.post('/logout', authenticateToken, async (req: any, res) => {
  try {
    await logoutUser(new Types.ObjectId(req.user.id), req.body.refreshToken);
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
