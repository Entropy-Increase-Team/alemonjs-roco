import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
function parseYamlText(content) {
    const parsed = YAML.parse(content);
    return (parsed ?? {});
}
function resolveYamlFilePath(filePath) {
    if (path.isAbsolute(filePath)) {
        return fs.existsSync(filePath) ? filePath : null;
    }
    const candidates = new Set();
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
function parseSimpleYaml(filePath) {
    const resolved = resolveYamlFilePath(filePath);
    if (!resolved) {
        return {};
    }
    return parseYamlText(fs.readFileSync(resolved, 'utf8'));
}
function parseYamlResource(resource) {
    return parseYamlText(fs.readFileSync(resource, 'utf8'));
}
function parseImportedYamlResource(resource) {
    if (typeof resource === 'string') {
        return parseYamlText(fs.readFileSync(resource, 'utf8'));
    }
    if (resource instanceof URL) {
        return parseYamlResource(resource);
    }
    return (resource ?? {});
}
function deepMerge(base, override) {
    const result = { ...base };
    for (const [key, value] of Object.entries(override)) {
        if (value && typeof value === 'object' && !Array.isArray(value) && result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
            result[key] = deepMerge(result[key], value);
            continue;
        }
        result[key] = value;
    }
    return result;
}

export { deepMerge, parseImportedYamlResource, parseSimpleYaml, parseYamlResource, parseYamlText };
