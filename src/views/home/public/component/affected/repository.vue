<template>
  <div class="p-t-15">
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      @filter-change="searchFilter"
      @sort-change="searchSort"
    >

      <el-table-column
        label="仓库地址"
        prop="url"
        min-width="15%"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="仓库分支"
        prop="branch"
        min-width="15%"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ row.branch || '--' }}
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--          label="拉取模式"-->
      <!--          min-width="15%"-->
      <!--          prop="pullMode"-->
      <!--          show-overflow-tooltip>-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.pullMode === 1 ? '自动' : '手动' }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        label="仓库大小"
        min-width="15%"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="byte_size"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.byteSize | byteSize }}
        </template>
      </el-table-column>
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
        <template slot-scope="scope">
          <level-tag :level="scope.row.securityLevel"></level-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="漏洞"
        width="200"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="vul_total"
      >
        <template slot-scope="scope">
          <level-group
            :value="[
               scope.row.vulNumVO.serious,
               scope.row.vulNumVO.high,
               scope.row.vulNumVO.medium,
               scope.row.vulNumVO.low
               ]" />
        </template>
      </el-table-column>
      <el-table-column
        label="组件"
        min-width="15%"
        sortable="custom"
        :sort-orders="['descending','ascending',null]"
        prop="component_total"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.componentNumVO.total }}
        </template>
      </el-table-column>
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
import { PAGE_CONF } from "@/utils/conf";
import { affectedRepositoryList } from "@/api/home/public/component/affected";
import { hasOwn } from "@/utils";

export default {
  name: "AffectedRepositoryList",
  data() {
    return {
      levelOptions: [
        {
          value: 1,
          text: "严重"
        },
        {
          value: 2,
          text: "高危"
        },
        {
          value: 3,
          text: "中危"
        },
        {
          value: 4,
          text: "低危"
        },
        {
          value: 5,
          text: "无漏洞"
        }
      ],
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      searchData: {},
      total: 0,
      tableData: []
    };
  },
  props: {
    dicComponentId: {
      default() {
        return null;
      }
    }
  },

  methods: {
    searchSort(sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop];
        this.searchData.sortTypeList = [sort.order === "ascending" ? 2 : 1];
      } else {
        this.searchData.sortFieldList = undefined;
        this.searchData.sortTypeList = undefined;
      }
      this.search();
    },

    searchFilter(filers) {
      if (hasOwn(filers, "securityLevels")) {
        this.searchData.securityLevels = filers.securityLevels;
      } else {
        for (const x in filers) {
          if (Array.isArray(filers[x])) {
            this.searchData[x] = filers[x][0];
          }
        }
      }
      this.search();
    },

    // 搜索
    search() {
      this.currentPage = 1;
      this.initList();
    },

    // 初始化列表
    initList() {
      this.loading = true;
      affectedRepositoryList({
        ...this.searchData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        dicComponentId: this.dicComponentId,
        loading: false
      })
        .then(response => {
          this.loading = false;
          this.tableData = [];
          const data = response.data;
          data.records.forEach(item => {
            this.tableData.push(item);
          });
          this.total = data.total;
        })
        .catch(error => {
          this.tableData = [];
          this.loading = false;
          if (typeof error === "object") {
            this.$message.error(error.message);
          }
        });
    }
  },
  watch: {
    dicComponentId() {
      if (this.dicComponentId) {
        this.search();
      } else {
        this.tableData = [];
      }
    }
  },
  mounted() {
    if (this.dicComponentId) {
      this.search();
    }
  }
};
</script>
<style scoped lang="scss"></style>
