import { CryptoConfig } from "./Crypto";
/**
 * 本地保存的信息通用类
 */
export declare class SystemStorage {
    private crypto;
    /**
     * 创建本地保存信息
     * @param aes aes 加密信息
     */
    constructor(aes: CryptoConfig);
    getItem(key: string): string | null;
    setItem(key: string, str: string): void;
    key: (index: number) => string | null;
    clear: () => void;
    removeItem: (key: string) => void;
    get length(): number;
}
