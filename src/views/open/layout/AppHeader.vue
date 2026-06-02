<template>
  <div>
    <div class="aside-logo-wrap">
      <img src="@/assets/images/logo_solid.png" class="small" alt="">
    </div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item :key="'-1-breadcrumb'" :to="defaultPath">
          <i class="iconfont iconzhandian"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="(val,key) in routeMatched"
          :key="key + '-breadcrumb'"
          v-show="!!val.name"
        >{{ val.name }}
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <div class="right clearfix">
      <div class="header-logo">
        <img :src="cnnvdImage" alt="">
      </div>
      <div class="header-logo">
        <img :src="compatible" alt="">
      </div>
      <div class="el-dropdown-link user-info" @click="$router.push('/')" style="display: inline-block;">
        <div class="user-head">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconyonghu"></use>
          </svg>
        </div>
        <el-link :underline="false" class="p-r-5" type="primary">
          {{ get(userInfo, 'username', '登录') }}
        </el-link>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'OpenAppHeader',
  data () {
    return {
      compatible: require('@/assets/images/compatible.jpg'),
      cnnvdImage: require('@/assets/images/CNNVD.png'),
      asideSmallLogoUrl: require('@/assets/images/confimg/logo.png'),
      allPath: []
    }
  },
  computed: {
    routeMatched () {
      return this.$route.meta.breadcrumb || []
    },
    ...mapState({
      userInfo: state => state.login.userInfo,
      defaultPath: state => state.home.defaultPath
    })
  }
}
</script>

<style lang="scss">
.header-logo {
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

  .is-link {
    color: #2C5F8A;
    font-weight: 500;
  }
}

.user-info,
.sidebar-collapse-btn {
  vertical-align: middle;
  cursor: pointer;
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
}

.user-dropdown {
  min-width: 200px;
}

.header-btn {
  float: left;
  padding: 0 10px;
  cursor: pointer;
  color: #666;

  i {
    font-size: 18px;
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
  display: flex;
  margin-right: 20px;
  float: left;
  height: 65px;
  background: #fff !important;

  img {
    margin: auto !important;
    max-width: initial !important;
    max-height: initial !important;
    height: initial !important;
  }
}
</style>
