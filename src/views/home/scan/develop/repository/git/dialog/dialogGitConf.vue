<template>
  <el-dialog
    title="配置Git"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="900px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-form :model="form" label-width="120px" :rules="rules" ref="form" size="medium" label-position="right">
      <el-form-item prop="type">
        <div slot="label">
          仓库来源：
        </div>
        <el-radio-group v-model="form.type" @change="changeType">
          <el-radio :label="1">Git本地仓库</el-radio>
          <el-radio :label="2">GitLab</el-radio>
          <el-radio :label="3">GitHub</el-radio>
          <el-radio :label="4">Gitee</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="authType">
        <div slot="label">
          <el-tooltip placement="top">
            <div slot="content">
              下载或克隆代码时使用的协议
            </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
          协议：
        </div>
        <el-radio-group v-model="form.config.authType" @change="changeAuthType">
          <el-radio :label="2">SSH</el-radio>
          <el-radio :label="1">HTTP / HTTPS</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="仓库地址：" prop="url">
        <el-col :span="23">
          <el-input v-model="form.url" placeholder="请输入仓库地址"></el-input>
        </el-col>
      </el-form-item>
      <div v-if="form.config.authType === 2">
        <el-form-item label="SSH私钥：" prop="privateKey">
          <span slot="label">
            <el-tooltip placement="top">
              <div slot="content">
                支持RSA格式
              </div>
              <i class="iconfont iconbangzhu"></i>
            </el-tooltip>
            SSH私钥：
          </span>
          <el-col :span="23">
            <el-input v-model="form.privateKey" type="textarea" placeholder="请输入SSH私钥"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="SSH公钥：" prop="publicKey">
          <el-col :span="23">
            <el-input v-model="form.publicKey" type="textarea" placeholder="请输入SSH公钥"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="SSH秘钥短语：" prop="passPhrase">
          <el-col :span="23">
            <el-input v-model="form.passPhrase" placeholder="请输入SSH秘钥短语"></el-input>
          </el-col>
        </el-form-item>
      </div>
      <div v-if="form.config.authType === 1">
        <el-form-item label="用户名密码：" prop="config.username" :rules="rules.username">
          <el-row>
            <el-col :span="11">
              <el-form-item prop="config.username" :rules="rules.username">
                <el-input v-model="form.config.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="p-b-10"></el-col>
            <el-col :span="11">
              <el-form-item prop="config.password" :rules="rules.password">
                <el-input v-model="form.config.password" type="password" placeholder="请输入密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <el-form-item prop="pullMode">
        <div slot="label">
          <el-tooltip placement="top">
            <div slot="content">
              手动检测：仓库配置完毕后，需手动进行重审操作；<br>
              自动检测：需将生成的回调接口及Token值配置到GitLab中，<br>
              平台检测到仓库内代码更新时，会自动进行应用包审查流程。
            </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
          检测方式：
        </div>
        <el-radio-group v-model="form.pullMode" @change="getBranch('auto')" :disabled="form.type !== 2">
          <el-radio :label="1">自动检测</el-radio>
          <el-radio :label="2">手动检测</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分支：" prop="branch" v-if="form.pullMode === 2">
        <el-col :span="23">
          <el-select v-model="form.branch" placeholder="请选择分支" class="w-full">
            <el-option
                v-for="item in branchList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1" class="text-center">
          <div class="op-btn">
            <el-tooltip content="重新拉取分支" placement="top">
              <i class="el-icon-refresh" @click="getBranch"></i>
            </el-tooltip>
          </div>
        </el-col>
      </el-form-item>
    </el-form>
    <el-form class="form-step-2 label-top-form" label-width="120px" size="medium" label-position="right" v-show="form.pullMode === 1">
      <el-form-item label="回调接口：">
        <el-col :span="23">
          <el-button size="mini" class="copy-btn" @click="copyText(echo.url)">复制</el-button>
          <code class="code-container">{{ echo.url || '-' }}</code>
        </el-col>
      </el-form-item>
      <el-form-item label="Token：">
        <el-col :span="23">
          <el-button size="mini" class="copy-btn" @click="copyText(echo.token)">复制</el-button>
          <code class="code-container">{{ echo.token || '-' }}</code>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">{{ form.pullMode === 1 ? '生成Token并保存' : '保  存' }}</el-button>
      <el-button @click="cancel" size="medium">关  闭</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { repositoryAdd, getBranch } from '@/api/home/scan/develop/repository/git'
