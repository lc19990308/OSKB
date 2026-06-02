<template>
  <el-dialog
    title="快速添加并检测"
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
          <el-radio :label="1">HTTP / HTTPS</el-radio>
          <el-radio :label="2">SSH</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="仓库地址：" prop="url">
        <el-col :span="23">
          <el-input v-model="form.url" placeholder="请输入仓库地址，例：https://xmirror/gitlab/oss.git"></el-input>
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
          <!--          <el-tooltip placement="top" >-->
          <!--            <div slot="content">-->
          <!--            </div>-->
          <!--            <i class="iconfont iconbangzhu"></i>-->
          <!--          </el-tooltip>-->
          <i class="iconfont iconbangzhu"></i> 审查方式：
        </div>
        <el-radio-group v-model="form.reviewMode" @change="getBranch('auto')">
          <el-radio :label="1">快速审查</el-radio>
          <el-radio :label="2">深度审查</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="pullMode" class="el-form-item__last">
        <div slot="label">
          <el-tooltip placement="top">
            <div slot="content">
              手动检测：仓库配置完毕后，需手动进行重审操作；<br><br>
              自动检测：需将生成的回调接口及Token值配置到GitLab中，<br>
              平台检测到仓库内代码更新时，会自动进行应用包审查流程。<br><br>
              定时检测：平台会根据设置的定时检测时间定期自动对仓库进行检测。
            </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
          检测方式：
        </div>
        <el-radio-group v-model="form.pullMode" @change="getBranch('auto')" :disabled="form.type !== 2">
          <el-radio :label="1">自动检测</el-radio>
          <el-radio :label="2">手动检测</el-radio>
          <el-radio :label="3">定时检测</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-form class="form-step-2 label-top-form" label-width="120px" size="medium" label-position="top">
          <template v-if="form.pullMode === 1">
            <p class="tips">
              <i class="iconfont iconguanyu"></i>
              需将生成的回调接口及Token值配置到GitLab中，平台检测到<br>
              仓库内代码更新时，会自动进行检测。
            </p>
            <template v-if="!(echo.token && echo.url)">
              <el-button class="create-btn" size="medium" @click="generateTokenHandler">生成Token</el-button>
            </template>
            <template v-else>
              <el-form-item label="回调接口">
                <el-col :span="23">
                  <el-button size="mini" class="copy-btn" @click="copyText(echo.url)">复制</el-button>
                  <code class="code-container">{{ echo.url || '-' }}</code>
                </el-col>
              </el-form-item>
              <el-form-item label="Token">
                <el-col :span="23">
                  <el-button size="mini" class="copy-btn" @click="copyText(echo.token)">复制</el-button>
                  <code class="code-container">{{ echo.token || '-' }}</code>
                </el-col>
              </el-form-item>
            </template>
          </template>
          <template v-if="form.pullMode === 2">
            <el-form-item
              label="分支"
              prop="branch"
              :rules="[
            { required: true, message: '请选择分支', trigger: ['blur', 'change'] }]">
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
          </template>
          <template v-if="form.pullMode === 3">
            <el-form-item>
              <el-row :gutter="20">
                <el-col :span="5"><el-select
                  v-model="form.timingType"
                  placeholder="请选择">
                  <el-option :label="'每天'" :value="1"></el-option>
                  <el-option :label="'每周'" :value="2"></el-option>
                </el-select></el-col>
                <el-col :span="5" v-show="form.timingType === 2">
                  <el-select
                  v-model="form.timingWeek"
                  placeholder="请选择">
                  <el-option
                    v-for="(value, index) in weekOptions"
                    :key="index"
                    :label="value.label"
                    :value="value.value">
                  </el-option>
                </el-select></el-col>
                <el-col :span="8"><el-time-picker
                  v-model="form.timingTime"
                  style="width: 100%;"
                  :value-format="'HH:mm'"
                  :format="'HH:mm'"
                  placeholder="任意时间点">
                </el-time-picker></el-col>
              </el-row>
            </el-form-item>
          </template>
        </el-form>
      </el-form-item>
      <el-form-item prop="rinseMode">
        <div slot="label">
          <!--          <el-tooltip placement="top" >-->
          <!--            <div slot="content">-->
          <!--            </div>-->
          <!--            <i class="iconfont iconbangzhu"></i>-->
          <!--          </el-tooltip>-->
          <i class="iconfont iconbangzhu"></i> 数据清洗：
        </div>
        <el-radio-group v-model="form.rinseMode">
          <el-radio :label="1">快速清洗</el-radio>
          <el-radio :label="2">深度清洗</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">{{
          form.pullMode === 1 ? '保存配置并检测' : '保  存'
        }}</el-button>
      <el-button @click="cancel" size="medium">关  闭</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { repositoryAdd, getBranch } from '@/api/home/scan/develop/repository/git'
import { copyText } from '@/utils'
import { validateGitUrl } from '@/utils/validate'

const weekOptions = [
  {
    label: '周一',
    value: 1
  },
  {
    label: '周二',
    value: 2
  },
  {
    label: '周三',
    value: 3
  },
  {
    label: '周四',
    value: 4
  },
  {
    label: '周五',
    value: 5
  },
  {
    label: '周六',
    value: 6
  },
  {
    label: '周日',
    value: 7
  }
]

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
      weekOptions,
      form: {
        config: {
          authType: 1,
          publicKey: '',
          passPhrase: '',
          privateKey: '',
          username: '',
          password: ''
        },
        type: 2,
        pullMode: 2,
        reviewMode: 1,
        rinseMode: 1,
        url: '',
        branch: '',
        timingType: '',
        timingWeek: '',
        timingTime: ''
      },
      storeForm: {},
      rules: {
        url: [
          {
            required: true,
            message: '请输入仓库地址',
            trigger: ['blur', 'change']
          },
          {
            validator: validatorUrl,
            message: '仓库地址格式错误',
            trigger: ['blur', 'change']
          }
        ],
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          }
        ],
        branch: [
          {
            required: true,
            message: '请选择分支',
            trigger: ['blur', 'change']
          }
        ],
        publicKey: [
          {
            required: true,
            message: '请输入SSH公钥',
            trigger: ['blur', 'change']
          }
        ],
        passPhrase: [
          {
            required: false,
            message: '请输入SSH秘钥短语',
            trigger: ['blur', 'change']
          }
        ],
        privateKey: [
          {
            required: true,
            message: '请输入SSH私钥',
            trigger: ['blur', 'change']
          }
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
      default: () => {
      }
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
          authType: 1,
          publicKey: '',
          passPhrase: '',
          privateKey: '',
          username: '',
          password: ''
        },
        type: 2,
        pullMode: 2,
        url: '',
        branch: ''
      }
      this.echo = {
        url: '',
        token: ''
      }
      this.branchList = []
    },

    /**
     * @name 生成Token
     * @param  { void }
     * @return { void }
     */
    generateTokenHandler () {
      this.$message.success('操作成功！')
      this.echo = {
        url: 'http://39.106.230.76:8011/oss/api-v1/open-api/gitlab/hook',
        token: '2a941ab5d16745079f7coec05962eca3'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-form {
  padding: 0 40px;

  .tips {
    color: #666;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0;
    text-align: left;
  }

  .el-form-item__last {
    margin-bottom: 0 !important;
  }

  .create-btn {
    border: 1px solid #8fc4f2;
    color: #2C5F8A;
  }
}

.form-step-2 {
  padding: 0 40px 0 25px;

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
      color: #2C5F8A;
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
