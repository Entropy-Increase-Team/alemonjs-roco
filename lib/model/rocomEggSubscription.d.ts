export declare const TARGET_GROUP = "group";
export declare const TARGET_PRIVATE = "private";
export type EggSubscription = {
    key: string;
    target_type: string;
    bot_id: string;
    group_id: string;
    user_id: string;
    target_uid: string;
    mention_all: boolean;
    last_egg_count: number;
    last_pushed_egg_count: number;
    last_push_time: string;
    last_check_time: string;
    updated_by: string;
    updated_at: string;
};
export declare function buildEggSubscriptionKey(botId: string, targetId: string, targetType: string, uid: string): string;
export declare function upsertEggSubscription(key: string, payload: Record<string, unknown>): Promise<EggSubscription>;
export declare function deleteEggSubscription(key: string): Promise<boolean>;
export declare function getEggSubscriptionsByTarget(botId: string, targetId: string, targetType: string): Promise<EggSubscription[]>;
export declare function getAllEggSubscriptions(): Promise<Record<string, EggSubscription>>;
export declare function batchUpdateEggSubscriptions(updates: Array<{
    key: string;
} & Partial<Omit<EggSubscription, 'key'>>>): Promise<void>;
export declare function isMentionAllToken(token: string): boolean;
export type EggStatusPet = {
    petId: string;
    name: string;
    ready: boolean;
    remaining: string;
    predictedEggTime: number;
};
export type EggStatus = {
    readyCount: number;
    totalEggs: number;
    pets: EggStatusPet[];
};
export declare function extractEggStatus(payload?: Record<string, unknown>): EggStatus;
export declare function fetchHomeEggs(uid: string, userIdentifier?: string, options?: {
    onQueued?: () => void | Promise<void>;
}): Promise<Record<string, unknown>>;
export declare function queryRocomEggStatus(uid: string, userIdentifier?: string, options?: {
    onQueued?: () => void | Promise<void>;
}): Promise<string>;
export declare function checkRocomEggSubscriptions(): Promise<void>;
export declare function getEggSubscriptionCron(): Promise<string>;
