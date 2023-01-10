const { defineConfig } = require('@vue/cli-service')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

const proxy = {
  // target: "http://bz-develop.persagy.com/",
  // target:"http://preibmp.scpgroup.com.cn/",
  // target: "http://develop.persagy.com/"
  // target: "http://testibmp.scpgroup.com.cn/"
     target: "http://doimp.persagy.com/"
  //target: 'http://testibmp.scpgroup.com.cn/'
  //target: 'http://bl-develop.persagy.com/'
}

module.exports = defineConfig({
  transpileDependencies: true,
  // 相对路径
  publicPath: '/saasweb',
  // 打包名称
  outputDir: 'saasweb',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'static',
  // 生产环境是否开启sourceMap
  productionSourceMap: false,
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  lintOnSave: false,
  chainWebpack (config) {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/img/svg'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/img/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  // 配置跨域
  devServer: {
    proxy: {
      // '/api/ssod': {
      //   //target: 'http://localhost:9999',
      //   target: "https://pd.powerlong.com",
      //   secure:true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/api/ssod": "/ssod"
      //   }
      // },
      '^/chargeanagement': proxy,
      '^/fms': proxy,
      '^/energycarbon': proxy,
      '^/rundiagnosis': proxy,
      '^/equipmentspaceweb': proxy,
      '^/workorderweb': proxy,
      '^/globalalarm': proxy,
      '^/sopweb':proxy,
      '^/indicesmanagement': proxy,
      '^/draw': proxy,
      '^/webmeterservice': proxy,
      '^/energybudget': proxy,
      '^/safetymanagement': proxy,
      '^/api': proxy,
      '^/tenant-energy-charge': proxy,
      '^/energyefficiency': proxy
    }
  }
})
