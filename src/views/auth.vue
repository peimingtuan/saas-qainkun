<template>
    <div class="auth">{{msg}}</div>
</template>

<script>
import api from '../api/common'
import axios from '../utils/request'
import { saveUser } from '../utils/storage'
import { createUrl } from '../utils/tools'
import { createNamespacedHelpers } from 'vuex'
import { Loading } from 'element-ui'
const { mapState } = createNamespacedHelpers('system')
export default {
  name: 'auth',
  data () {
    return {
      msg: null
    }
  },
  watch: {},
  computed: {
    ...mapState(['menuTree'])
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init () {
      axios.get(`/ssod/verify-stk?_stk_=${this.$route.query._stk_}`).then(res => {
        if (res.data.uiid) {
          const loadingInstance = Loading.service()
          axios.post(api.ssoLogin, {
            loginName: res.data.uiid,
            loginDevice: 'PC',
            puser: {}
          }).then(async response => {
            console.log('response:', response)
            loadingInstance.close()
            if (response.data?.result === 'success') {
              const data = response.data
              // 登录是否通过
              if (data.content[0].resultType == 1) {
                const user = data.content[0]
                // 兼容子系统
                user.user_id = user.userId
                // if (process.env.NODE_ENV === 'development') {
                //   user.authorizations = user.authorizations.map((item) => {
                //     if (item.functionUrl) {
                //       const url = new URL(item.functionUrl)
                //       const info = systemConfig.microAppIds.find((info) =>
                //         item.functionUrl.includes(info)
                //       )
                //       if (info) {
                //         item.functionUrl = item.functionUrl.replace(
                //           url.host,
                //           'localhost:8080'
                //         )
                //       }
                //     }
                //     return item
                //   })
                // }
                // 保存用户信息
                await saveUser(user)
                const menuTree = this.menuTree
                const path = createUrl(menuTree[0].child[0].child[0])
                this.$router.push({ path })
              } else {
                this.msg = '用户信息不存在'
              }
            } else {
              this.msg = '系统登录失败'
            }
          }).catch(err => {
            loadingInstance.close()
          })
        } else {
          this.msg = '获取uiid失败'
        }
      })
    }
  }
}
</script>
