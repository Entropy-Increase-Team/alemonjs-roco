export declare const ROUND_WINDOWS: {
    id: number;
    label: string;
    startHour: number;
    endHour: number;
}[];
type RealtimePriceEntry = {
    goods_id: number;
    goods_name: string;
    item_id: number;
    item_num: number;
    buy_limit_num: number;
    price: number;
    origin_price: number;
    round: number;
};
export declare function recordRealtimePrices(entries: RealtimePriceEntry[]): Promise<void>;
export declare function lookupLoggedPrice(goodsId: number, name?: string, round?: number): Promise<{
    goods_id: number;
    name: string;
    price: number;
    origin_price: number;
    buy_limit_num: number;
    round: number;
} | null>;
export declare function fetchRealtimeMerchantInfo(userIdentifier?: string): Promise<Record<string, unknown> | null>;
export declare function fetchRocomMerchantMergedInfo(userIdentifier?: string): Promise<Record<string, unknown>>;
export type RocomMerchantGoodsCard = {
    goodsName: string;
    iconUrl: string;
    price: number;
    limit: number;
    category: 'normal' | 'round' | 'weekend';
    roundId: number;
    isHot: boolean;
    isEnded: boolean;
    remainingStr: string;
    timeLabel: string;
};
export type RocomMerchantTodayRow = {
    roundId: number;
    label: string;
    timeLabel: string;
    isCurrent: boolean;
    items: RocomMerchantGoodsCard[];
};
export type RocomMerchantTodayCardData = {
    title: string;
    subtitle: string;
    dateStr: string;
    totalProducts: number;
    rows: RocomMerchantTodayRow[];
    currentRoundLabel: string;
    currentCountdown: string;
};
export declare function buildRocomMerchantTodayCardData(payload: Record<string, unknown>, now?: Date): RocomMerchantTodayCardData;
export type RocomMerchantRoundCardData = {
    title: string;
    subtitle: string;
    dateStr: string;
    timeRange: string;
    goods: Array<RocomMerchantGoodsCard & {
        num: string;
    }>;
    currentRoundLabel: string;
    countdown: string;
};
export declare function buildRocomMerchantRoundCardData(payload: Record<string, unknown>, now?: Date): RocomMerchantRoundCardData;
export {};
