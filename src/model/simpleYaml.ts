import fs from 'node:fs';
import YAML from 'yaml';

export function parseYamlText<T = unknown>(content: string): T {
  const parsed = YAML.parse(content);

  return (parsed ?? {}) as T;
}

export function parseSimpleYaml(filePath: string): Record<string, unknown> {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return parseYamlText<Record<string, unknown>>(fs.readFileSync(filePath, 'utf8'));
}

export function parseYamlResource<T = unknown>(resource: URL): T {
  return parseYamlText<T>(fs.readFileSync(resource, 'utf8'));
}

export function deepMerge<T extends Record<string, unknown>>(base: T, override: Record<string, unknown>): T {
  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, value as Record<string, unknown>);
      continue;
    }

    result[key] = value;
  }

  return result as T;
}
