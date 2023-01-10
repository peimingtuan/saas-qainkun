<template>
  <div class="left_nav_fiexd">
    <div class="left_nav" @blur="blur" ref="leftNav">
      <div class="left_nav_header">
        <div class="left_nav_header_btn" @click="$emit('input', false)">
          <svg-icon name="menu" color="#ffffff" :size="24"></svg-icon>
          <span class="left_nav_header_text">导航栏</span>
        </div>
      </div>
      <div class="left_nav_content">
        <ul class="first_menu">
          <li v-for="(item, index) in menuTree[0].child" @click="handleNav(index, item)"
            @mouseenter="currentActive(index)"
            :class="item.id == currenRouterItem.id && index ==currentIndex  ? 'active_menu' : ''" :key="index">
            <div>
              <i class="menu_icon"><img v-if="item.iconKey" style="width: 100%; height: 100%"
                  :src="`${$api.download}/${item.iconKey}`" alt="" /></i>
              <article class="menu_name">{{ item.authorizationName }}</article>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Input
} from 'meri-design'
import {
  createNamespacedHelpers
} from 'vuex'
import {
  createUrl
} from '../utils/tools'
import {
  updateMicroApp
} from '../micro-app'
const {
  mapState,
  mapGetters
} = createNamespacedHelpers('system')
export default {
  name: 'leftNav',
  components: {
    Input
  },
  props: {
    value: {}
  },
  data () {
    return {
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters(['currenRouterItem']),
    ...mapState(['menuTree']),
    collapsed () {
      return this.$store.state.collapsed
    },
    menuIndex () {
      return (
        this.menuTree[0].child &&
          this.menuTree[0].child.findIndex(
            (item) => item.id == this.$store.state.secondId
          )
      )
    }
  },
  mounted () {
    document
      .getElementsByClassName('left_nav_fiexd')[0]
      .addEventListener('click', this.bodyCloseMenus, true)
      // 更新当前选中得菜单，高亮处理
    this.currentIndex = this.menuTree[0].child.findIndex(i => i.authorizationId == this.currenRouterItem.id)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.bodyCloseMenus)
  },
  methods: {
    bodyCloseMenus (e) {
      if (this.$refs.leftNav && !this.$refs.leftNav.contains(e.target)) {
        this.$emit('input', false)
      }
    },
    handleNav (index, item) {
      if (item.authorizationId == 'logManage') {
        window.open('https://es-cn-zvp26w6de000b3apz.kibana.elasticsearch.aliyuncs.com:5601/app/kibana')
      } else {
        this.$router.push({
          path: createUrl(item)
        })
        updateMicroApp()
        this.$emit('input', false)
      }
    },
    blur () {},
    currentActive (i) {
      this.currentIndex = i
    }
  }
}

</script>

<style scoped lang="less">
  .left_nav_fiexd {
    position: fixed;
    background-color: hsla(0, 0%, 100%, 0);
    width: 100%;
    height: 100%;
    z-index: 99999 !important;
    top: 0;
    left: 0;

    /*display: none;*/
    .left_nav {
      position: absolute;
      outline: none;
      background-color: #004275;
      box-shadow: 20px 0 34px 0 rgb(0 16 34 / 13%);
      width: 222px;
      height: 100%;
      overflow: hidden;
      color: #ffffff;

      .left_nav_header {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 20px;
        height: 48px;

        .left_nav_header_btn {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #00518f;
          width: 100%;
          height: 100%;

          .left_nav_header_text {
            padding-left: 20px;
            width: calc(100% - 24px);
            color: #fff;
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .left_nav_content {
        display: flex;
        align-items: flex-start;
        width: 100%;
        height: calc(100% - 48px);

        .first_menu {
          width: 222px;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;

          li {
            padding: 0 20px;
            transition: background-color 0.6s;

            div {
              display: flex;
              align-items: center;
              width: 100%;
              height: 55px;
              cursor: pointer;
              position: relative;

              .menu_icon {
                width: 16px;
                height: 16px;
                overflow: hidden;
              }

              .menu_name {
                padding-left: 12px;
                padding-right: 22px;
                width: 100%;
                font-size: 16px;
                color: #fff;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .arrow_right {
                position: absolute;
                right: 8px;
                top: 20px;
                width: 16px;
                height: 16px;
              }
            }
          }

          li:hover {
            background-color: #0091ff;
          }

          .active_menu {
            background-color: #0091ff;
          }
        }
      }
    }
  }

</style>
