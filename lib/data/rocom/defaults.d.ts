export declare const rocomDefaultConfigData: Record<string, unknown>;
export declare const rocomModuleMeta: {
    readonly code: "rocom";
    readonly name: "洛克";
    readonly description: "洛克业务模块，提供档案、家园、战绩、阵容、交换大厅、查蛋与远行商人订阅能力。";
    readonly version: "0.2.1";
    readonly apiDoc: "modules/rocom/Rocom-API.md";
    readonly commandPrefixes: string[];
    readonly commands: readonly ["#洛克帮助", "#洛克账号列表", "#洛克档案", "#洛克uid", "#洛克绑定UID", "#洛克家园", "#洛克刷新家园", "#洛克家园精灵", "#洛克家园详情", "#洛克家园状态", "#洛克订阅家园", "#洛克取消订阅家园", "#洛克我的家园订阅", "#洛克战绩", "#洛克精灵列表", "#洛克阵容", "#洛克查看阵容", "#洛克阵容解析", "#洛克交换大厅", "#洛克尺寸查询", "#洛克远行商人", "#洛克今日远行商人", "#洛克商人商品", "#洛克订阅远行商人", "#洛克取消订阅远行商人", "#洛克换蛋广场", "#洛克发布换蛋帖", "#洛克我的换蛋帖", "#洛克关闭换蛋帖", "#洛克订阅换蛋", "#洛克取消换蛋订阅", "#洛克日历", "#洛克查蛋", "#洛克配种", "#洛克更新", "#洛克强制更新"];
    readonly help: {
        readonly title: "#洛克帮助";
        readonly desc: "查看洛克帮助；也可使用 +帮助";
    };
    readonly config: {
        readonly storeKey: string;
    };
};
export declare const rocomHelpDefaultGroups: {
    groupTitle: string;
    menuItems: {
        cmd: string;
        desc: string;
    }[];
}[];
