import { Crypto, CryptoConfig } from "./Crypto"

/**
 * 本地保存的信息通用类
 */
export class SystemStorage {

    private crypto: Crypto;

    /**
     * 创建本地保存信息
     * @param aes aes 加密信息
     */
    constructor(aes: CryptoConfig) {
        // 如果需要加密则创建对应的加密类
        this.crypto = new Crypto(aes);
    }

    // 获取信息
    getItem(key: string) {
        const str = localStorage.getItem(key);
        return str ? this.crypto.Decrypt(str) : str;
    }

    // 保存信息
    setItem(key: string, str: string) {
        localStorage.setItem(key, typeof str === "string" ? this.crypto.Encrypt(str) : str);
        localStorage.key
    }

    key = localStorage.key;

    clear = localStorage.clear;

    removeItem = localStorage.removeItem

    get length() {
        return localStorage.length;
    }

}