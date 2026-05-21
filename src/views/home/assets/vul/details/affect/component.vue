<template>
  <div>
    <ComponentDependencyPathDialog
      :xhr="componentDependencyList"
      ref="componentDependencyPathDialog">
    </ComponentDependencyPathDialog>
    <ModuleQueryBox v-model="searchData" ref="query" @change="search"></ModuleQueryBox>
    <div class="search-wrap">
      <el-checkbox @change="$refs.query.filter()" v-model="searchData.filterNonBaseline">不符合基线版本组件</el-checkbox>
    </div>
    <el-table
      class="w-full"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      @filter-change="searchFilter"
      @sort-change="searchSort"
    >
      <el-table-column
        min-width="150px"
        label="发布厂商"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ get(row, 'vendor', '--') }}
        </template>
      </el-table-column>
      <el-table-column
        label="组件名称"
        min-width="150px"
        prop="name"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="版本号"
        min-width="100px"
        prop="version"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="语言"
        min-width="100px"
        prop="version"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ get(row, 'language', '-') }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
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
          <level-tag :level="get(row, 'securityLevel', 5)"></level-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞"
        width="200"
        prop="vul_num"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
      >
        <template slot-scope="{row}">
          <level-group :value="[
             row.vulNumVO.serious,
             row.vulNumVO.high,
             row.vulNumVO.medium,
             row.vulNumVO.low
             ]">
          </level-group>
        </template>
      </el-table-column>
      <el-table-column
        label="许可证"
        min-width="100px"
        prop="version"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ get(row, 'license', '-') }}
        </template>
      </el-table-column>
      <el-table-column
        label="推荐升级版本"
        min-width="150px"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ get(row, 'recommendVersion', '-') }}
        </template>
      </el-table-column>
      <el-table-column
        label="最新发布版本"
        min-width="150px"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ get(row, 'latestVersion', '-') }}
        </template>
      </el-table-column>
      <el-table-column
        label="依赖路径统计"
        min-width="150px"
        prop="version"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <div @click="openDependencyDialog(row)">
            <el-link class="block" :underline="false" type="primary" v-if="row.directDependentCount">
              直接依赖：{{ row.directDependentCount }}
            </el-link>
            <el-link :underline="false" type="primary" v-if="row.indirectDependentCount">
              间接依赖：{{ row.indirectDependentCount }}
            </el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <icon-button
            tooltip-content="详情"
            v-if="authorityFilter(401)"
            class="iconxiangqing"
            @click="detail(scope.row)"
          ></icon-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer-wrapper clearfix">
      <pagination
        small
        :background="false"
        @size-change="initList"
        @current-change="initList"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :layout="'total, prev, pager, next, jumper'"
        :total="total"
        class="right"
        :prev-text="''"
        :next-text="''"
      >
      </pagination>
    </div>
  </div>
</template>
<script>
import { PAGE_CONF } from '@/utils/conf'
import { hasOwn } from '@/utils'
import ModuleQueryBox from '@/views/home/assets/module/ModuleQueryBox'
import { riskComponentList, componentDependencyList } from '@/api/home/assets/module'
import ComponentDependencyPathDialog from '@/views/home/assets/module/ComponentDependencyPathDialog'

export default {
  name: 'license-details-component',
  components: {
    ComponentDependencyPathDialog,
    ModuleQueryBox
  },
  data () {
    return {
      dicVulId: this.$route.query.dicVulId,
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
      tableData: [],
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      searchData: {
        filterNonBaseline: false
      },
      searchText: ''
    }
  },
  mounted () {
    if (this.id !== null && this.project) {
      this.initList()
    }
  },
  methods: {
    componentDependencyList,
    openDependencyDialog (row) {
      const app = this.$refs.componentDependencyPathDialog
      app.searchData.dicComponentId = row.dicComponentId
      app.searchData.projectIds = row.projectIds
      app.open()
    },
    // 详情
    detail (row) {
      this.$router.push({
        path: '/assets/module/details',
        query: {
          dic: row.dicComponentId,
          asset: row.assetComponentId,
          version: row.version,
          pdceiid: row.pdceiid
        }
      })
    },

    // 初始化列表
    initList () {
      this.loading = true
      riskComponentList({
        ...this.searchData,
        dicVulId: this.dicVulId,
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

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
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
    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = undefined
        this.searchData.sortTypeList = undefined
      }
      this.search()
    }
  }
}
</script>
<style scoped lang="scss">
.info-section {
  p {
    margin-top: 0;
    margin-bottom: 10px;
    line-height: 34px;
    color: #666;

    .title {
      width: 110px;
      float: left;
      vertical-align: middle;
    }

    .content {
      margin-left: 110px;
      vertical-align: middle;
    }
  }

  .search-wrap {
    overflow: hidden;
    margin-bottom: 10px;
  }

  .el-dropdown {
    color: inherit;
  }
}

.search-container {
  margin-bottom: 15px;
}
</style>
