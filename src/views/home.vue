<template>
  <div class="qiankun_home">
    <headerNav v-if="user" v-model="open"></headerNav>
    <transition name="back">
      <leftNav v-model="open" v-if="!isAdmin && open"></leftNav>
      <fbmsLeftNav v-model="open" v-if="isAdmin && open"></fbmsLeftNav>
    </transition>
    <router-view />
    <!-- 微应用注册的容器 -->
    <div
      id="container"
      :class="hideHead ? 'hideHead' : ''"
      v-show="isMicroApp"
    ></div>
    <!-- 传统的服务注册的容器 -->
    <iframe
      id="saasFrame"
      :key="saasFrameUrl"
      v-if="!isMicroApp"
      :src="saasFrameUrl"
    ></iframe>
  </div>
</template>

<script>
import headerNav from '../components/headerNav'
import fbmsLeftNav from '../components/fbmsLeftNav'
import leftNav from '../components/leftNav'
import { createNamespacedHelpers } from 'vuex'
import { crypto } from '../utils/system-tools'
import { FUNCTION } from 'persagytools'
const { mapGetters, mapState } = createNamespacedHelpers('system')
export default {
  components: { headerNav, leftNav, fbmsLeftNav },
  name: 'home',
  mounted () {
    window.addEventListener('beforeunload', (e) => {
      // 不是所有浏览器都支持提示信息的修改
      localStorage.setItem(FUNCTION, this.$store.state.system.id)
    })
  },
  data () {
    return {
      open: false
    }
  },
  computed: {
    ...mapGetters(['isAdmin', 'isMicroApp', 'currenRouterItem', 'hideHead']),
    ...mapState(['user', 'project_id']),
    saasFrameUrl () {
      let url = ''
      if (this.currenRouterItem) {
        url = `${this.currenRouterItem.functionUrl}${this.currenRouterItem.id}?loginName=${this.user.userName}`
        // 如果是项目的功能F
        if (['2'].includes(this.currenRouterItem.type)) {
          url += `&project_id=${crypto.Decrypt(this.project_id)}`
        }
      }
      return url
    }
  }
}
</script>

<style lang="less">
.back-enter-active {
  transition: all 0.3s ease;
}
.back-leave-active {
  transition: all 0.3s ease;
}
.back-enter,
.back-leave-to {
  transform: translateX(-640px);
  opacity: 0;
}
.qiankun_home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  #container {
    flex: 1;
    width: 100vw;
    overflow: auto;
    margin-top: 50px;
    &.hideHead {
      margin-top: 0;
    }
    & > div {
      height: 100%;
      width: 100%;
    }
  }
  #saasFrame {
    margin-top: 50px;
    flex: 1;
    width: 100vw;
    &.hideHead {
      margin-top: 0;
    }
  }
}
</style>
