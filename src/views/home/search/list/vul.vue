<template>
  <div style="margin-top: 20px;">
    <drawer-vul-detail ref="drawerVulDetail"></drawer-vul-detail>
    <dialog-vul-detail ref="dialogVulDetail"></dialog-vul-detail>
    <!-- 暂时隐藏 -->
    <p>
      收录相关漏洞共 {{ statistic.toLocaleString() }} 个
    </p>
    <el-table
      class="w-full cursor-pointer"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      @row-click="detail"
      tooltip-effect="dark">

      <el-table-column
          label="XMIRROR"
          min-width="15%"
          prop="xmirrorId"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="xss(scope.row.xmirrorId)"></span>
        </template>
      </el-table-column>
      <el-table-column
          label="CVE"
          min-width="15%"
          prop="cveId"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="xss(scope.row.cveId)"></span>
        </template>
      </el-table-column>
      <el-table-column
          label="CNNVD"
          min-width="15%"
          prop="cnnvdId"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="xss(scope.row.cnnvdId)"></span>
        </template>
      </el-table-column>
      <el-table-column
          label="CWE"
          min-width="15%"
          prop="cwe"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="xss(scope.row.cweId) || '其他'"></span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="40%"
        label="漏洞名称"
        prop="securityLevel"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          <level-tag :level="row.securityLevel" style="margin-right: 10px;" v-if="row.securityLevel"></level-tag>
          <span v-html="xss(row.name)"></span>
        </template>
      </el-table-column>
      <!-- <el-table-column
          label="漏洞名称"
          min-width="30%"
          prop="name"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="xss(scope.row.name)"></span>
        </template>
      </el-table-column> -->
      <el-table-column
          label="发布时间"
          min-width="10%"
          prop="releaseDate"
          show-overflow-tooltip>
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
import { vulList } from '@/api/home/search'
import DialogVulDetail from '../details/component/dialogVulDetail.vue'
import DrawerVulDetail from '@/views/home/public/DrawerVulDetail/index.vue'
import xss from 'xss'
export default {
  name: 'SearchVul',
  props: ['statistic'],
  components: {
    DialogVulDetail,
    DrawerVulDetail
  },
  data () {
    return {
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      loading: false,
      searchText: '',
      total: 0,
      tableData: []
    }
  },
  methods: {
    // 详情
    detail (row) {
      this.$refs.drawerVulDetail.id = row.id
      this.$refs.drawerVulDetail.drawer = true
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
      vulList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        searchCondition: this.searchText,
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
