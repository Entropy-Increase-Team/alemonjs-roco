import { type WeGameContext } from '@src/model/wegameAccount';
type PetListItem = {
    name: string;
    level: string;
    types: string;
    rarity: string;
    imageUrl: string;
};
export declare function getRocomPetList(context: WeGameContext, rawArgs?: string): Promise<{
    currentTab: string;
    userName: string;
    userLevel: string;
    userUid: string;
    accountLabel: string;
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    pets: PetListItem[];
}>;
export declare function buildRocomPetListText(payload: {
    currentTab: string;
    userName: string;
    userLevel: string;
    userUid: string;
    totalCount: number;
    currentPage: number;
    totalPages: number;
    accountLabel: string;
    pageSize: number;
    pets: PetListItem[];
}): string;
export {};
