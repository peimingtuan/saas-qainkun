import { CryptoConfig } from "./Crypto";
import { SystemStorage } from "./Storage";
import Cookies from 'js-cookie'

// 时间的Key
export const TIMER = "TIMER";
// 有效时长
export const KEEP = 3 * 60 * 60 * 1000;
// 用户的Key
export const USER = "USER";
// 管理员的Key
export const PERSAGYADMIN = "PERSAGYADMIN";
// 集团编码
export const GROUPCODE = "groupCode";
// 管理员登录页面标识
export const FBMS = "fbms";
// 管理员页面标识
export const MAINTENANCESYSTEM = "maintenancesystem";
// 功能F
export const FUNCTION = "function";
// 保存路由的键
export const ROUTERCACHE = "routerCache";

export class System {

    /**
     * 存储仓库
     */
    storage: Storage;
    /**
     * 系统存储用户信息
     * @param conf 加密的配置信息
     * @param dev 默认是否是开发环境
     */
    constructor(conf: CryptoConfig, dev = false) {
        this.storage = dev ? window.localStorage : new SystemStorage(conf)
    }

    // 判断当前页面是否是后台管理页面
    isAdmin() {
        return window.location.href.includes(FBMS) || window.location.href.includes(MAINTENANCESYSTEM);
    }

    // 更新的有效时间
    updateTime() {
        this.storage.setItem(TIMER, (new Date().getTime() + KEEP).toString());
        // 获取当前的集团编码
        const groupCode = Cookies.get(GROUPCODE);
        // 重新更新Cookie的有效期
        if (groupCode) {
            Cookies.set(GROUPCODE, groupCode, { expires: 7, path: '/' })
        }
    }

    // 验证是否在有效时间内
    valiteTime() {

        const str = this.storage.getItem(TIMER);
        // 如果不存在直接不通过
        if (str == null) return false;
        // 验证有效时间是否大于当前时间
        return +str > new Date().getTime();
    }

    // 保存用户信息
    saveUser(user: string) {
        try {
            debugger;
            // 获取用户信息
            const item = JSON.parse(user);
            // 获取是否是管理员
            const isAdmin = item.isAdmin === "1";
            // 管理员单用户分别进行存储
            const key = isAdmin ? PERSAGYADMIN : USER;
            // 按照用户信息类型不同分别进行存储
            this.storage.setItem(key, user);

            // 非管理员登录或者没有保存groupCode 的时候才进行存储
            if (!(isAdmin && Cookies.get(GROUPCODE))) {
                // 保存Cookie
                Cookies.set(GROUPCODE, JSON.parse(user).groupCode, { expires: 7, path: '/' })
            }
        } catch (error) {

        }
    }
    // 退出登录
    loginOut() {
        // 获取普通用户信息
        const user = this.storage.getItem(USER);
        // 获取管理员信息
        const admin = this.storage.getItem(PERSAGYADMIN);
        // 当同时存在用户信息和普通信息时根据Url进行处理
        debugger;
        if (user && admin) {
            // 获取当前页面是否是管理员的页面
            const isAdmin = this.isAdmin();
            // 删除对应得用户信息凭证
            localStorage.removeItem(isAdmin ? PERSAGYADMIN : USER);
        } else {
            // 清空所有的信息
            localStorage.clear();
            // 清空Cookie
            Cookies.remove(GROUPCODE, { path: '/' });
        }
    }

    // 获取用户信息
    queryUser() {
        // 获取当前页面是否是管理员的页面
        const isAdmin = this.isAdmin();

        return this.storage.getItem(isAdmin ? PERSAGYADMIN : USER);
    }
}