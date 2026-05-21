<template>
  <div>
    <el-tabs ref="tabs" class="customize-tabs_no_border" v-model="activeTab" @tab-click="handleClick">
      <template v-for="(val,key) in tabs">
        <el-tab-pane
          v-if="authorityFilter(val.powerId)"
          :key="key"
          :label="val.label"
          :name="val.name"
        >
        <span slot="label">
         {{ val.label }}
        </span>
        </el-tab-pane>
      </template>
    </el-tabs>
    <router-view />
  </div>
</template>
<script>

export default {
  name: 'blockManagement-main',
  components: {
  },
  data () {
    return {
      activeTab: this.$route.fullPath,
      tabs: [
        {
          label: '私有仓库阻断',
          name: '/block-management/main/private/main',
          powerId: 3510
        }
      ]
    }
  },
  methods: {
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
      this.activeTab = get(activeTab, 'name')
      if (!this.authorityFilter(activeTab.powerId)) {
        this.handleClick(activeTab)
      }
    } else {
      this.$router.push('/notPermissions')
    }
  }
}
</script>
