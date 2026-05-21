<template>
  <div>
    <el-tabs class="tabs customize-tabs_no_border" v-model="activeTab" @tab-click="tabsHandleClick">
      <el-tab-pane v-for="(val,key) in tabs" :key="key" :label="val.label" :name="val.name"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component-scan v-if="activeTab === 'component'"></component-scan>
    </keep-alive>
  </div>
</template>

<script>

import componentScan from './compose/component'
export default {
  name: 'index',
  components: { componentScan },
  data () {
    return {
      activeTab: 'component',
      tabs: [
        {
          label: '组件风险扫描',
          name: 'component'
        }
      ]
    }
  },
  methods: {
    tabsHandleClick () {}
  }
}
</script>
