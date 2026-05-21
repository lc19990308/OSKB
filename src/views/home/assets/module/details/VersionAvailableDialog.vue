<template>
  <el-dialog :visible.sync="visible" title="其他无漏洞可用版本" width="650px" append-to-body modal-append-to-body
             :close-on-click-modal="false">
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      size="medium"
      row-key="dicComponentId"
      tooltip-effect="dark"
    >
      <el-table-column
        label="版本号"
        prop="version"
        sortable
        :sort-orders="['descending','ascending',null]"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'version', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        label="发布日期"
        prop="releaseDate"
        sortable
        :sort-orders="['descending','ascending',null]"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'releaseDate', '-')}}
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer-wrapper clearfix">
      <pagination
        @size-change="simulatePaging"
        @current-change="simulatePaging"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :total="total"
        :background="false"
        :pager-count="5"
        layout="prev, pager, next, jumper"
        class="right"
      ></pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="medium" class="w-80">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { PAGE_CONF } from '@/utils/conf'
import { versionList } from '@/api/home/blackwhite/baseline'
import { awaitTo as to, isObject, simulatePaging } from '@/utils'
import { openVersionList } from '@/api/open/scan/develop/integration'

export default {
  name: 'VersionAvailableDialog',
  data () {
    return {
      visible: false,
      name: '',
      tableData: [],
      dataSource: [],
      searchData: {
        name: '',
        language: '',
        vendor: '',
        nonVul: 1
      },
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      currentPage: 1,
      token: null
    }
  },
  methods: {
    open (info, token) {
      this.searchData.name = info.name
      this.searchData.language = info.language
      this.searchData.vendor = info.vendor
      this.token = token
      this.initList()
      this.visible = true
    },
    async initList () {
      this.loading = true
      const [error, response] = await to(this.token ? openVersionList({
        ...this.searchData,
        loading: false
      }, this.token) : versionList({
        ...this.searchData,
        loading: false
      }))
      this.loading = false
      if (isObject(error)) return this.$message.error(error.message)

      this.dataSource = this.get(response, 'data', [])
      this.total = this.dataSource.length
      this.simulatePaging()
    },
    simulatePaging () {
      this.tableData = simulatePaging(this.dataSource, this.currentPage, this.pageSize)
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding-bottom: 15px !important;
  padding-top: 20px !important;
}
</style>
