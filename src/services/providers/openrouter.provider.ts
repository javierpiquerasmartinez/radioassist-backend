import { OpenRouter } from '@openrouter/sdk';
import type { AIProvider, AIResponse, Message } from '../ai.service.js';

const client = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
const MODEL = process.env.AI_MODEL ?? 'openrouter/free';

function parseResponse(text: string): AIResponse {
  // Strip markdown code blocks if the model wraps JSON in them
  const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

  try {
    const parsed = JSON.parse(cleaned) as AIResponse;

    if (parsed.type !== 'report' && parsed.type !== 'question') {
      throw new Error('Unexpected type value');
    }

    return parsed;
  } catch {
    // Fallback: if parsing fails, treat the raw text as a question
    return {
      type: 'question',
      content: text,
      templateDetected: '',
    };
  }
}

export const openrouterProvider: AIProvider = {
  async generate(
    systemPrompt: string,
    history: Message[],
    dictation: string
  ): Promise<AIResponse> {
    const messages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: dictation },
    ];

    const stream = await client.chat.send({
      chatGenerationParams: {
        model: MODEL,
        messages,
        stream: true,
      },
    });

    let fullText = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullText += content;
      }
    }

    if (!fullText) {
      throw new Error('No text response from AI model');
    }

    return parseResponse(fullText);
  },
};
