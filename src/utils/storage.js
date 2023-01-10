
import store from '../store/index'

import { queryMenutree, queryAuthIds } from './system'

import { system } from './system-tools'

// 获取本地的用户信息
export function queryLocalUser () {
  // 当前系统的状态
  const state = {
    // 用户信息
    user: null,
    // 当前的功能树
    menuTree: [],
    // 当前的权限资源点
    authId: new Set()
  }

  if (system.valiteTime() && system.queryUser()) {
    // 在当前的有效时间内
    if (system.valiteTime()) {
      const user = JSON.parse(system.queryUser())
      // 获取当前用户信息
      state.user = user
      // 获取用户菜单
      state.menuTree = queryMenutree(user)
      // 获取用户功能权限
      state.authId = queryAuthIds(user)
    }
  }

  return state
}

// 本地保存用户信息
export async function saveUser (user) {
  // 用户信息为空直接不保存
  if (!user) return
  // 本地保存用户信息
  system.saveUser(JSON.stringify(user))
  // 更新有效时间
  system.updateTime()
  // 更新到Vuex中
  await store.dispatch('system/loginAs', user)
  // 写入Cookie
  // document.cookie = `groupCode=${user.groupCode}; path=/`
  // 返回当前的用户信息
  return user
}
