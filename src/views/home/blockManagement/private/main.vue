<template>
  <div class="view-content">
    <ProxyNodeLIstPopup ref="proxyNode"></ProxyNodeLIstPopup>
    <card-tab :tabs="tabs" v-model="activeTab" @tab-click="handleClick">
      <span slot="right">
        <el-button size="medium" plain class="plain-button" @click="downloadProxy">下载代理</el-button>
        <el-button v-if="authorityFilter(3521)"  size="medium" plain class="plain-button" @click="$refs.proxyNode.open()">查看代理节点</el-button>
      </span>
    </card-tab>
    <router-view />
  </div>
</template>
<script>
import ProxyNodeLIstPopup from '@/views/home/blockManagement/private/rule/ProxyNodeLIstPopup'
import CardTab from '@/components/public/CardTab'
import { downloadBlobFile } from '@/utils/downloadFile'
import { downloadDetectPlugin } from '@/api/home/blockManagement/private'
export default {
  name: 'blockManagement-private-main',
  components: {
    CardTab,
    ProxyNodeLIstPopup
  },
  data () {
    return {
      activeTab: this.$route.fullPath,
      tabs: [
        {
          label: '阻断记录',
          name: '/block-management/main/private/main/list',
          powerId: 3530
        },
        {
          label: '阻断规则',
          name: '/block-management/main/private/main/rule',
          powerId: [3540, 3541]
        },
        {
          label: '仓库配置',
          name: '/block-management/main/private/main/conf',
          powerId: 3550
        }
      ]
    }
  },
  methods: {
    async downloadProxy () {
      try {
        const result = await downloadDetectPlugin()
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    handleClick (row) {
      this.$router.push({
        path: row.name,
        query: this.$route.query
      })
    }
  },
  created () {
    const firstTab = this.tabs.find(tab => this.authorityFilter(tab.powerId))
    if (firstTab) {
      const activeTab = this.tabs.find(tab => this.$route.fullPath.includes(tab.name))
      if (!this.authorityFilter(activeTab.powerId)) {
        this.handleClick(activeTab)
      }
    } else {
      this.$router.push('/notPermissions')
    }
  },
  watch: {
    $route (route) {
      this.activeTab = route.fullPath
    }
  }
}
</script>
