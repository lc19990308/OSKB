<template>
  <query-box style="margin-bottom: 15px;" @keydown.enter.native="filter"  @filter="filter" @reset="reset">
    <query-box-item label="风险等级：">
      <el-select placeholder="全部" @change="filter" multiple collapse-tags clearable class="w-full" v-model="formData.securityLevels">
        <el-option
          v-for="item in levelOptions"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
    </query-box-item>
    <query-box-item label="状态：">
      <el-select placeholder="全部" @change="filter" clearable class="w-full" v-model="formData.status">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
    </query-box-item>
    <query-box-item label="应用名称：" :label-width="85">
      <el-input placeholder="请输入应用名称" clearable @clear="filter" class="w-full" v-model="formData.name"></el-input>
    </query-box-item>
  </query-box>
</template>

<script>
import QueryBoxItem from '@/components/public/QueryBox/QueryBoxItem'
import QueryBox from '@/components/public/QueryBox'
import { deepClone } from '@/utils'
import { levelOptions } from '@/store/constant'
export default {
  name: 'AppQueryBoxQueryBox',
  components: { QueryBox, QueryBoxItem },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      levelOptions,
      firstLoad: true,
      initValue: {},
      formData: {
        status: undefined,
        name: undefined,
        securityLevels: []
      },
      statusOptions: [
        {
          value: -2,
          text: '检测超时',
          className: 'text-danger',
          type: 'danger',
          progress: 0
        },
        {
          value: -1,
          text: '未检测',
          className: 'text-regular',
          type: 'info',
          progress: 10
        },
        {
          value: 0,
          text: '排队中',
          className: 'text-secondary',
          type: 'warning',
          progress: 30
        },
        {
          value: 1,
          text: '检测中',
          className: 'text-primary',
          type: 'primary',
          progress: 80
        },
        {
          value: 2,
          text: '检测完成',
          className: 'text-success',
          type: 'success',
          progress: 100
        },
        {
          value: 3,
          text: '出错结束',
          className: 'text-danger',
          type: 'danger',
          progress: 100
        }
      ]
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler (value) {
        if (this.firstLoad) {
          this.initValue = deepClone(value)
          this.firstLoad = false
        }
        Object.keys(value).forEach(key => {
          this.$set(this.formData, key, value[key])
        })
      }
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
    reset () {
      this.formData = { ...this.$options.data().formData, ...this.initValue }
      this.filter()
    }
  },
  mounted () {
    this.filter()
  },
  computed: {
    projectUserId () {
      return this.$store.state.home.project?.userId
    }
  }
}
</script>
<style lang="scss" scoped>
.customize-input {
  :deep(.el-input__inner) {
    border-radius: 0 3px 3px 0;
  }
}

.customize-select {
  width: 110px;

  :deep(.el-input__inner) {
    border-right-color: transparent;
    border-radius: 3px 0 0 3px;

    &:hover,
    &:focus,
    &:active {
      border-right-color: #2C5F8A;
    }
  }
}
</style>
