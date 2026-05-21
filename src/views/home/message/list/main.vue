<template>
  <div class="view-content">
    <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'">
      <div class="clearfix">
        <el-button size="medium" type="primary" :disabled="multipleSelection.length === 0" @click="changeReadStatus(false)">标为已读</el-button>
        <el-button size="medium" type="primary" :disabled="multipleSelection.length === 0" @click="del(false)">删除</el-button>
        <el-button size="medium" type="primary" class="right" @click="changeAllReadStatus">全部标为已读</el-button>
        <el-button size="medium" type="primary" class="right" @click="delAll">清空记录</el-button>
      </div>
    </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        row-key="id"
        v-loading="loading"
        tooltip-effect="dark"
        @filter-change="searchFilter"
        @sort-change="searchSort"
        @selection-change="handleSelectionChange">
        <template slot="bar">
          <el-button size="medium" type="primary" @click="changeReadStatus(false)">标为已读</el-button>
          <el-button size="medium" type="primary" @click="del(false)">删除</el-button>
          <el-button size="medium" type="primary" @click="changeAllReadStatus()">全部标为已读</el-button>
          <el-button size="medium" type="primary" @click="delAll()">清空记录</el-button>
        </template>
        <el-table-column
          reserve-selection
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          min-width="10%"
          label="通知类型"
          show-overflow-tooltip>
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.type"
              :filters="typeOptions"
              @change="search"
              title="通知类型"
            />
          </template>
          <template slot-scope="scope">
            <span class="level-tag" :class="{primary: scope.row.type === 2, danger:scope.row.type === 1, gray:scope.row.type === 0}">
              {{typeOptions.find(item => item.value === scope.row.type).text}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="通知主题"
          min-width="30%"
          prop="title"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column
          label="通知时间"
          min-width="15%"
          prop="create_date"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.createDate }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="10%"
          label="消息状态"
          show-overflow-tooltip>
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.isRead"
              :filters="stateOptions"
              @change="search"
              title="消息状态"
            />
          </template>
          <template slot-scope="scope">
            <span :class="scope.row.isRead === 1 ? 'text-success' : 'text-danger'">
              {{ scope.row.isRead === 1 ? '已读' : '未读' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" fixed="right"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <icon-button tooltip-content="详情"  class="iconxiangqing" @click="detail(scope.row)"></icon-button>
            <el-dropdown trigger="click" @command="ops($event, scope.row)">
              <icon-button tooltip-content="更多操作" class="icondiandiandianshu-copy"></icon-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="changeReadStatus"
                  :disabled="scope.row.isRead === 1">标记已读</el-dropdown-item>
                <el-dropdown-item
                  :command="del">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
        >
        </pagination>
      </div>
  </div>
</template>
<script>
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky/index.vue'
import { messageList, changeAllReadStatus, changeReadStatus, delMessage, delAll } from '@/api/home/message'
import globalBus from '@/utils/bus'

export default {
  name: 'vul',
  components: {
    Sticky
  },
  data () {
    return {
      pageConf: PAGE_CONF,
      searchData: {},
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      multipleSelection: [],
      typeOptions: [
        {
          value: 1,
          text: '监控告警'
        },
        {
          value: 0,
          text: '系统消息'
        },
        {
          value: 2,
          text: '检测结果'
        }
      ],
      stateOptions: [
        {
          value: 1,
          text: '已读'
        },
        {
          value: 0,
          text: '未读'
        }
      ]
    }
  },
  methods: {
    // 更多操作
    ops (event, row) {
      event(row)
    },

    // 详情
    detail (row) {
      if (row.isRead === 0) {
        changeReadStatus({
          idList: [row.id],
          readStatus: 1,
          loading: false
        }).then(() => {
          globalBus.$emit('initMessage')
        }).catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }
      this.$router.push({
        path: '/message/detail',
        query: {
          id: row.id,
          t: row.type
        }
      })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
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
      this.$refs.multipleTable.clearSelection()
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      this.loading = true
      messageList({
        ...this.searchData,
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

    // 删除
    del (row) {
      let id = null
      if (row) {
        id = [row.id]
      } else if (this.multipleSelection.length > 0) {
        id = this.multipleSelection.map(x => x.id)
      }
      this.$confirm('确定要删除此通知记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMessage({
          idList: id
        }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$refs.multipleTable.clearSelection()
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

    // 清空
    delAll () {
      this.$confirm('确定要清空所有通知记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAll({
        }).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
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

    // 标记为已读
    changeReadStatus (row) {
      let id = null
      if (row) {
        id = [row.id]
      } else if (this.multipleSelection.length > 0) {
        id = this.multipleSelection.map(x => x.id)
      }
      changeReadStatus({
        idList: id,
        readStatus: 1
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.$refs.multipleTable.clearSelection()
        this.initList()
        globalBus.$emit('initMessage')
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 全部标记为已读
    changeAllReadStatus () {
      changeAllReadStatus({
        readStatus: 1
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.initList()
        globalBus.$emit('initMessage')
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  watch: {
    '$route.path' (newVal, oldVal) {
      if (oldVal.indexOf('detail') !== -1) {
        this.initList()
      }
    }
  },
  created () {
    globalBus.$on('refreshMessageList', () => {
      this.initList()
    })
  },
  mounted () {
    this.search()
  }
}
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;

  .el-row > .left {
    margin-right: 30px;
    margin-bottom: 15px;

    .input-label {
      line-height: 34px;
    }
  }
}
</style>
