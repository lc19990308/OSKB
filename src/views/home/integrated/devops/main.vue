<template>
  <div>
    <el-alert :closable="false" type="primary" class="header-alert">
      <div class="alert-content">
        <i class="el-icon-info"></i>
        目前本平台已集成以下流水线及DevOps平台，您可下载对应的插件集成至您的工具中，在流水线相应阶段进行开源组件安全检测。插件的检测结果会在【集成部署】内统一管理。
      </div>
    </el-alert>
    <div class="devops-item-box" v-for="item in layout" :key="item.name">
      <div class="devops-icon">
        <div>
          <img :src="item.icon" alt="">
        </div>
      </div>
      <div class="devops-content">
        <el-row class="devops-desc">{{ item.desc }}</el-row>
        <el-row class="devops-btn">
          <el-button size="small" @click="downloadAppDetectionPlugin(item)" plain
                     v-if="item.buttons.appDetectionPlugin">
            <i class="iconfont iconxiazai1"></i>安全检测插件
          </el-button>
          <el-button size="small" @click="downloadReportGenerationPlugin(item)" plain
                     v-if="item.buttons.reportGenerationPlugin">
            <i class="iconfont iconxiazai1"></i>报告生成插件
          </el-button>
          <el-button size="small" @click="downloadScript(item)" plain v-if="item.buttons.script">
            <i class="iconfont iconxiazai1"></i>流水线脚本
          </el-button>
          <el-button size="small" @click="downloadDocs(item)" plain v-if="item.buttons.docs">
            <i class="iconfont iconxiazai1"></i>集成使用文档
          </el-button>
          <el-button size="small" @click="downloadJenkinsPipeline()" plain v-if="item.name === 'jenkins' && item.buttons.pipeline">
            <i class="iconfont iconxiazai1"></i>Jenkins Pipeline脚本
          </el-button>
          <el-button size="small" @click="downloadJenkinsShell()" plain v-if="item.name === 'jenkins' && item.buttons.shell">
            <i class="iconfont iconxiazai1"></i>Jenkins Shell脚本
          </el-button>

          <el-button size="small" @click="downloadGitlabCiPipeline()" plain v-if="item.name === 'gitlab' && item.buttons.pipeline">
            <i class="iconfont iconxiazai1"></i>GitLab CI Pipeline脚本
          </el-button>

          <el-button size="small" @click="downloadCLI()" plain v-if="item.name === 'cli' &&
          item.buttons.cli">
            <i class="iconfont iconxiazai1"></i>CLI工具
          </el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadBlobFile } from '@/utils'
import {
  downloadDetectPlugin,
  downloadScript,
  downloadReportPlugin,
  downloadUsingDocument,
  downloadJenkinsPipeline, downloadJenkinsShell, downloadGitlabCiPipeline, downloadCLI
} from '@/api/home/integrated/devops'

