<template>
  <div class="header_nav" :class="hideHead ? 'hideHead' : ''">
    <!-- 展开收起按钮 -->
    <div class="openBtn">
      <div @click="toggleCollapsed" class="svg_icon">
        <svg-icon name="menu" :color="'#0091FF'" :size="24"></svg-icon>
      </div>
    </div>

    <div class="left">
      <div class="project_name">
        <img
          class="system_logo"
          :class="{ fixedLogo: hideHead && isLogo }"
          :src="`${baseUrl}config/logo.png`"
        />
        <template v-if="isAdmin">
          <span class="system_name">{{
            systemConfig.maintenanceSystemTitle
          }}</span>
          <i class="dot"></i>
          <span class="menu_name">{{ currenRouterItem.name }}</span>
        </template>
        <div v-else>
          <Dropdown
            class="dropdown"
            :value="currenRouterItem.authorizationParentId"
            :data="g2List"
            trigger="click"
            @change="g2Change"
            >{{ g2 && g2.name }}</Dropdown
          >
          <i class="dot"></i>
          <Dropdown
            class="dropdown"
            :value="currenRouterItem.id"
            :data="f2List"
            trigger="click"
            @change="f2Change"
          >
            {{ currenRouterItem.name }}</Dropdown
          >
          <template v-if="isProjectModule">
            <i class="dot"></i>
            <Dropdown
              :key="changekey"
              class="dropdown"
              :value="projcetId"
              :data="projects"
              openSearch
              trigger="click"
              @change="pjChange"
              @getStatus="getStatus"
              >{{ project && project.name }}</Dropdown
            >
          </template>
        </div>
      </div>
    </div>
    <div class="right">
      <div v-if="isAdmin" class="header_nav_right">
        <div @click="toggleFun">
          <template>
            <img
              class="img"
              v-if="user && user.head_portrait"
              :src="avaImg"
              alt=""
            />
            <Avatar v-else type="image" size="small"></Avatar>
          </template>
          <span style="margin: 0 15px 0 5px" v-text="user.userName"></span>
          <svg-icon
            name="arrow_right"
            :size="14"
            style="transform: rotate(90deg)"
          ></svg-icon>
        </div>
        <ul v-if="show" tabindex="-1" @blur="show = false" ref="personal">
          <li @click="loginOut">退出系统</li>
        </ul>
      </div>
      <div class="person" v-else>
        <Dropdown v-model="dropId" :data="dropData" trigger="click">
          <div class="drop-avatar">
            <template>
              <img
                class="img"
                v-if="user && user.head_portrait"
                :src="avaImg"
                alt=""
              />
              <Avatar v-else type="image" size="small"></Avatar>
            </template>
          </div>
        </Dropdown>
      </div>
    </div>
    <personal v-if="dropId == 'personal_data'" :dropId="dropId"></personal>
    <passWord v-if="dropId == 'change_password'" :dropId="dropId"></passWord>
  </div>
</template>

<script>
import moment from 'moment'
import { Headers, Dropdown, Avatar } from 'meri-design'
import { createNamespacedHelpers } from 'vuex'
import personal from './info/personal'
import passWord from './info/passWord'
import { createUrl } from '../utils/tools'
import { loginOut } from '../utils/system'
import { updateMicroApp } from '../micro-app'
const { mapMutations, mapActions, mapState, mapGetters } =
  createNamespacedHelpers('system')
