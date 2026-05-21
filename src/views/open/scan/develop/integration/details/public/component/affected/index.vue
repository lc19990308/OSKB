<template>
  <div class="content-wrap">
    <h3 class="headline"><i class="iconfont iconyingxiangfenxi"></i>影响分析</h3>
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="`受影响应用包 (${affectedCount.app})`" name="app">
        <App v-if="activeTab === 'app'" :dicComponentId="dicComponentId"/>
      </el-tab-pane>
      <el-tab-pane :label="`受影响节点 (${affectedCount.node})`" name="node">
        <Node v-if="activeTab === 'node'" :dicComponentId="dicComponentId"/>
      </el-tab-pane>
      <el-tab-pane :label="`受影响项目 (${affectedCount.project})`" name="project">
        <Project v-if="activeTab === 'project'" :dicComponentId="dicComponentId"/>
      </el-tab-pane>
      <el-tab-pane :label="`受影响仓库 (${affectedCount.repository})`" name="repository">
        <Repository v-if="activeTab === 'repository'" :dicComponentId="dicComponentId"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { affectedCount } from '@/api/home/public/component/affected'
import App from '@/views/home/public/component/affected/app.vue'
import Node from '@/views/home/public/component/affected/node.vue'
import Project from '@/views/home/public/component/affected/project.vue'
import Repository from '@/views/home/public/component/affected/repository.vue'

export default {
  name: 'Affected',
  components: {
    App,
    Node,
    Project,
    Repository,
  },
  props: ['dicComponentId'],
  data () {
    return {
      activeTab: 'app',
      affectedCount: {
        app: 0,
        node: 0,
        project: 0,
        repository: 0
      }
    }
  },
  methods: {
    // 获取组件受影响的资产统计数据
    getAffectedCount () {
      affectedCount({
        dicComponentId: this.dicComponentId,
        loading: false
      }).then(response => {
        const data = response.data
        this.$set(this.affectedCount, 'project', data.affectedProjectNum || 0)
        this.$set(this.affectedCount, 'app', data.affectedAppPackageNum || 0)
        this.$set(this.affectedCount, 'node', data.affectedNodeNum || 0)
        this.$set(this.affectedCount, 'repository', data.affectedRepositoryNum || 0)
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  watch: {
    dicComponentId (newVal) {
      if (newVal) {
        this.getAffectedCount()
      } else {
        this.affectedCount = {
          app: 0,
          node: 0,
          project: 0,
          repository: 0
        }
      }
    }
  },
  mounted () {
    if (this.dicComponentId) {
      this.getAffectedCount()
    }
  }
}
</script>
<style scoped lang="scss">
.content-wrap{
  padding: 20px 0;
}
</style>
