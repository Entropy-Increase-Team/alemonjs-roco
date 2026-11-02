export declare function requireMaster(): void;
export declare const writeActions: {
    bind_uid: import("alemonjs").ExposeActionMeta<{
        uid: string;
    }, {
        status: "success";
        text: string;
    }>;
    get_egg_exchanges: import("alemonjs").ExposeActionMeta<{
        page?: number;
    }, {
        status: "success";
        data: {
            items: {
                id: string;
                have: string;
                want: string;
                note: string;
                remark: string;
                status: string;
                reviewStatus: string;
                createdAt: string;
            }[];
            page: number;
            totalPages: number;
            total: number;
        };
    }>;
    get_my_egg_exchanges: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        data: {
            items: {
                id: string;
                have: string;
                want: string;
                note: string;
                remark: string;
                status: string;
                reviewStatus: string;
                createdAt: string;
            }[];
        };
    }>;
    post_egg_exchange: import("alemonjs").ExposeActionMeta<{
        have: string;
        want: string;
        remark?: string;
    }, {
        status: "success";
        data: {
            postId: string;
            text: string;
        };
    }>;
    close_egg_exchange: import("alemonjs").ExposeActionMeta<{
        id: string;
    }, {
        status: "success";
        text: string;
    }>;
    get_egg_subscriptions: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        data: {
            subscriptions: {
                id: string;
                filters: {
                    want_text: string;
                    have_text: string;
                    want_note: string;
                    id: string;
                    q: string;
                };
            }[];
        };
    }>;
    subscribe_egg_exchange: import("alemonjs").ExposeActionMeta<{
        want_text?: string;
        have_text?: string;
        want_note?: string;
        id?: string;
        q?: string;
    }, {
        status: "success";
        data: {
            subscriptionId: string;
            text: string;
        };
    }>;
    unsubscribe_egg_exchange: import("alemonjs").ExposeActionMeta<{
        id?: string;
    }, {
        status: string;
        removed: string[];
        failed: string[];
    }>;
    get_wegame_help: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        text: string;
    }>;
    get_modules: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        text: string;
    }>;
    download_module: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        text: string;
    }>;
    update_wegame: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        text: string;
    }>;
    get_config: import("alemonjs").ExposeActionMeta<{
        code?: string;
    }, {
        status: "success";
        text: string;
    }>;
    update_plugin: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        text: string;
    }>;
    force_update_plugin: import("alemonjs").ExposeActionMeta<{
        confirm: boolean;
    }, {
        status: "success";
        text: string;
    }>;
};
