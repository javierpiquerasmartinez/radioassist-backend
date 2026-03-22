import { Request, Response } from 'express';
import { z } from 'zod';
import * as templatesService from '../services/templates.service.js';

const templateSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
});

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const templates = await templatesService.getAll(req.user.userId);
    res.json(templates);
  } catch (err) {
    const e = err as Error & { status?: number };
    res.status(e.status ?? 500).json({ error: e.message });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const result = templateSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }

  try {
    const template = await templatesService.create(
      req.user.userId,
      result.data.name,
      result.data.content
    );
    res.status(201).json(template);
  } catch (err) {
    const e = err as Error & { status?: number };
    res.status(e.status ?? 500).json({ error: e.message });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const result = templateSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }

  try {
    const template = await templatesService.update(
      req.params['id'] as string,
      req.user.userId,
      result.data.name,
      result.data.content
    );
    res.json(template);
  } catch (err) {
    const e = err as Error & { status?: number };
    res.status(e.status ?? 500).json({ error: e.message });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await templatesService.remove(req.params['id'] as string, req.user.userId);
    res.status(204).send();
  } catch (err) {
    const e = err as Error & { status?: number };
    res.status(e.status ?? 500).json({ error: e.message });
  }
}
