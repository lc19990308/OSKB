<template>
  <div class="view-content compound-search-box--btn" style="margin-top: 0;">
    <drawer-vul-detail ref="drawerVulDetail"></drawer-vul-detail>
    <sticky
      :sticky-top="65"
      :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
    >
      <div class="clearfix">
        <el-button
          size="medium"
          type="primary"
          v-if="authorityFilter(3201)"
          @click="$router.push('/black-white/loophole/black/add')"
        >添加</el-button>
        <el-button
          size="medium"
          type="primary"
          :disabled="(name || searchData.securityLevels.length) ? tableData.length <= 0 : false"
          :loading="downloadLoading"
          v-if="authorityFilter(3207)"
          @click="exportFile"
        >导出</el-button>
        <el-dropdown
          trigger="click"
          v-if="authorityFilter([3204])"
        >
          <el-button
            size="medium"
            type="primary"
            :disabled="multipleSelection.length === 0"
          >
            更多操作<i class="el-icon-arrow-down el-icon--right"></i
          ></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  v-if="authorityFilter(3204)" @click.native="remove(multipleSelection)">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <search-area
          class="m-r-10 right customize-input"
          placeholder="请输入搜索信息"
          @search="search"
          v-model="name"
          right-float
        ></search-area>
        <el-select  style="float: right; width: 140px;" @change="search" class="customize-select" v-model="searchType" size="medium">
          <el-option
            v-for="item in searchTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
          :disabled="(name || searchData.securityLevels.length) ? tableData.length <= 0 : false"
          :loading="downloadLoading"
          v-if="authorityFilter(3207)"
          @click="exportFile()"
        >导出</el-button>
        <el-button size="medium" type="primary" v-if="authorityFilter(3204)" @click="remove(multipleSelection)">删除</el-button>
      </template>
      <el-table-column reserve-selection type="selection" width="55"> </el-table-column>
      <el-table-column
        min-width="90"
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
        <template slot-scope="{row}">
          <level-tag :level="get(row, 'security', 5)"></level-tag>
        </template>
      </el-table-column>
      <el-table-column label="XMIRROR" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-link
            :underline="false"
            type="primary"
            @click="$refs.drawerVulDetail.open(row)"
          >
            {{get(row, 'xmirror', '-')}}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="CVE" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{get(row, 'cve', '-')}}
        </template>
      </el-table-column>
      <el-table-column label="CNNVD" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{get(row, 'cnnvd', '-')}}
        </template>
      </el-table-column>
      <el-table-column label="CNVD" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{get(row, 'cnvd', '-')}}
        </template>
      </el-table-column>
      <el-table-column label="漏洞名称" min-width="170" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{get(row, 'name', '-')}}
        </template>
      </el-table-column>
      <el-table-column label="添加人" min-width="90" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{get(row, 'principal', '-')}}
        </template>
      </el-table-column>
      <el-table-column label="添加时间"
                       min-width="150"
                       show-overflow-tooltip
                       sortable="custom"
                       :sort-orders="['descending','ascending',null]"
                       prop="created_date"
      >
        <template slot-scope="{row}">
          {{get(row, 'createdDate', '-')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            v-if="authorityFilter(3204)"
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
import Sticky from '@/components/public/Sticky/index.vue'
import { downloadBlobFile, hasOwn, isArray, isObject } from '@/utils'
import MixinsList from '@/mixins/list'
import { mapState } from 'vuex'
import {
  deleteVulnerabilityBlacklist,
  exportVulnerabilityBlacklist,
  vulnerabilityBlacklist
} from '@/api/home/blackwhite/loophole'
import to from '@/utils/await-to'
import DrawerVulDetail from './detales/index.vue'

export default {
  name: 'loopholeList',
  mixins: [MixinsList],
  components: {
    DrawerVulDetail,
    Sticky
  },
  data () {
    return {
      project: this.$store.state.home.project,
      searchTypeOptions: [
        {
          value: 4,
          label: 'XMIRROR编号'
        },
        {
          value: 1,
          label: 'CVE编号'
        },
        {
          value: 2,
          label: 'CNNVD编号'
        },
        {
          value: 3,
          label: 'CNVD编号'
        },
        {
          value: 5,
          label: '漏洞名称'
        }
      ],
      searchType: 1,
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
        }
      ],
      name: undefined,
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      searchData: {
        sortFieldList: ['created_date'],
        sortTypeList: [1],
        securityLevels: []
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
    remove (row) {
      const f = async () => {
        const [error] = await to(deleteVulnerabilityBlacklist({
          status: 1,
          idList: isArray(row) ? row.map(item => item.id) : [row.id]
        }))
        if (isObject(error)) {
          this.$message.error(error.message)
        } else {
          this.$message.success('删除成功')
          this.initList()
          this.$refs.multipleTable.clearSelection()
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
          content: '<p style="padding: 20px">导出所选漏洞黑名单数据，是否继续导出？</p>',
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
          content: `<p style="padding: 20px">${((this.name || this.searchData.securityLevels.length) && this.tableData.length) ? '导出搜索结果数据，是否继续导出？' : '导出所有漏洞黑名单数据，是否继续导出？'}</p>`,
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
        const params = row
          ? { idList: row.map(item => item.id) }
          : ((this.name || this.searchData.securityLevels.length) && this.tableData.length) ? {
            searchConditionKey:
            this.searchType,
            searchCondition: this.name,
            securityLevels: this.searchData.securityLevels
          } : {}
        const response = await exportVulnerabilityBlacklist({ ...params, status: 1 })
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
      if (!this.authorityFilter(3206)) return
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
        searchConditionKey: this.searchType,
        loading: false,
        status: 1
      }

      if (this.project.id === -1 && hasOwn(this.searchData, 'projectId')) {
        params.projectId = this.searchData.projectId ? this.searchData.projectId : -1
      } else {
        params.projectId = this.project.id
      }
      vulnerabilityBlacklist(params)
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
