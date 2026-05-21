<template>
  <div>
    <desc-drawer ref="descDrawer"></desc-drawer>
    <top-banner @buttonClick="$refs.descDrawer.open(taskInfo)">
      <template slot="left">
        <i class="iconfont iconmoshi text-regular"></i>
        <span>{{ taskInfo.applicationName || '应用包信息' }}</span>
        <span class="m-r-5">@{{ get(taskInfo, 'version') }}</span>
      </template>
    </top-banner>
    <StickyTab v-model="activeTab" @tab-click="handleClick" :tabs="tabs"></StickyTab>
    <router-view/>
  </div>
</template>
<script>
import DescDrawer from './DescDrawer'
import StickyTab from '@/views/home/public/StickyTab'
import TopBanner from '@/views/home/scan/public/TopBanner'
import { getDetailsByTaskId } from '@/api/home/assets/app/codeV4'

export default {
  name: 'ScanAppCodeDetails',
  components: {
    TopBanner,
    StickyTab,
    DescDrawer
  },
  data () {
    return {
      info: {},
      taskInfo: {},
      tabs: [
        {
          label: '代码溯源分析',
          name: '/scan/app/v4_code/details/codeTraceability'
        },
        {
          label: '统计概览',
          name: '/scan/app/v4_code/details/overview'
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
    async getSourceCheckInfo () {
      const [error, response] = await to(getDetailsByTaskId(this.$route.query.taskId))
      if (error && error.message) return this.$message.error(error)
      this.taskInfo = response.data
    }
  },
  created () {
    this.getSourceCheckInfo()
  }
}
</script>
