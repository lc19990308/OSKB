<template>
  <div class="app-header-shell">
    <el-tooltip
      class="item"
      :open-delay="1000"
      effect="dark"
      :content="sidebarCollapse ? '展开' : '收起'"
      placement="bottom"
      v-if="!hideMenus"
    >
      <div class="sidebar-collapse-btn" @click="setSidebarCollapse">
        <i
          class="iconfont sidebar-collapse-icon"
          :class="['iconmenuclose', { rotate: sidebarCollapse }]"
        ></i>
      </div>
    </el-tooltip>
    <div class="aside-logo-wrap" v-if="hideMenus">
      <img :src="asideSmallLogoUrl" class="small" alt="" />
    </div>
    <Project
      v-if="routePath !== '/project/conf/list'"
      v-show="
        showProjectSelect &&
        !hideProjectList.includes(routePath) &&
        routePath !== '/'
      "
    ></Project>
    <el-breadcrumb separator="/" class="breadcrumb">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item
          :key="'-1-breadcrumb'"
          v-if="showProjectSelect && !hideProjectList.includes(routePath)"
        ></el-breadcrumb-item>
        <el-breadcrumb-item
          :key="'-1-breadcrumb'"
          v-else
          :to="userPower.includes(2600) ? defaultPath : null"
        >
          <i
            class="iconfont iconzhandian"
            :class="{ 'is-active': routePath === defaultPath }"
          ></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="(val, key) in routeMatched"
          :key="key + '-breadcrumb'"
          v-show="!!val.name"
          :to="val.path"
          >{{ val.name }}</el-breadcrumb-item
        >
      </transition-group>
    </el-breadcrumb>
    <div class="right clearfix">
      <!-- <div class="header-logo">
        <img :src="cnnvdImage" alt="" />
      </div>
      <div class="header-logo">
        <img :src="compatible" alt="" />
      </div> -->
      <!--      <div class="header-btn"  @click="system">-->
      <!--        <i class="iconfont iconcelve"></i>-->
      <!--      </div>-->
      <div class="header-btn" @click="toSearch" v-if="authorityFilter(2500)">
        <i class="iconfont iconsousuo"></i>
      </div>
      <message v-if="authorityFilter(300)"></message>
      <div class="header-btn" @click="toSystem" v-if="authorityFilter(2200)">
        <i class="iconfont iconcelve"></i>
      </div>
      <el-dropdown trigger="click" placement="bottom">
        <div class="el-dropdown-link user-info">
          <div class="user-head">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconyonghu"></use>
            </svg>
          </div>
          {{ userInfo.username
          }}<i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item
            v-for="(item, index) in menus"
            :key="index"
            v-show="!item.$hide"
          >
            <div @click="routerLink(item.path)">
              <i class="iconfont" :class="item.icon"></i>
              {{ item.name }}
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="iconfont iconshouquan_1"></i>
            授权到期 {{ licenseExpireTime }}
          </el-dropdown-item>
          <el-dropdown-item divided>
            <div @click="loginOut">
              <i class="iconfont icontuichu"></i>
              退出
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import Message from "@/components/public/Layout/Message";
import Project from "@/components/public/Layout/Project";
import { mapState } from "vuex";
import { MENUS, hideProjectList } from "@/utils/conf";
import qs from "qs";

