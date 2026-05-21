<template>
  <div class="view-content" style="margin-top: 0;" v-loading="loading">
    <sticky
      :sticky-top="65"
      :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
    >
      <div class="clearfix">
        <el-button
          size="medium"
          type="primary"
          @click="addBlack"
        >添加</el-button
        >
        <el-button
          size="medium"
          type="primary"
          :disabled="!((name || searchData.securityLevels.length) ? tableData.length : true)"
          v-if="authorityFilter(3002)"
          @click="exportFile"
        >导出</el-button
        >
        <el-dropdown
          trigger="click"
          @command="mark($event, false)"
          v-if="authorityFilter(3003)"
        >
          <el-button
            size="medium"
            type="primary"
            :disabled="multipleSelection.length === 0"
          >
            标记为<i class="el-icon-arrow-down el-icon--right"></i
          ></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">未标记</el-dropdown-item>
            <el-dropdown-item :command="4">白名单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <search-area
          placeholder="请输入组件名称"
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
      row-key="dicComponentId"
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
          :disabled="!((name || searchData.securityLevels.length) ? tableData.length : true)"
          v-if="authorityFilter(3002)"
          @click="exportFile()"
        >导出</el-button
        >
        <el-dropdown
          trigger="click"
          @command="mark($event, false)"
          v-if="authorityFilter(3003)"
        >
          <el-button
            size="medium"
            type="primary"
            :disabled="multipleSelection.length === 0"
          >
            标记为<i class="el-icon-arrow-down el-icon--right"></i
          ></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">未标记</el-dropdown-item>
            <el-dropdown-item :command="4">白名单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <el-table-column reserve-selection type="selection" width="55"> </el-table-column>
      <el-table-column label="组件名称" min-width="20%" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="版本号" min-width="10%" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.version }}</template>
      </el-table-column>
      <el-table-column
        min-width="15%"
        label="风险等级"
        show-overflow-tooltip
      >
        <template #header>
          <oss-table-filter
            :default-props="{label: 'text', value: 'value' }"
            v-model="searchData.securityLevels"
            :filters="levelOptions"
            @change="search"
            title="风险等级"
            multiple
          />
        </template>
        <template slot-scope="scope">
          <level-tag :level="scope.row.securityLevel"></level-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞"
        min-width="15%"
        prop="vul_num"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
      >
        <template slot-scope="scope">
          <level-group @click="detail(scope.row, $event)" :value="[
             scope.row.vulNum.serious,
             scope.row.vulNum.high,
             scope.row.vulNum.medium,
             scope.row.vulNum.low
             ]">
          </level-group>
        </template>
      </el-table-column>
      <el-table-column min-width="20%" label="发布厂商" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.vendor }}</template>
      </el-table-column>
      <el-table-column min-width="20%" label="添加人" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ matching(userList, row.markUserId,'value','label' ) }}
        </template>
      </el-table-column>
      <el-table-column min-width="20%" label="添加时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.markTime }}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <icon-button
            v-if="authorityFilter(3001)"
            tooltip-content="详情"
            class="iconxiangqing"
            @click="detail(scope.row)"
          ></icon-button>
          <el-dropdown
            trigger="click"
            @command="mark($event, scope.row)"
            v-if="authorityFilter(3003)"
          >
            <icon-button
              tooltip-content="标记为"
              class="iconbiaoji2"
            ></icon-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="1">未标记</el-dropdown-item>
              <el-dropdown-item :command="4">白名单</el-dropdown-item>
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
      ></pagination>
    </div>
  </div>
</template>
<script>
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky'
import {
  blackList,
  changeStatus,
  exportComponent
} from '@/api/home/blackwhite/black'
import { downloadBlobFile, hasOwn } from '@/utils'
import MixinsList from '@/mixins/list.js'
import { mapState } from 'vuex'
import { allUser } from '@/api/home/user'

export default {
  name: 'BlackList',
  mixins: [MixinsList],
  components: {
    Sticky
  },
  data () {
    return {
      project: this.$store.state.home.project,
      searchLevel: [],
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
      searchData: {
        sortFieldList: [],
        sortTypeList: [],
        securityLevels: []
      },
      multipleSelection: [],
      userList: []
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

    /* 添加黑名单 */
    addBlack () {
      this.$router.push({
        path: '/black-white/black-white/add-black-list'
      })
    },

    // 初始化所以用户
    async initUserList () {
      this.userList = []
      await allUser({ loading: false }).then(response => {
        this.userList = []
        if (response.data) {
          response.data.forEach(item => {
            this.userList.push({
              value: item.id,
              label: item.username
            })
          })
        }
      }).catch(error => {
        this.$message.error(error.message)
        this.loading = false
      })
    },

    // // 导出文件
    exportFile () {
      if (this.multipleSelection.length > 0) {
        this.$popup({
          width: '550px',
          content: '<p style="padding: 20px">导出所选数据，是否继续导出？</p>',
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
          content: `<p style="padding: 20px">${(this.name || this.searchData.securityLevels.length) ? '导出搜索结果数据，是否继续导出？' : '导出所有组件数据，是否继续导出？'}</p>`,
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

    // 导出文件
    async exportFileSubmit () {
      try {
        let ids = this.multipleSelection.map(x => x.dicComponentId)

        ids = ids.join(',')
        const response = await exportComponent((this.name || this.searchData.securityLevels.length) ? {
          projectId: this.project.id,
          name: this.name,
          securityLevels: this.searchData.securityLevels,
          type: 1
        } : {
          assetComponentIdList: ids,
          projectId: this.project.id,
          type: 1
        })
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    // 标记为
    mark (status, row) {
      let ids = []
      if (row) {
        ids.push(row.dicComponentId)
      } else {
        ids = this.multipleSelection.map(x => x.dicComponentId)
      }
      changeStatus({
        status: status,
        dicComponentIdList: ids,
        projectId: this.project.id,
        type: 1
      })
        .then(response => {
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.$refs.multipleTable.clearSelection()
          this.initList()
        })
        .catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 详情
    detail (row, e = 10) {
      if (!this.authorityFilter(3001)) return
      this.$router.push({
        path: '/black-white/black-white/main/black/details',
        query: {
          dic: row.dicComponentId,
          project: row.projectId,
          version: row.version,
          _securityLevel: e
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

    // 搜索
    search () {
      this.$refs.multipleTable.clearSelection()
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      if (this.project === null) {
        return 0
      }
      this.loading = true

      /**
       * 保存搜索条件
       * **/
      this.saveSearchRecord({
        name: this.name,
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })

      const params = {
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        name: this.name,
        loading: false
      }

      if (this.project.id === -1 && hasOwn(this.searchData, 'projectId')) {
        params.projectId = this.searchData.projectId ? this.searchData.projectId : -1
      } else {
        params.projectId = this.project.id
      }

      blackList(params)
        .then(response => {
          this.loading = false
          this.tableData = []
          const data = response.data
          this.tableData = data.records || []
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

    filterLevel (value, row) {
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
    this.initUserList()
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
