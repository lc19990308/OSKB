<template>
  <div>
    <DialogExportSBOM ref="exportSBOM"/>
    <QualityAccessDialog ref="qualityAccessDialog" />
    <ApiPushDialog ref="apiPush"></ApiPushDialog>
    <DialogCreateReport ref="report" moduleCode="15"></DialogCreateReport>
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
<!--              <el-button
                size="mini"
                @click="$refs.apiPush.open()"
                v-if="authorityFilter(2322)"
                type="primary"
              >
                API推送配置
              </el-button>-->
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
            :disabled="multipleSelection.filter(item => item.status === 6).length !== 2"
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
            v-if="authorityFilter([2327, 2326])"
          >
            <el-button
              size="medium"
              type="primary"
              :disabled="multipleSelection.length === 0"
            >
              批量管理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="createReport" v-if="authorityFilter(2327)">生成报告</el-dropdown-item>
              <el-dropdown-item :command="del" v-if="authorityFilter(2326)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <search-area
            placeholder="请输入镜像包名称"
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
        @selection-change="handleSelectionChange"
        :dynamic-options.sync="tableConfig"
      >
        <template slot="bar">
          <el-button size="medium" type="primary" @click="createReport()" v-if="authorityFilter(2327)">生成报告</el-button>
          <el-button size="medium" type="primary" @click="del()" v-if="authorityFilter(2326)">删除</el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"> </el-table-column>
        <el-table-column
          fixed="left"
          v-if="isDisplay"
          label="所属项目"
          min-width="100"
          show-overflow-tooltip
          prop="projectName"
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
        fixed="left"
        label="镜像名称"
        min-width="100"
        prop="name"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
            <el-link
              slot="reference"
              type="primary"
              class="ellipsis"
              :underline="false"
              :disabled="![6].includes(row.status)"
              @click="detail(row)"
            >
              {{ row.name }}
            </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="版本号"
        min-width="100"
        prop="version"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{row.version}}
        </template>
      </el-table-column>
      <el-table-column
        label="大小"
        min-width="100"
        prop="size"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.size | byteSize }}
        </template>
      </el-table-column>
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
        <template slot-scope="{ row }">
          <level-tag :level="row.securityLevelId" v-if="row.securityLevelId"></level-tag>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column
        label="软件包"
        min-width="100"
        prop="packageCount"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.packageCount}}
        </template>
      </el-table-column>
      <el-table-column
        label="组件"
        min-width="100"
        prop="component_num"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ row.componentNumVO ? row.componentNumVO.total : 0 }}
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
          <level-group :value="[
             scope.row.vulNumVO.serious,
             scope.row.vulNumVO.high,
             scope.row.vulNumVO.medium,
             scope.row.vulNumVO.low
             ]" v-if="scope.row.vulNumVO"/>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status"
        min-width="120"
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
        <template slot-scope="{row}">
          <!-- <el-tooltip v-if="row.status === 1" class="item" effect="dark" :content="matching(statusOptions, row.status, 'value', 'text')" placement="top">
            <oss-progress :percentage="matching(statusOptions, row.status, 'value', 'progress')"></oss-progress>
          </el-tooltip> -->
          <oss-dot :type="matching(statusOptions, row.status, 'value', 'type')">
            {{ matching(statusOptions, row.status, 'value', 'text') }}
          </oss-dot>
      </template>
      </el-table-column>
      <el-table-column label="质量门禁" min-width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{row.qualityResult === 0 ? '不通过' : row.qualityResult === 1 ? '通过' : '-'}}
          </template>
        </el-table-column>
      <el-table-column
        label="镜像来源"
        prop="status"
        min-width="250"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <div v-if="row.type === 1">本地上传</div>
          <div v-if="row.type === 2" style="display: flex; align-items: center">
            <img :src="repositoryOptions.find(item => item.value === row.repositoryType).icon" alt="">
            <span style="margin-left: 5px">{{row.repositoryUrl}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        min-width="200"
        prop="create_date"
        show-overflow-tooltip>
        <template v-slot:header>
          <oss-table-sort
            prop="create_date"
            @change="search"
            :sort-field.sync="searchData.sortFieldList"
            :sort-type.sync="searchData.sortTypeList"
          >
            上传时间
          </oss-table-sort>
        </template>
        <template slot-scope="{ row }">
          {{ row.createDate }}
        </template>
      </el-table-column>
        <el-table-column
          label="最近检测完成"
          min-width="200"
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
      <template slot-scope="{ row }">
        {{ row.finishDate ? row.finishDate : '-' }}
      </template>
    </el-table-column>
      <el-table-column
        label="检测时长"
        min-width="100"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.detectDuration ? row.detectDuration : '-' }}
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
              :disabled="row.status !== 6"
              tooltip-content="导出SBOM"
              v-if="authorityFilter(2327)"
              class="iconSBOM1"
              @click="exportSBOM(row)"
            ></icon-button>
            <icon-button
              :disabled="row.status !== 6"
              tooltip-content="报告"
              class="iconshengchengbaogao"
              v-if="authorityFilter(2327)"
              @click="createReport(row)"
            ></icon-button>
            <icon-button
              @click="del(row)"
              v-if="authorityFilter(2326)"
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
  getToken
} from '@/api/home/scan/integration/sourceCode'
import {
  integrationImageList,
  componentLevelChart,
  vulLevelChart
} from '@/api/home/scan/integration/mirrorImage'
import {
  batchDelImageRecord
} from '@/api/home/scan/container/mirror'
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
      isDisplay: this.$store.state.home.project.id === -1,
      project: this.$store.state.home.project,
      tableConfig: {
        columns: [
          {
            label: '所属项目',
            checked: true,
            disabled: true
          },
          {
            label: '镜像名称',
            checked: true,
            disabled: true
          },
          {
            label: '版本号',
            checked: true,
            disabled: false
          },
          {
            label: '大小',
            checked: true,
            disabled: false
          },
          {
            label: '风险等级',
            checked: true,
            disabled: false
          },
          {
            label: '软件包',
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
            label: '镜像来源',
            checked: true,
            disabled: false
          },
          {
            label: '质量门禁',
            checked: true,
            disabled: false
          },
          {
            label: '上传时间',
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
        uuid: 'integratedMirrorImageList',
        to: '操作'
      },
      stashType: 1,
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
          value: 0,
          text: '未检测',
          className: 'text-regular',
          type: 'info',
          progress: 10
        },
        {
          value: 1,
          text: '拉取镜像中',
          className: 'text-secondary',
          type: 'warning',
          progress: 100
        },
        {
          value: 2,
          text: '拉取镜像成功',
          className: 'text-success',
          type: 'success',
          progress: 100
        },
        {
          value: 3,
          text: '拉取镜像失败',
          className: 'text-danger',
          type: 'danger',
          progress: 100
        },
        {
          value: 4,
          text: '排队中',
          className: 'text-secondary',
          type: 'warning',
          progress: 100
        },
        {
          value: 5,
          text: '检测中',
          className: 'text-secondary',
          type: 'warning',
          progress: 100
        },
        {
          value: 6,
          text: '检测完成',
          className: 'text-success',
          type: 'success',
          progress: 100
        },
        {
          value: 7,
          text: '出错结束',
          className: 'text-danger',
          type: 'danger',
          progress: 100
        },
        {
          value: 8,
          text: '检测超时',
          className: 'text-danger',
          type: 'danger',
          progress: 100
        }
        // {
        //   value: 9,
        //   text: '队列失败',
        //   className: 'text-danger',
        //   type: 'danger',
        //   progress: 100
        // }
      ],
      searchCondition: '',
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      searchData: {
        sortFieldList: ['finish_date'],
        sortTypeList: [1],
        projectId: null
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
      this.$refs.exportSBOM.form.reportName = row.name
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
    detail (row, e = 10) {
      this.$router.push({
        path: '/scan/integration/mirrorImage/details',
        query: {
          id: row.id,
          project: row.projectId,
          task: row.taskId,
          _securityLevel: row.securityLevelId
        }
      })
    },

    // 删除
    del (row) {
      let ids = []
      if (row) {
        ids.push(row.id)
      } else if (this.multipleSelection.length > 0) {
        ids = this.multipleSelection.map(x => x.id)
      }
      this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          batchDelImageRecord({
            idList: ids
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
      if (!this.authorityFilter(2325)) {
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
        name: this.searchCondition,
        loading: false
      }

      if (this.project.id === -1 && hasOwn(this.searchData, 'projectId')) {
        params.projectId = this.searchData.projectId ? this.searchData.projectId : -1
      } else {
        params.projectId = this.project.id
      }
      integrationImageList(params)
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
      if (!this.authorityFilter(2325)) {
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
      if (!this.authorityFilter(2325)) {
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
        this.$refs.report.use([row.id])
      } else {
        if ((this.multipleSelection || []).filter(item => item.status !== 6).length > 0) {
          this.$message.warning('选择导出的任务中包含未检测完成的任务，无法导出，请重新选择。')
          return
        }
        this.$refs.report.use((this.multipleSelection || []).map(item => item.id))
      }
    },
    // 查看对比
    compare () {
      const multipleSelection = this.multipleSelection.filter(item => item.status === 6).sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate))
      this.$router.push({
        name: 'ScanIntegrationMirrorImageCompare',
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
