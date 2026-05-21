<template>
  <query-box class="compound-search-box" :labelWidth="160" :defaultRowNum="3" style="margin-bottom: 15px;" @keydown.enter.native="filter"  @filter="filter" @reset="reset">
    <query-box-item label="所属项目：">
      <el-select-v2
        ref="selectV2"
        filterable
        v-model="formData.projectIds"
        class="w-full"
        @change="filter"
        multiple collapse-tags
        clearable
        placeholder="请选择组件所属项目"
        :options="pList"
        :extra-props="{ label: 'name', value: 'id' }"
      >
      </el-select-v2>
    </query-box-item>
    <query-box-item label="组件语言：">
      <el-select placeholder="请选择组件语言" @change="filter" clearable multiple collapse-tags class="w-full" v-model="formData.languages">
        <el-option
          v-for="item in languagesOptions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </query-box-item>
    <query-box-item label="组件依赖：">
      <el-select placeholder="请选择组件依赖" @change="filter" class="w-full" v-model="formData.dependent">
        <el-option label="全部" :value="0"></el-option>
        <el-option label="直接依赖" :value="1"></el-option>
        <el-option label="间接依赖" :value="2"></el-option>
      </el-select>
    </query-box-item>
    <query-box-item label="发布厂商：">
      <el-input placeholder="请输入组件的发布厂商" clearable class="w-full" v-model="formData.vendor"></el-input>
    </query-box-item>
    <query-box-item label="组件名称：">
      <div style="display: flex;">
        <el-select class="customize-select" style="width: 110px;" @change="[formData.versionType = 'like', formData.version = null, formData.name && filter()]" v-model="formData.nameType" placeholder="请选择">
          <el-option
            v-for="item in componentOptions"
            :key="'codeTraceability-' + item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input
          @input="setState"
          style="flex: 1;"
          class="customize-input"
          v-model="formData.name"
          clearable
          placeholder="请输入组件名称">
        </el-input>
      </div>
    </query-box-item>
    <query-box-item label="版本号：" v-if="formData.nameType === 'eq'">
      <div style="display: flex;">
        <el-select class="customize-select" style="width: 110px;" @change="[formData.version && filter()]" v-model="formData.versionType" placeholder="请选择">
          <el-option
            v-for="item in versionOptions"
            :key="'version-' + item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input style="flex: 1;" class="customize-input" @input="setState" v-model="formData.version" clearable
                  placeholder="请输入组件版本号"></el-input>
      </div>
    </query-box-item>

    <query-box-item label="应用包/应用/仓库名称：">
      <div style="display: flex;">
        <pagination-select
          v-model="formData.taskIds"
          :projectIds="formData.projectIds"
          @change="filter"
        />
      </div>
    </query-box-item>

  </query-box>
</template>

<script>
import QueryBoxItem from '@/components/public/QueryBox/QueryBoxItem'
import QueryBox from '@/components/public/QueryBox'
import { awaitTo as to, isObject } from '@/utils'
import { getLanguageList } from '@/api/home/assets/module'
import ElSelectV2 from '@/components/public/SelectV2'
import PaginationSelect from './PaginationSelect'
export default {
  name: 'ModuleQueryBox',
  components: { ElSelectV2, QueryBox, QueryBoxItem, PaginationSelect },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    isModule: {
      type: Boolean,
      default: false
    },
    languageXhr: {},
    projectList: {
      type: Array
    }
  },
  data () {
    return {
      formData: {
        languages: [],
        projectIds: [],
        taskIds: [],
        name: undefined,
        dependent: 0,
        vendor: undefined,
        nameType: 'like',
        versionType: 'like',
        version: undefined
      },
      languagesOptions: [],
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
  computed: {
    pList () {
      return this.projectList ? this.projectList : this.projectListMixin
    }
  },
  methods: {
    filter () {
      this.$emit('input', {
        ...this.value,
        ...this.formData
      })
      this.$emit('change')
    },
    setState () {
      this.$emit('input', {
        ...this.value,
        ...this.formData
      })
    },
    reset () {
      this.formData = this.$options.data().formData
      this.filter()
    }
  },
  mounted () {
    if (this.pList.length && this.isModule) {
      this.formData.projectIds = [this.pList[0].id]

      this.$refs.selectV2.instance().cachedOptions.push({
        currentLabel: this.pList[0].name, // 当前绑定的数据的label
        currentValue: this.pList[0].id, // 当前绑定数据的value
        label: this.pList[0].name, // 当前绑定的数据的label
        value: this.pList[0].id // 当前绑定数据的value
      })
    }
    this.filter()
  },
  async created () {
    const [error, res] = await to(typeof this.languageXhr === 'function' ? this.languageXhr() : getLanguageList({ loading: false }))
    if (isObject(error)) {
      this.$message.error(error.message)
    } else {
      this.languagesOptions = this.get(res, 'data', [])
    }
  }
}
</script>
