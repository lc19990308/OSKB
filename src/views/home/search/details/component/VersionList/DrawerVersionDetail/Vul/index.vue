<template>
  <div class="content-wrap info-section">
    <h3 class="headline m-t-20"><i class="iconfont iconloudongku" :style="[{'vertical-align':'bottom'},{'margin-right':'10px'}]"></i>漏洞信息</h3>
<!--    <div class="clearfix">-->
<!--      <div :span="24" class="search-wrap">-->
<!--        <search-area placeholder="请输入搜索信息" @search="search" v-model="searchText" right-float>-->
<!--          <search-select v-model="searchSelect" :select-options="searchSelectOptions"></search-select>-->
<!--        </search-area>-->
<!--      </div>-->
<!--    </div>-->
    <el-table
      class="w-full"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      row-key="id"
      :expand-row-keys="defaultExpand"
      @filter-change="searchFilter"
      @sort-change="searchSort"
      @expand-change="expandChange"
      @row-click="(row) => rowClickExpand(row,'defaultExpand','id')"
    >

      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row class="table-expand">
            <el-col tag="p" :span="24">
              <div class="title primary">CNNVD：</div>
              <div class="content">{{ scope.row.cnnvdId || '-' }}</div>
            </el-col>
            <el-col tag="p" :span="24">
              <div class="title success">CNVD：</div>
              <div class="content">{{ scope.row.cnvdId || '-' }}</div>
            </el-col>
            <el-col tag="p" :span="24">
              <div class="title warning">CWE：</div>
              <div class="content">{{ scope.row.cweId || '-' }}</div>
            </el-col>
            <el-col tag="p" :span="24">
              <div class="title primary">利用难度：</div>
              <div class="content">
                {{ scope.row.exploitLevelId === 1 ? '容易' : '困难' }}
              </div>
            </el-col>
            <el-col tag="p" :span="24">
              <div class="title danger">漏洞描述：</div>
              <div class="content"><pre style="margin: 0;">{{ scope.row.description || '-' }}</pre></div>
            </el-col>
            <el-col tag="p" :span="24">
              <div class="title primary">修复建议：</div>
              <div class="content"><pre style="margin: 0;">{{ scope.row.suggestion || '-' }}</pre></div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="XMIRROR"
        min-width="15%"
        prop="xmirrorId"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="CVE"
        min-width="15%"
        prop="cveId"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="漏洞名称"
        min-width="15%"
        prop="name"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        min-width="15%"
        label="风险等级"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <level-tag :level="scope.row.securityLevel"></level-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="利用难度"
        min-width="15%"
        prop="exploitLevelId"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.exploitLevelId === 1 ? '容易' : '困难' }}
        </template>
      </el-table-column>
      <el-table-column
        label="发布时间"
        min-width="15%"
        prop="release_date"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.releaseDate }}
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
import { componentVulList } from '@/api/home/search'

import { PAGE_CONF } from '@/utils/conf'
import { rowClickExpand } from '@/utils'
export default {
  name: 'VulList',
  props: ['packageManager', 'id'],
  data () {
    return {
      loading: false,
      searchSelect: 'xmirrorId',
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
      searchData: {},
      tableData: [],
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      defaultExpand: [],
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
      ]
    }
  },
  methods: {
    rowClickExpand,
    expandChange (row, arr) {
      if (arr.indexOf(row) !== -1) {
        this.defaultExpand = [row.id]
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
      for (const x in filers) {
        if (Array.isArray(filers[x])) {
          this.searchData[x] = filers[x][0]
        }
      }
      this.search()
    },

    // 点击组件的时候初始化漏洞列表
    search () {
      this.currentPage = 1
      this.tableData = []
      this.total = 0
      this.initList()
    },

    // 初始化漏洞列表
    initList () {
      this.loading = true
      this.tableData = []
      componentVulList({
        id: this.id,
        packageManager: this.packageManager,
        ...this.searchData,
        [this.searchSelect]: this.searchText,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      }).then(response => {
        this.loading = false
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          this.tableData.push(item)
        })
        if (this.tableData.length > 0) {
          this.defaultExpand = [this.tableData[0].id]
        }
        this.total = data.total
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.content-wrap {
  padding: 20px 0;
}

.headline {
  border: 0;
  padding: 0;
}
</style>
