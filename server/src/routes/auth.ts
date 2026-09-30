// 🌾 Auth Routes
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, authenticate, type AuthRequest } from '../middleware/auth';
import { v4 as uuid } from 'uuid';

export const authRouter = Router();

// Demo users store (in production: PostgreSQL)
const users: Map<string, any> = new Map();

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { name, phone, password, preferredLanguage, role } = req.body;
    if (!name || !phone || !password) {
      res.status(400).json({ error: 'Name, phone, and password are required' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: uuid(), name, phone, email: req.body.email || null,
      passwordHash, preferredLanguage: preferredLanguage || 'ta',
      role: role || 'FARMER', status: 'ACTIVE',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    users.set(phone, user);
    const token = generateToken({ id: user.id, role: user.role, language: user.preferredLanguage });
    res.status(201).json({ user: { ...user, passwordHash: undefined }, token });
  } catch (err) { res.status(500).json({ error: 'Registration failed' }); }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = users.get(phone);
    if (!user) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    const token = generateToken({ id: user.id, role: user.role, language: user.preferredLanguage });
    res.json({ user: { ...user, passwordHash: undefined }, token });
  } catch (err) { res.status(500).json({ error: 'Login failed' }); }
});

// POST /api/auth/demo — Quick demo login
authRouter.post('/demo', (_req, res) => {
  const demoUser = {
    id: 'demo-user-001', name: 'முருகன்', phone: '+91 98765 43210',
    role: 'FARMER', preferredLanguage: 'ta', status: 'ACTIVE',
  };
  const token = generateToken({ id: demoUser.id, role: 'FARMER', language: 'ta' });
  res.json({ user: demoUser, token });
});

// GET /api/auth/me
authRouter.get('/me', authenticate as any, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});
