import CryptoJS from "crypto-js";

// 加密方法的配置
export type CryptoConfig = {
    // 秘钥
    key: string;
    // 秘钥偏移量
    iv: string;
}

// 加密类
export class Crypto {

    private _key: CryptoJS.lib.WordArray;
    private _iv: CryptoJS.lib.WordArray;

    /**
     * 加密类 秘钥偏移量必须为16位
     * @param key 秘钥
     * @param iv 秘钥偏移量
     */
    constructor(conf: CryptoConfig) {
        this._key = CryptoJS.enc.Utf8.parse(conf.key);  //十六位十六进制数作为密钥
        this._iv = CryptoJS.enc.Utf8.parse(conf.iv);   //十六位十六进制数作为密钥偏移量
    }

    // 解密方法
    Decrypt(text: string) {
        let encryptedHexStr = CryptoJS.enc.Hex.parse(text);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, this._key, { iv: this._iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    }
    // 加密方法
    Encrypt(text: string) {
        let srcs = CryptoJS.enc.Utf8.parse(text);
        let encrypted = CryptoJS.AES.encrypt(srcs, this._key, { iv: this._iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.ciphertext.toString().toUpperCase();
    }
}