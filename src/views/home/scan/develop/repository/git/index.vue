<template>
  <div>
    <DialogExportSBOM ref="exportSBOM"/>
    <!-- dialog start   -->
    <dialog-get-project ref="getProject" @change="config"></dialog-get-project>
    <dialog-get-project
      ref="getProject2"
      @change="
        selectProject_mixin($event),
          $nextTick(() => {
            add();
          })
      "
    ></dialog-get-project>
    <dialog-get-project
      ref="getProject3"
      @change="
        selectProject_mixin($event),
          $nextTick(() => {
            excelAdd();
          })
      "
    ></dialog-get-project>
    <dialog-get-project
      ref="getProject4"
      @change="
        selectProject_mixin($event),
          $nextTick(() => {
            warehouseAdd();
          })
      "
    ></dialog-get-project>
    <dialog-edit ref="edit" @change="initList"></dialog-edit>
    <dialog-svn-export @change="getExcelConfirm(multipleSelection, $event)"
                       :title="multipleSelection.length > 0 ? '导出' :'导出全部'" ref="export"></dialog-svn-export>
    <dialog-git-conf ref="gitConf" @callback="search"></dialog-git-conf>
    <dialog-investigate
      ref="investigate"
      @callback="investigateCallback"
    ></dialog-investigate>
    <dialog-timing ref="timing" @callback="investigateCallback"></dialog-timing>
    <dialog-create-report ref="createReport" moduleCode="3"></dialog-create-report>
    <!-- dialog end   -->
    <DialogWebhook ref="webhook"></DialogWebhook>
    <el-row :gutter="20" class="wrap">
      <el-col :span="24" v-if="authorityFilter(2303)">
        <el-alert :closable="false" type="primary" class="header-alert">
          <div class="alert-content">
            <i class="el-icon-info"></i>
            提供快速检测和批量检测两种检测方式，快速检测可快速检测某一具体仓库，批量检测方式需先&lt;配置Git&gt;，可批量对多个仓库进行检测。
            <div class="handle">
              <el-button
                v-if="project && project.id !== -1"
                size="mini"
                class="custom-alert-btn"
                type="primary"
                @click="config()"
              >
                配置Git
              </el-button>
              <el-button
                v-else
                size="mini"
                class="custom-alert-btn"
                type="primary"
                @click="$refs.getProject.openDialog()"
              >
                配置Git
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
            :legend="false"
            :height="280"
            :chart-data="typeData"
            :loading="typeChartLoading"
          ></annulus-pie-chart>
        </div>
      </el-col>
      <el-col :span="8">
        <component-chart
          :project="project"
          ref="componentChart"
        ></component-chart>
      </el-col>
      <el-col :span="8">
        <vulnerability-statistics-chart
          ref="vulnerability"
          :project="project"
        ></vulnerability-statistics-chart>
      </el-col>
    </el-row>
    <div class="view-content">
      <sticky
        :sticky-top="65"
        :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
      >
        <div class="clearfix">
          <el-dropdown trigger="click" placement="bottom-start" v-if="authorityFilter(2303)">
            <el-button size="medium" type="primary">
              添加仓库<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="[ project.id === -1 ? $refs.getProject2.openDialog() :  add()]">
                从已配置Git中选择
              </el-dropdown-item>
              <el-dropdown-item @click.native="[ project.id === -1 ? $refs.getProject4.openDialog() :  warehouseAdd()] ">
                快速添加单个仓库
              </el-dropdown-item>
              <el-dropdown-item @click.native="[ project.id === -1 ? $refs.getProject3.openDialog() :  excelAdd()]">
                批量添加(Excel)
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
          <el-button size="medium"  v-if="authorityFilter(2306)" :disabled="tableData.length <= 0" @click="$refs.export.openDialog()" type="primary">
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
                @click.native="
                  $refs.investigate.useDialog(multipleSelection, 'multiple',sourceOptions)
                "
                v-if="authorityFilter(2307)"
              >重审
              </el-dropdown-item
              >
              <el-dropdown-item
                @click.native="$refs.timing.useDialog(multipleSelection)"
              >定时检测
              </el-dropdown-item
              >
