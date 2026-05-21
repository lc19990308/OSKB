<template>
  <el-dialog
    :title="type === 'add'?'添加账号':'编辑账号'"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-form :model="form" label-width="100px" :rules="rules" ref="addUser" size="medium" label-position="right">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：" prop="realName">
        <el-input v-model="form.realName" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="角色：" prop="roleId" v-if="form.id !== 1">
        <el-select v-model="form.roleId" style="width: 100%;" placeholder="请选择角色">
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号状态：" prop="effective" v-if="form.id !== 1 && type === 'edit'">
        <el-radio-group v-model="form.effective">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">锁定</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="授权时间：" prop="authTime" v-if="form.id !== 1">
        <el-date-picker
          style="width: 100%;"
          v-model="form.authTime"
          type="datetimerange"
          range-separator="-"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { userInfo, userAdd, userUpdate, allRole } from '@/api/home/user'
import { validatePhone, validatePassword, validateUsername, validateEmail } from '@/utils/validate'
import { hasOwn } from '@/utils'
import { mapState } from 'vuex'
export default {
  name: 'DialogAddUser',
  data () {
    // 用户名校验
    const checkUsername = (rule, value, callback) => {
      if (!validateUsername(value)) {
        callback(new Error())
      } else {
        callback()
      }
    }

    const checkPhone = (rule, value, callback) => {
      if (!validatePhone(value)) {
        callback(new Error())
      } else {
        callback()
      }
    }

    const checkEmail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error())
      } else {
        callback()
      }
    }

    const checkPassword = (rule, value, callback) => {
      if (!this.rules.password[0].required && !value) {
        callback()
      } else if (!validatePassword(value)) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      type: 'add',
      userId: '',
      row: {},
      dialogVisible: false,
      roleList: [],
      form: {
        username: '',
        password: '',
        email: '',
        phone: '',
        realName: '',
        roleId: '',
        effective: 1,
        authStartTime: '',
        authEndTime: '',
        authTime: []
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['change', 'blur'] },
          { validator: checkUsername, message: '用户名格式为4~30位数字字母下划线', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['change', 'blur'] },
          { validator: checkPassword, message: '密码格式为8~16位的数字字母特殊字符组合', trigger: ['change', 'blur'] }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: ['change', 'blur'] },
          { validator: checkEmail, message: '请输入正确的邮箱地址', trigger: ['change', 'blur'] }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: ['change', 'blur'] },
          { validator: checkPhone, message: '请输入正确的手机号', trigger: ['change', 'blur'] }
        ],
        realName: [
          { required: false, message: '请输入真实姓名', trigger: ['change', 'blur'] },
          { max: 30, message: '超出30位字符限制', trigger: ['change', 'blur'] }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: ['change', 'blur'] }
        ],
        effective: [
          { required: true, message: '请选择是否启用', trigger: ['change', 'blur'] }
        ],
        authStartTime: [
          { required: false, message: '请选择授权开始时间', trigger: ['change', 'blur'] }
        ],
        authEndTime: [
          { required: false, message: '请选择授权结束时间', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo
    })
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
    },

    // 提交
    confirm () {
      this.$refs.addUser.validate((valid) => {
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

    // 添加账号的时候执行
    submitAdd () {
      if (this.form.authTime && this.form.authTime[0]) {
        this.form.authStartTime = this.form.authTime[0]
      } else {
        this.form.authStartTime = null
      }
      if (this.form.authTime && this.form.authTime[1]) {
        this.form.authEndTime = this.form.authTime[1]
      } else {
        this.form.authEndTime = null
      }
      this.form.authTime = null
      userAdd({
        ...this.form
      }).then(response => {
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
      const formData = { ...this.form }
      if (this.form.authTime && this.form.authTime[0]) {
        this.form.authStartTime = this.form.authTime[0]
      } else {
        this.form.authStartTime = null
      }
      if (this.form.authTime && this.form.authTime[1]) {
        this.form.authEndTime = this.form.authTime[1]
      } else {
        this.form.authEndTime = null
      }
      this.form.authTime = null
      userUpdate({
        ...this.form
      }).then(response => {
        this.$nextTick(() => {
          this.$message.success('操作成功！')
        })
        this.dialogVisible = false
        if (this.userInfo.userId !== 1 && this.userInfo.userId === this.userId && this.row.roleId !== formData.roleId) {
          this.$store.dispatch('loginOut')
        } else {
          this.$refs.addUser.resetFields()
          this.$emit('callback')
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 取消
    cancel () {
      this.$refs.addUser.resetFields()
      this.dialogVisible = false
    },

    // 初始化所以角色
    initRoleList () {
      this.roleList = []
      allRole().then(response => {
        this.roleList = []
        response.data.forEach(item => {
          this.roleList.push({
            label: item.name,
            value: item.id
          })
        })
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 初始化用户信息
    initUserInfo () {
      userInfo({
        id: this.userId
      }).then(response => {
        for (const x in this.form) {
          if (hasOwn(response.data, x)) {
            this.form[x] = response.data[x]
            this.row[x] = response.data[x]
          }
        }
        this.form.id = response.data.id
        this.form.authTime = [this.form.authStartTime, this.form.authEndTime]
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 打开窗口时的回调
    open () {
      this.form = {
        username: '',
        password: '',
        email: '',
        phone: '',
        realName: '',
        roleId: '',
        effective: 1,
        authStartTime: '',
        authEndTime: '',
        authTime: []
      }
      if (this.type === 'edit' && this.userId !== '') {
        this.rules.password[0].required = false
        this.initUserInfo()
      } else {
        this.rules.password[0].required = true
      }
      this.initRoleList()
    }
  }
}
</script>

<style scoped lang="scss">
.el-form {
  padding: 0 130px 0 40px;
}
</style>
