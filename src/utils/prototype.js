
// 引入Vuex
import store from '../store/index'
const state = store.state

/**
 * 挂载到Vue.prototype 原型上面的对象
 * @param Vue Vue实例
 * @param options 需要传入的参数
 */
export function install (Vue) {
  // 绑定验证的方法
  Vue.prototype.$api.hasAuth = (authId1) => {
    const arr = state.authId
    return arr.includes(authId1)
  }
}
