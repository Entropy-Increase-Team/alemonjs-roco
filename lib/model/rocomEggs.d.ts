type PetData = Record<string, unknown>;
export type RocomEggCardData = {
    petName: string;
    petId: string;
    petIcon: string;
    typeLabel: string;
    eggGroups: string[];
    eggGroupsLabel: string;
    maleRate: number | null;
    femaleRate: number | null;
    hatchLabel: string;
    weightLabel: string;
    heightLabel: string;
    totalStats: string;
    totalCompatible: string;
    isUndiscovered: boolean;
    commandHint: string;
    copyright: string;
    sections: Array<{
        id: string;
        label: string;
        count: string;
        members: Array<{
            name: string;
            meta: string;
        }>;
        hasMore: boolean;
        remainCount: string;
    }>;
    eggDetails: null | {
        preciousEggLabel: string;
        baseProbText: string;
        addProbText: string;
        contactAddText: string;
        variantCount: string;
    };
};
export type RocomBreedingPairCardData = {
    mother: {
        name: string;
        typeLabel: string;
        eggGroupsLabel: string;
    };
    father: {
        name: string;
        typeLabel: string;
        eggGroupsLabel: string;
    };
    compatible: boolean;
    reasons: string[];
    sharedEggGroupLabels: string[];
    hatchLabel: string;
    weightLabel: string;
    heightLabel: string;
    commandHint: string;
    copyright: string;
};
export type RocomEggCandidatesCardData = {
    keyword: string;
    count: string;
    candidates: Array<{
        id: string;
        name: string;
        typeLabel: string;
        eggGroupsLabel: string;
        heightLabel: string;
        weightLabel: string;
    }>;
    commandHint: string;
    copyright: string;
};
export type RocomBreedingWantCardData = {
    target: {
        id: string;
        name: string;
        typeLabel: string;
    };
    eggGroupsLabel: string;
    maleRateLabel: string;
    femaleRateLabel: string;
    isUndiscovered: boolean;
    fathers: Array<{
        id: string;
        name: string;
        typeLabel: string;
        eggGroupsLabel: string;
        heightLabel: string;
        weightLabel: string;
    }>;
    commandHint: string;
    copyright: string;
};
export declare function getRocomEggQuery(rawText: string): Promise<{
    mode: "size";
    parsed: {
        name: string;
        height: number | null;
        weight: number | null;
    };
    payload: Record<string, unknown>;
    keyword?: undefined;
    candidates?: undefined;
    matchType?: undefined;
    pet?: undefined;
    compatiblePets?: undefined;
} | {
    mode: "multi";
    keyword: string;
    candidates: PetData[];
    parsed?: undefined;
    payload?: undefined;
    matchType?: undefined;
    pet?: undefined;
    compatiblePets?: undefined;
} | {
    mode: "pet";
    keyword: string;
    matchType: "exact" | "fuzzy";
    pet: PetData;
    compatiblePets: PetData[];
    parsed?: undefined;
    payload?: undefined;
    candidates?: undefined;
}>;
export declare function buildRocomEggCardData(result: {
    pet: PetData;
    compatiblePets: PetData[];
}): RocomEggCardData;
export declare function buildRocomEggCandidatesCardData(keyword: string, candidates: PetData[]): RocomEggCandidatesCardData;
export declare function buildRocomBreedingWantCardData(target: PetData): RocomBreedingWantCardData;
export declare function buildRocomEggQueryText(result: {
    mode: 'size';
    parsed: {
        height: number | null;
        weight: number | null;
    };
    payload: Record<string, unknown>;
} | {
    mode: 'multi';
    keyword: string;
    candidates: PetData[];
} | {
    mode: 'pet';
    keyword: string;
    matchType: 'exact' | 'fuzzy';
    pet: PetData;
    compatiblePets: PetData[];
}): string;
export declare function getRocomBreedingQuery(rawText: string): string;
export declare function getRocomBreedingResult(rawText: string): {
    mode: 'want';
    text: string;
    data: RocomBreedingWantCardData | null;
} | {
    mode: 'pair';
    text: string;
    data: RocomBreedingPairCardData;
};
export {};
