<template>
  <panel title="IP白名单设置">
    <dialog-add-white-ip ref="addWhiteIp" @callback="search"></dialog-add-white-ip>
    <div class="clearfix m-b-15">
      <el-button size="medium" v-if="!disabled" @click="empty">清除白名单</el-button>
      <el-button type="primary" v-if="!disabled" size="medium" @click="add">新增</el-button>
      <el-dropdown trigger="click" @command="ops($event)" v-if="!disabled">
        <el-button size="medium" type="primary" :disabled="multipleSelection.length === 0">
          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="del">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      class="w-full"
      :data="tableData"
      v-loading="loading"
      ref="multipleTable"
      @selection-change="handleSelectionChange">

      <el-table-column
        v-if="!disabled"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="允许登录主机IP"
      >
      </el-table-column>
      <el-table-column
        prop="allowTime"
        label="允许登录时段"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="添加时间">
      </el-table-column>
      <el-table-column
        prop="address"
        width="150"
        v-if="!disabled"
        label="操作" fixed="right">
        <template slot-scope="scope">
          <icon-button tooltip-content="删除" class="icondel" @click="del(scope.row)"></icon-button>
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
  </panel>
</template>

<script>
import DialogAddWhiteIp from '@/views/home/system/safety/dialogAddWhiteIp'
import { getIpList, delIp, emptyIp } from '@/api/home/system/safety/index'
import { PAGE_CONF } from '@/utils/conf'

export default {
  components: {
    DialogAddWhiteIp
  },
  props: ['disabled'],
  data () {
    return {
      project: this.$store.state.home.project,
      loading: false,
      tableData: [],
      pageSize: PAGE_CONF.pageSize,
      currentPage: 1,
      total: 0,
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 更多操作
    ops (event, row) {
      event(row)
    },

    add () {
      this.$refs.addWhiteIp.dialogVisible = true
    },

    // 初始化列表
    initList () {
      this.loading = true
      this.tableData = []
      getIpList({
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
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 删除
    del (row) {
      let ids = []
      if (row) {
        ids.push(row.id)
      } else if (this.multipleSelection.length > 0) {
        ids = this.multipleSelection.map(x => x.id)
      }
      this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delIp({
          idList: ids
        }).then(response => {
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

    // 清除白名单
    empty () {
      this.$confirm('清空操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        emptyIp({}).then((response) => {
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
          message: '已取消清空'
        })
      })
    },

    search () {
      this.initList()
    }
  },
  mounted () {
    this.initList()
  }
}
</script>
