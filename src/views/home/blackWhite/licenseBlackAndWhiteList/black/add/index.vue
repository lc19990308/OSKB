<template>
  <div class="view-content" :style="{paddingBottom: activeTab === '/black-white/license/black/add/quick' ? '0 !important' : '20px !important'}">
    <div class="header-warp" style="margin-bottom: 30px;">
      <icon-button tooltip-disabled el-icon="el-icon-back" radius @click="$router.push({ path: '/black-white/license/main/black/list' })"></icon-button>
      添加许可证黑名单
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'index',
  data () {
    return {
      activeTab: this.$route.path
    }
  }
}
</script>
<style lang="scss" scoped>
.view-content {
  padding: 0 0 20px !important;
}

.header-warp {
  border-bottom: 1px solid #dcdee0;
  height: 50px;
  padding-left: 20px;
  display: flex;
  align-items: center;
  color: #333;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0.4px;

  i {
    margin-top: 2px;
    font-weight: bold;
    margin-right: 8px;
  }
}

.tabs-warp {
  width: 200px;
  margin: 0 auto;
}

:deep(.el-tabs__nav-wrap::after) {
  width: 0 !important;
}
</style>