<!--              <el-dropdown-item-->
<!--                @click.native="del(multipleSelection,'codeOnly')"-->
<!--                v-if="authorityFilter(2304)"-->
<!--              >删除代码-->
<!--              </el-dropdown-item>-->
              <el-dropdown-item
                @click.native="del(multipleSelection)"
                v-if="authorityFilter(2304)"
              >删除仓库
              </el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <search-area
            placeholder="仓库名称/仓库地址/仓库说明"
            @search="search"
            v-model="searchCondition"
            right-float
          ></search-area>
        </div>
      </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        row-key="id"
        :data="tableData"
        tooltip-effect="dark"
        @filter-change="searchFilter"
        @selection-change="handleSelectionChange"
        :default-sort="defaultSort"
        v-loading="loading"
        :dynamic-options.sync="tableConfig"
      >
        <template slot="bar">
          <el-button size="medium" v-if="authorityFilter(2306)" :disabled="tableData.length <= 0" @click="$refs.export.openDialog()" type="primary">
            导出
          </el-button>
          <el-button size="medium" type="primary" @click="$refs.investigate.useDialog(multipleSelection, 'multiple')" v-if="authorityFilter(2307)">
            重审
          </el-button>
          <el-button size="medium" type="primary" @click="$refs.timing.useDialog(multipleSelection)">
            定时检测
          </el-button>
