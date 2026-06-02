<template>
  <div>
    <dialog-vul-detail ref="dialogVulDetail" />
    <CustomizeVulRemarkDialog ref="CustomizeVulRemarkDialog" />
<!--    <el-row :gutter="20" class="wrap" v-if="visibleChart">-->
<!--      <floating-button :right="0" :top="-10" v-model="visibleChart"></floating-button>-->
<!--      <el-col :span="8">-->
<!--        <div class="common-bg">-->
<!--          <div class="common-header">-->
<!--            漏洞等级统计-->
<!--          </div>-->
<!--          <annulus-pie-chart-->
<!--            :height="220"-->
<!--            :center-label="'漏洞总数'"-->
<!--            :chart-data="vulLevelData"-->
<!--            :loading="vulLevelLoading"-->
<!--          ></annulus-pie-chart>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :span="16">-->
<!--        <div class="common-bg" style="padding-top: 20px">-->
<!--          <div class="common-header">-->
<!--            漏洞类型TOP10-->
<!--          </div>-->
<!--          <row-bar-chart-->
<!--            :row="2"-->
<!--            :height="200"-->
<!--            :chart-data="vulTypeData"-->
<!--            :loading="vulTypeLoading"-->
<!--          ></row-bar-chart>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <div class="view-content" :style="{marginTop: visibleChart ? '20px' : 0}">
<!--      <div style="position: relative"><floating-button v-if="!visibleChart" :right="-30" :top="-30" v-model="visibleChart"></floating-button></div>-->
      <sticky
        :sticky-top="65"
        :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
      >
        <div class="clearfix">
          <el-button
            size="medium"
            type="primary"
            :disabled="!((searchData.projectIds.length > 0 || searchData.filterBlackList === 1 || searchText) ?
            tableData.length > 0 : true)"
            v-if="authorityFilter(1102)"
            @click="exportFile"
          >导出</el-button>
          <el-button
            size="medium"
            type="primary"
            :disabled="!multipleSelection.length"
            v-if="authorityFilter(1104)"
            @click="shareJira(multipleSelection)"
          >分享至jira</el-button>

          <MarkBlackAndWhiteListDropdown
            @change="initList"
            :type="'vul'"
            :dic-component-ids="multipleSelection.map(item => item.dicVulId)"
            :project-id-list="[]"
          >
            <el-button :disabled="!multipleSelection.length" size="medium" type="primary">
              一键标记 <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          </MarkBlackAndWhiteListDropdown>
          <el-row class="info-section compound-search-box--btn">
            <el-col :span="24">
              <el-select
                v-model="searchData.markStatus"
                placeholder="请选择标记状态"
                clearable
                style="width: 200px;margin-right: 10px;"
                @change="search"
                size="medium"
              >
                <el-option
                  v-for="(item) in markStatusOptions"
                  :key="item.value"
                  :label='item.label'
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select-v2-project placeholder="请选择所属项目" style="width: 200px;" @change="search" multiple
                                    collapse-tags  class="m-r-10" v-model="searchData.projectIds" size="medium"></el-select-v2-project>
              <pagination-select
                style="width: 200px; display: inline-block;"
                class="m-r-10 "
                v-model="searchData.taskIds"
                size="medium"
                :projectIds="searchData.projectIds"
                @change="search"
              />
