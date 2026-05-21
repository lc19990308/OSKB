<template>
  <div>
    <VersionAvailableDialog ref="versionAvailableDialog"></VersionAvailableDialog>
    <div class="view-content">
      <div class="headline">
        <level-tag class="m-r-10" :level="componentInfo.securityLevel"></level-tag>
        <template v-if="componentInfo.vendor">{{componentInfo.vendor}}:</template>
        <template v-if="componentInfo.name">{{componentInfo.name}}:</template>
        <template v-if="componentInfo.version">{{componentInfo.version}}</template>
        <el-select
          class="m-l-10"
          v-model="dicComponentId"
          :value-key="'version'"
          placeholder="组件版本"
          @change="init"
          size="medium"
        >
          <el-option
            v-for="item in componentInfo.checkoutVersionList"
            :key="item.dicComponentId"
            :label="item.version"
            :value="item.dicComponentId"
          >
          </el-option>
        </el-select>
        <span class="right">
          <ModifyRiskLevelButton
            type="button"
            :row="componentInfo"
            :name="componentInfo.name"
            :version="componentInfo.version"
            :vendor="componentInfo.vendor"
          />
          <el-button
             size="medium"
             type="primary"
             v-if="authorityFilter(402)"
             @click="exportFile"
           >导出
        </el-button>
<!--          <el-dropdown-->
<!--          trigger="click"-->
<!--          v-if="authorityFilter(404)"-->
<!--        >-->
<!--          <el-button-->
<!--            size="medium"-->
<!--            type="primary"-->
<!--          >标记为-->
<!--          </el-button>-->
<!--          <el-dropdown-menu slot="dropdown">-->
<!--            <el-dropdown-item @click.native="mark(3)">黑名单</el-dropdown-item>-->
<!--            <el-dropdown-item @click.native="mark(4)">白名单</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </el-dropdown>-->
        </span>
      </div>
      <el-row :gutter="20">
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
          <div class="details-box-item">
            <ul class="details-box-item__desc" style="padding-top: 3px;">
              <li>
                <label>
                  <dot plain type="info">许可证</dot>
                </label>
                {{get(componentInfo, 'license', '-')}}
              </li>
              <li>
                <label>
                  <dot plain type="info">所属语言</dot>
                </label>
                {{get(componentInfo, 'language', '-')}}
              </li>
              <li>
                <label>
                  <dot plain type="info">发布日期</dot>
                </label>{{get(componentInfo,'releaseDate', '-')}}
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
          <div class="details-box-item">
            <pie-chart
              :legend="true"
              :height="185"
              :center-label="'依赖路径数'"
              :chart-data="licenseLevelChart"
            ></pie-chart>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
          <div class="details-box-item">
            <pie-chart
              :legend="true"
              :height="185"
              :center-label="'漏洞数'"
              :chart-data="vulLevelData"
            ></pie-chart>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
          <div class="details-box-item">
            <row-bar-chart :data="barChartData" :height="185"></row-bar-chart>
          </div>
        </el-col>
      </el-row>
      <AuditTableLog :dicComponentId="dicComponentId"></AuditTableLog>
      <div class="headline"><i class="iconfont icontuijianshengjibanben"></i>使用建议</div>
      <el-row :gutter="35" type="flex" class="m-b-5">
        <el-col class="m-b-15" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
          <div class="component-suggest">
            <div class="icon-wrapper">
              <i class="iconfont icontuijianshengjibanben text-warning"></i>
            </div>
            <div class="content-wrapper">
              <p>推荐升级版本：</p>
              <h4>{{ get(componentInfo, 'recommendVersion', '--') }}</h4>
              <br>
              <span class="font-sm" v-if="get(componentInfo, 'recommendReleaseDate', false)">
              发布日期：{{get(componentInfo, 'recommendReleaseDate', '--')}}
              </span>
            </div>
          </div>
        </el-col>
        <el-col class="m-b-15" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
          <div class="component-suggest">
            <div class="icon-wrapper">
              <i class="iconfont iconzuixinfabubanben text-primary"></i>
            </div>
            <div class="content-wrapper">
              <p>最新发布版本：</p>
              <h4>{{get(componentInfo, 'latestVersion', '--')}}</h4>
              <br>
              <span class="font-sm" v-if="get(componentInfo, 'latestReleaseDate', false)">
              发布日期：{{get(componentInfo, 'latestReleaseDate', '--')}}
            </span>
            </div>
          </div>
        </el-col>
        <el-col class="m-b-15" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
          <div class="component-suggest" @click="$refs.versionAvailableDialog.open(componentInfo)">
            <div class="icon-wrapper" style="padding-top: 5px;">
