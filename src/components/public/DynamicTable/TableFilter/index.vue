<template>
  <el-popover
    width="150"
    popper-class="table-header-filter-popover__warp"
    :placement="placement"
    transition="el-zoom-in-bottom"
    :visible-arrow="false"
    v-model="visible"
    trigger="click">
    <div :class="['search-box', 'm-b-5']">
      <search-area size="mini" v-model="keyword" :placeholder="placeholder" clearable></search-area>
    </div>
    <el-scrollbar v-if="visible" v-loading="loading" element-loading-text="加载中">
      <template v-if="list.length > 0">
        <el-checkbox-group class="list-container" v-model="checkList" v-if="multiple">
          <el-checkbox
            v-for="item in list"
            :key="item[defaultProps.value]"
            :label="item[defaultProps.value]"
            :disabled="item.disabled">
            {{ createStrSuffix(item[defaultProps.label], 8) }}
          </el-checkbox>
        </el-checkbox-group>
        <ul class="list-container" v-else>
          <li :class="{'active-li': item[defaultProps.value] === ((value !== '' && value !== null && value !== undefined) ? value : -10)}" @click="screen(item)" :key="item[defaultProps.value]" v-for="item in list">
            <span>{{item[defaultProps.label]}}</span>
            <i v-if="item[defaultProps.value] === ((value !== '' && value !== null && value !== undefined) ? value : -10)" class="el-icon-check"></i>
          </li>
        </ul>
      </template>
      <table-empty v-else></table-empty>
    </el-scrollbar>
    <div class="footer m-t-5" v-if="multiple">
      <el-link type="primary" :disabled="checkList.length <= 0" :underline="false" @click="confirm">筛选</el-link>
      <el-link type="primary" :underline="false" @click="reset">重置</el-link>
    </div>
    <template slot="reference">
      <span :class="['cursor-pointer', {'text-primary' : multiple ? ( isArray(value) && value.length > 0) : (value!=='' && value!==null && value!==undefined && value !== -10)}]">
        <slot>{{title}}</slot> <i class="el-icon-arrow-down text-bold"></i>
      </span>
    </template>
  </el-popover>
</template>

<script>
import TableEmpty from '@/components/public/DynamicTable/TableEmpty'
import {deepClone, isArray,createStrSuffix } from "@/utils";
import virtualList from 'vue-virtual-scroll-list'

export default {
  name: 'OssTableFilter',
  components:{TableEmpty, virtualList},
  props: {
    filters: {
      type: Array,
      default() {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value'
      })
    },
    columnKey: {
      type: String,
      default: 'bottom'
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    placeholder: {
      type: String,
      default: '搜索'
    },
    title: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    value: {},
  },
  computed: {
    list(){
      if (this.multiple){
        return this.filters.filter((item => item[this.defaultProps.label].indexOf(this.keyword) > -1)).slice(0, 200)
      }else {
        return [
          {
            [this.defaultProps.label]: '全部',
            [this.defaultProps.value]:  -10
          },
          ...this.filters.filter((item => item[this.defaultProps.label].indexOf(this.keyword) > -1))].slice(0, 200)
      }
    }
  },
  data() {
    return {
      keyword: '',
      checkList: [], // 选中的数据
      checkedAll: false, // 全选选中状态
      rawData: [], // 本组件需要操作的数据，
      visible: false,
    }
  },
  methods: {
    createStrSuffix,
    // 筛选
    screen(item) {
      this.$emit('input', item[this.defaultProps.value] === -10 ? undefined : item[this.defaultProps.value])
      this.$emit('change', item[this.defaultProps.value] === -10 ? undefined : item[this.defaultProps.value])
      this.visible = false
    },

    handleCheckedCitiesChange(value) {
      this.checkedAll = value.length === this.list.length;
    },

    // 确认
    confirm() {
      this.$emit('input', this.checkList)
      this.$emit('change', this.checkList)
      this.visible = false
    },

    // 重置
    reset() {
      this.visible = false
      this.keyword = ''
      this.checkList = []
      this.$emit('input', this.multiple ? this.checkList : null)
      this.$emit('change', this.multiple ? this.checkList : null)
    }
  },
  watch:{
    value: {
      immediate: true,
      handler(v) {
        if (this.multiple){
          this.checkList = isArray(v) ? deepClone(v) : []
        }
      }
    },
    visible(v) {
      this.keyword = ''
      if (this.multiple && v){
        this.checkList = isArray(this.value) ? deepClone(this.value) : []
      }
    }
  }
}
</script>
<style lang="scss">
.table-header-filter-popover__warp{
  min-width: 120px !important;
  padding:10px 0 0 0 !important;
}
</style>
<style scoped lang="scss">
:deep(.el-scrollbar__bar.is-vertical) {
  width: 3px;
  top: 2px;
}

.search-box {
  padding: 0 10px;
  :deep(.el-input-group__append){
    padding: 0 10px;
  }
}

:deep(.el-scrollbar__wrap){
  overflow-x: hidden;
  max-height: 200px;
  .list-container {
    padding: 0 10px 15px 10px;
    margin: 0;
    list-style: none;
    li{
      padding: 5px 7px 4px 7px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-size: 13px;
      margin-bottom: 4px;
      transition: all 0.2s;
      border-radius: 2px;
      i{
        font-weight: bold;
        font-size: 14px;
        padding-left: 10px;
      }
      &:hover,&:active{
        color: #8B5CF6;
        background-color: #eff3f6;
      }
    }
    .active-li{
      color: #8B5CF6;
      background-color: #eff3f6;
    }
  }
  .el-checkbox{
    display: block;
    padding: 5px 10px 4px 6px;
    margin-right: 0;
    font-weight: initial;
    border-radius: 2px;
    margin-bottom: 3px;

    .el-checkbox__label{
      font-size: 13px;
    }

    &:hover,&:active{
      color: #8B5CF6;
      background-color: #eff3f6;
    }
  }
  .el-checkbox:last-child{
    margin-bottom: 0 !important;
  }

  .el-checkbox.is-checked{
    color: #8B5CF6;
    background-color: #eff3f6;
  }
}

:deep(.is-horizontal) {
  display: none;
}

.footer {
  border-top: 1px solid #f3f4f4;
  padding: 7px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
</style>
