export declare const queryActions: {
    list_pet_wiki: import("alemonjs").ExposeActionMeta<{
        element?: string;
        page?: number;
    }, {
        status: "success";
        data: {
            total: number;
            page: number;
            pets: {
                id: number;
                name: string;
                avatar: string;
                elements: string[];
                hp: number;
                atk: number;
                mat: number;
                def: number;
                mdf: number;
                spd: number;
                trait: import("../model/types").PetTrait;
                skills: import("../model/types").PetSkill[];
            }[];
        };
    }>;
    get_pets: import("alemonjs").ExposeActionMeta<{
        args?: string;
    }, {
        status: "success";
        text: string;
    }>;
    search_player: import("alemonjs").ExposeActionMeta<{
        uid: string;
    }, {
        status: "success";
        text: string;
    }>;
    get_home_pets: import("alemonjs").ExposeActionMeta<{
        uid?: string;
    }, {
        status: "success";
        data: import("../model/rocomHomePets").RocomHomePetsCardData;
    }>;
    get_home_pet_detail: import("alemonjs").ExposeActionMeta<{
        uid: string;
        petGid?: number;
        npcId?: number;
    }, {
        status: "success";
        data: {
            uid: string;
            updatedAt: string;
            pets: {
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
                bloodText: string;
                variantText: string;
                errorText: string;
                attributes: {
                    label: string;
                    value: number;
                    talent: number;
                    effort: number;
                }[];
                equipSkills: import("../model/rocomHomePets").RocomHomePetSkillCard[];
                learnedSkills: import("../model/rocomHomePets").RocomHomePetSkillCard[];
            }[];
        };
    }>;
    get_lineups: import("alemonjs").ExposeActionMeta<{
        args?: string;
    }, {
        status: "success";
        text: string;
    }>;
    get_lineup_detail: import("alemonjs").ExposeActionMeta<{
        id: string;
    }, {
        status: "success";
        text: string;
    }>;
    parse_lineup: import("alemonjs").ExposeActionMeta<{
        code: string;
    }, {
        status: "success";
        data: import("../model/rocomShareCode").ShareCodeTeam;
    }>;
    query_egg: import("alemonjs").ExposeActionMeta<{
        args: string;
    }, {
        status: "success";
        text: string;
    }>;
    query_breeding: import("alemonjs").ExposeActionMeta<{
        args: string;
    }, {
        status: "success";
        text: string;
    }>;
    query_size: import("alemonjs").ExposeActionMeta<{
        diameter: number;
        weight: number;
    }, {
        status: "success";
        text: string;
    }>;
    get_exchange_hall: import("alemonjs").ExposeActionMeta<{
        args?: string;
    }, {
        status: "success";
        text: string;
    }>;
    get_calendar: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        text: string;
    }>;
    get_activity_image: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        text: string;
    }>;
    get_merchant: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        text: string;
    }>;
    get_merchant_today: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        data: import("../model/rocomMerchantRealtime").RocomMerchantTodayCardData;
    }>;
    get_merchant_catalog: import("alemonjs").ExposeActionMeta<unknown, {
        status: "success";
        data: import("../model/rocomMerchantCatalog").MerchantCatalogItem[];
    }>;
    get_announcements: import("alemonjs").ExposeActionMeta<{
        category?: string;
        page?: number;
    }, {
        status: "success";
        data: {
            items: import("../data/announcement").AnnouncementItem[];
            total: number;
            totalPages: number;
        };
    }>;
    get_announcement_detail: import("alemonjs").ExposeActionMeta<{
        id: number;
    }, {
        status: "success";
        data: import("../data/announcement").AnnouncementDetail;
    }>;
};
