<template>
  <el-drawer :visible.sync="visible" size="800" title="代理节点">
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      row-key="dicComponentId"
      tooltip-effect="dark"
    >
      <el-table-column
        min-width="150px"
        label="代理IP"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <oss-dot :type="row.status === 0 ? 'info' : 'success'" :plain="row.status === 0">{{get(row, 'ip', '-')}}</oss-dot>
        </template>
      </el-table-column>
      <el-table-column
        min-width="120px"
        label="代理名称"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'name', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
        label="阻断次数"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'preventCount', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        width="170px"
        label="上线时间"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'uptime', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        width="120px"
        label="代理绑定端口"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'port', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
        label="代理版本"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'version', '-')}}
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer-wrapper clearfix">
      <pagination
        @size-change="initList"
        @current-change="initList"
        :current-page.sync="searchData.pageNum"
        :page-size.sync="pageSize"
        :total="total"
        class="right"
        :layout="'total, prev, pager, next, jumper'"
        :prev-text="''"
        :next-text="''"
        small
        :background="false"
      ></pagination>
    </div>
  </el-drawer>
</template>

<script>
import { PAGE_CONF } from '@/utils/conf'
import { getNodeListApi } from '@/api/home/blockManagement/private'
import { to } from '@/utils'

export default {
  name: 'ProxyNodeLIstPopup',
  data () {
    return {
      visible: false,
      tableData: [],
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      searchData: {
        pageNum: 1,
        sortFieldList: [],
        sortTypeList: []
      },
      total: 0
    }
  },
  methods: {
    open () {
      this.visible = true
      this.searchData.pageNum = 1
      this.initList()
    },
    async initList () {
      const [error, response] = await to(getNodeListApi(this.searchData))
      if (response) {
        this.tableData = this.get(response, ['data', 'records'], [])
        this.total = this.get(response, ['data', 'total'], 0)
      } else {
        error.message && this.$message.error(error.message)
      }
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-drawer__header) {
  border-bottom: 1px solid #F0F0F1;
  padding: 15px 20px;
  font-size: 16px;
  margin-bottom: 0;
  line-height: normal;
  [role="heading"] {
    color: #1B2838;
  }
}
:deep(.el-drawer__body) {
  padding: 20px;
  overflow-y: auto;
}
</style>
