type MerchantSubscription = {
    key: string;
    group_id: string;
    bot_id: string;
    mention_all: boolean;
    items: string[];
    last_push_round: string;
    last_matched_items: string[];
    updated_by: string;
    updated_at: string;
};
export declare function parseMerchantSubscriptionArgs(rawText?: string): {
    mentionAll: boolean;
    customItems: string[] | null;
};
export declare function getMerchantSubscriptionCron(): Promise<string>;
export declare function getAllMerchantSubscriptions(): Promise<Record<string, MerchantSubscription>>;
export declare function upsertMerchantSubscription(key: string, payload: Record<string, unknown>): Promise<MerchantSubscription>;
export declare function buildMerchantSubscriptionKey(botId: string, groupId: string): string;
export declare function subscribeRocomMerchant(event: {
    current: Record<string, unknown>;
}, rawArgs?: string): Promise<string>;
export declare function unsubscribeRocomMerchant(event: {
    current: Record<string, unknown>;
}): Promise<string>;
export declare function checkRocomMerchantSubscriptions(): Promise<void>;
export {};