export default {
  name: "AppHeader",
  components: {
    Message,
    Project,
  },
  data() {
    return {
      hideProjectList,
      asideSmallLogoUrl: require("@/assets/images/confimg/logo.png"),
      menus: [
        {
          icon: "iconaccount",
          name: "个人中心",
          path: "/account",
          powerId: 200,
        },
        {
          icon: "iconzhanghao",
          name: "账号管理",
          path: "/user/account",
          powerId: 1900,
        },
        {
          icon: "iconzidingyi",
          name: "日志审计",
          path: "/log",
          powerId: 2100,
        },
        {
          icon: "iconxiaoxi",
          name: "消息通知",
          path: "/message/main",
          powerId: 300,
        },
        {
          icon: "iconguanyu",
          name: "关于系统",
          path: "/update",
          powerId: 2250,
        },
      ],
      allPath: [],
    };
  },
  methods: {
    // 组件库及漏洞库查询
    toSearch() {
      this.$router.push("/search");
    },

    // 系统设置
    toSystem() {
      this.$router.push("/system");
    },

    // 帮助中心
    help() {
      this.$router.push("/help");
    },

    // 跳转
    routerLink(path) {
      if (!path) return;
      this.$router.push({
        path: path,
        params: {
          back: 1,
        },
      });
    },

    // 导航收缩
    setSidebarCollapse() {
      this.$store.dispatch("setSidebarCollapse");
    },
    // // 退出登录
    // async loginOut () {
    //   await this.$store.dispatch('loginOut', this.loginType !== 1)
    //   if (this.loginType === 1){
    //     const params = qs.stringify({
    //       client_id: this.ossoidcProperties.keycloak.clientId,
    //       post_logout_redirect_uri: encodeURIComponent(location.origin + '/login')
    //     }, { encode:false })
    //     window.open(this.ossoidcProperties.keycloak.logoutUrl + '?' + params, '_self')
    //   }
    // },
    // 退出登录
    async loginOut() {
      await this.$store.dispatch("loginOut");
    },

    // 获取到所有的路径
    getAllPath(menus) {
      this.allPath = [];
      const func = (menus) => {
        menus.forEach((item) => {
          if (
            !item.isPublic &&
            Object.prototype.hasOwnProperty.call(item, "submenu")
          ) {
            func(item.submenu);
          }
          if (
            !item.isPublic &&
            Object.prototype.hasOwnProperty.call(item, "href") &&
            item.href !== "#"
          ) {
            this.allPath.push(item.href);
          }
        });
      };
      func(menus);
    },
  },
  computed: {
    routeMatched() {
      return this.$route.meta.breadcrumb || [];
    },
    ...mapState({
      sidebarCollapse: (state) => state.home.sidebarCollapse,
      hideMenus: (state) => state.home.hideMenus,
      userInfo: (state) => state.login.userInfo,
      userPower: (state) => state.login.userPower,
      defaultPath: (state) => state.home.defaultPath,
      ossoidcProperties: (state) => state.site.ossoidcProperties,
      loginType: (state) => state.site.loginType,
      licenseExpireTime: (state) => state.site.licenseExpireTime,
    }),
    showProjectSelect() {
      const path = this.$route.path;
      return this.allPath.some((item) => {
        return path.indexOf(item) !== -1 || path === "/";
      });
    },
    routePath() {
      return this.$route.path;
    },
    headerBackgroundStyle() {
      return {
        backgroundImage: `linear-gradient(90deg, rgba(250, 253, 255, 0.84) 0%, rgba(245, 250, 253, 0.66) 32%, rgba(241, 247, 251, 0.8) 100%), url(${this.headerBg})`,
      };
    },
    ssoUrl() {
      return this.$store.state.site.ssoUrl;
    },
  },
  created() {
    this.getAllPath(MENUS);
  },
  mounted() {
    if (this.userPower) {
      this.menus.forEach((item) => {
        if (item.powerId && !this.userPower.includes(item.powerId)) {
          this.$set(item, "$hide", true);
        }
      });
    }
  },
};
</script>

<style lang="scss">
#app .app-header-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px 0 10px;
  box-sizing: border-box;
  overflow: hidden;
  background:
    radial-gradient(circle at 28% -120%, rgba(216, 164, 71, 0.18) 0%, transparent 52%),
    linear-gradient(90deg, #1c2129 0%, #2a3038 54%, #343942 100%) !important;
  border-bottom: 1px solid rgba(231, 194, 119, 0.18);
}

.app-header-bg {
  position: absolute;
  inset: 0;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 1;
  pointer-events: none;
}

.app-header-shell::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
      90deg,
      rgba(231, 194, 119, 0.08) 0%,
      transparent 28%,
      rgba(255, 255, 255, 0.05) 100%
    ),
    repeating-linear-gradient(
      90deg,
      rgba(231, 194, 119, 0.06) 0 1px,
      transparent 1px 48px
    );
  pointer-events: none;
}

.app-header-shell > * {
  position: relative;
  z-index: 1;
}

.app-header-shell .right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-header-shell .breadcrumb {
  margin-left: 10px;
}

.app-header-shell .sidebar-collapse-btn,
.app-header-shell .user-info,
.app-header-shell .header-btn {
  border-radius: 12px;
}

