<template>
  <div>
    <dialog-create-report ref="createReport"></dialog-create-report>
    <desc-drawer ref="descDrawer"></desc-drawer>
    <top-banner @buttonClick="$refs.descDrawer.open(taskInfo)">
      <template slot="left">
        <i class="iconfont iconmoshi text-regular"></i>
        <span>{{ taskInfo.realPackageName || '应用信息' }}</span>
        <span class="m-r-5">@{{ get(taskInfo, 'version') }}</span>
        <level-tag class="m-b-5" :level="taskInfo.securityLevel"></level-tag>
      </template>
      <template slot="right">
        <level-group class="m-r-20" plain :value="[
            get(taskInfo, 'vulNum.serious', 0),
            get(taskInfo, 'vulNum.high', 0),
            get(taskInfo, 'vulNum.medium', 0),
            get(taskInfo, 'vulNum.low', 0)
             ]">
        </level-group>
      </template>
    </top-banner>
    <StickyTab v-model="activeTab" @tab-click="handleClick" :tabs="tabs"></StickyTab>
    <router-view/>
  </div>
</template>
<script>
import { exportTask, taskCount } from '@/api/home/scan/app'
import { taskDetail } from '@/api/home/scan/sbom'
import DescDrawer from './DescDrawer'
import DialogCreateReport from '@/views/home/report/report/dialogCreateReport.vue'
import { downloadBlobFile } from '@/utils'
import TopBanner from '@/views/home/scan/public/TopBanner'
import StickyTab from '@/views/home/public/StickyTab'

export default {
  name: 'ScanAppComponentDetails',
  components: {
    StickyTab,
    TopBanner,
    DescDrawer,
    DialogCreateReport
  },
  provide () {
    const self = this
    return {
      updateDetails () {
        self.initComponentVul()
        self.initTaskDetail()
      }
    }
  },
  data () {
    return {
      info: {},
      taskId: this.$route.query.task,
      appPackageId: this.$route.query.app,
      checkType: this.$route.query.checkType,
      taskInfo: {},
      tabs: [
        {
          label: '组件(0个)',
          name: '/scan/sbom/details/component'
        },
        {
          label: '漏洞(0个)',
          name: '/scan/sbom/details/vul'
        },
        {
          label: '许可证(0个)',
          name: '/scan/sbom/details/license'
        }
        // {
        //   label: '代码溯源分析',
        //   name: '/scan/app/component/details/source',
        //   hide: this.$route.query.source !== '1'
        // },
        // {
        //   label: '依赖关系图',
        //   name: '/scan/sbom/details/depend'
        // }
      ]
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
    }
  },
  methods: {
    handleClick (row) {
      this.$router.push({
        path: row.name,
        query: this.$route.query
      })
    },

    // 生成报告
    createReport () {
      this.$refs.createReport.dialogVisible = true
      this.$refs.createReport.row = {
        projectId: this.taskInfo.projectId,
        appPackageId: this.appPackageId
      }
    },

    // 导出文件
    async exportFile (type) {
      try {
        const response = await exportTask({
          packageTaskIdList: this.taskId,
          projectId: this.taskInfo.projectId,
          type: type
        })
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    // 初始化组件数和漏洞数
    initComponentVul () {
      taskCount({
        id: this.taskId,
        loading: false
      }).then(response => {
        this.tabs[0].label = `组件(${response.data.componentCount || 0}个)`
        this.tabs[1].label = `漏洞(${response.data.vulCount || 0}个)`
        this.tabs[2].label = `许可证(${response.data.licenseCount || 0}个)`
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 初始化任务详情
    initTaskDetail () {
      taskDetail({
        id: this.taskId,
        loading: false
      }).then(response => {
        this.taskInfo = response.data
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  mounted () {
    if (this.taskId !== undefined) {
      this.initComponentVul()
      this.initTaskDetail()
    }
  }
}
</script>
<style scoped lang="scss">

.oss-headline {
  background-color: #fff;
  padding: 13px;
  box-shadow: 0 0 14px -8px rgba(124, 58, 237, 50%);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 18px;

  .iconfont {
    font-size: 21px;
    margin-right: 5px;
    vertical-align: middle;
    font-weight: normal;
  }

  .oss-halo-button {
    box-shadow: 0 1px 8px 0 #8B5CF633;
    border: 3px solid #8B5CF67f;
    width: 46px;
    height: 46px;
    font-size: 12px;
    color: #8B5CF6;
    display: flex;
    box-sizing: border-box;
    border-radius: 50%;
    line-height: 14px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease-in;

    //&:hover {
    //  transform: scale(1.1);
    //}

    &::before {
      content: "";
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid #8B5CF67f;
      box-shadow: 0 0 5px #8B5CF67f;
      position: absolute;
      top: -1px;
      left: -1px;
      animation: pulse 2s linear infinite;
    }
  }
}

@keyframes pulse {
  10% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.6);
    opacity: 0;
  }

  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.view-content {
  .el-tabs {
    margin-top: 20px;
    padding-bottom: 5px;
    background: #fff;
  }

  .info-section {
    .el-col {
      margin-top: 0;
      margin-bottom: 10px;
      line-height: 34px;
      color: #666;

      .title {
        width: 120px;
        float: left;
        vertical-align: middle;
      }

      .content {
        margin-left: 120px;
        vertical-align: middle;
      }
    }
  }
}
</style>
