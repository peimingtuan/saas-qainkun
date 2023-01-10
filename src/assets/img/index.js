// 默认导入所有src文件夹下的svg文件(自动导入，不需手动一个个导入)
import Vue from 'vue'
import SvgIcon from '@/components/svgIcon'// 写了组件在打开 用于注册组件

Vue.component('svg-icon', SvgIcon)// 写了组件在打开 用于注册组件

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /.svg$/)
requireAll(req)
