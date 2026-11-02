export type EggExchangePost = Record<string, unknown>;
export declare function fetchEggExchanges(pageNo: number, userIdentifier?: string): Promise<Record<string, unknown>>;
export declare function postEggExchange(data: {
    have_text: string;
    want_text: string;
    remark?: string;
}, userIdentifier?: string): Promise<Record<string, unknown>>;
export declare function fetchMyEggExchanges(userIdentifier?: string): Promise<Record<string, unknown>>;
export declare function closeEggExchange(postId: string, userIdentifier?: string): Promise<Record<string, unknown>>;
export declare function createEggExchangeSubscription(filters: Record<string, string>, userIdentifier?: string): Promise<Record<string, unknown>>;
export declare function fetchEggExchangeSubscriptions(userIdentifier?: string): Promise<Record<string, unknown>>;
export declare function deleteEggExchangeSubscription(subscriptionId: string, userIdentifier?: string): Promise<Record<string, unknown>>;
export declare function buildExchangeListText(items: EggExchangePost[], pageInfo: {
    page_no: number;
    total_pages: number;
    total: number;
}): string;
export declare function buildMyPostsText(items: EggExchangePost[]): string;
export declare function parseSubscribeFilters(raw?: string): Record<string, string>;
export declare function parseExchangePageArg(raw: string): number;
