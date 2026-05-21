<template>
  <div>
    <DrawerVersionDetail ref="drawerVersionDetail"></DrawerVersionDetail>
    <dialog-generate-report ref="report"></dialog-generate-report>
    <h3 class="headline"><i class="iconfont iconbanben1"></i>版本列表</h3>
    <el-row class="clearfix search-box">
      <el-button
        class="w-80"
        size="medium"
        :disabled="multipleSelection.length <= 0"
        type="primary"
        @click="exportFile"
      >
        导 出
      </el-button>
      <search-area
        placeholder="请输入版本号"
        @search="search"
        v-model="version"
        right-float
      ></search-area>
    </el-row>
    <el-table
      @filter-change="filterLevel"
      class="w-full"
      :data="tableData"
      v-loading="loading"
      @selection-change="multipleSelection = $event"
      @sort-change="sortChange"
      tooltip-effect="dark"
      row-key="id"
      :default-sort="{prop: 'update_time', order: 'descending'}"
    >

      <el-table-column type="selection" reserve-selection width="55"> </el-table-column>
      <el-table-column label="版本号" min-width="18%" show-overflow-tooltip>
        <template v-slot="{ row }">
          <span class="text-primary" @click="detail(row)">{{
            row.version
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        label="发布日期"
        min-width="15%"
        prop="update_time"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{get(scope.row, 'updateTime')}}
        </template>
      </el-table-column>
      <el-table-column
        label="风险等级"
        min-width="10%"
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
        width="200"
        prop="vul_num"
      >
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
        label="许可证名"
        min-width="15%"
        prop="licenseName"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        min-width="15%"
        prop="recommendNum"
        show-overflow-tooltip
      >
        <template slot="header">
          <el-tooltip class="item" placement="top">
            <div style="width: 300px; line-height: 18px;" slot="content">
              根据组件内漏洞的可利用性，漏洞及许可证的风险等级综合分析后得出
            </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
          推荐指数
        </template>
        <template slot-scope="{ row }">
          <!--          :icon-classes="['iconfont iconzan', 'iconfont iconzan', 'iconfont iconzan']"-->
          <!--          :disabled-void-icon-class="'iconfont iconzan'"-->
          <el-rate
            v-model="row.recommendNum"
            disabled
            text-color="#faad14"
          ></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <icon-button
            tooltip-content="报告"
            @click="generateReportHandler(row)"
            class="iconshengchengbaogao"
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
import { exportWord, versionList } from '@/api/home/search'
import DrawerVersionDetail from './DrawerVersionDetail/index.vue'
import DialogGenerateReport from '@/views/home/search/details/component/dialogGenerateReport.vue'
import { downloadBlobFile, hasOwn } from '@/utils'
import { levelOptions } from '@/store/constant'

export default {
  name: 'VersionList',
  components: {
    DialogGenerateReport,
    DrawerVersionDetail
  },
  props: {
    id: {
      required: true
    },
    packageManager: {
      required: true
    }
  },
  data () {
    return {
      cid: this.id,
      cPackageManager: this.packageManager,
      multipleSelection: [],
      levelSelect: [
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
      levelOptions,
      tableData: [],
      version: '',
      searchData: {
        sortFieldList: ['update_time'],
        sortTypeList: [1]
      },
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      loading: false
    }
  },
  methods: {
    // 生成报告
    generateReportHandler (row) {
      this.$refs.report.dialogVisible = true
      this.$refs.report.row = {
        ...row,
        packageManager: this.cPackageManager
      }
    },
    // 导出
    async exportFile () {
      try {
        const result = await exportWord({
          ids: this.multipleSelection.map(item => item.id).join(','),
          packageManager: this.cPackageManager
        })
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    // 发布日期的排序
    sortChange (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [
          sort.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
        ]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = []
        this.searchData.sortTypeList = []
      }
      this.search()
    },
    filterLevel (filers) {
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
    // 详情
    detail (row) {
      this.$refs.drawerVersionDetail.id = row.id
      this.$refs.drawerVersionDetail.version = row.version
      this.$refs.drawerVersionDetail.packageManager = this.cPackageManager
      this.$refs.drawerVersionDetail.drawer = true
    },

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      this.loading = true
      versionList({
        ...this.searchData,
        id: this.cid,
        version: this.version,
        packageManager: this.cPackageManager,
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
    }
  },
  mounted () {
    // ESLint: Unexpected mutation of "id" prop.(vue/no-mutating-props)
    if (this.$route.query.id) {
      this.cid = this.$route.query.id
      this.cPackageManager = this.$route.query.type
      this.initList()
    }
  }
}
</script>
<style scoped lang="scss">
.search-box {
  margin-bottom: 15px;

  .iconfont {
    font-size: 12px;
  }
}

.headline {
  border: 0;
  padding: 0;

  //display: inline-block;

  i.iconfont {
    vertical-align: middle;
    font-size: 20px;
    color: #8B5CF6;
    margin-right: 10px;
  }
}

:deep(tbody tr) {
  cursor: pointer;
}
</style>
