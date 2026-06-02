<template>
  <div>
    <ComponentDependencyPathDialog
      :xhr="componentDependencyList"
      ref="componentDependencyPathDialog">
    </ComponentDependencyPathDialog>
<!--    <el-row :gutter="20" class="wrap" v-if="visibleChart">-->
<!--      <floating-button :right="0" :top="-10" v-model="visibleChart"></floating-button>-->
<!--      <el-col :span="8">-->
<!--        <div class="common-bg">-->
<!--          <div class="common-header">-->
<!--            组件等级统计-->
<!--          </div>-->
<!--          <annulus-pie-chart-->
<!--            :height="220"-->
<!--            :center-label="'组件总数'"-->
<!--            :chart-data="componentChartData"-->
<!--            :loading="componentChartLoading"-->
<!--          ></annulus-pie-chart>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :span="16">-->
<!--        <div class="common-bg" style="padding-top: 20px">-->
<!--          <div class="common-header">-->
<!--            风险组件TOP10-->
<!--          </div>-->
<!--          <row-bar-chart-->
<!--            :row="2"-->
<!--            :height="200"-->
<!--            :chart-data="seriousTop"-->
<!--            @click="componentDetail"-->
<!--            :loading="seriousTopLoading"-->
<!--          ></row-bar-chart>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <div class="view-content" :style="{marginTop: visibleChart ? '20px' : 0}">
<!--      <div style="position: relative">-->
<!--        <floating-button v-if="!visibleChart" :right="-30" :top="-30" v-model="visibleChart"></floating-button>-->
<!--      </div>-->
      <ModuleQueryBox ref="query" is-module v-model="searchData" @change="search"></ModuleQueryBox>
      <sticky
        :sticky-top="65"
        :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
      >
        <div class="clearfix">
          <el-button
            size="medium"
            type="primary"
            :disabled="!(isQuery() ? tableData.length > 0 : true)"
            v-if="authorityFilter(402)"
            @click="exportFile"
          >导出
          </el-button>
          <div class="right p-t-15">
            <el-checkbox @change="$refs.query.filter()" v-model="searchData.filterNonBaseline">不符合基线版本组件</el-checkbox>
          </div>
        </div>
      </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        v-loading="loading"
        row-key="dicComponentId"
        tooltip-effect="dark"
        @filter-change="searchFilter"
        @sort-change="searchSort"
        @selection-change="handleSelectionChange"
      >
        <template slot="bar">
          <el-button
            size="medium"
            type="primary"
            :disabled="!(isQuery() ? tableData.length > 0 : true)"
            v-if="authorityFilter(402)"
            @click="exportFile()">导出
          </el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"></el-table-column>
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
          <template slot-scope="{row}">
            <el-link
              :underline="false"
              v-if="authorityFilter(401)"
              type="primary"
              @click="detail(row)"
            >
              {{get(row, 'name', '-')}}
            </el-link>
            <template v-else>
              {{get(row, 'name', '-')}}
            </template>
          </template>
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
        >
          <template v-slot:header>
            <oss-table-sort
              prop="vul_num"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              漏洞
            </oss-table-sort>
          </template>

          <template slot-scope="{row}">
            <level-group @click="detail(row, $event)" :value="[
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
        <el-table-column label="操作" fixed="right" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
<!--            <el-dropdown-->
<!--              trigger="click"-->
<!--              @command="mark($event, scope.row)"-->
<!--              v-if="authorityFilter(404)"-->
<!--            >-->
<!--              <icon-button-->
<!--                tooltip-content="标记为"-->
<!--                class="iconbiaoji2"-->
<!--              ></icon-button>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item :command="3">黑名单</el-dropdown-item>-->
<!--                <el-dropdown-item :command="4">白名单</el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
            <ModifyRiskLevelButton
              style="margin-left: 0"
              :row="scope.row"
              :name="scope.row.name"
              :version="scope.row.version"
              :vendor="scope.row.vendor"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer-wrapper clearfix">
        <pagination
          v-if="searchCount"
          @size-change="initList"
          @current-change="initList"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :total="total"
          class="right"
        ></pagination>
        <el-button-group v-else class="right">
          <el-button class="pagination-btn" :disabled="currentPage === 1" size="small" plain @click="handlePagination('prev')">上一页</el-button>
          <el-button class="pagination-btn" :disabled="currentPage === 1" size="small"  plain @click="handlePagination('home')">首页</el-button>
          <el-button class="pagination-btn" :disabled="tableData.length < 10" size="small" plain @click="handlePagination('next')">下一页</el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>
