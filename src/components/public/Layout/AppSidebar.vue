<template>
  <div class="sidebar-wrap" :class="classObj" v-if="!hideMenus">
    <div class="aside sidebar-container">
      <div class="aside-logo" @click="$router.push('/')">
        <img v-show="!!navLogoUrl && !sidebarCollapse" :src="navLogoUrl" alt="">
        <img v-show="!!navLogoUrl && sidebarCollapse" :src="navLogoMiniUrl" class="small" alt="">
      </div>
      <el-scrollbar>
        <el-aside width="auto">
          <el-menu
              @open="handleOpen"
              @close="handleClose"
              :default-active="routePath"
              :router="true"
              :collapse="sidebarCollapse"
              :default-openeds="openeds"
          >
            <template v-for="(item,index) in menus">
              <template v-if="hasShowMenu(item)">
                <li :key="index" :index="index" v-if="item.hasOwnProperty('heading') && item.heading && !sidebarCollapse" class="menus-header">
                  {{ item.text }}
                </li>
                <template v-for="(ite,idx) in item.submenu">
                  <template v-if="hasShowMenu(ite)">
                    <el-submenu v-if="ite.hasOwnProperty('submenu')" :key="index + '-' + idx" :index="index + '-' + idx">
                      <template slot="title">
                        <i :class="['iconfont','m-r','el-icon-',ite.icon]" class="m-r-5"></i>
                        <span slot="title">{{ ite.text }}</span>
                      </template>
                      <template v-for="(it,id) in ite.submenu">
                        <el-menu-item
                            style="padding-left: 51px;"
                            :index="index + '-' + idx + '-' + id"
                            :key="it.href"
                            :route="it.href"
                            :class="routePath.indexOf(it.href) === 0 ? 'is-active' : ''"
                            v-if="hasShowMenu(it)"
                            >{{ it.text }}</el-menu-item>
                      </template>
                    </el-submenu>
                    <el-menu-item
                        v-else
                        :key="index + '-' + idx"
                        :index="ite.href"
                        :route="ite.href"
                        :class="routePath.indexOf(ite.href) === 0 ? 'is-active' : ''">
                      <i :class="['iconfont','m-r','el-icon-',ite.icon]" class="m-r-5"></i>
                      <span slot="title">{{ ite.text }}</span>
                    </el-menu-item>
                  </template>
                </template>
              </template>
            </template>
          </el-menu>
        </el-aside>
      </el-scrollbar>
    </div>
    <div class="drawer-bg" @click="setSidebarCollapse"/>
  </div>
</template>

<script>
import { MENUS } from '@/utils/conf'
import { mapState } from 'vuex'
import { cloneDeep } from "lodash-es";

