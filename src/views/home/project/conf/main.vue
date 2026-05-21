<template>
  <div class="view-content">
    <DialogExportSBOM ref="exportSBOM"/>
    <dialog-add-project
      ref="addProject"
      @addCallback="addProjectCallback"
      @editCallback="editProjectCallback"
    ></dialog-add-project>
    <dialog-del-project-log ref="delProjectLog" @recoverCallback="initList" />
    <sticky
      :sticky-top="65"
      :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
    >
      <div class="clearfix">
        <el-button
          size="medium"
          :disabled="!authorityFilter(101)"
          type="primary"
          @click="addProject"
        >
          新建项目
        </el-button>
        <el-dropdown trigger="click">
          <el-button size="medium" type="primary">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :disabled="!authorityFilter(106)"
              @click.native="openDelLog"
            >项目回收站</el-dropdown-item>
            <el-dropdown-item
              v-if="authorityFilter(109)"
              :disabled="!multipleSelection.length"
              @click.native="exportFile()"
            >生成报告</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <search-area
          placeholder="请输入项目名称"
          @search="search"
          v-model="name"
          right-float
        ></search-area>
      </div>
    </sticky>
    <el-table
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      row-key="id"
      tooltip-effect="dark"
      @filter-change="searchFilter"
      @sort-change="searchSort"
      :default-sort="defaultSort"
      @selection-change="multipleSelection = $event"
    >

      <el-table-column reserve-selection type="selection" width="55"> </el-table-column>
      <el-table-column
        label="项目名称"
        prop="name"
        min-width="15%"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <el-link type="primary" :underline="false" @click="details(row)">
            {{ row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        width="120px"
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
        label="应用数量"
        min-width="10%"
        prop="component_total"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.packageNum }}
        </template>
      </el-table-column>
      <el-table-column
        label="组件"
        min-width="10%"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="component_total"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <el-tooltip effect="dark" :content="`严重：${get(row, 'componentNumVO.serious', 0)} | 高危：${get(row, 'componentNumVO.high', 0)} | 中危：${get(row, 'componentNumVO.medium', 0)} | 低危：${get(row, 'componentNumVO.low', 0)} | 无漏洞：${get(row, 'componentNumVO.normal', 0)}`" placement="top">
            <el-link :underline="false">
              {{ get(row, 'componentNumVO.total', 0) }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞"
        width="200"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="vul_total"
      >
        <template slot-scope="scope">
          <level-group :value="[
             scope.row.vulNumVO.serious,
             scope.row.vulNumVO.high,
             scope.row.vulNumVO.medium,
             scope.row.vulNumVO.low
             ]"/>
        </template>
      </el-table-column>
      <el-table-column
        label="许可证"
        min-width="15%"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="license_total"
      >
        <template slot-scope="scope">
          <level-group disabled :value="[
             null,
             scope.row.licenseNumVO.highNum,
             scope.row.licenseNumVO.mediumNum,
             scope.row.licenseNumVO.lowNum
             ]" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="10%"
        label="负责人"
        show-overflow-tooltip
      >
        <template #header>
          <oss-table-filter
            multiple
            :loading="userLoading"
            v-model="searchData.managerList"
            @change="search"
            :filters="userList"
          >
            负责人
          </oss-table-filter>
        </template>
        <template slot-scope="scope">
          {{ scope.row.manager }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="15%"
        label="最近更新"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="modify_date"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.modifyDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <icon-button
            :disabled="!( authorityFilter(104) && (row.manager === userInfo.username || userInfo.roleId === 1))"
            tooltip-content="编辑"
            class="iconbianji1"
            @click="editProject(row)"
          ></icon-button>
          <icon-button
            v-if="authorityFilter(100)"
            tooltip-content="导出SBOM"
            class="iconSBOM1"
            @click="exportSBOM(row)"
          ></icon-button>
          <icon-button
            v-if="authorityFilter(109)"
            tooltip-content="生成报告"
            class="iconshengchengbaogao"
            @click="exportFile(row)"
          ></icon-button>
          <icon-button
            :disabled="!( authorityFilter(105) && (row.manager === userInfo.username || userInfo.roleId === 1))"
            tooltip-content="删除"
            class="icondel"
            @click="delProject(row)"
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
</template>
<script>
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky/index.vue'
import MixinsList from '@/mixins/list.js'
import { projectList } from '@/api/home/project/conf'
import { mapState } from 'vuex'
import { awaitTo as to, get, hasOwn, isObject } from '@/utils'
import DialogAddProject from '@/components/dialog/dialogAddProject.vue'
import DialogDelProjectLog from '@/components/dialog/dialogDelProjectLog.vue'
import DialogExportSBOM from '@/views/home/report/report/dialogExportSBOM.vue'
import { downloadProjectSBOMReport } from '@/api/home/report'
import { projectDel } from '@/api/home/project'
import { allUser } from '@/api/home/user'
import { Message } from 'element-ui'
import { generateProjectGenerate } from '@/api/home/assets/module'

export default {
  name: 'ProjectConfList',
  mixins: [MixinsList],
  components: {
    DialogAddProject,
    DialogDelProjectLog,
    DialogExportSBOM,
    Sticky
  },
  data () {
    return {
      multipleSelection: [],
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
      name: '',
      currentPage: 1,
      loading: false,
      userLoading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      searchData: {
        managerList: [],
        sortFieldList: ['modify_date'],
        sortTypeList: [1]
      },
      userList: [],
      timeout: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo
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
    exportFile (row) {
      const handle = async (projectIds) => {
        const [error, response] = await to(generateProjectGenerate({ projectIds }))
        if (isObject(error)) {
          this.$message.error(error.message)
        } else {
          setTimeout(() => this.$popup({
            title: '提示',
            width: '550px',
            underline: true,
            confirmButtonText: '去下载',
            cancelButtonText: '留在本页',
            center: false,
            render (h) {
              return h('el-row', {
                class: 'font-base'
              }, [
                h('div', { class: 'm-b-15' }, ['操作成功，请在报告管理中下载报告~']),
                h('div', {}, ['报告名称：', get(response, 'data', '--')])
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
      if (row) return handle([row.id])
      const all = this.multipleSelection.length <= 0

      this.$popup({
        title: all ? '导出全部' : '导出',
        width: '550px',
        underline: true,
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        center: false,
        content: `<div> ${all ? '导出所有数据，是否继续导出？' : '导出所选数据，是否继续导出？'} </div>`,
        beforeClose: async (action, next) => {
          if (action === 'confirm') { handle(this.multipleSelection.map(item => item.id)) }
          next()
        }
      })
    },
    details (row) {
      this.$router.push({
        path: '/project/conf/details',
        query: {
          id: row.id
        }
      })
    },
    // 新建项目
    addProject () {
      this.$refs.addProject.type = 'add'
      this.$refs.addProject.dialogVisible = true
    },

    addProjectCallback () {
      this.$store.dispatch('selectProject', null)
      this.$store.dispatch('getProjectList')
      this.initList()
    },

    editProjectCallback () {
      this.$store.dispatch('getProjectList')
      this.initList()
    },

    // 导出 SBOM
    exportSBOM (row) {
      this.$refs.exportSBOM.xhr = downloadProjectSBOMReport
      this.$refs.exportSBOM.form.projectId = row.id
      this.$refs.exportSBOM.form.reportName = row.name
      this.$refs.exportSBOM.dialogVisible = true
    },

    // 编辑项目
    editProject (row) {
      this.$refs.addProject.type = 'edit'
      this.$refs.addProject.id = row.id
      this.$refs.addProject.dialogVisible = true
    },

    // 删除项目
    delProject (x) {
      this.$confirm('删除后可在删除记录中恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          projectDel({
            id: x.id
          })
            .then(async response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$store.dispatch('selectProject', null)
              this.$store.dispatch('getProjectList')
              this.search()
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        })
    },

    // 项目回收站
    openDelLog () {
      this.$refs.delProjectLog.dialogVisible = true
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
      } else if (filers.managerList) {
        this.$set(this.searchData, 'managerList', filers.managerList)
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
    async search () {
      this.currentPage = 1
      await this.initList()
    },

    async getUserList () {
      this.userLoading = true
      const [error, result] = await to(allUser({ loading: false }))
      this.userLoading = false
      if (isObject(error)) return Message.error(error.message)
      this.userList = get(result, 'data', []).map(item => ({ value: item.username, label: item.username, text: item.username, ...item }))
    },

    // 初始化列表
    async initList (auto) {
      if (!this.authorityFilter(102)) return
      if (auto !== 'auto') {
        this.loading = true
      }
      // 保存搜索条件
      this.saveSearchRecord({
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        name: this.name
      })

      projectList({
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        name: this.name,
        loading: false
      })
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
    }
  },
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  },
  mounted () {
    this.getUserList()
    this.search()
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-table__row:hover .el-link) {
  color: $color-primary !important;
}
</style>
