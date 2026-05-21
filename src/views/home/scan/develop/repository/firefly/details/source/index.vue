<template>
  <div class="info-section oss-border" style="padding: 20px;">
    <detail-drawer ref="detailDrawer"></detail-drawer>
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      @filter-change="searchFilter"
      @sort-change="searchSort">

      <el-table-column
        label="项目名称"
        prop="fullName"
        min-width="20%"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="仓库地址"
        prop="gitUrl"
        min-width="20%"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="项目许可证"
        prop="license"
        min-width="20%"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="匹配文件数"
        prop="file_num"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        min-width="20%"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.fileNum }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作" fixed="right"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <icon-button tooltip-content="详情" class="iconxiangqing" @click="detail(scope.row)"></icon-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer-wrapper clearfix">
      <pagination
        small
        :background="false"
        @size-change="initList"
        @current-change="initList"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :layout="'total, prev, pager, next, jumper'"
        :total="total"
        class="right"
        :prev-text="''"
        :next-text="''"
      >
      </pagination>
    </div>
  </div>
</template>
<script>

import { PAGE_CONF } from '@/utils/conf'
import DetailDrawer from './DetailDrawer/index.vue'
import { svnRepositoryPackageSourceList } from '@/api/home/scan/develop/repository/firefly'
export default {
  name: 'SourceList',
  components: {
    DetailDrawer
  },
  data () {
    return {
      projectId: this.$route.query.project,
      taskId: this.$route.query.task,
      tableData: [],
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      searchData: {},
      searchText: ''
    }
  },
  methods: {
    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = undefined
        this.searchData.sortTypeList = undefined
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
    },

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      this.loading = true
      this.tableData = []
      svnRepositoryPackageSourceList({
        taskId: this.taskId,
        projectId: this.projectId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        ...this.searchData,
        loading: false
      }).then(response => {
        this.loading = false
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          this.tableData.push(item)
        })
        this.total = data.total
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 详情
    detail (row) {
      this.$refs.detailDrawer.id = row.sourceProjectInfoId
      this.$refs.detailDrawer.drawer = true
    }
  },
  mounted () {
    if (this.taskId !== undefined) {
      this.initList()
    }
  }
}
</script>
