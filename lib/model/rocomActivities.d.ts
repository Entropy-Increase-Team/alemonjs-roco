export type ActivityItem = {
    id: string;
    name: string;
    desc: string;
    description: string;
    cover: string;
    start_ts: number;
    end_ts: number;
    start: string;
    end: string;
    statusText: string;
    statusClass: 'active' | 'upcoming' | 'ended' | 'permanent';
    is_unlimited: boolean;
    is_perm: boolean;
    rewards: Array<{
        kind: string;
        name: string;
    }>;
    rewards_text: string;
    sort: number;
    time_label: string;
    left_pct: number;
    width_pct: number;
    hide_start: boolean;
    theme: string;
};
export type ActivityCalendarCardData = {
    title: string;
    subtitle: string;
    activity_count: number;
    activities: ActivityItem[];
    lanes: ActivityItem[][];
    axis_dates: Array<{
        label: string;
        left_pct: number;
    }>;
    now_line: {
        label: string;
        left_pct: number;
    } | null;
    empty: boolean;
    commandHint: string;
    copyright: string;
};
export declare function fetchActivitiesInfo(refresh?: boolean, userIdentifier?: string): Promise<Record<string, unknown>>;
export declare function extractActivities(payload?: Record<string, unknown>): ActivityItem[];
export declare function buildActivityCalendarCardData(payload?: Record<string, unknown>): ActivityCalendarCardData;
export declare function buildActivityCalendarText(payload?: Record<string, unknown>): string;
