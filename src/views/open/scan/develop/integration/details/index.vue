<template>
 <layout-open>
   <div class="view-content">
     <div class="headline">
       <svg class="icon" aria-hidden="true">
         <use xlink:href="#iconyasuobao"></use>
       </svg>
       {{ taskInfo.packageName || '应用包信息' }}
       <level-tag :level="taskInfo.securityLevel"></level-tag>
     </div>
     <info-wrap>
       <info-row>
         <info-item label="版本：" :span="8">{{ taskInfo.version || '-' }}</info-item>
         <info-item label="大小：" :span="8">{{ taskInfo.byteSize | byteSize }}</info-item>
         <info-item label="质量门禁：" :span="8">
           {{taskInfo.qualityResult === 0 ? '不通过' : taskInfo.qualityResult === 1 ? '通过' : '-'}}
           <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
             <i class="el-icon-info text-primary cursor-pointer" style="font-size: 16px;" @click="getQualityDetails"></i>
           </el-tooltip>
         </info-item>
       </info-row>
       <info-row>
         <info-item label="审查方式：" :span="8">{{ taskInfo.checkType === 0 ? '快速审查' : '深度审查' }}
         </info-item>
         <info-item label="解析深度：" :span="8">{{ taskInfo.deepLimit > -1 ? taskInfo.deepLimit + '层' : '默认层级' }}
         </info-item>
         <info-item label="数据清洗：" :span="8">
           {{ taskInfo.cleanLevel === 1 ? '快速清洗' : '深度清洗' }}
         </info-item>
       </info-row>
       <info-row>
         <info-item label="检测时长：" :span="8">{{ taskInfo.detectDuration || '-' }}</info-item>
         <info-item label="最近检测：" :span="8">{{ taskInfo.startDate || '-' }}</info-item>
         <info-item label="检测完成：" :span="8">{{ taskInfo.finishDate || '-' }}</info-item>
       </info-row>
       <info-row>
         <info-item label="说明：" :span="24">{{ taskInfo.description || '-' }}</info-item>
       </info-row>
     </info-wrap>
     <StickyContent
       :sticky-top="45"
     >
       <el-tabs ref="tabs" v-model="activeTab" @tab-click="handleClick">
         <el-tab-pane
           v-for="(val,key) in tabs"
           :key="key"
           :label="val.label"
           :name="val.name"
         >
         </el-tab-pane>
       </el-tabs>
     </StickyContent>
     <router-view v-if="isReload"/>
   </div>
 </layout-open>