<script>
// import RowBarChart from '@/components/chart/RowBarChart.vue'
// import AnnulusPieChart from '@/components/chart/AnnulusPieChart.vue'
import { PAGE_CONF } from '@/utils/conf'
import {
  riskComponentList,
  componentManagementExcel,
  componentLevelNumChart,
  seriousTopChart,
  componentDependencyList,
  changeStatusBatch
} from '@/api/home/assets/module'
import Sticky from '@/components/public/Sticky/index.vue'
import { hasOwn, sessionStore, awaitTo as to, isObject, get } from '@/utils'
import MixinsList from '@/mixins/list'
import { mapState } from 'vuex'
// import FloatingButton from '@/components/public/FloatingButton'
import ComponentDependencyPathDialog from '@/views/home/assets/module/ComponentDependencyPathDialog'
import ModuleQueryBox from '@/views/home/assets/module/ModuleQueryBox'
import ModifyRiskLevelButton from '@/views/home/public/modules/ModifyRiskLevelComponent.vue'
export default {
  name: 'AssetsModule',
  components: {
    ModifyRiskLevelButton,
    ModuleQueryBox,
    ComponentDependencyPathDialog,
    // FloatingButton,
    // AnnulusPieChart,
    // RowBarChart,
    Sticky
  },
  mixins: [MixinsList],
  data () {
    return {
      project: this.$store.state.home.project,
      visibleChart: false,
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
      statusOptions: [
        {
          value: 1,
          text: '未标记'
        },
        {
          value: 3,
          text: '黑名单'
        },
        {
          value: 4,
          text: '白名单'
        }
      ],
      name: '',
      currentPage: 1,
      loading: false,
      componentChartLoading: false,
      seriousTopLoading: false,
      pageSize: PAGE_CONF.pageSize,
      searchData: {
        filterNonBaseline: false,
        sortFieldList: [],
        sortTypeList: []
      },
      total: 0,
      tableData: [],
      multipleSelection: [],
      seriousTop: [],
      componentChartData: {
        data: [
          {
            value: 0,
            name: '严重',
            color: '#8B1A1A',
            key: 'seriousCount'
          },
          {
            value: 0,
            name: '高危',
            color: '#D9534F',
            key: 'highCount'
          },
          {
            value: 0,
            name: '中危',
            color: '#D4932A',
            key: 'mediumCount'
          },
          {
            value: 0,
            name: '低危',
            color: '#1a78cf',
            key: 'lowCount'
          },
          {
            value: 0,
            name: '无漏洞',
            color: '#4A9C8C',
            key: 'normalCount'
          }
        ],
        sum: 0
      },
      searchCount: true
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
  watch: {
    visibleChart (v) {
      sessionStore.get('visibleModuleChart', v)
    }
  },
  // mounted () {
  //   this.initComponentLevelNumChart()
  //   this.initSeriousTopChart()
  // },
  methods: {
    isQuery () {
      return this.searchData.filterNonBaseline ||
        this.searchData.projectIds?.length ||
        this.searchDate?.languages ||
        this.searchDate?.dependent ||
        this.searchDate?.vendor ||
        this.searchData?.name ||
        this.searchData?.version
    },
    async mark (status, row) {
      const [error] = await to(changeStatusBatch({
        dicComponentId: row.dicComponentId,
        projectIdList: row.projectIds,
        status
      }))
      if (isObject(error)) return this.$message.error(error.message)
      this.$message({
        type: 'success',
        message: '操作成功！'
      })
      this.initList()
    },
    componentDependencyList,
    openDependencyDialog (row) {
      const app = this.$refs.componentDependencyPathDialog
      app.searchData.dicComponentId = row.dicComponentId
      app.searchData.projectIds = row.projectIds
      app.open()
    },

    // top5 图表跳转详情
    componentDetail (val) {
      const row = this.seriousTop[val.dataIndex]
      this.$router.push({
        path: '/assets/module/details',
        query: {
          dic: row.dicComponentId,
          // asset: row.assetComponentId,
          project: row.projectId,
          version: row.version
        }
      })
    },

    // 详情
    detail (row, e = 10) {
      if (!this.authorityFilter(401)) return
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
    // 导出文件
    exportFile () {
      const all = this.multipleSelection.length <= 0
      this.$popup({
        title: all ? '导出全部' : '导出',
        width: '550px',
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        center: false,
        content: `<div style="padding: 20px"> ${all ? this.isQuery() ? '导出搜索结果数据，是否继续导出？' : '导出所有数据，是否继续导出？'
          : '导出所选数据，是否继续导出？'} </div>`,
        beforeClose: async (action, next) => {
          if (action === 'confirm') {
            const [error, response] = await to(componentManagementExcel(all ? this.isQuery() ? this.searchData : {} : {
              pdceiidList:
              this.multipleSelection.map(item => item.pdceiid),
              dicComponentIdList: this.multipleSelection.map(item => item.dicComponentId)
            }))
            if (isObject(error)) {
              this.$message.error(error.message)
            } else {
              setTimeout(() => this.$popup({
                title: '提示',
                width: '550px',
                confirmButtonText: '去下载',
                cancelButtonText: '留在本页',
                center: false,
                render (h) {
                  return h('el-row', {
                    class: 'font-base',
                    style: { padding: '20px' }
                  }, [
                    h('div', { class: 'm-b-15' }, ['操作成功，请在报告管理中下载报告~']),
                    h('div', {}, ['报告名称：', get(response, 'data.reportName', '--')])
                  ])
                },
                beforeClose: (action, next) => {
                  if (action === 'confirm') {
                    this.$router.push({ path: '/report/list' })
                  }
                  next()
                }
              }), 200)
            }
          }
          next()
        }
      })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 初始化组件风险等级对应数量饼状图
    initComponentLevelNumChart () {
      if (!this.authorityFilter(401)) {
        return 0
      }
      this.componentChartData.data.forEach(item => {
        item.value = 0
      })
      this.componentChartLoading = true
      this.componentChartData.sum = 0
      componentLevelNumChart({
        projectId: [-1],
        loading: false
      })
        .then(response => {
          this.componentChartLoading = false
          const data = response.data
          this.componentChartData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.componentChartData.sum = data.totalCount
        })
        .catch(error => {
          this.componentChartLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化列表
    initList () {
      if (!this.authorityFilter(401)) {
        return 0
      }

      /**
       * 保存搜索条件
       * **/
      this.saveSearchRecord({
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })

      this.loading = true

      riskComponentList({
        ...this.searchData,
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
          this.searchCount = data.searchCount
        })
        .catch(error => {
          this.tableData = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化风险组件TOP10条形图
    initSeriousTopChart () {
      if (!this.authorityFilter(401)) {
        return 0
      }
      this.seriousTop = []
      this.seriousTopLoading = true
      seriousTopChart({
        projectId: [-1],
        loading: false
      })
        .then(response => {
          this.seriousTopLoading = false
          const data = response.data
          data.forEach(item => {
            this.seriousTop.push({
              name: `${item.componentName}${item.version}`,
              value: item.totalCount,
              dicComponentId: item.dicComponentId,
              projectId: item.projectId,
              version: item.version
            })
          })
        })
        .catch(error => {
          this.seriousTopLoading = true
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 搜索
    search () {
      this.$refs.multipleTable.clearSelection()
      this.currentPage = 1
      this.initList()
    },

    handlePagination (type) {
      switch (type) {
        case 'prev':
          this.currentPage = this.currentPage - 1
          this.initList()
          break
        case 'home':
          this.currentPage = 1
          this.initList()
          break
        case 'next':
          this.currentPage = this.currentPage + 1
          this.initList()
          break
      }
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
        this.searchData.sortFieldList = []
        this.searchData.sortTypeList = []
      }
      this.search()
    },

    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    }
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

  .content-top {
    background: #f7fafb;
    border: 1px solid #f3f3f4;
    margin-bottom: 4.5%;

    .info-row {
      border: 0;

      .info-item {
        .content {
          margin-left: 0 !important;
          width: 100%;
        }
      }

      .info-panel-item {
        display: flex;
        align-items: center;
      }
    }
  }
}
.pagination-btn {
  color: $color-primary;
}
.pagination-btn.is-disabled{
  color: #DCDEE0 !important;
  border-color: #DCDEE0 !important;
}
</style>
