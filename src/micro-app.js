import { registerMicroApps, start, addGlobalUncaughtErrorHandler, prefetchApps } from 'qiankun';
import { cloneDeep, uniqBy, findIndex } from "lodash";
import Url from "url-parse";
import { system } from "./utils/system-tools";
import store from "./store";

// 子应用挂载的对象
const container = "#container";

let currentApp = null;
/**
 * 注册用户的所有路由
 * @param {User} user 用户信息
 * @returns void
 */
export const registerMicroAppsByUser = (user) => {
    if (!user) return false;

    const f2s = cloneDeep(user.authorizations).reduce(function deep(con, item) {
        if (item.objType == "f2") {
            con.push(item);
        }

        if (item.child && item.child.length) {
            item.child.reduce(deep, con);
        }

        return con;
    }, [])

    const list = uniqBy(f2s, "functionUrl").filter(item => item.authorizationId != "apmaim" && item.authorizationId != "scpgroup");

    const apps = list.map(item => ({
        name: item.name,
        entry: item.functionUrl,
        activeRule: `/saasweb${new Url(item.functionUrl).pathname}`,
    })).filter(item => item.activeRule.length > 6).filter(item => {
        return findIndex(systemConfig.microAppIds, (id) => item.activeRule.split("/").indexOf(id) != -1) != -1;
    });
    // 对APP进行注册
    registerMicroAppsByData(apps);
}

export const updateMicroApp = () => {
    if (currentApp) {
        history.pushState({}, "", "/loading")
        window._babelPolyfill= false;
        setTimeout(() => {
            history.back();
        });
    }
}

export const registerMicroAppsByData = (apps) => {
    const items = apps.map(item => ({
        ...item,
        container,
        props: {
            routerBase: item.activeRule, // 下发基础路由
            getGlobalState: {
                system: {
                    user: JSON.parse(system.queryUser())
                }
            },
        }
    }))

    // 对微服务进行挂载
    registerMicroApps(items, {
        // 加载完成
        beforeLoad: async app => {
            store.commit("system/merge", {
                isMicroApp: true
            })
            console.log("before load app.name====>>>>>", app.name);
            console.log("准备加载====>>>>>", app.name);

        },
        // 挂载完成之前
        beforeMount: [
            async app => {
                console.log("[LifeCycle] before mount %c%s", "color: green;", app.name);
            }
        ],
        // 挂载完成之后
        afterMount: [
            async app => {
                currentApp = app;
                console.log("[LifeCycle] after mount %c%s", "color: green;", app.name);
              if (window.proxy.__QIANKUN_SUB_APP_VM__ && process.env.NODE_ENV === 'development') {
                const subDiv = document.createElement('div')
                subDiv.__vue__ = window.proxy.__QIANKUN_SUB_APP_VM__
                document.body.appendChild(subDiv)
              }
            }
        ],
        // 销毁之后
        afterUnmount: [
            async app => {
                console.log("[LifeCycle] after unmount %c%s", "color: green;", app.name);
            }
        ]
    })

    addGlobalUncaughtErrorHandler(e => {

        // if (e.type === "error") {
        //     store.commit("system/merge", {
        //         isMicroApp: false
        //     })
        // }
    })

    start({
        singular: false,
        sandbox: true
    });
}
