<template>
  <div>
    <dialog-add-role ref="addrole" @callback="search"></dialog-add-role>
    <div class="view-content">
      <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'">
        <div class="clearfix">
          <el-button size="medium" type="primary" @click="back">返回</el-button>
          <el-button size="medium" type="primary" v-if="authorityFilter(2002)" @click="add">添加角色</el-button>
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

        <el-table-column
          label="角色"
          min-width="24%"
          prop="name"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            label="描述"
            min-width="24%"
            prop="description"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            label="创建时间"
            min-width="24%"
            sortable="custom"
            :sort-orders="['descending', 'ascending', null]"
            prop="create_date"
            show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.createDate }}</template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          min-width="24%"
          prop="modifyDate"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作" fixed="right"
          width="150"
          v-if="authorityFilter([2004, 2003])"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <icon-button v-if="authorityFilter(2004)" tooltip-content="编辑" :disabled="scope.row.id === 1" class="iconbianji" @click="edit(scope.row)"></icon-button>
            <icon-button v-if="authorityFilter(2003)" tooltip-content="删除" :disabled="scope.row.id === 1" class="icondel" @click="del(scope.row)"></icon-button>
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
  </div>
</template>
<script>
import DialogAddRole from '@/views/home/user/role/dialogAddRole.vue'
import { roleList, roleDel } from '@/api/home/user/index'
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky/index.vue'

export default {
  name: 'role',
  components: {
    DialogAddRole,
    Sticky
  },
  data () {
    return {
      searchText: '',
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      multipleSelection: [],
      searchData: {}
    }
  },
  methods: {
    back () {
      this.$router.push({
        path: '/user/account'
      })
    },

    // 添加
    add () {
      this.$refs.addrole.id = ''
      this.$refs.addrole.type = 'add'
      this.$refs.addrole.dialogVisible = true
    },

    // 编辑
    edit (row) {
      this.$refs.addrole.type = 'edit'
      this.$refs.addrole.id = row.id
      this.$refs.addrole.name = row.name
      this.$refs.addrole.description = row.description
      this.$refs.addrole.dialogVisible = true
    },

    // 删除
    del (row) {
      this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleDel({
          id: row.id
        }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initList()
        }).catch(error => {
          this.$message.error(error.message)
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除'
        })
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
      if (!this.authorityFilter(2001)) {
        return 0
      }
      this.loading = true
      roleList({
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
        if (error && error.message) {
          this.$message.error(error.message)
        }
      })
    }
  },

  mounted () {
    this.initList()
  }
}
</script>
