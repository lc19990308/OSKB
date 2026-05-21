<template>
  <div class="view-content">
    <div class="clearfix m-b-15">
      <div class="left" v-if="authorityFilter(2215)">
        <span>数据备份：</span>
        <el-switch
          v-model="switchBackup"
          @change="updateSwitch">
        </el-switch>
      </div>
      <el-dropdown
        trigger="click"
        class="right"
        @command="ops($event)"
        v-if="authorityFilter(2212)"
      >
        <el-button size="medium" type="primary" :disabled="multipleSelection.length === 0">
          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="del">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        type="primary"
        class="right m-r-20"
        size="medium"
        @click="backupNow"
        v-if="authorityFilter(2212)"
      >立即备份</el-button>
    </div>
    <div class="clearfix m-b-15">
      <span v-if="authorityFilter(2215)">
        <span>每隔</span>&nbsp;
        <el-input class="w-80" type="number" v-model.number="backupInterval" validate-event min="1" size="mini" @change="updateDay"></el-input>&nbsp;
        <span>天进行备份</span>
      </span>
      <div class="search-container">
        <el-date-picker
          class="w-full"
          v-model="searchDate"
          size="medium"
          type="datetimerange"
          range-separator="-"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="search"
        >
        </el-date-picker>
      </div>
    </div>
    <el-table
      class="w-full"
      v-loading="loading"
      :data="tableData"
      @filter-change="searchFilter"
      @sort-change="searchSort"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        v-if="authorityFilter([2212, 2214])"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        min-width="20%"
        show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="path"
          min-width="30%"
          label="备份路径"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="size"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        min-width="15%"
          label="大小"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.size | byteSize}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        min-width="15%"
        :formatter="formatStatus"
        show-overflow-tooltip>
        <template #header>
          <oss-table-filter
            :default-props="{label: 'text', value: 'value' }"
            v-model="searchData.status"
            :filters="statusOptions"
            @change="search"
            title="状态"
          />
        </template>
      </el-table-column>
        <el-table-column
          sortable="custom"
          :sort-orders="['descending','ascending',null]"
          prop="create_date"
          min-width="15%"
          label="时间"
          show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createDate}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作" fixed="right"
        width="150"
        v-if="authorityFilter([2212, 2214])"
      >
        <template slot-scope="scope">
          <icon-button
            tooltip-content="删除"
            class="icondel"
            @click="del(scope.row)"
            v-if="authorityFilter(2212)"
          ></icon-button>
          <icon-button
            tooltip-content="下载"
            class="iconxiazai"
            @click="download(scope.row)"
            v-if="authorityFilter(2214)"
          ></icon-button>
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
import { backupNow, deleteBatch, dataBackupLog, backupConfig, updateConfig, downloadBackup } from '@/api/home/system/backups'
import { PAGE_CONF } from '@/utils/conf'

export default {
  name: 'backup',
  data () {
    return {
      searchDate: [],
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      currentPage: 1,
      switchBackup: false,
      backupInterval: 0,
      total: 0,
      searchData: {},
      tableData: [],
      multipleSelection: [],
      timeout: null,
      statusOptions: [
        {
          value: 0,
          text: '生成中'
        }, {
          value: 1,
          text: '已生成'
        }, {
          value: 2,
          text: '生成失败'
        }
      ]
    }
  },
  methods: {
    // 删除
    del (row) {
      let id = []
      if (row) {
        id.push(row.id)
      } else if (this.multipleSelection.length > 0) {
        id = this.multipleSelection.map(x => x.id)
      }

      this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBatch({
          idList: id
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initList()
        }).catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除'
        })
      })
    },

    // 下载数据备份文件
    download (row) {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', downloadBackup({
        dataBackupLogId: row.id
      }))
      document.documentElement.appendChild(a)
      a.target = '_black'
      a.click()
      document.documentElement.removeChild(a)
    },

    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = ['create_date']
        this.searchData.sortTypeList = [1]
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

    // 开关改变
    updateSwitch (value) {
      updateConfig({
        dataBackupSwitch: value ? 1 : 0,
        dataBackupInterval: this.backupInterval
      }).then(() => {
        this.$message.success('操作成功！')
        this.getBackupConfig()
      }).catch((error) => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 天数改变
    updateDay (value) {
      value = parseInt(value)
      if (isNaN(value)) {
        value = 1
      } else if (typeof value === 'number' && value < 1) {
        value = 1
      }
      this.backupInterval = value
      updateConfig({
        dataBackupInterval: value * 1,
        dataBackupSwitch: this.switchBackup ? 1 : 0
      }).then((response) => {
        this.$message.success('操作成功！')
        this.getBackupConfig()
      }).catch((error) => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 获取数据备份页面配置
    getBackupConfig () {
      backupConfig({
        loading: false
      }).then((response) => {
        const data = response.data
        this.switchBackup = data.dataBackupSwitch !== 0
        this.backupInterval = data.dataBackupInterval
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    search () {
      this.currentPage = 1
      this.initList()
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 初始化列表
    initList (auto) {
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
      dataBackupLog({
        ...this.searchData,
        startDate: this.searchDate ? this.searchDate[0] : '',
        endDate: this.searchDate ? this.searchDate[1] : '',
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      }).then(response => {
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
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 立即执行数据备份
    backupNow () {
      backupNow({
      }).then(() => {
        this.open('提交成功', '提示')
        this.initList()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 判断状态
    formatStatus (row, column, cellValue) {
      if (cellValue === 0) {
        return '生成中'
      } else if (cellValue === 1) {
        return '已生成'
      } else {
        return '生成失败'
      }
    },

    // 更多操作
    ops (event, row) {
      event(row)
    },

    // 提示框
    open (content, tit) {
      this.$alert(content, tit, {
        confirmButtonText: '确定'
      })
    }
  },
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  },
  mounted () {
    this.initList()
    this.getBackupConfig()
  }
}
</script>
<style scoped lang="scss">
.search-container {
  float: right;
  width: 400px;
}
</style>
