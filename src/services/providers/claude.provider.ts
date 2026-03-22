import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, AIResponse, Message } from '../ai.service.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.AI_MODEL ?? 'claude-haiku-4-5';

function parseResponse(text: string): AIResponse {
  // Strip markdown code blocks if the model wraps JSON in them
  const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

  try {
    const parsed = JSON.parse(cleaned) as AIResponse;

    if (parsed.tipo !== 'informe' && parsed.tipo !== 'pregunta') {
      throw new Error('Unexpected tipo value');
    }

    return parsed;
  } catch {
    // Fallback: if parsing fails, treat the raw text as a question
    return {
      tipo: 'pregunta',
      contenido: text,
      plantillaDetectada: '',
    };
  }
}

export const claudeProvider: AIProvider = {
  async generate(systemPrompt: string, history: Message[], dictado: string): Promise<AIResponse> {
    const messages: Anthropic.MessageParam[] = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: dictado },
    ];

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from AI model');
    }

    return parseResponse(textBlock.text);
  },
};