export default {
  name: 'DevopsMain',
  data () {
    return {
      layout: [
        {
          name: 'jenkins',
          desc: 'Jenkins平台的流水线插件，用于Jenkins流水线的构建阶段对应用内引入的开源组件进行安全性检测，支持检测规则及质量门禁配置，检测范围包括组件成分分析、组件漏洞风险分析、许可证风险分析。',
          icon: require('@/assets/images/svg/jenkins.svg'),
          buttons: {
            docs: false,
            appDetectionPlugin: true,
            reportGenerationPlugin: false,
            script: false,
            shell: true,
            pipeline: true
          }
        },
        {
          name: 'blueking',
          desc: '蓝鲸DevOps平台的流水线插件，用于流水线的构建阶段对应用内引入的开源组件进行安全性检测，支持检测规则及质量门禁配置，检测范围包括组件成分分析、组件漏洞风险分析、许可证风险分析，检测完毕后会生成应用组件安全检测报告。',
          icon: require('@/assets/images/svg/blueking.svg'),
          buttons: {
            docs: false,
            appDetectionPlugin: true,
            reportGenerationPlugin: false,
            script: false
          }
        },
        {
          name: 'coding',
          desc: 'Coding DevOps平台的流水线插件，用于流水线的构建阶段对应用内引入的开源组件进行安全性检测，支持检测规则及质量门禁配置，检测范围包括组件成分分析、组件漏洞风险分析、许可证风险分析，检测完毕后会生成应用组件安全检测报告。',
          icon: require('@/assets/images/svg/coding.svg'),
          buttons: {
            docs: false,
            appDetectionPlugin: true,
            reportGenerationPlugin: false,
            script: false
          }
        },
        {
          name: 'azure',
          desc: 'Azure DevOps平台流水线脚本，用于流水线的构建阶段对应用内引入的开源组件进行安全性检测，检测范围包括组件成分分析、组件漏洞风险分析、许可证风险分析。目前支持以Pipeline流水线脚本形式集成至Azure DevOps平台。',
          icon: require('@/assets/images/svg/azure.svg'),
          buttons: {
            docs: false,
            appDetectionPlugin: false,
            reportGenerationPlugin: false,
            script: true
          }
        },
        {
          name: 'gitlab',
          desc: '通过GitLab CI Pipeline脚本集成GitLab 内置的CI/CD流水线，对应用内引入的开源组件进行安全性检测，支持检测规则及质量门禁配置，检测范围包括组件成分分析、组件漏洞风险分析、许可证风险分析。',
          icon: require('@/assets/images/svg/scan/gitlab.svg'),
          buttons: {
            pipeline: true
          }
        },
        {
          name: 'cli',
          desc: 'XMIRROR-SCA-CLI客户端检测工具，无需将源码包等检测文件上传至本平台，在客户端本地完成开源组件成分提取后，将提取结果文件上传至平台检测即可。',
          icon: require('@/assets/images/svg/scan/cli.svg'),
          buttons: {
            cli: true
          }
        }
      ]
    }
  },
  methods: {
    async downloadAppDetectionPlugin (item) {
      if (!this.authorityFilter(2901)) return this.$message.info('您无此操作权限')
      try {
        const result = await downloadDetectPlugin(item.name)
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async downloadReportGenerationPlugin (item) {
      if (!this.authorityFilter(2901)) return this.$message.info('您无此操作权限')
      try {
        const result = await downloadReportPlugin(item.name)
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async downloadScript (item) {
      if (!this.authorityFilter(2901)) return this.$message.info('您无此操作权限')
      try {
        const result = await downloadScript(item.name)
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async downloadDocs (item) {
      if (!this.authorityFilter(2901)) return this.$message.info('您无此操作权限')
      try {
        const result = await downloadUsingDocument(item.name)
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async downloadJenkinsPipeline () {
      if (!this.authorityFilter(2901)) return this.$message.info('您无此操作权限')
      try {
        const result = await downloadJenkinsPipeline()
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async downloadJenkinsShell () {
      if (!this.authorityFilter(2901)) return this.$message.info('您无此操作权限')
      try {
        const result = await downloadJenkinsShell()
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async downloadGitlabCiPipeline () {
      if (!this.authorityFilter(2901)) return this.$message.info('您无此操作权限')
      try {
        const result = await downloadGitlabCiPipeline()
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async downloadCLI () {
      if (!this.authorityFilter(2901)) return this.$message.info('您无此操作权限')
      try {
        const result = await downloadCLI()
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.header-alert {
  position: relative;
  margin-bottom: 20px;
  padding-left: 12px !important;
  padding-right: 12px !important;

  :deep(.el-alert__content) {
    padding: 0;
  }

  :deep(.alert-content) {
    margin-bottom: 5px;
    padding: 0;

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.devops-item-box {
  border-radius: 4px;
  background: rgb(255, 255, 255);
  box-shadow: 0 2px 8px 0 rgba(43, 117, 183, 15%);
  margin-bottom: 20px;
  display: flex;
  padding: 20px;
  box-sizing: border-box;

  .devops-icon {
    width: 80px;
    margin-right: 20px;

    div {
      width: 80px;
      height: 80px;
      background: rgba(222, 237, 251, 70%);
      padding: 13px;
      box-sizing: border-box;
      border-radius: 50%;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .devops-content {
    flex: 1;

    .devops-desc {
      color: rgb(51, 51, 51);
      font-size: 14px;
      line-height: normal;
      letter-spacing: 0;
      text-align: left;
      margin-bottom: 15px;
      padding-top: 10px;
    }

    .devops-btn {
      :deep(.el-button) {
        color: rgb(51, 51, 51);
        font-size: 14px;
        line-height: normal;
        letter-spacing: 0;
        text-align: center;
        height: 32px;
        padding: 0 15px;

        .iconxiazai1 {
          margin-right: 5px;
          color: rgb(153, 153, 153);
        }

        &:hover,
        &:active,
        &:focus {
          color: #1b7ace !important;

          .iconxiazai1 {
            color: #1b7ace !important;
          }
        }
      }
    }
  }
}
</style>
