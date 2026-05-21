<template>
  <div class="p-t-15">
    <el-row class="m-b-20">
      <search-area class="right" @search="search" v-model="searchData.searchCondition" placeholder="请输入项目名称" right-float></search-area>
    </el-row>
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
        min-width="10%"
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
        label="应用数"
        min-width="10%"
        prop="component_total"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ row.applicationCount || '-' }}
        </template>
      </el-table-column>
      <el-table-column
          label="组件"
          prop="component_total"
          sortable="custom"
          :sort-orders="['descending','ascending',null]"
          min-width="15%"
          show-overflow-tooltip>
        <template slot-scope="{row}">
          {{get(row, 'componentNumVO.total', '-')}}
        </template>
      </el-table-column>
      <el-table-column
          label="漏洞"
          width="200"
          prop="vul_total"
          sortable="custom"
          :sort-orders="['descending','ascending',null]">
        <template slot-scope="{row}">
          <level-group
            :value="[
               row.vulNumVO.serious,
               row.vulNumVO.high,
               row.vulNumVO.medium,
               row.vulNumVO.low
               ]" />
        </template>
      </el-table-column>
      <el-table-column
        label="许可证"
        min-width="15%"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="license_total"
      >
        <template slot-scope="{row}">
          <level-group disabled :value="[
             null,
             get(row, 'licenseNumVO.highNum', 0),
             get(row, 'licenseNumVO.mediumNum', 0),
             get(row, 'licenseNumVO.lowNum', 0)
             ]" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="10%"
        label="负责人"
        show-overflow-tooltip
      >
        <template #header>
          <oss-table-filter
            :default-props="{label: 'label', value: 'value' }"
            v-model="searchData.userIds"
            :filters="userList"
            @change="search"
            title="负责人"
            multiple
          />
        </template>
        <template slot-scope="{row}">
          {{ row.username }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="15%"
        label="最近更新"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="modify_date"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ row.modifyDate || '--' }}
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
import { VulAffectedProjectList } from '@/api/home/public/component/affected'
import { mapState } from 'vuex'
import list from '@/mixins/list'

export default {
  name: 'AffectedProjectList',
  mixins: [list],
  data () {
    return {
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      dicVulId: this.$route.query.dicVulId,
      searchData: {
        userIds: [],
        searchCondition: null
      },
      total: 0,
      tableData: [],
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
      ]
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo,
      userList: state => state.home.opticalUserList
    })
  },
  mounted () {
    if (this.dicVulId) {
      this.search()
    }
  },
  methods: {

    filterLevel (value, row) {
      return row.securityLevel === value
    },

    // 初始化列表
    initList () {
      this.loading = true
      VulAffectedProjectList({
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        dicVulId: this.dicVulId,
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

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
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
    }
  }
}
</script>
