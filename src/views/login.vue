<template>
  <div class="login_box">
    <div class="login_title">{{ pageTitle }}</div>
    <form class="login_forms" ref="form">
      <div class="input_item">
        <el-input
          v-model="loginName"
          name="username"
          prefix-icon="el-icon-user"
          autocomplete="new-password"
          placeholder="用户名"
          :class="errorMsgBoo ? 'input_error' : ''"
          @focus="errorMsgBoo = false"
          :clearable="true"
        />
      </div>
      <div class="input_item">
        <el-input
          type="password"
          prefix-icon="el-icon-unlock"
          v-model="password"
          placeholder="密码"
          :clearable="true"
          :class="errorMsgBoo ? 'input_error' : ''"
          @pressEnter="login"
        />
      </div>
      <div class="error_tip" v-if="errorMsgBoo">{{ errorMsg }}</div>
      <div class="login_btn" @click="submit">登录</div>
    </form>
    <img
      v-if="systemConfig.showBackground"
      class="background"
      height="100%"
      width="100%"
      :src="`${baseUrl}config/background.png`"
    />
    <div class="jing-ICP">© 2021 Persagy. All rights reserved. 版权所有</div>
  </div>
</template>

<script>
import { Button } from 'meri-design'
import { createNamespacedHelpers } from 'vuex'
import { cloneDeep } from 'lodash'
import { createUrl } from '../utils/tools'
import { saveUser } from '../utils/storage'
import { crypto } from '../utils/system-tools'
import { saveLoginLog } from '../utils/log'
import Url from 'url-parse'
const { mapMutations, mapActions, mapState } =
  createNamespacedHelpers('system')
export default {
  name: 'login',
  components: { Button },
  data () {
    return {
      // 测试环境账号
      loginName: '',
      password: '',
      // loginName: "PERSAGYADMIN",
      // password: "123456",
      // loginName: "demo",
      // password: "123123",
      // loginName: "PERSAGYADMIN",
      // password: "123456",
      errorMsgBoo: false,
      errorMsg: '',
      systemConfig
    }
  },
  computed: {
    isAdminLogin () {
      return location.href.indexOf('fbms') !== -1
    },
    pageTitle () {
      return this.isAdminLogin
        ? systemConfig.maintenanceSystemTitle
        : systemConfig.systemTitle
    },
    baseUrl () {
      return process.env.BASE_URL
    },
    ...mapState(['menuTree'])
  },
  mounted () {
    if (process.env.NODE_ENV === 'development') {
      if (this.isAdminLogin) {
        this.loginName = 'lijian'
        this.password = '123456qwe'
      } else {
        this.loginName = 'aim'
        this.password = '123qwe123'
      }
    }

    document.addEventListener('keydown', this.addEvent)
  },
  destroyed () {
    document.removeEventListener('keydown', this.addEvent)
  },
  methods: {
    ...mapActions(['login', 'loginAs']),
    addEvent (e) {
      const theEvent = window.event || e
      const code = theEvent.keyCode || theEvent.which || theEvent.charCode

      if (code == 13) {
        this.submit()
      }
    },
    async submit () {
      // 进行登录
      const res = await this.login({
        loginName: crypto.Encrypt(this.loginName),
        password: crypto.Encrypt(this.password),
        isAdminLogin: window.location.href.includes('/fbms')
      })

      if (res.data.result == 'success') {
        const data = res.data
        // 登录是否通过
        if (data.content[0].resultType == 1) {
          const user = data.content[0]
          // 兼容子系统
          user.user_id = user.userId

          if (process.env.NODE_ENV === 'development') {
            user.authorizations = user.authorizations.map((item) => {
              if (item.functionUrl) {
                const url = new Url(item.functionUrl)
                const info = systemConfig.microAppIds.find((info) =>
                  item.functionUrl.includes(info)
                )
                if (info) {
                  item.functionUrl = item.functionUrl.replace(
                    url.host,
                    'localhost:8080'
                  )
                }
              }
              return item
            })
          }
          // 如果不是管理员登录，强制修改user.isAdmin参数
          if (!this.isAdminLogin) {
            user.isAdmin = '0'
          } else {
            user.isAdmin = '1'
          }

          // 登录埋点
          await saveLoginLog(user)

          // 保存用户信息
          await saveUser(user)
          /**
           * 管理员的菜单格式和普通用户的菜单格式不通用
           */
          let item = null
          let path = ''
          const menuTree = this.menuTree
          // 跳转到默认第一个功能F
          if (this.isAdminLogin) {
            item = menuTree[0].child[0]
            path = createUrl(item)
          } else {
            item = menuTree[0].child[0].child[0]
            path = createUrl(item)
          }
          this.$router.push({ path })
        } else {
          switch (data.content[0].resultType) {
            case '2':
              this.errorMsg = '用户名或密码错误'
              break
            case '3':
              this.errorMsg = '用户名或密码错误'
              break
            case '4':
              this.errorMsg = '用户名或密码错误'
              break
            case '5':
              this.errorMsg = '用户名或密码错误'
              break
            default:
              this.errorMsg = '用户名或密码错误'
          }
          this.errorMsgBoo = true
          this.loginName = ''
          this.password = ''
        }
      } else {
        this.errorMsgBoo = true
        this.errorMsg = '登录失败'
        this.loginName = ''
        this.password = ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.el-input__inner {
  background: transparent;
}

.login_box {
  width: 500px;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
  // border: 1px co;
  .login_title {
    font-size: 28px;
    text-align: center;
    color: #4f4e4e;
    font-weight: bold;
  }
  .login_forms {
    margin-top: 40px;
    width: 354px;
    position: relative;
    .input_item {
      margin-bottom: 20px;
      .p-input {
        height: 42px;
      }
    }
    .error_tip {
      position: absolute;
      right: 0;
      bottom: 52px;
      height: 30px;
      line-height: 30px;
      color: #d44d44;
    }
    .login_btn {
      height: 42px;
      line-height: 42px;
      text-align: center;
      background: linear-gradient(90deg, #5696fa 0%, #116af8 100%);
      color: #fff;
      cursor: pointer;
      margin: 40px auto 0;
      border-radius: 2px;
      font-size: 16px;
      font-weight: bold;
      word-spacing: 8px;
      letter-spacing: 2px;
    }
    .login_btn:hover {
      opacity: 0.9;
      transition: 0.5s;
    }
  }
  .background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }

  .jing-ICP {
    position: absolute;
    right: 28px;
    font-size: 14px;
    color: #fff;
    bottom: 15px;
    text-shadow: 0 1px 6px #000;
    cursor: default;
  }
}
</style>

<style>
.input_error input {
  border: 1px solid #f54e45 !important;
  border-radius: 4px;
}
.el-input__inner {
  background-color: transparent !important;
}
</style>
