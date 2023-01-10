export declare type CryptoConfig = {
    key: string;
    iv: string;
};
export declare class Crypto {
    private _key;
    private _iv;
    /**
     * 加密类 秘钥偏移量必须为16位
     * @param key 秘钥
     * @param iv 秘钥偏移量
     */
    constructor(conf: CryptoConfig);
    Decrypt(text: string): string;
    Encrypt(text: string): string;
}
