<template>
  <div class="view-content">
    <dialog-add-user ref="addUser" @callback="search"></dialog-add-user>
    <dialog-change-effective ref="dialogChangeEffective"></dialog-change-effective>
    <sticky
      :sticky-top="65"
      :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
    >
      <div class="clearfix">
        <el-button
          size="medium"
          type="primary"
          v-if="authorityFilter(1902)"
          @click="add"
        >添加账号
        </el-button
        >
        <el-button
          size="medium"
          type="primary"
          v-if="authorityFilter(2000)"
          @click="role"
        >角色管理
        </el-button
        >
        <el-dropdown
          trigger="click"
          @command="ops($event)"
          v-if="authorityFilter(1905, 1906, 1903)"
        >
          <el-button
            size="medium"
            type="primary"
            :disabled="multipleSelection.length === 0"
          >
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="changeEffective"
              v-if="authorityFilter(1905)"
              :disabled="multipleSelection.length === 0"
            >更改状态
            </el-dropdown-item>
            <el-dropdown-item
              :command="del"
              v-if="authorityFilter(1903)"
              :disabled="multipleSelection.length === 0"
            >批量删除
            </el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <search-area placeholder="请输入用户名" @search="search" v-model="username" right-float></search-area>
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
      @selection-change="handleSelectionChange"
    >
      <template slot="bar">
        <el-button size="medium" type="primary" @click="changeEffective()" v-if="authorityFilter(1905)">
          更改状态
        </el-button>
        <el-button size="medium" type="primary" @click="del()" v-if="authorityFilter(1903)">
          批量删除
        </el-button>
      </template>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        label="用户名"
        min-width="15%"
        prop="username"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        min-width="10%"
        label="角色"
        prop="roleName"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="姓名"
        min-width="10%"
        prop="realName"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="邮箱"
        min-width="20%"
        prop="email"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="联系电话"
        min-width="15%"
        prop="phone"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        min-width="15%"
        sortable='custom'
        :sort-orders="['descending', 'ascending', null]"
        prop="create_date"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
      </el-table-column>
      <el-table-column
        label="授权时段"
        min-width="10%"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{
            scope.row.authStartTime && scope.row.authEndTime
              ? scope.row.authStartTime + '-' + scope.row.authEndTime
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="10%"
        label="状态"
        prop="effective"
        show-overflow-tooltip
      >
        <template #header>
          <oss-table-filter
            :default-props="{label: 'text', value: 'value' }"
            v-model="searchData.effective"
            :filters="statusOptions"
            @change="search"
            title="状态"
          />
        </template>
        <template slot-scope="scope">
          <span :class="scope.row.effective === 1 ? 'text-success' : 'text-danger'">
             {{
              scope.row.effective === 1
                ? '正常'
                : scope.row.effective === 0
                  ? '锁定'
                  : '-'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <icon-button v-if="authorityFilter(1904)" :disabled="scope.row.userId === 1 ? userInfo.userId !== 1 : false"
                       tooltip-content="编辑" class="iconbianji" @click="edit(scope.row)"></icon-button>
          <icon-button v-if="authorityFilter(1906)" :disabled="scope.row.userId === 1 ? userInfo.userId !== 1 : false"
                       tooltip-content="重置" class="iconReset" @click="resetPwd(scope.row)"></icon-button>
          <icon-button v-if="authorityFilter(1903)" :disabled="scope.row.userId === 1" tooltip-content="删除"
                       class="icondel" @click="del(scope.row)"></icon-button>
          <icon-button v-if="authorityFilter(1905) && scope.row.effective === 0" :disabled="scope.row.userId === 1"
                       tooltip-content="解锁" class="iconjiesuo" @click="unlock(scope.row)"></icon-button>
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
import DialogAddUser from '@/views/home/user/account/dialogAddUser.vue'
import DialogChangeEffective from '@/views/home/user/account/dialogChangeEffective.vue'
import {
  userList,
  userDel,
  userInitPwd,
  changeEffective
} from '@/api/home/user/index'
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky/index.vue'
import { mapState } from 'vuex'
import { copyText } from '@/utils'

export default {
  name: 'user-account',
  components: {
    DialogAddUser,
    DialogChangeEffective,
    Sticky
  },
  data () {
    return {
      username: '',
      effective: '',
      statusOptions: [
        {
          text: '正常',
          value: 1
        },
        {
          text: '锁定',
          value: 0
        }
      ],
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      searchData: {},
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo
    })
  },
  methods: {
    // 添加
    add () {
      this.$refs.addUser.type = 'add'
      this.$refs.addUser.dialogVisible = true
    },

    // 编辑
    edit (row) {
      this.$refs.addUser.type = 'edit'
      this.$refs.addUser.row = { ...row }
      this.$refs.addUser.userId = row.userId
      this.$refs.addUser.dialogVisible = true
    },

    // 删除
    del (row) {
      let ids = []
      if (row) {
        ids = [row.userId]
      } else {
        ids = this.multipleSelection.map(x => {
          return x.userId
        })
      }
      this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userDel({
            idList: ids
          })
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.initList()
            })
            .catch(error => {
              if (typeof error === 'object') {
                this.$message.error(error.message)
              }
            })
        })
        .catch(() => {
          this.$message({
            message: '已取消删除'
          })
        })
    },

    // 解锁
    unlock (row) {
      this.$confirm('对锁定用户执行解锁操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          changeEffective({
            param: [
              {
                id: row.userId,
                effective: 1
              }
            ]
          })
            .then(response => {
              this.$message({
                type: 'success',
                message: '操作成功！'
              })
              this.initList()
            })
            .catch(error => {
              if (typeof error === 'object') {
                this.$message.error(error.message)
              }
            })
        })
        .catch(() => {
          this.$message({
            message: '已取消操作'
          })
        })
    },

    filterRole (value, row) {
      return row.securityLevel === value
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
      if (!this.authorityFilter(1901)) {
        return 0
      }
      this.loading = true
      userList({
        ...this.searchData,
        username: this.username,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      })
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

    // 更改状态
    changeEffective () {
      this.$refs.dialogChangeEffective.dialogVisible = true
      this.$refs.dialogChangeEffective.callback = effective => {
        const ids = this.multipleSelection.map(x => {
          return {
            id: x.userId,
            effective: effective
          }
        })
        changeEffective({
          param: ids
        })
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.initList()
          })
          .catch(error => {
            if (typeof error === 'object') {
              this.$message.error(error.message)
            }
          })
      }
    },

    // 重置密码
    resetPwd (row) {
      this.$confirm('将所选用户密码重置为随机密码，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids
          if (row) {
            ids = [row.userId]
          } else {
            ids = this.multipleSelection.map(x => x.userId)
          }
          userInitPwd({
            idList: ids
          })
            .then(response => {
              if (response.code === 0) {
                setTimeout(() => this.$popup({
                  title: '提示',
                  width: '500px',
                  confirmButtonText: '复制并关闭',
                  showCancelButton: false,
                  content: `<div style="padding: 10px 0">
                        <p>
                            密码重置成功！新密码为：
                            <span class="text-primary">${response.data.data}</span>
                            （用户名：<span class="text-primary">${row.username}</span>）。
                        </p>
                        <p>请及时复制并保存密码，弹窗关闭后将无法再查看！</p>
                      </div>`,
                  beforeClose (action, next) {
                    if (action === 'confirm') {
                      copyText(response.data.data)
                    }
                    next()
                  }
                }), 200)
              }
            })
            .catch(error => {
              if (typeof error === 'object') {
                this.$message.error(error.message)
              }
            })
        }).catch(() => {
        })
    },

    // 更多操作
    ops (event, row) {
      event(row)
    },

    // 角色管理
    role () {
      this.$router.push({
        path: '/user/role'
      })
    }
  },
  mounted () {
    this.search()
  }
}
</script>

<style scoped lang="scss">
.view-content {
  font-size: 14px;

  .el-dropdown {
    color: inherit;
  }
}
</style>
