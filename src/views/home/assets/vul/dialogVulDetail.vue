<template>
  <el-dialog
    title="漏洞详情"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <div class="body">
      <el-row :gutter="20">
        <el-col :span="6" class="text-right">CVE编号：</el-col>
        <el-col :span="15">{{ data.cveId || '-' }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" class="text-right">CNNVD编号：</el-col>
        <el-col :span="15">{{ data.cnnvdId || '-' }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" class="text-right">CWE编号：</el-col>
        <el-col :span="15">{{ data.cweId || '-' }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" class="text-right">利用难度：</el-col>
        <el-col :span="15">
          {{ data.exploitLevel === 0 ? '困难' : '' }}
          {{ data.exploitLevel === 1 ? '容易' : '' }}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" class="text-right">发布时间：</el-col>
        <el-col :span="15">{{ data.releaseDate || '-' }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" class="text-right">漏洞描述：</el-col>
        <el-col :span="15">{{ data.description || '-' }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" class="text-right">修复建议：</el-col>
        <el-col :span="15">{{ data.suggestion || '-' }}</el-col>
      </el-row>
<!--      <el-row :gutter="20">-->
<!--        <el-col :span="6" class="text-right">受影响组件：</el-col>-->
<!--        <el-col :span="15">-->
<!--          <div v-for="(item, index) in data.affectedComponentList" :key="index +'-1'">{{ item || '-' }}</div>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <el-row :gutter="20">
        <el-col :span="6" class="text-right">受影响项目：</el-col>
        <el-col :span="15">
          <div v-for="(item, index) in data.affectedProjectList" :key="index +'-2'">{{ item || '-' }}</div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="medium">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getVulDetail } from '@/api/home/assets/vul'

export default {
  name: 'DialogVulDetail',
  data () {
    return {
      vulId: '',
      taskId: '',
      project: this.$store.state.home.project,
      dialogVisible: false,
      data: {
        cveId: '',
        cnnvdId: '',
        cweId: '',
        ctime: '',
        description: '',
        suggestion: '',
        affectedComponentList: [],
        affectedProjectList: []
      }
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
    },

    // 初始化详情
    initDetail () {
      if (this.project === null) {
        return 0
      }
      getVulDetail({
        projectId: this.project.id,
        dataVulId: this.vulId,
        taskId: this.taskId
      }).then(response => {
        this.data = response.data
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 取消
    cancel () {
      this.dialogVisible = false
    },

    // 打开窗口时的回调
    open () {
      this.initDetail()
    }
  }
}
</script>

<style scoped lang="scss">
.body .el-row {
  line-height: 34px;
}
</style>
