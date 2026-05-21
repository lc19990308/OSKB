<template>
  <div class="p-t-15">
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      @filter-change="searchFilter"
      @sort-change="searchSort">

      <el-table-column
          label="项目名"
          min-width="15%"
          prop="projectName"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          label="负责人"
          min-width="15%"
          prop="username"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          label="组件"
          prop="component_total"
          sortable="custom"
          :sort-orders="['descending','ascending',null]"
          min-width="15%"
          show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.componentNumVO.total }}
        </template>
      </el-table-column>
      <el-table-column
          label="漏洞"
          width="200"
          prop="vul_total"
          sortable="custom"
          :sort-orders="['descending','ascending',null]">
        <template slot-scope="scope">
          <level-group
            :value="[
               scope.row.vulNumVO.serious,
               scope.row.vulNumVO.high,
               scope.row.vulNumVO.medium,
               scope.row.vulNumVO.low
               ]" />
        </template>
      </el-table-column>
      <el-table-column
          label="创建时间"
          prop="create_date"
          sortable="custom"
          :sort-orders="['descending','ascending',null]"
          min-width="15%"
          show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column
          label="最后修改时间"
          prop="modify_date"
          sortable="custom"
          :sort-orders="['descending','ascending',null]"
          min-width="15%"
          show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.modifyDate }}
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
import { affectedProjectList } from '@/api/home/public/component/affected'

export default {
  name: 'AffectedProjectList',
  data () {
    return {
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      searchData: {},
      total: 0,
      tableData: []
    }
  },
  props: {
    dicComponentId: {
      default () {
        return null
      }
    }
  },
  methods: {
    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = ['create_date']
        this.searchData.sortTypeList = [1]
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
      this.loading = true
      affectedProjectList({
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        dicComponentId: this.dicComponentId,
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
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    filterLevel (value, row) {
      return row.securityLevel === value
    }
  },
  watch: {
    'dicComponentId' () {
      if (this.dicComponentId) {
        this.search()
      } else {
        this.tableData = []
      }
    }
  },
  mounted () {
    if (this.dicComponentId) {
      this.search()
    }
  }
}
</script>
<style scoped lang="scss">
</style>