<!--              <i class="iconfont icontuijianshengjibanben text-primary"></i>-->
              <img height="30" style="margin-right: 12px;" src="../../../../../assets/images/svg/use-jianyi.svg" alt="">
            </div>
            <div class="content-wrapper">
              <p style="color: #8B5CF6;">
                其它无漏洞可用版本
                <i class="el-icon-d-arrow-right" style="font-weight: bold;"></i>
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="text-right m-b-15 compound-search-box--btn" style="display: flex;justify-content: space-between;align-items: center;">
            <div class="headline" style="margin-bottom: 0;"><i class="iconfont iconloudongku"></i>漏洞信息</div>
            <div>
              <el-select
                style="width: 150px;margin-right: 15px;"
                @change="search" v-model="searchData.exploitLevelId"
                size="medium"
                clearable
                placeholder="漏洞利用难度"
              >
                <el-option
                  v-for="item in utilizeDifficultyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select style="width: 150px;" @change="[searchText && search()]" class="customize-select" v-model="searchSelect" size="medium">
                <el-option
                  v-for="item in searchSelectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <search-area
                class="customize-input"
                @search="search"
                v-model="searchText"
                right-float
              ></search-area>
            </div>
          </div>
          <el-table
            class="w-full"
            :data="tableData"
            v-loading="loading"
            tooltip-effect="dark"
            row-key="dicVulId"
            :expand-row-keys="defaultExpand"
            @filter-change="searchFilter"
            @sort-change="searchSort"
            @expand-change="expandChange"
            @row-click="row => rowClickExpand(row, 'defaultExpand', 'dicVulId')"
          >

            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row class="table-expand">
                  <el-col tag="p" :span="24">
                    <div class="title primary">CNNVD：</div>
                    <div class="content">{{ scope.row.cnnvdId || "-" }}</div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title success">CNVD：</div>
                    <div class="content">{{ scope.row.cnvdId || "-" }}</div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title warning">CWE：</div>
                    <div class="content">{{ scope.row.cweId || "其他" }}</div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title primary">利用难度：</div>
                    <div class="content">
                      {{ scope.row.exploitLevel === 0 ? "困难" : "" }}
                      {{ scope.row.exploitLevel === 1 ? "容易" : "" }}
                    </div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title danger">漏洞描述：</div>
                    <div class="content">
                      <pre style="margin: 0;">{{
                        scope.row.description || "-"
                      }}</pre>
                    </div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title primary">修复建议：</div>
                    <div class="content">
                      <pre style="margin: 0;">{{
                        scope.row.suggestion || "-"
                      }}</pre>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column
              label="漏洞名称"
              min-width="15%"
              prop="vulName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="XMIRROR"
              min-width="15%"
              prop="xmirrorId"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="CVE"
              min-width="15%"
              prop="cveId"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              min-width="10%"
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
              label="漏洞类型"
              min-width="10%"
              prop="vulType"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="发布时间"
              min-width="15%"
              prop="release_date"
              sortable="custom"
              :sort-orders="['descending', 'ascending', null]"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.releaseDate }}
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
        </el-col>
      </el-row>
      <influenced :dic-component-id="dicComponentId"></influenced>
    </div>
  </div>
