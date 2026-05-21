<template>
  <div class="view-content">
    <dialog-add-rule ref="dialogAddRule" @callback="search"></dialog-add-rule>
    <dialog-update-status ref="dialogUpdateStatus" @callback="changeStatus"></dialog-update-status>
    <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'">
      <div class="clearfix">
        <search-area placeholder="请输入内容" @search="search" v-model="searchText" right-float></search-area>
        <el-button
          type="primary"
          size="medium"
          @click="addRule"
          v-if="authorityFilter(2202)"
        >添加规则</el-button>
        <el-dropdown
          trigger="click"
          @command="ops($event,false)"
          v-if="authorityFilter(2204, 2205)"
        >
          <el-button size="medium" type="primary" :disabled="multipleSelection.length === 0">
            批量管理<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="del"
              v-if="authorityFilter(2204)"
            >删除</el-dropdown-item>
            <el-dropdown-item
              :command="changeStatus"
              v-if="authorityFilter(2205)"
            >修改状态</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </sticky>
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      @sort-change="searchSort"
      @filter-change="searchFilter"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="50"
        v-if="authorityFilter(2204)"
      >
      </el-table-column>
      <el-table-column
        prop="nameRule"
        min-width="15%"
        label="组件名规则"
      >
      </el-table-column>
      <el-table-column
        prop="vendorRule"
        label="厂商规则"
        min-width="15%"
      >
      </el-table-column>
      <el-table-column
        label="组件版本规则"
        prop="versionRule"
        min-width="20%">
      </el-table-column>
      <el-table-column
        prop="matchType"
        label="匹配类型"
        min-width="20%"
        show-overflow-tooltip>
        <template #header>
          <oss-table-filter
            :default-props="{label: 'text', value: 'value' }"
            v-model="searchData.matchType"
            :filters="matchTypeOptions"
            @change="search"
            title="匹配类型"
          />
        </template>
        <template slot-scope="scope">
          {{matching(matchTypeOptions, scope.row.matchType,'value', 'text', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="applyType"
        label="应用目标"
        min-width="20%"
        show-overflow-tooltip>
        <template #header>
          <oss-table-filter
            :default-props="{label: 'text', value: 'value' }"
            v-model="searchData.applyType"
            :filters="applicationGoalOptions"
            @change="search"
            title="应用目标"
          />
        </template>
        <template slot-scope="scope">
          {{matching(applicationGoalOptions, scope.row.applyType,'value', 'text', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="applyRange"
        label="规则应用范围"
        min-width="15%"
        show-overflow-tooltip>
        <template #header>
          <oss-table-filter
            :default-props="{label: 'text', value: 'value' }"
            v-model="searchData.applyRange"
            :filters="ruleApplicationScopeOptions"
            @change="search"
            title="规则应用范围"
          />
        </template>
        <template slot-scope="scope">
          {{matching(ruleApplicationScopeOptions, scope.row.applyRange,'value', 'text', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="create_date"
        sortable="createDate"
        :sort-orders="['descending', 'ascending', null]"
        label="创建时间"
        min-width="15%"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="effectiveStatus"
        label="状态"
        min-width="10%"
        show-overflow-tooltip>
        <template #header>
          <oss-table-filter
            :default-props="{label: 'text', value: 'value' }"
            v-model="searchData.effectiveStatus"
            :filters="statusOptions"
            @change="search"
            title="状态"
          />
        </template>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.effectiveStatus"
            @change="changeStatus(scope.row)"
            :disabled="!authorityFilter(2205)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作" fixed="right"
        min-width="15"
        v-if="authorityFilter(2204)"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <icon-button tooltip-content="删除" class="icondel" @click="del(scope.row)"></icon-button>
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
import { componentRuleList, delComponentRule, updateEffectiveStatusBatch } from '@/api/home/system/rule/index'
import DialogAddRule from '@/views/home/system/rule/dialogAddRule'
import DialogUpdateStatus from '@/views/home/system/rule/dialogUpdateStatus'

export default {
  components: {
    Sticky,
    DialogAddRule,
    DialogUpdateStatus
  },
  data () {
    return {
      loading: false,
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      project: this.$store.state.home.project || {},
      searchText: '',
      tableData: [],
      multipleSelection: [],
      /* 启用状态 */
      statusOptions: [
        {
          value: 0,
          text: '禁用'
        },
        {
          value: 1,
          text: '启用'
        }
      ],
      /* 匹配类型 */
      matchTypeOptions: [
        {
          value: 1,
          text: '精准匹配'
        },
        {
          value: 2,
          text: '正则匹配'
        }
      ],
      /* 应用目标 */
      applicationGoalOptions: [
        // {
        //   value: 2,
        //   text: '忽略组件'
        // },
        {
          value: 3,
          text: '黑名单组件'
        }, {
          value: 4,
          text: '白名单组件'
        }],
      /* 规则应用范围 */
      ruleApplicationScopeOptions: [
        {
          value: 1,
          text: '全项目下组件'
        },
        {
          value: 2,
          text: '全应用包下组件'
        }, {
          value: 3,
          text: '全节点下组件'
        }
      ],
      timeout: null,
      searchData: {

      }
    }
  },
  methods: {
    // 更改规则状态
    changeStatus (row) {
      let id = []
      if (row) {
        id.push(row.id)
        this.modifyStatus(id, row.effectiveStatus ? 1 : 0)
      } else if (this.multipleSelection.length > 0) {
        id = this.multipleSelection.map(x => x.id)
        this.$refs.dialogUpdateStatus.dialogVisible = true
        this.$refs.dialogUpdateStatus.callback = (value) => {
          this.modifyStatus(id, value)
        }
      }
    },

    modifyStatus (id, stauts) {
      updateEffectiveStatusBatch({
        idList: id,
        effectiveStatus: stauts
      }).then(response => {
        this.$message.success('修改成功')
        this.initList()
      }).catch(error => {
        this.$message.error(error.message)
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

    // 列表搜索
    searchFilter (filers) {
      for (const x in filers) {
        if (Array.isArray(filers[x])) {
          this.searchData[x] = filers[x][0]
        }
      }
      this.search()
    },

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 删除
    del (row) {
      this.$confirm('删除操作不可恢复，确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = []
        if (row) {
          id.push(row.id)
        } else if (this.multipleSelection.length > 0) {
          id = this.multipleSelection.map(x => x.id)
        }
        delComponentRule({
          idList: id
        }).then(() => {
          this.$message.success('操作成功！')
          this.initList()
        }).catch(error => {
          this.$message.error(error.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 初始化规则列表
    initList () {
      this.loading = true
      componentRuleList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        searchCondition: this.searchText,
        ...this.searchData,
        loading: false
      }).then(response => {
        this.loading = false
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          item.effectiveStatus = item.effectiveStatus === 1
          this.tableData.push(item)
        })
        this.total = data.total
      }).catch(error => {
        this.loading = false
        this.$message.error(error.message)
      })
    },

    // 添加规则
    addRule () {
      this.$refs.dialogAddRule.dialogVisible = true
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  },
  mounted () {
    this.initList()
  },
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}
</script>
