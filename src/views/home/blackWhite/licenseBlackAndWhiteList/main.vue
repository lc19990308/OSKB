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
  name: 'BlackWhiteMain',
  components: {
  },
  data () {
    return {
      activeTab: this.$route.fullPath,
      tabs: [
        {
          label: '许可证黑名单',
          name: '/black-white/license/main/black/list'
        },
        {
          label: '许可证白名单',
          name: '/black-white/license/main/white/list'
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
