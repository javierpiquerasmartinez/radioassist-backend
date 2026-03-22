import type { User, Template } from '@prisma/client';
import {
  PROMPT_RESTRICTIONS,
  PROMPT_INCOMPLETE_INFO,
  PROMPT_GENERATION_INSTRUCTIONS,
  PROMPT_RESPONSE_FORMAT,
} from '../config/prompt.config.js';

type UserWithTemplates = User & { templates: Template[] };

export function buildSystemPrompt(user: UserWithTemplates): string {
  const templatesSection = user.templates
    .map((t: Template) => `--- ${t.name.toUpperCase()} ---\n${t.content}`)
    .join('\n\n');

  return `
Eres un asistente especializado EXCLUSIVAMENTE en la generación de informes
radiológicos para ${user.name}.

${PROMPT_RESTRICTIONS}

${PROMPT_INCOMPLETE_INFO}

PLANTILLAS DISPONIBLES:
${templatesSection}

${PROMPT_GENERATION_INSTRUCTIONS}
- Respeta el estilo y terminología del Dr./Dra. ${user.name}.

PREFERENCIAS:
${JSON.stringify(user.preferences, null, 2)}

${PROMPT_RESPONSE_FORMAT}
  `.trim();
}
