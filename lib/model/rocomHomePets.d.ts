import { type WeGameContext } from '@src/model/wegameAccount';
export type PetMetaEntry = {
    id?: number;
    name?: string;
    form?: string;
    icon?: string;
    unit_type?: string[];
    feature?: {
        id?: number;
        name?: string;
        desc?: string;
    };
    speciality_id?: number;
    real_speciality_ids?: number[];
    skill_families?: Record<string, string>;
};
export type SkillMetaEntry = {
    cost?: string;
    desc?: string;
    families?: string;
    name?: string;
    power?: string;
};
declare function normalizeTimestampSeconds(value: unknown): number;
declare function formatEggRemaining(targetTime: unknown, now?: number): string;
export declare function getTypeColor(name: string): string;
export declare function getPetMeta(petId: string | number): PetMetaEntry;
export declare function getSkillMeta(skillId: string | number): SkillMetaEntry;
export type RocomHomePetListCard = {
    id: string;
    name: string;
    level: string;
    iconUrl: string;
    fallbackIconUrl: string;
    starIconUrl: string;
    genderText: string;
    weightText: string;
    voiceText: string;
    variantText: string;
    eggReady: boolean;
    eggText: string;
};
export type RocomHomePetsCardData = {
    title: string;
    subtitle: string;
    homeName: string;
    uid: string;
    pets: RocomHomePetListCard[];
    total: number;
    eggCount: number;
    emptyText: string;
    updatedAt: string;
};
export type RocomHomePetDetail = {
    status: string;
    petId: string;
    petGid: string;
    npcId: string;
    name: string;
    defaultName: string;
    level: string;
    genderText: string;
    natureText: string;
    voiceText: string;
    voiceLabel: string;
    bloodText: string;
    bloodColor: string;
    typeTags: Array<{
        name: string;
        color: string;
    }>;
    typeColor: string;
    bloodTag: {
        name: string;
        icon: string;
        color: string;
    } | null;
    iconUrl: string;
    fallbackIconUrl: string;
    variantText: string;
    starIconUrl: string;
    featureIcon: string;
    feature: {
        id: number;
        name: string;
        desc: string;
    } | null;
    attributes: Array<{
        label: string;
        value: number;
        talent: number;
        effort: number;
    }>;
    equipSkills: RocomHomePetSkillCard[];
    learnedSkills: RocomHomePetSkillCard[];
    errorText: string;
};
export type RocomHomePetSkillCard = {
    id: number;
    pos: number;
    name: string;
    cost: string;
    power: string;
    families: string;
    iconUrl: string;
    fallbackIconUrl: string;
    typeColor: string;
};
export type RocomHomePetDetailCardData = {
    title: string;
    subtitle: string;
    uid: string;
    pets: RocomHomePetDetail[];
    emptyText: string;
    updatedAt: string;
};
export declare function buildHomePetsRenderData(payload: Record<string, unknown>, uid: string): RocomHomePetsCardData;
declare function hasPetDetailContent(payload: Record<string, unknown>): boolean;
export declare function getRocomHomePets(context: WeGameContext, rawUid: string, options?: {
    onQueued?: () => void | Promise<void>;
}): Promise<{
    payload: Record<string, unknown>;
    renderData: RocomHomePetsCardData;
}>;
export declare function getRocomHomePetDetail(context: WeGameContext, uid: string, petGid?: number, npcId?: number, options?: {
    onQueued?: () => void | Promise<void>;
}): Promise<{
    payload: Record<string, unknown>;
    renderData: RocomHomePetDetailCardData;
}>;
export { hasPetDetailContent, formatEggRemaining, normalizeTimestampSeconds };
