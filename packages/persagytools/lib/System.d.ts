import { CryptoConfig } from "./Crypto";
export declare const TIMER = "TIMER";
export declare const KEEP: number;
export declare const USER = "USER";
export declare const PERSAGYADMIN = "PERSAGYADMIN";
export declare const GROUPCODE = "groupCode";
export declare const FBMS = "fbms";
export declare const MAINTENANCESYSTEM = "maintenancesystem";
export declare const FUNCTION = "function";
export declare const ROUTERCACHE = "routerCache";
export declare class System {
    /**
     * 存储仓库
     */
    storage: Storage;
    /**
     * 系统存储用户信息
     * @param conf 加密的配置信息
     * @param dev 默认是否是开发环境
     */
    constructor(conf: CryptoConfig, dev?: boolean);
    isAdmin(): boolean;
    updateTime(): void;
    valiteTime(): boolean;
    saveUser(user: string): void;
    loginOut(): void;
    queryUser(): string | null;
}
