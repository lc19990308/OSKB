<template>
  <div>
    <dialog-add-and-edit-template ref="dialogTemplate" :done="initList"></dialog-add-and-edit-template>
    <div class="view-content">
      <sticky
        :sticky-top="65"
        :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
      >
        <div class="clearfix">
          <el-button
            size="medium"
            type="primary"
            v-if="authorityFilter(3701)"
            @click="$refs.dialogTemplate.use()"
          >添加模板</el-button>
          <el-button
            size="medium"
            plain
            v-if="authorityFilter(3702)"
            @click="remove(selectedRows)"
            :disabled="selectedRows.length === 0"
          >批量删除</el-button>
          <el-row class="right">
            <el-select
              class=" m-r-20"
              placeholder="请选择所属模块" size="medium" @change="search" multiple
              collapse-tags clearable
                  v-model="searchData.moduleCodes">
              <el-option
                v-for="item in moduleOptions"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <search-area
              placeholder="请输入模版名称"
              @search="search"
              v-model="searchData.name"
              right-float
            >
            </search-area>
          </el-row>
        </div>
      </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        v-loading="loading"
        row-key="id"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <template slot="bar">
          <el-button
            size="medium"
            type="primary"
            v-if="authorityFilter(3702)"
            @click="remove(selectedRows)"
          >删除
          </el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"></el-table-column>
        <el-table-column
          label="模版名称"
          min-width="120"
          prop="name"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="所属模块"
          min-width="120"
          prop="moduleCode"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.moduleCodes"
              :filters="moduleOptions"
              @change="search"
              title="所属模块"
              multiple
            />
          </template>
          <template slot-scope="{row}">
            {{matching(moduleOptions, row.moduleCode, 'value',  'text', '-' )}}
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          min-width="120"
          prop="creator"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          :min-width="180"
          prop="createdTime"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.createdTime }}</template>
        </el-table-column>
        <el-table-column
          label="备注"
          :min-width="150"
          prop="note"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <icon-button
              tooltip-content="查看"
              class="iconchakan"
              v-if="authorityFilter(3704)"
              @click="$refs.dialogTemplate.use('view', scope.row)"
            ></icon-button>
            <icon-button
              tooltip-content="编辑"
              class="iconbianji1"
              v-if="authorityFilter(3703)"
              @click="$refs.dialogTemplate.use('edit', scope.row)"
            ></icon-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="删除操作不可恢复, 是否继续？"
              @confirm="remove(scope.row)"
              @onConfirm="remove(scope.row)"
            >
              <icon-button
                slot="reference"
                tooltip-content="删除"
                v-if="authorityFilter(3702)"
                class="icondel"></icon-button>
            </el-popconfirm>
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
  </div>
</template>

<script>
import { templateList, delTemplate, templateModules } from '@/api/home/report/template'
import { PAGE_CONF } from '@/utils/conf'
import DialogAddAndEditTemplate from '@/views/home/report/config/template/dialogAddAndEditTemplate.vue'

export default {
  name: 'report-template',
  components: { DialogAddAndEditTemplate },
  data () {
    return {
      searchData: {
        moduleCodes: [],
        name: undefined
      },
      pageSize: PAGE_CONF.pageSize,
      currentPage: 1,
      total: 0,
      loading: false,
      selectedRows: [],
      tableData: [],
      moduleOptions: []
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.selectedRows = val
    },
    /**
     * 初始化所属模块
     * @returns {any}
     */
    initModules () {
      return templateModules({
        loading: false
      })
        .then(response => {
          this.moduleOptions = (response.data || []).map(item => ({
            text: item.description,
            value: item.code
          }))
        })
        .catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    // 搜索
    search () {
      this.$refs.multipleTable.clearSelection()
      this.currentPage = 1
      this.initList()
    },
    // 初始化列表
    initList () {
      this.loading = true
      templateList({
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      })
        .then(response => {
          this.loading = false
          this.tableData = []
          const data = response.data
          data.records.forEach(item => {
            this.tableData.push(item)
          })
          this.total = data.total
          if (
            this.total > 0 &&
            data.records.length === 0 &&
            this.currentPage > 1
          ) {
            this.currentPage = this.currentPage - 1
            this.initList()
          }
        })
        .catch(error => {
          this.tableData = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    remove (row) {
      const f = async () => {
        const [error] = await to(delTemplate({
          idList: isArray(row) ? row.map(item => item.id) : [row.id]
        }))
        if (isObject(error)) {
          this.$message.error(error.message)
        } else {
          this.$message.success('删除成功')
          this.$refs.multipleTable.clearSelection()
          this.search()
        }
      }

      if (isArray(row)) {
        this.$popup({
          width: '550px',
          content: '<p style="padding: 20px">删除操作不可恢复, 是否继续？</p>',
          beforeClose: async (a, cd) => {
            if (a === 'confirm') {
              await f()
              cd()
            } else {
              cd()
            }
          }
        })
      } else {
        f()
      }
    }
  },
  mounted () {
    this.initModules()
    this.search()
  }
}
</script>

<style scoped>
:deep(.el-button.is-disabled.is-plain){
  background-color: #FFF;
  border-color: #9DA2A6;
  color: #999;
}
</style>
