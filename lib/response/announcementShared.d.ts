import { Format } from 'alemonjs';
export declare function parseAnnouncementArgs(suffix: string): {
    tab: string;
    idx: number;
};
export declare function buildAnnouncementListFormat(tab: string): Promise<Format>;
export declare function buildAnnouncementDetailFormat(tab: string, idx: number): Promise<Format>;
