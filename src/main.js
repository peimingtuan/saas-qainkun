import Vue from 'vue'
import App from './App.vue'
import { prefetchApps } from 'qiankun'
import router from './router'
import store from './store'
import api from './api/common'
import { install } from './utils/prototype'
import { Input, Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入svg
import '@/assets/img/index'
import './recover.css'

Vue.use(Input)
Vue.use(Loading)

Vue.prototype.$api = api
Vue.use({ install })
Vue.config.productionTip = false

window.__POWERED_BY_QIANKUN__ = true
window.__POWERED_BY_QIANA__ = true

prefetchApps([
  {
    activeRule: '/saasweb/draw/',
    entry: `${window.location.origin}/draw/`,
    name: '看板管理'
  }
])

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#qiankun')
