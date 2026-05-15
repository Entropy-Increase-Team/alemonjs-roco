export declare function parseYamlText<T = unknown>(content: string): T;
export declare function parseSimpleYaml(filePath: string): Record<string, unknown>;
export declare function parseYamlResource<T = unknown>(resource: URL): T;
export declare function deepMerge<T extends Record<string, unknown>>(base: T, override: Record<string, unknown>): T;
