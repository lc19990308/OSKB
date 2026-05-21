<template>
  <div class="content-wrap">
    <h3 class="headline"><i class="iconfont iconpermission"></i>许可证信息</h3>
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
        label="许可证名"
        min-width="25%"
        prop="shortName"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="许可证全名"
        min-width="25%"
        prop="longName"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        min-width="25%"
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
          <span class="level-tag danger" v-if="scope.row.securityLevel === 1"
            >高风险</span
          >
          <span
            class="level-tag warning"
            v-else-if="scope.row.securityLevel === 2"
            >中风险</span
          >
          <span class="level-tag info" v-else-if="scope.row.securityLevel === 3"
            >低风险</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="是否兼容GPL"
        min-width="25%"
        prop="gplCompatible"
        show-overflow-tooltip
      >
        <template #header>
          <oss-table-filter
            :default-props="{label: 'text', value: 'value' }"
            v-model="searchData.gplCompatible"
            :filters="compatibleList"
            @change="search"
            title="是否兼容GPL"
          />
        </template>
        <template slot-scope="scope">
          {{ scope.row.gplCompatible === 1 ? "兼容" : "不兼容" }}
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
import { componentLicenseList } from "@/api/open/scan/develop/integration";
import { PAGE_CONF } from "@/utils/conf";
import { hasOwn } from "@/utils";

export default {
  name: "license-list",
  inject: ["app"],
  data() {
    return {
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      tableData: [],
      compatibleList: [
        {
          text: "兼容",
          value: 1
        },
        {
          text: "不兼容",
          value: 0
        }
      ],
      searchData: {
        sortFieldList: [],
        sortTypeList: []
      },
      levelOptions: [
        {
          value: 1,
          text: "高风险"
        },
        {
          value: 2,
          text: "中风险"
        },
        {
          value: 3,
          text: "低风险"
        }
      ]
    };
  },
  props: {
    dicComponentId: {
      default() {
        return null;
      }
    },
    taskId: {
      default() {
        return null;
      }
    }
  },
  methods: {
    // 排序
    searchSort(sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop];
        this.searchData.sortTypeList = [sort.order === "ascending" ? 2 : 1];
      } else {
        this.searchData.sortFieldList = [];
        this.searchData.sortTypeList = [1];
      }
      this.search();
    },

    // 筛选
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
      if (this.project === null) {
        return 0;
      }
      this.loading = true;
      componentLicenseList(
        {
          ...this.searchData,
          shortName: this.name,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          projectId: this.app.params.projectId,
          taskId: this.app.params.taskId,
          dicComponentId: this.dicComponentId,
          loading: false
        },
        this.app.params.token
      )
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
<style scoped lang="scss">
.content-wrap {
  padding: 20px 0;
}
</style>
