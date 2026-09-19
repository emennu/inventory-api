import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key';

// Hashes a plain-text password before saving it to Neon PostgreSQL
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compares a login attempt password against the stored database hash
export const comparePassword = async (
  plainText: string,
  hashedText: string
): Promise<boolean> => {
  return await bcrypt.compare(plainText, hashedText);
};

// Creates a digital token holding the user's ID and role, valid for 24 hours
export const generateToken = (payload: { userId: number; role: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};