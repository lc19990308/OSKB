<template>
  <div class="container">
    <div class="view-content">
      <el-form v-loading="loading" :model="form" :rules='rules' ref='form' label-width="120px" size="small" label-position="right">
        <el-row>
          <el-form-item label="仓库来源：" prop="code">
            <el-radio-group v-model="form.code">
              <el-radio v-for="item in sourceOptions" :key="item.value" :label="item.value">{{item.text}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row style="max-width: 800px;">
          <el-form-item prop="protocol">
            <span slot="label">
              <el-tooltip class="item" placement="top">
                <div style="width: auto; line-height: 18px;" slot="content">
                  下载或克隆代码时使用的协议
                </div>
                <i class="iconfont iconbangzhu"></i>
              </el-tooltip>
              协议：
            </span>
            <el-radio-group v-model="form.protocol">
              <el-radio v-for="item in agreementOptionsShow" :key="item.value" :label="item.value">{{item.text}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div :style="{marginLeft:'30px'}">
            <el-form-item label="仓库名称：" prop="repoName">
              <el-input v-model="form.repoName" placeholder="请输入仓库名称"></el-input>
            </el-form-item>
            <el-form-item label="仓库地址：" prop="url">
              <el-input v-model="form.url" placeholder="请输入仓库地址"></el-input>
            </el-form-item>
            <template v-if="form.protocol===1">
              <el-form-item label="用户名：" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码：" prop="password">
                <el-input type="password" show-password v-model="form.password" placeholder="请输入密码"></el-input>
              </el-form-item>
            </template>
            <template v-else>
              <!-- <el-form-item label="SSH公钥：" prop="privateKey">
                <el-input v-model="form.privateKey" type="textarea" rows="3" placeholder="请输入SSH公钥"></el-input>
              </el-form-item> -->
              <el-form-item label="SSH公钥：">
                <div class="ssh-tips">请复制并将下方SSH公钥添加到您代码仓库的公钥管理中</div>
                <div class="copy-content">
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content" class="tooltip-ellipsis">{{publicKey}}</div>
                    <span class="ellipsis">{{publicKey}}</span>
                  </el-tooltip>
                  <span class="copy-button" @click="copyPublicKey">复制</span>
                </div>
              </el-form-item>
            </template>
          </div>
        </el-row>
        <el-row>
          <el-form-item label="检测分支：" prop="branchList">
            <el-select v-model="form.branchList" multiple collapse-tags placeholder="请选择" filterable @visible-change="branchChange">
              <div slot="empty" class="no-data-select" v-if="branchLoading&&!branchOptions.length" v-loading="branchLoading">正在加载</div>
              <div v-else>
                <el-option
                  v-for="item in branchOptions"
                  :key="item.value"
                  :disabled="item.isAdd === 1"
                  :label="item.text"
                  :value="item.value">
                  <div style="display: flex; align-items: center; justify-content: space-between">
                    <span>{{item.text}}</span>
                    <span v-if="item.isAdd === 1" style="margin-right: -30px">已添加</span>
                  </div>
                </el-option>
              </div>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="check" label="定时检测：">
            <el-switch
              @change="checkChange"
              :active-value="1"
              :inactive-value="0"
              v-model="form.scheduleTaskSwitchStatus"
            >
            </el-switch>
          </el-form-item>
<!--          <el-form-item label=" ">-->
<!--            <el-checkbox v-model="form.cleanPackage" :true-label="1" :false-label="0">检测完毕后立即删除源码包</el-checkbox>-->
<!--          </el-form-item>-->
        </el-row>
        <el-row style="padding-left: 110px;"
          v-if="form.scheduleTaskSwitchStatus === 1" class="check-content">
          <el-form-item
            style="margin-right: 0;" prop="scheduleTaskFrequencyType"
            label=""
            :rules="{ required: true, message: '请选择', trigger: 'change' }"
          >
            <el-select
              class="w-100 m-r-10"
              v-model="form.scheduleTaskFrequencyType"
              placeholder="请选择">
              <el-option :label="'每天'" :value="1"></el-option>
              <el-option :label="'每周'" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="form.scheduleTaskFrequencyType === 2"
            style="margin-right: 0;"
            prop="scheduleTaskDayOfWeek"
            label=""
            :rules="{ required: true, message: '请选择', trigger: 'change' }"
          >
            <el-select
              class="w-100 m-r-10"
              v-model="form.scheduleTaskDayOfWeek"
              placeholder="请选择">
              <el-option
                v-for="(value, index) in weekOptions"
                :key="index"
                :label="value.label"
                :value="value.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="scheduleTaskTimeOfDay"
            label=""
            :rules="{ required: true, message: '请选择', trigger: 'change' }"
          >
            <el-time-picker
              style="width: 130px;"
              v-model="form.scheduleTaskTimeOfDay"
              :value-format="'HH:mm'"
              :format="'HH:mm'"
              placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="checkType" label="审查方式：">
          <span slot="label">
            <el-tooltip class="item" placement="top">
              <div style="width: 300px; line-height: 18px;" slot="content">
                快速审查：检测速度快。通过成分分析、依赖分析、特征分析、引用识别等技术精确识别应用内引入的开源组件的基本信息、已知漏洞、开源许可证等信息<br><br>
                深度审查：在快速审查的基础上进一步检测并分析开源组件的子依赖，检测速度较慢
              </div>
              <i class="iconfont iconbangzhu"></i>
            </el-tooltip>
            审查方式：
          </span>
            <el-radio v-model="form.checkType" :label="0">快速审查</el-radio>
            <el-radio v-model="form.checkType" :label="1">深度审查</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="checkType" label="解析深度：">
          <span slot="label">
            <el-tooltip class="item" placement="top">
              <div style="width: 300px; line-height: 18px;" slot="content">
                组件依赖解析深度：可自定义组件依赖的解析深度。<br><br>
                选择默认时，平台会默认根据组件的实际依赖层级进行检测；选择自定义时，用户可根据实际需求设置组件依赖检测层级（1-100层，默认检测5层）。
              </div>
              <i class="iconfont iconbangzhu"></i>
            </el-tooltip>
            解析深度：
          </span>
            <el-select
              class="w-210"
              v-model="deepApply"
              @change="form.deepLimit = 5"
              placeholder="活动区域">
              <el-option label="默认（组件实际依赖层级）" :value="0"></el-option>
              <el-option label="自定义" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label=""
            prop="deepLimit"
            v-if="deepApply === 1">
            <el-input-number
            class="w-100"
            v-model="form.deepLimit"
            @change="numberChange"
            controls-position="right"
            :min="1"
            :max="100"
            placeholder="自定义"></el-input-number>
            层
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="cleanLevel" label="数据清洗：">
          <span slot="label">
            <el-tooltip class="item" placement="top">
              <div style="width: 300px; line-height: 18px;" slot="content">
                快速清洗：只清洗无效组件，结果包含项目中所有可能引入的组件<br>
                深度清洗：清洗重复声明和未使用的组件，结果只包含有可能直接影响项目安全的组件，推荐使用该选项
                </div>
              <i class="iconfont iconbangzhu"></i>
            </el-tooltip>
              数据清洗：
          </span>
            <el-radio-group v-model="form.cleanLevel">
              <el-radio :label="1">快速清洗</el-radio>
              <el-radio :label="2">深度清洗</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row style="max-width: 800px;">
          <el-form-item
          label="仓库说明："
          prop="description"
          >
            <el-input class="w-full" show-word-limit v-model="form.description" :maxlength="100" :rows="3" type="textarea"
                      placeholder="请输入仓库说明"></el-input>
          </el-form-item>
        </el-row>
        <div class="operation-button">
          <el-button @click="onsubmit('form')" type="primary" size="medium" class="w-100">保存并检测</el-button>
          <el-button @click="$router.push('/scan/develop/repository/list/git')" size="medium" class="w-100 m-r-20">关 闭</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  gitList,
  agreementList,
  branchList,
  saveConfig
} from '@/api/home/scan/develop/repository/git/batchAdd/warehouse'
import { copyText } from '@/utils'
import { geSshPublic } from '@/api/home/scan/develop/repository/git'
import { validateSshUrl } from '@/utils/validate'
export default {
  name: 'warehouseAdd',
  data () {
    const validaBranch = (rule, value, callback) => {
      // 获取检测分支接口请求完成 && 没数据(获取失败)
      if (!this.branchLoading && !this.branchOptions.length) {
        callback(new Error('获取仓库分支失败，请检查仓库连接配置是否正确！'))
      } else if (Array.isArray(value) && value.length > 0) {
        callback()
      } else {
        callback(new Error('请选择检测分支!'))
      }
    }

    const regHttp = () => /^https?:\/\/.*\.git$/g
    // 校验url
    const validatorUrl = (rule, value, callback) => {
      if (value) {
        if (this.form.protocol === 1) {
          if (regHttp().test(value)) {
            callback()
          } else {
            callback(new Error('仓库地址格式错误'))
          }
        } else if (this.form.protocol === 2) {
          if (validateSshUrl(value)) {
            callback()
          } else {
            callback(new Error('仓库地址格式错误'))
          }
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入仓库地址'))
      }
    }
    return {
      branchLoading: false,
      loading: false,
      deepApply: 0,
      publicKey: '',
      form: {
        cleanPackage: 0, // 1 or 0
        repoName: '',
        code: null,
        protocol: null,
        url: '',
        username: '',
        password: '',
        privateKey: '',
        branchList: [],
        scheduleTaskSwitchStatus: 0,
        scheduleTaskFrequencyType: 1,
        scheduleTaskDayOfWeek: '',
        scheduleTaskTimeOfDay: '',
        checkType: 0,
        deepLimit: 5,
        cleanLevel: 1,
        description: ''
      },
      rules: {
        code: [
          { required: true, message: '请选择仓库来源', trigger: ['change', 'blur'] }
        ],
        protocol: [
          { required: true, message: '请选择协议', trigger: ['change', 'blur'] }
        ],
        url: [
          { required: true, validator: validatorUrl, trigger: ['blur', 'change'] }
        ],
        repoName: [
          {
            validator: (rule, value, callback) => {
              if (typeof value === 'string' && value.length > 30) {
                callback(new Error('仓库名称不可超过30个字符'))
              } else {
                callback()
              }
            }
          }

        ],
        username: [
          // { required: true, message: '请输入用户名', trigger: ['change', 'blur'] }
        ],
        password: [
          // { required: true, message: '请输入密码', trigger: ['change', 'blur'] }
        ],
        privateKey: [
          { required: true, message: '请输入SSH公钥', trigger: ['change', 'blur'] }
        ],
        branchList: [
          { validator: validaBranch, trigger: ['change', 'blur'] },
          { required: true, message: '请选择检测分支', trigger: ['change', 'blur'] }
        ]
      },
      // 仓库来源
      sourceOptions: [],
      // 协议
      agreementOptions: [],
      agreementOptionsShow: [],
      branchOptions: [],
      weekOptions: [
        {
          label: '周一',
          value: 2
        },
        {
          label: '周二',
          value: 3
        },
        {
          label: '周三',
          value: 4
        },
        {
          label: '周四',
          value: 5
        },
        {
          label: '周五',
          value: 6
        },
        {
          label: '周六',
          value: 7
        },
        {
          label: '周日',
          value: 1
        }
      ]
    }
  },
  watch: {
    'form.protocol' () {
      this.form.username = ''
      this.form.password = ''
      this.form.privateKey = ''
      this.form.branchList = []
      this.$refs.form.clearValidate(['username', 'password', 'privateKey', 'branchList'])
      // this.$refs.form.validateField('url')
    },
    'form.code' (value) {
      if (value === 2) {
        this.agreementOptionsShow = this.agreementOptions.filter(item => item.value !== 2)
        this.form.protocol = 1
      } else {
        this.agreementOptionsShow = this.agreementOptions
      }
    }
  },
  methods: {
    /**
     * @desc 防止传入空值
     * @param numValue
     */
    numberChange (numValue) {
      if (typeof numValue === 'undefined') {
        this.$nextTick(() => {
          this.form.deepLimit = 1
        })
      }
    },
    branchChange (value) {
      const verification = []// 没有false代表可以进行检测分支下拉的请求
      this.$refs.form.validateField('url', error => {
        verification.push(!error.length)
      })
      // this.$refs.form.validateField('username', error => {
      //   verification.push(!error.length)
      // })
      // this.$refs.form.validateField('password', error => {
      //   verification.push(!error.length)
      // })
      this.$refs.form.validateField('privateKey', error => {
        verification.push(!error.length)
      })
      if (value) { // 任何情况菜单出现都重置数据
        this.form.branchList = []
        this.branchOptions = []
      }
      // 未满足获取分支条件不进行请求
      if (verification.includes(false)) { return }
      if (value === true) {
        this.branchLoading = true
        branchList({
          password: this.form.password,
          privateKey: this.form.privateKeypassword,
          protocol: this.form.protocol,
          url: this.form.url,
          username: this.form.username,
          projectId: this.projectMixin.id
        }).then(response => {
          this.branchLoading = false
          if (response.code === 0) {
            const list = Object.keys(response.data).map(key => {
              return {
                value: key,
                text: key,
                isAdd: response.data[key] | 0
              }
            })
            this.branchOptions = list.sort((a, b) => a.isAdd - b.isAdd)
            this.$refs.form.validateField('branchList')
          } else {
            this.$refs.form.validateField('branchList')
          }
        }).catch(error => {
          this.branchLoading = false
          // 如果获取失败触发校验，提示获取失败
          this.$refs.form.validateField('branchList')
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }
    },
    checkChange (value) {
      if (value === 0) { // 关闭
        this.form.scheduleTaskFrequencyType = 1
        this.form.scheduleTaskDayOfWeek = ''
        this.form.scheduleTaskTimeOfDay = ''
      }
    },
    onsubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            ...this.form,
            projectId: this.projectMixin.id
          }
          this.deepApply !== 1 && (delete params.deepLimit)
          saveConfig(params).then(response => {
            this.loading = false
            this.$message.success('保存成功')
            this.$router.push('/scan/develop/repository/list/git')
          }).catch(error => {
            this.loading = false
            if (typeof error === 'object') {
              this.$message.error(error.message)
            }
          })
        } else {
          return false
        }
      })
    },
    // 获取git仓库类型
    gitList () {
      gitList().then(response => {
        this.sourceOptions = response.data.map(item => {
          return {
            value: item.code,
            text: item.name
          }
        })
        const un = this.sourceOptions.pop()
        this.sourceOptions.push({
          value: 9,
          text: 'FTP'
        })
        this.sourceOptions.push(un)
        this.form.code = this.sourceOptions[0]?.value
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    // 获取协议
    agreementList () {
      agreementList().then(response => {
        this.agreementOptions = response.data.map(item => {
          return {
            value: item.code,
            text: item.name
          }
        })
        this.agreementOptionsShow = this.agreementOptions
        this.form.protocol = this.agreementOptions[0]?.value
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    geSshPublic () {
      geSshPublic().then(response => {
        this.publicKey = response.data
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    copyPublicKey () {
      copyText(this.publicKey)
    }
  },
  mounted () {
    this.gitList()
    this.agreementList()
    this.geSshPublic()
  }
}
</script>

<style scoped lang="scss">

.container {
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.no-data-select {
  height: 70px;
  line-height: 70px;
  margin: 0;
  text-align: center;
  font-size: 14px;
}

:deep(.check-content) {
  display: flex;

  .el-form-item__content {
    margin-left: 0 !important;
  }
}

.operation-button {
  display: flex;
  justify-content: center;
}

.tooltip-ellipsis {
  max-width: 500px;
}

.ssh-tips {
  color: #EF4444;
  margin-bottom: 10px;
}

.copy-button {
  border-radius: 2px;
  color: #666;
  background: rgb(255, 255, 255);
  width: 42px;
  height: 23px;
  box-sizing: border-box;
  line-height: 23px;
  text-align: center;
  cursor: pointer;
}

.copy-content {
  color: #999;
  background-color: #eff3f6;
  height: 34px;
  line-height: 34px;
  padding: 0 15px;
  border-radius: 3px;
  border: 1px solid #dcdee0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ellipsis {
  max-width: 85%;
}
</style>
