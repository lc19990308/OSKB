<template>
  <div>
    <DialogExportSBOM ref="exportSBOM"/>
    <dialog-upload-app ref="uploadApp" @callback="initList"/>
    <DialogEditSBOM ref="editSBOM" @change="initList"/>
    <dialog-report ref="report" moduleCode="14"></dialog-report>
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
            v-if="authorityFilter(3571)"
          >
            上传文件
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
          <el-dropdown trigger="click" :disabled="!(multipleSelection.length > 0)">
            <el-button :disabled="!(multipleSelection.length > 0)" size="medium" type="primary">
              批量管理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  @click.native="testing(multipleSelection)">检测
              </el-dropdown-item>
              <el-dropdown-item @click.native="exportSBOM(multipleSelection)">生成SBOM</el-dropdown-item>
              <el-dropdown-item @click.native="createReport(multipleSelection)">生成报告</el-dropdown-item>
              <el-dropdown-item @click.native="del(multipleSelection)">删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </sticky>
      <el-table
        ref="table"
        v-if="isShowTable"
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
          <el-button size="medium" type="primary" @click.native="testing(multipleSelection)">检测</el-button>
          <el-button size="medium" type="primary" @click.native="exportSBOM(multipleSelection)">生成SBOM</el-button>
          <el-button size="medium" type="primary" @click.native="createReport(multipleSelection)">生成报告</el-button>
          <el-button size="medium" type="primary" v-if="authorityFilter(3572)"
                     @click.native="del(multipleSelection)">删除</el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"></el-table-column>
        <el-table-column
          label="应用名称"
          prop="name"
          min-width="150"
        >
          <template slot-scope="{ row }">
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
          label="所属项目"
          min-width="100"
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
          label="组件数"
          width="100"
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
              组件数
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
          label="漏洞数"
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
              漏洞数
            </oss-table-sort>
          </template>
          <template slot-scope="scope">
            <level-group @click="detail(scope.row, '/scan/sbom/details/vul', $event)" :value="[
             scope.row.vulNum.serious,
             scope.row.vulNum.high,
             scope.row.vulNum.medium,
             scope.row.vulNum.low
             ]">
            </level-group>
          </template>
        </el-table-column>
        <el-table-column
          label="许可证数"
          width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <el-tooltip effect="dark" :content="`高风险：${get(row, 'licenseNumVO.highNum', 0)} | 中风险：${get(row,
            'licenseNumVO.mediumNum', 0)} | 低风险：${get(row, 'licenseNumVO.lowNum', 0)}`" placement="top">
              <el-link :underline="false" @click="detail(row, '/scan/sbom/details/license')">
                {{get(row, 'licenseNumVO.totalNum', 0)}}
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="上传人"
          prop="upload_date"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{get(row, 'creator', '本地上传')}}
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
          <template slot-scope="{row}">
            <el-tooltip v-if="row.status === 1" class="item" effect="dark" :content="matching(statusOptions, row.status, 'value', 'text')" placement="top">
              <oss-progress :percentage="matching(statusOptions, row.status, 'value', 'progress')"></oss-progress>
            </el-tooltip>
            <oss-dot v-else :type="matching(statusOptions, row.status, 'value', 'type')">
              {{ matching(statusOptions, row.status, 'value', 'text') }}
            </oss-dot>
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
          <template slot-scope="{ row }">
            {{ row.detectDuration ? row.detectDuration : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180px">
          <template slot-scope="{ row }">
            <icon-button
              @click="$refs.editSBOM.open(row)"
              v-if="authorityFilter(3573)"
              tooltip-content="编辑"
              class="iconbianji1"
            ></icon-button>
            <icon-button
              :disabled="![-1,-2,2,3,8].includes(row.status)"
              tooltip-content="检测"
              class="iconshencha"
              @click="testing(row)"
            ></icon-button>
            <icon-button
              :disabled="![2].includes(row.status)"
              tooltip-content="导出SBOM"
              class="iconSBOM1"
              @click="exportSBOM(row)"
            ></icon-button>
            <icon-button
              :disabled="![2].includes(row.status)"
              tooltip-content="生成报告"
              class="iconshengchengbaogao"
              @click="createReport(row)"
            ></icon-button>
            <icon-button
              @click="del(row)"
              v-if="authorityFilter(3572)"
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
  deleteBatch,
  addTask
} from '@/api/home/scan/sbom'
import DialogUploadApp from './dialogUploadApp'
import AppQueryBox from './AppQueryBox'
import { levelOptions } from '@/store/constant'
import list from '@/mixins/list'
import { hasOwn } from '@/utils'
import DialogExportSBOM from '@/views/home/report/report/dialogExportSBOM.vue'
import { downloadSbomPackageSBOMReport } from '@/api/home/report'
import { popup } from '@/components/public/Popup'
import DialogEditSBOM from '@/views/home/scan/sbom/EditDialog.vue'
import DialogReport from '@/views/home/report/report/dialogCreateReport'

export default defineComponent({
  name: 'sbom',
  mixins: [list],
  components: {
    DialogEditSBOM,
    DialogReport,
    DialogExportSBOM,
    DialogUploadApp,
    AppQueryBox
  },
  data () {
    return {
      levelOptions,
      loading: false,
      isShowTable: true,
      tableOptions: {
        to: '操作',
        uuid: '/scan/sbom/list',
        columns: [
          {
            label: '所属项目',
            checked: false,
            disabled: false
          },
          {
            label: '应用名称',
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
            label: '组件数',
            checked: true,
            disabled: false
          },
          {
            label: '漏洞数',
            checked: true,
            disabled: false
          },
          {
            label: '许可证数',
            checked: false,
            disabled: false
          },
          {
            label: '上传人',
            checked: true,
            disabled: false
          },
          {
            label: '上传时间',
            checked: false,
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
        sortTypeList: [1]
      }
    }
  },
  methods: {
    hasOwn,
    testing (row) {
      const vm = this
      popup({
        title: '检测',
        width: '550px',
        underline: true,
        async beforeClose (action, cb) {
          if (action === 'confirm') {
            const [error] = await to(addTask({ appPackageIds: isArray(row) ? row.map(row => row.id) : [row.id] }))
            cb()
            if (error && error.message) {
              vm.$message.error(error.message)
            } else {
              vm.$message.success('操作成功')
              vm.$refs.table.clearSelection()
              vm.initList()
            }
          } else {
            cb()
          }
        },
        render () {
          return (
            <div style="padding: 0 45px;">
              确认检测选中的应用？
            </div>
          )
        }
      })
    },

    // 导出 SBOM
    exportSBOM (row) {
      this.$refs.exportSBOM.xhr = downloadSbomPackageSBOMReport
      this.$refs.exportSBOM.form.reportName = row.name || undefined
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
      if (!this.authorityFilter(3574)) return

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
        this.$refs.report.use((row || []).map(item => item.id))
      } else {
        this.$refs.report.use([row.id])
      }
    },
    // 删除
    del (row) {
      this.$popup({
        width: '550px',
        underline: true,
        render (h) {
          return h(
            'div',
            { style: { padding: '0 25px' } },
            ((isArray(row) && row.length <= 0) || !row) ? '确定要删除列表中全部应用吗？删除后应用关联的源文件及所有检测结果会同步删除！'
              : '确定要删除所选应用包吗？删除后该应用包关联的源文件及所有检测结果会同步删除！'
          )
        },
        beforeClose: async (a, c) => {
          if (a === 'confirm') {
            const [error] = await to(deleteBatch({
              ids: isArray(row) ? row.map(i => i.id) : [row.id]
            }))
            if (isObject(error)) {
              this.$message.error(error.message)
            } else {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })

              this.$refs.table.clearSelection()
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
        path: path || '/scan/sbom/details',
        query: {
          appPackage: row.id,
          project: row.projectId,
          task: row.taskId,
          _securityLevel: e
        }
      })
    },

    // 导出文件
    exportFile (row) {
      this.$refs.report.row = row
      this.$refs.report.dialogVisible = true
    },
    // 查看对比
    compare () {
      const multipleSelection = this.multipleSelection.sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate))
      this.$router.push({
        name: 'SBOMCompare',
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
      }
    }
  },
  mounted () {
    if (this.$store.state.home.project !== null) {
      this.search()
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
