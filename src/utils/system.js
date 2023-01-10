
import store from '../store/index'
import router from '../router/index'
import { system } from './system-tools'
import { get } from 'lodash'
import { saveLoginOut } from './log'

export function compare (prop) {
  return function (obj1, obj2) {
    let val1 = obj1[prop]
    let val2 = obj2[prop]
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1)
      val2 = Number(val2)
    }
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}

// 根据权限获取权限树
export function queryMenutree (user) {
  const authorizations = user ? user.authorizations : []

  let newAuthorizations = []

  const sort = compare('productOrder')
  // 获取侧边导航栏信息
  newAuthorizations = authorizations.filter(function (item) {
    // 获取根级模块
    return !item.authorizationParentId
  })
  newAuthorizations.map((item) => {
    item.child = []
    authorizations.map((cu) => {
      cu.id = cu.authorizationId
      cu.name = cu.authorizationName
      if (cu.authorizationParentId == item.authorizationId) {
        item.child.push(cu)
      }
    })
  })
  newAuthorizations.sort(sort)
  const obj = {}
  const ids = newAuthorizations.reduce(function (item, next) {
    obj[next.productId]
      ? ''
      : (obj[next.productId] = true && item.push(next))
    return item
  }, [])
  const arr = []
  ids.map((item, index) => {
    const obj = {
      menuIconKey: item.menuIconKey,
      objType: item.objType,
      productIconKey: item.productIconKey,
      productId: item.productId,
      id: item.productId,
      name: item.productName,
      productName: item.productName,
      productOrder: item.productOrder,
      productUrl: item.productUrl,
      child: []
    }
    const arr1 = newAuthorizations.filter((c) => {
      return item.productId == c.productId
    })
    if (arr1.length) {
      obj.child = arr1
      arr.push(obj)
    }
  })

  return arr
}

// 获取对应得权限点
export function queryAuthIds (user) {
  return new Set(
    (user ? user.authorizations : [])
      .map(({ authorizationId }) => authorizationId)
      .filter((item) => item)
  )
}

// 退出登录
export function loginOut () {
  const isAdmin = get(store, 'state.system.user.isAdmin', '0') === '1' || get(store, 'state.system.user.isAdmin', '0') === '8' || get(store, 'state.system.user.isAdmin', '0') === '9'
  debugger
  console.log(store)
  saveLoginOut(get(store, 'state.system.user', {}), get(store, "getters.['system/currenRouterItem']", {}))

  // 清除用户信息
  store.dispatch('system/loginAs', null)

  // 退出登录
  system.loginOut()
  const url = isAdmin ? '/saasweb/login/fbms' : '/saasweb/login'
  window.location.href = window.location.origin + url
  // 跳转登录页面
  // router.push({
  //     path: isAdmin ? "/login/fbms" : "/login"
  // })
}
