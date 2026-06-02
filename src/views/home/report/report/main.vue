<template>
  <div>
    <el-row :gutter="20" :type="'flex'">
      <el-col :span="12">
        <div class="common-bg">
          <div class="common-header">
            报告类型统计
          </div>
          <annulus-pie-chart
            :height="300"
            :center-label="'报告数'"
            :chart-data="reportTypeData"
            :loading="reportTypeLoading"
          ></annulus-pie-chart>
        </div>
      </el-col>
      <el-col :span="12" class="auto-height">
        <div class="common-bg">
          <div class="common-header">
            新增报告数
          </div>
          <div class="report-num">
            <h3>{{ reportTodayNum }}</h3>
            <p>今日生成报告数</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="view-content">
      <sticky
        :sticky-top="65"
        :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
      >
        <div class="clearfix">
          <!--          <el-button size="medium" type="primary" v-if="authorityFilter(1203)" @click="tplConf">模板配置</el-button>-->
          <el-button
            size="medium"
            type="primary"
            v-if="authorityFilter(1202)"
            @click="del()"
          >删除
          </el-button>
          <el-row class="right">
            <el-select-v2-project placeholder="请选择所属项目" class="m-r-10" @change="search" multiple collapse-tags  v-model="searchData.projectIds" size="medium" />
            <search-area
              placeholder="请输入报告名称"
              @search="search"
              v-model="name"
              right-float
            >
              <search-date
                v-model="searchDate"
                style="margin-right: 95px;"
              ></search-date>
            </search-area>
          </el-row>
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
        :default-sort = "{prop: 'modify_date', order: 'descending'}"
      >
        <template slot="bar">
          <el-button
            size="medium"
            type="primary"
            v-if="authorityFilter(1202)"
            @click="del()"
          >删除
          </el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"></el-table-column>
        <el-table-column
          label="报告名称"
          min-width="20%"
          prop="name"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="所属项目"
          min-width="10%"
          show-overflow-tooltip>
          <template v-slot="{ row }">
            {{ row.projectName }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="10%"
          label="报告类型"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.type"
              :filters="typeOptions"
              @change="search"
              title="报告类型"
            />
          </template>
          <template slot-scope="scope">
            {{ matching(typeOptions, scope.row.type, 'value', 'text', '-') }}
          </template>
        </el-table-column>
        <el-table-column
          label="报告来源"
          min-width="10%"
          prop="detectEngineId"
          :column-key="'detectEngineId'"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            {{ matching(engineOptions, row.detectEngineId, 'value', 'text', '--') }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="10%"
          label="报告维度"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.dimension"
              :filters="dimensionalityOptions"
              @change="search"
              title="报告维度"
            />
          </template>
          <template slot-scope="scope">
            {{ matching(dimensionalityOptions, scope.row.dimension, 'value', 'text', '--') }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="10%"
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.status"
              :filters="statusOptions"
              @change="search"
              title="状态"
            />
          </template>
          <template slot-scope="scope">
            <span
              v-if="[1,2].includes(scope.row.status)"
              :class="matching(statusOptions, scope.row.status, 'value', 'class')"
            >
              {{ matching(statusOptions, scope.row.status, 'value', 'text') }}
            </span>
            <el-tooltip
              v-else
              :content="
                matching(statusOptions, scope.row.status, 'value', 'text')
              "
              effect="dark"
              placement="top"
            >
              <oss-progress
                :percentage="
                    matching(
                      statusOptions,
                      scope.row.status,
                      'value',
                      'progress'
                    )
                  "
              ></oss-progress>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="生成人"
          min-width="10%"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{get(row, 'generateUserName', '--')}}
          </template>
        </el-table-column>
        <el-table-column
          label="生成时间"
          min-width="15%"
          prop="modify_date"
          sortable="custom"
          :sort-orders="['descending','ascending',null]"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.modifyDate }}</template>
        </el-table-column>
        <el-table-column
          label="报告校验"
          min-width="10%"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <el-link type="primary" :disabled="!row.md5" @click="checkTheCheckCode(row)" :underline="false">查看校验码</el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <icon-button
              v-if="authorityFilter(1204)"
              :disabled="!(scope.row.status === 1)"
              tooltip-content="下载"
              class="iconxiazai"
              @click="download(scope.row)"
            ></icon-button>
            <icon-button
              v-if="authorityFilter(1202)"
              tooltip-content="删除"
              class="icondel"
              @click="del(scope.row)"
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
  </div>
