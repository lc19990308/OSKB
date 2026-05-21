<template>
  <div>
    <h3 class="headline m-t-20"><i class="iconfont iconshengminglujing"></i>路径列表</h3>
    <el-table
      :data="tableData"
      v-loading="loading"
      :show-header="false"
      tooltip-effect="dark"
      row-key="dicVulId">

      <el-table-column
        min-width="100%"
        label="许可证声明文件路径"
        prop="path">
        <template slot-scope="{row}">
          <el-tooltip placement="top-start">
            <div style="max-width: 600px" slot="content">
              {{row.path}}
            </div>
            <div class="ellipsis">{{row.path}}</div>
          </el-tooltip>
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

export default {
  name: 'ScanAppDetailsLicense',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      loading: false,
      pageConf: PAGE_CONF,
    }
  },
  props: {
    dicLicenseId: {
      default () {
        return null
      }
    },
    projectId: {
      default() {
        return null;
      }
    },
    taskId: {
      default() {
        return null;
      }
    },
    initXhr: {
      type: Function,
      default() {
        return () => {};
      }
    }
  },
  watch: {
    dicLicenseId (newVal) {
      if (newVal) {
        this.search()
      } else {
        this.tableData = []
      }
    }
  },
  methods: {
    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 或者许可证路径列表
    initList () {
      this.initXhr({
        dicLicenseId: this.dicLicenseId,
        taskId: this.taskId,
        projectId: this.projectId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      }).then(response => {
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          this.tableData.push(item)
        })
        this.total = data.total
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
  },
  mounted () {
    if (this.dicLicenseId !== null) {
      this.initList()
    }
  }
}
</script>
<style scoped lang="scss">
</style>
