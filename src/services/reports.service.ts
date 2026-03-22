import prisma from '../utils/prisma.js';
import { buildSystemPrompt } from './context.service.js';
import type { AIProvider, Message } from './ai.service.js';

export async function generateReport(
  userId: string,
  dictado: string,
  sessionHistory: Message[],
  aiProvider: AIProvider
) {
  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: { templates: true },
  });

  if (!user) {
    const err = new Error('User not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  const systemPrompt = buildSystemPrompt(user);
  const aiResponse = await aiProvider.generate(systemPrompt, sessionHistory, dictado);

  if (aiResponse.tipo === 'informe') {
    await prisma.report.create({
      data: {
        usuarioId: userId,
        templateUsed: aiResponse.plantillaDetectada,
        originalDictation: dictado,
        generatedReport: aiResponse.contenido,
      },
    });
  }

  return aiResponse;
}

export async function getHistory(userId: string) {
  return prisma.report.findMany({
    where: { usuarioId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      templateUsed: true,
      originalDictation: true,
      generatedReport: true,
      createdAt: true,
    },
  });
}
