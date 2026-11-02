export declare const subscriptionActions: {
    subscribe_merchant: import("alemonjs").ExposeActionMeta<{
        items?: string[];
        mentionAll?: boolean;
    }, import("../model/rocomMerchantSubscription").MerchantSubscribeResult>;
    unsubscribe_merchant: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        text: string;
    }>;
    get_home_status: import("alemonjs").ExposeActionMeta<{
        uid: string;
    }, {
        status: "success";
        text: string;
    }>;
    get_home_subscriptions: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        data: {
            subscriptions: {
                target_type: string;
                bot_id: string;
                group_id: string;
                user_id: string;
                target_uid: string;
                last_push_time: string;
                last_check_time: string;
                updated_at: string;
                mention_all: boolean;
                last_egg_count: number;
                last_pushed_egg_count: number;
            }[];
        };
    }>;
    subscribe_home: import("alemonjs").ExposeActionMeta<{
        uid: string;
        mentionAll?: boolean;
    }, {
        status: "success";
        text: string;
    }>;
    unsubscribe_home: import("alemonjs").ExposeActionMeta<{
        uid?: string;
    }, {
        status: "success";
        text: string;
    }>;
};
