export type UpdateResult = {
    updated: boolean;
    lines: string[];
};
export declare function updateModule(): Promise<UpdateResult>;
export declare function forceUpdateModule(): Promise<UpdateResult>;
