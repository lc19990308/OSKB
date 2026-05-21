<template>
  <el-select
    :value="value"
    clearable
    placeholder="请选择"
    @change="selectChange"
    class="input"
    style="width: 190px"
  >
    <div class="header-search" style="padding: 0 15px">
      <el-input
        v-model="searchValue"
        class="search-select-input"
        placeholder="请输入内容"
        @input="searchValueChange"
      >
          <template #prefix>
            <i class="iconfont iconsousuo1"></i>
          </template>
      </el-input>
    </div>
    <el-option value="-1" label="" key="-1" :disabled="true" v-if="options.length === 0" style="text-align:center;cursor:auto">无数据</el-option>
    <slot name="option">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        class="table-select-option">
      </el-option>
    </slot>
    <div class="table-footer-wrapper clearfix" v-if="options.length > 0">
      <pagination
        @size-change="sizeChange"
        @current-change="pageChange"
        ref="pagination"
        @hook:mounted="handlePagination"
        :current-page="currentPage"
        :page-size="pageSize"
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
</template>
<script>
export default {
  name: 'TableSelect',
  props: ['value', 'options', 'total', 'currentPage', 'pageSize'],
  data () {
    return {
      searchValue: ''
    }
  },
  methods: {
    handlePagination () {
      const jump = this.$refs.pagination.$el.querySelector('.el-pagination__jump')
      jump.childNodes.forEach(node => {
        if (node.nodeType === 3) {
          node.remove()
        }
      })
    },
    sizeChange (value) {
      this.$emit('size-change', value, this.searchValue)
    },
    pageChange (value) {
      this.$emit('current-change', value, this.searchValue)
    },
    selectChange (value) {
      this.$emit('input', value)
      this.$emit('table-select-change', value)
    },
    searchValueChange (value) {
      this.$emit('searchValueChange', value)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-select-option:hover {
  color: $color-primary;
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
