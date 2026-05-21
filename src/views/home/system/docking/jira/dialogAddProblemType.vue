<template>
  <el-dialog
    :title="type === 'add'?'添加类型':'编辑类型'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :append-to-body="true"
    width="600px"
    @open="open"
    :before-close="handleClose">
    <el-form :model="form"
             label-width="150px"
             :rules="rules"
             :validate-on-rule-change="false"
             ref="addType"
             size="medium"
             label-position="left">
      <el-form-item label="jira平台字段：" prop="fieldKey">
        <el-input v-model="form.fieldKey" placeholder="请输入jira平台字段"></el-input>
      </el-form-item>
      <el-form-item label="本平台字段：" prop="id">
        <el-select v-model="form.id" style="width: 100%;" placeholder="请选择本平台字段">
          <el-option
            v-for="item in valueList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据类型：" prop="type">
        <el-select v-model="form.type" style="width: 100%;" placeholder="请选择数据类型">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getList } from '@/api/home/system/docking/jira'

export default {
  name: 'DialogAddType',
  props: {
    activeData: {
      type: Object,
      default: function () {}
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        fieldKey: '',
        type: '',
        id: ''
      },
      type: '',
      typeList: [{
        value: 'radio',
        text: 'radio'
      }, {
        value: 'textarea',
        text: 'textarea'
      }],
      valueList: [],
      valueListChinese: ['漏洞等级', '漏洞建议', '漏洞危害', '漏洞名称', '漏洞描述', '漏洞详情', '漏洞分类', '漏洞地址'],
      rules: {
        fieldKey: [
          { required: true, message: '请输入jira平台字段', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择本平台字段', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      this.$refs.addType.resetFields()
      done()
    },

    // 提交
    confirm () {
      this.$refs.addType.validate((valid) => {
        if (valid) {
          this.$refs.addType.clearValidate()
          this.dialogVisible = false
          if (this.type === 'add') {
            this.$emit('add', this.form)
            this.$message.success('添加成功')
          } else {
            this.$emit('edit', this.form)
            this.$message.success('修改成功')
          }
        } else {
          return false
        }
      })
    },

    // 取消
    cancel () {
      this.$refs.addType.resetFields()
      this.dialogVisible = false
    },

    // 获取本平台字段列表
    getList () {
      getList({
        loading: false
      }).then(response => {
        this.valueList = response.data
      }).catch(error => {
        if (error.message) {
          this.$message.error(error.message)
        }
      })
    },
    // 打开窗口时的回调
    open () {
      this.form = {
        fieldKey: '',
        type: '',
        id: ''
      }

      if (this.type === 'edit') {
        this.form = {
          ...this.$props.activeData
        }
      }
      this.getList()
      this.$nextTick(() => {
        this.$refs.addType.clearValidate()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.collapse-panel-body {
  height: 200px !important;
}

.el-form {
  padding: 15px 110px 0 40px;
}

.dialog-footer {
  height: 70px !important;
}
</style>
