<template>
  <div class="container">
    <drag-upload-dialog ref="uploadRef" action="/oss/api-v1/searcher/component/batchSearch/upload" @callback="search"></drag-upload-dialog>
    <div id="pl"></div>
    <el-row>
      <el-alert :closable="false" type="primary" class="header-alert">
        <el-row type="flex" class="alert-content" align="middle">
          <div style="flex: 1;">
            1.组件风险扫描功能方便您将组件列表以Excel表格形式上传，快捷查询并导出组件风险信息；<br>
            2.请先下载模板，模板内有四个字段：组件名称、所属语言、版本号、发布厂商。这几个字段可以唯一确定您的组件，请将您要扫描的组件信息按模板格式进行填充；<br>
            3.点击操作栏的“上传”按钮，上传待扫描的文件，支持Excel批量上传。
          </div>
          <el-button size="mini" class="custom-alert-btn" type="primary" @click="downloadTemplate">
            下载模板
          </el-button>
        </el-row>
      </el-alert>
    </el-row>
    <div class="view-content">
      <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'">
        <div class="clearfix">
          <el-button size="medium" type="primary" :disabled="multipleSelection.length > 0" @click="$refs.uploadRef.useDialog()">上传</el-button>
          <el-button size="medium" type="primary" :disabled="multipleSelection.length <= 0" @click="downloadResult(multipleSelection)">下载</el-button>
          <el-button size="medium" type="primary" @click="onRemove(multipleSelection)" :disabled="!(multipleSelection.length > 0)">删除</el-button>
          <search-area placeholder="请输入文件名称" @search="search" v-model="searchText" right-float></search-area>
        </div>
      </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        row-key="id"
        @filter-change="searchFilter"
        @sort-change="searchSort"
        @selection-change="handleSelectionChange"
      >

        <el-table-column
          type="selection"
          reserve-selection
          width="55">
        </el-table-column>
        <el-table-column
          min-width="16%"
          label="文件名称"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{ row.uploadFileName }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="10%"
          label="上传组件数"
          prop="uploadComponentNum"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          min-width="10%"
          label="实际扫描数"
          prop="resultComponentNum"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          min-width="10%"
          label="上传人"
          prop="username"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="上传时间"
          min-width="15%"
          sortable="custom"
          :sort-orders="['descending','ascending',null]"
          prop="create_date"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.createDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="扫描完成时间"
          min-width="15%"
          sortable="custom"
          :sort-orders="['descending','ascending',null]"
          prop="finish_date"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.finishDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="扫描状态"
          min-width="10%"
          show-overflow-tooltip>
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.status"
              :filters="STATUS"
              @change="search"
              title="扫描状态"
            />
          </template>
          <template slot-scope="scope">
            <span v-if="[2,3].includes(scope.row.status)" :class="getStatus(scope.row.status).class">{{getStatus(scope.row.status).text}}</span>
            <el-tooltip v-else placement="top-start" effect="dark" :content="getStatus(scope.row.status).text">
              <oss-progress
                :percentage="getStatus(scope.row.status).percentage"
              ></oss-progress>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" fixed="right"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            <icon-button tooltip-content="下载" class="iconxiazai" :disabled="!([2].includes(row.status))" @click="downloadResult(row)"></icon-button>
            <icon-button tooltip-content="删除" class="icondel" :disabled="[0,1].includes(row.status)" @click="onRemove(row)">删除</icon-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer-wrapper clearfix">
        <pagination
          @size-change="initList"
          @current-change="initList"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :total="total"
          class="right"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { batchDownloadResult, batchDownloadTemplate, historyDeleteBatch, riskScanHistoryList } from '@/api/home/search'
import { downloadBlobFile, isArray } from '@/utils'
import MixinsList from '@/mixins/list.js'
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky'
import dragUploadDialog from '@/views/home/search/batch/dialog/dragUploadDialog'
import { STATUS, getStatus } from '@/views/home/search/batch/config'

export default {
  name: 'componentScan',
  components: { Sticky, dragUploadDialog },
  mixins: [MixinsList],
  data () {
    return {
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      STATUS,
      loading: false,
      searchText: '',
      total: 0,
      tableData: [],
      multipleSelection: [],
      searchData: {
        sortFieldList: [],
        sortTypeList: []
      },
      timeout: null
    }
  },
  methods: {
    getStatus,
    /**
     * @name 下载结果
     * @returns {Promise<void>}
     */
    async downloadResult (row) {
      const multipleSelection = isArray(row) ? row : [row]
      if (multipleSelection.every(item => item.status !== 2)) {
        return this.$message({
          message: '文件正在扫描中，请选择扫描完成的文件进行下载！'
        })
      }
      try {
        const result = await batchDownloadResult({ idList: multipleSelection.map(item => item.id) })
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    /**
     * @name 删除
     * @param row {Object | Array}
     * @returns {Promise<void>}
     */
    async onRemove (row) {
      row = isArray(row) ? row : [row]
      if (row.every(item => item.status === 0)) {
        return this.$message({
          message: '文件正在扫描中,无法删除。请重新选择！'
        })
      }
      this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await historyDeleteBatch({ idList: row.map(item => item.id) })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.search()
          this.$refs.multipleTable.clearSelection()
        } catch (error) {
          this.$message.error(error.message)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /**
     * @name 模板下载
     * @returns {Promise<void>}
     */
    async downloadTemplate () {
      try {
        const result = await batchDownloadTemplate()
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    /**
     * @name 搜索
     */
    search () {
      this.currentPage = 1
      this.$refs.multipleTable.clearSelection()
      this.initList()
    },

    initList () {
      /**
       * 保存搜索条件
       * **/
      this.saveSearchRecord({
        uploadFileName: this.searchText,
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })

      this.loading = true
      riskScanHistoryList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        uploadFileName: this.searchText,
        loading: false,
        ...this.searchData
      }).then(response => {
        this.loading = false
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          this.tableData.push(item)
        })
        this.total = data.total
        this.setTimeout()
      }).catch(error => {
        this.tableData = []
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    /**
     * @name 循环调用列表
     * @param { void }
     */
    setTimeout () {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.timeout = setTimeout(this.initList, 10000)
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = []
        this.searchData.sortTypeList = []
      }
      this.search()
    },

    searchFilter (filers) {
      for (const x in filers) {
        if (Array.isArray(filers[x])) {
          this.searchData[x] = filers[x][0]
        }
      }
      this.search()
    }
  },
  mounted () {
    this.search()
  },
  destroyed () {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  margin: 0 auto;
  position: relative;

  .header-alert {
    position: relative;
    margin-bottom: 20px;
    padding-left: 12px !important;
    padding-right: 12px !important;

    :deep(.el-alert__content) {
      width: 100% !important;
      display: block !important;
      padding: 0;

      .el-alert__description {
        margin: 0;
      }
    }

    .custom-alert-btn {
      width: 70px;
      height: 28px;
    }
  }
}
</style>
