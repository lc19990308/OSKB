<template>
  <div class="view-content">
    <div class="query-bar">
      <el-form :inline="true" :model="searchData" size="medium">
        <el-form-item label="文件名称：">
          <el-input
            v-model="searchData.filename"
            clearable
            placeholder="请输入文件名称"
            @clear="search"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item label="检测状态：">
          <el-select v-model="searchData.status" clearable placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜 索</el-button>
          <el-button @click="reset">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      ref="table"
      v-loading="loading"
      tooltip-effect="dark"
      :data="tableData"
    >
      <el-table-column
        label="文件名称"
        prop="filename"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="所属项目"
        prop="projectName"
        min-width="140"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="风险等级"
        min-width="100"
      >
        <template slot-scope="{ row }">
          <level-tag :level="row.securityLevel"></level-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="组件数"
        prop="componentNum"
        min-width="90"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="漏洞" min-width="130">
        <template slot-scope="{ row }">
          {{ vulText(row.vulNum) }}
        </template>
      </el-table-column>
      <el-table-column label="检测状态" min-width="110">
        <template slot-scope="{ row }">
          {{ statusText(row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        prop="uploadDate"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="完成时间"
        prop="finishDate"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="检测时长"
        prop="detectDuration"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>

    <empty v-if="!loading && tableData.length === 0"></empty>
    <pagination
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
      @current-change="initList"
      @size-change="handleSizeChange"
    ></pagination>
  </div>
</template>

<script>
import { binaryAnalysisList } from '@/api/home/scan/binary'

export default {
  name: 'ScanBinaryMain',
  data () {
    return {
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchData: {
        filename: '',
        status: ''
      },
      statusOptions: [
        { value: -1, label: '未检测' },
        { value: 0, label: '排队中' },
        { value: 1, label: '检测中' },
        { value: 2, label: '检测完成' },
        { value: 3, label: '出错结束' }
      ]
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    search () {
      this.currentPage = 1
      this.initList()
    },
    reset () {
      this.searchData = {
        filename: '',
        status: ''
      }
      this.search()
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.currentPage = 1
      this.initList()
    },
    initList () {
      this.loading = true
      const params = {
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      }
      if (params.status === '') {
        delete params.status
      }
      binaryAnalysisList(params)
        .then(response => {
          const data = response.data || {}
          this.tableData = data.records || []
          this.total = data.total || 0
        })
        .catch(error => {
          this.tableData = []
          this.total = 0
          if (typeof error === 'object' && error.message) {
            this.$message.error(error.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    statusText (status) {
      const item = this.statusOptions.find(item => item.value === status)
      return item ? item.label : '-'
    },
    vulText (vulNum = {}) {
      const total = vulNum.total || vulNum.totalCount || 0
      const serious = vulNum.serious || 0
      const high = vulNum.high || 0
      const medium = vulNum.medium || 0
      const low = vulNum.low || 0
      return `${total} (${serious}/${high}/${medium}/${low})`
    }
  }
}
</script>

<style scoped lang="scss">
.view-content {
  font-size: 14px;
  margin-top: 20px;
}

.query-bar {
  margin-bottom: 16px;
}
</style>
