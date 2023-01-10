"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemStorage = void 0;
const Crypto_1 = require("./Crypto");
/**
 * 本地保存的信息通用类
 */
class SystemStorage {
    /**
     * 创建本地保存信息
     * @param aes aes 加密信息
     */
    constructor(aes) {
        this.key = localStorage.key;
        this.clear = localStorage.clear;
        this.removeItem = localStorage.removeItem;
        // 如果需要加密则创建对应的加密类
        this.crypto = new Crypto_1.Crypto(aes);
    }
    // 获取信息
    getItem(key) {
        const str = localStorage.getItem(key);
        return str ? this.crypto.Decrypt(str) : str;
    }
    // 保存信息
    setItem(key, str) {
        localStorage.setItem(key, typeof str === "string" ? this.crypto.Encrypt(str) : str);
        localStorage.key;
    }
    get length() {
        return localStorage.length;
    }
}
exports.SystemStorage = SystemStorage;
