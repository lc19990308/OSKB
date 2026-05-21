<template>
  <div class="view-content">
    <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'">
      <div class="clearfix">
        <search-area placeholder="搜索任务名称" @search="search" v-model="searchText" right-float></search-area>
        <el-date-picker
          class="w-full right m-r-15"
          v-model="searchDate"
          size="medium"
          type="datetimerange"
          range-separator="-"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="search"
        >
        </el-date-picker>
        <el-select placeholder="请选择任务来源" class="right m-r-15" clearable  size="medium" v-model="taskSource">
          <el-option
            v-for="item in taskSourceOptions"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </sticky>
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      @sort-change="searchSort"
      @filter-change="searchFilter"
      :default-sort = "{prop: 'status', order: 'descending'}"
      @selection-change="handleSelectionChange">
      <el-table-column
        prop="taskName"
        min-width="20%"
        label="任务名称"
      >
        <template slot-scope="{row}">
          <i v-if="row.top && row.status === 0" class="iconfont iconliebiaozhidingqietu"></i>
          {{row.taskName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="detectEngineId"
        label="任务来源"
        min-width="15%"
      >
        <template slot-scope="{row}">
          {{matching(taskSourceOptions,row.detectEngineId,'value','text')}}
        </template>
      </el-table-column>
      <el-table-column
        label="所属项目"
        prop="projectName"
        min-width="15%">
      </el-table-column>
      <el-table-column
        prop="create_date"
        label="发起时间"
        min-width="15%"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.startDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="检测状态"
        min-width="10%"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        show-overflow-tooltip>
<!--        <template v-slot:header>
          <oss-table-sort
            prop="status"
            @change="search"
            :sort-field.sync="searchData.sortFieldList"
            :sort-type.sync="searchData.sortTypeList"
          >
            检测状态
          </oss-table-sort>
        </template>-->
        <template slot-scope="{row}">
<!--          {{matching(statusOptions,row.status,'value','label')}}-->
          <oss-dot :type="matching(statusOptions,row.status,'value','type')">
            {{ matching(statusOptions, row.status, 'value', 'label') }}
          </oss-dot>
        </template>
      </el-table-column>
<!--      <el-table-column
        label="创建人"
        prop="versionRule"
        min-width="20%">
      </el-table-column>-->
      <el-table-column
        prop="address"
        label="操作" fixed="right"
        min-width="15"
        v-if="authorityFilter(2204)"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <icon-button tooltip-content="删除" class="icondel" @click="del(row)"></icon-button>
          <icon-button tooltip-content="置顶" v-if="!row.top && row.status !== 9 && row.status !== 1" class="iconzhiding" @click="topping(row)"></icon-button>
          <icon-button tooltip-content="暂停" v-if="row.status === 0" class="iconpause" @click="pauseTask(row)"></icon-button>
          <icon-button tooltip-content="开始" v-if="row.status === 9" class="iconmorenshouqi" @click="startTask(row)"></icon-button>
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
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky/index.vue'
import { deleteTask, getTaskList, pauseTask, startTask, toppingTask } from '@/api/home/system/taskQueue'

export default {
  components: {
    Sticky
  },
  data () {
    return {
      loading: false,
      statusOptions: [{
        label: '排队中',
        type: 'warning',
        value: 0
      }, {
        label: '检测中',
        type: 'success',
        value: 1
      }, {
        label: '暂停',
        type: 'danger',
        value: 9
      }],
      taskSourceOptions: [{
        text: '组件依赖检测',
        value: 1
      }, {
        text: 'SBOM风险扫描',
        value: 14
      }, {
        text: 'IDE开发管理',
        value: 5
      }, {
        text: 'Git代码库管理',
        value: 3
      }, {
        text: 'SVN代码库管理',
        value: 6
      }, {
        text: 'Firefly代码库管理',
        value: 12
      }, {
        text: '集成部署',
        value: 11
      }, {
        text: '二进制成分分析',
        value: 8
      }, {
        text: '私服库安全扫描',
        value: 4
      }, {
        text: '镜像安全扫描',
        value: 15
      }],
      taskSource: '',
      currentPage: 1,
      searchDate: [],
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      project: this.$store.state.home.project || {},
      searchText: '',
      tableData: [],
      multipleSelection: [],
      timeout: null,
      searchData: {
        sortFieldList: ['status'],
        sortTypeList: [1]
      }
    }
  },
  methods: {

    // 更多操作
    ops (event, row) {
      event(row)
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

    // 列表搜索
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

    // 删除
    del (row) {
      this.$confirm('确认删除所选任务吗？\n' +
        '若删除，此任务在供应链场景管理的检测状态将会是出错结束！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask({
          taskId: row.taskId
        }).then(response => {
          this.$message.success('删除成功')
          this.search()
        }).catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /* 置顶任务 */
    topping (row) {
      this.$confirm('确认将所选任务置顶吗？\n' +
        '每个引擎仅能置顶一条任务，且不可取消', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        toppingTask({
          taskId: row.taskId
        }).then(() => {
          this.$message.success('置顶成功')
          this.search()
        }).catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消置顶'
        })
      })
    },

    /* 开始任务 */
    startTask (row) {
      this.$confirm('确认开始所选任务吗？\n' +
        '若开始，此任务在供应链场景管理的检测状态将会是排队中！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        startTask({
          taskId: row.taskId
        }).then(() => {
          this.$message.success('操作成功')
          this.search()
        }).catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消开始'
        })
      })
    },

    /* 暂停任务 */
    pauseTask (row) {
      this.$confirm('确认暂停所选任务吗？\n' +
        '若暂停，此任务在供应链场景管理的检测状态将会是排队中！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pauseTask({
          taskId: row.taskId
        }).then(() => {
          this.$message.success('操作成功')
          this.search()
        }).catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消暂停'
        })
      })
    },

    // 初始化规则列表
    initList (auto) {
      if (auto !== 'auto') {
        this.loading = true
      }
      getTaskList({
        loading: false,
        ...this.searchData,
        startDate: this.searchDate ? this.searchDate[0] : '',
        endDate: this.searchDate ? this.searchDate[1] : '',
        searchCondition: this.searchText,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        detectEngineId: this.taskSource
      }).then(response => {
        this.loading = false
        const data = response.data
        this.tableData = data.records.map(item => {
          return {
            ...item
          }
        })
        this.total = data.total
        if (this.timeout) {
          clearTimeout(this.timeout)
          this.timeout = null
        }
        this.timeout = setTimeout(this.initList, 10000)
      }).catch(error => {
        this.loading = false
        this.tableData = []
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  },
  mounted () {
    this.initList()
  },
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}
</script>

<style scoped lang="scss">
.iconliebiaozhidingqietu {
  font-size: 25px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
