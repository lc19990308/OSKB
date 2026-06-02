<template>
  <div class="common-bg">
    <div class="common-header">
      <svg class="common-header-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8"/><path d="M10 21V3l4-1v19"/><path d="M10 8h4"/><path d="M10 12h4"/><circle cx="12" cy="4" r="2" fill="currentColor" stroke="none"/></svg>
      漏洞TOP10
    </div>

    <el-dropdown
      trigger="click"
    >
      <span class="el-dropdown-link">
        <i class="el-icon-setting"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in selectOptions"
          :value="item.value"
          @click.native="checked = item.value"
          :class="checked === item.value ? 'active' : ''"
          :key="item.value"
        >{{ item.label }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <stacked-row-bar-chart
      :height="400"
      :type="checked"
      :chart-data="{
              rich: rich,
              legend: ['影响组件','影响项目'],
              data: chartData,
            }"
      :loading="loading"
      :percentage="'1:0.644'"
    ></stacked-row-bar-chart>
  </div>
</template>
<script>
import StackedRowBarChart from './StackedRowBarChart.vue'
import { vulBar } from '@/api/home/overview'

export default {
  name: 'VulTop',
  components: {
    StackedRowBarChart
  },
  props: ['project'],
  data () {
    return {
      checked: 4,
      selectOptions: [
        {
          label: '利用难度',
          value: 1
        },
        {
          label: '最近发布',
          value: 2
        },
        {
          label: '漏洞等级',
          value: 3
        },
        {
          label: '综合维度',
          value: 4
        }
      ],
      rich: {
        1: {
          name: '严重',
          width: 34,
          height: 16,
          lineHeight: 16,
          borderRadius: 3,
          backgroundColor: '#8B1A1A'
        },
        2: {
          name: '高危',
          width: 34,
          height: 16,
          lineHeight: 16,
          borderRadius: 3,
          backgroundColor: '#D9534F'
        },
        3: {
          name: '中危',
          width: 34,
          height: 16,
          lineHeight: 16,
          borderRadius: 3,
          backgroundColor: '#D4932A'
        },
        4: {
          name: '低危',
          width: 34,
          height: 16,
          lineHeight: 16,
          borderRadius: 3,
          backgroundColor: '#1a78cf'
        }
      },
      loading: false,
      chartData: []
    }
  },
  methods: {
    // 初始化风险漏洞柱状图top10
    init () {
      this.loading = true
      vulBar({
        loading: false,
        projectId: this.project.id
      }).then(response => {
        this.loading = false
        const data = response.data
        this.chartData = []
        data.forEach((item, index) => {
          this.chartData.push({
            level: item.securityLevel,
            value: [item.affectedComponentNum, item.affectedProjectNum],
            name: `{index|${index + 1}}{custom${item.securityLevel}|${this.rich[item.securityLevel] ? this.rich[item.securityLevel].name : ''}} {title|${item.vulName}}`
          })
        })
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  watch: {
    'project' (n) {
      if (n) {
        this.init()
      }
    }
  },
  mounted () {
    if (this.project) {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dropdown {
  position: absolute;
  right: 0;
  z-index: 9;
  margin-top: 13px;
  margin-right: 20px;
  .el-dropdown-link {
    font-size: 20px;
  }
}
.active {
  background-color: #e9f3fc;
  color: #4ba0ea;
}
</style>
