<template>
  <el-main class="main">
    <tabs :active="activeTab" :tabs="tabs" @callback="tabChange"></tabs>
    <router-view />
  </el-main>
</template>
<script>
import Tabs from '@/components/public/Tabs/ModifyRiskLevelComponent.vue'
export default {
  name: 'vul',
  components: {
    Tabs
  },
  data () {
    return {
      activeTab: '/help/agency',
      tabs: [
        {
          label: '证书配置',
          name: '/help/ccie'
        },
        {
          label: '代理配置',
          name: '/help/agency'
        },

        {
          label: '检测配置',
          name: '/help/scan'
        },
        {
          label: '忘记密码',
          name: '/help/password'
        },
        {
          label: '系统升级',
          name: '/help/upgrade'
        }
      ]
    }
  },
  methods: {
    tabChange (active, tab, event) {
      this.$router.push(active)
    }
  },
  beforeMount () {
    this.activeTab = this.$route.path
  },
  mounted () {}
}
</script>
