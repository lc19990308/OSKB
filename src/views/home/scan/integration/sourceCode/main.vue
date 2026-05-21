<template>
  <div>
    <DialogExportSBOM ref="exportSBOM"/>
    <QualityAccessDialog ref="qualityAccessDialog" />
    <ApiPushDialog ref="apiPush"></ApiPushDialog>
    <DialogCreateReport ref="report" moduleCode="11"></DialogCreateReport>
    <dialog-get-project
      ref="copyText"
      confirm-text="复制Token"
      @change="
        getToken($event, () => {
          copyText(token);
          selectProject_mixin($event);
        })
      "
    ></dialog-get-project>
    <el-row :gutter="20" class="wrap">
      <el-col :span="24">
        <el-alert :closable="false" type="primary" class="header-alert">
          <div class="alert-content">
            <i class="el-icon-info"></i>
            本平台支持与Jenkins、嘉为蓝鲸、腾讯云Coding、Azure DevOps等DevOps流水线工具集成，检测结果会在此处统一管理，请在【集成配置与管理】--【DevOps集成插件】内下载对应插件开始您的检测。
            <div class="handle">
              <el-button
                size="mini"
                @click="$refs.apiPush.open()"
                v-if="authorityFilter(2322)"
                type="primary"
              >
                API推送配置
              </el-button>
              <el-button
                v-if="project.id !== -1"
                size="mini"
                type="primary"
                @click="copyText(token)"
              >
                复制Token
              </el-button>
              <el-button
                v-else
                size="mini"
                type="primary"
                @click="$refs.copyText.openDialog()"
              >
                复制Token
              </el-button>
            </div>
          </div>
        </el-alert>
      </el-col>
      <el-col :span="12">
        <div class="common-bg">
          <div class="common-header">
            组件统计
          </div>
          <annulus-pie-chart
            :height="300"
            :legend="false"
            :center-label="'组件统计'"
            :chart-data="componentLevelData"
            :loading="componentChartLoading"
          ></annulus-pie-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="common-bg">
          <div class="common-header">
            漏洞统计
          </div>
          <annulus-pie-chart
            :height="300"
            :legend="false"
            :center-label="'漏洞统计'"
            :chart-data="vulLevelData"
            :loading="vulChartLoading"
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
            size="medium"
            type="primary"
            v-if="authorityFilter(2321)"
            @click="$refs.qualityAccessDialog.open()"
          >
            质量门禁
          </el-button>
          <el-button
            size="medium"
            type="primary"
            :disabled="multipleSelection.filter(item => item.status === 2).length !== 2"
            @click="compare"
          >
            查看对比
            <el-tooltip placement="top" :offset="30">
              <div slot="content">选择两个检测完成的任务时可用</div>
              <i class="el-icon-warning-outline el-icon--right"></i>
            </el-tooltip>
          </el-button>
          <el-dropdown
            trigger="click"
            @command="ops($event)"
            v-if="authorityFilter([2312, 2311])"
          >
            <el-button
              size="medium"
              type="primary"
              :disabled="multipleSelection.length === 0"
            >
              批量管理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="createReport" v-if="authorityFilter(2311)">生成报告</el-dropdown-item>
              <el-dropdown-item :command="del" v-if="authorityFilter(2312)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <search-area
            placeholder="请输入应用包名称/说明"
            @search="search"
            v-model="searchCondition"
            right-float
          ></search-area>
        </div>
      </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        v-loading="loading"
        row-key="taskId"
        tooltip-effect="dark"
        @filter-change="searchFilter"
        @sort-change="searchSort"
        @selection-change="handleSelectionChange"
        :dynamic-options.sync="tableConfig"
      >
        <template slot="bar">
          <el-button size="medium" type="primary" @click="createReport()" v-if="authorityFilter(2311)">生成报告</el-button>
          <el-button size="medium" type="primary" @click="del()" v-if="authorityFilter(2312)">删除</el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"> </el-table-column>
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
        <el-table-column
          label="应用包名称"
          min-width="150"
          prop="appPackageName"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <el-link
              :underline="false"
              type="primary"
              :disabled="row.status !== 2"
              @click="detail(row)"
            >
              {{get(row, 'appPackageName', '-')}}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="版本号"
          prop="version"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="风险等级"
          min-width="100"
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
          min-width="100"
          label="组件"
          prop="component_num"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <oss-table-sort
              prop="component_num"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              组件
            </oss-table-sort>
          </template>
          <template slot-scope="{row}">
            <el-link  @click="detail(row)" :underline="false">
              {{ get(row, 'componentNum', 0) }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="漏洞"
          width="200"
          :sort-orders="['descending','ascending',null]"
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
          <template slot-scope="scope">
            <level-group @click="detail(scope.row, '/scan/integration/sourceCode/details/vul', $event)" :value="[
             scope.row.vulNum.serious,
             scope.row.vulNum.high,
             scope.row.vulNum.medium,
             scope.row.vulNum.low
             ]" />
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="100"
          show-overflow-tooltip
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
            <span :class="matching(statusOptions, scope.row.status,'value', 'class')">
               {{matching(statusOptions, scope.row.status,'value', 'text', '-')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="检测规则" min-width="120" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <template v-if="row.status === 2">
              {{row.checkType === 0 ? '快速审查；' : row.checkType === 1 ? '深度审查；' : ''}}
              {{row.deepLimit > -1 ? row.deepLimit + '层解析；' : '默认层级；'}}
              {{row.cleanLevelId === 1 ? '快速清洗' : row.cleanLevelId === 2 ? '深度清洗' : ''}}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column label="质量门禁" min-width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{row.qualityResult === 0 ? '不通过' : row.qualityResult === 1 ? '通过' : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="来源" min-width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ matching(types, row.integrationType, 'value', 'text', '-') }}
          </template>
        </el-table-column>
        <el-table-column
          label="最近检测完成"
          min-width="150"
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
          <template slot-scope="{row}">
            {{ get(row, 'finishDate', '-') }}
          </template>
        </el-table-column>
        <el-table-column label="检测时长" min-width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ row.detectDuration }}
          </template>
        </el-table-column>
        <el-table-column label="说明" min-width="130" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{get(row, 'description', '-')}}
          </template>
        </el-table-column>
        <el-table-column label="检测阶段" min-width="100" show-overflow-tooltip prop="stage">
          <!-- <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.detectPhases"
              :filters="phaseOptions"
              @change="search"
              title="检测阶段"
              multiple
            />
          </template> -->
          <template slot-scope="{ row }">
            {{ row.stage || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <icon-button
              :disabled="row.status !== 2"
              tooltip-content="导出SBOM"
              v-if="authorityFilter(2311)"
              class="iconSBOM1"
              @click="exportSBOM(row)"
            ></icon-button>
            <icon-button
              :disabled="row.status !== 2"
              tooltip-content="报告"
              class="iconshengchengbaogao"
              v-if="authorityFilter(2311)"
              @click="createReport(row)"
            ></icon-button>
            <icon-button
              @click="del(row)"
              v-if="authorityFilter(2312)"
              tooltip-content="删除"
              class="icondel"
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
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky/index.vue'
import AnnulusPieChart from '@/components/chart/AnnulusPieChart.vue'
import DialogExportSBOM from '@/views/home/report/report/dialogExportSBOM.vue'
import { downloadDevopsSBOMReport } from '@/api/home/report'

import {
  integrationList,
  componentLevelChart,
  vulLevelChart,
  integrationDelete,
  getToken
} from '@/api/home/scan/integration/sourceCode'
import {
  copyText,
  hasOwn
} from '@/utils'
import MixinsList from '@/mixins/list.js'
import dialogGetProject from '@/views/home/scan/integration/sourceCode/dialogGetProject'
import { mapState } from 'vuex'
import projectMixins from '@/components/public/Layout/Project/mixins'
import QualityAccessDialog from '@/views/home/scan/integration/sourceCode/QualityAccessDialog'
import ApiPushDialog from '@/views/home/scan/integration/sourceCode/ApiPushDialog'
import DialogCreateReport from '@/views/home/report/report/dialogCreateReport'

export default {
  name: 'ScanDevelopIntegrationList',
  mixins: [MixinsList, projectMixins],
  components: {
    DialogCreateReport,
    DialogExportSBOM,
    ApiPushDialog,
    QualityAccessDialog,
    dialogGetProject,
    AnnulusPieChart,
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
            label: '应用包名称',
            checked: true,
            disabled: true
          },
          {
            label: '版本号',
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
            label: '检测规则',
            checked: false,
            disabled: false
          },
          {
            label: '质量门禁',
            checked: true,
            disabled: false
          },
          {
            label: '来源',
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
            checked: false,
            disabled: false
          },
          {
            label: '说明',
            checked: true,
            disabled: false
          },
          {
            label: '检测阶段',
            checked: true,
            disabled: false
          },
          {
            label: '操作',
            checked: true,
            disabled: true
          }
        ],
        uuid: 'integratedList',
        to: '操作'
      },
      stashType: 1,
      project: this.$store.state.home.project,
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
      types: [
        {
          value: 1,
          text: 'GitLab CI'
        },
        {
          value: 2,
          text: 'Jenkins'
        },
        {
          value: 3,
          text: '蓝鲸'
        },
        {
          value: 4,
          text: 'Coding'
        },
        {
          value: 5,
          text: 'Azure'
        }
      ],
      phaseOptions: [
        {
          value: 1,
          text: '编码'
        },
        {
          value: 2,
          text: '编译构建'
        },
        {
          value: 3,
          text: '打包镜像'
        },
        {
          value: 4,
          text: '上线运行'
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
          value: -2,
          text: '检测超时',
          class: 'text-danger',
          type: 'danger',
          progress: 0
        },
        {
          value: 0,
          text: '待检测'
        },
        {
          value: 1,
          text: '检测中',
          class: 'text-primary'
        },
        {
          value: 2,
          text: '检测完成',
          class: 'text-success'
        },
        {
          value: 3,
          text: '检测出错',
          class: 'text-danger'
        },
        {
          value: 4,
          text: '引擎下载失败',
          class: 'text-danger'
        },
        {
          value: 5,
          text: '文件出错',
          class: 'text-danger'
        },
        // {
        //   value: 6,
        //   text: 'IAST数据错误',
        //   class: 'text-danger'
        // },
        {
          value: 7,
          text: '未知错误',
          class: 'text-danger'
        }
        // {
        //   value: 8,
        //   text: '队列失败',
        //   class: 'text-danger'
        // }
      ],
      searchCondition: '',
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      searchData: {
        sortFieldList: ['finish_date'],
        sortTypeList: [1]
      },
      multipleSelection: [],
      loading: false,
      componentChartLoading: false,
      vulChartLoading: false,
      warehouseChartLoading: false,
      componentLevelData: {
        data: [
          {
            value: 0,
            name: '严重',
            color: '#991B1B',
            key: 'seriousCount'
          },
          {
            value: 0,
            name: '高危',
            color: '#EF4444',
            key: 'highCount'
          },
          {
            value: 0,
            name: '中危',
            color: '#F59E0B',
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
            color: '#10B981',
            key: 'normalCount'
          }
        ],
        sum: 0
      },
      vulLevelData: {
        data: [
          {
            value: 0,
            name: '严重',
            color: '#991B1B',
            key: 'seriousCount'
          },
          {
            value: 0,
            name: '高危',
            color: '#EF4444',
            key: 'highCount'
          },
          {
            value: 0,
            name: '中危',
            color: '#F59E0B',
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
      timeout: null,
      routePath: this.$route.path,
      token: ''
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
  methods: {
    // 导出 SBOM
    exportSBOM (row) {
      this.$refs.exportSBOM.xhr = downloadDevopsSBOMReport
      this.$refs.exportSBOM.form.projectId = row.projectId
      this.$refs.exportSBOM.form.reportName = row.appPackageName
      this.$refs.exportSBOM.form.taskIds = [row.taskId]
      this.$refs.exportSBOM.dialogVisible = true
    },

    // 路由跳转
    routerPush (path) {
      this.$router.push({
        path: path
      })
    },

    // 获取分支
    getToken (project, cd) {
      getToken({
        projectId: project,
        loading: false
      })
        .then(response => {
          this.token = response.data.token
          typeof cd === 'function' && cd()
        })
        .catch(error => {
          if (error) {
            this.$message.error(error.message)
          }
        })
    },

    // 安装插件
    install () {
      this.$refs.install.dialogVisible = true
    },

    // 详情
    detail (row, path, e = 10) {
      if (row.status !== 2) return
      this.$router.push({
        path: path || '/scan/integration/sourceCode/details',
        query: {
          app: row.appPackageId,
          task: row.taskId,
          project: row.projectId,
          _securityLevel: e
        }
      })
    },

    // 删除
    del (row) {
      let ids = []
      if (row) {
        ids.push(row.taskId)
      } else if (this.multipleSelection.length > 0) {
        ids = this.multipleSelection.map(x => x.taskId)
      }
      this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          integrationDelete({
            packageTaskIdList: ids
          })
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$refs.multipleTable.clearSelection()
              this.initComponentLevelChart()
              this.initVulLevelChart()
              this.initList()
            })
            .catch(error => {
              if (typeof error === 'object') {
                this.$message.error(error.message)
              }
            })
        })
        .catch(() => {
          this.$message({
            message: '已取消删除'
          })
        })
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
        this.searchData.sortFieldList = undefined
        this.searchData.sortTypeList = undefined
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
    initList (auto) {
      if (!this.authorityFilter(2310)) {
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
        this.initComponentLevelChart(true)
        this.initVulLevelChart(true)
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

      if (this.project.id === -1 && hasOwn(this.searchData, 'projectId')) {
        params.projectId = this.searchData.projectId ? this.searchData.projectId : -1
      } else {
        params.projectId = this.project.id
      }
      integrationList(params)
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

    // 初始化组件图
    initComponentLevelChart (auto) {
      if (!this.authorityFilter(2310)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      if (!auto) {
        this.componentChartLoading = true
      }
      componentLevelChart({
        projectId: this.project.id,
        loading: false,
        type: 1
      })
        .then(response => {
          this.componentChartLoading = false
          const data = response.data
          this.componentLevelData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.componentLevelData.sum = data.totalCount
        })
        .catch(error => {
          this.componentChartLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化漏洞图
    initVulLevelChart (auto) {
      if (!this.authorityFilter(2310)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      if (!auto) {
        this.vulChartLoading = true
      }
      vulLevelChart({
        projectId: this.project.id,
        loading: false
      })
        .then(response => {
          this.vulChartLoading = false
          const data = response.data
          this.vulLevelData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.vulLevelData.sum = data.totalCount
        })
        .catch(error => {
          this.vulChartLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    copyText: copyText,

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
      if (row) {
        this.$refs.report.use([row.appPackageId])
      } else {
        if ((this.multipleSelection || []).filter(item => item.status !== 2).length > 0) {
          this.$message.warning('选择导出的任务中包含未检测完成的任务，无法导出，请重新选择。')
          return
        }
        this.$refs.report.use((this.multipleSelection || []).map(item => item.appPackageId))
      }
    },
    // 查看对比
    compare () {
      const multipleSelection = this.multipleSelection.sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate))
      this.$router.push({
        name: 'ScanIntegrationSourceCodeCompare',
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
        this.initComponentLevelChart()
        this.initVulLevelChart()
        if (n.id !== -1) {
          this.getToken(n.id)
        }
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
      this.initList()
      this.initComponentLevelChart()
      this.initVulLevelChart()
      if (this.$store.state.home.project.id !== -1) {
        this.getToken(this.$store.state.home.project.id)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;
  margin-top: 20px;
}

.header-alert {
  position: relative;
  padding-left: 12px !important;
  padding-right: 12px !important;
  margin-bottom: 20px;

  :deep(.el-alert__content) {
    padding: 0 !important;
    margin-bottom: 5px;

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
