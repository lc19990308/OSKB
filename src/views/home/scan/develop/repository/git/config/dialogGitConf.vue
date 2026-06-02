<template>
  <el-dialog
    :title="type === 'add' ? '添加'+configTypeKey[configType]+'仓库': '配置'+configTypeKey[configType]+'仓库'"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="900px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-form :model="form" label-width="140px" class="p-t-15" :rules="rules" ref="form" size="medium" label-position="right">
      <el-form-item label="仓库地址：" prop="baseUrl">
        <el-col :span="23">
          <el-input class="input-width" v-model="form.baseUrl" :placeholder="'请输入Git仓库列表主页地址，例：https://xmirror/' + (configTypeKey[configType]?.toLocaleLowerCase())"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="GitLab API版本：" prop="gitlabApiVersion" v-if="configType === 1">
        <el-col :span="23" class="relative">
          <el-select
            @change="changeVersion"
            v-model="form.gitlabApiVersion"
            class="input-width"
            placeholder="请选择GitLab API版本">
            <div class="abs-text" slot="prefix" v-if="form.gitlabApiVersion">
              <span>{{versionString.version}}</span>
              <span>{{versionString.description}}</span>
            </div>
            <el-option
              v-for="item in versionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <template v-if="configType === 1 ? form.gitlabApiVersion : true">
        <el-form-item :key="110" label="认证方式：" prop="authType" v-if="form.gitlabApiVersion !== 2 && configType === 1">
          <el-radio-group v-model="form.authType">
            <el-radio :label="2">Token</el-radio>
            <el-radio :label="1">用户名密码</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :key="111" v-if="form.authType === 2" label="Token：" prop="gitlabPersonAccessToken">
          <el-col :span="23">
            <el-input v-model="form.gitlabPersonAccessToken" type="password" autocomplete="off" class="input-width" placeholder="请输入Git Access Token"></el-input>
            <!--          <el-button class="m-l-10" type="text">如何获取Token？</el-button>-->
          </el-col>
        </el-form-item>
        <el-form-item :key="112" v-if="form.authType === 1" label="用户名密码：">
          <el-row class="input-width">
            <el-col :span="11">
              <el-form-item prop="username" class="m-0">
                <el-input v-model="form.username"  placeholder="请输入用户名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item class="m-0" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer ">
      <el-button @click="test" type="text" size="medium" class="m-r-20" :loading="loading">测试配置</el-button>
      <el-button type="primary" @click="confirm"  size="medium" class="m-r-20 w-100">保存配置</el-button>
      <el-button @click="cancel" class="w-80" size="medium"> &nbsp;&nbsp;取 消 &nbsp;&nbsp;</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { saveConfig, testConfig } from '@/api/home/scan/develop/repository/git/index.js'
import { copyText } from '@/utils'
import { validateGitUrl } from '@/utils/validate'

export default {
  name: 'DialogGitConf',
  data () {
    // 校验url
    const validatorUrl = (rule, value, callback) => {
      if (validateGitUrl(value) || !value) {
        callback()
      } else {
        callback(new Error())
      }
    }

    return {
      project: this.$route.query.projectId ? { id: this.$route.query.projectId } : this.$store.state.home.project,
      dialogVisible: false,
      type: 'add',
      configType: null,
      configTypeKey: {
        1: 'GitLab',
        2: 'GitHub',
        3: 'Gitee'
      },
      loading: false,
      form: {
        baseUrl: '',
        gitServerType: 2,
        gitlabApiVersion: '',
        authType: 2,
        gitlabPersonAccessToken: '',
        id: '',
        password: '',
        projectId: '',
        username: ''
      },
      versionOptions: [
        {
          label: 'V3（低于GitLab 9.0版本）',
          value: 1,
          version: 'V3',
          description: '（低于GitLab 9.0版本）'
        },
        {
          label: 'V4（GitLab 9.0及以上版本）',
          value: 2,
          version: 'V4',
          description: '（GitLab 9.0及以上版本）'
        }
      ],
      rules: {
        baseUrl: [
          {
            required: true,
            message: '请输入Git地址',
            trigger: ['blur', 'change']
          },
          {
            validator: validatorUrl,
            message: '仓库Git地址格式错误',
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
        gitlabApiVersion: [
          {
            required: true,
            message: '请选择GitLab API版本',
            trigger: ['blur', 'change']
          }
        ],
        gitlabPersonAccessToken: [
          {
            required: true,
            message: '请输入Git Access Token',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {
    versionString () {
      return this.versionOptions.find(item => item.value === this.form.gitlabApiVersion) || {}
    }
  },
  methods: {
    // 切换版本
    changeVersion () {
      this.form.authType = 2
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

    // 测试配置
    test () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitTest()
        } else {
          return false
        }
      })
    },

    // 提交测试
    submitTest () {
      this.loading = true
      testConfig({
        ...this.form,
        projectId: this.project.id / 1
      }).then(response => {
        this.$message.success('连接成功！')
      }).catch(error => {
        if (error) {
          this.$message.error(error.message)
        }
      }).finally(() => {
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },

    // 提交后端
    submit () {
      saveConfig({
        ...this.form,
        projectId: this.project.id
      }).then(response => {
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
      try {
        this.$refs.form.clearValidate()
        this.$refs.form.resetFields()
      } catch (err) {
      }
      this.dialogVisible = false
    },

    // 复制文本
    copyText: copyText,

    open () {
    }
  }
}
</script>

<style scoped lang="scss">
.input-width {
  width: 580px;
}

:deep(.el-dialog__body) {
  padding-right: 0 !important;
  padding-bottom: 50px;

  .el-form-item {
    margin-bottom: 25px;

    .abs-text {
      z-index: 10;
      position: absolute;
      outline: none;
      background: #fff;
      width: 250px;
      height: 80%;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      font-size: 14px;
      align-items: center;
      left: 10px;

      span:nth-child(1) {
        color: #333;
      }

      span:nth-child(2) {
        color: #999;
      }
    }
  }
}

.dialog-footer {
  justify-content: space-between;

  .test-btn {
    border: 1px solid #8fc4f2;
    color: #2C5F8A;
  }
}
</style>
