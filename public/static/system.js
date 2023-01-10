var systemConfig = {
    // 系统名称
    systemTitle: '印力能源平台',
    // 运维系统名称
    maintenanceSystemTitle: "运维管理平台",
    // 是否显示登录的背景图片
    showBackground: false,
    // loginImg: "", // 登录的背景图片
    // 开启微应用的服务
    microAppIds: [
        "webmeterservice", // 人工填报
        "indicesmanagement", // 指标管理
        "draw", // 看板工具
        "businessintelligence", //BI工具
        "sopweb", // SOP
        "globalalarm", // 全局报警
        "workorderweb", // 工单
        "equipmentspaceweb", // 设备管理
        "rundiagnosis", // 设备维保
        "energycarbon", // 碳管理
        "chargeanagement", //租户能源收费
        "energyefficiency", // 能效分析
        "maintenancesystem", // 运维系统
    ],
    // 需要隐藏头部的功能FID
    hideHeader: [
        "haliaeetusjtcockpithomedark",
        "haliaeetusdqcockpithomedark",
        "haliaeetuscscockpithomedark",
        "haliaeetuspjcockpithomedark",
    ]
}
