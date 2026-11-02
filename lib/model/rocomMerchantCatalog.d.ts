export type MerchantCatalogItem = {
    index: number;
    name: string;
    goods_id: number;
    item_id: number;
    item_num: number;
};
export declare function buildMerchantCatalog(randomGoods: unknown[]): MerchantCatalogItem[];
export declare function getMerchantCatalog(options?: {
    refresh?: boolean;
}): Promise<MerchantCatalogItem[]>;
export declare function isAllAlias(token?: string): boolean;
export declare function resolveMerchantSelection(input: string[], catalog: MerchantCatalogItem[]): {
    all: boolean;
    names: string[];
    unknownIndexes: string[];
    unrecognizedNames: string[];
};
export declare function describeMerchantItems(names: string[], catalog: MerchantCatalogItem[]): string;
