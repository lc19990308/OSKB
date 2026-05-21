<template>
  <el-dialog
    title="漏洞详情"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="900px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <div class="body">
      <el-row :gutter="22">
        <el-col :span="5" class="text-right">CVE编号：</el-col>
        <el-col :span="16">{{ data.cveId || '-' }}</el-col>
      </el-row>
      <el-row :gutter="22">
        <el-col :span="5" class="text-right">CNNVD编号：</el-col>
        <el-col :span="16">{{ data.cnnvdId || '-' }}</el-col>
      </el-row>
      <el-row :gutter="22">
        <el-col :span="5" class="text-right">CWE编号：</el-col>
        <el-col :span="16">{{ data.cweId || '-' }}</el-col>
      </el-row>
      <el-row :gutter="22">
        <el-col :span="5" class="text-right">利用难度：</el-col>
        <el-col :span="16">
          {{ data.exploitLevel === 0 ? '困难' : '' }}
          {{ data.exploitLevel === 1 ? '容易' : '' }}
        </el-col>
      </el-row>
      <el-row :gutter="22">
        <el-col :span="5" class="text-right">漏洞名称：</el-col>
        <el-col :span="16">{{ data.name || '-' }}</el-col>
      </el-row>
      <el-row :gutter="22">
        <el-col :span="5" class="text-right">发布时间：</el-col>
        <el-col :span="16">{{ data.releaseDate || '-' }}</el-col>
      </el-row>
      <el-row :gutter="22">
        <el-col :span="5" class="text-right">更新时间：</el-col>
        <el-col :span="16">{{ data.updateDate || '-' }}</el-col>
      </el-row>
      <el-row :gutter="22">
        <el-col :span="5" class="text-right">漏洞描述：</el-col>
        <el-col :span="16">{{ data.description || '-' }}</el-col>
      </el-row>
      <el-row :gutter="22">
        <el-col :span="5" class="text-right">修复建议：</el-col>
        <el-col :span="16">{{ data.suggestion || '-' }}</el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="medium">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { vulDetail } from '@/api/home/search'

export default {
  name: 'DialogVulDetail',
  data () {
    return {
      dialogVisible: false,
      data: {},
      id: null,
      project: this.$store.state.home.project
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      this.data = {}
      done()
    },

    // 初始化详情
    initDetail () {
      vulDetail({
        id: this.id
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

  .refs-list {
    border-bottom: 1px solid #ebebeb;
    padding: 10px 0;

    &:last-child {
      border-bottom: 0;
    }

    &:first-child {
      padding-top: 0;
    }

    p {
      margin: 0;
    }

    a {
      color: #8B5CF6;
    }
  }
}
</style>