<!--              <el-checkbox style="line-height: 34px;" class="right" :true-label="1" :false-label="0" @change="search" v-model="searchData.filterBlackList">黑名单漏洞</el-checkbox>-->
              <search-select
                @change="[searchText && search()]"
                class="customize-select"
                v-model="searchSelect"
                :select-options="searchSelectOptions"
              ></search-select>
              <search-area class="m-r-10 right customize-input" @search="search" v-model="searchText" right-float></search-area>
            </el-col>
          </el-row>
        </div>
      </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        row-key="dicVulId"
        @filter-change="searchFilter"
        @sort-change="searchSort"
        @selection-change="handleSelectionChange"
        :default-sort="defaultSort"
      >
        <template slot="bar">
          <el-button
            size="medium"
            type="primary"
            :disabled="!((searchData.projectIds.length > 0 || searchData.filterBlackList === 1 || searchText) ?
            tableData.length > 0 : true)"
            v-if="authorityFilter(1102)"
            @click="exportFile()"
          >导出</el-button>
          <el-button
            size="medium"
            type="primary"
            :disabled="!multipleSelection.length"
            v-if="authorityFilter(1104)"
            @click="shareJira(multipleSelection)"
          >分享至jira</el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"> </el-table-column>
        <el-table-column
          min-width="100"
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
          label="XMIRROR"
          min-width="120"
          prop="xmirrorId"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="CVE"
          min-width="120"
          prop="cveId"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="CNNVD"
          min-width="100"
          prop="cnnvdId"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="CNVD"
          min-width="100"
          prop="cnvdId"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{ get(row,'cnvdId', '--' )}}
          </template>
        </el-table-column>
        <el-table-column
          label="CWE"
          min-width="100"
          prop="cweId"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="利用难度"
          min-width="100"
          :class-name="'cursor-pointer'"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              v-model="searchData.exploitLevelId"
              :filters="utilizeDifficultyOptions"
              @change="search"
              title="利用难度"
            />
          </template>
          <template v-slot="{ row }">
            {{row.exploitLevel === 0 ? '困难' : row.exploitLevel === 1 ? '容易' : '-'}}
          </template>
        </el-table-column>
        <el-table-column
          label="漏洞名称"
          min-width="150"
          prop="vulName"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="漏洞类型"
          min-width="100"
          prop="vulType"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="发布时间"
          sortable="custom"
          :sort-orders="['descending','ascending',null]"
          width="120"
          prop="release_date"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">{{ get(row, 'releaseDate', '-') }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <icon-button
              v-if="authorityFilter(1101)"
              tooltip-content="详情"
              class="iconxiangqing"
              @click="detail(scope.row)"
            ></icon-button>
            <icon-button
              v-if="authorityFilter(1104)"
              tooltip-content="分享至Jira"
              el-icon="el-icon-share"
              @click="shareJira(scope.row)"
            ></icon-button>
            <icon-button
              v-if="authorityFilter(3713)"
              tooltip-content="编辑"
              class="iconliebiaoneibianji"
              @click.stop="$refs.CustomizeVulRemarkDialog.useDialog(scope.row)"
            />
            <MarkBlackAndWhiteListDropdown
              @change="initList"
              :type="'vul'"
              :dic-component-ids="[scope.row.dicVulId]"
              :project-id-list="[]"
            />
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
import DialogVulDetail from '@/views/home/assets/vul/dialogVulDetail.vue'
// import RowBarChart from '@/components/chart/RowBarChart.vue'
// import AnnulusPieChart from '@/components/chart/AnnulusPieChart.vue'
// import FloatingButton from '@/components/public/FloatingButton'
import {
  vulList,
  vulLevelChart,
  vulTypeNumTop10Chart,
  shareJira, vulListExcel
} from '@/api/home/assets/vul'
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky/index.vue'
import { mapState } from 'vuex'
import { hasOwn, isObject, awaitTo as to, get } from '@/utils'
import MixinsList from '@/mixins/list.js'
import ElSelectV2Project from '@/views/home/project/conf/ElSelectV2Project'
import CustomizeVulRemarkDialog from '@/views/home/public/vul/CustomizeVulRemarkDialog.vue'
import PaginationSelect from '../module/PaginationSelect'
import MarkBlackAndWhiteListDropdown from '@/views/home/public/modules/MarkBlackAndWhiteListDropdown.vue'
import { markStatusOptions } from '@/store/constant'
export default {
  name: 'AssetsVulList',
  mixins: [MixinsList],
  components: {
    MarkBlackAndWhiteListDropdown,
    CustomizeVulRemarkDialog,
    ElSelectV2Project,
    DialogVulDetail,
    // AnnulusPieChart,
    // RowBarChart,
    // FloatingButton,
    Sticky,
    PaginationSelect
  },
  data () {
    return {
      name: '',
      visibleChart: false,
      checked: true,
      project: this.$store.state.home.project,
      vulId: '',
      searchSelect: 'cveId',
      searchText: null,
      markStatusOptions,
      searchData: {
        exploitLevelId: undefined,
        filterBlackList: 0,
        projectIds: [],
        sortFieldList: [],
        sortTypeList: [],
        taskIds: [],
        markStatus: undefined
      },
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      multipleSelection: [],
      searchSelectOptions: [
        {
          value: 'cveId',
          label: 'CVE编号'
        },
        {
          value: 'cnnvdId',
          label: 'CNNVD编号'
        },
        {
          value: 'cnvdId',
          label: 'CNVD编号'
        },
        {
          value: 'vulName',
          label: '漏洞名称'
        },
        {
          value: 'xmirrorId',
          label: 'XMIRROR编号'
        }
      ],
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
      vulTypeData: [],
      vulLevelData: {
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
          }
        ],
        sum: 0
      },
      vulLevelLoading: false,
      vulTypeLoading: false
    }
  },
  computed: {
    ...mapState({
      initProjectLoading: state => state.home.initProjectLoading,
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
  methods: {
    /**
     * @desc 漏洞分享到jira平台
     * @param { Object } row  表格列
     */
    shareJira (row) {
      shareJira({
        dicVulIdList: isArray(row) ? row.map(item => item.dicVulId) : [row.dicVulId]
      }).then(() => {
        this.$message.success('已成功分享至Jira！')
        this.initList()
        if (isArray(row)) {
          this.$refs.multipleTable.clearSelection()
        }
      }).catch(error => {
        if (error.code === 400904) {
          this.$popup({
            content: '<p style="padding: 10px 30px">未配置Jira地址，请先完成Jira配置</p>',
            confirmButtonText: '去配置',
            cancelButtonText: '取 消',
            beforeClose: (action, cd) => {
              if (action === 'confirm') {
                this.$router.push('/system/docking/jira')
              }
              cd()
            }
          })
        } else {
          this.$message.error(error.message)
        }
      })
    },

    // 导出漏洞
    exportFile () {
      const all = this.multipleSelection.length <= 0
      const isExportSection = this.searchData.projectIds.length > 0 || this.searchData.filterBlackList === 1 ||
        this.searchText
      this.$popup({
        title: all ? '导出全部' : '导出',
        width: '550px',
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        center: false,
        content: `<div style="padding: 20px"> ${all ? isExportSection ? '导出搜索结果数据，是否继续导出？' : '导出所有数据，是否继续导出？'
        : '导出所选数据，是否继续导出？'} </div>`,
        beforeClose: async (action, next) => {
          if (action === 'confirm') {
            const params = {
              ...this.searchData,
              [this.searchSelect]: this.searchText
            }
            const [error, response] = await to(vulListExcel(all ? isExportSection ? params : {} : {
              dicVulIdList: this.multipleSelection.map(x => x.dicVulId)
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
                  return h('el-row', { class: 'font-base', style: { padding: '20px' } }, [
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

    // 详情
    detail (row) {
      this.$router.push({
        path: '/assets/vul/details',
        query: {
          dicVulId: row.dicVulId
        }
      })
    },

    // 初始化漏洞图
    initVulLevelChart () {
      if (!this.authorityFilter(501)) {
        return 0
      }
      this.vulLevelLoading = true
      vulLevelChart({
        projectIds: [],
        loading: false
      })
        .then(response => {
          this.vulLevelLoading = false
          const data = response.data
          this.vulLevelData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.vulLevelData.sum = data.totalCount
        })
        .catch(error => {
          this.vulLevelLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化漏洞TOP条形图
    initVulTypeChart () {
      if (!this.authorityFilter(501)) {
        return 0
      }
      this.vulTypeLoading = true
      this.vulTypeData = []
      vulTypeNumTop10Chart({
        projectIds: [],
        loading: false
      })
        .then(response => {
          this.vulTypeLoading = false
          const data = response.data.data
          data.forEach(item => {
            this.vulTypeData.push({
              name: item.vulType,
              value: item.count
              // dicComponentId: item.dicComponentId,
              // projectId: item.projectId,
              // version: item.version
            })
          })
        })
        .catch(error => {
          this.vulTypeLoading = false
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
      this.$refs.multipleTable.clearSelection()
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      if (!this.authorityFilter(1101)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      this.loading = true

      /**
       * 保存搜索条件
       * **/
      this.saveSearchRecord({
        searchSelect: this.searchSelect,
        searchText: this.searchText,
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })

      const params = {
        ...this.searchData,
        [this.searchSelect]: this.searchText,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      }

      vulList(params)
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
    this.initList()
    // this.initVulLevelChart()
    // this.initVulTypeChart()
  }
}
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;
  margin-top: 20px;

  .el-row > .left {
    margin-right: 30px;
    margin-bottom: 15px;

    .input-label {
      line-height: 34px;
    }
  }
}

.info-section {
  float: right;

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

  .el-dropdown {
    color: inherit;
  }
}
</style>
