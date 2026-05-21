<template>
  <el-dialog
    :title="type === 'add'?'新建项目':'编辑项目'"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-form :model="form" label-width="100px" v-loading="loading" element-loading-text="正在加载所有项目成员数据，请稍后..." :rules="rules" ref="addProject" size="small" label-position="right">
      <el-form-item label="项目名称：" prop="name">
        <el-input class="input" clearable v-model="form.name" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目成员：" prop="userIdList">
        <el-select-v2
          class="input"
          ref="selectV2"
          filterable
          v-model="form.userIdList"
          multiple
          placeholder="请选择项目成员"
          :options="userList"
          :extra-props="{ label: 'label', value: 'value' }"
          @change="selectUser"
        >
        </el-select-v2>
      </el-form-item>
      <el-form-item label="负责人：" prop="userId">
        <el-select class="input" v-model="form.userId" placeholder="请输入项目负责人">
          <el-option
            v-for="item in rootUserList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目描述：" prop="description" style="margin-bottom: 0;">
        <el-input class="input" type="textarea" rows="5" placeholder="请输入项目描述" v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium" :loading="loading">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { projectUpdate, projectAdd, projectInfo } from '@/api/home/project'
import { allUser } from '@/api/home/user'
import ElSelectV2 from '@/components/public/SelectV2'
export default {
  name: 'DialogAddProject',
  components: { ElSelectV2 },
  data () {
    const validator = (rule, value, callback) => {
      if (value) {
        if (/^((?![/\\:*?"'<>!！\s]).){1,30}$/g.test(value)) {
          callback()
        } else {
          return callback(new Error('项目名称不可超过30个字符，且不能包含 /\\:*?"\'<>!！ 任何字符'))
        }
      } else {
        return callback(new Error('请输入项目名称'))
      }
    }
    return {
      loading: false,
      callbackRoute: null,
      type: 'add',
      id: '',
      dialogVisible: false,
      userList: [],
      index: null,
      rootUserList: [],
      form: {
        name: '',
        userIdList: [],
        userId: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, validator: validator, trigger: 'change' }
        ],
        userIdList: [
          { required: true, message: '请选择项目成员', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '请选择项目负责人', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
    },

    // 选择项目成员
    selectUser () {
      let notSelectUser = true
      this.rootUserList = []
      this.userList.forEach(item => {
        if (this.form.userIdList.includes(item.value)) {
          if (item.value === this.form.userId) {
            notSelectUser = false
          }
          this.rootUserList.push(item)
        }
      })
      if (notSelectUser) {
        this.form.userId = ''
      }
    },

    // 新建项目时执行
    submitAdd () {
      projectAdd({
        name: this.form.name,
        userIdList: this.form.userIdList,
        userId: this.form.userId,
        description: this.form.description
      }).then(response => {
        this.$message.success('操作成功！')
        this.$emit('addCallback', {
          userId: this.form.userId,
          id: response.data.id,
          name: response.data.name
        })
        this.$refs.addProject.resetFields()
        this.dialogVisible = false
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 编辑项目时执行
    submitEdit () {
      projectUpdate({
        id: this.id,
        name: this.form.name,
        userIdList: this.form.userIdList,
        userId: this.form.userId,
        description: this.form.description
      }).then(response => {
        this.$message.success('操作成功！')
        this.$emit('editCallback', {
          userId: this.form.userId,
          id: this.id,
          name: this.form.name
        }, this.index)
        this.$refs.addProject.resetFields()
        this.dialogVisible = false
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 提交
    confirm () {
      this.$refs.addProject.validate((valid) => {
        if (valid) {
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

    // 取消
    cancel () {
      this.$refs.addProject.resetFields()
      this.dialogVisible = false
    },

    // 初始化用户信息
    async initInfo () {
      await projectInfo({
        id: this.id
      }).then(response => {
        this.form = {
          ...this.form,
          ...response.data
        }
        this.form.userIdList.forEach(value => {
          const item = this.userList.find(item => item.value === value)
          if (item) {
            this.$refs.selectV2.instance().cachedOptions.push({
              currentLabel: item.label, // 当前绑定的数据的label
              currentValue: item.value, // 当前绑定数据的value
              label: item.label, // 当前绑定的数据的label
              value: item.value // 当前绑定数据的value
            })
          }
        })
        this.selectUser()
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 初始化所以用户
    async initUserList () {
      this.loading = true
      this.userList = []
      await allUser({ loading: false }).then(response => {
        this.userList = []
        if (response.data) {
          response.data.forEach(item => {
            this.userList.push({
              value: item.id,
              label: item.username
            })
          })
          this.selectUser()
          this.loading = false
        }
      }).catch(error => {
        this.$message.error(error.message)
        this.loading = false
      })
    },

    // 打开窗口时的回调
    async open () {
      if (this.userList.length <= 0) {
        await this.initUserList()
      }
      if (this.type === 'edit' && this.id !== '') {
        await this.initInfo()
      } else {
        this.form = {
          name: '',
          userIdList: [],
          userId: '',
          description: ''
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .el-form {
    padding: 0 0 0 40px;

    .input {
      width: 280px;
    }

    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 20px;
    }
  }
</style>
