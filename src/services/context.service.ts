import type { User, Template } from '@prisma/client';
import {
  buildRoleSection,
  PROMPT_RESTRICTIONS,
  PROMPT_INCOMPLETE_INFO,
  PROMPT_TEMPLATES_HEADER,
  buildGenerationInstructions,
  PROMPT_PREFERENCES_HEADER,
  PROMPT_RESPONSE_FORMAT,
} from '../config/prompt.config.js';

type UserWithTemplates = User & { templates: Template[] };

export function buildSystemPrompt(user: UserWithTemplates): string {
  const templatesSection = user.templates
    .map((t: Template) => `--- ${t.name.toUpperCase()} ---\n${t.content}`)
    .join('\n\n');

  return [
    buildRoleSection(user.name),
    PROMPT_RESTRICTIONS,
    PROMPT_INCOMPLETE_INFO,
    PROMPT_TEMPLATES_HEADER,
    templatesSection,
    buildGenerationInstructions(user.name),
    PROMPT_PREFERENCES_HEADER,
    JSON.stringify(user.preferences, null, 2),
    PROMPT_RESPONSE_FORMAT,
  ].join('\n\n');
}
