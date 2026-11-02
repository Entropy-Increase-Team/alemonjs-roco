export declare const accountActions: {
    get_bindings: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        data: {
            bindings: {
                id: string;
                name: string;
                loginType: string;
                roleId: string;
                isPrimary: boolean;
                isValid: boolean;
            }[];
        };
    }>;
    start_login: import("alemonjs").ExposeActionMeta<{
        platform: "qq" | "wechat";
    }, {
        status: "success";
        data: {
            sessionId: string;
            platform: string;
            qrImage: string;
            state: string;
            expiresAt: number;
            message: string;
        };
    }>;
    get_login_session: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        data: {
            sessionId: string;
            platform: string;
            qrImage: string;
            state: string;
            expiresAt: number;
            message: string;
        };
    }>;
    cancel_login: import("alemonjs").ExposeActionMeta<{
        sessionId: string;
    }, {
        status: "success";
        data: {
            sessionId: string;
            platform: string;
            qrImage: string;
            state: string;
            expiresAt: number;
            message: string;
        };
    }>;
    wait_login: import("alemonjs").ExposeActionMeta<{
        sessionId: string;
    }, {
        status: "success";
        data: {
            sessionId: string;
            platform: string;
            qrImage: string;
            state: string;
            expiresAt: number;
            message: string;
        };
    }>;
    switch_binding: import("alemonjs").ExposeActionMeta<{
        bindingId: string;
    }, {
        status: string;
        data: {
            bindingId: string;
            changed: boolean;
            synced: boolean;
        };
    }>;
    delete_binding: import("alemonjs").ExposeActionMeta<{
        bindingId: string;
    }, {
        status: string;
        data: {
            bindingId: string;
            outcome: "absent";
            synced: boolean;
        };
    } | {
        status: string;
        data: {
            bindingId: string;
            outcome: "deleted";
            synced: boolean;
        };
    }>;
};
