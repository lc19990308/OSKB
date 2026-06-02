<template>
  <div>
    <DialogExportSBOM ref="exportSBOM"/>
    <dialog-upload-app ref="uploadApp" @callback="initList"/>
    <dialog-report ref="report" moduleCode="1"></dialog-report>
    <dialog-redetect ref="redetect" @callback="initList"></dialog-redetect>
    <el-row :gutter="20" class="wrap">
      <el-col :span="8">
        <div class="common-bg">
          <div class="common-header">
            应用包统计
          </div>
          <annulus-pie-chart
            :height="280"
            :legend="false"
            :center-label="'应用包数'"
            :chart-data="state.appChartData"
            :loading="state.appChartLoading"
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
            :legend="false"
            :center-label="'组件数'"
            :chart-data="state.componentChartData"
            :loading="state.componentChartLoading"
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
            :legend="false"
            :center-label="'漏洞数'"
            :chart-data="state.vulChartData"
            :loading="state.vulChartLoading"
          ></annulus-pie-chart>
        </div>
      </el-col>
    </el-row>
    <div class="view-content">
      <AppQueryBox ref="query" v-model="searchData" @change="search"></AppQueryBox>
      <sticky
        :sticky-top="65"
        :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
      >
        <div class="clearfix">
          <el-button
            size="medium"
            type="primary"
            @click="$refs.uploadApp.dialogVisible = true"
            v-if="authorityFilter(503)"
          >
            上传应用包
          </el-button>

          <el-button
            size="medium"
            type="primary"
            @click="compare"
            :disabled="!(multipleSelection.filter(item => item.status===2).length === 2)"
          >
            查看对比
            <el-tooltip placement="top" :offset="30">
              <div slot="content">选择两个检测完成的任务时可用</div>
              <i class="el-icon-warning-outline el-icon--right"></i>
            </el-tooltip>
          </el-button>

          <el-dropdown
            trigger="click"
            v-if="authorityFilter([903, 904, 905])"
          >
            <el-button :disabled="!(multipleSelection.length > 0)" size="medium" type="primary">
              批量管理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="authorityFilter(903)" @click.native="$refs.redetect.open(multipleSelection)">审查</el-dropdown-item>
              <el-dropdown-item v-if="authorityFilter(905)" @click.native="exportSBOM(multipleSelection)">生成SBOM</el-dropdown-item>
              <el-dropdown-item v-if="authorityFilter(905)" @click.native="createReport(multipleSelection)">生成报告</el-dropdown-item>
              <el-dropdown-item v-if="authorityFilter(904)" @click.native="del(multipleSelection)">删除应用包
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </sticky>
      <el-table
        ref="table"
        row-key="appPackageId"
        v-loading="loading"
        tooltip-effect="dark"
        :dynamic-options.sync="tableOptions"
        @filter-change="searchFilter"
        @sort-change="searchSort"
        :data="tableData"
        @selection-change="multipleSelection = $event"
      >
        <template slot="bar">
          <el-button size="medium" type="primary" v-if="authorityFilter(903)" @click.native="$refs.redetect.open(multipleSelection)">审查</el-button>
          <el-button size="medium" type="primary" v-if="authorityFilter(905)" @click.native="exportSBOM(multipleSelection)">生成SBOM</el-button>
          <el-button size="medium" type="primary" v-if="authorityFilter(905)" @click.native="createReport(multipleSelection)">生成报告</el-button>
          <el-button size="medium" type="primary" v-if="authorityFilter(904)" @click.native="del(multipleSelection)">删除应用包</el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"></el-table-column>
        <el-table-column
          label="应用包名称"
          prop="name"
          min-width="150"
        >
          <template slot-scope="{ row }">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover">
              <el-link
                slot="reference"
                type="primary"
                class="ellipsis"
                :underline="false"
                :disabled="![2].includes(row.status)"
                @click="detail(row)"
              >
                {{ row.name }}
              </el-link>

              {{get(row, 'name')}}<br>
              {{get(row, 'originPath')}}
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="来源"
          width="150px"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.originInAppPackages"
              :filters="originInAppPackageOptions"
              @change="search"
              title="来源"
            />
          </template>
          <template slot-scope="{row}">
            {{matching(originInAppPackageOptions, row.originInAppPackage, 'value', 'text', '本地上传')}}
          </template>
        </el-table-column>
        <el-table-column
          label="版本号"
          prop="version"
          min-width="80"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="大小"
          prop="size"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{ get(row, 'byteSize', 1000) | byteSize }}
          </template>
        </el-table-column>
        <el-table-column
          label="所属项目"
          min-width="100"
          prop="projectName"
          v-if="projectMixin.id === -1"
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
          label="组件"
          width="100"
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
            <el-tooltip effect="dark" :content="`严重：${get(row, 'componentNumVO.serious', 0)} | 高危：${get(row, 'componentNumVO.high', 0)} | 中危：${get(row, 'componentNumVO.medium', 0)} | 低危：${get(row, 'componentNumVO.low', 0)} | 无漏洞：${get(row, 'componentNumVO.normal', 0)}`" placement="top">
              <el-link :underline="false" @click="detail(row)">
                {{ get(row, 'componentNumVO.total', 0) }}
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="漏洞"
          width="200px"
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
          <template slot-scope="scope">
            <level-group @click="detail(scope.row, '/scan/app/component/details/vul', $event)" :value="[
             scope.row.vulNum.serious,
             scope.row.vulNum.high,
             scope.row.vulNum.medium,
             scope.row.vulNum.low
             ]">
            </level-group>
          </template>
        </el-table-column>

        <el-table-column
          label="检测状态"
          min-width="100"
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.status"
              :filters="statusOptions"
              @change="search"
              title="检测状态"
            />
          </template>
          <template slot-scope="{row}">
            <el-tooltip v-if="row.status === 1" class="item" effect="dark" :content="matching(statusOptions, row.status, 'value', 'text')" placement="top">
              <oss-progress :percentage="matching(statusOptions, row.status, 'value', 'progress')"></oss-progress>
            </el-tooltip>
            <oss-dot v-else :type="matching(statusOptions, row.status, 'value', 'type')">
              {{ matching(statusOptions, row.status, 'value', 'text') }}
            </oss-dot>
          </template>
        </el-table-column>
        <el-table-column label="检测规则" show-overflow-tooltip min-width="150" >
          <template slot-scope="{ row }">
            <el-link :underline="false" v-if="row.status > -1" @click="$refs.redetect.open(row, 'readonly')">
              {{ row.checkType === 0 ? '快速审查；' : row.checkType === 1 ? '深度审查；' : '' }}
              {{ row.deepLimit > -1 ? row.deepLimit + '层解析；' : '默认层级；' }}
              {{ row.cleanLevel === 1 ? '快速清洗' : row.cleanLevel === 2 ? '深度清洗' : '' }}
            </el-link>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          label="上传时间"
          prop="upload_date"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <oss-table-sort
              prop="upload_date"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              上传时间
            </oss-table-sort>
          </template>
          <template slot-scope="scope">
            {{ scope.row.uploadDate }}
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
          <template slot-scope="{ row }">
            {{ row.finishDate ? row.finishDate : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="检测时长" min-width="100" show-overflow-tooltip>
<!--          <template v-slot:header>-->
<!--            <oss-table-sort-->
<!--              prop="detect_duration"-->
<!--              @change="search"-->
<!--              :sort-field.sync="searchData.sortFieldList"-->
<!--              :sort-type.sync="searchData.sortTypeList"-->
<!--            >-->
<!--              检测时长-->
<!--            </oss-table-sort>-->
<!--          </template>-->
          <template slot-scope="{ row }">
            {{ row.detectDuration ? row.detectDuration : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150px">
          <template slot-scope="{ row }">
            <icon-button
              :disabled="![-1,-2,2,3,8].includes(row.status)"
              v-if="authorityFilter(903)"
              tooltip-content="审查"
              class="iconshencha"
              @click="$refs.redetect.open(row)"
            ></icon-button>
            <icon-button
              :disabled="![2].includes(row.status)"
              tooltip-content="导出SBOM"
              v-if="authorityFilter(905)"
              class="iconSBOM1"
              @click="exportSBOM(row)"
            ></icon-button>
            <icon-button
              :disabled="![2].includes(row.status)"
              v-if="authorityFilter(905)"
              tooltip-content="生成报告"
              class="iconshengchengbaogao"
              @click="createReport(row)"
            ></icon-button>
            <icon-button
              v-if="authorityFilter(904)"
              tooltip-content="删除"
              class="icondel"
              @click="del(row)"
            ></icon-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer-wrapper clearfix">
        <pagination
          @size-change="initList"
          @current-change="initList"
          :current-page.sync="searchData.currentPage"
          :page-size.sync="searchData.pageSize"
          :total="total"
          class="right"
        ></pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import {
  appList,
  appLevelNumChart,
  vulLevelNumChart,
  componentLevelNumChart
} from '@/api/home/assets/app/component'
import { delTask } from '@/api/home/scan/app'
import DialogUploadApp from './dialogUploadApp'
import AnnulusPieChart from '@/components/chart/AnnulusPieChart.vue'
import DialogRedetect from '@/views/home/scan/app/component/main/dialogRedetect'
import AppQueryBox from './AppQueryBox'
import DialogReport from '@/views/home/report/report/dialogCreateReport'
import { levelOptions } from '@/store/constant'
import list from '@/mixins/list'
import { hasOwn } from '@/utils'
import DialogExportSBOM from '@/views/home/report/report/dialogExportSBOM.vue'
import { downloadAppSBOMReport } from '@/api/home/report'

export default defineComponent({
  name: 'app',
  mixins: [list],
  components: {
    DialogExportSBOM,
    DialogUploadApp,
    AnnulusPieChart,
    DialogRedetect,
    DialogReport,
    AppQueryBox
  },
  data () {
    return {
      levelOptions,
      loading: false,
      tableOptions: {
        to: '操作',
        uuid: 'AppComponentPackageThreatReviewList',
        columns: [
          {
            label: '应用包名称',
            checked: true,
            disabled: true
          },
          {
            label: '来源',
            checked: true,
            disabled: true
          },
          {
            label: '版本号',
            checked: true,
            disabled: true
          },
          {
            label: '大小',
            checked: false,
            disabled: false
          },
          {
            label: '所属项目',
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
            label: '检测状态',
            checked: true,
            disabled: false
          },
          {
            label: '检测规则',
            checked: true,
            disabled: false
          },
          {
            label: '上传时间',
            checked: false,
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
            label: '操作',
            checked: true,
            disabled: true
          }
        ]
      },
      multipleSelection: [],
      tableData: [],
      statusOptions: [
        {
          value: -2,
          text: '检测超时',
          className: 'text-danger',
          type: 'danger',
          progress: 0
        },
        {
          value: -1,
          text: '未检测',
          className: 'text-regular',
          type: 'info',
          progress: 10
        },
        {
          value: 0,
          text: '排队中',
          className: 'text-secondary',
          type: 'warning',
          progress: 30
        },
        {
          value: 1,
          text: '检测中',
          className: 'text-primary',
          type: 'primary',
          progress: 80
        },
        {
          value: 2,
          text: '检测完成',
          className: 'text-success',
          type: 'success',
          progress: 100
        },
        {
          value: 3,
          text: '出错结束',
          className: 'text-danger',
          type: 'danger',
          progress: 100
        }
        // {
        //   value: 8,
        //   text: '队列失败',
        //   className: 'text-danger',
        //   type: 'danger',
        //   progress: 100
        // }
      ],
      total: 0,
      state: {
        project: this.$store.state.home.project,
        appChartLoading: false,
        componentChartLoading: false,
        vulChartLoading: false,
        appChartData: {
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
        vulChartData: {
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
            // {
            //   value: 0,
            //   name: '无漏洞',
            //   color: '#4A9C8C',
            //   key: 'normalCount'
            // }
          ],
          sum: 0
        }
      },
      searchData: {
        name: undefined,
        currentPage: 1,
        sortFieldList: ['upload_date'],
        originInAppPackages: undefined,
        sortTypeList: [1]
      },
      originInAppPackageOptions: [
        {
          value: 1,
          text: '本地上传'
        },
        {
          value: 2,
          text: 'FTP拉取'
        },
        {
          value: 3,
          text: '华为云OBS'
        },
        {
          value: 4,
          text: '阿里云OSS'
        },
        {
          value: 5,
          text: 'HTTP拉取'
        }
      ]
    }
  },
  methods: {
    hasOwn,

    // 导出 SBOM
    exportSBOM (row) {
      if (Array.isArray(row) && row.filter(item => item.status !== 2).length > 0) {
        this.$message.warning('勾选项存在不可导出应用')
        return false
      }
      this.$refs.exportSBOM.xhr = downloadAppSBOMReport
      this.$refs.exportSBOM.form.reportName = row.name || undefined
      // this.$refs.exportSBOM.form.projectId = row.projectId
      this.$refs.exportSBOM.form.projectId = Array.isArray(row) ? this.projectMixin.id : row.projectId
      this.$refs.exportSBOM.form.taskIds = Array.isArray(row) ? row.map(item => item.taskId) : [row.taskId]
      this.$refs.exportSBOM.isBatch = Array.isArray(row)
      this.$refs.exportSBOM.dialogVisible = true
    },

    // 搜索
    search () {
      this.$refs.table.clearSelection()
      this.searchData.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList (auto) {
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
        this.initAppChart()
        this.initComponentChart()
        this.initVulChart()
      }

      appList({
        ...this.searchData,
        pageNum: this.searchData.currentPage,
        projectId: this.projectMixin.id,
        loading: false
      }).then(response => {
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
          this.total = 1
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    // 生成报告
    createReport (row) {
      if (isArray(row)) {
        if ((row || []).filter(item => item.status !== 2).length > 0) {
          this.$message.warning('选择导出的任务中包含未检测完成的任务，无法导出，请重新选择。')
          return
        }
        this.$refs.report.use((row || []).map(item => item.appPackageId))
      } else {
        this.$refs.report.use([row.appPackageId], row.name)
      }
    },

    // 删除
    del (row) {
      this.$popup({
        width: '550px',
        underline: true,
        render (h) {
          return h('p', { style: { padding: '0 25px' } }, '确定要删除所选应用包吗？删除后该应用包关联的源文件及所有检测结果会同步删除！')
        },
        beforeClose: async (a, c) => {
          if (a === 'confirm') {
            const [error] = await to(delTask({
              ids: isArray(row) ? row.map(i => i.appPackageId) : [row.appPackageId]
            }))
            if (isObject(error)) {
              this.$message.error(error.message)
            } else {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$refs.table.clearSelection()
              this.initAppChart()
              this.initComponentChart()
              this.initVulChart()
              this.initList()
            }
          }
          c()
        }
      })
    },

    // 详情
    detail (row, path, e = 10) {
      if (row.status !== 2) return
      this.$router.push({
        path: path || '/scan/app/component/details',
        query: {
          appPackage: row.appPackageId,
          project: row.projectId,
          task: row.taskId,
          _securityLevel: e
        }
      })
    },

    // 初始化应用包数图
    initAppChart () {
      if (!this.authorityFilter(901)) {
        return 0
      }
      this.state.appChartLoading = true
      appLevelNumChart({
        projectId: this.projectMixin.id,
        loading: false
      })
        .then(response => {
          this.state.appChartLoading = false
          const data = response.data
          this.state.appChartData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.state.appChartData.sum = data.totalCount
        })
        .catch(error => {
          this.state.appChartLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化组件图
    initComponentChart () {
      if (!this.authorityFilter(901)) {
        return 0
      }
      this.state.componentChartLoading = true
      componentLevelNumChart({
        projectId: this.projectMixin.id,
        loading: false
      })
        .then(response => {
          this.state.componentChartLoading = false
          const data = response.data
          this.state.componentChartData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.state.componentChartData.sum = data.totalCount
        })
        .catch(error => {
          this.state.componentChartLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化漏洞图
    initVulChart () {
      if (!this.authorityFilter(901)) {
        return 0
      }
      this.state.vulChartLoading = true
      vulLevelNumChart({
        projectId: this.projectMixin.id,
        loading: false
      })
        .then(response => {
          this.state.vulChartLoading = false
          const data = response.data
          this.state.vulChartData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.state.vulChartData.sum = data.totalCount
        })
        .catch(error => {
          this.state.vulChartLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    // 查看对比
    compare () {
      const multipleSelection = this.multipleSelection.sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate))
      this.$router.push({
        name: 'ScanAppComponentCompare',
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
        this.search()
        this.initAppChart()
        this.initComponentChart()
        this.initVulChart()
      }
    }
  },
  mounted () {
    if (this.$store.state.home.project !== null) {
      this.search()
      this.initAppChart()
      this.initComponentChart()
      this.initVulChart()
    }
  },
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
})
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;
  margin-top: 20px;

  .common-header {
    padding-top: 15px;
    padding-left: 15px;
  }

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
</style>
