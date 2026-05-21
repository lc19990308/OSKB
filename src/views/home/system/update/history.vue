<template>
  <div class="common-bg">
    <div class="common-header" >
      更新记录
    <search-area placeholder="请输入更新内容" @search="search" v-model="searchCondition" right-float></search-area>
    </div>
    <div class="common-body" style="padding-top: 0;">
      <el-table
        class="w-full"
        :data="tableData"
        v-loading="loading"
        @filter-change="searchFilter">

        <el-table-column
          prop="version"
          label="升级版本号">
        </el-table-column>
         <el-table-column
          prop="oldVersion"
          label="原版本号">
        </el-table-column>
        <el-table-column
          label="更新类型"
          show-overflow-tooltip>
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.type"
              :filters="typeOptions"
              @change="search"
              title="更新类型"
            />
          </template>
          <template slot-scope="scope">
            {{ scope.row.type === 4 ? '漏洞库更新' : scope.row.type === 5 ? '组件库更新' : scope.row.type === 6 ? '许可证库更新' : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="更新内容"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="更新状态">
          <template slot-scope="{ row }">
            <span :class="row.status === 1 ? 'text-primary' : row.status === 2 ? 'text-success' : row.status === 3 ? 'text-danger' : ''">
              {{ row.status === 1 ? '更新中' : row.status === 2 ? '更新成功' : row.status === 3 ? '更新失败' : '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="更新时间">
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
import { PAGE_CONF } from '@/utils/conf'
import { historyList } from '@/api/home/system/update'
export default {
  data () {
    return {
      searchCondition: '',
      tableData: [],
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      searchDate: [],
      searchData: {},
      timeout: null,
      typeOptions: [
        {
          value: 4,
          text: '漏洞库更新'
        },
        {
          value: 5,
          text: '组件库更新'
        },
        {
          value: 6,
          text: '许可证库更新'
        }
      ]
    }
  },
  methods: {
    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 列表搜索
    searchFilter (filers) {
      for (const x in filers) {
        if (Array.isArray(filers[x])) {
          this.searchData[x] = filers[x]
        }
      }
      this.search()
    },

    // 初始化列表
    initList (auto) {
      if (auto !== 'auto') {
        this.loading = true
      }
      historyList({
        ...this.searchData,
        startTime: this.searchDate ? this.searchDate[0] : '',
        endTime: this.searchDate ? this.searchDate[1] : '',
        searchCondition: this.searchCondition,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      }).then(response => {
        this.loading = false
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          this.tableData.push(item)
        })
        this.total = data.total
        if (this.timeout !== null) {
          clearTimeout(this.timeout)
          this.timeout = null
        }
        this.timeout = setTimeout(this.initList, 20000, 'auto')
      }).catch(error => {
        this.tableData = []
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  mounted () {
    this.search()
  },
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}
</script>

<style lang="scss" scoped>
.common-header {
  position: relative;
  overflow: hidden;
  padding-right: 20px;
}

.common-body {
  padding: 75px 20px 30px;
  margin-top: 15px;
  margin-bottom: 20px;
  text-align: center;
  box-sizing: border-box;

  .search-container {
    margin: 10px 0;
  }
}
</style>
