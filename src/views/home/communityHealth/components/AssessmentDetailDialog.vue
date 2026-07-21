<template>
  <el-drawer
    :visible.sync="dialogVisible"
    :title="assessment.repository ? assessment.repository.fullName : '评估详情'"
    size="70%"
    direction="rtl"
    custom-class="community-assessment-drawer"
    :close-on-click-modal="false"
    @closed="clearPolling"
  >
    <el-scrollbar class="drawer-body-scrollbar hide-x">
      <div v-loading="loading" class="assessment-detail">
        <template v-if="assessment.assessmentId">
        <div class="detail-operating clearfix">
          <el-button class="right" size="medium" :loading="refreshing" @click="refresh">刷新</el-button>
          <el-button v-if="canRetry" class="right" size="medium" type="primary" :loading="retrying" @click="retry">重试评估</el-button>
          <el-button v-if="isFinished" class="right" size="medium" type="primary" :loading="recalculating" @click="recalculate">重新评分</el-button>
        </div>

        <el-form :inline="true" size="small" label-width="82px" class="assessment-summary">
          <el-form-item label="评估状态"><el-tag size="mini" :type="statusType(assessment.status)">{{ statusLabel(assessment.status) }}</el-tag></el-form-item>
          <el-form-item label="综合得分">{{ formatScore(assessment.score) }}</el-form-item>
          <el-form-item label="成熟度等级">{{ assessment.level || '—' }}</el-form-item>
          <el-form-item label="证据覆盖率">{{ formatPercent(assessment.evidenceCoverage) }}</el-form-item>
          <el-form-item label="评分可信度">{{ formatPercent(assessment.confidence) }}</el-form-item>
        </el-form>

        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="评分概览" name="overview">
            <el-table :data="assessment.dimensionScores || []" class="w-full" empty-text="暂无维度评分结果">
              <el-table-column prop="dimensionName" label="评估维度" min-width="180" show-overflow-tooltip></el-table-column>
              <el-table-column label="得分" min-width="100"><template slot-scope="{ row }">{{ formatScore(row.score) }}</template></el-table-column>
              <el-table-column label="权重" min-width="100"><template slot-scope="{ row }">{{ row.weight === null || row.weight === undefined ? '—' : `${row.weight}%` }}</template></el-table-column>
            </el-table>
            <el-form :inline="true" size="small" label-width="70px" class="task-summary">
              <el-form-item label="模型版本">{{ assessment.modelVersion || '—' }}</el-form-item>
              <el-form-item label="统计周期">{{ assessment.windowDays || '—' }} 天</el-form-item>
              <el-form-item label="执行次数">{{ assessment.attempt || 0 }}</el-form-item>
              <el-form-item label="完成时间">{{ formatDate(assessment.finishedAt) }}</el-form-item>
            </el-form>
            <el-alert v-if="assessment.errorMessage" type="error" :closable="false" :title="assessment.errorMessage" show-icon></el-alert>
          </el-tab-pane>

          <el-tab-pane label="指标结果" name="metrics">
            <el-table :data="metrics" class="w-full" empty-text="暂无指标结果">
              <el-table-column prop="metricName" label="指标" min-width="150"></el-table-column>
              <el-table-column prop="dimensionCode" label="评估维度" width="155">
                <template slot-scope="{ row }">{{ dimensionLabel(row.dimensionCode) }}</template>
              </el-table-column>
              <el-table-column label="得分" width="90"><template slot-scope="{ row }">{{ formatScore(row.score) }}</template></el-table-column>
              <el-table-column label="加权得分" width="105"><template slot-scope="{ row }">{{ formatScore(row.weightedScore) }}</template></el-table-column>
              <el-table-column label="证据状态" width="110">
                <template slot-scope="{ row }"><el-tag size="mini" :type="evidenceType(row.evidenceStatus)">{{ evidenceLabel(row.evidenceStatus) }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="rationale" label="评分说明" min-width="230" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="105" fixed="right">
                <template slot-scope="{ row }"><el-button type="text" size="small" @click="$refs.manualEvidence.open(assessment.assessmentId, row)">补充证据</el-button></template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="证据明细" name="evidence">
            <el-table :data="evidence" class="w-full" empty-text="暂无证据数据">
              <el-table-column label="来源" width="110">
                <template slot-scope="{ row }"><el-tag size="mini" :type="row.evidenceType === 'MANUAL' ? 'primary' : 'info'">{{ evidenceSourceLabel(row.evidenceType) }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="metricCode" label="关联指标" width="170"></el-table-column>
              <el-table-column label="证据链接" min-width="200" show-overflow-tooltip>
                <template slot-scope="{ row }"><el-link type="primary" :href="row.sourceUrl" target="_blank" :underline="false">{{ row.sourceUrl }}</el-link></template>
              </el-table-column>
              <el-table-column prop="summary" label="证据摘要" min-width="230" show-overflow-tooltip></el-table-column>
              <el-table-column label="观察时间" width="165"><template slot-scope="{ row }">{{ formatDate(row.observedAt) }}</template></el-table-column>
              <el-table-column label="校验" width="80"><template slot-scope="{ row }"><el-tag size="mini" :type="row.verified ? 'success' : 'warning'">{{ row.verified ? '已校验' : '待校验' }}</el-tag></template></el-table-column>
              <el-table-column label="操作" width="75" fixed="right">
                <template slot-scope="{ row }"><el-button v-if="row.evidenceType === 'MANUAL'" type="text" size="small" @click="removeEvidence(row)">删除</el-button></template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="评估历史" name="history">
            <el-table :data="history" class="w-full" empty-text="该仓库暂无历史评估记录">
              <el-table-column label="评估记录" min-width="110"><template slot-scope="{ row }">#{{ row.assessmentId }}</template></el-table-column>
              <el-table-column label="评估状态" min-width="110"><template slot-scope="{ row }"><el-tag size="mini" :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag></template></el-table-column>
              <el-table-column label="综合得分" min-width="95"><template slot-scope="{ row }">{{ formatScore(row.score) }}</template></el-table-column>
              <el-table-column label="成熟度等级" min-width="100"><template slot-scope="{ row }">{{ row.level || '—' }}</template></el-table-column>
              <el-table-column label="证据覆盖率" min-width="110"><template slot-scope="{ row }">{{ formatPercent(row.evidenceCoverage) }}</template></el-table-column>
              <el-table-column label="执行时间" min-width="165"><template slot-scope="{ row }">{{ formatDate(row.finishedAt || row.startedAt || row.queuedAt) }}</template></el-table-column>
              <el-table-column label="操作" width="70" fixed="right">
                <template slot-scope="{ row }"><icon-button v-if="row.assessmentId !== assessment.assessmentId" tooltip-content="详情" class="iconxiangqing" @click="openHistoryAssessment(row)"></icon-button></template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        </template>
      </div>
    </el-scrollbar>
    <manual-evidence-dialog ref="manualEvidence" @saved="refresh"></manual-evidence-dialog>
  </el-drawer>
</template>

<script>
import ManualEvidenceDialog from './ManualEvidenceDialog.vue'
import {
  deleteManualEvidence,
  getAssessment,
  getAssessmentEvidence,
  getAssessmentMetrics,
  getRepositoryAssessmentHistory,
  recalculateAssessment,
  retryAssessment
} from '@/api/home/communityHealth'

const activeStatuses = ['PENDING', 'RUNNING', 'RETRY_WAIT']

export default {
  name: 'AssessmentDetailDialog',
  components: { ManualEvidenceDialog },
  data () {
    return {
      dialogVisible: false,
      loading: false,
      refreshing: false,
      retrying: false,
      recalculating: false,
      assessmentId: null,
      assessment: {},
      metrics: [],
      evidence: [],
      history: [],
      activeTab: 'overview',
      pollTimer: null
    }
  },
  computed: {
    isFinished () {
      return ['SUCCEEDED', 'PARTIAL'].includes(this.assessment.status)
    },
    canRetry () {
      return ['FAILED', 'RETRY_WAIT'].includes(this.assessment.status)
    }
  },
  methods: {
    open (assessmentId) {
      this.assessmentId = assessmentId
      this.activeTab = 'overview'
      this.assessment = {}
      this.metrics = []
      this.evidence = []
      this.history = []
      this.dialogVisible = true
      this.refresh(true)
    },
    async refresh (initial = false) {
      if (!this.assessmentId) return
      if (initial) this.loading = true
      else this.refreshing = true
      try {
        const assessmentResponse = await getAssessment(this.assessmentId)
        this.assessment = assessmentResponse.data || {}
        const repositoryId = this.assessment.repository && this.assessment.repository.repositoryId
        if (repositoryId) {
          const historyResponse = await getRepositoryAssessmentHistory(repositoryId)
          this.history = historyResponse.data || []
        } else {
          this.history = []
        }
        if (this.isFinished) {
          const [metricsResponse, evidenceResponse] = await Promise.all([
            getAssessmentMetrics(this.assessmentId),
            getAssessmentEvidence(this.assessmentId)
          ])
          this.metrics = metricsResponse.data || []
          this.evidence = evidenceResponse.data || []
        }
        this.setPolling()
      } catch (error) {
        this.$message.error(error.message || '获取评估详情失败')
      } finally {
        this.loading = false
        this.refreshing = false
      }
    },
    openHistoryAssessment (item) {
      this.open(item.assessmentId)
    },
    setPolling () {
      this.clearPolling()
      if (activeStatuses.includes(this.assessment.status)) {
        this.pollTimer = setTimeout(() => this.refresh(), 5000)
      }
    },
    clearPolling () {
      if (this.pollTimer) clearTimeout(this.pollTimer)
      this.pollTimer = null
    },
    async retry () {
      this.retrying = true
      try {
        await retryAssessment(this.assessmentId)
        this.$message.success('已提交重试任务')
        await this.refresh()
        this.$emit('updated')
      } catch (error) {
        this.$message.error(error.message || '重试评估失败')
      } finally {
        this.retrying = false
      }
    },
    async recalculate () {
      this.recalculating = true
      try {
        await recalculateAssessment(this.assessmentId)
        this.$message.success('评分结果已重新计算')
        await this.refresh()
        this.$emit('updated')
      } catch (error) {
        this.$message.error(error.message || '重新评分失败')
      } finally {
        this.recalculating = false
      }
    },
    removeEvidence (row) {
      this.$confirm('删除后该人工证据将不再参与评分，是否继续？', '删除人工证据', { type: 'warning' }).then(async () => {
        await deleteManualEvidence(this.assessmentId, row.evidenceId)
        this.$message.success('人工证据已删除')
        await this.refresh()
      }).catch(() => {})
    },
    formatPercent (value) {
      if (value === null || value === undefined) return '—'
      const number = Number(value)
      return `${Math.max(0, Math.min(100, Math.round(number <= 1 ? number * 100 : number)))}%`
    },
    formatScore (value) {
      return value === null || value === undefined ? '—' : `${Number(value).toFixed(1)}`
    },
    formatDate (value) {
      return value ? String(value).replace('T', ' ').slice(0, 19) : '—'
    },
    statusType (status) {
      return ({ SUCCEEDED: 'success', PARTIAL: 'warning', FAILED: 'danger', RUNNING: 'primary', PENDING: 'info', RETRY_WAIT: 'warning' })[status] || 'info'
    },
    statusLabel (status) {
      return ({ PENDING: '待执行', RUNNING: '评估中', RETRY_WAIT: '等待重试', SUCCEEDED: '已完成', PARTIAL: '部分完成', FAILED: '评估失败' })[status] || status || '未知'
    },
    evidenceType (status) {
      return ({ COMPLETE: 'success', PARTIAL: 'warning', MISSING: 'danger' })[status] || 'info'
    },
    evidenceLabel (status) {
      return ({ COMPLETE: '完整', PARTIAL: '部分完整', MISSING: '缺失' })[status] || '未知'
    },
    evidenceSourceLabel (type) {
      return ({ GITHUB_API: 'GitHub 采集', REPOSITORY_INDEX: '知识库索引', MANUAL: '人工补充' })[type] || type || '未知'
    },
    dimensionLabel (code) {
      return ({ PROJECT_VITALITY: '项目活力', COMMUNITY_OPERATION: '社区运营', MAINTENANCE_GOVERNANCE: '维护与治理' })[code] || code || '—'
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.community-assessment-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 18px 22px;
  }

  .el-drawer__body {
    height: calc(100% - 60px);
    overflow: hidden;
  }
}

.drawer-body-scrollbar {
  height: 100%;

  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }
}

.assessment-detail {
  min-height: 100%;
  padding: 0 20px 24px;
}

.detail-operating {
  min-height: 40px;
  margin-bottom: 10px;

  .el-button {
    margin-left: 10px;
  }
}

.assessment-summary,
.task-summary {
  padding: 12px 0 0;
  border-bottom: 1px solid #dcdee0;

  :deep(.el-form-item) {
    margin-right: 28px;
  }
}

.task-summary {
  margin-top: 15px;
}

.detail-tabs {
  margin-top: 15px;
}

@media (max-width: 768px) {
  :deep(.community-assessment-drawer) {
    width: 92% !important;
  }

  .detail-operating .el-button {
    margin-bottom: 8px;
  }
}
</style>
