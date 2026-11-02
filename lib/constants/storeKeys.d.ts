export type StoreKeyFormat = 'json' | 'yaml';
export declare function buildDataStoreKey(format: StoreKeyFormat, ...segments: string[]): string;
export declare function getStoreKeyFormat(key: string): StoreKeyFormat;
export declare const storeKeys: {
    readonly config: {
        readonly wegameCore: string;
        readonly rocom: string;
    };
    readonly wegame: {
        readonly users: string;
    };
    readonly rocom: {
        readonly merchantSubscriptions: string;
        readonly merchantCatalog: string;
        readonly merchantPriceLog: string;
        readonly eggSubscriptions: string;
        readonly eggExchangeSubscriptions: string;
        readonly bindUid: string;
    };
};
