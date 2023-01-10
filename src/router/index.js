import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import login from '../views/login.vue'
import home from '../views/home.vue'
import auth from '../views/auth.vue'
import { get } from "lodash"
import { system, crypto } from "../utils/system-tools";
import { createUrl, isProjectF } from '../utils/tools'
import { FUNCTION, ROUTERCACHE } from "persagytools";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
  }, {
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/login/fbms',
    name: 'login',
    component: login
  }, {
    path: '/auth',
    name: 'auth',
    component: auth
  },
  {
    path: '/:pathname*/:id',
    name: 'home',
    component: home,
  }
]

// 记录路由的缓存
window.routerCache = {};

try {
  if (localStorage.getItem(ROUTERCACHE)) {
    const o = JSON.parse(localStorage.getItem(ROUTERCACHE));
    routerCache = o;
    localStorage.removeItem(ROUTERCACHE);
  }
} catch (error) {

}

window.addEventListener("beforeunload", (e) => {
  //不是所有浏览器都支持提示信息的修改
  localStorage.setItem(ROUTERCACHE, JSON.stringify(routerCache));
});


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/auth') {
    return next()
  }
  if (to.path === "/login" || to.path === "/login/fbms") {
    document.title = to.path === "/login/fbms" ? systemConfig.maintenanceSystemTitle : systemConfig.systemTitle;
    if (get(store, "state.system.user.userId", null)) {
      // 已经登录了
      return next({
        path: '/'
      })
    }

    return next();
  }
  // 获取当前用户信息
  const user = store.state.system.user;
  // 获取当前的时间是否过期
  const timer = system.valiteTime();
  // 当前状态是否正常
  const normal = user && timer;

  // 访问首页 / 重定向到的第一个功能
  if (normal && to.path === "/") {
    const first = get(store, "state.system.menuTree[0].child[0].child[0]", null) || get(store, "state.system.menuTree[0].child[0]", null);
    const path = createUrl(first)
    return next({ path });
  }

  // 获取当前的功能F
  const id = get(to, "query.f") || get(to, "params.id");
  if (user) {

    // 获取对应得项目ID
    const project_id = get(to, "query.pj");
    if (project_id) {
      store.commit("system/merge", {
        project_id,
      })
    }
    // 确认不是子系统的路由
    if (store.getters["system/treeToList"].find(item => item.objType === "f2" && item.id === id)) {
      document.title = store.state.system.user.authorizations.filter(i => i.authorizationId == id)[0].authorizationName
      store.commit("system/merge", {
        id
      })
      for (const [key, value] of Object.entries(routerCache)) {
        if (value === id) {
          delete routerCache[key];
        }
      }
    } else if (routerCache[id]) {
      store.commit("system/merge", {
        id: routerCache[id]
      })
      // delete routerCache[id];
    } else if (localStorage.getItem(FUNCTION)) {

      store.commit("system/merge", {
        id: localStorage.getItem(FUNCTION)
      });
      localStorage.removeItem(FUNCTION)
    } else if (!routerCache[id]) {
      // 如果当前为子页面,且没有被记录，需要将其记录到对应得功能F下面
      routerCache[id] = store.state.system.id;
    }
  }
  localStorage.removeItem(FUNCTION)

  // 验证当前用户权限是否满足当前模块的Url，进行校验
  if (normal && to.path !== "/" && to.path !== "/loading") {
    let has = true;
    // 获取当前用户所有的权限点
    const authId = store.state.system.authId || new Set();
    // 获取当前功能权限是否满足 是否是系统的模块或者系统模块的子页面
    has = authId.has(id) || routerCache[id];
    if (has) {
      // 获取对应得f2列表
      const treeToList = store.getters["system/treeToList"];
      // 获取当前功能F
      const f2 = treeToList.find(item => item.id === (authId.has(id) ? id : routerCache[id]));

      // 判断是项目级功能F
      if (f2 && isProjectF(f2, user)) {
        // 获取Url中的项目ID
        const projectId = crypto.Decrypt(to.query.pj);
        const projects = user.projects;
        // 获取当前项目是否存在用户项目权限中
        has = projects.findIndex(item => item.projectId === projectId) !== -1;
      }
    }

    if (!has) {
      return next({ path: "/" });
    }
  }


  if (!normal && to.path !== '/login') {
    return next('/login');
  } else if (to.path !== '/login') {
    // 每次路由跳转增加缓存的时间
    system.updateTime();
  }
  console.log("routerCache Start")
  console.log(routerCache);
  console.log("routerCache End")
  window.routerCache = routerCache;

  return next(true);
});
export default router
