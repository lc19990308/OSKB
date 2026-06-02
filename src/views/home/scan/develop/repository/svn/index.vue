<template>
  <div>
    <!--  dialog  -->
    <DialogExportSBOM ref="exportSBOM"/>
    <dialog-edit ref="edit" @change="initList"></dialog-edit>
    <dialog-add-svn ref="addSvn" @callback="initList"></dialog-add-svn>
    <dialog-timing ref="timing" @callback="initList"></dialog-timing>
    <dialog-investigate ref="investigate" @callback="initList"></dialog-investigate>
    <dialog-get-project ref="getProject" @change="getProjectChange"></dialog-get-project>
    <dialog-svn-export @change="getExcelConfirm(multipleSelection, $event)" :title="multipleSelection.length > 0 ? '导出' :'导出全部'" ref="export"></dialog-svn-export>
    <dialog-create-report ref="createReport" moduleCode="6"></dialog-create-report>

    <!--  content  -->
    <el-row :gutter="20" class="wrap">
      <el-col :span="24">
        <el-alert
          :closable="false"
          type="primary"
          class="header-alert"
          v-if="authorityFilter(2303)"
        >
          <div class="alert-content">
            <i class="el-icon-info"></i>
            提供快速添加和批量添加两种方式添加SVN仓库，快速添加可添加某一具体仓库，批量添加方式通过上传Excel方式批量添加仓库。
            <div class="handle">
              <el-button
                size="mini"
                class="custom-alert-btn"
                type="primary"
                style="visibility: hidden;"
              >
                配置SVN
              </el-button>
            </div>
          </div>
        </el-alert>
      </el-col>
      <el-col :span="8">
        <div class="common-bg">
          <div class="common-header">
            仓库统计
          </div>
          <annulus-pie-chart
            :height="280"
            :center-label="'仓库数'"
            :chart-data="depositoryData"
            :loading="depositoryLoading"
          ></annulus-pie-chart>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="common-bg">
          <div class="common-header">
            组件统计
          </div>
          <annulus-pie-chart
            :height="280"
            :center-label="'组件数'"
            :chart-data="componentData"
            :loading="componentLoading"
          ></annulus-pie-chart>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="common-bg">
          <div class="common-header">
            漏洞统计
          </div>
          <annulus-pie-chart
            :height="280"
            :center-label="'漏洞数'"
            :chart-data="bugData"
            :loading="bugLoading"
          ></annulus-pie-chart>
        </div>
      </el-col>
    </el-row>
    <div class="view-content">
      <sticky
        :sticky-top="65"
        :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
      >
        <div class="clearfix">
          <el-button
            type="primary"
            v-if="authorityFilter(2303)"
            size="medium"
            @click="
              [
                project.id === -1
                  ? $refs.getProject.openDialog()
                  : $router.push('/scan/develop/repository/svn/add')
              ]
            "
            >添加仓库</el-button
          >
          <el-button
            size="medium"
            type="primary"
            @click="compare"
            :disabled="multipleSelection.filter(item => item.status === 4).length !== 2"
          >
            查看对比
            <el-tooltip placement="top" :offset="30">
              <div slot="content">选择两个检测完成的任务时可用</div>
              <i class="el-icon-warning-outline el-icon--right"></i>
            </el-tooltip>
          </el-button>
          <el-button
            size="medium"
            :disabled="tableData.length<=0"
            @click="$refs.export.openDialog()"
            v-if="authorityFilter(2306)"
            type="primary"
          >
            导出
          </el-button>
          <el-dropdown trigger="click" v-if="authorityFilter([2304, 2307])">
            <el-button
              size="medium"
              type="primary"
              :disabled="multipleSelection.length === 0"
            >
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="svnSyncCodeBatch(multipleSelection)"
                >同步代码</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="
                  $refs.investigate.useDialog(multipleSelection, 'multiple')
                "
                v-if="authorityFilter(2307)"
                >审查</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="$refs.timing.useDialog(multipleSelection)"
              >定时检测
              </el-dropdown-item
              >
              <el-dropdown-item
                @click.native="del(multipleSelection, 'codeOnly')"
                v-if="authorityFilter(2304)"
                >删除代码</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="del(multipleSelection)"
                v-if="authorityFilter(2304)"
              >删除仓库</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <search-area
            placeholder="仓库名称/仓库地址/仓库说明"
            @search="search"
            v-model="searchCondition"
            right-float
          />
        </div>
      </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        row-key="id"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        @filter-change="searchFilter"
        @selection-change="handleSelectionChange"
        :default-sort="defaultSort"
        :dynamic-options.sync="tableConfig"
      >
        <template slot="bar">
          <el-button
            size="medium"
            :disabled="tableData.length<=0"
            @click="$refs.export.openDialog()"
            v-if="authorityFilter(2306)"
            type="primary"
          >
            导出
          </el-button>
          <el-button size="medium" type="primary" @click="svnSyncCodeBatch(multipleSelection)">同步代码</el-button>
          <el-button size="medium" type="primary" @click=" $refs.investigate.useDialog(multipleSelection, 'multiple') " v-if="authorityFilter(2307)">审查</el-button>
          <el-button size="medium" type="primary" @click="$refs.timing.useDialog(multipleSelection)">定时检测</el-button>
          <el-button size="medium" type="primary" @click="del(multipleSelection, 'codeOnly')" v-if="authorityFilter(2304)">删除代码</el-button>
          <el-button size="medium" type="primary" @click="del(multipleSelection)" v-if="authorityFilter(2304)">删除仓库</el-button>
        </template>
        <el-table-column reserve-selection type="selection" key="selection" width="55">
        </el-table-column>
        <el-table-column
          min-width="100px"
          label="所属项目"
          v-if="project.id === -1"
          :class-name="'cursor-pointer'"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <oss-table-filter
              :default-props="{ label: 'text', value: 'value' }"
              title="所属项目"
              :filters="projectListMixin"
              v-model="searchData.projectId"
              @change="search"
            >
            </oss-table-filter>
          </template>
          <template slot-scope="scope">
            {{ scope.row.projectName }}
          </template>
        </el-table-column>
        <el-table-column
          width="170px"
          label="仓库名称"
          prop="name"
          show-overflow-tooltip
        >
          <template v-slot="{ row }">
            <el-link
              type="primary"
              :underline="false"
              :disabled="row.status !== 4"
              @click="detail(row)"
            >
              <div style="display: flex;align-items: center;">
                 <span
                   style="display: inline-block;max-width: 120px;text-overflow: ellipsis;overflow: hidden;white-space:nowrap; line-height: initial;">
              {{ row.name }}
              </span>
                <el-tooltip v-if="row.description" :content="row.description">
                  <i class="text-primary el-icon-info" style="margin-left: 3px;"></i>
                </el-tooltip>
              </div>
          </el-link>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150px"
          label="仓库地址"
          prop="url"
          show-overflow-tooltip
        >
          <template v-slot="{ row }">
            {{ row.url }}
          </template>
        </el-table-column>
        <el-table-column
          label="风险等级"
          key="风险等级"
          min-width="120px"
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
          min-width="120px"
          label="组件"
          prop="component_total"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <oss-table-sort
              prop="component_total"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              组件
            </oss-table-sort>
          </template>
          <template slot-scope="{row}">
            <el-tooltip effect="dark" :content="`严重：${get(row, 'componentNumVO.serious', 0)} | 高危：${get(row, 'componentNumVO.high', 0)} | 中危：${get(row, 'componentNumVO.medium', 0)} | 低危：${get(row, 'componentNumVO.low', 0)} | 无漏洞：${get(row, 'componentNumVO.normal', 0)}`" placement="top">
              <el-link :underline="false"  @click="detail(row)">
                {{ get(row, 'componentNumVO.total', 0) }}
              </el-link>
            </el-tooltip>
          </template>

        </el-table-column>
        <el-table-column
          label="漏洞"
          key="漏洞"
          width="200"
          prop="vul_total"
        >
          <template v-slot:header>
            <oss-table-sort
              prop="vul_total"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              漏洞
            </oss-table-sort>
          </template>
          <template slot-scope="scope">
            <level-group
              @click="detail(scope.row, '/scan/develop/repository/svn/details/vul', $event)"
              :value="[
               scope.row.vulNumVO.serious,
               scope.row.vulNumVO.high,
               scope.row.vulNumVO.medium,
               scope.row.vulNumVO.low
               ]" />
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="120px"
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
              v-if="[-2, -1, 1, 2, 4, 5, 6, 7].includes(scope.row.status)"
              :class="
                matching(statusOptions, scope.row.status, 'value', 'class')
              "
            >
              {{ matching(statusOptions, scope.row.status, "value", "text") }}
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
          label="最近检测完成"
          min-width="150px"
          prop="finish_date"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <oss-table-sort
              prop="finish_date"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              最近检测完成
            </oss-table-sort>
          </template>
          <template slot-scope="scope">
            {{ scope.row.finishDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="检测时长"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            {{ row.detectDuration }}
          </template>
        </el-table-column>
        <el-table-column
          label="定时检测"
          key="定时检测"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <div class="theme-hover" @click="$refs.timing.useDialog(row)">
              <template v-if="row.scheduleTaskSwitchStatus === 1">
                每{{
                  row.scheduleTaskFrequencyType === 1
                    ? "天"
                    : matching(
                        weekOptions,
                        row.scheduleTaskDayOfWeek,
                        "value",
                        "label"
                      )
                }}
                {{ row.scheduleTaskTimeOfDay }}
              </template>
              <template v-else>关闭</template>
              <i class="iconfont iconbianji" style="padding-left: 3px;"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <icon-button
              tooltip-content="同步代码"
              v-if="authorityFilter(2307)"
              class="iconzhongzhi"
              :disabled="[0, 3].includes(scope.row.status)"
              @click="svnSyncCodeBatch(scope.row)"
            ></icon-button>
            <icon-button
              v-if="authorityFilter(2307)"
              :disabled="![1, 3, 4, 5, 6, 7].includes(scope.row.status)"
              :tooltip-content="scope.row.finishDate ? '重审' : '审查'"
              class="iconshencha"
              @click="$refs.investigate.useDialog(scope.row)"
            ></icon-button>
            <icon-button
              :disabled="scope.row.status !== 4"
              v-if="authorityFilter(2306)"
              tooltip-content="导出SBOM"
              class="iconSBOM1"
              @click="exportSBOM(scope.row)"
            ></icon-button>
            <icon-button
              :disabled="scope.row.status !== 4"
              tooltip-content="生成报告"
              class="iconshengchengbaogao"
              v-if="authorityFilter(2306)"
              @click="createReport(scope.row)"
            ></icon-button>
            <el-dropdown trigger="click" v-if="authorityFilter([2307, 2304])">
              <icon-button
                tooltip-content="更多"
                class="icongengduo"
              ></icon-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="$refs.edit.open(scope.row)"
                >编辑
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="del(scope.row, 'codeOnly')"
                  v-if="authorityFilter(2304)"
                >删除代码</el-dropdown-item>
                <el-dropdown-item
                  @click.native="del(scope.row)"
                  v-if="authorityFilter(2304)"
                >删除仓库</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky/index.vue'
import AnnulusPieChart from '@/components/chart/AnnulusPieChart.vue'
import DialogAddSvn from './dialogAddSvn.vue'
import {
  getSvnList,
  deleteBatch,
  detect,
  depositoryDataChart,
  componentDataChart,
  bugDataChart,
  svnSyncCodeBatch,
  excelConfirm, svnExcelGenerate
} from '@/api/home/scan/develop/repository/svn/index.js'
import {
  hasOwn,
  isArray
} from '@/utils'
import MixinsList from '@/mixins/list'
import DialogTiming from '@/views/home/scan/develop/repository/svn/add/dialog/dialogTiming'
import DialogInvestigate from '@/views/home/scan/develop/repository/svn/add/dialog/dialogInvestigate'
import DialogGetProject from '@/views/home/scan/integration/sourceCode/dialogGetProject'
import projectMixins from '@/components/public/Layout/Project/mixins'
import DialogSvnExport from '@/views/home/scan/develop/repository/svn/dialogExport'
import dialogEdit from './dialogEdit'
import { popup } from '@/components/public/Popup'
import to from '@/utils/await-to'
import DialogExportSBOM from '@/views/home/report/report/dialogExportSBOM.vue'
import { downloadScmSBOMReport } from '@/api/home/report'
import DialogCreateReport from '@/views/home/report/report/dialogCreateReport'

export default {
  name: 'ScanDevelopRepositorySvnList',
  mixins: [MixinsList, projectMixins],
  components: {
    DialogExportSBOM,
    dialogEdit,
    DialogSvnExport,
    DialogGetProject,
    DialogInvestigate,
    DialogTiming,
    DialogAddSvn,
    Sticky,
    AnnulusPieChart,
    DialogCreateReport
  },
  data () {
    return {
      stashType: 1,
      project: this.$store.state.home.project,
      tableConfig: {
        columns: [
          {
            label: '所属项目',
            checked: false,
            disabled: false
          },
          {
            label: '仓库名称',
            checked: true,
            disabled: true
          },
          {
            label: '仓库地址',
            checked: true,
            disabled: true
          },
          {
            label: '风险等级',
            checked: true,
            disabled: false
          },
          {
            label: '组件',
            checked: false,
            disabled: false
          },
          {
            label: '漏洞',
            checked: true,
            disabled: false
          },
          {
            label: '状态',
            checked: true,
            disabled: false
          },
          {
            label: '最近检测完成',
            checked: false,
            disabled: false
          },
          {
            label: '检测时长',
            checked: true,
            disabled: false
          },
          {
            label: '定时检测',
            checked: true,
            disabled: false
          },
          {
            label: '操作',
            checked: true,
            disabled: true
          }
        ],
        uuid: 'svnlist',
        to: '操作'
      },
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
      modeOptions: [
        {
          value: 1,
          text: '自动'
        },
        {
          value: 2,
          text: '手动'
        }
      ],
      statusOptions: [
        {
          value: 6,
          text: '检测超时',
          class: 'text-danger',
          type: 'danger',
          progress: 0
        },
        {
          value: -2,
          text: '未同步',
          class: 'text-primary',
          progress: 10
        },
        {
          value: -1,
          text: '排队中',
          class: 'text-primary',
          progress: 20
        },
        {
          value: 0,
          text: '代码拉取中',
          class: 'text-primary',
          progress: 30
        },
        {
          value: 1,
          text: '代码拉取成功',
          class: 'text-success',
          progress: 40
        },
        {
          value: 2,
          text: '代码拉取失败',
          class: 'text-danger',
          progress: 20
        },
        {
          value: 3,
          text: '检测中',
          class: 'text-primary',
          progress: 70
        },
        {
          value: 4,
          text: '检测完成',
          class: 'text-success',
          progress: 100
        },
        {
          value: 5,
          text: '出错结束',
          class: 'text-danger',
          progress: 100
        }
        // {
        //   value: 7,
        //   text: '队列失败',
        //   class: 'text-danger',
        //   progress: 100
        // }
      ],
      typeOptions: [
        {
          value: 1,
          text: 'Git本地仓库'
        },
        {
          value: 2,
          text: 'GitLab'
        }
      ],
      searchCondition: '',
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      searchData: {
        sortFieldList: ['finish_date'], // ['last_check_date']
        sortTypeList: [1]
      },
      multipleSelection: [],
      loading: false,
      timeout: null,
      routePath: this.$route.path,
      depositoryLoading: false,
      componentLoading: false,
      bugLoading: false,
      weekOptions: [
        {
          label: '周一',
          value: 2
        },
        {
          label: '周二',
          value: 3
        },
        {
          label: '周三',
          value: 4
        },
        {
          label: '周四',
          value: 5
        },
        {
          label: '周五',
          value: 6
        },
        {
          label: '周六',
          value: 7
        },
        {
          label: '周日',
          value: 1
        }
      ],
      depositoryData: {
        data: [
          {
            value: 0,
            name: '严重',
            color: '#8B1A1A',
            key: 'serious'
          },
          {
            value: 0,
            name: '高危',
            color: '#D9534F',
            key: 'high'
          },
          {
            value: 0,
            name: '中危',
            color: '#D4932A',
            key: 'medium'
          },
          {
            value: 0,
            name: '低危',
            color: '#1a78cf',
            key: 'low'
          },
          {
            value: 0,
            name: '正常',
            color: '#4A9C8C',
            key: 'normal'
          }
        ],
        sum: 0
      },
      componentData: {
        data: [
          {
            value: 0,
            name: '严重',
            color: '#8B1A1A',
            key: 'serious'
          },
          {
            value: 0,
            name: '高危',
            color: '#D9534F',
            key: 'high'
          },
          {
            value: 0,
            name: '中危',
            color: '#D4932A',
            key: 'medium'
          },
          {
            value: 0,
            name: '低危',
            color: '#1a78cf',
            key: 'low'
          },
          {
            value: 0,
            name: '无漏洞',
            color: '#4A9C8C',
            key: 'normal'
          }
        ],
        sum: 0
      },
      bugData: {
        data: [
          {
            value: 0,
            name: '严重',
            color: '#8B1A1A',
            key: 'serious'
          },
          {
            value: 0,
            name: '高危',
            color: '#D9534F',
            key: 'high'
          },
          {
            value: 0,
            name: '中危',
            color: '#D4932A',
            key: 'medium'
          },
          {
            value: 0,
            name: '低危',
            color: '#1a78cf',
            key: 'low'
          }
        ],
        sum: 0
      }
    }
  },
  computed: {
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
    // 导出 SBOM
    exportSBOM (row) {
      this.$refs.exportSBOM.xhr = downloadScmSBOMReport
      this.$refs.exportSBOM.form.projectId = row.projectId
      this.$refs.exportSBOM.form.reportName = row.name
      this.$refs.exportSBOM.form.taskIds = [row.taskId]
      this.$refs.exportSBOM.dialogVisible = true
    },

    // 批量同步svn仓库代码
    async svnSyncCodeBatch (row) {
      if (this.timer) return
      const idList = isArray(row) ? row.map(item => item.id) : [row.id]
      try {
        const result = await svnSyncCodeBatch({ idList })
        result.code === 0 &&
          this.$message.success(
            '操作成功！同步代码时间取决于您的代码仓库大小及网络带宽等因素'
          )
        this.timer = setTimeout(() => {
          this.initList()
          clearTimeout(this.timer)
          this.timer = null
        }, 1000)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    getProjectChange (v) {
      this.selectProject_mixin(v)
      this.$router.push('/scan/develop/repository/svn/add')
    },

    // 路由跳转
    routerPush (path) {
      this.$router.push({
        path: path
      })
    },

    // 配置svn
    setConf () {
      this.$refs.addSvn.form.type = this.stashType
      this.$refs.addSvn.dialogVisible = true
    },
    getExcelConfirm (data, dimensionality) {
      if (dimensionality === 0) {
        this.$refs.createReport.use(data.map(x => x.id))
        return
      }

      excelConfirm({
        repoIds: data.map(x => x.id),
        projectId: this.project.id,
        dimensionality: dimensionality,
        condition: this.searchCondition
      }).then(res => {
        const h = this.$createElement
        const els = h('el-row', { class: 'font-base' }, [
          h('p', {}, [
            h('span', { class: 'text-primary font-bold' }, `${this.project.id === -1 ? '' : res.data.projectName + '项目'}`),
            ' 共 ',
            h('span', { class: 'text-primary font-bold' }, `${res.data.total}`),
            ' 个仓库，本次将导出 ',
            h('span', { class: 'text-primary font-bold' }, `${res.data.exportCount}`),
            ' 个仓库的检测结果，点击“确定”按钮继续导出~'
          ]),
          h('p', { style: { paddingTop: '15px' } }, '注：只有检测成功的仓库才可导出。')
        ])
        this.exportFileSubmit(res.data, dimensionality, els)
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    // 导出文件
    async exportFileSubmit (data = {}, dimensionality, el) {
      const that = this
      setTimeout(() => {
        popup({
          title: '提示',
          width: '550px',
          showConfirm: data.exportCount > 0,
          content: el,
          async beforeClose (action, next) {
            if (action === 'confirm') {
              const [error, result] = await to(svnExcelGenerate({
                repoIds: data.repoIds,
                projectId: that.project.id,
                dimensionality: dimensionality
              }))
              next()
              if (result) {
                const h = that.$createElement
                setTimeout(() => popup({
                  title: '提示',
                  width: '550px',
                  confirmButtonText: '去下载',
                  cancelButtonText: '留在本页',
                  content: h('el-row', { class: 'font-base' }, [
                    h('p', {}, [h('i', { class: 'el-icon-success text-success font-xxl m-r-5', style: { verticalAlign: 'bottom' } }, ''), '操作成功，请在报告管理中下载报告~']),
                    h('p', { style: { paddingTop: '15px', wordBreak: 'break-word' } }, `报告名称：${result.data.reportName}`)
                  ]),
                  beforeClose (action, next) {
                    if (action === 'confirm') {
                      next()
                      that.$router.push({ path: '/report/list' })
                    } else {
                      next()
                    }
                  }
                }), 200)
              } else if (error !== null && typeof error === 'object') {
                that.$message.error(error.message)
              }
            } else {
              next()
            }
          }
        })
      }, 200)
    },
    // 详情
    detail (row, path = '/scan/develop/repository/svn/details', e = 10) {
      if (row.status !== 4) return
      this.$router.push({
        path: path,
        query: {
          id: row.id,
          // source: row.source,
          project: row.projectId,
          scheduleTaskSwitchStatus: row.scheduleTaskSwitchStatus,
          scheduleTaskFrequencyType: row.scheduleTaskFrequencyType,
          scheduleTaskDayOfWeek: row.scheduleTaskDayOfWeek,
          scheduleTaskTimeOfDay: row.scheduleTaskTimeOfDay,
          name: row.name,
          _securityLevel: e
        }
      })
    },

    // 删除
    del (row, codeOnly) {
      const params = {
        idList: isArray(row) ? row.map(x => x.id) : [row.id]
      }
      codeOnly && (params.codeOnly = true)
      this.$confirm(
        codeOnly ? '确定要删除代码吗？删除后您可点击“同步代码”再次重新拉取仓库代码' : '确定要删除仓库吗？删除后该仓库关联的代码及所有审查记录会同步删除！',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteBatch(params)
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$refs.multipleTable.clearSelection()
              this.initList()
              this.initDepositoryDataChart()
              this.initComponentDataChart()
              this.initBugDataChart()
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

    // 初始化仓库统计饼状图
    initDepositoryDataChart (auto) {
      if (!this.authorityFilter(2301)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      if (!auto) {
        this.depositoryData.data.forEach(item => {
          item.value = 0
        })
        this.depositoryLoading = true
        this.depositoryData.sum = 0
      }
      depositoryDataChart({
        projectId: this.project.id,
        loading: false
      })
        .then(response => {
          this.depositoryLoading = false
          const data = response.data
          this.depositoryData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.depositoryData.sum = data.total
        })
        .catch(error => {
          this.depositoryLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化组件统计饼状图
    initComponentDataChart (auto) {
      if (!this.authorityFilter(2301)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      if (!auto) {
        this.componentData.data.forEach(item => {
          item.value = 0
        })
        this.componentLoading = true
        this.componentData.sum = 0
      }
      componentDataChart({
        projectId: this.project.id,
        loading: false
      })
        .then(response => {
          this.componentLoading = false
          const data = response.data
          this.componentData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.componentData.sum = data.total
        })
        .catch(error => {
          this.componentLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化漏洞统计饼状图
    initBugDataChart (auto) {
      if (!this.authorityFilter(2301)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      if (!auto) {
        this.bugData.data.forEach(item => {
          item.value = 0
        })
        this.bugLoading = true
        this.bugData.sum = 0
      }
      bugDataChart({
        projectId: this.project.id,
        loading: false
      })
        .then(response => {
          this.bugLoading = false
          const data = response.data
          this.bugData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.bugData.sum = data.total
        })
        .catch(error => {
          this.depositoryLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化列表
    initList (auto) {
      if (!this.authorityFilter(2302)) {
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

      if (auto === 'auto') {
        this.initComponentDataChart(true)
        this.initBugDataChart(true)
        this.initDepositoryDataChart(true)
      }

      /**
       * 保存搜索条件
       * **/
      this.saveSearchRecord({
        searchCondition: this.searchCondition,
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })

      const params = {
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition,
        loading: false
      }

      if (
        this.project.id === -1 &&
        hasOwn(this.searchData, 'projectId')
      ) {
        params.projectId = this.searchData.projectId
          ? this.searchData.projectId
          : -1
      } else {
        params.projectId = this.project.id
      }

      getSvnList(params)
        .then(response => {
          this.loading = false
          this.tableData = []
          const data = response.data
          data.records.forEach(item => {
            this.tableData.push(item)
          })
          this.total = data.total
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

    // 审查 / 批量审查
    detect (row) {
      const params = {
        idList: isArray(row) ? row.map(x => x.id) : [row.id]
      }
      detect(params)
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.initList()
        })
        .catch(error => {
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
    // 生成报告
    createReport (row) {
      if (isArray(row)) {
        if ((row || []).filter(item => item.status !== 4).length > 0) {
          this.$message.warning('选择导出的任务中包含未检测完成的任务，无法导出，请重新选择。')
          return
        }
        this.$refs.createReport.use((row || []).map(item => item.id))
      } else {
        this.$refs.createReport.use([row.id])
      }
    },
    // 查看对比
    compare () {
      const multipleSelection = this.multipleSelection.sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate))
      this.$router.push({
        name: 'ScanDevelopRepositorySvnCompare',
        params: {
          previousTask: multipleSelection[0],
          behindTask: multipleSelection[1]
        }
      })
    }
  },
  watch: {
    '$store.state.home.project' (n) {
      if (n !== null) {
        this.project = n
        this.search()
        this.initDepositoryDataChart()
        this.initComponentDataChart()
        this.initBugDataChart()
      }
    }
  },
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  },
  mounted () {
    if (this.$store.state.home.project !== null) {
      this.initList()
      this.initDepositoryDataChart()
      this.initComponentDataChart()
      this.initBugDataChart()
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
}

.header-alert {
  position: relative;
  margin-bottom: 20px;
  padding-left: 12px !important;
  padding-right: 12px !important;

  :deep(.el-alert__content) {
    padding: 0;
  }

  .alert-content {
    margin-bottom: 5px;
    padding: 0;

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.custom-alert-btn {
  width: 70px;
  height: 26px;
}

.theme-hover {
  cursor: pointer;

  .iconfont {
    visibility: hidden;
  }
}

:deep(.el-table__row:hover .theme-hover) {
  color: $color-primary;
  transition: all 0.1s;

  .iconfont {
    visibility: visible;
  }
}
</style>
