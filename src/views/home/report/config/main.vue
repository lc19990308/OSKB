<template>
  <el-main class="main">
    <el-tabs ref="tabs" class="customize-tabs_no_border" v-model="activeTab" @tab-click="handleClick">
      <template
        v-for="(val,key) in tabs"
      >
        <el-tab-pane
          :key="key"
          :label="val.label"
          :name="val.name"
          v-if="has(val, 'powerId') ? authorityFilter(val.powerId) : true"
        >
        </el-tab-pane>
      </template>
    </el-tabs>
    <router-view />
  </el-main>
</template>
<script>
import { has } from 'lodash-es'
export default {
  components: {
  },
  data () {
    return {
      activeTab: this.$route.fullPath,
      tabs: [
        {
          label: '报告模板',
          name: '/report-config/template',
          powerId: 3700
        },
        {
          label: '报告样式',
          name: '/report-config/style',
          powerId: 3731
        }
      ]
    }
  },
  methods: {
    has,
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
      if (this.authorityFilter(firstTab.powerId)) {
        this.handleClick(firstTab)
      }
    } else {
      this.$router.push('/notPermissions')
    }
  },
  watch: {
    '$route' (to) {
      this.activeTab = to.fullPath
    }
  }
}
</script>
