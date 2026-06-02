<template>
  <div>
    <dialog-usage-advice ref="usageAdvice"></dialog-usage-advice>
    <el-row :gutter="20" class="wrap">
      <el-col :span="12">
        <div class="common-bg">
          <div class="common-header">
            许可证统计
          </div>
          <annulus-pie-chart
            :legend="false"
            :center-label="'许可证总数'"
            :chart-data="licenseLevelChart"
            :loading="licenseLevelChartLoading"
          ></annulus-pie-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="common-bg">
          <el-button
            size="mini"
            type="primary"
            @click="usageAdvice()"
            class="common-btn"
            plain
            >许可证使用建议</el-button
          >
          <div class="common-header">
            组件统计
          </div>
          <row-bar-chart
            :chart-data="protocolChartData"
            :loading="protocolChartLoading"
          ></row-bar-chart>
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
            v-if="authorityFilter(702)"
            @click="exportFile"
            >导出</el-button
          >
          <el-dropdown trigger="click" :disabled="!(multipleSelection.length > 0)">
            <el-button :disabled="!(multipleSelection.length > 0)" size="medium" type="primary">
              批量管理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <MarkBlackAndWhiteListDropdown
                @change="initList"
                :show-button="true"
                :type="'license'"
                :dic-component-ids="multipleSelection.map(item => item.id)"
                :project-id-list="[projectMixin.id]"
                :dropdown-options="{
                  style: { display: 'list-item', 'list-style': 'none' },
                  placement:'right',
                  trigger: 'hover'
                }"
              >
                <el-dropdown-item>一键标记</el-dropdown-item>
              </MarkBlackAndWhiteListDropdown>
              <AuditDropdown
                @change="initList"
                :show-button="true"
                :type="'license'"
                :dic-risk-id="multipleSelection.map(item => item.id)"
                :project-id-list="[projectMixin.id]"
                :dropdown-options="{
                  style: { display: 'list-item', 'list-style': 'none', 'margin-left': 0 },
                  placement:'right',
                  trigger: 'hover'
                }"
              >
                <el-dropdown-item>一键审计</el-dropdown-item>
              </AuditDropdown>
            </el-dropdown-menu>
          </el-dropdown>
          <search-area
            placeholder="请输入许可证名"
            @search="search"
            v-model="name"
            right-float
          ></search-area>
          <pagination-select
            style="width: 230px; float: right"
            class="m-r-10 "
            v-model="searchData.taskIds"
            size="medium"
            :projectIds="project.id"
            @change="search"
          />
          <el-select
            v-model="searchData.auditStatus"
            placeholder="请选择审计状态"
            clearable
            style="width: 220px;margin-right: 10px;"
            class="right"
            @change="search"
            size="medium"
          >
            <el-option
              v-for="(item) in auditStatusOptions"
              :key="item.value"
              :label='item.label'
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            v-model="searchData.markStatus"
            placeholder="请选择标记状态"
            clearable
            style="width: 220px;margin-right: 10px;"
            class="right"
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
        </div>
      </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        row-key="id"
        @filter-change="searchFilter"
        @sort-change="searchSort"
        @selection-change="handleSelectionChange"
        :default-sort="defaultSort"
      >
        <template slot="bar">
          <el-button
            size="medium"
            type="primary"
            v-if="authorityFilter(702)"
            @click="exportFile"
          >导出</el-button>

          <AuditDropdown
            @change="initList"
            :show-button="true"
            :type="'license'"
            :dic-risk-id="multipleSelection.map(item => item.id)"
            :project-id-list="[projectMixin.id]"
          >
            <el-button size="medium" type="primary">
              审计为<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          </AuditDropdown>
          <MarkBlackAndWhiteListDropdown
            @change="initList"
            :show-button="true"
            :type="'license'"
            :dic-component-ids="multipleSelection.map(item => item.id)"
            :project-id-list="[projectMixin.id]"
          >
            <el-button size="medium" type="primary">
              标记为<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          </MarkBlackAndWhiteListDropdown>
        </template>
        <el-table-column reserve-selection type="selection" width="55"> </el-table-column>
        <el-table-column
          label="许可证名"
          min-width="20%"
          prop="shortName"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{row.shortName || '--'}}
            <AuditTag :status="row.auditStatus"></AuditTag>
            <MarkTag :status="row.markStatus"></MarkTag>
          </template>
        </el-table-column>
        <el-table-column
          label="许可证全名"
          min-width="20%"
          prop="longName"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          min-width="12%"
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
            <span class="level-tag danger" v-if="scope.row.securityLevel === 1"
              >高风险</span
            >
            <span
              class="level-tag warning"
              v-else-if="scope.row.securityLevel === 2"
              >中风险</span
            >
            <span
              class="level-tag info"
              v-else-if="scope.row.securityLevel === 3"
              >低风险</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="是否兼容GPL"
          min-width="12%"
          prop="gplCompatible"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.gplCompatible"
              :filters="compatibleList"
              @change="search"
              title="是否兼容GPL"
            />
          </template>
          <template slot-scope="scope">
            {{ scope.row.gplCompatible === 1 ? "兼容" : "不兼容" }}
          </template>
        </el-table-column>
        <el-table-column
          label="OSI认证"
          min-width="12%"
          prop="gplCompatible"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <i :class="scope.row.isOsi === 1 ? 'el-icon-check' : 'el-icon-close'"></i>
          </template>
        </el-table-column>
        <el-table-column
          label="FSF认证"
          min-width="12%"
          prop="gplCompatible"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <i :class="scope.row.isFsf === 1 ? 'el-icon-check' : 'el-icon-close'"></i>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          label="影响组件数"-->
