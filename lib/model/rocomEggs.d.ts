type PetData = Record<string, unknown>;
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
export {};
