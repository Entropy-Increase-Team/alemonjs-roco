type RocomSearchRow = {
    field: string;
    label: string;
    value: string;
};
export type RocomProfileCardData = {
    userName: string;
    userLevel: string;
    userUid: string;
    userAvatar: string;
    enrollDays: string;
    starName: string;
    hasAiProfileData: boolean;
    summaryTitleParts: string[];
    bestPetName: string;
    bestPetImage: string;
    scoreText: string;
    aiCommentText: string;
    currentCollectionCount: string;
    totalCollectionCount: string;
    amazingSpriteCount: string;
    shinySpriteCount: string;
    colorfulSpriteCount: string;
    fashionCollectionCount: string;
    itemCount: string;
    collectionHint: string;
    hasBattleData: boolean;
    tierBadgeUrl: string;
    totalMatch: string;
    totalWin: string;
    winRate: string;
    matchResult: 'win' | 'fail';
    leftTeamPets: Array<{
        name: string;
        icon: string;
    }>;
    rightTeamPets: Array<{
        name: string;
        icon: string;
    }>;
    opponentName: string;
    opponentAvatar: string;
    radarPolygons: string[];
    radarAreaPoints: string;
    radarDots: Array<{
        x: number;
        y: number;
        value: number;
        key: string;
    }>;
    radarValueBadges: Array<{
        value: string;
        x: number;
        y: number;
        width: number;
    }>;
    radarAxisLabels: Array<{
        name: string;
        x: number;
        y: number;
        anchor: string;
    }>;
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
    petSummary: Record<string, unknown>;
    collection: Record<string, unknown>;
    battleOverview: Record<string, unknown>;
    battleList: Record<string, unknown>;
}>;
export declare function buildRocomProfileText(payload: {
    role: Record<string, unknown>;
    evaluation: Record<string, unknown>;
    petSummary?: Record<string, unknown>;
    collection: Record<string, unknown>;
    battleOverview: Record<string, unknown>;
    battleList?: Record<string, unknown>;
}): string;
export declare function buildRocomProfileCardData(payload: {
    role: Record<string, unknown>;
    evaluation: Record<string, unknown>;
    petSummary?: Record<string, unknown>;
    collection: Record<string, unknown>;
    battleOverview: Record<string, unknown>;
    battleList?: Record<string, unknown>;
}): RocomProfileCardData;
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
