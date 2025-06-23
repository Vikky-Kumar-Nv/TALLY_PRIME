import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '1h'; // Setting to 1 hour for security

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  } catch (error) {
    throw new Error(`Error hashing password: ${error}`);
  }
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateToken = (user: User): string => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};