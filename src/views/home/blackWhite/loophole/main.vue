<template>
  <div>
    <el-tabs ref="tabs" class="customize-tabs_no_border" v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane
        v-for="(val,key) in tabs"
        :key="key"
        :label="val.label"
        :name="val.name"
      >
        <span slot="label">
         {{ val.label }}
        </span>
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>
<script>

export default {
  name: 'LoopholeBlackWhiteMain',
  components: {
  },
  data () {
    return {
      activeTab: this.$route.fullPath,
      tabs: [
        {
          label: '漏洞黑名单',
          name: '/black-white/loophole/main/black/list'
        },
        {
          label: '漏洞白名单',
          name: '/black-white/loophole/main/white/list'
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
    this.activeTab = this.$route.fullPath
  },
  watch: {
    '$route' (to) {
      this.activeTab = to.fullPath
    }
  }
}
</script>
