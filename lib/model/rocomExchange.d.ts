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
export declare function getRocomExchangeHall(event: {
    current: {
        Platform?: string;
        BotId?: string;
        UserId?: string;
        MessageText?: string;
    };
}): Promise<{
    pageNo: number;
    totalPages: number;
    refresh: boolean;
    posters: ExchangePoster[];
}>;
export declare function buildRocomExchangeText(payload: {
    pageNo: number;
    totalPages: number;
    refresh: boolean;
    posters: ExchangePoster[];
}): string;
export {};
