<template>
  <el-dialog
    title="发起社区健康评估"
    :visible.sync="dialogVisible"
    width="980px"
    :close-on-click-modal="false"
    append-to-body
    @open="loadRepositories"
    @closed="resetDialog"
  >
    <div class="create-form">
      <el-form :inline="true" size="small" class="m-b-15">
        <el-form-item label="统计周期">
          <el-input-number v-model="form.windowDays" :min="7" :max="365" controls-position="right"></el-input-number>
          <span class="m-l-5">天</span>
        </el-form-item>
        <el-form-item label="重新采集">
          <el-switch v-model="form.forceRefresh" active-text="跳过缓存"></el-switch>
        </el-form-item>
        <el-form-item label="已选仓库">{{ selectedRepositories.length }} / 20</el-form-item>
      </el-form>

      <div class="clearfix m-b-15">
        <el-select v-model="query.provider" class="right provider-filter" clearable placeholder="仓库来源" size="medium" @change="search">
          <el-option v-for="item in providers" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <search-area v-model="query.keyword" placeholder="请输入仓库名称或关键字" right-float @search="search"></search-area>
      </div>

      <el-table
        ref="repositoryTable"
        v-loading="loading"
        :data="repositories"
        row-key="repositoryId"
        class="w-full"
        tooltip-effect="dark"
        max-height="360"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" reserve-selection width="55" :selectable="isSelectable"></el-table-column>
        <el-table-column label="仓库名称" min-width="230" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.fullName || row.name }}</template>
        </el-table-column>
        <el-table-column prop="url" label="仓库地址" min-width="220" show-overflow-tooltip></el-table-column>
        <el-table-column prop="provider" label="来源" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="language" label="语言" min-width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.language || '—' }}</template>
        </el-table-column>
        <el-table-column label="Star / Fork" min-width="120">
          <template slot-scope="{ row }">{{ row.stars || 0 }} / {{ row.forks || 0 }}</template>
        </el-table-column>
        <el-table-column label="评估条件" min-width="110">
          <template slot-scope="{ row }"><el-tag :type="row.assessable ? 'success' : 'info'" size="mini">{{ row.assessable ? '可评估' : '暂不可评估' }}</el-tag></template>
        </el-table-column>
      </el-table>

      <div class="table-footer-wrapper clearfix">
        <pagination
          :current-page.sync="query.pageNum"
          :page-size.sync="query.pageSize"
          :total="total"
          class="right"
          @current-change="loadRepositories"
          @size-change="search"
        ></pagination>
      </div>
    </div>

    <span slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="selectedRepositories.length === 0" @click="submit">发起评估</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createAssessment, createBatchAssessment, getRepositories } from '@/api/home/communityHealth'

export default {
  name: 'AssessmentCreateDialog',
  data () {
    return {
      dialogVisible: false,
      loading: false,
      submitting: false,
      repositories: [],
      total: 0,
      selectedMap: {},
      syncingSelection: false,
      form: {
        windowDays: 90,
        forceRefresh: false
      },
      query: {
        keyword: '',
        provider: '',
        assessable: true,
        pageNum: 1,
        pageSize: 10
      },
      providers: [
        { label: 'GitHub', value: 'GITHUB' },
        { label: 'GitLab', value: 'GITLAB' },
        { label: 'Gitee', value: 'GITEE' }
      ]
    }
  },
  computed: {
    selectedRepositories () {
      return Object.values(this.selectedMap)
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
    },
    async loadRepositories () {
      this.loading = true
      try {
        const response = await getRepositories(this.query)
        const page = response.data || {}
        this.repositories = page.records || []
        this.total = page.total || 0
        this.$nextTick(() => this.syncSelection())
      } catch (error) {
        this.$message.error(error.message || '获取可评估仓库失败')
      } finally {
        this.loading = false
      }
    },
    search () {
      this.query.pageNum = 1
      this.loadRepositories()
    },
    isSelectable (row) {
      return (row.assessable && this.selectedRepositories.length < 20) || Object.prototype.hasOwnProperty.call(this.selectedMap, row.repositoryId)
    },
    handleSelectionChange (rows) {
      if (this.syncingSelection) return
      const currentIds = this.repositories.map(item => item.repositoryId)
      currentIds.forEach(id => this.$delete(this.selectedMap, id))
      rows.forEach(row => {
        if (this.selectedRepositories.length < 20) this.$set(this.selectedMap, row.repositoryId, row)
      })
    },
    syncSelection () {
      const table = this.$refs.repositoryTable
      if (!table) return
      const selectedIds = new Set(this.selectedRepositories.map(item => item.repositoryId))
      this.syncingSelection = true
      table.clearSelection()
      this.repositories.forEach(row => {
        if (selectedIds.has(row.repositoryId)) table.toggleRowSelection(row, true)
      })
      this.syncingSelection = false
    },
    async submit () {
      const repositoryIds = this.selectedRepositories.map(item => item.repositoryId)
      const payload = {
        windowDays: this.form.windowDays,
        forceRefresh: this.form.forceRefresh
      }

      this.submitting = true
      try {
        if (repositoryIds.length === 1) {
          await createAssessment({ ...payload, repositoryId: repositoryIds[0] })
        } else {
          await createBatchAssessment({ ...payload, repositoryIds })
        }
        this.$message.success('评估任务已受理')
        this.dialogVisible = false
        this.$emit('created')
      } catch (error) {
        this.$message.error(error.message || '发起评估失败')
      } finally {
        this.submitting = false
      }
    },
    resetDialog () {
      this.selectedMap = {}
      this.syncingSelection = false
      this.form.windowDays = 90
      this.form.forceRefresh = false
      this.query.keyword = ''
      this.query.provider = ''
      this.query.pageNum = 1
    }
  }
}
</script>

<style scoped lang="scss">
.create-form {
  min-height: 440px;
}

.provider-filter {
  width: 130px;
  margin-left: 10px;
}
</style>
