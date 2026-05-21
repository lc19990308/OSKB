<template>
  <div class="view-content">
    <el-steps class="custom-step" :active="active" align-center>
      <el-step title="" @click.native="active = 1" description="添加 98k-Hunter"></el-step>
      <el-step title=" " @click.native="next" description="安装 98k-Hunter"></el-step>
    </el-steps>
    <div class="step-content step-content-1" v-show="active === 1">
      <el-alert type="primary">
        <template slot>
          <p>98k-Hunter介绍：</p>
          <p>1、98K-Hunter引擎支持在完成应用程序功能测试的同时透明实时完成安全测试，且不会受软件复杂度的影响，适用于各种复杂度的软件产品。</p>
          <p>2、整个过程无需安全专家介入，无需额外安全测试时间投入，不会对现有开发流程造成任何影响，符合敏捷开发和DevOps模式下软件产品快速迭代、快速交付的要求。</p>
          <p>3、运行时SCA检测技术基于请求、代码、数据流、控制流综合分析判断漏洞，漏洞测试准确性高。98K-Hunter通过在应用运行过程中进行动态的软件成分分析，检测应用程序中实际依赖的第三方软件的版本信息和包含的公开漏洞。</p>
          <p>4、安装98K-Hunter前：若服务器上没有wget命令，请先进行安装。</p>
        </template>
      </el-alert>
      <el-form label-position="right" ref="installForm" label-width="200px" size="medium" :model="installForm" :rules="rules">
        <el-form-item label="选择语言：" prop="language">
          <el-select class="w-full" v-model="installForm.language"
                     @change="installForm.language === 'Java' ? (rules.middleware[0].required = true) : (rules.middleware[0].required = false)"
                     placeholder="请选择语言">
            <el-option
              v-for="item in languageOptions"
              :key="'language-' + item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称：" prop="appName">
          <el-input v-model="installForm.appName" placeholder="请输入应用名称"></el-input>
        </el-form-item>
        <el-form-item label="中间件选择：" prop="middleware" v-show="installForm.language === 'Java'">
          <el-select class="w-full" v-model="installForm.middleware" placeholder="请选择中间件">
            <el-option
              v-for="item in middlewareOptions"
              :key="'middleware-' + item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="installForm.language !== 'Java' ? '项目的根目录' : '中间件安装绝对路径：'" prop="path">
          <el-input v-model="installForm.path" :placeholder="installForm.language !== 'Java' ? '请输入项目的根目录' : '请输入中间件安装绝对路径'"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="step-content" v-show="active === 2">
      <el-alert type="primary">
        <template slot>
          <el-button class="right" type="text" @click="isPut = !isPut">{{ isPut ? '收起' : '展开' }}</el-button>
          <p>注意事项：<span v-show="!isPut">98k-Hunter 安装完成后需要重启中间件或完成动态加载操作......</span></p>
          <p v-show="isPut">98k-Hunter 安装完成后需要重启中间件或完成动态加载操作</p>
          <ul v-show="isPut">
            <li>
              <p>▪Java安装注意事项：</p>
              <ul>
                <li>
                  <p>根据平台类型，支持常规加载和动态加载两种方式。</p>
                  <p>常规加载：</p>
                  <ul>
                    <li><p>1.98K-Hunter安装完成后需要团队配合并重新启动中间件。</p></li>
                    <li><p>2.98K-Hunter卸载需进入安装时选择的中间件目录,执行 ./iast/IastAgent -u。卸载完成后请重启中间件。</p></li>
                  </ul>
                </li>
                <li>
                  <p>动态加载（无需重启中间件）：</p>
                  <ul>
                    <li><p>1.本方式暂仅支持Tomcat、Weblogic、Jetty、SpringBoot及JBoss6版本中间件，其他类型请使用常规加载。</p></li>
                    <li><p>2.需配置JAVA_HOME环境变量。</p></li>
                    <li><p>3.98K-Hunter安装完成后需要获取中间件进程pid，进入IAST安装目录,执行 ./IastAgent -p pid，完成加载。</p></li>
                    <li><p>4.若要重新加载，需重启中间件。</p></li>
                    <li><p>5.98K-Hunter卸载需进入安装时选择的中间件目录,执行 ./iast/IastAgent -u。卸载完成后请重启中间件</p></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <p>▪PHP安装注意事项：</p>
              <ul>
                <li>
                  <p>1.98K-Hunter安装完成后需要团队配合并重新启动PHP服务。</p>
                  <p>2.98K-Hunter卸载需进入安装目录的xmiast下执行./uninstall.sh,卸载完成后需重启PHP服务。</p>
                </li>
              </ul>
            </li>
            <li>
              <p>▪Node.JS安装注意事项：</p>
              <ul>
                <li>
                  <p>1.运行时插桩节点安装完成后，启动项目时需要加上参数 -r xmiast，例如：node -r xmiast <span></span>your-app-name<span>></span>.js</p>
                  <p>2.卸载需要在安装目录下执行./uninstall.sh完成卸载</p>
                </li>
              </ul>
            </li>
          </ul>
        </template>
      </el-alert>
      <el-form label-position="right" label-width="200px" size="medium">
        <el-form-item label="Linux安装：">
          <!--           <div v-if="installData.linux32">-->
          <!--             在linux系统上运行一键安装命令(32位)：<el-button size="mini" @click="copyText(installData.linux32)">复制</el-button>-->
          <!--             <code class="code-container m-b-15">{{ installData.linux32 || '-' }}</code>-->
          <!--           </div>-->
          <div v-if="installData.linux64">
            在linux系统上运行一键安装命令(64位)：<el-button size="mini" @click="copyText(installData.linux64)">复制</el-button>
            <code class="code-container">{{ installData.linux64 || '-' }}</code>
          </div>
        </el-form-item>
        <!--         <el-form-item label="Windows安装：" v-if="installData.win32 || installData.win64 || installData.installKey">-->
        <!--           <div v-if="installData.win32">-->
        <!--             请先<el-link :href="installData.win32" target="_blank" type="primary">【下载安装包】（32位）</el-link>-->
        <!--           </div>-->
        <!--           <div v-if="installData.win64">-->
        <!--             请先<el-link :href="installData.win64" target="_blank" type="primary">【下载安装包】（64位）</el-link>-->
        <!--           </div>-->
        <!--           <div v-if="installData.installKey">-->
        <!--             使用CMD进入安装包所在文件执行下面的命令： <el-button size="mini" @click="copyText(installData.installKey)">复制</el-button>-->
        <!--             <code class="code-container">{{ installData.installKey || '-' }}</code>-->
        <!--           </div>-->
        <!--         </el-form-item>-->
      </el-form>
    </div>
    <div class="text-center" v-show="active === 1">
      <el-button size="medium" type="primary" @click="back">返回</el-button>
      <el-button size="medium" type="primary" @click="next">下一步</el-button>
    </div>
    <div class="text-center" v-show="active === 2">
      <el-button size="medium" type="primary" @click="back">安装完成</el-button>
      <el-button size="medium" type="primary" @click="active = 1">上一步</el-button>
    </div>
  </div>