const data = [
  {
    id: 'personal_data',
    name: '个人资料',
    icon: '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><rect fill="#000000" opacity="0" x="0" y="0" width="16" height="16"></rect><path d="M8.05333333,8.72 C9.49198251,8.72008962 10.8213875,7.95263089 11.540738,6.70673908 C12.2600884,5.46084727 12.2600884,3.9258194 11.540738,2.67992759 C10.8213875,1.43403579 9.49198251,0.666577055 8.05333333,0.666666672 C5.82956469,0.666805196 4.02691749,2.4695647 4.02691749,4.69333334 C4.02691749,6.91710198 5.82956469,8.71986148 8.05333333,8.72 Z M8.05333333,7.38666667 C6.5658464,7.38666667 5.35999999,6.18082026 5.35999999,4.69333334 C5.35999999,3.20584641 6.5658464,2 8.05333333,2 C9.54082026,2 10.7466667,3.20584641 10.7466667,4.69333334 C10.7466667,6.18082026 9.54082026,7.38666667 8.05333333,7.38666667 Z" fill="#8D9399"></path><path d="M8.05333333,7.38666667 C3.97333333,7.38666667 0.666666672,10.6933333 0.666666672,14.7733333 C0.666666672,15.1414833 0.965183357,15.4398979 1.33333334,15.4398979 C1.70148331,15.4398979 1.99994364,15.1414833 2,14.7733333 C2,11.4301696 4.71016965,8.72 8.05333333,8.72 C8.4214833,8.71994364 8.71989794,8.42148331 8.71989794,8.05333334 C8.71989794,7.68518336 8.4214833,7.38666667 8.05333333,7.38666667 Z" fill="#8D9399"></path><path d="M11.2793333,9.36266667 L11.2793333,9.27866667 C11.2793333,8.91066093 11.5776609,8.61233334 11.9456667,8.61233334 C12.3136724,8.61233334 12.612,8.91066093 12.612,9.27866667 L12.612,9.36266667 C12.8566667,9.42533334 13.088,9.52266667 13.3,9.648 L13.36,9.588 C13.6203332,9.32774537 14.0423334,9.32774537 14.3026667,9.588 C14.4275663,9.71279083 14.4977433,9.88210883 14.4977433,10.0586667 C14.4977433,10.2352245 14.4275663,10.4045425 14.3026667,10.5293333 L14.2426667,10.5893333 C14.3673333,10.8006667 14.4646667,11.0313333 14.5273333,11.276 L14.6113333,11.276 C14.8561394,11.2650383 15.0871898,11.3893981 15.2128671,11.5997677 C15.3385445,11.8101372 15.3385445,12.0725294 15.2128671,12.282899 C15.0871898,12.4932686 14.8561394,12.6176284 14.6113333,12.6066667 L14.5273333,12.6066667 C14.46518,12.8478995 14.3691114,13.0790928 14.242,13.2933333 L14.302,13.3533333 C14.4271038,13.478151 14.4974105,13.647612 14.4974105,13.8243333 C14.4974105,14.0010547 14.4271038,14.1705156 14.302,14.2953333 C14.0416668,14.555588 13.6196666,14.555588 13.3593333,14.2953333 L13.2993333,14.2353333 C13.0853333,14.362 12.8533333,14.458 12.612,14.52 L12.612,14.604 C12.612,14.9721898 12.3135232,15.2706667 11.9453333,15.2706667 C11.5771435,15.2706667 11.2786667,14.9721898 11.2786667,14.604 L11.2786667,14.52 C11.0373266,14.4578524 10.8059428,14.3620223 10.5913333,14.2353333 L10.5313333,14.2953333 C10.2696674,14.5474738 9.8542753,14.5436193 9.59733333,14.2866667 C9.33993393,14.0300694 9.33637024,13.6143052 9.58933333,13.3533333 L9.64933333,13.2933333 C9.52240628,13.0790004 9.42634879,12.847834 9.364,12.6066667 L9.28,12.6066667 C9.03519397,12.6176284 8.80414356,12.4932686 8.6784662,12.282899 C8.55278885,12.0725294 8.55278885,11.8101372 8.6784662,11.5997677 C8.80414356,11.3893981 9.03519397,11.2650383 9.28,11.276 L9.364,11.276 C9.42666667,11.0313333 9.524,10.8006667 9.64866667,10.5893333 L9.58866667,10.5293333 C9.46365114,10.4044271 9.39346434,10.2349164 9.3935894,10.058195 C9.39371447,9.88147369 9.46414113,9.71206248 9.58933333,9.58733333 C9.84966656,9.3270787 10.2716668,9.3270787 10.532,9.58733333 L10.5913333,9.64733333 C10.806,9.52066666 11.038,9.42533333 11.2793333,9.36266667 L11.2793333,9.36266667 Z M11.946,13.2726667 C12.6812751,13.2726667 13.2773333,12.6766084 13.2773333,11.9413333 C13.2773333,11.2060582 12.6812751,10.61 11.946,10.61 C11.4603133,10.5946278 11.0047946,10.8449628 10.757405,11.2632046 C10.5100153,11.6814464 10.5100153,12.2012203 10.757405,12.6194621 C11.0047946,13.0377039 11.4603133,13.2880389 11.946,13.2726667 L11.946,13.2726667 Z" fill="#373C43"></path></g></svg>'
  },
  {
    id: 'change_password',
    name: '修改密码',
    icon: '<?xml version="1.0" encoding="UTF-8"?><svg width="14px" height="16px" viewBox="0 0 14 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="translate(-1, 0)"><rect fill="#000000" opacity="0" x="0" y="0" width="16" height="16"></rect><path d="M2.66666667,6.66666667 L13.3333333,6.66666667 C13.6869553,6.66666667 14.0260939,6.80714245 14.2761424,7.05719096 C14.5261909,7.30723946 14.6666667,7.64637801 14.6666667,8 L14.6666667,14 C14.6666667,14.353622 14.5261909,14.6927605 14.2761424,14.942809 C14.0260939,15.1928575 13.6869553,15.3333333 13.3333333,15.3333333 L2.66666667,15.3333333 C2.31304468,15.3333333 1.97390613,15.1928575 1.72385762,14.942809 C1.47380912,14.6927605 1.33333333,14.353622 1.33333333,14 L1.33333333,8 C1.33333333,7.64637801 1.47380912,7.30723946 1.72385762,7.05719096 C1.97390613,6.80714245 2.31304468,6.66666667 2.66666667,6.66666667 L2.66666667,6.66666667 Z M2.66666667,8 L2.66666667,14 L13.3333333,14 L13.3333333,8 L2.66666667,8 Z" fill="#373C43"></path><path d="M5.33333333,6.93333333 L5.33333333,4.88533333 C5.33333333,3.28266667 6.53733333,2 8,2 C9.46266667,2 10.6666667,3.28266667 10.6666667,4.88533333 L10.6666667,6.922 L12,6.922 L12,4.88533333 C12,2.56466667 10.2186667,0.666666672 8,0.666666672 C5.78133333,0.666666672 4,2.56466667 4,4.88533333 L4,6.93333333 L5.33333333,6.93333333 Z" fill="#373C43"></path><path d="M7.182,11.0666667 C7.182,11.8030463 7.62971525,12.4 8.182,12.4 C8.73428475,12.4 9.182,11.8030463 9.182,11.0666667 C9.182,10.330287 8.73428475,9.73333334 8.182,9.73333334 C7.62971525,9.73333334 7.182,10.330287 7.182,11.0666667 L7.182,11.0666667 Z" fill="#8D9399"></path></g></svg>'
  },
  {
    id: 'log_out',
    name: '退出登录',
    icon: '<?xml version="1.0" encoding="UTF-8"?><svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="translate(-1, -1)"><rect fill="#000000" opacity="0" x="0" y="0" width="16" height="16"></rect><path d="M4.17333333,10.91 C4.37967281,11.1145556 4.71232719,11.1145556 4.91866667,10.91 C5.02049853,10.8185792 5.07866943,10.6881817 5.07866943,10.5513333 C5.07866943,10.4144849 5.02049853,10.2840874 4.91866667,10.1926667 L3.16133333,8.50266667 L8.27466667,8.50266667 C8.59466667,8.50266667 8.80733333,8.298 8.80733333,7.99066667 C8.80733333,7.684 8.594,7.47866667 8.27466667,7.47866667 L3.16133333,7.47866667 L4.91866667,5.78866667 C5.02027472,5.69725682 5.07829853,5.56700798 5.07829853,5.43033334 C5.07829853,5.29365869 5.02027472,5.16340986 4.91866667,5.072 C4.82182757,4.96992249 4.68596394,4.91412136 4.54533333,4.91866667 C4.40494789,4.91439908 4.26939864,4.97017069 4.17266667,5.072 L1.50933333,7.68333333 C1.50933333,7.68333333 1.50933333,7.73466666 1.456,7.73466667 C1.296,7.888 1.296,8.19533334 1.50933333,8.34933333 L4.17333333,10.9093333 L4.17333333,10.91 Z" fill="#8D9399"></path><path d="M2.54533333,4.87133333 L2.54533333,3.04133333 C2.54533333,2.768 2.76733333,2.54533333 3.04133333,2.54533333 L12.9586667,2.54533333 C13.232,2.54533333 13.4546667,2.76733333 13.4546667,3.04133333 L13.4546667,12.9586667 C13.4546667,13.232 13.2326667,13.4546667 12.9586667,13.4546667 L3.04133333,13.4546667 C2.90978595,13.4546667 2.78362641,13.4024097 2.69060836,13.3093916 C2.59759032,13.2163736 2.54533333,13.0902141 2.54533333,12.9586667 L2.54533333,11.4633333 C2.55580974,11.2400489 2.44265275,11.0290926 2.25084027,10.9143159 C2.05902779,10.7995392 1.81963886,10.7995392 1.62782638,10.9143159 C1.43601391,11.0290926 1.32285691,11.2400489 1.33333333,11.4633333 L1.33333333,12.9586667 C1.33333333,13.901969 2.09803098,14.6666667 3.04133333,14.6666667 L12.9586667,14.6666667 C13.901969,14.6666667 14.6666667,13.901969 14.6666667,12.9586667 L14.6666667,3.04133333 C14.6666667,2.09803098 13.901969,1.33333333 12.9586667,1.33333333 L3.04133333,1.33333333 C2.09803098,1.33333333 1.33333333,2.09803098 1.33333333,3.04133333 L1.33333333,4.87133333 C1.34851847,5.19497525 1.61533536,5.44956673 1.93933333,5.44956673 C2.26333129,5.44956673 2.53014818,5.19497525 2.54533333,4.87133333 Z" fill="#373C43"></path></g></svg>'
  }
]
export default {
  name: 'headerNav',
  components: {
    Headers,
    Dropdown,
    Avatar,
    personal,
    passWord
  },
  props: {
    value: {}
  },
  data () {
    return {
      changekey: 0,
      dropId: '',
      dropData: data,
      inputVal: '',
      selVal: '',
      show: false,
      projectShow: false,
      systemConfig
      // 需要隐藏头部的功能F ID
    }
  },
  mounted () {},
  computed: {
    ...mapState({
      // 当前用户信息
      user: (state) => {
        return state.user
      },
      isLogo: (state) => {
        return !(state.id.indexOf('dark') > -1)
      },
      // 当前用户有的项目列表
      projects: (state) => {
        return state.user.projects.map((item) => ({
          id: item.projectId,
          name: item.projectName,
          ...item
        }))
      },
      // 功能菜单树
      menuTree (state) {
        return state.menuTree
      },
      baseUrl () {
        return process.env.BASE_URL
      }
    }),
    ...mapGetters([
      // 当前的功能F
      'currenRouterItem',
      // 当前的项目
      'projcetId',
      // 当前用户是否是管理员
      'isAdmin',
      // 当前树形菜单的扁平化
      'treeToList',
      // 是否是项目级功能F
      'isProjectModule',
      'hideHead'
    ]),
    // 获取当前功能F的分组列表
    g2List () {
      if (this.isAdmin) {
        return []
      } else {
        const item = this.treeToList.find(
          (item) => item.id === this.currenRouterItem.productId
        )
        return item ? item.child : []
      }
    },
    // 头像
    avaImg () {
      return this.user.head_portrait.includes('/upload/meos/')
        ? '/api' + this.user.head_portrait
        : '/api/download/meos/' + this.user.head_portrait
    },
    // 当前选中的分组
    g2 () {
      return this.g2List.find(
        (item) => item.id === this.currenRouterItem.authorizationParentId
      )
    },
    // 获取当前功能F的列表
    f2List () {
      if (this.isAdmin) {
        return []
      } else {
        const item = this.treeToList.find(
          (item) =>
            item.authorizationId === this.currenRouterItem.authorizationParentId
        )
        return item ? item.child : []
      }
    },
    // 获取当前选中的项目
    project () {
      return this.projects.find((item) => item.id === this.projcetId)
    }
  },
  watch: {
    dropId (n) {
      if (n == 'log_out') {
        loginOut()
      }
    }
  },
  methods: {
    getStatus (bool) {
      if (!bool) {
        this.changekey++
      }
    },
    // 功能F 分组修改
    g2Change (id) {
      const item = this.g2List.find((item) => item.id === id)
      // 默认第一个功能F
      const f = item.child[0]
      const path = createUrl(f, this.project)
      this.$router.push({
        path
      })
      updateMicroApp()
    },
    // 功能F 修改
    f2Change (id) {
      const item = this.f2List.find((item) => item.id === id)
      const path = createUrl(item, this.project)
      this.$router.push({
        path
      })
      updateMicroApp()
    },
    // 项目修改
    pjChange (id) {
      this.changekey++
      const item = this.projects.find((item) => item.id === id)
      const path = createUrl(this.currenRouterItem, item)
      this.$router.replace({
        path
      })
      updateMicroApp()
    },

    toggleCollapsed () {
      this.$emit('input', !this.value)
    },
    projectFun (item) {
      this.$store.commit('setProjectId', item)
    },
    firstFun (item) {
      this.$store.commit('firstId', item)
      this.$store.commit(
        'secondId',
        this.headerNavigation.find((d) => d.id === item).child[0].id
      )
    },
    secondFun (item) {
      this.$store.commit('secondId', item)
    },
    toggleFun () {
      this.show = !this.show
      this.$nextTick(() => {
        this.$refs.personal.focus()
      })
    },
    loginOut () {
      loginOut()
    }
  }
}
</script>

