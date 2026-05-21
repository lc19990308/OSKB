<template>
  <div class="info-section">
    <div class="search-wrap">
      <search-area
        placeholder="请输入组件名称"
        @search="search"
        v-model="searchText"
        right-float
      ></search-area>
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
        label="组件名称"
        min-width="20%"
        prop="name"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="版本号"
        min-width="10%"
        prop="version"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="漏洞"
        width="200"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="vul_num"
      >
        <template slot-scope="scope">
          <level-group :value="[
             scope.row.vulNumVO.serious,
             scope.row.vulNumVO.high,
             scope.row.vulNumVO.medium,
             scope.row.vulNumVO.low
             ]">
          </level-group>
        </template>
      </el-table-column>
      <el-table-column
        label="发布时间"
        min-width="15%"
        prop="release_date"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.releaseDate }}
        </template>
      </el-table-column>
      <el-table-column
        label="发布厂商"
        min-width="20%"
        prop="vendor"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="scope">
          <icon-button
            tooltip-content="详情"
            class="iconxiangqing"
            @click="detail(scope.row)"
          ></icon-button>
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
// import { componentList } from '@/api/home/assets/license'
import {
  riskComponentList
} from '@/api/home/assets/module'
import { hasOwn } from '@/utils'

export default {
  name: 'license-details-component',
  components: {},
  data () {
    return {
      id: this.$route.query.id,
      project: this.$store.state.home.project,
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
      tableData: [],
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      searchData: {},
      searchText: ''
    }
  },
  methods: {
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
      this.currentPage = 1
      this.initList()
    },

    // 详情
    detail (row, e = 10) {
      this.$router.push({
        path: '/assets/module/details',
        query: {
          dic: row.dicComponentId,
          asset: row.assetComponentId,
          project: row.projectId,
          version: row.version,
          pdceiid: row.pdceiid,
          _securityLevel: e
        }
      })
    },

    // 初始化列表
    initList () {
      this.loading = true
      this.tableData = []
      riskComponentList({
        dicLicenseIds: [this.id],
        projectId: this.project.id,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        name: this.searchText,
        ...this.searchData,
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
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    }
  },
  mounted () {
    if (this.id !== null && this.project) {
      this.initList()
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
    margin-bottom: 15px;
  }

  .el-dropdown {
    color: inherit;
  }
}

.search-container {
  margin-bottom: 15px;
}
</style>
