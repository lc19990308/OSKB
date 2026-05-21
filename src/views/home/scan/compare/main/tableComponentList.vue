<template>
  <div style="margin-top: 0;">
    <el-table
      class="w-full"
      ref="multipleTable"
      row-key="assetComponentId"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      @filter-change="searchFilter"
      @sort-change="searchSort"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="组件名称"
        min-width="100"
        prop="name"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.name || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="版本号"
        min-width="100"
        prop="version"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.version || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="语言"
        min-width="100"
        :class-name="'cursor-pointer'"
        show-overflow-tooltip
      >
        <template v-slot="{ row }">
          <span>{{row.language || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞风险"
        width="200"
        prop="vul_num"
      >
        <template slot-scope="scope">
          <level-group :value="[
             scope.row.vulNumVO.serious,
             scope.row.vulNumVO.high,
             scope.row.vulNumVO.medium,
             scope.row.vulNumVO.low
             ]" v-if="scope.row.vulNumVO"/>
             <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="许可证风险"
        width="200"
        prop="license_num"
      >
        <template slot-scope="scope">
          <level-group :value="[
             null,
             scope.row.licenseNumVO.highNum,
             scope.row.licenseNumVO.mediumNum,
             scope.row.licenseNumVO.lowNum
             ]" v-if="scope.row.licenseNumVO"/>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发布日期"
        min-width="100"
        prop="time"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.releaseDate || '-' }}
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
import { hasOwn } from '@/utils'
import MixinsList from '@/mixins/list.js'
import { mapState } from 'vuex'
import requestApi from '../utils'

export default {
  name: 'TableComponentList',
  mixins: [MixinsList],
  props: ['previousTaskId', 'behindTaskId', 'type', 'moduleName'],
  data () {
    return {
      project: this.$store.state.home.project,
      statusOptions: [
        {
          value: -2,
          text: '未检测'
        },
        {
          value: -1,
          text: '排队中'
        },
        {
          value: 3,
          text: '检测中'
        },
        {
          value: 4,
          text: '检测完成',
          class: 'text-success'
        },
        {
          value: 5,
          text: '出错结束',
          class: 'text-danger'
        }
      ],
      progressOptions: [
        {
          value: 0,
          text: '等待检测'
        },
        {
          value: 1,
          text: '下载任务'
        },
        {
          value: 2,
          text: '扫描文件'
        },
        {
          value: 3,
          text: '数据清洗'
        },
        {
          value: 4,
          text: '查找漏洞'
        },
        {
          value: 5,
          text: '等待获取'
        },
        {
          value: 6,
          text: '正在入库'
        },
        {
          value: 7,
          text: '完成',
          class: 'text-success'
        },
        {
          value: 8,
          text: '任务失败',
          class: 'text-danger'
        },
        {
          value: 9,
          text: '引擎下载失败',
          class: 'text-danger'
        },
        {
          value: 10,
          text: '文件出错',
          class: 'text-danger'
        },
        {
          value: 11,
          text: 'IAST数据错误',
          class: 'text-danger'
        },
        {
          value: 12,
          text: '未知异常',
          class: 'text-danger'
        }
      ],
      checkTypeOptions: [
        {
          value: 0,
          text: '快速审查'
        },
        {
          value: 1,
          text: '深度审查'
        }
      ],
      levelOptions: [
        {
          value: 1,
          text: '严重'
        },
        {
          value: 2,
          text: '高危'
        },
        {
          value: 3,
          text: '中危'
        },
        {
          value: 4,
          text: '低危'
        },
        {
          value: 5,
          text: '无漏洞'
        }
      ],
      name: '',
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      timeout: null,
      searchData: {
        sortFieldList: [],
        sortTypeList: []
      },
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({
      projectList: state => state.home.projectList
    }),
    defaultSort () {
      return {
        prop:
          this.searchData.sortFieldList.length > 0
            ? this.searchData.sortFieldList[0]
            : '',
        order:
          this.searchData.sortTypeList.length > 0
            ? this.searchData.sortTypeList[0] === 1
              ? 'descending'
              : 'ascending'
            : ''
      }
    }
  },
  methods: {

    // 详情
    detail (row) {
      this.$router.push({
        path: '/scan/container/details',
        query: {
          appPackage: row.containerId,
          task: row.taskId,
          project: row.projectId
        }
      })
    },

    // 更多操作
    ops (event, row) {
      event(row)
    },
    add () {
      this.$refs.dialogAdd.open()
    },

    edit (row) {
      this.$refs.dialogAdd.open(row)
    },
    // 搜索
    search () {
      this.$refs.multipleTable.clearSelection()
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      if (!(this.previousTaskId && this.behindTaskId && this.type)) {
        this.tableData = []
        return
      }
      this.loading = true
      let params = {
        projectId: this.project.id,
        type: this.type,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      }
      if (this.moduleName === 'node') {
        params = {
          ...params,
          previousNodeId: this.previousTaskId,
          behindNodeId: this.behindTaskId
        }
      } else {
        params = {
          ...params,
          previousTaskId: this.previousTaskId,
          behindTaskId: this.behindTaskId
        }
      }
      requestApi.getComponentCompare(this.moduleName, params)
        .then(response => {
          this.loading = false
          this.tableData = []
          const data = response.data
          data.records.forEach(item => {
            this.tableData.push(item)
          })
          this.total = data.total
        })
        .catch(error => {
          this.tableData = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
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
      if (hasOwn(filers, 'securityLevels')) {
        this.searchData.securityLevels = filers.securityLevels
      } else {
        for (const x in filers) {
          if (Array.isArray(filers[x])) {
            this.searchData[x] = filers[x][0]
          }
        }
      }
      this.search()
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
  watch: {
    '$store.state.home.project' (n) {
      if (n !== null) {
        this.project = n
        this.search()
        this.$nextTick(() => {
          // 去抖动
          this.$refs.multipleTable.doLayout()
        })
      }
    },
    previousTaskId: {
      handler () {
        this.initList()
      }
    },
    behindTaskId: {
      handler () {
        this.initList()
      }
    },
    type: {
      handler () {
        this.initList()
      }
    }
  },
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  },
  mounted () {
    if (this.$store.state.home.project !== null) {
      this.initList()
    }
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

    .input,
    .el-select {
      width: 240px;
      margin-right: 20px;
    }
  }

  .el-dropdown {
    color: inherit;
  }

  .el-progress {
    margin-left: 0;
  }
}

</style>
