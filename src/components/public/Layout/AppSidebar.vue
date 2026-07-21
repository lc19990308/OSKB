<template>
  <div class="sidebar-wrap" :class="classObj" v-if="!hideMenus">
    <div class="aside sidebar-container">
      <div class="aside-logo" @click="$router.push('/')">
        <img class="brand-mark" :src="brandMarkUrl" alt="开源软件评估服务系统">
        <div class="brand-copy" v-show="!sidebarCollapse">
          <strong>开源软件评估</strong>
          <span>开源软件评估服务系统</span>
        </div>
      </div>
      <el-scrollbar>
        <el-aside width="auto">
          <el-menu
              class="app-sidebar-menu"
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
                        <i :class="['menu-icon', 'iconfont', 'el-icon-', ite.icon]"></i>
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
                      <i :class="['menu-icon', 'iconfont', 'el-icon-', ite.icon]"></i>
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
      brandMarkUrl: require('@/assets/images/brand/open-source-evaluation-mark.png'),
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
          return  false
        }
        if (item.href === '/scan/app/code' && (!homologyEnable || sourceCheckEnable)) {
          return false
        }
        if (item.href === '/scan/app/v4_code' && !sourceCheckEnable) {
          return false
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
          if (it.alwaysShow) {
            this.$set(it, '$show', true)
            hasPower = true
          } else if (!it.isPublic) {
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
.sidebar-wrap {
  position: relative;
  width: 210px;

  @media (max-width: 1440px) {
    width: 188px;
  }

  &.hideSidebar {
    width: 56px;

    .aside {
      width: 56px;
    }

    .aside-logo {
      height: 56px;
      padding: 0;
      justify-content: center;

      img {
        max-width: 28px;
        max-height: 28px;
      }
    }

    .el-scrollbar {
      flex: 1;
      min-height: 0;
      height: auto;
    }

    :deep(.app-sidebar-menu) {
      width: 56px !important;
      padding: 0 !important;
    }

    :deep(.app-sidebar-menu.el-menu--collapse > .el-menu-item),
    :deep(.app-sidebar-menu.el-menu--collapse > .el-submenu > .el-submenu__title) {
      width: 48px !important;
      min-width: 48px !important;
      height: 40px !important;
      margin: 3px auto !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center;
      justify-content: center;
    }

    :deep(.app-sidebar-menu.el-menu--collapse > .el-menu-item .menu-icon),
    :deep(.app-sidebar-menu.el-menu--collapse > .el-submenu > .el-submenu__title .menu-icon) {
      width: 18px !important;
      min-width: 18px !important;
      margin: 0 !important;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    :deep(.app-sidebar-menu.el-menu--collapse .el-tooltip) {
      padding: 0 !important;
      text-align: center !important;
    }

    :deep(.app-sidebar-menu.el-menu--collapse > .el-menu-item span),
    :deep(.app-sidebar-menu.el-menu--collapse > .el-submenu > .el-submenu__title span),
    :deep(.app-sidebar-menu.el-menu--collapse > .el-submenu > .el-submenu__title .el-submenu__icon-arrow) {
      display: none !important;
    }
  }
}

.aside {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 999;
  height: 100%;
  background:
    radial-gradient(circle at 18% 0%, rgba(21, 150, 163, 0.2) 0, transparent 34%),
    linear-gradient(180deg, #102833 0%, #123541 54%, #0b5961 100%);
  box-shadow: 12px 0 32px rgba(5, 20, 36, 0.24);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, transparent 28%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 20%);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    left: 10px;
    right: 10px;
    top: 74px;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(111, 240, 224, 0.32) 50%, transparent 100%);
    pointer-events: none;
  }

  .aside-logo {
    flex-shrink: 0;
    height: 74px;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 16px 0 18px;
    box-sizing: border-box;

    img {
      max-width: 82%;
      max-height: 56px;
      display: block;
      filter: drop-shadow(0 10px 18px rgba(5, 20, 36, 0.35));

      &.small {
        margin: 0 auto;
      }
    }
  }

  .brand-mark {
    display: block;
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    border: 0;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 5px 14px rgba(3, 18, 32, 0.2);
    object-fit: cover;
  }

  .el-scrollbar {
    flex: 1;
    min-height: 0;
    height: auto;
    box-sizing: border-box;

    .el-scrollbar__wrap {
      margin-top: 0;
      height: 100%;
      .el-scrollbar__view {
        .el-aside {
          font-size: 12px;

          .el-menu {
            color: #c8e3e0;
            padding: 0;

            .menus-header {
              padding: 0 18px;
              height: 42px;
              line-height: 42px;
              color: #88b7b6;
              letter-spacing: 0.08em;
            }

            &:not(.el-menu--collapse) {
              width: 210px;
              min-height: 400px;

              @media (max-width: 1440px) {
                width: 188px;
              }
            }

            :deep(.el-menu-item),
            :deep(.el-submenu__title) {
              position: relative;
              margin: 4px 8px;
              padding-left: 16px !important;
              padding-right: 16px !important;
              border-radius: 12px;
              height: 44px;
              line-height: 44px;
              border: 1px solid transparent;
              transition: all 0.22s ease;
            }

            :deep(.el-menu-item) {
              color: #d9efed;

              &:hover {
                background: linear-gradient(90deg, rgba(21, 150, 163, 0.2) 0%, rgba(21, 150, 163, 0.07) 100%);
                border-color: rgba(111, 240, 224, 0.22);
                color: #ffffff;
              }

              &.is-active {
                background: linear-gradient(90deg, #087e8b 0%, #0c6971 100%);
                border-color: rgba(111, 240, 224, 0.38);
                box-shadow: inset 3px 0 0 #62e2d9, 0 8px 20px rgba(4, 55, 61, 0.24);
                color: #fff;
              }
            }

            :deep(.el-submenu__title) {
              color: #d9efed;

              &:hover {
                background: linear-gradient(90deg, rgba(21, 150, 163, 0.18) 0%, rgba(21, 150, 163, 0.06) 100%);
                border-color: rgba(111, 240, 224, 0.22);
                color: #ffffff;
              }
            }

            :deep(.el-submenu.is-opened > .el-submenu__title) {
              background: rgba(21, 150, 163, 0.16);
              border-color: rgba(111, 240, 224, 0.2);
              color: #fff;
            }

            :deep(.el-submenu .el-menu) {
              background: transparent;
            }

            :deep(.el-menu-item i),
            :deep(.el-submenu__title i) {
              color: #90c9c4;
            }

            :deep(.menu-icon) {
              width: 18px;
              min-width: 18px;
              margin-right: 10px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              flex-shrink: 0;
            }

            :deep(.el-menu-item.is-active i),
            :deep(.el-menu-item:hover i),
            :deep(.el-submenu__title:hover i) {
              color: #d9fffb;
            }
          }
        }
      }
    }
  }
}

.menus-header {
  margin-top: 14px;
  padding-top: 14px !important;
  position: relative;

  &::before {
    content: "";
    display: block;
    width: 86%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(111, 240, 224, 0.22) 50%, transparent 100%);
    position: absolute;
    top: 0;
    left: 7%;
  }

  &:first-child {
    margin-top: 6px !important;

    &::before {
      background-color: rgba(255, 255, 255, 0);
    }
  }
}

.drawer-bg {
  backdrop-filter: blur(2px);
}
</style>
