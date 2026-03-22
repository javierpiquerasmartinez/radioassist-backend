import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { signToken } from '../utils/jwt.js';

export async function register(email: string, nombre: string, password: string) {
  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use') as Error & { status: number };
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.usuario.create({
    data: { email, nombre, passwordHash },
    select: { id: true, email: true, nombre: true, createdAt: true },
  });

  return user;
}

export async function login(email: string, password: string) {
  const user = await prisma.usuario.findUnique({ where: { email } });

  // Deliberate vague error to avoid user enumeration
  if (!user) {
    const err = new Error('Invalid credentials') as Error & { status: number };
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Invalid credentials') as Error & { status: number };
    err.status = 401;
    throw err;
  }

  return { token: signToken(user.id) };
}

export async function getMe(userId: string) {
  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: { plantillas: true },
  });

  if (!user) {
    const err = new Error('User not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _omit, ...safeUser } = user;
  return safeUser;
}
