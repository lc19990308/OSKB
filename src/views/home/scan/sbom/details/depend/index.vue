<template>
  <div class="oss-border" style="padding: 20px;">
    <el-checkbox
      v-model="hasVul"
      :true-label="1"
      :false-label="0"
      :disabled="componentTotal > 100"
      @change="init"
    >仅展示有漏洞的依赖</el-checkbox>
    <depend-tree-chart :chart-data="data" :loading="loading"></depend-tree-chart>
  </div>
</template>
<script>
import DependTreeChart from '@/components/chart/DependTreeChart.vue'
import { dependTreeChart } from '@/api/home/scan/app'

export default {
  name: 'Depend',
  components: {
    DependTreeChart
  },
  data () {
    return {
      componentTotal: 0,
      projectId: this.$route.query.project,
      appPackageId: this.$route.query.appPackage,
      taskId: this.$route.query.task,
      loading: false,
      hasVul: 1,
      data: []
    }
  },
  methods: {
    // 初始化
    init () {
      this.loading = true
      dependTreeChart({
        taskId: this.taskId,
        projectId: this.projectId,
        hasVul: this.hasVul,
        loading: false
      }).then(response => {
        this.loading = false
        const data = response.data
        if (Object.hasOwnProperty.call(data, 'length') && data.length > 0) {
          this.componentTotal = data[0].componentTotal
          this.data = this.processing(data)
        }
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 处理数据
    processing (data) {
      return data.map(item => {
        const labelRich = Object.hasOwnProperty.call(item, 'securityLevel') && item.securityLevel !== null ? item.securityLevel - 1 : 'default'
        const obj = {
          name: item.name,
          label: {
            formatter: `{${labelRich}|{b}}`
          }
        }
        if (Object.hasOwnProperty.call(item, 'sub') && item.sub !== null) {
          obj.children = this.processing(item.sub)
        }
        return obj
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
