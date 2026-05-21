<template>
  <div class="view-content">
    <div class="view-header">
      <icon-button tooltip-disabled el-icon="el-icon-back" radius @click="back"></icon-button>
      选择仓库
    </div>
    <div :class="['container',{'fixed-warp':activeStep === 1}]">
      <el-steps
        class="custom-step"
        :active="activeStep"
        align-center>
        <el-step title="选择仓库" :icon="activeStep === 2 ? 'el-icon-success' : ''"></el-step>
        <el-step title="检测配置"></el-step>
      </el-steps>
      <el-form
        class="step-form-1"
        v-show="activeStep === 1"
        :model="form"
        label-width="70px"
        :rules="rules"
        ref="form"
        size="medium"
        @submit.native.prevent
        label-position="left">
        <el-form-item prop="gitServerType" label="仓库来源：">
          <el-radio-group
            v-model="form.gitServerType"
            @change="changeGitServerType"
          >
            <el-radio
              v-for="(value, key) in gitServerType"
              :label="Number(key)"
              :key="key"
              :disabled="value.disabled"
              :checked="key === form.gitServerType"
            >{{ value.text }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="仓库地址：" prop="baseUrl" class="base-url">
          {{ activeGitInfo.baseUrl || '-' }}
        </el-form-item>
        <RepositoryList ref="repositoryList" :checked.sync="checked" :selectAll.sync="form.selectAll"
                        :total.sync="total"/>
      </el-form>
      <el-form
        class="step-form-2"
        :style="{width: deepApply === 1 ? '550px' : '550px'}"
        v-show="activeStep === 2"
        :model="form"
        label-width="120px"
        inline
        :rules="rules"
        ref="form"
        size="medium"
        label-position="right">
        <el-row>
          <el-form-item prop="check" label="审查方式：">
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
            <el-select class="w-210" v-model="deepApply" @change="form.deepLimit = 5" placeholder="活动区域">
              <el-option label="默认（组件实际依赖层级）" :value="0"></el-option>
              <el-option label="自定义" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="rest-number-style"
            label=""
            prop="deepLimit"
            v-if="deepApply === 1">
            <el-input-number class="w-100" v-model="form.deepLimit" @change="numberChange" controls-position="right"
                             :min="1" :max="100" placeholder="自定义"></el-input-number>
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
        <el-row>
<!--          <el-form-item prop="cleanLevel" label="代码溯源分析：">-->
<!--        <span slot="label">-->
<!--          <el-tooltip class="item" placement="top">-->
<!--            <div style="width: 300px; line-height: 18px;" slot="content">-->
<!--             源代码溯源检测分析，通过SCA分层多源指纹分析、相似哈希精准匹配等关键技术对源代码进行深度的扫描分析，从代码层面识别出引用的开源项目的来源，定位代码中的漏洞及许可证合规风险。<br><br>-->
<!--             该规则开启后会对检测速度有一定影响。-->
<!--              </div>-->
<!--            <i class="iconfont iconbangzhu"></i>-->
<!--          </el-tooltip>-->
<!--            代码溯源分析：-->
<!--        </span>-->
<!--            <el-switch-->
<!--              :active-value="1"-->
<!--              :inactive-value="0"-->
<!--              v-model="form.source"-->
<!--            >-->
<!--            </el-switch>-->
<!--          </el-form-item>-->
        </el-row>
        <el-row>
          <el-form-item prop="check" label="定时检测：">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="form.scheduleTaskSwitchStatus"
            >
            </el-switch>
          </el-form-item>
        </el-row>
        <el-row style="padding-left: 135px;" v-if="form.scheduleTaskSwitchStatus === 1">
          <el-form-item prop="check" label="">
            <el-select
              class="w-100 m-r-10"
              v-model="form.scheduleTaskFrequencyType"
              placeholder="请选择">
              <el-option :label="'每天'" :value="1"></el-option>
              <el-option :label="'每周'" :value="2"></el-option>
            </el-select>
            <el-select
              class="w-100 m-r-10"
              v-show="form.scheduleTaskFrequencyType === 2"
              v-model="form.scheduleTaskDayOfWeek"
              placeholder="请选择">
              <el-option
                v-for="(value, index) in weekOptions"
                :key="index"
                :label="value.label"
                :value="value.value">
              </el-option>
            </el-select>
            <el-time-picker
              style="width: 120px;"
              v-model="form.scheduleTaskTimeOfDay"
              :value-format="'HH:mm'"
              :clearable="false"
              :format="'HH:mm'"
              placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="view-footer fixed-footer" v-if="activeStep === 1">
      <div class="container">
        <div class="rel">
          <!--          <div class="selection-all" v-if="activeStep === 1">-->
          <!--            <el-checkbox  v-model="form.selectAll">选择全部仓库</el-checkbox>-->
          <!--            仓库总数 {{total}} 个，已选择-->
          <!--            <span class="blue-text" v-if="form.selectAll">全部仓库</span>-->
          <!--            <template v-else><span :class="{'blue-text': checked.length > 0}">{{checked.length}}</span> 个</template>-->
          <!--          </div>-->
          <el-button size="medium" class="w-80 m-r-20" @click="back">
            返 回
          </el-button>
          <el-button size="medium" class="w-100" type="primary" :disabled="!(checked.length > 0 || form.selectAll)"
                     style="width: 90px;"
                     @click="activeStep = 2">
            下一步
          </el-button>
        </div>
      </div>
    </div>
    <div class="view-footer" v-if="activeStep === 2">
      <div class="container">
        <div>
          <el-button size="medium" class="w-80 m-r-20" @click="activeStep = 1">
            上一步
          </el-button>
          <el-button size="medium" class="w-100 m-r-20" type="primary" @click="submitTestHandler">
            提交检测
          </el-button>
          <el-button size="medium" class="w-80" @click="back">
            取 消
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RepositoryList from './RepositoryList.vue'
import { getGitConf, gitRepositoryDetectBatch } from '@/api/home/scan/develop/repository/git/index.js'
import LogoGitLab from '@/assets/images/gitlab.png'
import LogoGitHub from '@/assets/images/github.png'
import LogoGitee from '@/assets/images/gitee.png'

export default {
  name: 'ScanDevelopRepositoryGitAdd',
  components: {
    RepositoryList
  },
  data () {
    return {
      project: this.$store.state.home.project,
      total: 0,
      activeStep: 1,
      checked: [],
      deepApply: 0,
      form: {
        // source: 0,
        deepLimit: 5,
        gitServerType: 1,
        type: 1,
        pullMode: 2,
        url: '',
        checkType: 0,
        cleanLevel: 1,
        selectAll: false,
        branch: '',
        scheduleTaskDayOfWeek: 2,
        scheduleTaskFrequencyType: 1,
        scheduleTaskSwitchStatus: 0,
        scheduleTaskTimeOfDay: '20:01'
      },
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
      ],
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          }
        ]
      },
      activeGitInfo: {},
      gitServerType: {
        1: {
          text: 'GitLab',
          img: LogoGitLab
        },
        2: {
          text: 'GitHub',
          img: LogoGitHub,
          disabled: true
        },
        3: {
          text: 'Gitee',
          img: LogoGitee
        }
      },
      gitServerTypeInfoList: {
        1: {
          baseUrl: '',
          gitServerType: 1,
          gitlabApiVersion: '',
          gitlabPersonAccessToken: '',
          id: '',
          authType: 1,
          password: '',
          projectId: '',
          username: ''
        },
        2: {
          baseUrl: '',
          gitServerType: 2,
          gitlabApiVersion: '',
          gitlabPersonAccessToken: '',
          id: '',
          authType: 1,
          password: '',
          projectId: '',
          username: ''
        },
        3: {
          baseUrl: '',
          gitServerType: 3,
          gitlabApiVersion: '',
          gitlabPersonAccessToken: '',
          id: '',
          authType: 1,
          password: '',
          projectId: '',
          username: ''
        }
      }
    }
  },
  methods: {
    // 初始化
    init () {
      this.loading = true
      getGitConf({
        projectId: this.project.id,
        loading: false
      }).then(response => {
        this.loading = false
        const data = response.data
        data.forEach(item => {
          if (item.gitServerType && this.gitServerTypeInfoList[item.gitServerType]) {
            this.gitServerTypeInfoList[item.gitServerType] = {
              hasConf: true,
              ...this.gitServerTypeInfoList[item.gitServerType],
              ...item
            }
            this.form.gitServerType = item.gitServerType
          }
        })
        this.changeGitServerType()
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 切换仓库类型时执行
    changeGitServerType () {
      this.activeGitInfo = {
        ...this.gitServerTypeInfoList[this.form.gitServerType]
      }

      this.$refs.repositoryList.id = this.activeGitInfo.id
      this.$refs.repositoryList.configType = this.form.gitServerType
      // if (this.form.gitServerType !== 1) return
      this.$refs.repositoryList.search()
    },

    back () {
      this.$router.push({
        path: '/scan/develop/repository/list/git'
      })
    },

    /**
     * @name 提交检测
     * @param void
     * @return void
     */
    async submitTestHandler () {
      const checkdList = this.form.selectAll ? this.$refs.repositoryList.getAllNodes() : this.checked
      // 单次处理仓库不能超过100个
      if (checkdList.length > 100) {
        return this.$message({
          message: '当前最多可选择100个仓库'
        })
      }
      try {
        const params = {
          // source: this.form.source,
          checkType: this.form.checkType,
          cleanLevel: this.form.cleanLevel,
          // selectAll: this.form.selectAll,
          gitRepositoryConfigId: this.activeGitInfo.id,
          [this.form.gitServerType === 1 ? 'gitlabRepositories' : 'giteeRepositories']: checkdList.map(item => ({
            gitlabRepositoryId: item.gitlabRepositoryId,
            branch: item.defaultBranch,
            httpUrl: item.httpUrl,
            sshUrl: item.sshUrl,
            webUrl: item.webUrl,
            repositoryName: item.name,
            description: item.description,
            ...(this.form.gitServerType === 3 ? {
              giteeRepoOwner: item.giteeRepoOwner,
              giteeRepoPath: item.giteeRepoPath
            } : {})
          })),
          projectId: this.project.id,
          scheduleTaskSwitchStatus: this.form.scheduleTaskSwitchStatus,
          scheduleTaskDayOfWeek: this.form.scheduleTaskDayOfWeek,
          scheduleTaskFrequencyType: this.form.scheduleTaskFrequencyType,
          scheduleTaskTimeOfDay: this.form.scheduleTaskTimeOfDay
        }

        this.deepApply === 1 && (params.deepLimit = this.form.deepLimit)

        const result = await gitRepositoryDetectBatch(params)
        if (result.message === 'success') {
          this.$message.success('操作成功！')
          this.back()
        }
      } catch (error) {
        if (error) {
          this.$message.error(error.message)
        }
      }
    },
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
    /**
     * @desc 解决子组件在style scoped中无法修改父组件的样式
     * @param type { String }
     */
    changeMainStyle (type) {
      const gitViewMain = document.getElementById('gitViewMain')
      gitViewMain && (gitViewMain.style.paddingBottom = type === 'beforeDestroy' ? '20px' : '0')
    }
  },
  beforeDestroy () {
    this.changeMainStyle('beforeDestroy')
  },
  mounted () {
    this.changeMainStyle('mounted')
    if (this.$store.state.home.project !== null) {
      this.init()
    }
  }
}
</script>
<style scoped lang="scss">
.fixed-warp {
  min-height: calc(100vh - 175px);
}

.view-header {
  i {
    margin-bottom: -2px;
    font-weight: bold;
    margin-right: 5px;
    vertical-align: bottom;
  }
}

.view-content {
  .container {
    width: 100%;
    max-width: 1086px;
    margin: 0 auto;
    position: relative;
  }

  :deep(.el-step__head.is-success) {
    border-color: #8B5CF6;
    color: #fff;

    .el-step__icon {
      background: #8B5CF6;
    }
  }

  .view-footer {
    position: relative;
    text-align: center;
    border: none;
  }

  .fixed-footer {
    position: sticky;
    z-index: 99;
    bottom: 0;
    background: #fff;
    width: 100%;
    border: 1px solid rgb(227, 233, 241);
    box-shadow: 0 0 8px 0 rgba(0, 75, 144, 9%);
  }
}

.selection-all {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);

  .el-checkbox {
    padding: 0 14px 0 13px;

    @media (max-width: 1600px) and (min-width: 1360px) {
      padding: 0 14px 0 7px;
    }

    @media (max-width: 1359px) and (min-width: 1180px) {
      padding: 0 14px 0 5px;
    }

    @media (max-width: 1179px) {
      padding: 0 14px 0 5px;
    }
  }
}

.el-steps {
  margin-top: 30px;
}

.el-form {
  padding: 20px 0;
}

.step-form-2 {
  width: 500px;
  margin: 0 auto;
}

.el-form-item {
  .el-input {
    max-width: 500px;
  }

  .form-item-timing {
    .el-select,
    .el-date-editor {
      width: 120px;
      margin-right: 10px;
    }
  }

  :deep(.el-form-item__content) {
    padding-left: 12px;
  }

  :deep(.el-form-item__label) {
    padding-right: 0;
    margin-right: 15px;
  }
}

.base-url {
  :deep(.el-form-item__content) {
    border-radius: 2px;
    background: #f9fbff;
    padding-left: 12px;
  }
}

.custom-step {
  :deep(.el-icon-success) {
    font-size: 28px;
  }
}

.blue-text {
  color: $color-primary;
  font-weight: bold;
}

.rest-number-style {
  :deep(.el-form-item__content) {
    padding-left: 0;
  }
}
</style>
