<template>
  <div style="margin-top: 20px;">
    <p>
      收录开源许可证共 {{ statistic.toLocaleString() }} 个
    </p>
    <el-table
      class="w-full cursor-pointer"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      @row-click="detail"
      tooltip-effect="dark">

      <el-table-column
          label="许可证名称"
          min-width="15%"
          prop="shortName"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="xss(scope.row.shortName || '-')"></span>
        </template>
      </el-table-column>
      <el-table-column
          label="许可证全名"
          min-width="15%"
          prop="longName"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="xss(scope.row.longName || '-')"></span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="12%"
        label="风险等级"
        show-overflow-tooltip
      >
<!--        <template #header>-->
<!--          <oss-table-filter-->
<!--            :default-props="{label: 'text', value: 'value' }"-->
<!--            v-model="searchData.securityLevel"-->
<!--            :filters="levelOptions"-->
<!--            @change="search"-->
<!--            title="风险等级"-->
<!--          />-->
<!--        </template>-->
        <template slot-scope="scope">
            <span class="level-tag danger" v-if="scope.row.securityLevel === 1"
            >高风险</span
            >
          <span
            class="level-tag warning"
            v-else-if="scope.row.securityLevel === 2"
          >中风险</span
          >
          <span
            class="level-tag info"
            v-else-if="scope.row.securityLevel === 3"
          >低风险</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="是否兼容GPL"
        min-width="12%"
        prop="gplCompatible"
        show-overflow-tooltip
      >
<!--        <template #header>-->
<!--          <oss-table-filter-->
<!--            :default-props="{label: 'text', value: 'value' }"-->
<!--            v-model="searchData.gplCompatible"-->
<!--            :filters="compatibleList"-->
<!--            @change="search"-->
<!--            title="是否兼容GPL"-->
<!--          />-->
<!--        </template>-->
        <template slot-scope="scope">
          {{ scope.row.gplCompatible === 1 ? "兼容" : "不兼容" }}
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
import { licenseList } from '@/api/home/search'
import xss from 'xss'
export default {
  name: 'SearchLicense',
  props: ['statistic'],
  data () {
    return {
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      loading: false,
      searchText: '',
      total: 0,
      tableData: [],
      searchData: {
        securityLevels: undefined,
        gplCompatible: undefined
      },
      compatibleList: [
        {
          text: '兼容',
          value: 1
        },
        {
          text: '不兼容',
          value: 0
        }
      ],
      levelOptions: [
        {
          value: 1,
          text: '高风险'
        },
        {
          value: 2,
          text: '中风险'
        },
        {
          value: 3,
          text: '低风险'
        }
      ]
    }
  },
  methods: {
    // 详情
    detail (row) {
      this.$router.push({
        path: '/search/license/details',
        query: {
          id: row.dicLicenseId
        }
      })
    },
    xss: xss,

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      this.loading = true
      licenseList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        searchCondition: this.searchText,
        ...this.searchData,
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
    }
  },
  beforeDestroy () {},
  mounted () {}
}
</script>
