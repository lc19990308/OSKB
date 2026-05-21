<template>
  <div class="info-section oss-border" style="padding: 20px;">
    <CustomizeVulRemarkDialog ref="CustomizeVulRemarkDialog" />
  <div class="text-right m-b-15 compound-search-box--btn">
      <span class="p-r-15" style="color: #333;">
        <span class="p-r-5">筛选黑名单漏洞</span>
        <el-switch :active-value="1" :inactive-value="0" @change="search" v-model="searchData.isBlackVul"></el-switch>
      </span>
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
      <el-select style="width: 150px;" @change="[searchText && search()]" class="customize-select" v-model="searchType" size="medium">
        <el-option
          v-for="item in searchTypeOptions"
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
                <pre style="margin: 0;">{{ scope.row.description || "-" }}</pre>
              </div>
            </el-col>
            <el-col tag="p" :span="24">
              <div class="title primary">修复建议：</div>
              <div class="content">
                <pre style="margin: 0;">{{ scope.row.suggestion || "-" }}</pre>
              </div>
            </el-col>
            <el-col tag="p" :span="24">
              <div class="title primary">备注：</div>
              <div class="content">
                <pre style="margin: 0;">{{ scope.row.remark || "-" }}</pre>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞名称"
        min-width="25%"
        prop="vulName"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <div style="display: flex;">
            <div style="overflow: hidden; text-overflow: ellipsis;">
              <div class="ellipsis">
                <el-tooltip v-if="row.vulName" :content="row.vulName" placement="top">
                  <span>{{row.vulName}}</span>
                </el-tooltip>
                <template v-else>--</template>
              </div>
            </div>
            <div style="padding-left: 5px;">
              <MarkTag :status="row.markStatus"></MarkTag>
            </div>
          </div>
        </template>
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
        min-width="15%"
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
      <!--      <el-table-column-->
      <!--          label="对应组件"-->
      <!--          min-width="15%"-->
      <!--          prop="componentName"-->
      <!--          show-overflow-tooltip>-->
      <!--      </el-table-column>-->
      <el-table-column
        label="漏洞类型"
        min-width="15%"
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
      <el-table-column
        label="操作"
        width="150px"
        prop="release_date"
      >
        <div @click.stop slot-scope="{row}">
          <icon-button
            v-if="authorityFilter(3713)"
            tooltip-content="编辑"
            class="iconliebiaoneibianji"
            @click.stop="$refs.CustomizeVulRemarkDialog.useDialog(row)"
          />
          <MarkBlackAndWhiteListDropdown
            @change="initList"
            :type="'vul'"
            :dic-component-ids="[row.dicVulId]"
            :project-id-list="[row.projectId]"
          />
        </div>
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
import { taskVulList } from '@/api/home/scan/integration/sourceCode'
import { PAGE_CONF } from '@/utils/conf'
import { get, hasOwn, rowClickExpand } from '@/utils'
import CustomizeVulRemarkDialog from '@/views/home/public/vul/CustomizeVulRemarkDialog.vue'
import MarkBlackAndWhiteListDropdown from '@/views/home/public/modules/MarkBlackAndWhiteListDropdown.vue'
import { markStatusOptions } from '@/store/constant'

export default {
  name: 'IntegrationDetailsVul',
  components: { MarkBlackAndWhiteListDropdown, CustomizeVulRemarkDialog },
  data () {
    return {
      markStatusOptions,
      projectId: this.$route.query.project,
      taskId: this.$route.query.task,
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
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      searchData: {
        exploitLevelId: undefined,
        securityLevels: [],
        isBlackVul: 0
      },
      searchText: '',
      searchType: 'xmirrorId',
      searchTypeOptions: [
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
      defaultExpand: []
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
      this.tableData = []
      taskVulList({
        taskId: this.taskId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        [this.searchType]: this.searchText,
        ...this.searchData,
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
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    }
  },
  mounted () {
    if (this.taskId !== undefined) {
      if (![10, '10'].includes(get(this.$route.query, '_securityLevel', 10))) {
        this.searchData.securityLevels = [Number(get(this.$route.query, '_securityLevel'))]
      }
      this.initList()
    }
  }
}
</script>
<style scoped lang="scss">
.info-section {
  .search-wrap {
    margin-bottom: 15px;
    text-align: right;
  }

  .el-dropdown {
    color: inherit;
  }
}
</style>
