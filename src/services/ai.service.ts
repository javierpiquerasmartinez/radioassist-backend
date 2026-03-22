export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  tipo: 'informe' | 'pregunta';
  contenido: string;
  plantillaDetectada: string;
}

export interface AIProvider {
  generate(systemPrompt: string, history: Message[], dictado: string): Promise<AIResponse>;
}
