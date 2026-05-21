<template>
  <div class="p-t-15">
    <ComponentDependencyPathDialog :xhr="dependencyList" ref="componentDependencyPathDialog"></ComponentDependencyPathDialog>
    <el-row class="m-b-20">
      <search-area class="right" @search="search" v-model="searchData.searchCondition" placeholder="请输入应用名称" right-float></search-area>
      <el-select-v2-project placeholder="请选择所属项目" class="m-r-10 right" @change="search" multiple collapse-tags  v-model="searchData.projectIds" size="medium" />
    </el-row>
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      @filter-change="searchFilter"
      @sort-change="searchSort"
      row-key="taskId"
    >

      <el-table-column
        label="名称"
        prop="name"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <el-tooltip
            class="text-primary"
            effect="dark"
            v-if="row.description"
            :content="row.description"
            placement="top"
          >
            <i class="el-icon-info" style="vertical-align: baseline;"></i>
          </el-tooltip>
          {{get(row, 'name', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        label="所属项目"
        min-width="100"
        prop="projectName"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="负责人"
        min-width="100"
        show-overflow-tooltip
      >
        <template #header>
          <oss-table-filter
            multiple
            :default-props="{
              label: 'label',
              value: 'userId'
            }"
            v-model="searchData.userIds"
            @change="search"
            :filters="userList"
          >
            负责人
          </oss-table-filter>
        </template>
        <template slot-scope="{row}">
          {{get(row, 'principal', '-')}}
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
        <template slot-scope="{row}">
          <level-tag :level="get(row, 'securityLevelId', 5)"></level-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="组件"
        min-width="100"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="component_total"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ get(row, 'componentTotal', 0) }}
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞"
        width="200"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="vul_total"
      >
        <template slot-scope="{row}">
          <level-group
            :value="[
               row.vulNumVO.serious,
               row.vulNumVO.high,
               row.vulNumVO.medium,
               row.vulNumVO.low
               ]" />
        </template>
      </el-table-column>
      <el-table-column
        label="许可证数"
        width="150"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="license_total"
      >
        <template slot-scope="{row}">
          <level-group disabled :value="[
             null,
             row.licenseNumVO.highNum,
             row.licenseNumVO.mediumNum,
             row.licenseNumVO.lowNum
             ]" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
        label="来源"
        :class-name="'cursor-pointer'"
        :filters="sourceOptions"
        filter-multiple
        column-key="sources:multiple"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{matching(sourceOptions, row.source, 'value',  'text', '-' )}}
        </template>
      </el-table-column>
      <el-table-column
        label="依赖路径统计"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <div @click="openDependencyDialog(row)">
            <el-link class="block" :underline="false" type="primary" v-if="row.directDependentCount">
              直接依赖：{{ row.directDependentCount }}
            </el-link>
            <el-link :underline="false" type="primary" v-if="row.indirectDependentCount">
              间接依赖：{{ row.indirectDependentCount }}
            </el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        width="150"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="upload_date"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'uploadDate', '-')}}
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer-wrapper clearfix">
      <pagination
        small
        :background="false"
        @size-change="initList"
        @current-change="initList"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :layout="'total, prev, pager, next, jumper'"
        :total="total"
        class="right"
        :prev-text="''"
        :next-text="''"
      >
      </pagination>
    </div>
  </div>
</template>
<script>
import { PAGE_CONF } from '@/utils/conf'
import { vulAffectedApplication } from '@/api/home/public/component/affected'
import { mapState } from 'vuex'
import ComponentDependencyPathDialog from '@/views/home/assets/module/ComponentDependencyPathDialog'
import { dependencyList } from '@/api/home/assets/module'
import { sourceOptions } from '@/store/constant'
import ElSelectV2Project from '@/views/home/project/conf/ElSelectV2Project'
export default {
  name: 'AffectedAppList',
  components: { ElSelectV2Project, ComponentDependencyPathDialog },
  props: {
    dicComponentId: {
      default () {
        return null
      }
    }
  },
  data () {
    return {
      sourceOptions,
      dicVulId: this.$route.query.dicVulId,
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
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      searchData: {
        searchCondition: null,
        userIds: [],
        projectIds: []
      },
      total: 0,
      tableData: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo,
      userList: state => state.home.opticalUserList
    })
  },
  watch: {
    dicComponentId () {
      if (this.dicComponentId) {
        this.search()
      } else {
        this.tableData = []
      }
    }
  },
  mounted () {
    if (this.dicVulId) {
      this.search()
    }
  },
  methods: {
    dependencyList,

    filterLevel (value, row) {
      return row.securityLevel === value
    },

    openDependencyDialog (row) {
      const app = this.$refs.componentDependencyPathDialog
      app.searchData.taskId = row.taskId
      app.searchData.dicVulId = this.dicVulId
      app.open()
    },

    // 初始化列表
    initList () {
      this.loading = true
      vulAffectedApplication({
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        dicVulId: this.dicVulId,
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
        })
        .catch(error => {
          this.tableData = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    searchFilter (filers) {
      const reg = new RegExp('(?<=:multiple)')
      for (const key in filers) {
        if (reg.test(key)) {
          this.searchData[key.slice(0, key.indexOf(':multiple'))] = filers[key]
        } else {
          this.searchData[key] = filers[key][0]
        }
      }
      this.search()
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
    }
  }
}
</script>
