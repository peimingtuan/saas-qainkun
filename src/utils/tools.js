
import store from "../store/index"
import { crypto } from "./system-tools"
import Url from "url-parse";
import { saveFuntionLogin } from "./log"
// 获取功能F对应得跳转链接
export function createUrl(item, project) {
    // 记录跳转日志
    try {
        console.log(store);
        // 保存跳转信息
        saveFuntionLogin(store.state.system.user, item, project)
    } catch (error) {

    }

    const { id, functionUrl } = item;

    const url = new Url(functionUrl);

    const loginName = store.state.system.user.name;
    // 功能F跳转的时候清空所有的路由记录
    routerCache = {};

    // 需要传递项目信息的（管理员用户的type不正确平台类的功能F type 是3 兼容处理添加 project 的判断）
    if (isProjectF(item, store.state.system.user)) {
        let projectId = "";
        if (project) {
            projectId = project.projectId;
        } else {
            // 当前的项目ID
            projectId = store.getters["system/project_id"];
            // 如果当前项目ID不存在
            if (!projectId) {
                // 获取默认第一个项目ID
                projectId = store.state.system.user.projects[0].projectId;
            }
        }

        return `${url.pathname}${id}?pj=${crypto.Encrypt(projectId)}`;
    } else {
        // 集团平台的模块
        return `${url.pathname}${id}?pj=${crypto.Encrypt('')}`;
    }
}

/**
 * 判断当前功能F是否是项目级的功能F
 * @param {*} item 当前的功能F
 * @param {*} user 当前的用户信息（因为运维平台的功能F配置有一部分错误所需需要进行额外的验证）
 * @returns bool 当前模块是否是项目级的功能F
 */
export function isProjectF(item, user) {
    return item.type === "2" && user.isAdmin !== "1";
}
