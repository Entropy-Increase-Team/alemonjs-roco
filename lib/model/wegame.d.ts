declare const WEGAME_PREFIX = "#wg";
type WeGameModuleMeta = {
    code: string;
    name: string;
    description: string;
    version: string;
    commandPrefixes: readonly string[];
    commands: readonly string[];
    help: {
        title: string;
        desc: string;
    } | null;
};
export declare function getInstalledWeGameModules(): Array<WeGameModuleMeta & {
    installed: true;
    enabled: true;
}>;
export declare function buildWeGameHelpText(): string;
export declare function buildWeGameCatalogText(): string;
export declare function buildWeGameModuleManagementDisabledText(action: 'download' | 'update'): string;
export { WEGAME_PREFIX };
