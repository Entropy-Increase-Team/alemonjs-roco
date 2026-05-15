type WeGameConfig = {
    base_url: string;
    api_key: string;
    client_type: string;
    client_id: string;
    device_fingerprint: string;
    request_timeout_ms: number;
    login_poll_interval_ms: number;
    login_timeout_ms: number;
};
type WeGameCredential = {
    frameworkToken: string;
    isValid: boolean;
    isBind: boolean;
    updatedAt: string;
    credentialProvider?: string;
    tgpId?: string;
    loginType?: string;
    role?: {
        id?: string;
        openid?: string;
        name?: string;
        avatar?: string;
        create_time?: string;
        is_online?: boolean;
        level?: number;
        star?: number;
    } | null;
};
export type WeGameBinding = {
    id: string;
    frameworkToken: string;
    tokenType: string;
    loginType: string;
    credentialProvider: string;
    clientType: string;
    tgpId: string;
    roleId: string;
    roleOpenid: string;
    nickname: string;
    avatar: string;
    isPrimary: boolean;
    isValid: boolean;
    createdAt: string;
    updatedAt: string;
};
type WeGameBindingCardBadge = {
    text: string;
    type: 'primary' | 'valid' | 'invalid';
};
export type WeGameBindingCardItem = {
    index: number;
    total: number;
    nickname: string;
    statusText: string;
    loginType: string;
    tgpId: string;
    updatedAt: string;
    roleId: string;
    isPrimary: boolean;
    badges: WeGameBindingCardBadge[];
};
export type WeGameBindingListCardData = {
    title: string;
    subtitle: string;
    bindings: WeGameBindingCardItem[];
    emptyText: string;
    tip: string;
    copyright: string;
};
export type WeGameContext = {
    userKey: string;
    userIdentifier: string;
};
export declare function getWeGameUserContext(event: {
    current: {
        Platform?: string;
        BotId?: string;
        UserId?: string;
    };
}): WeGameContext;
export declare function getWeGameRuntimeConfig(): Promise<WeGameConfig>;
export declare function requestWeGame<T>(urlPath: string, options?: {
    method?: string;
    params?: Record<string, string>;
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
}): Promise<T>;
export declare function createWeGameLogin(userIdentifier: string, platform: 'qq' | 'wechat'): Promise<{
    frameworkToken?: string;
    qr_image?: string;
    expire?: string | number;
}>;
export declare function waitWeGameLogin(userIdentifier: string, userKey: string, platform: 'qq' | 'wechat', frameworkToken: string, options?: {
    onStatusChange?: (status: string) => void | Promise<void>;
}): Promise<WeGameCredential>;
export declare function getWeGameBindings(userIdentifier: string): Promise<WeGameBinding[]>;
export declare function pickActiveBinding(bindings: WeGameBinding[]): WeGameBinding | null;
export declare function syncWeGameBindings(context: WeGameContext): Promise<WeGameBinding[]>;
export declare function setPrimaryWeGameBinding(userIdentifier: string, bindingId: string): Promise<void>;
export declare function deleteWeGameBinding(userIdentifier: string, bindingId: string): Promise<void>;
export declare function formatLoginType(loginType: string): string;
export declare function getBindingName(binding: WeGameBinding): string;
export declare function formatBindingTime(value: string): string;
export declare function buildBindingsText(bindings: WeGameBinding[]): string;
export declare function buildWeGameBindingListCardData(bindings: WeGameBinding[]): WeGameBindingListCardData;
export declare function getSavedCredential(userKey: string): Promise<WeGameCredential | null>;
export declare function buildWeGameLoginSuccessText(binding: WeGameBinding | null, credential: WeGameCredential | null): string;
export declare function resolveActiveWeGameCredential(context: WeGameContext): Promise<{
    credential: WeGameCredential | null;
    binding: WeGameBinding | null;
}>;
export {};
