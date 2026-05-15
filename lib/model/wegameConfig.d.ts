type ConfigField = {
    field: string;
    label: string;
    help: string;
};
type ConfigSection = {
    code: string;
    title: string;
    source: string;
    fields: ConfigField[];
    values: Record<string, unknown>;
};
export declare function getWeGameConfigRegistry(): ConfigSection[];
export declare function buildWeGameConfigSummary(code?: string): Promise<string>;
export declare function buildWeGameConfigRegistryText(): string;
export {};