</template>
<script>
import {
  taskDetail,
  taskCount,
  getJenkinsParams,
  getTaskQualityDetails
} from '@/api/open/scan/develop/integration'
import StickyContent from '@/components/public/StickyContent'
import to from '@/utils/await-to'
import { isObject } from '@/utils'
import LayoutOpen from '@/views/open/layout'
export default {
  name: 'IntegrationDetails',
  components: {
    LayoutOpen,
    StickyContent
  },
  data () {
    return {
      info: {},
      isReload: false,
      taskId: this.$route.query.taskId,
      token: this.$route.query.token,
      sign: this.$route.query.sign,
      appPackageId: '',
      projectId: '',
      taskInfo: {},
      tabs: [
        {
          label: '组件(0个)',
          name: '/jenkins/details/component'
        },
        {
          label: '漏洞(0个)',
          name: '/jenkins/details/vul'
        },
        {
          label: '许可证(0个)',
          name: '/jenkins/details/license'
        }
      ]
    }
  },
  provide () {
    return {
      app: this
    }
  },
  computed: {
    activeTab: {
      get () {
        return this.$route.path
      },
      set () {
        return this.$route.path
      }
    },
    params () {
      return {
        taskId: this.taskId,
        token: this.token,
        appPackageId: this.appPackageId,
        projectId: this.projectId,
        sign: this.sign
      }
    }
  },
  methods: {
    handleClick (row) {
      this.$router.push({
        path: row.name,
        query: this.$route.query
      })
    },
    // 刷新子组件
    reload () {
      this.isReload = false
      this.$nextTick(() => {
        this.isReload = true
      })
    },
    async getQualityDetails () {
      let [error, response] = await to(getTaskQualityDetails(this.taskId, this.token))
      if (isObject(error)) return this.$message.error(error.message)
      response = response.data
      this.$popup({
        title: '质量门禁规则',
        width: '750px',
        showConfirmButton: false,
        cancelButtonText: '关闭',
        content:
          `<div style="padding: 20px 0 0 0; width: 570px;margin: 0 auto">
              <div style="color: #999999; display: flex" class="m-b-15">
                <label style="color: #333333;width: 130px">组件黑白名单规则：</label>
                <span style="flex: 1">当任务检测结果中含有黑名单组件时，本次任务将不允许构建；当任务检测结果中含有白名单组件时，本次任务可以继续构建</span>
               </div>
               ${
            response.blackSwitch === 1 ? `
                       <div style="color: #999999; display: flex" class="m-b-15">
                      <label style="color: #333333;width: 130px">漏洞黑名单规则：</label>
                      <span style="flex: 1">当任务检测结果中含有黑名单漏洞时，本次任务将不允许构建</span>
                     </div>` : ''
          }
               ${response.componentBaseLineSwitch === 1 ? `
                  <div style="color: #999999;display: flex" class="m-b-15">
                    <label style="color: #333333; width: 130px">组件版本基线规则：</label>
                    <span style="flex: 1">当任务检测结果中含有低于版本基线的组件时，本次任务将不允许构建</span>
                  </div>` : ''}
               ${
            response.qualitySwitch === 1 ? `
                <div style="color: #999999;display: flex" class="m-b-15">
                      <label style="color: #333333; width: 130px">自定义门禁阈值：</label>
                      <span style="flex: 1">
                      ${
              response.vulQualitySwitch === 1 ? `
                                         <div style="display: flex" class="m-b-10">
                                  <label>漏洞风险阈值：</label>
                                  <span style="flex: 1;color: #333333">
                                    <span class="text-severity">严重</span><=${response.vulSeriousNum}，
                                    <span class="text-danger">高危</span><=${response.vulHighNum}，
                                    <span class="text-warning">中危</span><=${response.vulMediumNum}，
                                    <span class="text-primary">低危</span><=${response.vulLowNum}
                                  </span>
                               </div>
                        ` : ''
            }
                       ${response.licenseQualitySwitch === 1 ? `
                                   <div style="display: flex">
                          <label>许可证风险阈值：</label>
                          <span style="flex: 1;color: #333333">
                            <span class="text-danger">高风险</span><=${response.licenseHighNum}，
                            <span class="text-warning">中风险</span><=${response.licenseMediumNum}，
                            <span class="text-primary">低风险</span><=${response.licenseLowNum}</span>
                          </span>
                       </div>` : ''}
                      </span>
                     </div>
                ` : ''
          }
          </div>`
      })
    },
    // 初始化组件数和漏洞数
    initComponentVul () {
      taskCount({
        taskId: this.appPackageId,
        loading: false,
        token: this.token
      }).then(response => {
        this.tabs[0].label = `组件(${response.data.componentCount || 0}个)`
        this.tabs[1].label = `漏洞(${response.data.vulCount || 0}个)`
        this.tabs[2].label = `许可证(${response.data.licenseCount || 0}个)`
        this.$refs.tabs.calcPaneInstances(true)
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 初始化任务详情
    initTaskDetail () {
      taskDetail({
        taskId: this.taskId,
        token: this.token,
        loading: false
      }).then(response => {
        this.taskInfo = response.data
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 初始参数
    async initParams () {
      try {
        const res = await getJenkinsParams({
          taskId: this.taskId,
          sign: this.sign
        }, this.token)
        this.appPackageId = res.data.appPackageId
        this.projectId = res.data.projectId
        this.initComponentVul()
        this.initTaskDetail()
        this.reload()
      } catch (error) {
        this.reload()
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      }
    }
  },
  mounted () {
    this.taskId && this.initParams()
  }
}
</script>
<style lang="scss" scoped>
.view-content {
  .el-tabs {
    margin-top: 20px;
    padding-bottom: 5px;
    background: #fff;
  }
}

.content {
  position: relative;

  //width: 100%;
  max-width: 100%;
  flex: 1;
  flex-direction: column;
}
</style>
