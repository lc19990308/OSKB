<template>
  <el-dialog
    title="删除记录"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="900px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true">
    <div class="m-b-15">
      <el-button type="primary" size="medium" v-if="authorityFilter(107)" @click="recover" :disabled="multipleSelection.length === 0">恢复</el-button>
      <el-button type="primary" size="medium" class="btn" v-if="authorityFilter(108)" @click="del">彻底删除</el-button>
    </div>

    <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        v-loading="loading"
        row-key="id"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">

        <el-table-column
          type="selection"
          reserve-selection
          width="55">
        </el-table-column>
        <el-table-column
          label="删除时间"
          min-width="33%"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.opDate }}</template>
        </el-table-column>
        <el-table-column
          label="项目名称"
          min-width="33%"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.projectName }}</template>
        </el-table-column>
        <el-table-column
          label="操作账号"
          min-width="33%"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.username }}</template>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="confirm" size="medium">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { projectDelLog, projectRecover, projectDelete } from '@/api/home/project'
import { PAGE_CONF } from '@/utils/conf'

export default {
  name: 'DialogAddProject',
  data () {
    return {
      dialogVisible: false,
      searchText: '',
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      multipleSelection: []
    }
  },
  methods: {
    // 取消
    confirm () {
      this.dialogVisible = false
    },

    // 初始化删除记录列表
    initList () {
      this.loading = true
      this.tableData = []
      projectDelLog({
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(response => {
        this.tableData = []
        this.loading = false
        const data = response.data
        data.records.forEach(item => {
          this.tableData.push(item)
        })
        this.total = data.total
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 彻底删除记录
    del () {
      let dels = this.multipleSelection.map(x => x.id)
      dels = dels.join(',')
      this.$confirm(dels.length ? '删除操作不可恢复, 是否继续?' : '确定要彻底删除回收站的所有项目吗？确定后会清空回收站且数据无法恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        projectDelete({
          projectDelLogIdList: dels
        }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.toggleSelection()
          this.initList()
        }).catch(error => {
          this.$message.error(error.message)
        })
      }).catch(() => {
      })
    },

    // 恢复
    recover () {
      let dels = this.multipleSelection.map(x => x.id)
      const recoverList = this.multipleSelection.map(x => {
        return {
          id: x.projectId,
          userId: x.userId,
          name: x.projectName
        }
      })
      dels = dels.join(',')
      projectRecover({
        projectDelLogIdList: dels
      }).then(response => {
        this.$store.dispatch('getProjectList')
        this.$emit('recoverCallback', recoverList)
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.toggleSelection()
        this.initList()
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 打开窗口时的回调
    open () {
      this.initList()
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
    // 处理选择改变
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>
