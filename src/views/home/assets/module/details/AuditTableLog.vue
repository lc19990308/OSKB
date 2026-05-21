<template>
  <div class="m-b-20">
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      row-key="dicComponentId"
      tooltip-effect="dark"
    >
      <el-table-column
        label="影响项目名"
        prop="projectName"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ get(row, 'projectName', '--') }}
        </template>
      </el-table-column>
      <el-table-column
        label="标记状态"
        prop="markStatus"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{matching(markStatusOptions, row.markStatus, 'value', 'label', '--')}}
        </template>
      </el-table-column>
      <el-table-column
        label="标记人"
        prop="markUserName"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{row.markUserName || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        label="审计状态"
        prop="auditStatus"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{matching(auditStatusOptions, row.auditStatus, 'value', 'label', '--')}}
        </template>
      </el-table-column>
      <el-table-column
        label="审计人"
        prop="auditUserName"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ get(row, 'auditUserName', '--') }}
        </template>
      </el-table-column>
      <el-table-column
        label="最新审计时间"
        prop="auditTime"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ get(row, 'auditTime', '--') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <AuditDropdown
            @change="initList"
            :type="'component'"
            :dic-risk-id="[dicComponentId]"
            :project-id-list="[row.projectId]"
          />
          <MarkBlackAndWhiteListDropdown
            @change="initList"
            :type="'component'"
            :dic-component-ids="[dicComponentId]"
            :project-id-list="[row.projectId]"
          />
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
import { affectedProjectList } from '@/api/home/public/component/affected'
import { PAGE_CONF } from '@/utils/conf'
import { auditStatusOptions } from '@/store/constant'
import AuditDropdown from '@/views/home/public/modules/AuditDropdown.vue'
import MarkBlackAndWhiteListDropdown from '@/views/home/public/modules/MarkBlackAndWhiteListDropdown.vue'

export default {
  name: 'AuditTableLog',
  components: { MarkBlackAndWhiteListDropdown, AuditDropdown },
  props: ['dicComponentId'],
  data () {
    return {
      tableData: [],
      loading: false,
      multipleSelection: [],
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      markStatusOptions: [
        {
          value: 1,
          label: '未标记'
        },
        {
          value: 2,
          label: '忽略'
        },
        {
          value: 3,
          label: '黑名单'
        },
        {
          value: 4,
          label: '白名单'
        }
      ],
      auditStatusOptions
    }
  },
  watch: {
    dicComponentId: {
      handler (val) {
        if (val) {
          this.currentPage = 1
          this.initList()
        }
      },
      immediate: true
    }
  },
  methods: {
    initList () {
      this.loading = true
      affectedProjectList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        dicComponentId: this.dicComponentId,
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
  }
}
</script>
