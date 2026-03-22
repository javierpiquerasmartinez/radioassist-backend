import { Request, Response } from 'express';
import { z } from 'zod';
import * as reportsService from '../services/reports.service.js';
import { resolveProvider } from '../services/ai.service.js';

const generateSchema = z.object({
  dictation: z.string().min(1),
  sessionId: z.string().uuid().optional(),
  sessionHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .default([]),
});

export async function generate(req: Request, res: Response): Promise<void> {
  const result = generateSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }

  try {
    const provider = await resolveProvider();
    const response = await reportsService.generateReport(
      req.user.userId,
      result.data.dictation,
      result.data.sessionHistory,
      provider,
      result.data.sessionId
    );
    res.json(response);
  } catch (err) {
    const e = err as Error & { status?: number };
    res.status(e.status ?? 500).json({ error: e.message });
  }
}

export async function getHistory(req: Request, res: Response): Promise<void> {
  try {
    const history = await reportsService.getHistory(req.user.userId);
    res.json(history);
  } catch (err) {
    const e = err as Error & { status?: number };
    res.status(e.status ?? 500).json({ error: e.message });
  }
}
