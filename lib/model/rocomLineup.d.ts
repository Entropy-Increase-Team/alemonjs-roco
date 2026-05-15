import { type WeGameContext } from '@src/model/wegameAccount';
type LineupCard = {
    id: string;
    name: string;
    tags: string[];
    pets: Array<{
        name: string;
        imageUrl: string;
    }>;
    authorName: string;
    likes: number;
};
export declare function getRocomLineupList(context: WeGameContext, rawArgs?: string): Promise<{
    category: string;
    pageNo: number;
    totalPages: number;
    lineups: LineupCard[];
}>;
export declare function buildRocomLineupListText(payload: {
    category: string;
    pageNo: number;
    totalPages: number;
    lineups: LineupCard[];
}): string;
export declare function getRocomLineupDetail(context: WeGameContext, rawArgs?: string): Promise<LineupCard>;
export declare function buildRocomLineupDetailText(payload: LineupCard): string;
export {};
