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
export declare function buildWeGameHelpText(): string;
export declare function buildWeGameInstalledModuleHintText(): string;
export declare function getWeGameHelpCardData(): {
    title: string;
    subtitle: string;
    prefixTitle: string;
    prefixText: string;
    footerBrand: string;
    footerNote: string;
    categories: {
        title: string;
        items: {
            title: string;
            desc: string;
            example: string;
        }[];
    }[];
};
export declare function getInstalledWeGameModules(): Array<WeGameModuleMeta & {
    installed: true;
    enabled: true;
}>;
export declare function hasInstalledWeGameModules(): boolean;
export declare function buildWeGameCatalogText(): string;
export declare function buildWeGameModuleManagementDisabledText(action: 'download' | 'update'): string;
export { WEGAME_PREFIX };
