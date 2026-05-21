<template>
  <el-select
    clearable
    :value="value"
    placeholder="请选择报告模板"
    @change="onChange"
    v-el-select-loadmore="loadMoreTheme"
  >
    <el-option
      v-for="item in templateOptions"
      :key="item.value"
      :label="item.text"
      :value="item.value"
    ></el-option>
    <div v-if="templateOptionsLoading" class="p-t-5 text-center text-secondary">
      加载中...
    </div>
  </el-select>
</template>
<script>
import { templateList } from '@/api/home/report/template'
export default {
  name: 'ScrollLoadSelect',
  props: {
    value: {
      type: [String, Number, Object],
      default: null
    },
    moduleCode: {
      type: [Number, String],
      default: 1
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      templateOptions: [],
      templateOptionsLoading: true,
      loadingOver: false,
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  directives: {
    'el-select-loadmore': {
      bind (el, binding) {
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition = (this.scrollHeight - this.scrollTop - 1) <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  watch: {
    moduleCode () {
      this.loadingOver = false
      this.templateOptions = []
      this.currentPage = 1
      this.initOptions()
    }
  },
  methods: {
    /**
     * 列表懒加载
     */
    loadMoreTheme () {
      if (!this.loadingOver) {
        this.currentPage++
        this.initOptions()
      }
    },
    // 初始化模板下拉
    initOptions  () {
      this.templateOptionsLoading = true
      templateList({
        pageNum: this.currentPage,
        pageSize: 10,
        moduleCodes: [this.moduleCode],
        loading: false
      })
        .then(response => {
          this.templateOptionsLoading = false
          const data = response.data
          const { records, pages, current } = data
          const newOptions = (records || []).map(item => ({
            value: item.id,
            text: item.name
          }))

          this.templateOptions = [
            ...this.templateOptions,
            ...newOptions
          ]
          this.totalPages = pages
          if (current >= this.totalPages) this.loadingOver = true
        })
        .catch(error => {
          this.templateOptions = []
          this.templateOptionsLoading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    onChange (value) {
      this.$emit('change', value)
    },
    refreshList () {
      this.loadingOver = false
      this.templateOptions = []
      this.currentPage = 1
      this.initOptions()
    }
  },
  mounted () {
    this.initOptions()
  }
}
</script>