</template>
<script>
import { changeStatus, componentManagementExcel } from '@/api/home/assets/module'
import { componentManagementDetailByPdceiid } from '@/api/home/public/component'
import { componentVulListByPdceiid } from '@/api/home/public/vul'
import { PAGE_CONF } from '@/utils/conf'
import { awaitTo as to, hasOwn, isObject, rowClickExpand, get } from '@/utils'
import PieChart from './PieChart'
import RowBarChart from './RowBarChart'
import Influenced from '@/views/home/assets/module/details/Influenced'
import VersionAvailableDialog from '@/views/home/assets/module/details/VersionAvailableDialog'
import dot from '@/components/public/Dot'
import ModifyRiskLevelButton from '@/views/home/public/modules/ModifyRiskLevelComponent.vue'
import AuditTableLog from '@/views/home/assets/module/details/AuditTableLog.vue'
export default {
  name: 'ModuleDetails',
  components: {
    AuditTableLog,
    ModifyRiskLevelButton,
    VersionAvailableDialog,
    Influenced,
    RowBarChart,
    PieChart,
    dot
  },
  data () {
    return {
      activeTab: 'app',
      dicComponentId: this.$route.query.dic / 1,
      pdceiid: this.$route.query.pdceiid,
      projectId: this.$route.query.project,
      version: this.$route.query.version,
      taskId: null,
      barChartData: [
        {
          name: '影响应用',
          value: 0,
          color: '#8B5CF6'
        },
        {
          name: '影响项目',
          value: 0,
          color: '#8B5CF6'
        }
      ],
      vulLevelData: {
        data: [
          {
            value: 2,
            name: '严重',
            color: '#991B1B',
            key: 'serious'
          },
          {
            value: 4,
            name: '高危',
            color: '#EF4444',
            key: 'high'
          },
          {
            value: 4,
            name: '中危',
            color: '#F59E0B',
            key: 'medium'
          },
          {
            value: 2,
            name: '低危',
            color: '#1a78cf',
            key: 'low'
          }
        ],
        sum: 0
      },
      licenseLevelChart: {
        data: [
          {
            value: 0,
            name: '间接依赖',
            color: '#35D09C'
          },
          {
            value: 0,
            name: '直接依赖',
            color: '#8B5CF6'
          }
        ],
        sum: 0
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
        }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      loading: false,
      searchSelect: 'xmirrorId',
      checkResultOptions: [
        {
          value: 0,
          text: '未校验'
        },
        {
          value: 1,
          text: '校验通过'
        },
        {
          value: 2,
          text: '校验未通过'
        },
        {
          value: 3,
          text: '私服库校验通过'
        }
      ],
      searchSelectOptions: [
        {
          value: 'xmirrorId',
          label: 'XMIRROR编号'
        },
        {
          value: 'cveId',
          label: 'CVE编号'
        },
        {
          value: 'cnnvdId',
          label: 'CNNVD编号'
        },
        {
          value: 'cweId',
          label: 'CWE编号'
        },
        {
          value: 'vulName',
          label: '漏洞名称'
        }
      ],
      searchText: '',
      searchData: {
        exploitLevelId: undefined,
        securityLevels: []
      },
      componentInfo: {
        version: {}
      },
      licenseInfo: {},
      defaultExpand: [],
      showAllLicense: false
    }
  },
  provide () {
    return {
      componentInfo: () => this.componentInfo
    }
  },
  methods: {
    rowClickExpand,
    expandChange (row, arr) {
      if (arr.indexOf(row) !== -1) {
        this.defaultExpand = [row.dicVulId]
      } else {
        this.defaultExpand = []
      }
    },

    // 导出文件
    async exportFile () {
      this.$popup({
        title: '导出',
        width: '550px',
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        center: false,
        content: '<div style="padding: 20px">导出所选组件数据，是否继续导出？</div>',
        beforeClose: async (action, next) => {
          if (action === 'confirm') {
            const [error, response] = await to(componentManagementExcel({ pdceiidList: [this.pdceiid], dicComponentIdList: [JSON.parse(this.dicComponentId)] }))
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

    // 标记为
    mark (status, row) {
      changeStatus({
        status: status,
        dicComponentId: row.dicComponentId,
        projectId: this.project.id,
        type: 1
      })
        .then(response => {
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
        })
        .catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    // 初始化组件详情
    init () {
      this.search()
      componentManagementDetailByPdceiid(this.pdceiid)
        .then(response => {
          this.$set(this, 'componentInfo', response.data)
          this.componentInfo = response.data
          // 饼图 - 间接依赖
          this.licenseLevelChart.data[0].value = this.get(this.componentInfo, 'indirectDependentCount', 0)
          this.licenseLevelChart.data[1].value = this.get(this.componentInfo, 'directDependentCount', 0)
          this.licenseLevelChart.sum = this.licenseLevelChart.data[0].value + this.licenseLevelChart.data[1].value

          // 饼图 - 漏洞
          this.vulLevelData.data.forEach(item => {
            item.value = this.get(this.componentInfo, ['vulNumVO', item.key], 0)
          })
          this.vulLevelData.sum = this.get(this.componentInfo, ['vulNumVO', 'total'], 0)

          // 柱状图
          this.barChartData[0].value = this.get(this.componentInfo, 'affectedApplicationCount', 0)
          this.barChartData[1].value = this.get(this.componentInfo, 'affectedProjectCount', 0)
        })
        .catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
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
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      this.loading = true
      componentVulListByPdceiid({
        pdceiid: this.pdceiid,
        ...this.searchData,
        [this.searchSelect]: this.searchText,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        name: this.name,
        taskId: this.taskId,
        loading: false
      })
        .then(response => {
          this.loading = false
          this.tableData = []
          const data = response.data
          data.records.forEach(item => {
            this.tableData.push(item)
          })
          if (this.tableData.length > 0) {
            this.defaultExpand = [this.tableData[0].dicVulId]
          }
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
    if (this.pdceiid !== undefined) {
      if (![10, '10'].includes(get(this.$route.query, '_securityLevel', 10))) {
        this.searchData.securityLevels = [Number(get(this.$route.query, '_securityLevel'))]
      }
      this.init()
    }
  }
}
</script>
<style scoped lang="scss">
.info-section {
  p {
    margin-top: 0;
    margin-bottom: 10px;
    line-height: 34px;
    color: #666;

    .title {
      width: 150px;
      float: left;
      vertical-align: middle;
    }

    .content {
      margin-left: 150px;
      vertical-align: middle;
    }
  }

  .search-wrap {
    text-align: right;
    margin-bottom: 20px;
  }

  .el-dropdown {
    color: inherit;
  }
}

.component-suggest {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 2px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  cursor: pointer;
  transition: 0.3s;
  height: calc(100% - 20px);

  .content-wrapper {
    flex: 1;

    h4 {
      display: inline-block;
      color: #333;
      font-weight: bold;
      font-size: 16px;
      margin: 0;
    }

    p {
      display: inline-block;
      margin: 0 12px 0 0;
      color: #7d90a9;
      font-weight: 500;
      font-size: 14px;
    }
  }

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 10%);
    border: 1px solid rgb(30, 136, 229);

    .content-wrapper {
      p {
        color: rgb(30, 136, 229);
      }
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  .icon-wrapper {
    i {
      font-size: 30px;
      margin-right: 12px;
      display: block;
    }
  }
}

.details-box-item {
  border-radius: 3px;
  background: rgb(255, 255, 255);
  box-shadow: 0 2px 8px 0 rgba(43, 117, 183, 15%);
  height: 185px;
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 20px;

  .details-box-item__desc {
    margin: 0;
    padding: 0;
    height: 100%;
    list-style: none;

    li {
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f4;
      box-sizing: border-box;

      &::marker {
        color: rgb(153, 153, 153);
        font-size: 18px;
      }

      label {
        width: 100px;
        display: inline-block;
        color: #666;
      }
    }
  }
}
</style>
