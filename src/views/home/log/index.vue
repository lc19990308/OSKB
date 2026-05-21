<template>
  <el-main class="main">
    <el-row :gutter="20" class="wrap">
      <el-col :span="12">
        <div class="common-bg">
          <div class="common-header" style="z-index: 99999">
            使用频率TOP5
            <el-tooltip content="统计近一周内的数据" placement="top" effect="dark"><i class="iconwenhao iconfont"></i></el-tooltip>
          </div>
          <bar-chart :chart-data="userTop5" :loading="userTop5Loading"></bar-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="common-bg">
          <div class="common-header" style="z-index: 99999">
            操作行为TOP5
            <el-tooltip content="统计近一周内的数据" placement="top" effect="dark"><i class="iconwenhao iconfont"></i></el-tooltip>
          </div>
          <bar-chart :chart-data="opTop5" :loading="opTop5Loading"></bar-chart>
        </div>
      </el-col>
    </el-row>
    <div class="view-content">
      <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'">
        <div class="clearfix">
          <el-button size="medium" type="primary" @click="exportFile" v-if="authorityFilter(2102)">
            导出日志
          </el-button>
          <el-button size="medium" type="primary" @click="del" :disabled="multipleSelection.length === 0" v-if="authorityFilter(2103)">
            删除
          </el-button>
          <search-area placeholder="请输入用户名称" @search="search" v-model="username" right-float></search-area>
        </div>
      </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        @filter-change="searchFilter"
        @sort-change="searchSort"
        @selection-change="handleSelectionChange">
        <template slot="bar">
          <el-button size="medium" type="primary" @click="exportFile()" v-if="authorityFilter(2102)">
            导出日志
          </el-button>
          <el-button size="medium" type="primary" @click="del()" v-if="authorityFilter(2103)">
            删除
          </el-button>
        </template>
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            label="操作时间"
            min-width="15%"
            sortable="custom"
            :sort-orders="['descending','ascending',null]"
            prop="op_date"
            show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.opDate }}</template>
        </el-table-column>
        <el-table-column
            label="操作用户"
            min-width="10%"
            prop="username"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="姓名"
          min-width="10%"
          prop="realName"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.realName  || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          label="所属项目"
          min-width="10%"
          prop="projectName"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.projectName  || '--'}}
          </template>
        </el-table-column>
        <el-table-column
            label="IP地址"
            min-width="15%"
            prop="ip"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            label="操作类型"
            min-width="12%"
            prop="opName"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            label="操作细节"
            min-width="20%"
            prop="opDetail"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            label="操作结果"
            min-width="10%"
            show-overflow-tooltip>
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.result"
              :filters="resultOptions"
              @change="search"
              title="操作结果"
            />
          </template>
          <template slot-scope="scope">
            {{ scope.row.result === 1 ? '成功' : scope.row.result === 0 ? '失败' : '-' }}
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
  </el-main>
</template>
<script>
import BarChart from '@/components/chart/BarChart.vue'
import { logList, exportFile, delLog, opTop5, userTop5 } from '@/api/home/log'
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky/index.vue'
import { downloadBlobFile } from '@/utils'

export default {
  name: 'log',
  components: {
    BarChart,
    Sticky
  },
  data () {
    return {
      username: '',
      currentPage: 1,
      loading: false,
      userTop5Loading: false,
      opTop5Loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      multipleSelection: [],
      opTop5: [],
      userTop5: [],
      resultOptions: [
        {
          text: '成功',
          value: 1
        },
        {
          text: '失败',
          value: 0
        }
      ],
      searchData: {},
      color: [
        '#EF4444',
        '#F59E0B',
        '#8B5CF6',
        '#6366F1',
        '#10B981'
      ]
    }
  },
  methods: {
    // 导出文件
    exportFile () {
      if (this.multipleSelection.length > 0) {
        this.exportFileSubmit()
      } else {
        this.$confirm('导出所有日志数据，是否继续导出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.exportFileSubmit()
        }).catch(() => {})
      }
    },

    // 导出文件
    async exportFileSubmit () {
      try {
        const ids = this.multipleSelection.map(x => x.id)
        const response = await exportFile({
          ids,
          type: 7
        })
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    // 删除
    del () {
      this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(x => x.id)
        delLog({
          idList: ids
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initList()
        }).catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除'
        })
      })
    },

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
      if (!this.authorityFilter(2100)) {
        return 0
      }
      this.loading = true
      logList({
        ...this.searchData,
        username: this.username,
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
      }).catch(error => {
        this.tableData = []
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 获取top5操作统计图
    initOpTop5 () {
      if (!this.authorityFilter(2100)) {
        return 0
      }
      this.opTop5 = []
      this.opTop5Loading = true
      opTop5({
        loading: false
      }).then(response => {
        this.opTop5Loading = false
        this.opTop5 = []
        const data = response.data
        data.forEach((item, index) => {
          this.opTop5.push({
            name: item.opName,
            value: item.count,
            color: this.color[index % this.color.length]
          })
        })
      }).catch(error => {
        this.opTop5Loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 获取操作用户top5统计图
    initUserTop5 () {
      if (!this.authorityFilter(2100)) {
        return 0
      }
      this.userTop5 = []
      this.userTop5Loading = true
      userTop5({
        loading: false
      }).then(response => {
        this.userTop5Loading = false
        this.userTop5 = []
        const data = response.data
        data.forEach((item, index) => {
          this.userTop5.push({
            name: item.username,
            value: item.count,
            color: this.color[index % this.color.length]
          })
        })
      }).catch(error => {
        this.userTop5Loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  },
  mounted () {
    this.search()
    this.initOpTop5()
    this.initUserTop5()
  }
}
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;
  margin-top: 20px;

  .el-row > .left {
    margin-right: 30px;
    margin-bottom: 15px;

    .input-label {
      line-height: 34px;
    }

    .input,
    .el-select {
      width: 240px;
      margin-right: 20px;
    }
  }
}
</style>
