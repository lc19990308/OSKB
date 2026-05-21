<template>
  <div>
    <div class="search-wrap clearfix">
      <search-area placeholder="请输入文件名称" @search="search" v-model="searchText" right-float></search-area>
    </div>
    <el-table
      class="w-full"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      row-key="dicVulId"
      @filter-change="searchFilter"
      @sort-change="searchSort">

      <el-table-column
        label="文件名称"
        min-width="25%"
        prop="fileName"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="文件路径"
        min-width="25%"
        prop="filePath"
        show-overflow-tooltip>
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
import { sourceMatchFileList } from '@/api/home/scan/app'
import { PAGE_CONF } from '@/utils/conf'

export default {
  name: 'FileInfo',
  components: {},
  data () {
    return {
      tableData: [],
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      searchData: {},
      searchText: ''
    }
  },
  props: ['id', 'taskId', 'projectId'],
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
      sourceMatchFileList({
        sourceProjectInfoId: this.id,
        taskId: this.taskId,
        projectId: this.projectId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        fileName: this.searchText,
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
    }
  },
  watch: {
    id () {
      this.search()
    }
  },
  mounted () {
    if (this.id !== undefined && this.taskId !== undefined) {
      this.search()
    }
  }
}
</script>
<style scoped lang="scss">
.table-footer-wrapper {
  margin-bottom: 60px;
}
</style>
