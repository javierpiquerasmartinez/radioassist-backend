import prisma from '../utils/prisma.js';

export async function getAll(userId: string) {
  return prisma.template.findMany({
    where: { usuarioId: userId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function create(userId: string, nombre: string, contenido: string) {
  return prisma.template.create({
    data: { usuarioId: userId, nombre, contenido },
  });
}

export async function update(id: string, userId: string, nombre: string, contenido: string) {
  const template = await prisma.template.findUnique({ where: { id } });

  if (!template || template.usuarioId !== userId) {
    const err = new Error('Template not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  return prisma.template.update({
    where: { id },
    data: { nombre, contenido },
  });
}

export async function remove(id: string, userId: string) {
  const template = await prisma.template.findUnique({ where: { id } });

  if (!template || template.usuarioId !== userId) {
    const err = new Error('Template not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  await prisma.template.delete({ where: { id } });
}
