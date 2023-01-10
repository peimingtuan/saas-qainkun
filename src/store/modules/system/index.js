import api from '../../../api/common'
import axios from '../../../utils/request'
import router from '../../../router'
import { cloneDeep, get, uniq, uniqBy, findIndex } from 'lodash'
import { queryMenutree, queryAuthIds } from '../../../utils/system'
import { crypto } from '../../../utils/system-tools'
import { queryLocalUser } from '../../../utils/storage'
import Url from 'url-parse'
import { registerMicroAppsByUser } from '../../../micro-app'

const state = {
  // 当前功能F的ID
  id: null,
  // 当前高亮得一级菜单
  currentActiveIdnex: 0,
  // 当前的项目ID(加密后的)
  project_id: null,
  isMicroApp: true,
  MicropAppsId: systemConfig.microAppIds,
  // 需要隐藏头部的功能FID
  hideHeader: systemConfig.hideHeader,
  ...queryLocalUser()
}

if (state.user) {
  registerMicroAppsByUser(state.user)
}

export default {
  namespaced: true,
  state,
  mutations: {
    // 修改当前高亮得一级菜单
    setActiveMeun (state, index) {
      state.currentActiveIdnex = index
    },
    // 设置用户信息
    setUser (state, user) {
      state.user = user

      const authorizations = user.authorizations
      let newAuthorizations = []
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
      newAuthorizations.sort(this.compare('productOrder'))
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
      state.menuTree = arr
    },
    // 保存用户信息
    merge (state, payload) {
      Object.assign(state, payload)
    },
    // 设置权限树
    setMenutree (state, authorizations) {
      let newAuthorizations = []
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
      newAuthorizations.sort(this.compare('productOrder'))
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
      state.menuTree = arr
    }
  },
  // 计算属性
  getters: {
    // 是否是管理员
    isAdmin (state) {
      return (
        get(state, 'user.isAdmin') === '1' ||
        get(state, 'user.isAdmin') === '8' ||
        get(state, 'user.isAdmin') === '9'
      )
    },
    // 是否是项目级功能F
    isProjectModule (state, getters) {
      return getters.currenRouterItem
        ? ['2'].includes(getters.currenRouterItem.type)
        : false
    },
    hideHead (state) {
      return state.hideHeader.indexOf(state.id) != -1
    },
    // 将树形结构扁平化
    treeToList () {
      return state.menuTree.reduce(function deep (con, item) {
        con.push(item)
        if (item.child && item.child.length) item.child.reduce(deep, con)
        return con
      }, [])
    },
    // 当前模块信息
    currenRouterItem (state, getters) {
      // 获取当前功能F
      const f = state.id

      if (!f) return {}

      const item = getters.treeToList.find(
        (item) => item.objType === 'f2' && item.id === f
      )

      return item || {}
    },
    projcetId (state) {
      const pj = state.project_id
      return pj ? crypto.Decrypt(pj) : null
    },
    // 当前人员的功能F
    f2List (state, getters) {
      const f2list = getters.treeToList
        .reduce(function deep (con, item) {
          if (item.objType === 'f2') {
            con.push(item)
          }
          if (item.child && item.child.length) {
            item.child.reduce(deep, con)
          }
          return con
        }, [])
        .filter((item) => item.functionUrl.indexOf('draw') == -1)
      // 临时过滤其他的模块
      // 根据路径进行过滤
      const list = uniqBy(f2list, 'functionUrl')

      return list
        .map((item) => ({
          name: item.name,
          entry: item.functionUrl,
          activeRule: `/saasweb${new Url(item.functionUrl).pathname}`
        }))
        .filter((item) => item.activeRule.length > 6)
    },
    // 当前是否微服务
    isMicroApp (state, getters) {
      const item = getters.currenRouterItem
      if (item && item.functionUrl) {
        return (
          findIndex(
            systemConfig.microAppIds,
            (id) => item.functionUrl.split('/').indexOf(id) != -1
          ) != -1
        )
      }
      return false
    }
  },
  actions: {
    // 登录
    async login ({ commit }, payload) {
      return await axios.post(api.login, {
        ...payload,
        loginDevice: 'PC',
        longitude: '',
        latitude: ''
      })
    },
    // 用户信息
    async loginAs ({ commit, getters }, user) {
      if (user) {
        // 权限ID
        const authId = queryAuthIds(user)
        // 菜单
        const menuTree = queryMenutree(user)

        commit('merge', {
          // 保存用户信息
          user,
          // 保存用户权限
          authId,
          // 保存菜单树
          menuTree
        })
        // 注册对应得微应用
        registerMicroAppsByUser(user)
      } else {
        // 清理 session
        // localStorage.clear();

        commit('merge', {
          user: null,
          authId: [],
          menuTree: new Set()
        })
      }
    }
  }
}
