<template>
  <!-- 搜索框 -->
  <span>
    <el-input v-bind="$attrs" :size="size" @keydown.enter.native="search" clearable @clear="$emit('search')" :value="value" @input="setValue" :placeholder="placeholder" :class="{ 'right-float' : rightFloat }">
      <el-button slot="append" size="medium" type="primary" icon="el-icon-search" @click.native="search"></el-button>
    </el-input>
    <slot></slot>
  </span>
</template>

<script>
/**
 * 此组件为搜索框
 * 调用方式：<search-area @search="search" v-model="searchText"></search-area>
 * placeholder默认为'请输入搜索信息' 可手动添加
 * 默认宽度自适应 右浮动加固定宽度需要加 rightFloat
 * 编号选择器可以在搜索框标签内部添加 <search-select v-model="searchSelect" :select-options="searchSelectOptions"></search-select>
 * 时间选择器可以在搜索框标签内部添加 <search-date v-model="searchDate" @search="search"></search-date>
 * */
import { debounce } from '@/utils/index'
export default {
  name: 'SearchArea',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    placeholder: {
      type: String,
      default () {
        return '请输入搜索信息'
      }
    },
    size: {
      type: String,
      default: 'medium'
    },
    rightFloat: {
      type: Boolean,
      default: false
    },
    select: {
      default () {
        return []
      }
    },
    value: {
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      searchSelect: null
    }
  },
  methods: {
    setValue (value) {
      this.$emit('change', value)
      // this.search_500()
    },
    search_500: debounce(function () {
      this.$emit('search')
    },500),
    search:debounce(function () {
      this.$emit('search')
    },300)
  }
}
</script>

<style lang="scss" scoped>
.right-float {
  float: right;
  width: 315px;
}

:deep(.el-input-group) {
  .el-input-group__prepend {
    background: #f0f0f0;
    border-color: #f0f0f0;

    .el-select__caret {
      color: #7C3AED !important;
    }

    input {
      color: #7C3AED !important;
      text-align: center;
    }
  }

  .el-input-group__append {
    background: #7C3AED;
    border-color: #7C3AED;

    &:focus,
    &:hover {
      background: #4ba0ea;
      border-color: #4ba0ea;
      color: #fff;
    }

    &:active {
      background: #1b7ace;
      border-color: #1b7ace;
      color: #fff;
    }
  }

  .el-button--primary {
    box-shadow: none;
  }
}

</style>
