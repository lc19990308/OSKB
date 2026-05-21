<template>
  <div>
    <el-tooltip class="item" :open-delay="1000" effect="dark" :content="sidebarCollapse ? '展开' : '收起'" placement="bottom" v-if="!hideMenus">
      <div class="sidebar-collapse-btn" @click="setSidebarCollapse">
        <i class="iconfont sidebar-collapse-icon"
           :class="['iconmenuclose', { rotate:  sidebarCollapse}]"
        ></i>
      </div>
    </el-tooltip>
    <div class="aside-logo-wrap" v-if="hideMenus">
      <img :src="asideSmallLogoUrl" class="small" alt="">
    </div>
    <Project v-if="routePath !== '/project/conf/list'"  v-show="showProjectSelect && !hideProjectList.includes(routePath) && routePath !== '/'"></Project>
    <el-breadcrumb separator="/" class="breadcrumb">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item :key="'-1-breadcrumb'" v-if="showProjectSelect && !hideProjectList.includes(routePath)"></el-breadcrumb-item>
        <el-breadcrumb-item :key="'-1-breadcrumb'" v-else :to="userPower.includes(2600) ? defaultPath : null">
          <i class="iconfont iconzhandian" :style="{color: routePath === defaultPath ? '#333333' : ''}"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item
            v-for="(val,key) in routeMatched"
            :key="key + '-breadcrumb'"
            v-show="!!val.name"
            :to="val.path"
        >{{ val.name }}</el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <div class="right clearfix">
      <div class="header-logo">
        <img :src="cnnvdImage" alt="">
      </div>
      <div class="header-logo">
        <img :src="compatible" alt="">
      </div>
