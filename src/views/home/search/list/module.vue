<template>
  <div>
    <div class="language-radio-wrap">
      <el-radio-group class="language-radio-group" v-model="packageManager" @change="$refs.multipleTable.doLayout()">
        <el-radio v-for="(item, index) in packageManagerList" :key="index" :label="item.value">{{ item.text }}</el-radio>
      </el-radio-group>
    </div>
    <p>
      收录相关组件共 {{ statistic.toLocaleString() }} 个
    </p>
    <el-table
      class="w-full cursor-pointer"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      @row-click="detail"
      tooltip-effect="dark">
      <el-table-column
        label="包管理器"
        min-width="20%"
        prop="packageManager"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ matching(packageManagerList,row.packageManager,'value','text','-') }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="packageManager === 1 || tableData.length <= 0"
        label="发布厂商"
        min-width="20%"
        prop="vendor"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="xss(scope.row.vendor)"></span>
        </template>
      </el-table-column>
      <el-table-column
          label="组件名称"
          min-width="20%"
          prop="projectName"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-html="xss(scope.row.projectName)"></span>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--          label="许可证"-->
<!--          min-width="10%"-->
<!--          prop="licenseName"-->
<!--          show-overflow-tooltip>-->
<!--        <template slot-scope="scope">-->
<!--          <span v-html="scope.row.licenseName"></span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          label="最新版本"-->
<!--          min-width="15%"-->
<!--          prop="latestVersion"-->
<!--          show-overflow-tooltip>-->
<!--        <template slot-scope="scope">-->
<!--          <span v-html="xss(scope.row.latestVersion)"></span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
          label="最新更新日期"
          min-width="20%"
          prop="updateTime"
          show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div class="table-footer-wrapper clearfix">
      <pagination
          @size-change="initList"
          @current-change="initList"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          layout="total,sizes,prev,next"
          :total="total"
          class="right"
        ></pagination>
    </div>
  </div>
</template>
<script>
import { PAGE_CONF } from '@/utils/conf'
import { componentList } from '@/api/home/search'
import xss from 'xss'
export default {
  name: 'SearchModule',
  data () {
    return {
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      loading: false,
      searchText: '',
      total: 0,
      tableData: [],
      packageManager: -1,
      packageManagerList: [
        {
          text: '全部',
          value: -1
        },
        {
          text: 'Maven',
          value: 1
        },
        {
          text: 'PyPI',
          value: 2
        },
        {
          text: 'GoMod',
          value: 3
        },
        {
          text: 'Npm',
          value: 4
        },
        {
          text: 'NuGet',
          value: 5
        },
        {
          text: 'Composer',
          value: 6
        },
        {
          text: 'RubyGems',
          value: 7
        },
        {
          text: 'CocoaPods',
          value: 8
        }
      ],
      searchId: null,
      searchType: 3 // 1 历史记录   2 推荐列表   3 直接搜索
    }
  },
  props: ['setPackageManager', 'statistic'],
  watch: {
    packageManager () {
      this.$emit('update:setPackageManager', this.packageManager)
    }
  },
  methods: {
    xss: xss,
    // 详情
    detail (row) {
      this.$router.push({
        path: '/search/details',
        query: {
          id: row.id,
          type: row.packageManager
        }
      })
    },

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      this.loading = true
      componentList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        searchCondition: this.searchText,
        packageManager: this.packageManager,
        id: this.searchId,
        searchType: this.searchType,
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
        this.tableData = []
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  beforeDestroy () {},
  mounted () {}
}
</script>
<style scoped lang="scss">
.language-radio-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
