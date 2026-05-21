<template>
  <el-dialog @close="close" :visible.sync="visible" title="组件依赖路径" width="1200px" append-to-body modal-append-to-body
             :close-on-click-modal="false">
    <el-row class="m-b-15">
      <search-area @search="search" v-model="searchData.searchCondition" placeholder="请输入依赖路径" right-float>
      </search-area>
    </el-row>
    <div style="min-height: 400px;">
      <el-table
        class="w-full"
        ref="table"
        :data="tableData"
        :key="key"
        tooltip-effect="dark"
        @filter-change="searchFilter"
      >
        <el-table-column
          label="依赖路径"
          min-width="100px"
          prop="filepath"
        >
          <template v-slot="{row}">
          <pre style="white-space: pre-line; padding: 0; margin: 0; line-height: 25px;"
               v-text="get(row, 'filepath', '-')"
               v-clamp="{clamp: 5,responsive: false, text: get(row, 'filepath', '-')}">
          </pre>
          </template>
        </el-table-column>
        <el-table-column
          label="文件位置"
          min-width="150px"
          prop="parseInfo"
        >
          <template slot-scope="{row}">
            <template v-if="row.parseInfo">
              {{ get(row, 'parseInfo.fileName') }}:{{ get(row, 'parseInfo.lineNumber') }}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          label="依赖声明代码"
          min-width="150px"
          prop="originText"
        >
          <template slot-scope="{row}">
            <template v-if="row.parseInfo">
            <pre style="white-space: pre-line; padding: 0; margin: 0;"
                 v-text="get(row, 'parseInfo.originText', '-')"
                 v-clamp="{clamp: 5,responsive: false, text: get(row, 'parseInfo.originText', '-')}">
            </pre>
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          label="依赖方式"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.dependentType"
              :filters="[
                {
                  value: 1,
                  text: '直接依赖'
                },
                {
                  value: 2,
                  text: '间接依赖'
                }]"
              @change="search"
              title="依赖方式"
            />
          </template>
          <template slot-scope="{row}">
            {{ get(row, 'dependentType') === 0 ? '全部依赖' : '' }}
            {{ get(row, 'dependentType') === 1 ? '直接依赖' : '' }}
            {{ get(row, 'dependentType') === 2 ? '间接依赖' : '' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="medium" class="w-80">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { PAGE_CONF } from '@/utils/conf'
import { awaitTo as to, isObject } from '@/utils'
import list from '@/mixins/list'
let key = 100
export default {
  name: 'ComponentDependencyPathDialog',
  data () {
    return {
      visible: false,
      name: '',
      key: 'codeTraceability-dependency-path' + key,
      tableData: [],
      searchData: {
        dependentType: undefined,
        searchCondition: undefined,
        sortFieldList: [],
        sortTypeList: []
      },
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      currentPage: 1
    }
  },
  mixins: [list],
  props: {
    xhr: {
      type: Function,
      default: () => {
      }
    }
  },
  methods: {
    async open () {
      this.visible = true
      await this.initList()
    },
    search () {
      this.currentPage = 1
      this.initList()
    },
    async initList () {
      this.key = 'codeTraceability-dependency-path' + key++
      const [error, response] = await to(this.xhr({
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }, true))

      if (isObject(error)) {
        return this.$message.error(error.message)
      }

      this.tableData = this.get(response, 'data.records', [])

      this.total = this.get(response, 'data.total', [])
    },
    close () {
      this.$refs.table.clearFilter()
      this.tableData = []
      this.searchData = this.$options.data().searchData
    }
  }
}
</script>
