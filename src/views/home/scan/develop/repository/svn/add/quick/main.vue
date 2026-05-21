<template>
  <div class="view-warp">
    <el-row>
      <el-alert :closable="false" type="primary" class="header-alert">
        <el-row type="flex" class="alert-content" align="middle">
          <div style="flex: 1;">
            <i class="el-icon-info m-r-5"></i>快速添加方式，添加单个仓库进行检测。
          </div>
          <el-button size="mini" class="custom-alert-btn" type="primary" style="visibility: hidden;"></el-button>
        </el-row>
      </el-alert>
    </el-row>
    <el-form :model="form" label-width="120px" :rules="rules" ref="form" size="medium" label-position="right">
<!--      <el-form-item prop="projectId" label="所属项目：" ref="projectItem">-->
<!--        <el-select-->
<!--          class="w-full"-->
<!--          v-model="form.projectId"-->
<!--          filterable-->
<!--          :disabled="project.id !== -1"-->
<!--          clearable-->
<!--          placeholder="请输入项目名"-->
<!--          :loading="loading"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in projectList"-->
<!--            :key="'projectId-' + item.id"-->
<!--            :label="item.name"-->
<!--            :value="item.id"-->
<!--          >-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="仓库地址：" prop="url">
        <el-input class="w-full" v-model="form.url" placeholder="请输入仓库地址"></el-input>
      </el-form-item>
      <el-form-item label="用户名密码：">
        <el-row class="w-full m-b-10">
          <el-col :span="11">
            <el-form-item :rules="rules.username">
              <el-input v-model="form.username" class="w-full" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="12">
            <el-form-item :rules="rules.password">
              <el-input v-model="form.password" class="w-full" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row class="w-full" type="flex" justify="space-between">
            <el-checkbox v-model="checked" @change="rememberHandle">记住用户名密码</el-checkbox>
            <el-button type="text" :loading="loading" @click="confirm('test')">测试连接</el-button>
          </el-row>
        </el-row>
      </el-form-item>
      <el-form-item label="仓库名称：" prop="name" :rules="rules.name">
        <el-input class="w-full" v-model="form.name" placeholder="请输入仓库名称"></el-input>
      </el-form-item>
      <el-form-item label="仓库说明：" prop="description">
        <el-input class="w-full" show-word-limit v-model="form.description" :maxlength="100" :rows="3" type="textarea"
                  placeholder="请输入仓库说明"></el-input>
      </el-form-item>
      <el-form-item label="" style="margin-bottom: 0;">
        <div class="p-t-15 w-full text-center">
          <el-button type="primary" class="w-80" @click="confirm('submit')" size="medium">保 存</el-button>
          <el-button @click="cancel" class="w-80 m-r-20" size="medium">返 回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add, svnTestConnection } from '@/api/home/scan/develop/repository/svn'
import { localStore } from '@/utils'
import { validateSvnUrl } from '@/utils/validate'
import { mapState } from 'vuex'

export default {
  name: 'quick',
  data () {
    // 校验url
    const validatorUrl = (rule, value, callback) => {
      if (validateSvnUrl(value)) {
        callback()
      } else {
        callback(new Error())
      }
    }
    // 校验name
    const validatorName = (rule, value, callback) => {
      if (value.length <= 30) {
        callback()
      } else {
        callback(new Error('不可超过30个字符'))
      }
    }

    return {
      dialogVisible: false,
      checked: false,
      loading: false,
      form: {
        url: '',
        username: '',
        password: '',
        projectId: '',
        description: '',
        name: ''
      },
      rules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: ['change', 'blur'] }
        ],
        url: [
          { required: true, message: '请输入SVN地址', trigger: ['blur', 'change'] },
          { validator: validatorUrl, message: 'SVN格式错误', trigger: ['blur', 'change'] }
        ],
        name: [
          { validator: validatorName, trigger: ['blur', 'change'] }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      projectList: state =>
        state.home.projectList.map(item => ({ text: item.name, ...item }))
    }),
    project () {
      return this.$store.state.home.project
    }
  },
  methods: {
    // vn测试是否连通
    testConnection () {
      this.loading = true
      svnTestConnection({
        url: this.form.url,
        username: this.form.username,
        password: this.form.password
      }).then(res => {
        if (res.code === 0) {
          setTimeout(() => {
            this.loading = false
            this.$message.success('连接成功！')
          }, 500)
        } else {
          this.loading = false
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error.message)
      })
    },
    // 提交
    confirm (type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (type === 'submit') {
            this.submit()
          }
          if (type === 'test') {
            this.testConnection()
          }
        } else {
          return false
        }
      })
    },

    // 提交后端
    submit () {
      add(this.form).then(response => {
        this.rememberHandle(this.checked)
        this.$confirm('添加成功，是否继续添加？点击“确定”留在此页面继续添加其他SVN仓库', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '返回列表页',
          type: 'success',
          customClass: 'svn-message-box'
        }).then(() => {
          this.resetForm()
        }).catch(() => {
          this.cancel()
        })
      }).catch(error => {
        if (error) {
          this.$message.error(error.message)
        }
      })
    },

    // 记住密码
    rememberHandle (v) {
      if (v) {
        localStore.set(this.$route.path, {
          checked: v,
          username: this.form.username,
          password: this.form.password
        })
      } else {
        localStore.remove(this.$route.path)
      }
    },

    // 清空表单
    resetForm () {
      this.$refs.form.resetFields()
      const cache = localStore.get(this.$route.path)
      if (cache && cache.checked && cache.password && cache.username) {
        this.checked = cache.checked
        this.form.password = cache.password
        this.form.username = cache.username
      }
      this.form.projectId = this.project.id
    },
    // 取消
    cancel () {
      this.$router.push({ path: '/scan/develop/repository/list/svn' })
    }
  },
  mounted () {
    this.resetForm()
  }
}
</script>
<style scoped lang="scss">
.view-warp {
  width: 700px;
  margin: 0 auto;
}

.header-alert {
  position: relative;
  margin-bottom: 32px;
  padding-left: 12px !important;
  padding-right: 12px !important;

  :deep(.el-alert__content) {
    width: 100% !important;
    display: block !important;
    padding: 0;

    .el-alert__description {
      margin: 0;
    }
  }

  .custom-alert-btn {
    width: 70px;
    height: 28px;
  }
}

:deep(.el-textarea .el-input__count) {
  color: #333;
}
</style>
