export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  type: 'report' | 'question';
  content: string;
  templateDetected: string;
}

export interface AIProvider {
  generate(systemPrompt: string, history: Message[], dictation: string): Promise<AIResponse>;
}

export async function resolveProvider(): Promise<AIProvider> {
  const name = (process.env.AI_PROVIDER ?? 'anthropic').toLowerCase();
  if (name === 'openrouter') {
    const { openrouterProvider } = await import('./providers/openrouter.provider.js');
    return openrouterProvider;
  }
  const { claudeProvider } = await import('./providers/claude.provider.js');
  return claudeProvider;
}
