"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = exports.ROUTERCACHE = exports.FUNCTION = exports.MAINTENANCESYSTEM = exports.FBMS = exports.GROUPCODE = exports.PERSAGYADMIN = exports.USER = exports.KEEP = exports.TIMER = void 0;
const Storage_1 = require("./Storage");
const js_cookie_1 = __importDefault(require("js-cookie"));
// 时间的Key
exports.TIMER = "TIMER";
// 有效时长
exports.KEEP = 3 * 60 * 60 * 1000;
// 用户的Key
exports.USER = "USER";
// 管理员的Key
exports.PERSAGYADMIN = "PERSAGYADMIN";
// 集团编码
exports.GROUPCODE = "groupCode";
// 管理员登录页面标识
exports.FBMS = "fbms";
// 管理员页面标识
exports.MAINTENANCESYSTEM = "maintenancesystem";
// 功能F
exports.FUNCTION = "function";
// 保存路由的键
exports.ROUTERCACHE = "routerCache";
class System {
    /**
     * 系统存储用户信息
     * @param conf 加密的配置信息
     * @param dev 默认是否是开发环境
     */
    constructor(conf, dev = false) {
        this.storage = dev ? window.localStorage : new Storage_1.SystemStorage(conf);
    }
    // 判断当前页面是否是后台管理页面
    isAdmin() {
        return window.location.href.includes(exports.FBMS) || window.location.href.includes(exports.MAINTENANCESYSTEM);
    }
    // 更新的有效时间
    updateTime() {
        this.storage.setItem(exports.TIMER, (new Date().getTime() + exports.KEEP).toString());
        // 获取当前的集团编码
        const groupCode = js_cookie_1.default.get(exports.GROUPCODE);
        // 重新更新Cookie的有效期
        if (groupCode) {
            js_cookie_1.default.set(exports.GROUPCODE, groupCode, { expires: 7, path: '/' });
        }
    }
    // 验证是否在有效时间内
    valiteTime() {
        const str = this.storage.getItem(exports.TIMER);
        // 如果不存在直接不通过
        if (str == null)
            return false;
        // 验证有效时间是否大于当前时间
        return +str > new Date().getTime();
    }
    // 保存用户信息
    saveUser(user) {
        try {
            // 获取用户信息
            const item = JSON.parse(user);
            // 获取是否是管理员
            const isAdmin = item.isAdmin === "1";
            // 管理员单用户分别进行存储
            const key = isAdmin ? exports.PERSAGYADMIN : exports.USER;
            // 按照用户信息类型不同分别进行存储
            this.storage.setItem(key, user);
            // 非管理员登录或者没有保存groupCode 的时候才进行存储
            if (!(isAdmin && js_cookie_1.default.get(exports.GROUPCODE))) {
                // 保存Cookie
                js_cookie_1.default.set(exports.GROUPCODE, JSON.parse(user).groupCode, { expires: 7, path: '/' });
            }
        }
        catch (error) {
        }
    }
    // 退出登录
    loginOut() {
        // 获取普通用户信息
        const user = this.storage.getItem(exports.USER);
        // 获取管理员信息
        const admin = this.storage.getItem(exports.PERSAGYADMIN);
        // 当同时存在用户信息和普通信息时根据Url进行处理
        debugger;
        if (user && admin) {
            // 获取当前页面是否是管理员的页面
            const isAdmin = this.isAdmin();
            // 删除对应得用户信息凭证
            localStorage.removeItem(isAdmin ? exports.PERSAGYADMIN : exports.USER);
        }
        else {
            // 清空所有的信息
            localStorage.clear();
            // 清空Cookie
            js_cookie_1.default.remove(exports.GROUPCODE, { path: '/' });
        }
    }
    // 获取用户信息
    queryUser() {
        // 获取当前页面是否是管理员的页面
        const isAdmin = this.isAdmin();
        return this.storage.getItem(isAdmin ? exports.PERSAGYADMIN : exports.USER);
    }
}
exports.System = System;