<!--      <div class="header-btn"  @click="system">-->
<!--        <i class="iconfont iconcelve"></i>-->
<!--      </div>-->
      <div class="header-btn"  @click="toSearch" v-if="authorityFilter(2500)">
        <i class="iconfont iconsousuo"></i>
      </div>
      <message v-if="authorityFilter(300)"></message>
      <div class="header-btn"  @click="toSystem" v-if="authorityFilter(2200)">
        <i class="iconfont iconcelve"></i>
      </div>
      <el-dropdown trigger="click" placement="bottom" >
        <div class="el-dropdown-link user-info">
          <div class="user-head">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconyonghu"></use>
            </svg>
          </div>
          {{ userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item v-for="(item, index) in menus" :key="index" v-show="!item.$hide">
            <div @click="routerLink(item.path)">
              <i class="iconfont" :class="item.icon"></i>
              {{ item.name }}
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="iconfont iconshouquan_1"></i>
            授权到期 {{licenseExpireTime}}
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
import Message from '@/components/public/Layout/Message'
import Project from '@/components/public/Layout/Project'
import { mapState } from 'vuex'
import { MENUS, hideProjectList } from '@/utils/conf'
import qs from 'qs'

export default {
  name: 'AppHeader',
  components: {
    Message,
    Project
  },
  data () {
    return {
      hideProjectList,
      compatible: require('@/assets/images/compatible.jpg'),
      cnnvdImage: require('@/assets/images/CNNVD.png'),
      asideSmallLogoUrl: require('@/assets/images/confimg/logo.png'),
      menus: [
        {
          icon: 'iconaccount',
          name: '个人中心',
          path: '/account',
          powerId: 200
        },
        {
          icon: 'iconzhanghao',
          name: '账号管理',
          path: '/user/account',
          powerId: 1900
        },
        {
          icon: 'iconzidingyi',
          name: '日志审计',
          path: '/log',
          powerId: 2100
        },
        {
          icon: 'iconxiaoxi',
          name: '消息通知',
          path: '/message/main',
          powerId: 300
        },
        {
          icon: 'iconguanyu',
          name: '关于系统',
          path: '/update',
          powerId: 2250
        }
      ],
      allPath: []
    }
  },
  methods: {
    // 组件库及漏洞库查询
    toSearch () {
      this.$router.push('/search')
    },

    // 系统设置
    toSystem () {
      this.$router.push('/system')
    },

    // 帮助中心
    help () {
      this.$router.push('/help')
    },

    // 跳转
    routerLink (path) {
      if (!path) return
      this.$router.push({
        path: path,
        params: {
          back: 1
        }
      })
    },

    // 导航收缩
    setSidebarCollapse () {
      this.$store.dispatch('setSidebarCollapse')
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
    async loginOut () {
     await this.$store.dispatch('loginOut')
    },


    // 获取到所有的路径
    getAllPath (menus) {
      this.allPath = []
      const func = (menus) => {
        menus.forEach(item => {
          if (!item.isPublic && Object.prototype.hasOwnProperty.call(item, 'submenu')) {
            func(item.submenu)
          }
          if (!item.isPublic && Object.prototype.hasOwnProperty.call(item, 'href') && item.href !== '#') {
            this.allPath.push(item.href)
          }
        })
      }
      func(menus)
    }
  },
  computed: {
    routeMatched () {
      return this.$route.meta.breadcrumb || []
    },
    ...mapState({
      sidebarCollapse: state => state.home.sidebarCollapse,
      hideMenus: state => state.home.hideMenus,
      userInfo: state => state.login.userInfo,
      userPower: state => state.login.userPower,
      defaultPath: state => state.home.defaultPath,
      ossoidcProperties: state => state.site.ossoidcProperties,
      loginType: state => state.site.loginType,
      licenseExpireTime: state => state.site.licenseExpireTime,
    }),
    showProjectSelect () {
      const path = this.$route.path
      return this.allPath.some(item => {
        return (path.indexOf(item) !== -1 || path === '/')
      })
    },
    routePath () {
      return this.$route.path
    },
    ssoUrl () {
      return this.$store.state.site.ssoUrl
    }
  },
  created () {
    this.getAllPath(MENUS)
  },
  mounted () {
    if (this.userPower) {
      this.menus.forEach(item => {
        if (item.powerId && !this.userPower.includes(item.powerId)) {
          this.$set(item, '$hide', true)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.header-logo{
  float: left;
  margin-top: 13px;
  margin-right: 20px;
  img {
    height: 40px;
  }
}
.breadcrumb {
  display: inline-block;
  margin-left: 6px;
  vertical-align: middle;

  .el-breadcrumb__inner {
    color: #333;
  }

  .el-breadcrumb__inner {
    color: #333;
  }

  .is-link {
    color: $color-primary;
    font-weight: 500;
  }
}

.user-info, .sidebar-collapse-btn {
  vertical-align: middle;
  cursor: pointer;
  margin-bottom: 2px;
  position: relative;
}

.user-info {
  padding: 0 27px 0 20px;
}

.sidebar-collapse-icon {
  font-size: 18px;
}

.sidebar-collapse-btn {
  display: inline-block;
  height: 100%;
  padding: 0 20px;
  i{
    display: inline-block;
    transition: all 0.3s;
  }
  .rotate{
    transform: rotate(180deg);
  }
}

.user-dropdown {
  min-width: 200px;
}

.header-btn {
  float: left;
  padding: 0 10px;
  cursor: pointer;
  color: #666666;
  i{
    font-size:18px
  }
}

.user-head {
  width: 45px;
  height: 45px;
  float: left;
  padding-top: 10px;
  margin-right: 8px;
  cursor: pointer;
  .icon {
    height: 38px;
    width: 38px;
  }
}

.aside-logo-wrap {
  min-width: 65px;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  float: left;
  height: 65px;
  background-image: -webkit-linear-gradient(left, #3B0764 10%, #7C3AED 100%);
  background-image: -o-linear-gradient(left, #3B0764 10%, #7C3AED 100%);
  background-image: linear-gradient(to right, #3B0764 10%, #7C3AED 100%);
  background-repeat: repeat-x;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#3B0764', endColorstr='#7C3AED', GradientType=0);
  filter: none;

  img {
    max-width: 58px;
    max-height: 58px;
    margin: auto;
    height: 13px;
  }
}

</style>