<!--          <el-button size="medium" type="primary" @click="del(multipleSelection,'codeOnly')" v-if="authorityFilter(2304)">-->
<!--            删除代码-->
<!--          </el-button>-->
          <el-button size="medium" type="primary" @click="del(multipleSelection)" v-if="authorityFilter(2304)">
            删除仓库
          </el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"></el-table-column>
        <el-table-column
          label="所属项目"
          min-width="100"
          :class-name="'cursor-pointer'"
          v-if="project.id === -1"
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
          <template v-slot="{ row }">
            {{ row.projectName }}
          </template>
        </el-table-column>
        <el-table-column min-width="200" label="仓库名称" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <el-link
              class="ellipsis"
              type="primary"
              :disabled="row.status !== 4"
              :underline="false"
              @click="detail(row)"
            >
              <el-tooltip
                class="item"
                v-if="matching(typeOptions,row.gitServerType,'value', 'icon')"
                effect="dark"
                :content="matching(typeOptions,row.gitServerType,'value', 'text')"
                placement="top"
              >
                <img
                  :src="matching(typeOptions,row.gitServerType,'value', 'icon')"
                  alt=""
                  style="vertical-align: middle;"
                  class="m-r-5"
                />
              </el-tooltip>
              {{ row.name }}
              <el-tooltip
                class="item"
                v-if="row.description"
                effect="dark"
                :content="row.description"
                placement="top"
              >
                <i class="el-icon-info" style="vertical-align: middle;"></i>
              </el-tooltip>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="检测分支"
          prop="branch"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <el-link
              v-if="row.webUrl"
              class="ellipsis"
              type="primary"
              :underline="false"
              @click="openNewTag(row)"
            >
              {{ row.branch }}
            </el-link>
            <template v-else>{{ row.branch }}</template>
          </template>
        </el-table-column>
        <el-table-column
          label="来源"
          min-width="120"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <oss-table-filter
              :default-props="{ label: 'text', value: 'value' }"
              title="来源"
              :filters="sourceOptions"
              v-model="searchData.gitServerType"
              @change="search"
            >
            </oss-table-filter>
          </template>
          <template slot-scope="{ row }">
            {{matching(sourceOptions, row.gitServerType, 'value','text', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          label="风险等级"
          min-width="120"
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
          <template slot="header">
            <span class="cursor-pointer">风险等级</span>
          </template>
          <template slot-scope="scope">
            <level-tag :level="scope.row.securityLevel"></level-tag>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
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
              <el-link :disabled="row.status !== 4"
                       :underline="false"
                       @click="detail(row)">
                {{ get(row, 'componentNumVO.total', 0) }}
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="漏洞"
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
              @click="[scope.row.status !== 4 ? () => {} : detail(scope.row, '/vul', $event)]"
              :value="[
                     scope.row.vulNumVO.serious,
                     scope.row.vulNumVO.high,
                     scope.row.vulNumVO.medium,
                     scope.row.vulNumVO.low
                     ]"/>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="120"
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
          <template slot="header">
            <span class="cursor-pointer">检测状态</span>
          </template>
          <template slot-scope="scope">
            <span
              v-if="[2, 4, 5, 6, 7].includes(scope.row.status)"
              :class="matching(statusOptions,scope.row.status,'value', 'class')"
            >
              {{ matching(statusOptions, scope.row.status, 'value', 'text') }}
            </span>
            <el-tooltip
              v-else
              placement="top-start"
              effect="dark"
              :content="matching(statusOptions,scope.row.status,'value', 'text')"
            >
              <oss-progress
                :percentage="scope.row.percentage.value"
              ></oss-progress>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="最近检测完成"
          min-width="170"
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
          <template slot-scope="{row}">
            {{ get(row, 'finishDate', '-') }}
          </template>
        </el-table-column>
        <el-table-column label="检测时长" width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{ get(row, 'detectDuration', '-') }}
          </template>
        </el-table-column>
        <el-table-column label="定时检测" min-width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div class="theme-hover" @click="$refs.timing.useDialog(row)">
              <template v-if="row.scheduleTaskSwitchStatus === 1">
                每{{
                  row.scheduleTaskFrequencyType === 1
                    ? '天'
                    : matching(weekOptions, row.scheduleTaskDayOfWeek, 'value', 'label')
                }}
                {{ row.scheduleTaskTimeOfDay }}
              </template>
              <template v-else>关闭</template>
              <i class="iconfont iconbianji" style="padding-left: 3px;"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="170">
          <template slot-scope="scope">
            <icon-button
              tooltip-content="审查"
              v-if="authorityFilter(2307)"
              :disabled="![2, 4, 5, 6, 7].includes(scope.row.status)"
              class="iconshencha"
              @click="$refs.investigate.useDialog(scope.row,null,sourceOptions)"
            ></icon-button>
            <icon-button
              v-if="authorityFilter(2306)"
              :disabled="scope.row.status !== 4"
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
                </el-dropdown-item
                >
                <el-dropdown-item @click.native="webhook(scope.row)" v-if="scope.row.protocol!==1">
                  查看配置
                </el-dropdown-item>
<!--                <el-dropdown-item-->
<!--                  :disabled="![2, 4, 5, 6].includes(scope.row.status)"-->
<!--                  @click.native="del(scope.row, 'codeOnly')"-->
<!--                  v-if="authorityFilter(2304)"-->
<!--                >删除代码-->
<!--                </el-dropdown-item>-->
                <el-dropdown-item
                  @click.native="del(scope.row)"
                  :disabled="![2, 4, 5, 6, 7].includes(scope.row.status)"
                  v-if="authorityFilter(2304)"
                >删除仓库
                </el-dropdown-item>
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
import DialogGitConf from './dialog/dialogGitConf.vue'
// import DialogExamine from './dialog/dialogExamine.vue'
import {
  logicDelete,
  detect,
  getGitRepositoryList,
  typeChart,
  exportRepository,
  getGitConf,
  excelConfirm, excelGenerate
} from '@/api/home/scan/develop/repository/git'
import { gitList } from '@/api/home/scan/develop/repository/git/batchAdd/warehouse'
import { downloadBlobFile, hasOwn, isArray } from '@/utils'
import MixinsList from '@/mixins/list.js'
import ComponentChart from '@/views/home/scan/develop/repository/git/chart/ComponentChart'
import VulnerabilityStatisticsChart from '@/views/home/scan/develop/repository/git/chart/VulnerabilityStatisticsChart'
import DialogInvestigate from '@/views/home/scan/develop/repository/git/dialog/dialogInvestigate'
import DialogTiming from '@/views/home/scan/develop/repository/git/dialog/dialogTiming'
import dialogGetProject from '@/views/home/scan/integration/sourceCode/dialogGetProject'
import DialogWebhook from '@/views/home/scan/develop/repository/git/dialog/dialogWebhook'
import { mapState } from 'vuex'
import projectMixins from '@/components/public/Layout/Project/mixins'
import { popup } from '@/components/public/Popup'
import DialogSvnExport from '@/views/home/scan/develop/repository/svn/dialogExport'
import { deleteBatch } from '@/api/home/scan/develop/repository/svn'
import to from '@/utils/await-to'
import DialogEdit from '@/views/home/scan/develop/repository/git/dialog/dialogEdit'
import DialogExportSBOM from '@/views/home/report/report/dialogExportSBOM.vue'
import { downloadScmSBOMReport } from '@/api/home/report'
import DialogCreateReport from '@/views/home/report/report/dialogCreateReport'

// 状态转为进度
const PROGRESS_CONF = {
  6: {
    value: 0,
    status: null
  },
  '-1': {
    value: 10,
    status: null
  },
  0: {
    value: 40,
    status: null
  },
  1: {
    value: 50,
    status: null
  },
  2: {
    value: 60,
    status: null
  },
  3: {
    value: 70,
    status: null
  },
  4: {
    value: 100,
    status: null
  },
  5: {
    value: 100,
    status: null
  },
  7: {
    value: 100,
    status: null
  }
}
export default {
  name: 'RepositoryList',
  mixins: [MixinsList, projectMixins],
  components: {
    DialogExportSBOM,
    DialogEdit,
    DialogSvnExport,
    dialogGetProject,
    DialogTiming,
    DialogInvestigate,
    VulnerabilityStatisticsChart,
    ComponentChart,
    DialogGitConf,
    AnnulusPieChart,
    DialogWebhook,
    DialogCreateReport,
    // DialogExamine,
    Sticky
  },
  data () {
    return {
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
            label: '检测分支',
            checked: true,
            disabled: true
          },
          {
            label: '来源',
            checked: false,
            disabled: false
          },
          {
            label: '风险等级',
            checked: true,
            disabled: false
          },
          {
            label: '组件',
            checked: true,
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
            checked: true,
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
        uuid: 'gitList',
        to: '操作'
      },
      stashType: 1,
      project: this.$store.state.home.project,
      options: {
        grid: {
          top: '18%',
          bottom: 45
        },
        legend: {
          right: '5%',
          top: '5%'
        }
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
          value: -1,
          text: '排队中',
          class: 'text-regular'
        },
        {
          value: 0,
          text: '同步代码中',
          class: 'text-primary'
        },
        {
          value: 1,
          text: '同步代码成功',
          class: 'text-success'
        },
        {
          value: 2,
          text: '同步代码失败',
          class: 'text-danger'
        },
        {
          value: 3,
          text: '检测中',
          class: 'text-primary'
        },
        {
          value: 4,
          text: '检测完成',
          class: 'text-success'
        },
        {
          value: 5,
          text: '出错结束',
          class: 'text-danger'
        }
        // {
        //   value: 7,
        //   text: '队列失败',
        //   class: 'text-danger'
        // }
      ],
      sourceOptions: [],
      typeOptions: [
        {
          value: 1,
          text: 'GitLab',
          icon: require('@/assets/images/gitlab-icon.png')
        },
        {
          value: 2,
          text: 'GitHub',
          icon: require('@/assets/images/GIthub-icon.png')
        },
        {
          value: 3,
          text: 'Gitee',
          icon: require('@/assets/images/gitee-icon.png')
        },
        {
          value: 5,
          text: 'Gerrit',
          icon: require('@/assets/images/Gerrit.svg')
        },
        {
          value: 6,
          text: 'Gogs',
          icon: require('@/assets/images/Gogs.svg')
        },
        {
          value: 7,
          text: 'Azure Repos',
          icon: require('@/assets/images/AzureRepos.svg')
        },
        {
          value: 8,
          text: 'Bitbucket',
          icon: require('@/assets/images/Bitbucket.svg')
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
      typeChartLoading: false,
      typeData: {
        data: []
      },
      timeout: null,
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
      ]
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
    },
    ...mapState({
      projectList: state => state.home.projectList
    })
  },
  methods: {
    // 导出 SBOM
    exportSBOM (row) {
      this.$refs.exportSBOM.xhr = downloadScmSBOMReport
      this.$refs.exportSBOM.form.reportName = row.name
      this.$refs.exportSBOM.form.projectId = row.projectId
      this.$refs.exportSBOM.form.taskIds = [row.taskId]
      this.$refs.exportSBOM.dialogVisible = true
    },

    // 批量导出
    async getExcelConfirm (row, dimensionality) {
      if (dimensionality === 0) {
        this.$refs.createReport.use(row.map(x => x.id))
        return
      }
      const [error, res] = await to(excelConfirm({
        repoIds: row.map(x => x.id),
        projectId: this.project.id,
        dimensionality: dimensionality,
        condition: this.searchCondition
      }))
      if (res) {
        setTimeout(() => popup({
          title: '提示',
          width: '550px',
          showConfirmButton: true,
          render (h) {
            return h('el-row', { class: 'font-base' }, [
              h('p', {}, [
                '导出所有仓库检测数据，共 ',
                h('span', { class: 'text-primary font-bold' }, `${res.data.total}`),
                ' 个仓库，本次将导出 ',
                h('span', { class: 'text-primary font-bold' }, `${res.data.exportCount}`),
                ' 个检测结果，点击“确定”按钮继续导出~'
              ]),
              h('p', { style: { paddingTop: '15px' } }, '注：只有检测成功的仓库才可导出。')
            ])
          },
          beforeClose: async (action, next) => {
            if (action === 'confirm') {
              const [error, result] = await to(excelGenerate({
                repoIds: res.data.repoIds,
                projectId: this.project.id,
                dimensionality: dimensionality
              }))
              next()
              if (result) {
                setTimeout(() => popup({
                  title: '提示',
                  width: '550px',
                  confirmButtonText: '去下载',
                  cancelButtonText: '留在本页',
                  render (h) {
                    return h('el-row', { class: 'font-base' }, [
                      h('p', {}, [h('i', {
                        class: 'el-icon-success text-success font-xxl m-r-5',
                        style: { verticalAlign: 'bottom' }
                      }, ''), '操作成功，请在报告管理中下载报告~']),
                      h('p', {
                        style: {
                          paddingTop: '15px',
                          wordBreak: 'break-word'
                        }
                      }, `报告名称：${result.data.reportName}`)
                    ])
                  },
                  beforeClose: (action, next) => {
                    next()
                    if (action === 'confirm') {
                      this.$router.push({ path: '/report/list' })
                    }
                  }
                }), 200)
              } else if (error !== null && typeof error === 'object') {
                this.$message.error(error.message)
              }
            } else {
              next()
            }
          }
        }), 200)
      } else if (error !== null && typeof error === 'object') {
        this.$message.error(error.message)
      }
    },
    // 重审回调
    investigateCallback () {
      this.searchCondition = ''
      this.$refs.multipleTable.clearSort()
      this.$refs.multipleTable.clearFilter()
      this.search()
    },
    /**
     * @name 打开新标签页，打开仓库地址
     * @param {Object} row
     * @return void
     */
    openNewTag (row) {
      window.open(row.webUrl + '/tree/' + row.branch)
    },
    excelAdd () {
      this.$router.push({
        path: '/scan/develop/repository/git/batchAdd'
      })
    },
    warehouseAdd () {
      this.$router.push({
        path: '/scan/develop/repository/git/batchAdd/warehouse'
      })
    },
    add () {
      getGitConf({
        projectId: this.project.id,
        loading: false
      })
        .then(({ data }) => {
          if (data.length > 0) {
            this.$router.push({
              path: '/scan/develop/repository/git/add'
            })
          } else {
            popup({
              width: '550px',
              content: '<div style="padding: 40px 0;text-align: center">您还未配置Git，请先配置Gti代码仓库地址后进行检测</div>',
              center: false,
              confirmButtonText: '立即配置',
              beforeClose: (action, next) => {
                if (action === 'confirm') {
                  this.config()
                }
                next()
              }
            })
          }
        })
        .catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 路由跳转
    routerPush (path) {
      this.$router.push({
        path: path
      })
    },

    // 查看
    examine (row) {
      this.$refs.examine.echo = row
      this.$refs.examine.dialogVisible = true
    },

    // 配置git
    config (projectId) {
      const params = {
        path: '/scan/develop/repository/git/config'
      }
      projectId && (params.query = { projectId })
      this.$router.push(params)
    },

    // 配置git
    gitConf () {
      this.$refs.gitConf.dialogVisible = true
      this.$refs.gitConf.form.type = this.stashType
    },

    // 导出文件
    exportFile (type) {
      if (this.multipleSelection.length > 0) {
        this.exportFileSubmit(type)
      } else {
        this.$confirm(
          `导出所有${
            type === 1 ? '组件' : type === 2 ? '漏洞' : ''
          }数据，是否继续导出？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.exportFileSubmit(type)
          })
          .catch(() => {
          })
      }
    },

    // 导出文件
    async exportFileSubmit (type) {
      try {
        const ids = this.multipleSelection.map(x => x.id)
        const response = await exportRepository({
          idList: ids,
          projectId: this.project.id,
          type: type
        })
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    // 详情
    detail (row, suffix = '', e = 10) {
      this.$router.push({
        path: '/scan/develop/repository/git/details' + suffix,
        query: {
          id: row.id,
          project: row.projectId,
          scheduleTaskSwitchStatus: row.scheduleTaskSwitchStatus,
          scheduleTaskFrequencyType: row.scheduleTaskFrequencyType,
          scheduleTaskDayOfWeek: row.scheduleTaskDayOfWeek,
          scheduleTaskTimeOfDay: row.scheduleTaskTimeOfDay,
          name: row.name,
          gitServerType: row.gitServerType,
          _securityLevel: e
        }
      })
    },
    // 删除
    delete (row, codeOnly) {
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
    // 删除
    del (row, codeOnly) {
      const params = { idList: isArray(row) ? row.map(x => x.id) : [row.id] }
      codeOnly && (params.codeOnly = true)

      popup({
        width: '550px',
        content: `<div style="padding: 40px 0;text-align: center">
                       ${codeOnly ? '确定要删除代码吗？删除后您可点击“重审”按钮再次重新对仓库进行检测' : '确定要删除仓库吗？删除后该仓库关联的代码及所有审查记录会同步删除！'}
                   </div>`,
        beforeClose: async (action, next) => {
          if (action === 'confirm') {
            const [error] = await to(logicDelete(params))
            if (typeof error === 'object' && error !== null) {
              this.$message.error(error.message)
            } else {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$refs.multipleTable.clearSelection()
              this.initList('auto')
            }
            next()
          } else {
            next()
          }
        }
      })
    },
    // webhook配置
    webhook (row) {
      this.$refs.webhook.dialogVisible = true
      this.$refs.webhook.id = row.id
    },
    // 更多操作
    ops (event, row) {
      event(row)
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
      this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
      this.currentPage = 1
      this.initList()
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
        this.initChartHandler('auto')
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
        name: this.searchCondition,
        loading: false
      }

      if (this.project.id === -1 && hasOwn(this.searchData, 'projectId')) {
        params.projectId = this.searchData.projectId ? this.searchData.projectId : -1
      } else {
        params.projectId = this.project.id
      }

      getGitRepositoryList(params)
        .then(response => {
          this.loading = false
          this.tableData = []
          const data = response.data
          console.log(data)
          data.records.forEach(item => {
            this.$set(item, 'percentage', {
              value: PROGRESS_CONF[item.status]?.value,
              status: PROGRESS_CONF[item.status]?.status
            })
            this.tableData.push(item)
          })
          console.log(this.tableData)
          this.total = data.total
          this.currentPage = data.current
          if (this.timeout !== null) {
            clearTimeout(this.timeout)
            this.timeout = null
          }
          this.timeout = setTimeout(this.initList, 10000, 'auto')
        })
        .catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
            this.tableData = []
            this.loading = false
          }
        })
    },
    // 初始化仓库图
    initTypeChart (auto) {
      if (!this.authorityFilter(2301)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      if (!auto) {
        this.typeChartLoading = true
      }
      typeChart({
        projectId: this.project.id,
        loading: false
      })
        .then(response => {
          this.typeChartLoading = false
          this.typeData.data = get(response, 'data.pies', []).map(item => {
            return {
              value: item.count,
              name: item.gitServerTypeName,
              key: item.gitServerType
            }
          })
        })
        .catch(error => {
          this.typeChartLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 审查 / 批量审查
    detect (row) {
      let id = null
      if (row) {
        id = [row.id]
      } else if (this.multipleSelection.length > 0) {
        id = this.multipleSelection.map(x => x.id)
      }
      detect({
        idList: id
      })
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
    /**
     * @name 初始化图表
     */
    initChartHandler (auto) {
      this.$refs.componentChart.init(auto)
      this.$refs.vulnerability.init(auto)
      this.initTypeChart(auto)
    },
    // 获取git仓库类型
    gitList () {
      gitList().then(response => {
        this.sourceOptions = response.data.map(item => {
          return {
            value: item.code,
            text: item.name
          }
        })
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
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
        name: 'ScanDevelopRepositoryGitCompare',
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
        this.initTypeChart()
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout()
        })
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
      this.search()
      this.initTypeChart()
      this.gitList()
    }
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

    .input,
    .el-select {
      width: 240px;
      margin-right: 20px;
    }
  }

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

  :deep(.alert-content) {
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

:deep(.el-progress-bar__outer) {
  background-color: #f3f4f4;
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
