import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

export function parseYamlText<T = unknown>(content: string): T {
  const parsed = YAML.parse(content);

  return (parsed ?? {}) as T;
}

function resolveYamlFilePath(filePath: string): string | null {
  if (path.isAbsolute(filePath)) {
    return fs.existsSync(filePath) ? filePath : null;
  }

  const candidates = new Set<string>();
  const cwdDir = process.cwd();

  candidates.add(path.resolve(cwdDir, filePath));

  let current = moduleDir;

  for (let index = 0; index < 6; index += 1) {
    candidates.add(path.resolve(current, filePath));
    const parent = path.dirname(current);

    if (parent === current) {
      break;
    }

    current = parent;
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function parseSimpleYaml(filePath: string): Record<string, unknown> {
  const resolved = resolveYamlFilePath(filePath);

  if (!resolved) {
    return {};
  }

  return parseYamlText<Record<string, unknown>>(fs.readFileSync(resolved, 'utf8'));
}

export function parseYamlResource<T = unknown>(resource: URL): T {
  return parseYamlText<T>(fs.readFileSync(resource, 'utf8'));
}

export function parseImportedYamlResource<T = unknown>(resource: unknown): T {
  if (typeof resource === 'string') {
    return parseYamlText<T>(fs.readFileSync(resource, 'utf8'));
  }

  if (resource instanceof URL) {
    return parseYamlResource<T>(resource);
  }

  return (resource ?? {}) as T;
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
