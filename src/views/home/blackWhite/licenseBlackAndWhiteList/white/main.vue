<template>
  <div class="view-content" style="margin-top: 0;" v-loading="loading">
    <DetailsPopup ref="details"></DetailsPopup>
    <sticky
      :sticky-top="65"
      :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
    >
      <div class="clearfix">
        <el-button v-if="authorityFilter(3561)" size="medium" type="primary" @click="$router.push('/black-white/license/white/add/quick')">添加</el-button>
        <el-button
          size="medium"
          type="primary"
          :disabled="!((name || searchData.securityLevels.length) ? tableData.length : true)"
          v-if="authorityFilter(3564)"
          @click="exportFile"
        >导出</el-button
        >
        <el-dropdown
          trigger="click"
        >
          <el-button
            size="medium"
            type="primary"
            :disabled="multipleSelection.length === 0"
          >
            更多操作<i class="el-icon-arrow-down el-icon--right"></i
          ></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="authorityFilter(3562)" @click.native="bulkDeletion">批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <search-area
          placeholder="请输入许可证名/许可证全名"
          @search="search"
          v-model="name"
          right-float
        ></search-area>
      </div>
    </sticky>
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      row-key="id"
      tooltip-effect="dark"
      @filter-change="searchFilter"
      @sort-change="searchSort"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
    >
      <template slot="bar">
        <el-button
          size="medium"
          type="primary"
          :disabled="!((name || searchData.securityLevels.length) ? tableData.length : true)"
          v-if="authorityFilter(3564)"
          @click="exportFile()"
        >导出</el-button>
        <el-button
          size="medium"
          type="primary"
          v-if="authorityFilter(3562)"
          @click="bulkDeletion"
        >批量删除</el-button>
      </template>
      <el-table-column reserve-selection type="selection" width="55"> </el-table-column>
      <el-table-column
        min-width="15%"
        label="风险等级"
        show-overflow-tooltip
      >
        <template #header>
          <oss-table-filter
            :default-props="{label: 'text', value: 'value' }"
            v-model="searchData.securityLevels"
            :filters="levelOptions"
            @change="search"
            title="风险等级"
            multiple
          />
        </template>
        <template slot-scope="{row}">
          <span class="level-tag danger" v-if="row.securityLevel === 1">高风险</span>
          <span class="level-tag warning" v-else-if="row.securityLevel === 2">中风险</span>
          <span class="level-tag info" v-else-if="row.securityLevel === 3">低风险</span>
        </template>
      </el-table-column>
      <el-table-column label="许可证名" min-width="20%" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-link @click="$refs.details.open(row.dicLicenseId)" type="primary" :underline="false">
            {{ get(row, 'shortName', '-') }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="许可证全名" min-width="20%" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ get(row, 'longName', '-') }}
        </template>
      </el-table-column>
      <el-table-column label="添加人" min-width="15%" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ get(row, 'username', '-') }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="15%"
        label="添加时间"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="created_date"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
         {{get(row, 'createdDate', '-')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="170" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-popconfirm
            v-if="authorityFilter(3562)"
            title="删除操作不可恢复, 是否继续？"
            @confirm="del(row)"
          >
            <icon-button
              tooltip-content="删除"
              class="icondel"
              slot="reference"
            ></icon-button>
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
</template>
<script>
import { PAGE_CONF } from '@/utils/conf'
import Sticky from '@/components/public/Sticky'
import { downloadBlobFile, hasOwn } from '@/utils'
import MixinsList from '@/mixins/list.js'
import { mapState } from 'vuex'
import DetailsPopup from '@/views/home/blackWhite/licenseBlackAndWhiteList/DetailsPopup'
import { exportLicenseBlackWhiteList, getLicenseBlackWhiteList, deleteLicenseBlackWhiteList } from '@/api/home/blackwhite/licenseBlackAndWhiteList'
import to from '@/utils/await-to'

export default {
  name: 'BlackList',
  mixins: [MixinsList],
  components: {
    DetailsPopup,
    Sticky
  },
  data () {
    return {
      project: this.$store.state.home.project,
      searchLevel: [],
      levelOptions: [
        {
          value: 1,
          text: '高风险'
        },
        {
          value: 2,
          text: '中风险'
        },
        {
          value: 3,
          text: '低风险'
        }
      ],
      name: '',
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      searchData: {
        sortFieldList: ['created_date'],
        sortTypeList: [1],
        securityLevels: []
      },
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({
      projectList: state => state.home.projectList
    }),
    defaultSort () {
      return {
        prop:
          this.searchData.sortFieldList.length > 0
            ? this.searchData.sortFieldList[0]
            : '',
        order:
          this.searchData.sortTypeList.length > 0
            ? this.searchData.sortTypeList[0] === 1
              ? 'descending'
              : 'ascending'
            : ''
      }
    }
  },
  methods: {
    async del (row) {
      const [error] = await to(deleteLicenseBlackWhiteList({
        idList: isArray(row) ? row.map(item => item.id) : [row.id]
      }))
      if (error && error.message) {
        this.$message.error(error.message)
      } else {
        this.initList()
        this.$message.success('操作成功。')
        if (isArray(this.multipleSelection) && this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection()
        }
      }
    },
    bulkDeletion () {
      this.$popup({
        width: '550px',
        content: '<div class="text-center">删除操作不可恢复, 是否继续？</div>',
        underline: true,
        beforeClose: async (a, cd) => {
          if (a === 'confirm') this.del(this.multipleSelection)
          cd()
        }
      })
    },
    // // 导出文件
    exportFile () {
      this.$popup({
        width: '550px',
        content: this.multipleSelection.length ? '<p style="padding: 20px">导出所选数据，是否继续导出？</p>' : `<p style="padding: 20px">${(this.name || this.searchData.securityLevels.length) ? '导出搜索结果数据，是否继续导出？' : '导出所有许可证白名单数据，是否继续导出？'}</p>`,
        beforeClose: async (a, cd) => {
          if (a === 'confirm') {
            await this.exportFileSubmit()
            cd()
          } else {
            this.downloadLoading = false
            cd()
          }
        }
      })
    },

    // 导出文件
    async exportFileSubmit () {
      try {
        const ids = this.multipleSelection.map(x => x.id)
        const params = ids.length ? {
          ids,
          status: 2
        } : (this.name || this.searchData.securityLevels.length) ? {
          searchCondition: this.name,
          securityLevels: this.searchData.securityLevels,
          status: 2
        } : { status: 2 }

        const response = await exportLicenseBlackWhiteList(params)
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = []
        this.searchData.sortTypeList = []
      }
      this.search()
    },

    searchFilter (filers) {
      if (hasOwn(filers, 'securityLevels')) {
        this.searchData.securityLevels = filers.securityLevels
      } else {
        for (const x in filers) {
          if (Array.isArray(filers[x])) {
            this.searchData[x] = filers[x][0]
          }
        }
      }
      this.search()
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
      /**
       * 保存搜索条件
       * **/
      this.saveSearchRecord({
        searchCondition: this.name,
        searchData: this.searchData,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })

      const params = {
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        searchCondition: this.name,
        loading: false,
        status: 2
      }

      getLicenseBlackWhiteList(params)
        .then(response => {
          this.loading = false
          this.tableData = []
          const data = response.data
          this.tableData = data.records || []
          this.total = data.total
        })
        .catch(error => {
          this.tableData = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    filterLevel (value, row) {
      return row.securityLevel === value
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  },
  mounted () {
    this.initList()
  }
}
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;
  margin-top: 20px;

  .el-dropdown {
    color: inherit;
  }
}
</style>
