<template>
  <div class="select-wrapper">
      <el-select
        popper-class="select-popper-wrapper"
        :value="value"
        multiple
        collapse-tags
        clearable
        :size="size"
        placeholder="请输入应用包/应用/仓库名称"
        class="input"
        @change="onChange"
      >
        <div class="header-search" style="padding: 0 15px">
          <!-- <el-select
            class="m-r-15"
            style="width: 180px;"
            placeholder="请选择项目"
            size="medium"
            clearable
            :popper-append-to-body="false"
            v-model="searchData.projectId"
            @change="searchValueChange"
            >
            <el-option
              v-for="item in projectOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select> -->
          <el-select
            class="m-r-15"
            style="width: 220px;"
            placeholder="请选择来源"
            size="medium"
            multiple
            collapse-tags
            clearable
            :popper-append-to-body="false"
            v-model="searchData.sources"
            @change="searchValueChange"
            >
            <el-option
              v-for="item in sourceOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input
            v-model="searchData.searchCondition"
            class="search-select-input"
            placeholder="请输入应用包名"
            style="width: 400px;"
            size="medium"
            @input="searchValueChange">
            <template #prefix>
              <i class="iconfont iconsousuo1"></i>
            </template>
          </el-input>
        </div>
        <el-option
          value="-1"
          label=""
          key="-1"
          :disabled="true"
          v-if="options.length === 0"
          style="text-align:center;cursor:auto"
        >无数据</el-option>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.text"
          :value="item.value"
          :title="item.text"
          class="table-select-option">
        </el-option>
        <div class="clearfix" style="padding: 15px 12px 0" v-if="options.length > 0">
          <pagination
            @current-change="previousTableChange"
            ref="pagination"
            @hook:mounted="handlePagination"
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            :prev-text="''"
            :next-text="''"
            :total="total"
            small
            layout="prev, jumper, next"
          ></pagination>
          <span class="right line-height-26">
            共{{ total > 0 ? `${Math.ceil(total / pageSize)}` : '0' }}页
          </span>
        </div>
      </el-select>
    </div>
</template>
<script>
import { sourceOptions } from '@/store/constant'
import { affectedApplication } from '@/api/home/project/conf'
import { mapState } from 'vuex'
export default {
  name: 'PaginationSelect',
  props: {
    value: {
      type: [String, Number, Object, Array],
      default: null
    },
    size: {
      type: String,
      default: 'small'
    },
    projectIds: {
      type: [Array, String, Number]
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      searchValue: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      options: [],
      projectOptions: [],
      searchData: {
        searchCondition: null,
        sources: []
      }
    }
  },
  computed: {
    ...mapState({
      binaryEnable: state => state.site.binaryEnable
    }),
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
  watch: {
    projectIds: {
      deep: true,
      handler () {
        this.searchValueChange()
        // this.onChange([])
      }
    }
  },
  methods: {
    onChange (value) {
      this.$emit('change', value)
    },
    handlePagination () {
      const jump = this.$refs.pagination.$el.querySelector('.el-pagination__jump')
      jump.childNodes.forEach(node => {
        if (node.nodeType === 3) {
          node.remove()
        }
      })
    },
    previousTableChange (value) {
      this.currentPage = value
      this.initOptions()
    },
    initOptions () {
      affectedApplication({
        pageNum: this.currentPage,
        pageSize: 10,
        loading: false,
        projectIds: this.projectIds,
        ...this.searchData
      })
        .then(response => {
          this.options = []
          const data = response.data
          data.records.forEach(item => {
            this.options.push(item)
          })
          this.options = data.records.map(item => ({
            text: `${item.name}${item.tag ? ('-' + item.tag) : ''}-${this.matching(sourceOptions, item.source, 'value', 'text', '-')}-${item.projectName}`,
            value: item.taskId
          }))
          this.total = data.total
        })
        .catch(error => {
          this.options = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    searchValueChange () {
      this.currentPage = 1
      this.initOptions()
    }
  },
  mounted () {
    this.projectOptions = [...this.projectListMixin]
    this.initOptions()
  }
}
</script>
<style scoped lang="scss">

.search-select-input {
  :deep(.el-input__prefix) {
    display: flex;
    align-items: center;
  }
  // :deep(.el-input__inner) {
  //   border-width: 0;
  //   border-bottom-width: 1px;
  //   border-color: #e5e6e7;
  // }
  // :deep(.el-input__inner:hover) {
  //   border-color: #e5e6e7 !important;
  // }
  // :deep(.el-input__inner:focus) {
  //   border-color: #e5e6e7 !important;
  //   box-shadow: none !important;
  // }
}

// .select-wrapper {
//   :deep(.select-popper-wrapper){
//     height: 100px;
//   .el-scrollbar {
//     height: 100px;
//   }
// }
// }
.select-popper-wrapper {
  height: 200px;
}

:deep(.el-pagination__jump){
  margin-left: 0;
}

.select-wrapper {
  flex: 1;
  border-radius: 3px;

  .el-select {
    width: 100%;
  }
}
.table-select-option {
  width: 660px;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<style lang="scss">
.select-popper-wrapper {
  height: 350px;

  .header-search {
    margin-top: 15px;
    margin-bottom: 15px;

    .el-scrollbar {
    max-height: 200px !important;

    .el-select-dropdown__wrap {
      max-height: 200px !important;
    }
  }
  }

  & > .el-scrollbar {
    height: 350px !important;
    max-height: 350px !important;

    .el-select-dropdown__wrap {
      height: 350px !important;
      max-height: 350px !important;
    }
  }

  // .el-select-dropdown__wrap,
  // .el-scrollbar {
  //   height: 350px !important;
  //   max-height: 350px !important;
  // }
}
</style>
