<template>
  <el-main class="main">
    <div class="view-content">
      <assessment-create-dialog ref="createDialog" @created="handleCreated"></assessment-create-dialog>
      <assessment-detail-dialog ref="detailDialog" @updated="loadAssessments"></assessment-detail-dialog>
      <assessment-compare-dialog ref="compareDialog"></assessment-compare-dialog>

      <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'">
        <div class="clearfix">
          <el-button size="medium" type="primary" @click="$refs.createDialog.open()">发起评估</el-button>
          <el-button size="medium" type="primary" :disabled="!canCompare" @click="openCompare">对比评估<span v-if="selectedAssessments.length">（{{ selectedAssessments.length }}）</span></el-button>
          <el-button size="medium" @click="refreshAll">刷新</el-button>
          <el-button size="medium" @click="resetFilters">重置</el-button>
          <el-tooltip :content="readiness && readiness.message ? readiness.message : readinessText" placement="top">
            <span class="service-status right" :class="readinessClass"><i :class="readinessIcon"></i>{{ readinessText }}</span>
          </el-tooltip>
          <el-date-picker
            v-model="dateRange"
            class="right community-date-filter"
            type="datetimerange"
            value-format="yyyy-MM-ddTHH:mm:ss"
            range-separator="至"
            start-placeholder="创建时间开始"
            end-placeholder="创建时间结束"
            @change="search"
          ></el-date-picker>
          <el-select v-model="query.status" class="right community-status-filter" clearable placeholder="全部状态" @change="search">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </sticky>

      <el-table
        ref="assessmentTable"
        v-loading="loading"
        :data="assessments"
        row-key="assessmentId"
        class="w-full"
        tooltip-effect="dark"
        empty-text="暂无评估记录，请先选择仓库发起评估。"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" reserve-selection width="55" :selectable="isComparable"></el-table-column>
        <el-table-column label="仓库名称" min-width="210" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ getRepositoryName(row) }}</template>
        </el-table-column>
        <el-table-column label="语言" min-width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.repository && row.repository.language ? row.repository.language : '—' }}</template>
        </el-table-column>
        <el-table-column prop="modelVersion" label="评分模型" min-width="130" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.modelVersion || '—' }}</template>
        </el-table-column>
        <el-table-column label="评估状态" min-width="110" show-overflow-tooltip>
          <template slot-scope="{ row }"><el-tag size="mini" :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="综合得分" min-width="95" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ formatScore(row.score) }}</template>
        </el-table-column>
        <el-table-column label="成熟度等级" min-width="110" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.level || '—' }}</template>
        </el-table-column>
        <el-table-column label="证据覆盖率" min-width="120" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ formatPercent(row.evidenceCoverage) }}</template>
        </el-table-column>
        <el-table-column label="执行时间" min-width="170" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ formatDate(row.finishedAt || row.startedAt || row.queuedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <icon-button tooltip-content="详情" class="iconxiangqing" @click="openDetail(row)"></icon-button>
            <icon-button v-if="canRetry(row.status)" tooltip-content="重新评估" el-icon="el-icon-refresh" @click="retry(row)"></icon-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer-wrapper clearfix">
        <pagination
          :current-page.sync="query.pageNum"
          :page-size.sync="query.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          class="right"
          @size-change="search"
          @current-change="loadAssessments"
        ></pagination>
      </div>
    </div>
  </el-main>
</template>

<script>
import AssessmentCreateDialog from './components/AssessmentCreateDialog.vue'
import AssessmentDetailDialog from './components/AssessmentDetailDialog.vue'
import AssessmentCompareDialog from './components/AssessmentCompareDialog.vue'
import Sticky from '@/components/public/Sticky/index.vue'
import { getAssessments, getReadiness, retryAssessment } from '@/api/home/communityHealth'

const inProgressStatuses = ['PENDING', 'RUNNING', 'RETRY_WAIT']

export default {
  name: 'CommunityHealth',
  components: {
    AssessmentCreateDialog,
    AssessmentDetailDialog,
    AssessmentCompareDialog,
    Sticky
  },
  data () {
    return {
      loading: false,
      readiness: null,
      assessments: [],
      selectedAssessmentMap: {},
      syncingSelection: false,
      total: 0,
      dateRange: [],
      pollingTimer: null,
      query: {
        status: '',
        pageNum: 1,
        pageSize: 10
      },
      statusOptions: [
        { label: '待执行', value: 'PENDING' },
        { label: '评估中', value: 'RUNNING' },
        { label: '等待重试', value: 'RETRY_WAIT' },
        { label: '已完成', value: 'SUCCEEDED' },
        { label: '部分完成', value: 'PARTIAL' },
        { label: '评估失败', value: 'FAILED' }
      ]
    }
  },
  computed: {
    readinessClass () {
      if (!this.readiness) return 'is-unknown'
      return this.readiness.degraded ? 'is-degraded' : this.isReady ? 'is-ready' : 'is-error'
    },
    readinessIcon () {
      return this.isReady ? 'el-icon-circle-check' : this.readiness && this.readiness.degraded ? 'el-icon-warning-outline' : 'el-icon-circle-close'
    },
    readinessText () {
      if (!this.readiness) return '服务状态未获取'
      if (this.isReady) return '评估服务就绪'
      return this.readiness.degraded ? '评估服务降级' : '评估服务不可用'
    },
    isReady () {
      return this.readiness && this.readiness.repositorySourceReady && this.readiness.publishedModelReady && this.readiness.executorReady && !this.readiness.degraded
    },
    selectedAssessments () {
      return Object.values(this.selectedAssessmentMap)
    },
    canCompare () {
      return this.selectedAssessments.length >= 2 && this.selectedAssessments.length <= 10
    }
  },
  created () {
    this.refreshAll()
  },
  beforeDestroy () {
    this.clearPolling()
  },
  methods: {
    async refreshAll () {
      await Promise.all([this.loadAssessments(), this.loadReadiness()])
    },
    async loadReadiness () {
      try {
        const response = await getReadiness()
        this.readiness = response.data || null
      } catch (error) {
        this.readiness = null
      }
    },
    async loadAssessments () {
      this.loading = true
      try {
        const response = await getAssessments({
          ...this.query,
          createdFrom: this.dateRange && this.dateRange[0],
          createdTo: this.dateRange && this.dateRange[1]
        })
        const page = response.data || {}
        this.assessments = page.records || []
        this.total = page.total || 0
        this.$nextTick(() => this.syncSelection())
        this.setPolling()
      } catch (error) {
        this.$message.error(error.message || '获取评估列表失败')
      } finally {
        this.loading = false
      }
    },
    search () {
      this.query.pageNum = 1
      this.loadAssessments()
    },
    resetFilters () {
      this.query.status = ''
      this.dateRange = []
      this.search()
    },
    handleCreated () {
      this.query.pageNum = 1
      this.refreshAll()
    },
    openDetail (row) {
      this.$refs.detailDialog.open(row.assessmentId)
    },
    openCompare () {
      if (!this.canCompare) return
      this.$refs.compareDialog.open(this.selectedAssessments)
    },
    isComparable (row) {
      if (!['SUCCEEDED', 'PARTIAL'].includes(row.status)) return false
      return Boolean(this.selectedAssessmentMap[row.assessmentId]) || this.selectedAssessments.length < 10
    },
    handleSelectionChange (rows) {
      if (this.syncingSelection) return
      const currentIds = this.assessments.map(item => item.assessmentId)
      currentIds.forEach(id => this.$delete(this.selectedAssessmentMap, id))
      rows.filter(row => ['SUCCEEDED', 'PARTIAL'].includes(row.status)).forEach(row => {
        if (this.selectedAssessments.length < 10) this.$set(this.selectedAssessmentMap, row.assessmentId, row)
      })
    },
    syncSelection () {
      const table = this.$refs.assessmentTable
      if (!table) return
      const selectedIds = new Set(this.selectedAssessments.map(item => item.assessmentId))
      this.syncingSelection = true
      table.clearSelection()
      this.assessments.forEach(row => {
        if (selectedIds.has(row.assessmentId)) table.toggleRowSelection(row, true)
      })
      this.syncingSelection = false
    },
    async retry (row) {
      try {
        await retryAssessment(row.assessmentId)
        this.$message.success('已提交重试任务')
        this.loadAssessments()
      } catch (error) {
        this.$message.error(error.message || '重试评估失败')
      }
    },
    setPolling () {
      this.clearPolling()
      if (this.assessments.some(item => inProgressStatuses.includes(item.status))) {
        this.pollingTimer = setTimeout(() => this.loadAssessments(), 5000)
      }
    },
    clearPolling () {
      if (this.pollingTimer) clearTimeout(this.pollingTimer)
      this.pollingTimer = null
    },
    getRepositoryName (row) {
      return row.repository ? row.repository.fullName || row.repository.name : '未知仓库'
    },
    formatScore (value) {
      return value === null || value === undefined ? '—' : Number(value).toFixed(1)
    },
    formatPercent (value) {
      if (value === null || value === undefined) return '—'
      const number = Number(value)
      return `${Math.max(0, Math.min(100, Math.round(number <= 1 ? number * 100 : number)))}%`
    },
    formatDate (value) {
      return value ? String(value).replace('T', ' ').slice(0, 19) : '—'
    },
    canRetry (status) {
      return ['FAILED', 'RETRY_WAIT'].includes(status)
    },
    statusType (status) {
      return ({ SUCCEEDED: 'success', PARTIAL: 'warning', FAILED: 'danger', RUNNING: 'primary', PENDING: 'info', RETRY_WAIT: 'warning' })[status] || 'info'
    },
    statusLabel (status) {
      return ({ PENDING: '待执行', RUNNING: '评估中', RETRY_WAIT: '等待重试', SUCCEEDED: '已完成', PARTIAL: '部分完成', FAILED: '评估失败' })[status] || status || '未知'
    }
  }
}
</script>

<style scoped lang="scss">
.community-status-filter {
  width: 130px;
  margin-right: 10px;
}

.community-date-filter {
  width: 320px;
  margin-right: 10px;
}

.service-status {
  margin-top: 8px;
  color: #7a8e9b;
  font-size: 13px;

  i {
    margin-right: 5px;
  }

  &.is-ready {
    color: #3a8f68;
  }

  &.is-degraded {
    color: #bd8a28;
  }

  &.is-error {
    color: #c75a5a;
  }
}
</style>
