<template>
  <el-drawer :visible.sync="visible" size="540px" :modal="false">
    <div class="title" slot="title">
      <i class="iconfont iconmoshi text-regular"></i>
      <span class="m-r-15">{{ createStrSuffix(activeApp.name, 20) || '--'}}</span>
      <level-tag class="m-b-5" :level="activeApp.securityLevel"></level-tag>
    </div>
    <el-form label-width="100px" label-position="left" style="padding: 0 25px;">
      <el-form-item label="节点IP">
        {{ activeApp.ip || '-' }}
      </el-form-item>
      <el-form-item label="语言">
        {{ activeApp.language || '-' }}
      </el-form-item>
      <el-form-item label="中间件">
        {{ activeApp.middleware || '-' }}
      </el-form-item>
      <el-form-item label="最近检测时间">
        {{ activeApp.lastScanDate || '-' }}
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  name: 'DescDrawer',
  data () {
    return {
      visible: false,
      activeApp: {}
    }
  },
  methods: {
    open (taskInfo) {
      this.activeApp = taskInfo
      this.visible = true
    }
  }
}
</script>

<style scoped lang="scss">
.title {
  font-weight: 600;
  font-size: 18px;
  color: #333;

  .iconfont {
    font-size: 21px;
    margin-right: 5px;
    vertical-align: middle;
    font-weight: normal;
  }
}

:deep(.el-form-item) {
  margin-bottom: 10px !important;
}
</style>
