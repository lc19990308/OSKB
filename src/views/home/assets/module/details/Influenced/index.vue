<template>
  <div class="content-wrap">
    <h3 class="headline"><i class="iconfont iconyingxiangfenxi"></i>影响分析</h3>
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="`影响应用 (${get(info, 'affectedApplicationCount', 0)})`" name="app">
        <App v-if="activeTab === 'app'" :dicComponentId="dicComponentId"/>
      </el-tab-pane>
      <el-tab-pane :label="`影响项目 (${get(info, 'affectedProjectCount', 0)})`" name="project">
        <Project v-if="activeTab === 'project'" :dicComponentId="dicComponentId"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import App from './affect/app.vue'
import Project from './affect/project.vue'

export default {
  name: 'Influenced',
  components: {
    App,
    Project
  },
  props: ['dicComponentId'],
  data () {
    return {
      activeTab: 'app'
    }
  },
  inject: ['componentInfo'],
  computed: {
    info () {
      return this.componentInfo()
    }
  }
}
</script>
<style scoped lang="scss">
.content-wrap {
  padding-top: 20px;
}
</style>