</template>
<script>
import AnnulusPieChart from '@/components/chart/AnnulusPieChart.vue'
import SearchDate from '@/components/public/SearchArea/Datebox/index.vue'
import { PAGE_CONF } from '@/utils/conf'
import {
  reportList,
  reportTodayNum,
  reportTypeChart,
  downloadReport,
  delReport
} from '@/api/home/report'
import { copyText, downloadBlobFile } from '@/utils'
import { mapState } from 'vuex'
import ElSelectV2Project from '@/views/home/project/conf/ElSelectV2Project.vue'

export default {
  name: 'report-list',
  components: {
    ElSelectV2Project,
    AnnulusPieChart,
    SearchDate
  },
  data () {
    return {
      project: this.$store.state.home.project || {},
      searchLevel: [],
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
      dimensionalityOptions: [
        {
          value: 1,
          text: '项目维度'
        },
        {
          value: 0,
          text: '应用维度'
        }
      ],
      typeOptions: [
        {
          value: 1,
          text: 'Word'
        },
        {
          value: 2,
          text: 'PDF'
        },
        {
          value: 3,
          text: 'Html'
        },
        {
          value: 4,
          text: 'Json'
        },
        {
          value: 5,
          text: 'Excel'
        }
      ],
      engineOptions: [
        {
          text: '项目管理',
          value: -1
        },
        {
          value: 1,
          text: '应用包审查'
        },
        {
          value: 2,
          text: '节点审查'
        },
        {
          value: 3,
          text: 'git代码库审查'
        },
        {
          value: 4,
          text: '私服库安全扫描'
        },
        {
          value: 5,
          text: 'ide插件审查'
        },
        {
          value: 6,
          text: 'svn代码库审查'
        },
        {
          value: 7,
          text: '容器镜像包审查'
        },
        {
          value: 8,
          text: '二进制成分分析'
        },
        {
          value: 9,
          text: '组件风险管理'
        },
        {
          value: 10,
          text: '漏洞风险管理'
        },
        {
          value: 11,
          text: '集成部署'
        },
        {
          value: 12,
          text: 'firefly代码库审查'
        },
        {
          value: 13,
          text: '私有仓库阻断'
        },
        {
          value: 14,
          text: 'SBOM风险扫描'
        },
        {
          value: 15,
          text: '镜像安全扫描'
        },
        {
          value: 16,
          text: '代码溯源分析'
        }
      ],
      statusOptions: [
        {
          value: -1,
          text: '排队中',
          progress: 20,
          class: 'text-primary'
        },
        {
          value: 0,
          text: '生成中',
          progress: 70,
          class: 'text-primary'
        },
        {
          value: 1,
          text: '已生成',
          progress: 100,
          class: 'text-success'
        },
        {
          value: 2,
          text: '出错结束',
          class: 'text-severity'
        }
      ],
      name: '',
      searchDate: [],
      currentPage: 1,
      loading: false,
      reportTypeLoading: false,
      reportTodayNumLoading: false,
      pageSize: PAGE_CONF.pageSize,
      timeout: null,
      total: 0,
      tableData: [],
      searchData: {
        projectIds: [],
        sortFieldList: ['modify_date'],
        sortTypeList: [1]
      },
      multipleSelection: [],
      reportTodayNum: 0,
      reportTypeData: {
        data: [
          {
            value: 0,
            name: 'PDF',
            color: '#8B1A1A',
            key: 'pdfCount'
          },
          {
            value: 0,
            name: 'Word',
            color: '#D9534F',
            key: 'wordCount'
          },
          {
            value: 0,
            name: 'HTML',
            color: '#D4932A',
            key: 'htmlCount'
          },
          {
            value: 0,
            name: 'Excel',
            color: '#1a78cf',
            key: 'excelCount'
          },
          {
            value: 0,
            name: 'JSON',
            color: '#4A9C8C',
            key: 'jsonCount'
          }
        ],
        sum: 0
      }
    }
  },
  computed: {
    ...mapState({
      projectList: state => state.home.projectList
    })
  },
  methods: {
    // 查看校验码
    checkTheCheckCode (row) {
      this.$popup({
        title: '报告校验',
        showConfirmButton: false,
        cancelButtonText: '复制并关闭',
        width: '600px',
        render (h) {
          return h('div', {}, [
            h('el-alert', {
              class: 'header-alert',
              props: {
                closable: false,
                type: 'primary'
              }
            }, [h('div', { class: 'alert-content' }, [h('i', { class: 'el-icon-info m-r-5' }), '生成报告的文件MD5值，用于报告的完整性校验。'])]),
            h('div', { class: 'font-md', style: { paddingLeft: '85px' } }, [`MD5值：${row.md5}`])
          ])
        },
        beforeClose: (action, cd) => {
          action === 'cancel' && copyText(row.md5)
          cd()
        }
      })
    },

    // 模板配置
    tplConf () {
      this.$router.push({
        path: '/report/config'
      })
    },

    // 下载
    async download (row) {
      try {
        const response = await downloadReport({
          projectId: this.project.id,
          id: row.id
        })
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    // 删除
    del (row) {
      let ids = this.multipleSelection.map(x => x.id)
      if (row && row.id) {
        ids = [row.id]
      }
      this.$confirm(ids.length ? '确定要删除所选报告吗？删除后不可恢复！' : '确定要删除所有报告吗？删除后不可恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delReport(ids.length ? {
            idList: ids
          } : {})
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$refs.multipleTable.clearSelection()
              this.initReportTypeChart()
              this.initReportNum()
              this.initList()
            })
            .catch(error => {
              if (typeof error === 'object') {
                this.$message.error(error.message)
              }
            })
        })
        .catch(() => {
        })
    },

    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = ['modify_date']
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
      this.$refs.multipleTable.clearSelection()
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList (auto) {
      if (!this.authorityFilter(1201)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      if (auto !== 'auto') {
        this.loading = true
      } else if (this.multipleSelection.length > 0) {
        if (this.timeout !== null) {
          clearTimeout(this.timeout)
          this.timeout = null
        }
        this.timeout = setTimeout(this.initList, 10000, 'auto')
        return
      }
      const params = {
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        name: this.name,
        startDate: this.searchDate ? this.searchDate[0] : null,
        endDate: this.searchDate ? this.searchDate[1] : null,
        loading: false
      }
      reportList(params)
        .then(response => {
          this.loading = false
          this.tableData = []
          const data = response.data
          data.records.forEach(item => {
            this.tableData.push(item)
          })
          this.total = data.total
          if (
            this.total > 0 &&
            data.records.length === 0 &&
            this.currentPage > 1
          ) {
            this.currentPage = this.currentPage - 1
            this.initList()
          }
          if (this.timeout !== null) {
            clearTimeout(this.timeout)
            this.timeout = null
          }
          this.timeout = setTimeout(this.initList, 10000, 'auto')
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

    // 初始化报告类型图
    initReportTypeChart () {
      this.reportTypeData.data.forEach(item => {
        item.value = 0
      })
      this.reportTypeData.sum = 0
      this.reportTypeLoading = true
      reportTypeChart({
        projectIds: [],
        loading: false
      })
        .then(response => {
          this.reportTypeLoading = false
          const data = response.data
          this.reportTypeData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.reportTypeData.sum = data.total
        })
        .catch(error => {
          this.reportTypeLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化组件风险等级对应数量饼状图
    initReportNum () {
      this.reportTodayNum = 0
      this.reportTodayNumLoading = true
      reportTodayNum({
        projectIds: [],
        loading: false
      })
        .then(response => {
          this.reportTodayNumLoading = false
          this.reportTodayNum = response.data
        })
        .catch(error => {
          this.reportTodayNumLoading = true
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
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
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  },
  mounted () {
    this.search()
    this.initReportTypeChart()
    this.initReportNum()
  }
}
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;
  margin-top: 20px;
}

.report-num {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  height: 126px;

  h3 {
    font-size: 46px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 158px;
    box-sizing: border-box;
    font-weight: 500;
    height: 158px;
    border-radius: 50%;
    border: 15px solid #2C5F8A;
    margin: 0 auto;
  }

  p {
    color: #999;
    font-size: 16px;
  }
}

.auto-height {
  display: flex;
  align-items: stretch;

  .common-bg {
    width: 100%;
  }
}
</style>
