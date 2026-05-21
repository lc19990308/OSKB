<template>
  <div class="p-t-15">
    <OpenSourceProjectInfoDrawer ref="detailDrawer"></OpenSourceProjectInfoDrawer>
    <MatchingInfoDrawer ref="matchDrawer"></MatchingInfoDrawer>
    <el-row class="m-b-15 text-right">
      <oss-button-search
        placeholder="请输入名称"
        size="medium"
        style="width: 315px;"
        @search="search"
        v-model="searchData.projectName"
      ></oss-button-search>
    </el-row>
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      @sort-change="searchSort">

      <el-table-column
        label="开源项目名称"
        prop="fullName"
        min-width="20%"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-link type="primary" @click="$refs.detailDrawer.open(row)" :underline="false">
            {{get(row, 'openProjectName', '-')}}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="分支/版本"
        prop="openProjectVersion"
        min-width="15%"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="来源"
        prop="source"
        min-width="15%"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-link :underline="false" :href="row.fromUrl" target="_blank">
            {{ get(row, 'from', '-') }} <i class="el-icon-link" style="font-weight: 600"></i>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="许可证"
        prop="license"
        min-width="15%">
        <template slot-scope="{row}">
          {{ row.licenses && !!row.licenses.length ? '' : '-' }}
          <LicenseTag class="m-r-5 m-b-5" v-for="(item, index) in get(row, 'licenses', [])"
                      license :level="3"
                      :key="item + '-' + index">
            {{createStrSuffix(item, 15)}}
          </LicenseTag>
        </template>
      </el-table-column>
      <el-table-column
        label="匹配文件"
        prop="matchFileNum"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        width="170px">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" placement="top">
            <span slot="content">
              {{ info.matchType === 0 ? '文件级完全匹配' : '代码级相似匹配'}}：{{ get(row, 'matchFileNum', '-') }}
            </span>
            <el-link type="primary" @click="$refs.matchDrawer.open(row, globalParams)" :underline="false">
              {{get(row, 'matchFileNum', '-')}}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="匹配语言"
        prop="language"
        min-width="25%">
        <template slot-scope="{row}">
          {{row.language || '-'}}
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
import { getHomologyList } from '@/api/home/assets/app/codeV4'
import OpenSourceProjectInfoDrawer from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/OpenSourceProjectInfoDrawer'
import MatchingInfoDrawer from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/MatchingInfoDrawer'
import LicenseTag from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/LicenseTag.vue'
import { createStrSuffix } from '@/utils'
export default {
  name: 'SourceList',
  components: {
    MatchingInfoDrawer,
    OpenSourceProjectInfoDrawer,
    LicenseTag
  },
  props: ['filePath', 'globalParams'],
  data () {
    return {
      tableData: [],
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      searchData: {
        projectName: undefined
      },
      searchText: ''
    }
  },
  computed: {
    info () {
      let row = decodeURIComponent(this.$route.query?.row)
      if (row) {
        row = JSON.parse(row)
      }
      return row
    }
  },
  methods: {
    createStrSuffix,
    searchSort (sort) {
      this.searchData.field = undefined
      this.searchData.order = undefined
      if (sort.order) {
        this.searchData.field = sort.prop
        this.searchData.order = sort.order === 'ascending' ? 'ascend' : 'descend'
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

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      this.loading = true
      this.tableData = []

      getHomologyList({
        taskId: this.$route.query.taskId,
        sourceFilePath: this.filePath,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        ...this.searchData,
        ...this.globalParams,
        loading: false
      }).then(response => {
        this.loading = false
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          this.tableData.push(item)
        })

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
