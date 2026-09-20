import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const token = generateToken({ userId: user.id, role: user.role });
    const { password: _, ...safeUser } = user;

    res.status(201).json({ user: safeUser, token });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const isMatch = user ? await comparePassword(password, user.password) : false;

    if (!user || !isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken({ userId: user.id, role: user.role });;
    const { password: _, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};