<template>
  <el-dialog
    :title="type === 'add'?'添加规则':'编辑规则'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="600px"
    @open="open"
    :before-close="handleClose">
    <el-form :model="form" label-width="140px" :rules="rules" ref="addUser" size="medium" label-position="right">
      <el-form-item label="规则应用范围：" prop="applyRange">
        <el-select v-model="form.applyRange" placeholder="请选择规则应用范围">
          <el-option
            v-for="item in ruleApplicationScopeOptions"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用目标：" prop="applyType">
        <el-select v-model="form.applyType" placeholder="请选择应用目标">
          <el-option
            v-for="item in applicationGoalOptions"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="匹配类型：" prop="matchType">
        <el-select v-model="form.matchType" placeholder="请选择匹配类型">
          <el-option
            v-for="item in matchTypeOptions"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组件名规则：" prop="nameRule">
        <el-input v-model="form.nameRule" placeholder="请输入组件名规则"></el-input>
      </el-form-item>
      <el-form-item label="厂商规则：" prop="vendorRule">
        <el-input v-model="form.vendorRule" placeholder="请输入厂商规则"></el-input>
      </el-form-item>
      <el-form-item label="版本号规则：" prop="versionRule">
        <el-input v-model="form.versionRule" placeholder="请输入版本号规则"></el-input>
      </el-form-item>
      <!-- <el-form-item label="许可协议规则：" prop="licenseRule">
        <el-input v-model="form.licenseRule" placeholder="请输入许可协议规则"></el-input>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addComponentRule } from '@/api/home/system/rule/index'

export default {
  name: 'DialogAddUser',
  props: {
    department: {
      type: Object,
      default: function () {}
    }
  },
  data () {
    return {
      loading: false,
      type: 'add',
      dialogVisible: false,
      roleList: [],
      /* 匹配类型 */
      matchTypeOptions: [
        {
          value: 1,
          text: '精准匹配'
        },
        {
          value: 2,
          text: '正则匹配'
        }
      ],
      /* 应用目标 */
      applicationGoalOptions: [
        // {
        //   value: 2,
        //   text: '忽略组件'
        // },
        {
          value: 3,
          text: '黑名单组件'
        },
        {
          value: 4,
          text: '白名单组件'
        }
      ],
      /* 规则应用范围 */
      ruleApplicationScopeOptions: [
        {
          value: 1,
          text: '全项目下组件'
        },
        {
          value: 2,
          text: '全应用包下组件'
        }, {
          value: 3,
          text: '全节点下组件'
        }
      ],
      form: {
        applyRange: '',
        applyType: '',
        matchType: '',
        nameRule: '',
        vendorRule: '',
        versionRule: '',
        licenseRule: ''
      },
      rules: {
        applyRange: [
          { required: true, message: '请选择规则应用范围', trigger: 'change' }
        ],
        applyType: [
          { required: true, message: '请选择应用目标', trigger: 'change' }
        ],
        matchType: [
          { required: true, message: '请选择匹配类型', trigger: 'change' }
        ],
        licenseRule: [
          { required: true, message: '请至少设置一种匹配规则（组件名、厂商、版本号、许可协议）', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      this.$refs.addUser.resetFields()
      done()
    },

    // 提交
    confirm () {
      this.$refs.addUser.validate((valid) => {
        if (valid) {
          this.$refs.addUser.clearValidate()
          if (this.type === 'add') {
            this.submitAdd()
          } else {
            this.submitEdit()
          }
        } else {
          return false
        }
      })
    },

    // 添加账号的时候执行
    submitAdd () {
      addComponentRule({
        ...this.form
      }).then(() => {
        this.$message.success('操作成功！')
        this.dialogVisible = false
        this.$refs.addUser.resetFields()
        this.$emit('callback')
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 编辑账号的时候执行
    submitEdit () {

    },

    // 取消
    cancel () {
      this.$refs.addUser.resetFields()
      this.dialogVisible = false
    },

    // 打开窗口时的回调
    open () {
      this.form = {
        applyRange: '',
        applyType: '',
        matchType: '',
        nameRule: '',
        vendorRule: '',
        versionRule: '',
        licenseRule: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-form {
  padding: 15px 110px 0 40px;
}

.dialog-footer {
  height: 70px !important;
}
</style>
