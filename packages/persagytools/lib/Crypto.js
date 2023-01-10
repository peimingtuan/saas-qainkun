"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
// 加密类
class Crypto {
    /**
     * 加密类 秘钥偏移量必须为16位
     * @param key 秘钥
     * @param iv 秘钥偏移量
     */
    constructor(conf) {
        this._key = crypto_js_1.default.enc.Utf8.parse(conf.key); //十六位十六进制数作为密钥
        this._iv = crypto_js_1.default.enc.Utf8.parse(conf.iv); //十六位十六进制数作为密钥偏移量
    }
    // 解密方法
    Decrypt(text) {
        let encryptedHexStr = crypto_js_1.default.enc.Hex.parse(text);
        let srcs = crypto_js_1.default.enc.Base64.stringify(encryptedHexStr);
        let decrypt = crypto_js_1.default.AES.decrypt(srcs, this._key, { iv: this._iv, mode: crypto_js_1.default.mode.CBC, padding: crypto_js_1.default.pad.Pkcs7 });
        let decryptedStr = decrypt.toString(crypto_js_1.default.enc.Utf8);
        return decryptedStr.toString();
    }
    // 加密方法
    Encrypt(text) {
        let srcs = crypto_js_1.default.enc.Utf8.parse(text);
        let encrypted = crypto_js_1.default.AES.encrypt(srcs, this._key, { iv: this._iv, mode: crypto_js_1.default.mode.CBC, padding: crypto_js_1.default.pad.Pkcs7 });
        return encrypted.ciphertext.toString().toUpperCase();
    }
}
exports.Crypto = Crypto;
