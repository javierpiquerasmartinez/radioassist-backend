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
