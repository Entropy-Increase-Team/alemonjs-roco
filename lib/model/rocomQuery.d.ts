type RocomSearchRow = {
    field: string;
    label: string;
    value: string;
};
export declare function getRocomProfile(event: {
    current: {
        Platform?: string;
        BotId?: string;
        UserId?: string;
    };
}): Promise<{
    role: Record<string, unknown> | {
        id?: string;
        openid?: string;
        name?: string;
        avatar?: string;
        create_time?: string;
        is_online?: boolean;
        level?: number;
        star?: number;
    };
    evaluation: Record<string, unknown>;
    collection: Record<string, unknown>;
    battleOverview: Record<string, unknown>;
}>;
export declare function buildRocomProfileText(payload: {
    role: Record<string, unknown>;
    evaluation: Record<string, unknown>;
    collection: Record<string, unknown>;
    battleOverview: Record<string, unknown>;
}): string;
export declare function searchRocomPlayer(event: {
    current: {
        Platform?: string;
        BotId?: string;
        UserId?: string;
        MessageText?: string;
    };
}): Promise<{
    uid: string;
    rows: RocomSearchRow[];
}>;
export declare function buildRocomSearchText(uid: string, rows: RocomSearchRow[]): string;
export {};