.header-logo {
  display: flex;
  align-items: center;
  margin-right: 8px;
  margin-top: 0;
  img {
    height: 28px;
    display: block;
    filter: drop-shadow(0 4px 10px rgba(5, 20, 36, 0.12));
  }
}
.breadcrumb {
  display: inline-block;
  margin-left: 6px;
  vertical-align: middle;

  .el-breadcrumb__inner {
    color: rgba(224, 220, 210, 0.78);
    font-weight: 500;
  }

  .is-link {
    color: rgba(248, 244, 234, 0.92);
    font-weight: 600;
  }

  .el-breadcrumb__inner:last-child,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner.is-link {
    color: #ffffff;
    font-weight: 700;
    text-shadow: 0 0 10px rgba(231, 194, 119, 0.18);
  }

  .el-breadcrumb__separator {
    color: rgba(205, 191, 162, 0.62);
  }

  .iconfont,
  .el-icon-house {
    color: rgba(237, 229, 211, 0.86);
  }

  .iconzhandian {
    color: rgba(248, 239, 220, 0.96);
  }

  .iconzhandian.is-active {
    color: #ffffff;
    text-shadow: 0 0 10px rgba(231, 194, 119, 0.2);
  }
}

.user-info,
.sidebar-collapse-btn {
  vertical-align: middle;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
}

.user-info {
  height: 36px;
  padding: 0 14px 0 10px;
  margin-bottom: 0;
  color: rgba(250, 247, 239, 0.92);
  border: 1px solid rgba(231, 194, 119, 0.22);
  background: rgba(39, 42, 48, 0.68);
}

.sidebar-collapse-icon {
  font-size: 18px;
}

.sidebar-collapse-btn {
  display: inline-block;
  width: 34px;
  height: 34px;
  padding: 0;
  margin-right: 8px;
  background: linear-gradient(
    180deg,
    #b7791f 0%,
    #8f5a18 100%
  );
  border: 1px solid rgba(231, 194, 119, 0.32);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    display: inline-block;
    transition: all 0.3s;
    color: #fff7e7;
    font-size: 14px;
  }
  .rotate {
    transform: rotate(180deg);
  }
}

.user-dropdown {
  min-width: 200px;
  background: radial-gradient(
      circle at top,
      rgba(216, 164, 71, 0.14) 0,
      transparent 36%
    ),
    linear-gradient(
      180deg,
      rgba(45, 47, 53, 0.98) 0%,
      rgba(27, 30, 36, 0.98) 100%
    );
  border: 1px solid rgba(231, 194, 119, 0.24);
  box-shadow: 0 18px 48px rgba(15, 17, 21, 0.34);
  overflow: hidden;
}

.header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  cursor: pointer;
  color: rgba(241, 238, 230, 0.86);
  i {
    font-size: 18px;
  }
}

.user-head {
  width: 30px;
  height: 30px;
  margin-right: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    height: 30px;
    width: 30px;
  }
}

.aside-logo-wrap {
  min-width: 65px;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  height: 65px;
  background-image: -webkit-linear-gradient(left, #1c2129 10%, #343942 100%);
  background-image: -o-linear-gradient(left, #1c2129 10%, #343942 100%);
  background-image: linear-gradient(to right, #1c2129 10%, #343942 100%);
  background-repeat: repeat-x;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#152233', endColorstr='#1A3A5C', GradientType=0);
  filter: none;

  img {
    max-width: 48px;
    max-height: 48px;
    margin: auto;
    height: 13px;
  }
}

.user-dropdown .el-dropdown-menu__item {
  color: rgba(250, 247, 239, 0.92);
  line-height: 42px;
  padding: 0 18px;
  background: transparent;
  transition: background 0.2s ease, color 0.2s ease;
}

.user-dropdown .el-dropdown-menu__item:hover {
  background: rgba(196, 139, 43, 0.22);
  color: #fff;
}

.user-dropdown .el-dropdown-menu__item.is-disabled {
  color: rgba(250, 247, 239, 0.44);
}

.user-dropdown .el-dropdown-menu__item--divided {
  margin-top: 0;
  border-top: 1px solid rgba(231, 194, 119, 0.16);
}

.user-dropdown .el-dropdown-menu__item--divided:before {
  display: none;
}
</style>
