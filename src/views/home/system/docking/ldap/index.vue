<template>
  <div>
    <el-alert :closable="false" type="primary" class="header-alert">
      LDAP，默认端口号为389。对于使用SSL的LDAP (LDAPS)，默认端口号为636。<br>
      基本DN是LDAP目录中vCloud Director将连接的位置。
    </el-alert>
    <div class="view-content">
      <el-form :model="form" label-width="210px" :rules="rules" ref="form" size="medium" label-position="right" v-loading="loading">
        <el-form-item label="IP地址：" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口号：" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="基本可分辨名称（DN）：" prop="base">
          <el-input v-model="form.base" placeholder="请输入基本可分辨名称（DN）" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password" :rules="[
          { required: pwdRequired, message: '请输入密码', trigger: ['blur'] }
        ]">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-button type="primary" @click="testLdapConfig()" class="w-100 m-r-20">测试连接</el-button>
          <el-button type="primary" @click="setLdapConfig()" class="w-100">应用</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLdapConfig, setLdapConfig, testLdapConfig } from '@/api/home/system/docking/ldap'
import { validatePort, validateIp, validateIpv6 } from '@/utils/validate'

export default {
  name: 'ldap',
  data () {
    const checkIp = (rule, value, callback) => {
      if (value && !validateIp(value) && !validateIpv6(value)) {
        callback(new Error())
      } else {
        callback()
      }
    }

    const checkPort = (rule, value, callback) => {
      if (value && !validatePort(value)) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {
        ip: '',
        port: '',
        base: '',
        username: '',
        password: ''
      },
      pwdRequired: true,
      rules: {
        ip: [
          { required: true, message: '请输入IP地址', trigger: ['blur'] },
          { validator: checkIp, message: 'IP格式错误', trigger: ['blur'] }
        ],
        port: [
          { required: true, message: '请输入端口号', trigger: ['blur'] },
          { validator: checkPort, message: '端口号格式错误', trigger: ['blur'] }
        ],
        base: [
          { required: true, message: '请输入基本可分辨名称（DN）', trigger: ['blur'] }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur'] }
        ]
      }
    }
  },
  methods: {
    // 测试配置
    testLdapConfig () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          testLdapConfig({
            ...this.form
          }).then(response => {
            this.$message.success('配置可用！')
          }).catch(error => {
            if (error.message) {
              this.$message.error(error.message)
            }
          })
        } else {
          return false
        }
      })
    },

    // 设置配置
    setLdapConfig () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          setLdapConfig({
            ...this.form
          }).then(response => {
            this.$message.success('操作成功！')
            this.initLdapConfig()
          }).catch(error => {
            if (error.message) {
              this.$message.error(error.message)
            }
          })
        } else {
          return false
        }
      })
    },

    // 初始化配置
    initLdapConfig () {
      this.loading = true
      getLdapConfig({
        loading: false
      }).then(response => {
        this.loading = false
        const data = response.data
        this.pwdRequired = !data.username
        for (const i in data) {
          this.form[i] = data[i] ? data[i] : ''
        }

        /* this.form = {
          ...this.form,
          ...data
        } */
      }).catch(error => {
        this.loading = false
        if (error.message) {
          this.$message.error(error.message)
        }
      })
    }
  },
  mounted () {
    this.initLdapConfig()
  }
}
</script>

<style scoped lang="scss">
.view-content {
  padding: 50px;
}

.el-input {
  width: 300px;
}

:deep(.header-alert) {
  position: relative;
  margin-bottom: 20px;
  padding: 13px;
  padding-right: 100px;

  .el-alert__content {
    padding: 0;

    .el-alert__description {
      padding: 0;
      margin: 0;
    }

    .handle {
      position: absolute;
      right: 13px;
      transform: translateY(-50%);
      padding-bottom: 6px;
      top: 50%;
    }
  }
}
</style>