export default {
  name: 'AppSidebar',
  data () {
    return {
      menus: cloneDeep(MENUS),
      openeds: ['2-0'],
      openedsDf: ['2-0'],
      asideLogoUrl: require('@/assets/images/confimg/nav_logo.png'),
      asideSmallLogoUrl: require('@/assets/images/confimg/logo.png'),
      hideMenus: false
    }
  },
  watch: {
    '$store.state.home.sidebarCollapse' (n) {
      if (n) {
        this.openeds = []
      } else {
        this.openeds = this.openedsDf
      }
    }
  },
  computed: {
    ...mapState({
      navLogoUrl: state => state.site.navLogoUrl,
      navLogoMiniUrl: state => state.site.foldNavLogo,
      homologyEnable: state => state.site.homologyEnable,
      imageEnable: state => state.site.imageEnable,
      binaryEnable: state => state.site.binaryEnable,
      sourceCheckEnable: state => state.site.sourceCheckEnable,
      sidebarCollapse: state => state.home.sidebarCollapse,
      userPower: state => state.login.userPower,
    }),
    classObj () {
      return {
        hideSidebar: this.sidebarCollapse,
        openSidebar: !this.sidebarCollapse
      }
    },
    routePath () {
      return this.$route.path
    },

    hasShowMenu() {
      const binaryEnable = this.binaryEnable;
      const homologyEnable = this.homologyEnable;
      const imageEnable = this.imageEnable;
      const sourceCheckEnable = this.sourceCheckEnable;
      return (item) => {
        if (item.text === '二进制成分分析' && !binaryEnable) {
          return false
        }
        if (item.href === '/scan/app/code' && (!homologyEnable || sourceCheckEnable)) {
          return false
        }
        if (item.href === '/scan/app/v4_code' && !sourceCheckEnable) {
          return  false
        }
        if (item.text === '镜像安全扫描' && !imageEnable) {
          return false
        }
        return item.$show
      }
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      if (this.openedsDf.indexOf(key) === -1) {
        this.openedsDf.push(key)
      }
    },
    handleClose (key, keyPath) {
      if (this.openedsDf.indexOf(key) !== -1) {
        this.openedsDf.splice(this.openedsDf.indexOf(key), 1)
      }
    },
    initMenus () {
      const func = (item) => {
        let hasPower = false
        item.forEach(it => {
          this.$set(it, '$show', false)
          if (!it.isPublic) {
            if (it.ops) {
              this.$set(it, '$show', func(it.ops))
              if (it.$show) {
                hasPower = true
              }
            } else if (it.submenu) {
              this.$set(it, '$show', func(it.submenu))
              if (it.$show) {
                hasPower = true
              }
            } else if (it.powerId !== undefined) {
              if (this.userPower.indexOf(it.powerId) !== -1) {
                this.$set(it, '$show', true)
                hasPower = true
              }
            }

            if (it.hideSubmenu) {
              delete it.submenu
            }
          }
        })
        return hasPower
      }
      func(this.menus)
      this.hideMenus = this.menus.every(item => {
        return item.isPublic ? true : !item.$show
      })

      this.$store.dispatch('setHideMenus', this.hideMenus)
    },

    // 导航收缩
    setSidebarCollapse () {
      this.$store.dispatch('setSidebarCollapse')
    }
  },

  mounted () {
    this.initMenus()
  }
}
</script>

<style scoped lang="scss">
:deep(.horizontal-collapse-transition) {
  transition: 0.2s width ease;
}
.aside{
  background-image: -webkit-linear-gradient(left, #3B0764 10%, #7C3AED 100%);
  background-image: -o-linear-gradient(left, #3B0764 10%, #7C3AED 100%);
  background-image: linear-gradient(to right, #3B0764 10%, #7C3AED 100%);
  background-repeat: repeat-x;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#3B0764', endColorstr='#7C3AED', GradientType=0);
  filter: none;
  //box-shadow: 9px 1px 26px -13px #6a8fb0;
  position: relative;
  z-index: 999;
  .aside-logo{
    width: auto;
    height: 65px;
    position: relative;
    cursor: pointer;
    img{
      max-width: 80%;
      max-height: 80%;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      margin: auto 0 auto 6%;
      display: block;
      &.small{
        margin: auto
      }
    }
  }
  .el-scrollbar{
    height: calc(100% - 65px);
    box-sizing: border-box;
    .el-scrollbar__wrap{
      margin-top: 0;
      height: 100%;
      .el-scrollbar__view{
        .el-aside {
          font-size: 12px;
          .el-menu {
            color: #C4B5FD;
            .menus-header{
              padding: 0 20px;
              height: 45px;
              line-height: 45px;
            }
            &:not(.el-menu--collapse) {
              width: 200px;
              min-height: 400px;
              @media (max-width: 1440px){
                width: 180px;
              }
            }

          }
        }
      }
    }
  }
}
.menus-header {
  // border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 13px;
  padding-top: 13px !important;
  position: relative;
  &::before {
    content: "";
    display: block;
    width: 86%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    position: absolute;
    top: 0;
    left: 7%;
  }

  &:first-child {
    margin-top: 5px !important;
    &::before {
      background-color: rgba(255, 255, 255, 0);

    }
  }
}
</style>
