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
        :class-name="'cursor-pointer'"
        :filters="levelOptions"
        filter-multiple
        :column-key="'securityLevels'"
        show-overflow-tooltip
      >
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
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <level-group :value="[
             scope.row.vulNum.serious,
             scope.row.vulNum.high,
             scope.row.vulNum.medium,
             scope.row.vulNum.low
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
import { componentList } from '@/api/open/assets/license'
import { hasOwn } from '@/utils'

export default {
  name: 'license-details-component',
  components: {},
  data () {
    return {
      id: this.$route.query.id,
      token: this.$route.query.token,
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
    detail (row) {
      this.$router.push({
        path: '/assets/module/details',
        query: {
          dic: row.dicComponentId,
          asset: row.assetComponentId,
          project: row.projectId,
          version: row.version
        }
      })
    },

    // 初始化列表
    initList () {
      this.loading = true
      this.tableData = []
      componentList({
        id: this.id,
        pageNum: this.currentPage,
        projectId: -1,
        pageSize: this.pageSize,
        name: this.searchText,
        ...this.searchData,
        loading: false
      }, this.token)
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
    if (![null, '', undefined].includes(this.id)) {
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
