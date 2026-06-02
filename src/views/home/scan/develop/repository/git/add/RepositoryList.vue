<template>
  <div>
    <div class="clearfix m-b-15">
      <span v-if="configType !== 1" class="m-r-5" style="color: #D9534F">*</span>
      <el-input
        class="search-input"
        clearable
        size="medium"
        :placeholder="'请输入仓库名称' + (configType !== 1 ? '，为必填项' : '')"
        prefix-icon="el-icon-search"
        v-model="searchCondition"
        @keydown.enter.native="search"
      >
      </el-input>
    </div>
    <div v-loading="loading">
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        row-key="gitlabRepositoryId"
        tooltip-effect="dark"
        @sort-change="searchSort"
        @selection-change="handleSelectionChange"
      >

        <el-table-column
          type="selection"
          reserve-selection
          :selectable="checkSelectable"
          width="55">
        </el-table-column>
        <el-table-column
          width="280px"
          label="仓库名称"
          prop="name">
          <template slot-scope="{row}">
            <div class="flex items-center">
              <div :style="{'max-width': (row.exists ? 160 : 220) + 'px'}" class="table-span">{{row.name}}</div>
              <span v-if="row.exists" style="color: #fff;background: red;border-radius: 10px;padding: 2px 7px;margin: 0 5px;line-height: normal;font-size: 12px;">已添加</span>
              <span><icon-button  v-if="row.branchList.length <= 0" tooltip-content="仓库内容为空，无需进行检测" class="iconempty"></icon-button></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="20%"
          label="仓库大小"
          prop="repository_size">
          <template slot-scope="{row}">
            <template v-if="row.repositorySize">
              {{row.repositorySize | byteSize}}
            </template>
            <template v-else>
              {{ row.repositorySize == 0 ? 0 : "-" }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          min-width="30%"
          label="描述"
          prop="description"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.description ? row.description : '—'}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="20%"
          show-overflow-tooltip>
          <template slot="header">
            <el-tooltip class="item" effect="dark" content="默认检测仓库的default_branch" placement="top">
              <i class="iconfont iconbangzhu cursor-pointer"></i>
            </el-tooltip>
            检测分支
          </template>
          <template slot-scope="{ row, $index }">
            <el-dropdown
              v-if="row.branchList.length > 0"
              trigger="click"
              @command="handleCommand($event, row)"
              placement="bottom-start"
            >
              <el-link :underline="false">{{ row.defaultBranch }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-link>
              <el-dropdown-menu slot="dropdown">
                <el-scrollbar class="scrollbar-hide-x">
                  <el-dropdown-item
                    v-for="(item, index) in row.branchList"
                    :command="item"
                    :key="$index + '-' + index"
                  >{{ item }}
                  </el-dropdown-item>
                </el-scrollbar>
              </el-dropdown-menu>
            </el-dropdown>
            <template v-else>—</template>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer-wrapper clearfix">
        <simple-pagination
          class="right"
          :data="tableData"
          @size-change="initList"
          @current-change="initList"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize">
        </simple-pagination>
        <!--      <pagination-->
        <!--        layout="total,sizes,prev,next"-->
        <!--        @size-change="initList"-->
        <!--        @current-change="initList"-->
        <!--        :current-page.sync="currentPage"-->
        <!--        :page-size.sync="pageSize"-->
        <!--        :total="total"-->
        <!--        class="right"-->
        <!--      ></pagination>-->
      </div>
    </div>
  </div>
</template>
<script>
import { debounce } from '@/utils/index.js'
import { gitRepositoryList } from '@/api/home/scan/develop/repository/git/index.js'
import SimplePagination from '@/views/home/scan/develop/repository/git/add/SimplePagination'

export default {
  name: 'RepositoryList',
  components: { SimplePagination },
  props: {
    selectAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      id: '',
      project: this.$store.state.home.project,
      configType: 1,
      searchCondition: '',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tableData: [
      ],
      changeBranchList: [],
      searchData: {
        sortFieldList: [],
        sortTypeList: []
      },
      checked: [],
      loading: false
    }
  },
  methods: {
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
    // 空仓库禁止选中
    checkSelectable (row) {
      return row.branchList.length > 0 && !this.selectAll
    },
    handleCommand (data, row) {
      this.$set(row, 'defaultBranch', data)
      this.recordChangeDefaultBranchRow(row)
    },
    /**
     * @name 记录change过默认分支的数据
     * @param {Object} row
     */
    recordChangeDefaultBranchRow (row) {
      const idx = this.changeBranchList.findIndex(item => item.gitlabRepositoryId === row.gitlabRepositoryId)
      if (idx > -1) {
        this.changeBranchList.splice(idx, 1, row)
      } else {
        this.changeBranchList.push(row)
      }
    },
    // 防抖搜索
    searchDebounce: debounce(function () {
      this.search()
    }, 500),

    // 搜索
    search () {
      this.tableData = []
      this.currentPage = 1
      if (this.configType === 3) {
        if (!this.searchCondition) return
      }
      this.initList()
    },

    // 初始化列表
    initList () {
      if (this.project === null || this.id === '') {
        return 0
      }
      this.loading = true
      gitRepositoryList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        projectId: this.project.id,
        name: this.searchCondition || null,
        gitRepositoryConfigId: this.id,
        ...this.searchData,
        loading: false
      }).then(response => {
        this.loading = false
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          const v = this.checked.find(row => row.gitlabRepositoryId === item.gitlabRepositoryId)
          this.tableData.push(v || item)
        })

        // 选择全部仓库
        if (this.selectAll) {
          this.$refs.multipleTable.toggleAllSelection()
        }
        this.total = data.total
        this.$emit('update:total', data.total)
      }).catch(error => {
        this.tableData = []
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    /**
     * @name checked
     * @param val
     */
    handleSelectionChange (val) {
      val = typeof val === 'undefined' ? [] : val
      this.checked = val
      this.$emit('update:checked', this.checked)
    },
    /**
     * @name 获取改过默认分支的数据
     * @param void
     * @return {Array}
     */
    getAllNodes () {
      return this.changeBranchList.filter(item => item.branchList.length > 0)
    }
  },
  watch: {
    '$store.state.home.project' (n) {
      if (n !== null) {
        this.project = n
        this.search()
      }
    },
    selectAll: {
      handler (v) {
        this.$nextTick(() => {
          if (v) {
            this.$refs.multipleTable.toggleAllSelection()
          } else {
            this.$refs.multipleTable.clearSelection()
          }
        })
      },
      immediate: true
    }
  },
  mounted () {
    if (this.$store.state.home.project !== null) {
      this.search()
    }
  }
}
</script>
<style scoped lang="scss">
.table-footer-wrapper {
  padding-top: 15px;
}

.search-input {
  width: 290px;
}

.el-scrollbar {
  :deep(.el-scrollbar__wrap) {
    max-height: 300px;
    padding-bottom: 17px;
  }
}
</style>
