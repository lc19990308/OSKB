<template>
  <div>
    <el-tabs class="tabs customize-tabs_no_border" v-model="fullPath" @tab-click="tabsHandleClick">
      <el-tab-pane v-for="(val,key) in tabs" :key="key" :label="val.label" :name="val.path"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      fullPath: '',
      tabs: [
        {
          label: '快速添加',
          path: '/scan/develop/repository/git/batchAdd/warehouse'
        },
        {
          label: '批量添加(Excel)',
          path: '/scan/develop/repository/git/batchAdd/excel'
        }

      ]
    }
  },
  methods: {
    tabsHandleClick (row) {
      this.$router.push({
        path: row.name
      })
    }
  },
  created () {
    this.fullPath = this.$route.fullPath
  }
}
</script>
