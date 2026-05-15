import { type WeGameContext } from '@src/model/wegameAccount';
type ExchangePoster = {
    userName: string;
    userLevel: number;
    isOnline: boolean;
    userId: string;
    wantText: string;
    provideItems: string[];
    timeLabel: string;
    isExpired: boolean;
    avatarUrl: string;
};
type ExchangeHallResult = {
    pageNo: number;
    totalPages: number;
    refresh: boolean;
    filterLabel: string;
    commandHint: string;
    posters: ExchangePoster[];
};
export declare function getRocomExchangeHall(context: WeGameContext, rawArgs?: string): Promise<{
    pageNo: number;
    totalPages: number;
    refresh: boolean;
    filterLabel: string;
    commandHint: string;
    posters: ExchangePoster[];
}>;
export declare function buildRocomExchangeText(payload: ExchangeHallResult): string;
export {};
