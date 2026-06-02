<template>
  <div>
    <dialog-get-project
      ref="getProject"
      @change="
        $event => {
          selectProject_mixin($event);
          $nextTick(() => {
            add();
          });
        }
      "
    ></dialog-get-project>
    <DialogReport ref="report" moduleCode="2"></DialogReport>
    <el-row :gutter="20" class="wrap">
      <el-col :span="8">
        <div class="common-bg">
          <div class="common-header">
            运行时节点统计
          </div>
          <annulus-pie-chart
            :legend="false"
            :height="280"
            :chart-data="nodeAppComponentData"
            :loading="nodeChartLoading"
          ></annulus-pie-chart>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="common-bg">
          <div class="common-header">
            运行时组件统计
          </div>
          <annulus-pie-chart
            :legend="false"
            :height="280"
            :center-label="'组件统计'"
            :chart-data="componentLevelData"
            :loading="componentChartLoading"
          ></annulus-pie-chart>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="common-bg">
          <div class="common-header">
            运行时漏洞统计
          </div>
          <annulus-pie-chart
            :legend="false"
            :height="280"
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
            v-if="project.id !== -1"
            type="primary"
            @click="add()"
          >
            添加节点
          </el-button>
          <el-button
            size="medium"
            v-else
            type="primary"
            @click="$refs.getProject.openDialog()"
          >
            添加节点
          </el-button>
          <el-button
            size="medium"
            type="primary"
            :disabled="multipleSelection.length !== 2"
            @click="compare"
          >
            查看对比
          </el-button>
          <el-dropdown
            trigger="click"
            @command="exportFile"
            v-if="authorityFilter(1002)"
          >
            <el-button size="medium" type="primary">
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="6">应用</el-dropdown-item>
              <el-dropdown-item :command="1">组件</el-dropdown-item>
              <el-dropdown-item :command="2">漏洞</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            trigger="click"
            @command="ops($event)"
            v-if="authorityFilter([1005, 1004, 1006])"
          >
            <el-button
              size="medium"
              type="primary"
              :disabled="multipleSelection.length === 0"
            >
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="authorityFilter(1006)"
                :command="createReport"
              >生成报告</el-dropdown-item>
              <el-dropdown-item :command="enable" v-if="authorityFilter(1005)"
                >启用</el-dropdown-item
              >
              <el-dropdown-item
                :command="forbidden"
                v-if="authorityFilter(1005)"
                >禁用</el-dropdown-item
              >
              <el-dropdown-item :command="del" v-if="authorityFilter(1004)"
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <search-area
            placeholder="请输入节点IP"
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
        row-key="id"
        v-loading="loading"
        tooltip-effect="dark"
        @filter-change="searchFilter"
        @sort-change="searchSort"
        @selection-change="handleSelectionChange"
        :dynamic-options.sync="config"
      >
        <template slot="bar">
          <el-dropdown
            trigger="click"
            @command="exportFile"
            v-if="authorityFilter(1002)"
          >
            <el-button size="medium" type="primary">
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="6">应用</el-dropdown-item>
              <el-dropdown-item :command="1">组件</el-dropdown-item>
              <el-dropdown-item :command="2">漏洞</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="medium" type="primary" @click="createReport()" v-if="authorityFilter(1006)">生成报告</el-button>
          <el-button size="medium" type="primary" @click="enable()" v-if="authorityFilter(1005)">启用</el-button>
          <el-button size="medium" type="primary" @click="forbidden()" v-if="authorityFilter(1005)">禁用</el-button>
          <el-button size="medium" type="primary" @click="del()" v-if="authorityFilter(1004)">删除</el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"> </el-table-column>
        <el-table-column
          label="所属项目"
          min-width="80"
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
          label="节点IP"
          min-width="100"
          prop="ip"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              :underline="false"
              :disabled="!row.ip"
              @click="detail(row)"
            >{{get(row, 'ip', '-')}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="节点名称" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <div
              class="cursor-pointer"
              v-show="editNodeName.id !== scope.row.id"
              :class="scope.row.name ? '' : 'text-placeholder'"
              @click="changeNodeName(scope.row)"
            >
              {{ scope.row.name || "点击编辑" }}
            </div>
            <el-input
              v-if="editNodeName.id === scope.row.id"
              size="small"
              ref="nodeNameInput"
              v-model="editNodeName.nodeName"
              placeholder="请输入节点名称"
              @blur="saveNodeName(scope.row.name)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="语言"
          prop="language"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="主版本号"
          min-width="100"
          prop="mainVersion"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          min-width="80"
          label="应用"
          prop="app_count"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <oss-table-sort
              prop="app_count"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              应用
            </oss-table-sort>
          </template>

          <template slot-scope="scope">
            {{ scope.row.appCount }}
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

          <template slot-scope="scope">
            <el-link  @click="detail(scope.row)" :underline="false">
              {{ get(scope.row, 'componentNum', 0) }}
            </el-link>
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
          <template slot-scope="scope">
            <level-tag :level="scope.row.securityLevel"></level-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="漏洞"
          width="200"
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
            <level-group @click="detail(scope.row, '/scan/node/details/vul', $event)" :value="[
             scope.row.vulNum.serious,
             scope.row.vulNum.high,
             scope.row.vulNum.medium,
             scope.row.vulNum.low
             ]" />
          </template>
        </el-table-column>
        <el-table-column
          label="节点状态"
          min-width="100"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.status"
              :filters="statusOptions"
              @change="search"
              title="节点状态"
            />
          </template>
          <template slot-scope="scope">
            <span
              :class="
                scope.row.status === 1 ? 'text-success' : 'text-secondary'
              "
            >
              {{ scope.row.status === 1 ? "在线" : "离线" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="安装时间"
          prop="install_time"
          min-width="100"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <oss-table-sort
              prop="install_time"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              安装时间
            </oss-table-sort>
          </template>

          <template slot-scope="scope">
            {{ scope.row.installTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="是否禁用"
          min-width="100"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.enable"
              :filters="enableOptions"
              @change="search"
              title="是否禁用"
            />
          </template>
          <template slot-scope="scope">
            <span
              :class="
                scope.row.enable === 1 ? 'text-success' : 'text-secondary'
              "
            >
              {{ scope.row.enable === 1 ? "启用" : "禁用" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <icon-button
              tooltip-content="详情"
              class="iconxiangqing"
              @click="detail(scope.row)"
            ></icon-button>
            <icon-button
              v-if="authorityFilter(1006)"
              tooltip-content="生成报告"
              class="iconshengchengbaogao"
              @click="createReport(scope.row)"
            ></icon-button>
            <el-dropdown
              trigger="click"
              @command="ops($event, scope.row)"
              v-if="authorityFilter([1005, 1004])"
            >
              <icon-button
                tooltip-content="更多操作"
                class="icongengduo"
              ></icon-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="enable"
                  :disabled="!scope.row.ip"
                  v-show="scope.row.enable === 0"
                  v-if="authorityFilter(1005)"
                >启用</el-dropdown-item
                >
                <el-dropdown-item
                  :command="forbidden"
                  :disabled="!scope.row.ip"
                  v-show="scope.row.enable === 1"
                  v-if="authorityFilter(1005)"
                >禁用</el-dropdown-item
                >
                <el-dropdown-item :command="del" v-if="authorityFilter(1004)"
                >删除</el-dropdown-item
                >
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
import {
  nodeList,
  nodeDel,
  updateEnableStatus,
  exportNode,
  nodeAppComponentChart,
  updateName,
  componentLevelChart,
  vulLevelChart
} from '@/api/home/scan/node'
import { downloadBlobFile, hasOwn } from '@/utils'
import MixinsList from '@/mixins/list'
import DialogGetProject from '@/views/home/scan/integration/sourceCode/dialogGetProject'
import { mapState } from 'vuex'
import projectMixins from '@/components/public/Layout/Project/mixins'
import DialogReport from '@/views/home/report/report/dialogCreateReport'

export default {
  name: 'ScanNodeList',
  mixins: [MixinsList, projectMixins],
  components: {
    DialogGetProject,
    AnnulusPieChart,
    Sticky,
    DialogReport
  },
  data () {
    return {
      config: {
        columns: [
          {
            label: '所属项目',
            checked: false,
            disabled: false
          },
          {
            label: '节点IP',
            checked: true,
            disabled: true
          },
          {
            label: '节点名称',
            checked: false,
            disabled: false
          },
          {
            label: '语言',
            checked: false,
            disabled: false
          },
          {
            label: '主版本号',
            checked: false,
            disabled: false
          },
          {
            label: '风险等级',
            checked: true,
            disabled: false
          },
          {
            label: '应用',
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
            label: '节点状态',
            checked: true,
            disabled: false
          },
          {
            label: '安装时间',
            checked: true,
            disabled: false
          },
          {
            label: '是否禁用',
            checked: true,
            disabled: false
          },
          {
            label: '操作',
            checked: true,
            disabled: true
          }],
        uuid: 'nodeList', //  必填，且唯一
        to: '操作'
      },
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
      enableOptions: [
        {
          value: 1,
          text: '启用'
        },
        {
          value: 0,
          text: '禁用'
        }
      ],
      statusOptions: [
        {
          value: 1,
          text: '在线'
        },
        {
          value: 0,
          text: '离线'
        }
      ],
      searchCondition: '',
      currentPage: 1,
      loading: false,
      nodeChartLoading: false,
      componentChartLoading: false,
      vulChartLoading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      searchData: {
        sortFieldList: ['install_time'],
        sortTypeList: [1]
      },
      multipleSelection: [],
      nodeAppComponentData: {
        data: [
          {
            value: 0,
            name: '节点',
            color: '#4A9C8C',
            key: 'nodeCount'
          },
          {
            value: 0,
            name: '组件',
            color: '#D4932A',
            key: 'componentCount'
          },
          {
            value: 0,
            name: '应用',
            color: '#D9534F',
            key: 'appCount'
          }
        ]
      },
      componentLevelData: {
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

          // {
          //   value: 0,
          //   name: '无漏洞',
          //   color: '#4A9C8C',
          //   key: 'normalCount'
          // }
        ],
        sum: 0
      },
      editNodeName: {
        id: '',
        nodeName: ''
      },
      timeout: null
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
    // 导出文件
    exportFile (type) {
      if (this.multipleSelection.length > 0) {
        this.exportFileSubmit(type)
      } else {
        this.$confirm(
          `导出所有运行时节点${
            type === 6 ? '应用' : type === 1 ? '组件' : '漏洞'
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
          .catch(() => {})
      }
    },

    // 导出文件
    async exportFileSubmit (type) {
      try {
        const ids = this.multipleSelection.map(x => x.id)
        const response = await exportNode({
          param: ids,
          projectId: this.project.id,
          type: type
        })
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    // 添加节点
    add (projectId) {
      const params = { path: '/scan/node/add' }
      projectId && (params.query = { projectId })
      this.$router.push(params)
    },

    // 详情
    detail (row, path, e = 10) {
      this.$router.push({
        path: path || '/scan/node/details',
        query: {
          iastId: row.iastId,
          id: row.id,
          project: row.projectId,
          appCount: row.appCount,
          _securityLevel: e
        }
      })
    },

    // 删除
    del (row) {
      this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          nodeDel({
            idList: row ? [row.id] : this.multipleSelection.map(x => x.id)
          })
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$refs.multipleTable.clearSelection()
              this.initList()
              this.initNodeAppComponentChart()
              this.initComponentLevelChart()
              this.initVulLevelChart()
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

    // 启用
    enable (row) {
      let params = []
      if (row) {
        params.push({
          id: row.id,
          enable: 1
        })
      } else if (this.multipleSelection.length > 0) {
        params = this.multipleSelection.map(x => {
          return {
            id: x.id,
            enable: 1
          }
        })
      }
      this.changeEnable(params)
    },

    // 禁用
    forbidden (row) {
      let params = []
      if (row) {
        params.push({
          id: row.id,
          enable: 0
        })
      } else if (this.multipleSelection.length > 0) {
        params = this.multipleSelection.map(x => {
          return {
            id: x.id,
            enable: 0
          }
        })
      }
      this.changeEnable(params)
    },

    changeEnable (params) {
      updateEnableStatus({
        params: params
      })
        .then(response => {
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

    // 选中要修的节点
    changeNodeName (row) {
      this.editNodeName.nodeName = row.name
      this.editNodeName.id = row.id
      setTimeout(() => {
        this.$refs.nodeNameInput.focus()
      }, 50)
    },

    // 修改节点名称
    saveNodeName (preName) {
      if (preName === this.editNodeName.nodeName) {
        this.editNodeName.nodeName = ''
        this.editNodeName.id = ''
        return
      }
      updateName({
        id: this.editNodeName.id,
        name: this.editNodeName.nodeName,
        loading: false
      })
        .then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.initList()
          this.editNodeName.nodeName = ''
          this.editNodeName.id = ''
        })
        .catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
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
      if (!this.authorityFilter(1001)) {
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
        this.initVulLevelChart(true)
        this.initComponentLevelChart(true)
        this.initNodeAppComponentChart(true)
      }

      /**
       * 保存搜索条件
       * **/
      this.saveSearchRecord({
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition
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
      nodeList(params)
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

    // 初始化节点应用组件图
    initNodeAppComponentChart (auto) {
      if (!this.authorityFilter(1001)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      if (!auto) {
        this.nodeChartLoading = true
      }

      nodeAppComponentChart({
        projectId: this.project.id,
        loading: false
      })
        .then(response => {
          this.nodeChartLoading = false
          const data = response.data
          this.nodeAppComponentData.data.forEach(item => {
            item.value = data[item.key] || 0
          })
        })
        .catch(error => {
          this.nodeChartLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 初始化组件图
    initComponentLevelChart (auto) {
      if (!this.authorityFilter(1001)) {
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
      if (!this.authorityFilter(1001)) {
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
          this.vulLevelData.sum = data.total
        })
        .catch(error => {
          this.vulChartLoading = false
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
      if (row) {
        this.$refs.report.use([row.id])
      } else {
        this.$refs.report.use((this.multipleSelection || []).map(item => item.id))
      }
    },
    // 查看对比
    compare () {
      const multipleSelection = this.multipleSelection.sort((a, b) => new Date(a.installTime) - new Date(b.installTime))
      this.$router.push({
        name: 'ScanNodeCompare',
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
        this.initNodeAppComponentChart()
        this.initComponentLevelChart()
        this.initVulLevelChart()
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
      this.initNodeAppComponentChart()
      this.initComponentLevelChart()
      this.initVulLevelChart()
    }
  }
}
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;
  margin-top: 20px;
}
</style>
