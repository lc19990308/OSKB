<template>
  <div class="view-content" style="margin-top: 0;">
    <line-dialog ref="line" @change="editSuccessCallback"></line-dialog>
    <sticky
      :sticky-top="65"
      :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
    >
      <div class="clearfix">
        <el-button
          size="medium"
          type="primary"
          v-if="authorityFilter(3101)"
          @click="$router.push('/black-white/baseline/add')"
        >添加</el-button>
        <el-button
          size="medium"
          type="primary"
          :loading="downloadLoading"
          :disabled="name ? tableData.length <= 0 : false"
          v-if="authorityFilter(3107)"
          @click="exportFile"
        >导出</el-button>
        <el-dropdown
          trigger="click"
          v-if="authorityFilter([3104])"
        >
          <el-button
            size="medium"
            type="primary"
            :disabled="multipleSelection.length === 0"
          >
            更多操作<i class="el-icon-arrow-down el-icon--right"></i
          ></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="authorityFilter(3104)" @click.native="remove(multipleSelection)">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <search-area
          placeholder="请输入组件名称或发布厂商"
          @search="search"
          v-model="name"
          right-float
        ></search-area>
      </div>
    </sticky>
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      row-key="id"
      tooltip-effect="dark"
      @filter-change="searchFilter"
      @sort-change="searchSort"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
    >
      <template slot="bar">
        <el-button
          size="medium"
          type="primary"
          :loading="downloadLoading"
          v-if="authorityFilter(3107)"
          @click="exportFile()"
        >导出</el-button>
        <el-button size="medium" type="primary" v-if="authorityFilter(3104)" @click="remove(multipleSelection)">删除</el-button>
      </template>
      <el-table-column reserve-selection type="selection" width="55"> </el-table-column>
      <el-table-column label="发布厂商" min-width="15%" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ get(row, 'vendor', '-') }}
        </template>
      </el-table-column>
      <el-table-column label="组件名称" min-width="10%" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ get(row, 'name', '-') }}
        </template>
      </el-table-column>
      <el-table-column label="版本基线" min-width="15%" show-overflow-tooltip>
        <template slot-scope="{row}">
<!--          <div v-clamp="{ clamp: 1, text: get(row, 'version', '-')}" v-html="get(row, 'version', '-')"></div>-->
          {{row.version}}
        </template>
      </el-table-column>
      <el-table-column label="所属语言" min-width="10%" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ get(row, 'language', '-') }}
        </template>
      </el-table-column>
      <el-table-column label="添加人" min-width="10%" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ get(row, 'principal', '-') }}
        </template>
      </el-table-column>
      <el-table-column
                        label="添加时间"
                       min-width="15%"
                        sortable="custom"
                        :sort-orders="['descending','ascending',null]"
                        prop="created_date"
                         show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ get(row, 'createdDate', '-') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
<!--          <icon-button-->
<!--            tooltip-content="编辑"-->
<!--            class="iconbianji"-->
<!--            v-if="authorityFilter(3105)"-->
<!--            @click="$refs.edit.open(row)"-->
<!--          ></icon-button>-->
          <icon-button
            tooltip-content="编辑"
            class="iconbianji"
            v-if="authorityFilter(3105)"
            @click="$refs.line.open(row, '编辑')"
          ></icon-button>
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            v-if="authorityFilter(3104)"
            icon="el-icon-info"
            icon-color="red"
            title="删除操作不可恢复, 是否继续？"
            @confirm="remove(row)"
            @onConfirm="remove(row)"
          >
            <icon-button
              slot="reference"
              tooltip-content="删除"
              class="icondel"></icon-button>
          </el-popconfirm>
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
import Sticky from '@/components/public/Sticky'
import { downloadBlobFile, hasOwn, isObject, isArray } from '@/utils'
import MixinsList from '@/mixins/list'
import { mapState } from 'vuex'
import { componentBaselineList, deleteComponentBaseline, exportComponentBaseline } from '@/api/home/blackwhite/baseline'
import to from '@/utils/await-to'
import LineDialog from '@/views/home/blackWhite/baseline/LineDialog/index'

export default {
  name: 'baseLineList',
  mixins: [MixinsList],
  components: {
    LineDialog,
    Sticky
  },
  data () {
    return {
      project: this.$store.state.home.project,
      name: '',
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      searchData: {
        sortFieldList: ['created_date'],
        sortTypeList: [1]
      },
      multipleSelection: [],
      downloadLoading: false
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
    editSuccessCallback () {
      this.$message.success('版本基线修改成功')
      this.initList()
    },
    remove (row) {
      const f = async () => {
        const [error] = await to(deleteComponentBaseline({
          idList: isArray(row) ? row.map(item => item.id) : [row.id]
        }))
        if (isObject(error)) {
          this.$message.error(error.message)
        } else {
          this.$message.success('删除成功')
          this.$refs.multipleTable.clearSelection()
          this.initList()
        }
      }

      if (isArray(row)) {
        this.$popup({
          width: '550px',
          content: '<p style="padding: 20px">删除操作不可恢复, 是否继续？</p>',
          beforeClose: async (a, cd) => {
            if (a === 'confirm') {
              await f()
              cd()
            } else {
              cd()
            }
          }
        })
      } else {
        f()
      }
    },

    // 导出文件
    exportFile () {
      if (this.multipleSelection.length > 0) {
        this.$popup({
          width: '550px',
          content: '<p style="padding: 20px">导出所选组件数据，是否继续导出？</p>',
          beforeClose: async (a, cd) => {
            if (a === 'confirm') {
              this.exportFileSubmit(this.multipleSelection)
              cd()
            } else {
              this.downloadLoading = false
              cd()
            }
          }
        })
      } else {
        this.$popup({
          width: '550px',
          content: `<p style="padding: 20px">${(this.name && this.tableData.length) ? '导出搜索结果数据，是否继续导出？' : '导出所有组件数据，是否继续导出？'}</p>`,
          beforeClose: async (a, cd) => {
            if (a === 'confirm') {
              await this.exportFileSubmit()
              cd()
            } else {
              this.downloadLoading = false
              cd()
            }
          }
        })
      }
    },

    // 导出
    async exportFileSubmit (row) {
      this.downloadLoading = true
      try {
        const response = await exportComponentBaseline(
          row ? { idList: row.map(item => item.id) } : ((this.name && this.tableData.length) && { searchCondition: this.name })
        )
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.downloadLoading = false
      }
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

    // 搜索
    search () {
      this.$refs.multipleTable.clearSelection()
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      if (!this.authorityFilter(3106)) return
      if (this.project === null) return
      this.loading = true

      /**
       * 保存搜索条件
       * **/
      this.saveSearchRecord({
        searchCondition: this.name,
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })

      const params = {
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        searchCondition: this.name,
        loading: false
      }

      if (this.project.id === -1 && hasOwn(this.searchData, 'projectId')) {
        params.projectId = this.searchData.projectId ? this.searchData.projectId : -1
      } else {
        params.projectId = this.project.id
      }

      componentBaselineList(params)
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
          this.$refs.multipleTable.doLayout()
        })
      }
    }
  },
  mounted () {
    this.initList()
  }
}
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;
  margin-top: 20px;

  .el-dropdown {
    color: inherit;
  }
}
</style>