import { copyText } from '@/utils'
import { validateGitUrl } from '@/utils/validate'

export default {
  name: 'DialogGitConf',
  data () {
    // 校验url
    const validatorUrl = (rule, value, callback) => {
      if (validateGitUrl(value) &&
          ((this.form.config.authType === 1 && (value.indexOf('http://') === 0 || value.indexOf('https://') === 0)) ||
              (this.form.config.authType === 2 && (value.indexOf('git') === 0 || value.indexOf('ssh') === 0))
          )
      ) {
        callback()
      } else {
        callback(new Error())
      }
    }

    return {
      project: this.$store.state.home.project,
      dialogVisible: false,
      form: {
        config: {
          authType: 2,
          publicKey: '',
          passPhrase: '',
          privateKey: '',
          username: '',
          password: ''
        },
        type: 1,
        pullMode: 2,
        url: '',
        branch: ''
      },
      storeForm: {},
      rules: {
        url: [
          { required: true, message: '请输入仓库地址', trigger: ['blur', 'change'] },
          { validator: validatorUrl, message: '仓库地址格式错误', trigger: ['blur', 'change'] }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
        ],
        branch: [
          { required: true, message: '请选择分支', trigger: ['blur', 'change'] }
        ],
        publicKey: [
          { required: true, message: '请输入SSH公钥', trigger: ['blur', 'change'] }
        ],
        passPhrase: [
          { required: false, message: '请输入SSH秘钥短语', trigger: ['blur', 'change'] }
        ],
        privateKey: [
          { required: true, message: '请输入SSH私钥', trigger: ['blur', 'change'] }
        ]
      },
      echo: {
        url: '',
        token: ''
      },
      branchList: []
    }
  },
  props: {
    callback: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    // 切换类型
    changeType () {
      if (this.form.type !== 2) {
        this.form.pullMode = 2
      }
    },

    // 切换authType
    changeAuthType () {
      this.branchList = []
      const store = {
        url: this.form.url,
        pullMode: this.form.pullMode,
        branch: this.form.branch
      }

      this.$set(this.form, 'url', this.storeForm.url || '')
      this.$set(this.form, 'pullMode', this.storeForm.pullMode || 1)
      this.$set(this.form, 'branch', this.storeForm.branch || '')

      this.changeType()

      this.$set(this.storeForm, 'url', store.url)
      this.$set(this.storeForm, 'pullMode', store.pullMode)
      this.$set(this.storeForm, 'branch', store.branch)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

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
      const params = {
        config: {
          username: this.form.config.username,
          password: this.form.config.password,
          authType: this.form.config.authType
        }
      }
      if (this.form.config.authType === 2) {
        params.config = {
          publicKey: this.form.publicKey,
          passPhrase: this.form.passPhrase,
          privateKey: this.form.privateKey,
          authType: this.form.config.authType
        }
      }
      repositoryAdd({
        projectId: this.project.id,
        url: this.form.url,
        type: this.form.type,
        pullMode: this.form.pullMode,
        branch: this.form.branch,
        ...params
      }).then(response => {
        this.$message.success('操作成功！')
        if (this.form.pullMode === 2) {
          this.dialogVisible = false
          this.$emit('callback')
          this.cancel()
        } else {
          const data = response.data
          this.echo = {
            url: data.callbackUrl,
            token: data.token
          }
        }
      }).catch(error => {
        if (error) {
          this.$message.error(error.message)
        }
      })
    },

    // 获取分支
    getBranch (auto) {
      this.branchList = []
      const params = {
        config: {
          username: this.form.config.username,
          password: this.form.config.password,
          authType: this.form.config.authType
        }
      }
      if (this.form.config.authType === 2) {
        params.config = {
          publicKey: this.form.publicKey,
          passPhrase: this.form.passPhrase,
          privateKey: this.form.privateKey,
          authType: this.form.config.authType
        }
      }
      getBranch({
        url: this.form.url,
        type: this.form.type,
        loading: auto !== 'auto',
        ...params
      }).then(response => {
        const data = response.data
        data.forEach(item => {
          this.branchList.push(item)
        })
      }).catch(error => {
        if (error && auto !== 'auto') {
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
        config: {
          authType: 2,
          publicKey: '',
          passPhrase: '',
          privateKey: '',
          username: '',
          password: ''
        },
        type: 1,
        pullMode: 2,
        url: '',
        branch: ''
      }
      this.echo = {
        url: '',
        token: ''
      }
      this.branchList = []
    }
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
