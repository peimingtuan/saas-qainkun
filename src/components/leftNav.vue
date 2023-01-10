<template>
  <div class="left_nav_fiexd">
    <div class="left_nav" @blur="$emit('input', false)" ref="leftNav">
      <div class="left_nav_header">
        <div class="left_nav_header_btn">
          <span @click="$emit('input', false)">
            <svg-icon name="menu" color="#ffffff" @click="$emit('input', false)" :size="24"></svg-icon>
          </span>
          <span class="left_nav_header_text">导航栏</span>
        </div>
        <div class="left_nav_header_search">
          <Input iconType="search" placeholder="搜索功能点" v-model="keyword" @input="search" />
          <div class="search_panel" v-if="keyword.length">
            <template v-for="item in searchMenuData">
              <template v-for="child in item.child">
                <template v-for="child1 in child.child">
                  <div
                    class="search_panel_item"
                    @click="handleNav(child1, child, item.child)"
                    :key="child1.id"
                  >
                    <div>{{ child1.authorizationName }}</div>
                    <div>{{ item.productName }}/{{ child.authorizationName }}</div>
                  </div>
                </template>
              </template>
            </template>
          </div>
        </div>
      </div>
      <div class="left_nav_content">
        <ul class="first_menu">
          <li
            v-for="(item, index) in menuTree"
            @mouseenter.capture="mouseover(index)"
            :class="
              currentActiveIdnex == index ? 'active_menu' : ''
            "
            :key="item.id"
          >
            <div>
              <i class="menu_icon">
                <img
                  v-if="item.menuIconKey"
                  style="width: 100%; height: 100%"
                  :src="`${$api.download}/${item.menuIconKey}`"
                  alt
                />
              </i>
              <article class="menu_name">{{ item.productName }}</article>
              <svg-icon name="arrow_right" :size="16" class="arrow_right"></svg-icon>
            </div>
          </li>
        </ul>
        <div class="second-menu" :key="key">
          <div class="second-menu_box">
            <div
              class="second-menu_content"
              v-for="item in menuTree[menuIndex].child"
              :key="item.id"
            >
              <div class="second-menu_title">{{ item.authorizationName }}</div>
              <ul>
                <li
                  v-for="li in item.child"
                  class="second-menu_li"
                  @click="handleNav(li, item, menuTree[menuIndex].child)"
                  :key="li.id"
                >{{ li.authorizationName }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Input } from 'meri-design'
import { createNamespacedHelpers } from 'vuex'
import { createUrl } from '@/utils/tools'
import { updateMicroApp } from '../micro-app'
const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('system')
export default {
  name: 'leftNav',
  components: { Input },
  data () {
    return {
      key: Math.random(),
      menuIndex: 0,
      keyword: '',
      searchMenuData: []
    }
  },
  computed: {
    ...mapState(['menuTree', 'currentActiveIdnex']),
    ...mapGetters(['currenRouterItem'])
  },
  mounted () {
    document
      .getElementsByClassName('left_nav_fiexd')[0]
      .addEventListener('click', this.bodyCloseMenus, true)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.bodyCloseMenus)
  },
  methods: {
    ...mapMutations(['setActiveMeun']),
    bodyCloseMenus (e) {
      if (this.$refs.leftNav && !this.$refs.leftNav.contains(e.target)) {
        this.$emit('input', false)
      }
    },
    mouseover (index) {
      // debugger
      this.setActiveMeun(index)
      this.menuIndex = index
      this.key = Math.random()
    },
    search () {
      const data = JSON.parse(JSON.stringify(this.menuTree))
      this.searchMenuData = data.filter((d) => {
        if (d.child && d.child.length) {
          d.child = d.child.filter((dc) => {
            if (dc.child && dc.child.length) {
              dc.child = dc.child.filter((dcn) => {
                if (dcn.authorizationName.includes(this.keyword)) return dcn
              })
            }
            if (dc.child && dc.child.length) return dc
          })
        }
        if (d.child && d.child.length) return d
      })
    },
    handleNav (li, item, child) {
      const path = createUrl(li)
      this.$router.push({
        path
      })
      updateMicroApp()
      this.$emit('input', false)
    },
    blur () { }
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
    min-width: 640px;
    max-width: 1230px;
    height: 100%;
    overflow: hidden;
    color: #ffffff;
    .left_nav_header {
      display: flex;
      align-items: center;
      padding-left: 16px;
      padding-right: 16px;
      width: 100%;
      height: 48px;
      .left_nav_header_btn {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #00518f;
        width: 196px;
        height: 100%;
        .left_nav_header_text {
          padding-left: 12px;
          width: calc(100% - 24px);
          color: #fff;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .left_nav_header_search {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #00518f;
        position: relative;
        /deep/ .p-input {
          width: 100% !important;
          background-color: #00518f;
          border: 0px !important;
          max-width: unset;
          input {
            color: #ffffff !important;
          }
        }
        .search_panel {
          position: absolute;
          top: 48px;
          width: 100%;
          max-height: 480px;
          background: #00518f;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgb(31 35 41 /100%);
          overflow-y: auto;
          .search_panel_item {
            padding: 16px;
            height: 72px;
            line-height: 20px;
            font-size: 14px;
            div:last-child {
              color: hsla(0, 0%, 100%, 0.8);
            }
          }
          .search_panel_item:hover {
            background: #007cdb;
            cursor: pointer;
          }
        }
      }
    }
    .left_nav_content {
      display: flex;
      align-items: flex-start;
      width: 100%;
      height: calc(100% - 48px);
      .first_menu {
        border-right: 1px solid #00518f;
        width: 240px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        li {
          padding: 0 16px;
          transition: background-color 0.5s;
          div {
            display: flex;
            align-items: center;
            border-bottom: 1px solid #00518f;
            width: 100%;
            height: 55px;
            cursor: pointer;
            padding-right: 22px;

            position: relative;
            .menu_icon {
              width: 16px;
              height: 16px;
              overflow: hidden;
            }
            .menu_name {
              padding-left: 12px;
              padding-right: 22px;
              width: calc(100% - 16px);
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
        .active_menu {
          background-color: #0091ff;
          div {
            border-bottom: 0px;
          }
        }
        li:after,
        li:before {
          box-sizing: border-box;
        }
      }
      .second-menu {
        /*flex: 1;*/
        padding: 0 36px;
        max-width: 1018px;
        min-width: 428px;
        height: 100%;
        overflow-y: auto;
        .second-menu_box {
          width: 100%;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          writing-mode: vertical-lr;
        }
        .second-menu_content {
          writing-mode: horizontal-tb;
          width: 208px;
          padding-right: 36px;
          padding-top: 16px;
          .second-menu_title {
            padding-top: 8px;
            border-bottom: 1px solid #00518f;
            width: 100%;
            height: 38px;
          }
          .second-menu_li:hover{
            color:#ffffff;
            background-color:rgba(255,255,255,.1)
          }
          ul {
            padding-top: 16px;
            padding-bottom: 16px;
            li {
              padding-left: 8px;
              padding-right: 8px;
              width: 100%;
              line-height: 32px;
              color: hsla(0, 0%, 100%, 0.8);
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s;
            }
          }
        }
      }
    }
  }
}
</style>
