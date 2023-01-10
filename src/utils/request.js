import vue from 'vue'
import axios from 'axios'
import store from '../store'

/**
 * 更改axios默认配置
 */
axios.defaults.headers.post['Content-Type'] = 'application/json,charset=utf-8'
axios.defaults.timeout = 1000 * 60 * 60 * 24
axios.defaults.baseURL = process.env.VUE_APP_HOST

/**
 * 将封装好的axios挂载到vue原型上
 */
vue.prototype.$axios = axios

export default axios
