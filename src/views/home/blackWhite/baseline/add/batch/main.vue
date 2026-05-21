<template>
  <div class="container">
    <drag-upload-dialog
      action="/oss/api-v1/data/componentBaseline/add/upload/excel"
      ref="uploadRef"
      @callback="search"
    ></drag-upload-dialog>
    <div id="pl"></div>
    <el-row>
      <el-alert :closable="false" type="primary" class="header-alert">
        <el-row type="flex" class="alert-content" align="middle">
          <div style="flex: 1;">
            <i class="el-icon-info m-r-5"></i
            >通过上传Excel方式批量将组件添加至基线列表中。请先下载模板，将待添加的组件信息按模板格式进行填充，支持Excel批量上传。
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
    <sticky
      :sticky-top="65"
      :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
    >
      <div class="clearfix">
        <el-button
          size="medium"
          type="primary"
          v-if="authorityFilter(3102)"
          :disabled="multipleSelection.length > 0"
          @click="$refs.uploadRef.useDialog()"
          >上传</el-button
        >
        <el-button
          size="medium"
          type="primary"
          v-if="authorityFilter(3103)"
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
      height="calc(100vh - 415px)"
      @filter-change="searchFilter"
      @sort-change="searchSort"
      @selection-change="handleSelectionChange"
      :default-sort = "{prop: 'upload_date', order: 'descending'}"
    >

      <el-table-column type="selection" reserve-selection width="55">
      </el-table-column>
      <el-table-column label="文件名称" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ get(row, 'filename', '-') }}
        </template>
      </el-table-column>
      <el-table-column label="上传人" prop="principal" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="上传时间"
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
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :class="matching(statusOptions, row.status, 'value', 'class')">
            {{ matching(statusOptions, row.status, 'value', 'text')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <icon-button tooltip-content="查看结果" class="iconxiazai" :disabled="!([2].includes(row.status))" @click="downloadResult(row)"></icon-button>
          <icon-button
            v-if="authorityFilter(3103)"
            tooltip-content="删除"
            class="icondel"
            @click="onRemove(row)"
            >删除</icon-button
          >
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
</template>

<script>
import { downloadBlobFile, isArray, isObject, awaitTo } from '@/utils'
import MixinsList from '@/mixins/list.js'
// import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky'
import dragUploadDialog from '@/views/home/search/batch/dialog/dragUploadDialog'
import { mapState } from 'vuex'
import {
  componentBaselineDel,
  componentBaselineDownloadTemplate,
  downloadResult,
  getAListOfUploadRecords
} from '@/api/home/blackwhite/baseline'

export default {
  name: 'componentScan',
  components: { Sticky, dragUploadDialog },
  mixins: [MixinsList],
  data () {
    return {
      currentPage: 1,
      pageSize: 20,
      loading: false,
      searchText: '',
      total: 0,
      tableData: [],
      multipleSelection: [],
      searchData: {
        sortFieldList: ['upload_date'],
        sortTypeList: [1]
      },
      statusOptions: [
        {
          value: 0,
          text: '等待解析',
          class: 'text-primary',
          progress: 10
        },
        {
          value: 1,
          text: '解析中',
          class: 'text-primary',
          progress: 70
        },
        {
          value: 2,
          text: '解析成功',
          class: 'text-success',
          progress: 100
        },
        {
          value: 3,
          text: '解析失败',
          class: 'text-danger',
          progress: 100
        }
      ],
      timeout: null
    }
  },
  computed: {
    ...mapState({
      projectList: state =>
        state.home.projectList.map(item => ({ text: item.name, ...item })),
      project: state => state.home.project
    })
  },
  methods: {
    /**
     * @name 下载结果
     * @returns {Promise<void>}
     */
    async downloadResult (row) {
      try {
        const result = await downloadResult(row.id)
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
      this.$popup({
        width: '550px',
        content: '<p style="padding: 15px">确定要删除该条记录吗？对应文件也会被删除?</p>',
        beforeClose: async (a, cd) => {
          if (a === 'confirm') {
            const [error] = await awaitTo(componentBaselineDel({ idList: row.map(item => item.id) }))
            cd()
            if (isObject(error)) return this.$message.error(error.message)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.search()
            this.$refs.multipleTable.clearSelection()
          } else {
            cd()
          }
        }
      })
    },

    /**
     * @name 模板下载
     * @returns {Promise<void>}
     */
    async downloadTemplate () {
      try {
        const result = await componentBaselineDownloadTemplate()
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
        searchCondition: this.searchText,
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })

      this.loading = true
      getAListOfUploadRecords({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        searchCondition: this.searchText,
        loading: false,
        projectId: this.project.id,
        ...this.searchData
      })
        .then(response => {
          this.loading = false
          this.tableData = []
          const data = response.data
          data.records.forEach(item => {
            this.tableData.push(item)
          })
          this.total = data.total
          this.setTimeout()
          this.$nextTick(() => {
            this.$refs.multipleTable.getHostInstance().bodyWrapper.scrollTop = 0
          })
        })
        .catch(error => {
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
  max-width: 1086px;
  margin: 0 auto;
  position: relative;
  padding: 0 20px;
  box-sizing: border-box;

  .header-alert {
    position: relative;
    margin-bottom: 32px;
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
