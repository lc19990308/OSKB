<template>
  <div class="container">
    <drag-upload-dialog
      ref="uploadRef"
      :data="{ projectId: projectMixin.id }"
      action="/oss/api-v1/asset/gitRepository/uploadHistory/upload"
      @callback="search"
    ></drag-upload-dialog>
    <el-row>
      <el-alert :closable="false" type="primary" class="header-alert">
        <el-row type="flex" class="alert-content" align="middle">
          <div style="flex: 1;">
            <i class="el-icon-info m-r-5"></i>
            通过上传Excel方式批量添加仓库。请先下载模板，将待检测的仓库按模板格式进行填充，支持Excel批量上传。
          </div>
          <el-button
            size="mini"
            class="custom-alert-btn"
            type="primary"
            @click="downloadTemplate"
          >
            下载模板
          </el-button>
        </el-row>
      </el-alert>
    </el-row>
    <div class="view-content">
      <sticky
        :sticky-top="65"
        :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
      >
        <div class="clearfix">
          <el-button
            size="medium"
            type="primary"
            @click="$refs.uploadRef.useDialog()"
            >上传</el-button
          >
          <el-button
            size="medium"
            type="primary"
            @click="onRemove(multipleSelection)"
            :disabled="!(multipleSelection.length > 0)"
            >删除</el-button
          >
          <search-area
            placeholder="请输入文件名称"
            @search="search"
            v-model="searchText"
            right-float
          ></search-area>
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
        :default-sort = "{prop: 'upload_date', order: 'descending'}"
      >

        <el-table-column type="selection" reserve-selection width="55">
        </el-table-column>
        <el-table-column min-width="16%" label="文件名称" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ row.fileName }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="10%"
          label="仓库数量"
          prop="repositoryNum"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          min-width="10%"
          label="上传人"
          prop="uploadUser"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="上传时间"
          min-width="15%"
          sortable="custom"
          :sort-orders="['descending','ascending',null]"
          prop="upload_date"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            {{ row.uploadDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="10%"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              v-if="[2, 3].includes(scope.row.status)"
              :class="matching(options, scope.row.status, 'value', 'class')"
              >
              {{matching(options, scope.row.status, 'value', 'text')}}
            </span
            >
            <el-tooltip
              v-else
              placement="top-start"
              effect="dark"
              :content="matching(options, scope.row.status, 'value', 'text')"
            >
              <oss-progress :percentage="matching(options, scope.row.status, 'value', 'percentage')"></oss-progress>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <icon-button
              tooltip-content="下载"
              class="iconxiazai"
              :disabled="![2].includes(row.status)"
              @click="downloadResult(row)"
            ></icon-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="删除操作不可恢复, 是否继续？"
              :disabled="[0, 1].includes(row.status)"
              @confirm="onRemove(row)"
              @onConfirm="onRemove(row)"
            >
              <icon-button
                slot="reference"
                tooltip-content="删除"
                class="icondel"
                :disabled="[0, 1].includes(row.status)"
                >删除</icon-button
              >
            </el-popconfirm>
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
import { isArray, downloadBlobFile, isObject } from '@/utils'
import MixinsList from '@/mixins/list.js'
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky'
import dragUploadDialog from '@/views/home/search/batch/dialog/dragUploadDialog'
import {
  downloadBatchCheckTemplate,
  downloadResult,
  deleteBatch,
  uploadHistory
} from '@/api/home/scan/develop/repository/git/batchAdd/excel'
import to from '@/utils/await-to'

export default {
  name: 'excelAdd',
  components: { Sticky, dragUploadDialog },
  mixins: [MixinsList],
  data () {
    return {
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      loading: false,
      searchText: '',
      total: 0,
      tableData: [],
      multipleSelection: [],
      searchData: {
        sortFieldList: ['upload_date'],
        sortTypeList: [1]
      },
      timeout: null,
      options: [
        {
          value: 0,
          text: '等待解析',
          class: 'text-regular',
          percentage: 10
        },
        {
          value: 1,
          text: '解析中',
          class: 'text-primary',
          percentage: 40
        },
        {
          value: 2,
          text: '解析完毕',
          class: 'text-success',
          percentage: 100
        },
        {
          value: 3,
          text: '出错结束',
          class: 'text-danger',
          percentage: 100
        }
      ]
    }
  },
  methods: {
    /**
     * @name 下载结果
     * @returns {Promise<void>}
     */
    async downloadResult (row) {
      try {
        const result = await downloadResult({
          id: row.id,
          projectId: this.projectMixin.id
        })
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
      const [error] = await to(deleteBatch({
        idList: row.map((item) => item.id),
        projectId: this.projectMixin.id
      }))
      this.search()
      if (isObject(error)) {
        this.$message.error(error.message)
      } else {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$refs.multipleTable.clearSelection()
      }
    },

    /**
     * @name 模板下载
     * @returns {Promise<void>}
     */
    async downloadTemplate () {
      try {
        const result = await downloadBatchCheckTemplate()
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
        fileName: this.searchText,
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })

      this.loading = true
      uploadHistory({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        fileName: this.searchText,
        projectId: this.projectMixin.id,
        loading: false,
        ...this.searchData
      })
        .then((response) => {
          this.loading = false
          this.tableData = []
          const data = response.data
          data.records.forEach((item) => {
            this.tableData.push(item)
          })
          this.total = data.total
          this.setTimeout()
        })
        .catch((error) => {
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
