<template>
  <el-dialog
    title="修改备注"
    width="600px"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true">
    <el-form
      label-width="140px"
      size="medium"
      ref="form"
      style="padding-right: 50px;"
      label-position="right"
    >
      <el-form-item prop="precision" label="漏洞等级：">
          <el-select class="w-full" v-model="fromData.securityLevelId">
            <el-option v-for="item in levelOptions" :value="item.value" :label="item.text" :key="item.value"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item prop="precision" label="备注：" style="margin-bottom: 0px">
        <el-input
          class="w-full"
          type="textarea"
          placeholder="请输入备注"
          :maxlength="1000"
          v-model="fromData.remark"
          :rows="3"
          :show-word-limit="true"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" style="width: 80px;" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="dialogVisible = false" style="width: 80px;" size="medium">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editVulRemark } from '@/api/home/scan/app/index.js'
import { to } from '@/utils'

export default {
  name: 'CustomizeVulRemarkDialog',
  data () {
    return {
      dialogVisible: false,
      fromData: {
        remark: '',
        securityLevelId: 1,
        xmirrorId: undefined
      },
      source: undefined,
      levelOptions: [
        {
          value: 1,
          text: '严重'
        },
        {
          value: 2,
          text: '高危'
        },
        {
          value: 3,
          text: '中危'
        },
        {
          value: 4,
          text: '低危'
        }
      ]
    }
  },
  methods: {
    useDialog (row) {
      this.source = row
      this.fromData.remark = row.remark
      this.fromData.securityLevelId = row.securityLevel || row.securityLevelId || 4
      this.fromData.xmirrorId = row.xmirrorId
      this.dialogVisible = true
    },
    async confirm () {
      const [error] = await to(editVulRemark(this.fromData))
      if (error && error.message) return this.$message.error(error.message)
      this.$message.success('操作成功！')
      this.source.remark = this.fromData.remark
      this.source.securityLevel = this.fromData.securityLevelId
      this.source.securityLevelId = this.fromData.securityLevelId
      this.dialogVisible = false
    }
  }
}
</script>
