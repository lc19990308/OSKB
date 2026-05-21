<template>
  <div>
    <DescDrawer ref="info"></DescDrawer>
    <top-banner @buttonClick="$refs.info.open(taskInfo)">
      <template slot="left">
        <i class="iconfont iconmoshi text-regular m-r-15"></i>
        <span class="m-r-15">{{ taskInfo.packageName || '应用包信息' }}</span>
        <level-tag :level="taskInfo.securityLevel"></level-tag>
      </template>
    </top-banner>
    <StickyTab v-model="activeTab" @tab-click="handleClick" :tabs="tabs"></StickyTab>
    <router-view/>
  </div>
</template>
<script>
import { taskDetail, taskCount } from '@/api/home/scan/integration/sourceCode'
import DescDrawer from './DescDrawer'
import TopBanner from '@/views/home/scan/public/TopBanner'
import StickyTab from '@/views/home/public/StickyTab'

export default {
  name: 'IntegrationDetails',
  components: {
    StickyTab,
    TopBanner,
    DescDrawer
  },
  data () {
    return {
      info: {},
      taskId: this.$route.query.task,
      appPackageId: this.$route.query.app,
      project: this.$store.state.home.project,
      taskInfo: {},
      tabs: [
        {
          label: '组件(0个)',
          name: '/scan/integration/sourceCode/details/component'
        },
        {
          label: '漏洞(0个)',
          name: '/scan/integration/sourceCode/details/vul'
        },
        {
          label: '许可证(0个)',
          name: '/scan/integration/sourceCode/details/license'
        }
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

    // 初始化组件数和漏洞数
    initComponentVul () {
      taskCount({
        id: this.appPackageId,
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
    },
    //  返回
    back () {
      this.$router.push({
        name: 'ScanDevelopIntegrationList',
        params: {
          back: 1
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
