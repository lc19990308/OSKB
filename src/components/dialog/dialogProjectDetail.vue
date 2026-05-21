<template>
  <el-dialog
    title="项目信息"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-form :model="form" label-width="100px" size="small" label-position="right">
      <el-form-item label="项目名称：" prop="name">
        {{ form.name || '-' }}
      </el-form-item>
      <el-form-item label="项目成员：" prop="userIdList">
        {{ form.userList.join('，') || '-' }}
      </el-form-item>
      <el-form-item label="负责人：" prop="userId">
        {{ form.user || '-' }}
      </el-form-item>
      <el-form-item label="项目描述：" prop="description">
        {{ form.description || '-' }}
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="medium">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { projectInfo } from '@/api/home/project'
import { allUser } from '@/api/home/user'

export default {
  name: 'DialogProjectDetail',
  data () {
    return {
      callbackRoute: null,
      id: '',
      dialogVisible: false,
      userList: [],
      index: null,
      rootUserList: [],
      form: {
        name: '',
        userIdList: [],
        userList: [],
        user: '',
        userId: '',
        description: ''
      }
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
    },

    // 取消
    cancel () {
      this.dialogVisible = false
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

    // 初始化用户信息
    initInfo () {
      projectInfo({
        id: this.id
      }).then(response => {
        Object.assign(this.form, response.data)
        this.initUserList()
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 初始化所以用户
    initUserList () {
      this.userList = []
      allUser().then(response => {
        if (response.data) {
          response.data.forEach(item => {
            if (item.id === this.form.userId) {
              this.form.user = item.username
            }
            if (this.form.userIdList.indexOf(item.id) !== -1) {
              this.form.userList.push(item.username)
            }
          })
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 打开窗口时的回调
    open () {
      this.form = {
        name: '',
        userIdList: [],
        userList: [],
        user: '',
        userId: '',
        description: ''
      }
      this.initInfo()
    }
  }
}
</script>

<style scoped lang="scss">
  .el-form {
    padding: 0 40px 0 100px;
  }
</style>
