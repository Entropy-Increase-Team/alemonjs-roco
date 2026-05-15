type MerchantProduct = {
    name: string;
    image: string;
    timeLabel: string;
    type: string;
};
export type RocomMerchantCardData = {
    title: string;
    subtitle: string;
    productCount: number;
    roundLabel: string;
    countdown: string;
    products: Array<{
        name: string;
        image: string;
        timeLabel: string;
        type: string;
        slotLabel: string;
    }>;
};
type MerchantRound = {
    date: string;
    current: number | null;
    total: number;
    roundId: string;
    isOpen: boolean;
    countdown: string;
    startTime: Date | null;
    endTime: Date | null;
};
export declare function getCurrentMerchantRound(now?: Date): MerchantRound;
export declare function normalizeMerchantActivities(payload?: Record<string, unknown>): {
    merchantActivities: Record<string, unknown>[];
    otherActivities: Record<string, unknown>[];
};
export declare function formatMerchantWindow(item?: Record<string, unknown>): string;
export declare function extractMerchantProducts(payload?: Record<string, unknown>, options?: {
    nowMs?: number;
    fallbackImage?: string;
}): {
    activity: Record<string, unknown>;
    merchantActivities: Record<string, unknown>[];
    otherActivities: Record<string, unknown>[];
    products: MerchantProduct[];
};
export declare function fetchRocomMerchantInfo(refresh?: boolean): Promise<Record<string, unknown>>;
export declare function buildRocomMerchantText(payload: Record<string, unknown>, now?: Date): string;
export declare function buildRocomMerchantCardData(payload: Record<string, unknown>, now?: Date): RocomMerchantCardData;
export {};
