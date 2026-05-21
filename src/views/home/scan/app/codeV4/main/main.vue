<template>
  <div>
    <dialog-upload-app ref="uploadApp" @callback="search"/>
    <dialog-report ref="report"></dialog-report>
    <dialog-edit ref="edit" @callback="initList()"></dialog-edit>
    <select-item ref="selectItem" @change="$refs.uploadApp.open($refs.query.languagesOptions)"></select-item>
    <div class="view-content">
     <AppQueryBoxQueryBox :statusOptions="statusOptions" ref="query" v-model="searchData" @change="search"></AppQueryBoxQueryBox>
      <sticky
        :sticky-top="65"
        :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
      >
        <div class="clearfix">
          <el-button
            size="medium"
            type="primary"
            @click="$refs.selectItem.openDialog()"
          >
            添加应用
          </el-button>
          <el-dropdown
            trigger="click"
          >
            <el-button :disabled="!(multipleSelection.length > 0)" size="medium" type="primary">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="testing(multipleSelection)" v-if="authorityFilter(3402)">检测
              </el-dropdown-item>
              <el-dropdown-item v-if="authorityFilter(3404)" @click.native="exportFile(multipleSelection)">生成报告</el-dropdown-item>
              <el-dropdown-item v-if="authorityFilter(3403)" @click.native="batchDel(multipleSelection)">删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </sticky>
      <el-table
        ref="table"
        row-key="id"
        v-loading="loading"
        tooltip-effect="dark"
        :dynamic-options.sync="tableOptions"
        @filter-change="searchFilter"
        :data="tableData"
        @selection-change="multipleSelection = $event"
      >
        <template v-slot:bar>
            <el-button size="medium" type="primary" v-if="authorityFilter(3402)"
                       @click.native="testing(multipleSelection)">检测
            </el-button>
            <el-button size="medium" type="primary" v-if="authorityFilter(3404)" @click.native="exportFile(multipleSelection)">生成报告</el-button>
            <el-button size="medium" type="primary"  v-if="authorityFilter(3403)"
                       @click.native="batchDel(multipleSelection)">删除</el-button>
        </template>
        <el-table-column reserve-selection type="selection" width="55"></el-table-column>
        <el-table-column
          label="应用名称"
          prop="name"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <el-link
              type="primary"
              :disabled="row.status !== 3"
              class="ellipsis"
              :underline="false"
              @click="detail(row)"
            >
              {{ row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="版本号"
          prop="name"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            {{get(row, 'version', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          label="大小"
          prop="name"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            {{get(row, 'sizeByte', 0) | byteSize}}
          </template>
        </el-table-column>
        <el-table-column
          label="检测语言"
          prop="name"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            {{get(row, 'languages', []).join('、')}}
          </template>
        </el-table-column>
        <el-table-column
          label="检测精度"
          prop="matchType"
          width="170"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              v-model="searchData.matchType"
              :filters="matchTypeOptions"
              @change="search"
              title="检测精度"
            />
          </template>
          <template slot-scope="{ row }">
            {{get(row, 'matchType') === 0 ? '文件级' : get(row, 'matchType') === 1 ? `代码片段级(${get(row, 'matchCodeLine', 0)}行)` : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="文件总数"
          prop="total"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            {{get(row, 'fileNumber', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          label="匹配文件"
          prop="total"
          min-width="130"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            {{[1].includes(row.status) ? '-' : get(row, 'matchedFileNumber', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="150"
          show-overflow-tooltip
        >
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.status"
              :filters="statusOptions"
              @change="search"
              title="状态"
            />
          </template>
          <template slot-scope="{row}">
            <el-tooltip
              v-if="[2].includes(row.status)"
              class="item"
              effect="dark"
              :content="matching(statusOptions,row.status, 'value', 'text')"
              placement="top"
            >
              <oss-progress :percentage="get(row,'progress', 60)"></oss-progress>
            </el-tooltip>
            <oss-dot
              v-else
              :type="matching(statusOptions, row.status, 'value', 'type')"
            >
              {{ matching(statusOptions, row.status, 'value', 'text') }}
            </oss-dot>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="上传时间"
          prop="createdTime"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <oss-table-sort
              prop="created_time"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              上传时间
            </oss-table-sort>
          </template>
          <template slot-scope="{row}">
            {{ get(row, 'createdTime', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          label="最近检测完成"
          width="170"
          prop="endedTime"
          show-overflow-tooltip
        >
          <template v-slot:header>
            <oss-table-sort
              prop="ended_time"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              最近检测完成
            </oss-table-sort>
          </template>
          <template slot-scope="{ row }">
            {{ row.endedTime ? row.endedTime : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="检测时长" min-width="120" show-overflow-tooltip>
          <template v-slot:header>
            <oss-table-sort
              prop="duration"
              @change="search"
              :sort-field.sync="searchData.sortFieldList"
              :sort-type.sync="searchData.sortTypeList"
            >
              检测时长
            </oss-table-sort>
          </template>
          <template slot-scope="{ row }">
            {{ row.durationFormat ? row.durationFormat : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="160px">
          <template slot-scope="{row}">
            <el-popconfirm
              v-if="[1,2].includes(row.status)"
              confirm-button-text='确定'
              cancel-button-text='取消'
              placement="top"
              icon="el-icon-info"
              @confirm="cancelTask(row)"
              title="确定要取消检测吗？"
            >
              <icon-button
                slot="reference"
                tooltip-content="取消检测"
                class="iconquxiaojiance"
                style="margin-right: 10px"
              ></icon-button>
            </el-popconfirm>
            <icon-button
              v-else
              :tooltip-content="row.status === 0 ? '开始检测' : '重新检测'"
              class="icona-shencha3"
              @click="testing(row.id)"
            ></icon-button>
            <icon-button
              tooltip-content="编辑"
              class="iconbianji1"
              @click="$refs.edit.open(row.id)"
            ></icon-button>
            <icon-button
              :disabled="![3].includes(row.status)"
              v-if="authorityFilter(3404)"
              tooltip-content="报告"
              class="iconshengchengbaogao"
              @click="createReport(row)"
            ></icon-button>
            <icon-button
              tooltip-content="删除"
              class="icondel"
              @click="batchDel([row])"
              style="margin-right: 10px"
            ></icon-button>
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
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { appList, delTask, cancelTask, batchTesting } from '@/api/home/assets/app/codeV4'
import DialogUploadApp from './dialogUploadApp'
import DialogReport from './dialogReport'
import AppQueryBoxQueryBox from './AppQueryBox'
import list from '@/mixins/list'
import { awaitTo as to, hasOwn, isObject } from '@/utils'
import SelectItem from './selectItem'
import DialogEdit from '@/views/home/scan/app/codeV4/main/dialogEdit.vue'

export default defineComponent({
  name: 'codeV4',
  mixins: [list],
  components: {
    DialogEdit,
    SelectItem,
    DialogUploadApp,
    DialogReport,
    AppQueryBoxQueryBox
  },

  data () {
    return {
      loading: false,
      tableOptions: {
        to: '操作',
        uuid: 'AppPackageCodeThreatReviewList',
        columns: [
          {
            label: '应用名称',
            checked: true,
            disabled: true
          },
          {
            label: '版本号',
            checked: true,
            disabled: true
          },
          {
            label: '大小',
            checked: true,
            disabled: false
          },
          {
            label: '检测语言',
            checked: false,
            disabled: false
          },
          {
            label: '检测精度',
            checked: true,
            disabled: false
          },
          {
            label: '文件总数',
            checked: true,
            disabled: false
          },
          {
            label: '匹配文件',
            checked: true,
            disabled: false
          },
          {
            label: '状态',
            checked: true,
            disabled: false
          },
          {
            label: '上传时间',
            checked: false,
            disabled: false
          },
          {
            label: '最近检测完成',
            checked: false,
            disabled: false
          },
          {
            label: '检测时长',
            checked: true,
            disabled: false
          },

          {
            label: '操作',
            checked: true,
            disabled: true
          }
        ]
      },
      multipleSelection: [],
      tableData: [],
      matchTypeOptions: [
        { label: '文件级', value: 0 },
        { label: '代码片段级', value: 1 }
      ],
      statusOptions: [
        {
          value: 0,
          text: '未检测',
          type: 'info',
          progress: 10
        },
        {
          value: 1,
          text: '排队中',
          type: 'warning',
          progress: 30
        },
        {
          value: 2,
          text: '检测中',
          type: 'primary',
          progress: 70
        },
        {
          value: 3,
          text: '检测完成',
          type: 'success',
          progress: 100
        },
        {
          value: 4,
          text: '检测失败',
          type: 'warning',
          progress: 100
        },
        {
          value: 5,
          text: '检测超时',
          type: 'danger',
          progress: 100
        },
        {
          value: 6,
          text: '暂停检测',
          type: 'info',
          progress: 100
        },
        {
          value: 7,
          text: '取消检测',
          type: 'info',
          progress: 100
        }
      ],
      total: 0,
      searchData: {
        pageNum: 1,
        precision: undefined,
        status: undefined,
        languageCodes: [],
        sortFieldList: [],
        sortTypeList: []
      }
    }
  },
  methods: {
    hasOwn,
    // 检测
    async testing (id) {
      const [error] = await to(batchTesting({ idList: Array.isArray(id) ? id.map(item => item.id) : [id] }))
      if (error && error.message) return this.$message.error(error)
      this.$message.success('操作成功')
      if (Array.isArray(id)) { this.$refs.table.clearSelection() }
      this.initList()
    },
    // 搜索
    search () {
      this.$refs.table.clearSelection()
      this.searchData.pageNum = 1
      this.initList()
    },

    // 初始化列表
    initList (auto) {
      if (!this.authorityFilter(3401)) return
      if (auto !== 'auto') {
        this.loading = true
      } else if (this.multipleSelection.length > 0) {
        if (this.timeout !== null) {
          clearTimeout(this.timeout)
          this.timeout = null
        }
        this.timeout = setTimeout(this.initList, 10000, 'auto')
        return
      }

      const params = {
        ...this.searchData,
        projectId: this.projectMixin.id,
        status: typeof this.searchData.status === 'number' ? [this.searchData.status] : undefined,
        loading: false
      }

      if (this.searchData.languageCodes.length <= 0) {
        delete params.languageCodes
      }

      appList(params).then(response => {
        this.loading = false
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          this.tableData.push(item)
        })

        this.total = data.total
        if (this.timeout !== null) {
          clearTimeout(this.timeout)
          this.timeout = null
        }
        this.timeout = setTimeout(this.initList, 10000, 'auto')
      })
        .catch(error => {
          this.total = 0
          this.loading = false
          if (typeof error === 'object' && error.message) {
            this.$message.error(error.message)
          }
        })
    },
    // 生成报告
    createReport (row) {
      this.$refs.report.dialogVisible = true
      this.$refs.report.row = row
      if (!isArray(row)) {
        this.$refs.report.form.name = row.name
      }
    },

    // 取消检测
    async cancelTask (row) {
      const [error] = await to(cancelTask(row.id))
      if (isObject(error)) {
        this.$message.error(error.message)
      } else {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.$refs.table.clearSelection()
        this.initList()
      }
    },

    // 删除
    batchDel (row) {
      this.$popup({
        width: '550px',
        render (h) {
          return h('p', { style: { padding: '10px 25px' } }, (row.every(item => item.status === 3) ? '应用正在检测中，' : (row.every(item => item.status === 2) ? '应用正在排队中，' : '')) + '确定要删除所选应用吗？删除后该应用关联检测结果会同步删除！')
        },
        beforeClose: async (a, c) => {
          if (a === 'confirm') {
            await this.del(row)
          }
          c()
        }
      })
    },

    async del (row) {
      const [error] = await to(delTask({
        idList: isArray(row) ? row.map(i => i.id) : [row.id]
      }))
      if (isObject(error)) {
        this.$message.error(error.message)
      } else {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        if (isArray(row)) this.$refs.table.clearSelection()
        this.initList()
      }
    },

    // 详情
    detail (row) {
      this.$router.push({
        path: '/scan/app/v4_code/details',
        query: {
          id: row.id,
          taskId: row.taskId,
          matchType: row.matchType,
          row: encodeURIComponent(JSON.stringify(row))
        }
      })
    },

    // 导出文件
    exportFile (row) {
      this.$refs.report.row = row
      this.$refs.report.dialogVisible = true
    }
  },
  watch: {
    '$store.state.home.project' (n) {
      if (n !== null) {
        this.search()
      }
    }
  },
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
})
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;

  .common-header {
    padding-top: 15px;
    padding-left: 15px;
  }

  .el-row > .left {
    margin-right: 30px;
    margin-bottom: 15px;

    .input-label {
      line-height: 34px;
    }

    .input,
    .el-select {
      width: 240px;
      margin-right: 20px;
    }
  }

  .el-dropdown {
    color: inherit;
  }
}
</style>
