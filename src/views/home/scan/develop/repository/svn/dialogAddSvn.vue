<template>
  <el-dialog
    title="配置SVN"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="900px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-form :model="form" label-width="120px" :rules="rules" ref="form" size="medium" label-position="right">
      <el-form-item prop="projectId" label="所属项目：" ref="projectItem">
        <el-col :span="23">
          <el-select
            class="w-full"
            v-model="form.projectId"
            filterable
            remote
            :disabled="project.id !== -1"
            clearable
            reserve-keyword
            placeholder="请输入项目名"
            :remote-method="search"
            :loading="loading"
          >
            <el-option
              v-for="item in projectList"
              :key="'projectId-' + item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="仓库地址：" prop="url">
        <el-col :span="23">
          <el-input v-model="form.url" placeholder="请输入仓库地址"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="用户名密码：" prop="username" :rules="rules.username">
        <el-row>
          <el-col :span="11">
            <el-form-item prop="username" :rules="rules.username">
              <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="p-b-10"></el-col>
          <el-col :span="11">
            <el-form-item prop="password" :rules="rules.password">
              <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">保  存</el-button>
      <el-button @click="cancel" size="medium">关  闭</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { add } from '@/api/home/scan/develop/repository/svn'
import { copyText } from '@/utils'
import { validateSvnUrl } from '@/utils/validate'
import { projectList } from '@/api/home/project'

export default {
  name: 'DialogGitConf',
  data () {
    // 校验url
    const validatorUrl = (rule, value, callback) => {
      if (validateSvnUrl(value)) {
        callback()
      } else {
        callback(new Error())
      }
    }

    return {
      dialogVisible: false,
      projectList: [],
      searchProject: '',
      loading: false,
      form: {
        url: '',
        username: '',
        password: '',
        projectId: ''
      },
      rules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: ['change', 'blur'] }
        ],
        url: [
          { required: true, message: '请输入SVN地址', trigger: ['blur', 'change'] },
          { validator: validatorUrl, message: 'SVN格式错误', trigger: ['blur', 'change'] }
        ],
        username: [
          { required: false, message: '请输入用户名', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: false, message: '请输入密码', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    project () {
      return this.$store.state.home.project
    }
  },
  props: {
    callback: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
    },

    // 提交
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },

    // 提交后端
    submit () {
      add(this.form).then(response => {
        this.$message.success('操作成功！')
        this.$emit('callback')
        this.cancel()
      }).catch(error => {
        if (error) {
          this.$message.error(error.message)
        }
      })
    },

    // 取消
    cancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },

    // 复制文本
    copyText: copyText,

    open () {
      this.form = {
        url: '',
        username: '',
        password: '',
        projectId: this.project.id === -1 ? '' : this.project.id
      }
    },
    search (query) {
      this.projectList = []
      this.searchProject = query
      this.initProject()
    },
    // 初始化项目
    initProject () {
      this.loading = true
      projectList({
        projectName: this.searchProject,
        pageNum: 1,
        pageSize: 100,
        loading: false
      })
        .then(response => {
          this.loading = false
          const data = response.data
          data.records.forEach(item => {
            this.projectList.push(item)
          })
        })
        .catch(error => {
          this.loading = false
          this.$message.error(error.message)
        })
    }
  },
  mounted () {
    this.initProject()
  }
}
</script>

<style scoped lang="scss">
  .el-form {
    padding: 0 40px;
  }

  .form-step-2 {
    padding: 0 40px;

    .copy-btn {
      float: right;
      margin-top: 4px;
      margin-right: 5px;
    }
  }

  .op-btn {
    i {
      cursor: pointer;
      transition: all 0.6s;

      &:hover {
        color: #7C3AED;
      }

      &:active {
        color: #0760af;
      }
    }

    .el-icon-refresh {
      font-size: 18px;
    }
  }

  code.code-container {
    padding: 5px 45px 5px 10px;
  }
</style>
