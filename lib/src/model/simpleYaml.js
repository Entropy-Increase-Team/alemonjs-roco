import fs from 'node:fs';
import YAML from 'yaml';

function parseYamlText(content) {
    const parsed = YAML.parse(content);
    return (parsed ?? {});
}
function parseSimpleYaml(filePath) {
    if (!fs.existsSync(filePath)) {
        return {};
    }
    return parseYamlText(fs.readFileSync(filePath, 'utf8'));
}
function parseYamlResource(resource) {
    return parseYamlText(fs.readFileSync(resource, 'utf8'));
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

export { deepMerge, parseSimpleYaml, parseYamlResource, parseYamlText };