<!--          min-width="12%"-->
<!--          sortable="custom"-->
<!--             :sort-orders="['descending','ascending',null]"-->
<!--          prop="component_num"-->
<!--          show-overflow-tooltip-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            {{ scope.row.componentNumVO.total }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="操作" fixed="right" width="180" show-overflow-tooltip>
          <template slot-scope="{row}">
            <icon-button
              v-if="authorityFilter(701)"
              tooltip-content="详情"
              class="iconxiangqing"
              @click="detail(row)"
            ></icon-button>
            <AuditDropdown
              @change="initList"
              :type="'license'"
              :dic-risk-id="[row.id]"
              :project-id-list="[projectMixin.id]"
            />
            <MarkBlackAndWhiteListDropdown
              @change="initList"
              :type="'license'"
              :dic-component-ids="[row.id]"
              :project-id-list="[projectMixin.id]"
            />
            <ModifyRiskLevelLicense
              :row="row"
              :short-name="row.shortName"
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
import AnnulusPieChart from '@/components/chart/AnnulusPieChart.vue'
import RowBarChart from '@/components/chart/RowBarChart.vue'
import DialogUsageAdvice from '@/views/home/assets/license/dialogUsageAdvice.vue'
import {
  licenseList,
  licenseLevelChart,
  licenseTypeChart,
  exportLicense
} from '@/api/home/assets/license'
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky/index.vue'
import { downloadBlobFile, hasOwn } from '@/utils'
import MixinsList from '@/mixins/list'
import { mapState } from 'vuex'
import PaginationSelect from '../module/PaginationSelect'
import AuditDropdown from '@/views/home/public/modules/AuditDropdown.vue'
import MarkBlackAndWhiteListDropdown from '@/views/home/public/modules/MarkBlackAndWhiteListDropdown.vue'
import { auditStatusOptions, markStatusOptions } from '@/store/constant'
import ModifyRiskLevelLicense from '@/views/home/public/modules/ModifyRiskLevelLicense.vue'
import MarkTag from '@/views/home/public/modules/MarkTag.vue'
import AuditTag from '@/views/home/public/modules/AuditTag.vue'
export default {
  name: 'AssetsLicenseList',
  mixins: [MixinsList],
  components: {
    AuditTag,
    MarkTag,
    ModifyRiskLevelLicense,
    MarkBlackAndWhiteListDropdown,
    AuditDropdown,
    AnnulusPieChart,
    RowBarChart,
    Sticky,
    DialogUsageAdvice,
    PaginationSelect
  },
  data () {
    return {
      project: this.$store.state.home.project,
      name: '',
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      multipleSelection: [],
      auditStatusOptions,
      markStatusOptions,
      compatibleList: [
        {
          text: '兼容',
          value: 1
        },
        {
          text: '不兼容',
          value: 0
        }
      ],
      licenseLevelChart: {
        data: [
          {
            value: 0,
            name: '高风险',
            color: '#8B1A1A',
            key: 'highNum'
          },
          {
            value: 0,
            name: '中风险',
            color: '#D4932A',
            key: 'mediumNum'
          },
          {
            value: 0,
            name: '低风险',
            color: '#1a78cf',
            key: 'lowNum'
          }
        ],
        sum: 0
      },
      licenseLevelChartLoading: false,
      protocolChartData: [],
      searchData: {
        taskIds: [],
        sortFieldList: [],
        sortTypeList: [],
        auditStatus: undefined,
        markStatus: undefined
      },
      protocolChartLoading: false,
      levelOptions: [
        {
          value: 1,
          text: '高风险'
        },
        {
          value: 2,
          text: '中风险'
        },
        {
          value: 3,
          text: '低风险'
        }
      ]
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
    // 使用建议
    usageAdvice () {
      this.$refs.usageAdvice.dialogVisible = true
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

    // 导出文件
    exportFile () {
      if (this.multipleSelection.length > 0) {
        this.exportFileSubmit()
      } else {
        this.$confirm('导出所有许可证数据，是否继续导出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.exportFileSubmit()
          })
          .catch(() => {})
      }
    },

    // 导出文件
    async exportFileSubmit () {
      try {
        let ids = this.multipleSelection.map(x => x.id)
        ids = ids.join(',')
        const response = await exportLicense({
          idList: ids,
          projectId: this.project.id,
          type: 3
        })
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    // 排序
    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = []
        this.searchData.sortTypeList = [1]
      }
      this.search()
    },

    // 筛选
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
      if (!this.authorityFilter(701)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }

      /**
       * 保存搜索条件
       * **/
      this.saveSearchRecord({
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        name: this.name
      })

      this.loading = true

      const params = {
        ...this.searchData,
        shortName: this.name,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      }

      if (this.project.id === -1 && hasOwn(this.searchData, 'projectId')) {
        params.projectId = this.searchData.projectId ? this.searchData.projectId : -1
      } else {
        params.projectId = this.project.id
      }

      licenseList(params)
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
    },

    // 初始化许可证统计图
    initLicenseChart () {
      if (!this.authorityFilter(701)) {
        return 0
      }
      this.licenseLevelChartLoading = true
      this.licenseLevelChart.data.forEach(item => {
        item.value = 0
      })
      this.licenseLevelChart.sum = 0
      licenseLevelChart({
        projectId: this.project.id,
        loading: false
      })
        .then(response => {
          this.licenseLevelChartLoading = false
          const data = response.data
          this.licenseLevelChart.data.forEach(item => {
            item.value = data[item.key] || 0
          })
          this.licenseLevelChart.sum = data.totalNum
        })
        .catch(error => {
          this.licenseLevelChartLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化组件统计条形图
    initProtocolChart () {
      if (!this.authorityFilter(701)) {
        return 0
      }
      this.protocolChartData = []
      this.protocolChartLoading = true
      licenseTypeChart({
        projectId: this.project.id,
        loading: false
      })
        .then(response => {
          this.protocolChartLoading = false
          const data = response.data
          data.forEach(item => {
            this.protocolChartData.push({
              value: item.num,
              name: item.shortName
            })
          })
        })
        .catch(error => {
          this.protocolChartLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 详情
    detail (row) {
      this.$router.push({
        path: '/assets/license/details',
        query: {
          id: row.id
        }
      })
    }
  },
  watch: {
    '$store.state.home.project' (n) {
      if (n !== null) {
        this.project = n
        this.search()
        this.initLicenseChart()
        this.initProtocolChart()
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout()
        })
      }
    }
  },
  mounted () {
    if (this.$store.state.home.project !== null) {
      this.search()
      this.initLicenseChart()
      this.initProtocolChart()
    }
  }
}
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
}

.common-btn {
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 30;
}
</style>
