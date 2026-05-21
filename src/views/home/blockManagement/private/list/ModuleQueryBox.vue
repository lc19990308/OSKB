<template>
  <query-box class="compound-search-box" style="margin-bottom: 15px;" @keydown.enter.native="filter"  @filter="filter" @reset="reset">
    <query-box-item label="阻断时间：">
      <el-date-picker
        style="width: 100%;"
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        @change="filter"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </query-box-item>
<!--    <query-box-item label="许可证：">-->
<!--      <el-select placeholder="全部" @change="filter" multiple collapse-tags clearable class="w-full" v-model="formData.securityLevels">-->
<!--        <el-option-->
<!--          v-for="item in versionOptions"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value">-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--    </query-box-item>-->
    <query-box-item label="组件名称：">
      <el-input placeholder="请输入组件名称" class="w-full" clearable @clear="filter" v-model="formData.componentName"></el-input>
    </query-box-item>
    <query-box-item label="标签名称：">
      <el-select placeholder="请输入标签名称" @change="filter" allow-create default-first-option filterable  clearable class="w-full" v-model="formData.tagValue">
        <el-option
          v-for="item in tagList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </query-box-item>
  </query-box>
</template>

<script>
import QueryBoxItem from '@/components/public/QueryBox/QueryBoxItem'
import QueryBox from '@/components/public/QueryBox'
export default {
  name: 'ModuleQueryBox',
  components: { QueryBox, QueryBoxItem },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    tagList: {
      type: Array
    }
  },
  data () {
    return {
      value1: [],
      formData: {
        componentName: undefined,
        tagValue: undefined
      },
      versionOptions: [
        {
          label: '模糊匹配',
          value: 'like'
        },
        {
          label: '精确匹配',
          value: 'eq'
        },
        {
          label: '正则匹配',
          value: 'reg'
        },
        {
          label: '大于',
          value: 'gt'
        },
        {
          label: '大于等于',
          value: 'ge'
        },
        {
          label: '小于',
          value: 'lt'
        },
        {
          label: '小于等于',
          value: 'le'
        }
      ],
      componentOptions: [
        {
          label: '模糊匹配',
          value: 'like'
        },
        {
          label: '精确匹配',
          value: 'eq'
        },
        {
          label: '正则匹配',
          value: 'reg'
        }
      ]
    }
  },
  methods: {
    filter () {
      this.$emit('input', {
        ...this.value,
        ...this.formData,
        ...((isArray(this.value1) && this.value1.length) && {
          startTime: this.value1[0],
          endTime: this.value1[1]
        })
      })
      this.$emit('change')
    },
    reset () {
      this.formData = this.$options.data().formData
      this.filter()
    }
  },
  mounted () {
    this.filter()
  }
}
</script>
