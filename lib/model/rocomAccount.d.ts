import { type WeGameContext } from '@src/model/wegameAccount';
type RocomAccount = {
    id: string;
    bindingId: string;
    bindingIndex: number;
    loginType: string;
    tgpId: string;
    isPrimary: boolean;
    isValid: boolean;
    updatedAt: string;
    roleId: string;
    roleName: string;
    level: unknown;
    starName: string;
    enrollDays: unknown;
    isOnline: unknown;
};
type RocomAccountCardBadge = {
    text: string;
    type: 'primary' | 'valid' | 'invalid' | 'online' | 'offline';
};
export type RocomAccountCardItem = {
    index: number;
    bindingIndex: string;
    nickname: string;
    roleId: string;
    tgpId: string;
    loginType: string;
    levelText: string;
    starName: string;
    updatedAt: string;
    statusText: string;
    isPrimary: boolean;
    badges: RocomAccountCardBadge[];
};
export type RocomAccountsCardData = {
    title: string;
    subtitle: string;
    bindings: RocomAccountCardItem[];
    emptyText: string;
    tip: string;
    copyright: string;
};
export declare function getRocomAccounts(context: WeGameContext): Promise<{
    accounts: RocomAccount[];
    bindingsTotal: number;
    activeBinding: import("@src/model/wegameAccount").WeGameBinding | null;
}>;
export declare function buildRocomAccountsCardData(accounts: RocomAccount[], bindingsTotal: number): RocomAccountsCardData;
export declare function buildRocomAccountsText(accounts: RocomAccount[], bindingsTotal: number): string;
export {};
