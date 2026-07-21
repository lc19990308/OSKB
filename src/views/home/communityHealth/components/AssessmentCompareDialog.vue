<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="评估结果对比"
    width="1180px"
    top="6vh"
    append-to-body
    :close-on-click-modal="false"
    @closed="reset"
  >
    <div v-loading="loading" class="assessment-compare">
      <el-table v-if="comparison.columns && comparison.columns.length" :data="comparison.rows" class="w-full" max-height="500" empty-text="暂无可对比的数据">
        <el-table-column label="评估项" min-width="190" fixed show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.rowName || row.rowCode }}</template>
        </el-table-column>
        <el-table-column label="类型" width="80" fixed>
          <template slot-scope="{ row }">{{ row.rowType === 'DIMENSION' ? '维度' : '指标' }}</template>
        </el-table-column>
        <el-table-column v-for="column in comparison.columns" :key="column.assessmentId" min-width="180">
          <template slot="header">
            <div class="comparison-column-header">
              <span>{{ column.repositoryName || `评估 #${column.assessmentId}` }}</span>
              <small>得分 {{ formatScore(column.score) }} · {{ column.level || '未分级' }} · 证据 {{ formatPercent(column.evidenceCoverage) }}</small>
            </div>
          </template>
          <template slot-scope="{ row }">
            <div class="comparison-cell">
              <span>得分：{{ formatScore(getCell(row, column.assessmentId).score) }}</span>
              <span>证据：{{ evidenceLabel(getCell(row, column.assessmentId).evidenceStatus) }}</span>
              <span>可信度：{{ formatPercent(getCell(row, column.assessmentId).confidence) }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <empty v-else-if="!loading"></empty>
    </div>
    <span slot="footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { compareAssessments } from '@/api/home/communityHealth'

export default {
  name: 'AssessmentCompareDialog',
  data () {
    return {
      dialogVisible: false,
      loading: false,
      comparison: { columns: [], rows: [] }
    }
  },
  methods: {
    async open (assessments) {
      const assessmentIds = assessments.map(item => item.assessmentId).filter(Boolean)
      if (assessmentIds.length < 2 || assessmentIds.length > 10) return
      this.dialogVisible = true
      this.loading = true
      try {
        const response = await compareAssessments(assessmentIds)
        this.comparison = response.data || { columns: [], rows: [] }
      } catch (error) {
        this.$message.error(error.message || '获取评估对比结果失败')
      } finally {
        this.loading = false
      }
    },
    reset () {
      this.loading = false
      this.comparison = { columns: [], rows: [] }
    },
    getCell (row, assessmentId) {
      return (row.cells || []).find(item => item.assessmentId === assessmentId) || {}
    },
    formatScore (value) {
      return value === null || value === undefined ? '—' : Number(value).toFixed(1)
    },
    formatPercent (value) {
      if (value === null || value === undefined) return '—'
      const number = Number(value)
      return `${Math.max(0, Math.min(100, Math.round(number <= 1 ? number * 100 : number)))}%`
    },
    evidenceLabel (status) {
      return ({ COMPLETE: '完整', PARTIAL: '部分完整', MISSING: '缺失' })[status] || '—'
    }
  }
}
</script>

<style scoped lang="scss">
.assessment-compare {
  min-height: 260px;
}

.comparison-column-header,
.comparison-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comparison-column-header small,
.comparison-cell {
  color: #75818c;
  font-size: 12px;
  font-weight: 400;
}
</style>
