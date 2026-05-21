<template>
  <div class="view-content" :style="{paddingBottom: activeTab === '/black-white/loophole/add/quick' ? '0 !important' : '20px !important'}">
    <div class="header-warp m-b-5">
      <icon-button tooltip-disabled el-icon="el-icon-back" radius @click="$router.push({ path: '/black-white/loophole/main/white/list' })"></icon-button>
      添加漏洞白名单
    </div>
    <div class="tabs-warp">
      <el-tabs stretch class="tabs" v-model="activeTab" @tab-click="tabsHandleClick">
        <el-tab-pane v-for="(val,key) in tabs" :key="key" :label="val.label" :name="val.path"></el-tab-pane>
      </el-tabs>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'index',
  data () {
    return {
      activeTab: this.$route.path,
      tabs: [
        {
          label: '快速添加',
          path: '/black-white/loophole/white/add/quick'
        },
        {
          label: '批量添加',
          path: '/black-white/loophole/white/add/batch'
        }
      ]
    }
  },
  methods: {
    tabsHandleClick () {
      this.$router.push({ path: this.activeTab })
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
