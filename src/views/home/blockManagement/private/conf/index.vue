<template>
  <div>
    <add-config-popup @change="initList" ref="addConfig"></add-config-popup>
    <el-alert type="primary" class="header-alert">
      <div class="alert-content">
        <i class="el-icon-info" style="margin-right: 3px;"></i>
        <span style="color: #333;">所有转发路径前自动加/repo。pypi仓库类型转发路径后自动加/simple。</span>
      </div>
    </el-alert>
    <div class="m-b-15">
      <el-button size="medium" type="primary" @click="$refs.addConfig.open()" v-if="authorityFilter(3551)">添加配置</el-button>
    </div>
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      row-key="id"
      tooltip-effect="dark"
    >
      <el-table-column
        min-width="150px"
        label="上游仓库"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'upstream', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
        label="仓库类型"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'repositoryType', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
        label="仓库名称"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'upstreamAlias', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
        label="转发路径"
        prop="vendor"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          /repo{{get(row, 'usablePath', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        width="150px"
        label="操作"
      >
        <template slot-scope="{row}">
          <icon-button tooltip-content="编辑" v-if="authorityFilter(3553)" @click="$refs.addConfig.open(row)" class="iconbianji1" ></icon-button>
          <el-popconfirm
            v-if="authorityFilter(3552)"
            placement="bottom-end"
            title="删除仓库配置后将不再进行转发和阻断。"
            icon="el-icon-info"
            icon-color="#F59E0B"
            @confirm="del(row)"
          >
            <icon-button slot="reference" tooltip-content="删除" class="icondel" ></icon-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer-wrapper clearfix">
      <pagination
        @size-change="initList"
        @current-change="initList"
        :current-page.sync="searchData.pageNum"
        :page-size.sync="searchData.pageSize"
        :total="total"
        class="right"
      ></pagination>
    </div>
  </div>
</template>

<script>
import { getRepositoryConfApi, delRepositoryConfApi } from '@/api/home/blockManagement/private'
import { to } from '@/utils'
import { PAGE_CONF } from '@/utils/conf'
import AddConfigPopup from '@/views/home/blockManagement/private/conf/AddConfigPopup'

export default {
  name: 'blockManagement-private-conf',
  components: { AddConfigPopup },
  data () {
    return {
      loading: false,
      tableData: [],
      searchData: {
        pageNum: 1,
        pageSize: PAGE_CONF.pageSize,
        sortFieldList: [],
        sortTypeList: []
      },
      total: 0
    }
  },
  methods: {
    async initList () {
      if (!this.authorityFilter(3554)) return
      this.loading = true
      const [error, response] = await to(getRepositoryConfApi({ loading: false, ...this.searchData }))
      this.loading = false
      if (response) {
        this.tableData = this.get(response, ['data', 'records'], [])
        this.total = this.get(response, ['data', 'total'], 0)
      } else {
        error.message && this.$message.error(error.message)
      }
    },
    async del (row) {
      const [error, response] = await to(delRepositoryConfApi(row.id, { loading: false }))
      if (response) {
        this.initList()
        this.$message.success('删除成功')
      } else {
        error.message && this.$message.error(error.message)
      }
    }
  },
  created () {
    this.initList()
  }
}
</script>
<style lang="scss" scoped>
.header-alert {
  position: relative;
  margin-bottom: 20px;
  padding-left: 12px !important;
  padding-right: 12px !important;

  :deep(.el-alert__content) {
    padding: 0;
  }

  :deep(.alert-content) {
    margin-bottom: 5px;
    padding: 0;

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  :deep(.el-alert__closebtn) {
    font-size: 18px;
    color: #999;
    font-weight: bold;
    top: 14px;
    &:hover {
      color: lighten(#999, 10%);
    }
  }
}
</style>
