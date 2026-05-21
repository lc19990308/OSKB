<template>
  <div class="select-wrapper">
    <el-select
      :value="value"
      :loading="loading"
      clearable
      placeholder="请选择"
      class="input"
      @change="onChange"
    >
      <div class="header-search" style="padding: 0 15px">
        <el-input
          clearable
          v-model="searchValue"
          class="search-select-input"
          placeholder="请输入内容"
          @input="searchValueChange">
            <template #prefix>
              <i class="iconfont iconsousuo1"></i>
            </template>
        </el-input>
      </div>
      <el-option value="-1" label="" key="-1" :disabled="true" v-if="options.length === 0" style="text-align:center;cursor:auto">无数据</el-option>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="(item.name || item.packageName || item.appPackageName || item.ip || '-') +( (item.version || item.branch || item.url) ? ' > ' + (item.version || item.branch || item.url) : '' )"
        :value="item.value"
        :disabled="disabledId === item.value"
        class="table-select-option">
        <span>
          <span>{{item.name || item.packageName || item.appPackageName || item.ip || '-'}}</span>
          <i class="iconfont iconfengefu m-l-5 m-r-5" style="font-size: 12px;vertical-align: middle;transform: scale(0.8)" v-if="item.version || item.branch || item.url"></i>
          <span>{{item.version || item.branch || item.url}}</span>
        </span>
      </el-option>
      <div class="clearfix" style="padding: 15px 12px 0; " v-if="options.length > 0">
        <pagination
          @current-change="paginationChange"
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
import { cloneDeep } from 'lodash-es'
import requestApi from '../utils'
export default {
  name: 'SelectTarget',
  props: {
    value: {
      type: [String, Number, Object],
      default: null
    },
    projectId: {
      type: [String, Number],
      default: ''
    },
    disabledId: {
      type: [String, Number],
      default: ''
    },
    moduleName: {
      type: String,
      default: 'component'
    },
    index: {
      type: String,
      default: 'previous'
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      options: [],
      total: 0,
      searchValue: '',
      currentPage: 1,
      pageSize: 10,
      loading: false
    }
  },
  mounted () {
    this.defaultSelected()
  },
  methods: {
    /**
     * 默认对比分析
     * @returns {any}
     */
    defaultSelected () {
      const { previousTask = null, behindTask = null } = this.$route.params
      if (this.index === 'previous') {
        if (previousTask) {
          this.options.push(cloneDeep({
            ...previousTask,
            value: this.moduleName === 'node' ? previousTask.id : previousTask.taskId
          }))
        }
      } else if (this.index === 'behind') {
        if (behindTask) {
          this.options.push(cloneDeep({
            ...behindTask,
            value: this.moduleName === 'node' ? behindTask.id : behindTask.taskId
          }))
        }
      }
      this.total = 2
      setTimeout(() => {
        this.searchValueChange('')
      }, 500)
    },
    handlePagination () {
      const jump = this.$refs.pagination.$el.querySelector('.el-pagination__jump')
      jump.childNodes.forEach(node => {
        if (node.nodeType === 3) {
          node.remove()
        }
      })
    },
    // 初始化下拉框
    initOptions (payload) {
      requestApi.getSelectOptions(this.moduleName, payload)
        .then(response => {
          this.options = []
          this.behindOptions = []
          const data = response.data
          data.records.forEach(item => {
            this.options.push({
              ...item,
              value: this.moduleName === 'node' ? item.id : item.taskId
            })
            // this.behindOptions.push(item)
          })
          this.total = data.total
          this.behindTotal = data.total
        })
        .catch(error => {
          this.options = []
          this.behindOptions = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    // 初始化下拉框
    initOptionsByType (payload) {
      this.loading = true
      requestApi.getSelectOptions(this.moduleName, payload)
        .then(response => {
          this.loading = false
          this.options = []
          const data = response.data
          data.records.forEach(item => {
            // this.options.push(item)
            this.options.push({
              ...item,
              value: this.moduleName === 'node' ? item.id : item.taskId
            })
          })
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
    onChange (value) {
      const selectedItem = this.options.find(item => item.value === value)
      this.$emit('change', value, selectedItem)
    },
    paginationChange (value) {
      this.initOptionsByType({
        name: this.searchValue,
        projectId: this.projectId,
        pageNum: value,
        status: 2,
        loading: false
      })
    },
    searchValueChange (value) {
      this.currentPage = 1
      this.initOptionsByType({
        name: value,
        index: this.index,
        projectId: this.projectId,
        pageNum: 1,
        status: 2,
        loading: false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.select-wrapper {
  flex: 1;
  padding: 14px 20px;
  background: #FFF;
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(0, 75, 144, 13%);

  .el-select {
    width: 100%;
  }
}

.search-select-input {
  :deep(.el-input__prefix) {
    display: flex;
    align-items: center;
  }
  :deep(.el-input__inner) {
    border-width: 0;
    border-bottom-width: 1px;
    border-color: #e5e6e7;
  }
  :deep(.el-input__inner:hover) {
    border-color: #e5e6e7 !important;
  }
  :deep(.el-input__inner:focus) {
    border-color: #e5e6e7 !important;
    box-shadow: none !important;
  }
}
:deep(.el-pagination__jump){
  margin-left: 0;
}
</style>