</template>
<script>
import { languageSelect, getMiddleware, nodeInstall } from '@/api/home/scan/node'

export default {
  name: 'node-add',
  data () {
    const checkApplicationName = (rule, value, callback) => {
      if (!/^[a-zA-Z_/\-\d]+$/.test(value)) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      project: this.$route.query.projectId ? { id: this.$route.query.projectId } : this.$store.state.home.project,
      active: 1,
      isPut: false,
      rules: {
        appName: [
          { validator: checkApplicationName, required: true, message: '支持格式：英文字母、数字、“-”、“/”、“_”', trigger: ['change', 'blur'] },
          { max: 100, message: '最多支持100个字符', trigger: ['change', 'blur'] }
        ],
        language: [
          { required: true, message: '请选择语言', trigger: 'change' }
        ],
        middleware: [
          { required: true, message: '请选择中间件', trigger: 'change' }
        ],
        path: [
          { required: true, message: '请输入中间件安装绝对路径', trigger: 'change' }
        ]
      },
      installForm: {
        language: '',
        appName: '',
        middleware: '',
        path: ''
      },
      languageOptions: [],
      middlewareOptions: [],
      installData: {
        installKey: '',
        linux32: '',
        linux64: '',
        win32: '',
        win64: ''
      }
    }
  },
  methods: {
    // 初始化开发语言
    initLanguage () {
      languageSelect({
        loading: false
      }).then(response => {
        this.languageOptions = []
        const data = response.data
        data.forEach(item => {
          this.languageOptions.push(item)
        })
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 初始化开发语言
    initMiddleware () {
      getMiddleware({
        loading: false
      }).then(response => {
        this.middlewareOptions = []
        const data = response.data
        data.forEach(item => {
          this.middlewareOptions.push(item)
        })
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 初始化安装命令
    install () {
      if (this.project === null || (this.project && this.project.id === -1)) {
        this.$message.error('请选择具体项目！')
        return 0
      }
      nodeInstall({
        appName: this.installForm.appName,
        projectId: this.project.id,
        language: this.installForm.language,
        middleware: this.installForm.middleware,
        path: this.installForm.path
      }).then(response => {
        this.active = 2
        const data = response.data
        Object.assign(this.installData, data)
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    copyText (txt) {
      const oInput = document.createElement('textarea')
      oInput.value = txt
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('Copy')
      oInput.className = 'oInput'
      oInput.style.display = 'none'
      this.$message.success('已复制到剪切板！')
    },

    // 下一步
    next () {
      this.$refs.installForm.validate((valid) => {
        if (valid) {
          this.install()
        } else {
          return false
        }
      })
    },

    //  返回
    back () {
      this.$router.push({
        path: '/scan/node'
      })
    }
  },
  mounted () {
    this.initLanguage()
    this.initMiddleware()
  }
}
</script>
<style scoped lang="scss">
.custom-step {
  margin-top: 50px;
}

:deep(.el-step__description) {
  padding-top: 15px;
  font-size: 14px;
}

:deep(.el-step__head.is-process) {
  cursor: pointer;

  .el-step__icon.is-text:hover {
    border-color: #8B5CF6;

    .el-step__icon-inner {
      color: #8B5CF6;
    }
  }
}

.step-content {
  padding: 30px 15px;

  .el-form {
    margin-top: 30px;
  }

  &.step-content-1 {
    .el-form {
      width: 470px;
    }
  }

  .el-alert {
    ul {
      list-style: none;
      padding-left: 30px;

      li {
        list-style: none;
      }
    }

    .el-button {
      position: absolute;
      right: 40px;
      top: 12px;
    }
  }
}
</style>
