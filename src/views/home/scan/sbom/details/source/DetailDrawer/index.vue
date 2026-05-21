<template>
  <el-drawer
    title="开源项目信息"
    size="60%" :visible.sync="drawer"
    @open="open"
    custom-class="detail-drawer"
    :with-header="true">
    <el-scrollbar class="scrollbar-hide-x">
      <el-row class="content" :gutter="20">
        <el-col :span="12">
          <base-info :data="baseInfo"></base-info>
        </el-col>
        <el-col :span="12">
          <license-info :list="licenseList"></license-info>
        </el-col>
        <el-col :span="24">
          <h3 class="headline">匹配文件信息</h3>
          <file-info :id="id" :task-id="taskId" :project-id="projectId"></file-info>
        </el-col>
      </el-row>
    </el-scrollbar>
  </el-drawer>
</template>
<script>
import BaseInfo from './BaseInfo.vue'
import LicenseInfo from './LicenseInfo.vue'
import FileInfo from './FileInfo.vue'
import {
  sourceDetail
} from '@/api/home/scan/app'

export default {
  name: 'DetailDrawer',
  components: {
    BaseInfo,
    LicenseInfo,
    FileInfo
  },
  data () {
    return {
      drawer: false,
      id: null,
      projectId: this.$route.query.project,
      taskId: this.$route.query.task,
      baseInfo: {},
      licenseList: []
    }
  },
  methods: {
    // 初始化数据
    init () {
      sourceDetail({
        projectId: this.projectId,
        sourceProjectInfoId: this.id,
        loading: false
      }).then(response => {
        const data = response.data
        this.baseInfo = {
          ...data
        }
        this.licenseList = data.licenseList
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    open () {
      this.init()
    }
  }
}

</script>
<style scoped lang="scss">
:deep(.detail-drawer) {
  .el-drawer__body {
    height: 100%;

    .el-scrollbar {
      height: 100%;
    }
  }

  .el-drawer__header {
    background: #8B5CF6;
    color: #fff;
    font-size: 16px;
    padding: 15px 20px;
    margin-bottom: 0;
  }
}

.content {
  padding: 20px;

  .headline {
    margin-top: 20px;
  }
}

</style>
