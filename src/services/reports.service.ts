import prisma from '../utils/prisma.js';
import { buildSystemPrompt } from './context.service.js';
import type { AIProvider, Message } from './ai.service.js';

export async function generateReport(
  userId: string,
  dictation: string,
  sessionHistory: Message[],
  aiProvider: AIProvider,
  sessionId?: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { templates: true },
  });

  if (!user) {
    const err = new Error('User not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  const systemPrompt = buildSystemPrompt(user);
  const aiResponse = await aiProvider.generate(systemPrompt, sessionHistory, dictation);

  if (aiResponse.type === 'report') {
    await prisma.report.create({
      data: {
        userId,
        sessionId,
        templateUsed: aiResponse.templateDetected,
        originalDictation: dictation,
        generatedReport: aiResponse.content,
      },
    });
  }

  return aiResponse;
}

export async function getHistory(userId: string) {
  return prisma.report.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      sessionId: true,
      templateUsed: true,
      originalDictation: true,
      generatedReport: true,
      createdAt: true,
    },
  });
}
