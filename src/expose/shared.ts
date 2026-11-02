import { Expose, ExposeError, getConfigValue, getCurrentEvent, type ExposeCallContext, type ExposeValueSchema } from 'alemonjs';
import { getWeGameUserContext, type WeGameContext } from '../model/wegameAccount';
export function currentUser(context: ExposeCallContext): WeGameContext {
  const root = getConfigValue<Record<string, { expose?: { enabled?: boolean; allowed_callers?: string[] } }>>();
  const config = root['alemonjs-roco']?.expose;
  const allowed = config?.allowed_callers;
  const event = getCurrentEvent();

  if (
    (config !== undefined && (!config || typeof config !== 'object' || Array.isArray(config))) ||
    (config?.enabled !== undefined && config.enabled !== true) ||
    (allowed !== undefined && (!Array.isArray(allowed) || !allowed.every(item => typeof item === 'string' && item.length > 0 && item.trim() === item))) ||
    !context.callerApp ||
    (allowed !== undefined && !allowed.includes(context.callerApp)) ||
    !event ||
    !['message.create', 'private.message.create'].includes(event.name) ||
    ![event.Platform, event.BotId, event.UserId].every(value => typeof value === 'string' && value.trim().length > 0)
  ) {
    throw new ExposeError('FORBIDDEN', '当前调用方或消息身份未获洛克查询授权');
  }
  context.signal.throwIfAborted();

  return getWeGameUserContext({ current: event });
}

export const emptyInput = { type: 'object', properties: {}, additionalProperties: false } as const;
export const keywordInput = {
  type: 'object',
  properties: { keyword: { type: 'string', minLength: 1, maxLength: 100 } },
  required: ['keyword'],
  additionalProperties: false
} as const;

export function action<Input, Output>(
  description: string,
  inputSchema: ExposeValueSchema,
  outputSchema: ExposeValueSchema,
  handler: (input: Input, user: WeGameContext, context: ExposeCallContext) => Promise<Output> | Output,
  effect: 'read' | 'write' = 'read'
) {
  return Expose.action<Input, Output>({
    description,
    effect,
    inputSchema,
    outputSchema,
    authorize: (_input, context) => {
      currentUser(context);

      return true;
    },
    handler: (input, context) => handler(input, currentUser(context), context)
  });
}

export function query<Input>(
  description: string,
  inputSchema: ExposeValueSchema,
  handler: (input: Input, user: WeGameContext) => Promise<string> | string,
  effect: 'read' | 'write' = 'read'
) {
  return action(
    description,
    inputSchema,
    object({ status: { type: 'string', enum: ['success'] }, text: { type: 'string' } }, ['status', 'text']),
    async (input: Input, user) => ({ status: 'success' as const, text: await handler(input, user) }),
    effect
  );
}

export function dataQuery<Input, Output>(
  description: string,
  inputSchema: ExposeValueSchema,
  dataSchema: ExposeValueSchema,
  handler: (input: Input, user: WeGameContext, context: ExposeCallContext) => Promise<Output> | Output,
  effect: 'read' | 'write' = 'read'
) {
  return action(
    description,
    inputSchema,
    object({ status: { type: 'string', enum: ['success'] }, data: dataSchema }, ['status', 'data']),
    async (input: Input, user, context) => ({ status: 'success' as const, data: await handler(input, user, context) }),
    effect
  );
}

export function object(properties: Record<string, ExposeValueSchema>, required: string[] = []): ExposeValueSchema {
  return { type: 'object', properties, required, additionalProperties: false };
}
export const text = { type: 'string', minLength: 1, maxLength: 2000 } as const;
export const page = { type: 'integer', minimum: 1, maximum: 50 } as const;
export function uid(value: string): string {
  if (!/^\d+$/u.test(value)) {
    throw new ExposeError('INVALID_INPUT', 'UID 必须为纯数字');
  }

  return value;
}

export const stringSchema = { type: 'string' } as const;
export const numberSchema = { type: 'number' } as const;
export const booleanSchema = { type: 'boolean' } as const;
export function array(items: ExposeValueSchema): ExposeValueSchema {
  return { type: 'array', items };
}
export function record(properties: Record<string, ExposeValueSchema>): ExposeValueSchema {
  return object(properties, Object.keys(properties));
}
export function strings(...keys: string[]): Record<string, ExposeValueSchema> {
  return Object.fromEntries(keys.map(key => [key, stringSchema]));
}
