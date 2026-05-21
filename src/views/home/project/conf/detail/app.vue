<template>
  <div class="p-t-15">
    <el-row class="m-b-20">
      <search-area class="right" @search="search" v-model="searchData.searchCondition" placeholder="请输入应用名称" right-float></search-area>
      <el-select  class="right m-r-20" placeholder="请选择风险等级" size="medium" @change="search" multiple collapse-tags clearable
                  v-model="searchData.securityLevels">
        <el-option
          v-for="item in levelOptions"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select  class="right m-r-20" style="width: 200px;" placeholder="请选择来源" size="medium" @change="search" multiple
                  collapse-tags
                  clearable
                  v-model="searchData.sources">
        <el-option
          v-for="item in sourceOptions"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
    </el-row>
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      :default-sort = "{prop: 'upload_date', order: 'descending'}"
      @filter-change="searchFilter"
      @sort-change="searchSort"
    >
      <el-table-column
        label="应用名称"
        prop="name"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <el-tooltip
            class="text-primary"
            effect="dark"
            v-if="row.description"
            :content="row.description"
            placement="top"
          >
            <i class="el-icon-info" style="vertical-align: baseline;"></i>
          </el-tooltip>
          {{get(row, 'name', '-')}}
        </template>
      </el-table-column>
      <el-table-column
        label="来源"
        show-overflow-tooltip
      >
        <template #header>
          <oss-table-filter
            :default-props="{label: 'text', value: 'value' }"
            v-model="searchData.sources"
            :filters="sourceOptions"
            @change="search"
            title="来源"
            multiple
          />
        </template>
        <template slot-scope="{row}">
          {{matching(sourceOptions, row.source, 'value',  'text', '-' )}}
        </template>
      </el-table-column>
      <el-table-column
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
          <level-tag :level="get(row, 'securityLevelId', 5)"></level-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="组件数"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="component_total"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ get(row, 'componentTotal', 0) }}
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞数"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="vul_total"
      >
        <template slot-scope="{row}">
          <level-group
            :value="[
               row.vulNumVO.serious,
               row.vulNumVO.high,
               row.vulNumVO.medium,
               row.vulNumVO.low
               ]" />
        </template>
      </el-table-column>
      <el-table-column
        label="许可证数"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="license_total"
      >
        <template slot-scope="{row}">
          <level-group disabled :value="[
             null,
             row.licenseNumVO.highNum,
             row.licenseNumVO.mediumNum,
             row.licenseNumVO.lowNum
             ]" />
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="upload_date"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{get(row, 'uploadDate', '-')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="{ row }">
          <icon-button tooltip-content="详情" class="iconxiangqing" @click="detail(row)"></icon-button>
        </template>
      </el-table-column>.
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
import { affectedApplication } from '@/api/home/project/conf'
import { mapState } from 'vuex'
import { sourceOptions } from '@/store/constant'
export default {
  name: 'AffectedAppList',
  props: ['project'],
  data () {
    return {
      dicVulId: this.$route.query.dicVulId,
      levelOptions: [
        {
          value: 1,
          text: '严重'
        },
        {
          value: 2,
          text: '高危'
        },
        {
          value: 3,
          text: '中危'
        },
        {
          value: 4,
          text: '低危'
        },
        {
          value: 5,
          text: '无漏洞'
        }
      ],
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      searchData: {
        searchCondition: null,
        userIds: [],
        projectIds: [],
        sortFieldList: ['upload_date'],
        sortTypeList: [1]
      },
      total: 0,
      tableData: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo,
      userList: state => state.home.opticalUserList,
      binaryEnable: state => state.site.binaryEnable
    }),
    projectId () {
      return this.$route.query.id
    },
    sourceOptions () {
      return sourceOptions.filter(item => {
        switch (item.text) {
          case '二进制成分分析':
            return this.binaryEnable
          default:
            return true
        }
      })
    }
  },
  mounted () {
    if (this.projectId) {
      this.search()
    }
  },
  methods: {
    async detail (row) {
      await this.$store.dispatch('selectProject', {
        text: this.project.name,
        value: this.project.id,
        label: this.project.name,
        id: this.project.id,
        name: this.project.name,
        userId: this.project.userId
      })
      const path = this.matching(sourceOptions, row.source, 'value', 'route', 0)
      this.$router.push(path)
    },
    filterLevel (value, row) {
      return row.securityLevel === value
    },

    // 初始化列表
    initList () {
      this.loading = true
      affectedApplication({
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        projectId: this.projectId,
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
        })
        .catch(error => {
          this.tableData = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    searchFilter (filers) {
      const reg = new RegExp('(?<=:multiple)')
      for (const key in filers) {
        if (reg.test(key)) {
          this.searchData[key.slice(0, key.indexOf(':multiple'))] = filers[key]
        } else {
          this.searchData[key] = filers[key][0]
        }
      }
      this.search()
    },
    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = undefined
        this.searchData.sortTypeList = undefined
      }
      this.search()
    }
  }
}
</script>