<style scoped lang="less">
.header_nav {
  position: fixed;
  width: 100vw;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  max-height: 50px;
  min-height: 50px;
  background-color: #fff;
  box-shadow: 0 2px 10px 0 rgb(31 35 41 / 10%);
  z-index: 100;

  .dropdown {
    /deep/.p-drop-title {
      color: #1f2429;
    }
  }

  &.hideHead {
    height: 0;
    overflow: hidden;
    min-height: 0;
  }

  .left {
    padding-left: 40px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;

    .project_name {
      font-size: 16px;
      display: flex;
      align-items: center;

      span {
        margin: 0 5px;
      }

      .system_logo {
        margin: 0 16px 0 16px;
        height: 24px;
        vertical-align: middle;

        &.fixedLogo {
          position: fixed;
          top: 13px;
        }
      }

      .dot {
        margin: 0 8px;
        background-color: #c3c7cb;
        border-radius: 2px;
        width: 4px;
        height: 4px;
      }
    }
  }

  .right {
    display: flex;
    align-items: center;

    .header_nav_right {
      color: #1f2429;
      font-size: 14px;
      position: relative;
      padding-right: 16px;

      div {
        display: flex;
        align-items: center;
        cursor: pointer;

        .img {
          vertical-align: middle;
          width: 24px;
          height: 24px;
          border-radius: 24px;
          overflow: hidden;
        }
      }

      ul {
        position: absolute;
        width: 112px;
        background-color: #fff;
        border: 1px solid #e4e5e7;
        box-sizing: border-box;
        box-shadow: 0 2px 5px rgb(0 0 0 / 20%);
        border-radius: 6px;
        top: 40px;
        right: 10px;
        /*display: none;*/
        font-size: 14px;

        li {
          height: 46px;
          line-height: 46px;
          text-align: center;
          cursor: pointer;
          padding: 0 15px;
          cursor: pointer;
        }

        li:hover {
          background-color: #f5f6f7;
        }
      }
    }

    .person {
      position: fixed;
      top: 10px;
      right: 10px;
    }
  }

  .openBtn {
    position: fixed;
    top: 0;
    left: 2px;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    .svg_icon {
      position: absolute;
      transform: translateY(2px);
      cursor: pointer;
    }
  }

  /deep/ .drop-avatar {
    .img {
      vertical-align: middle;
      width: 24px;
      height: 24px;
      border-radius: 24px;
      overflow: hidden;
    }
  }
}
</style>
