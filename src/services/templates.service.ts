import prisma from '../utils/prisma.js';

export async function getAll(userId: string) {
  return prisma.template.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function create(userId: string, name: string, content: string) {
  return prisma.template.create({
    data: { userId, name, content },
  });
}

export async function update(id: string, userId: string, name: string, content: string) {
  const template = await prisma.template.findUnique({ where: { id } });

  if (!template || template.userId !== userId) {
    const err = new Error('Template not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  return prisma.template.update({
    where: { id },
    data: { name, content },
  });
}

export async function remove(id: string, userId: string) {
  const template = await prisma.template.findUnique({ where: { id } });

  if (!template || template.userId !== userId) {
    const err = new Error('Template not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  await prisma.template.delete({ where: { id } });
}
