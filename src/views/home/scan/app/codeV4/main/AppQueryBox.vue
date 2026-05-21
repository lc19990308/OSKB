<template>
  <query-box style="margin-bottom: 15px;" @keydown.enter.native="filter"  @filter="filter" @reset="reset">
    <query-box-item label="检测语言：">
      <el-select placeholder="请选择应用检测的语言" @change="filter" filterable clearable multiple collapse-tags class="w-full" v-model="formData.languageCodes">
        <el-option
          v-for="item in languagesOptions"
          :key="item.key"
          :label="item.value"
          :value="item.key">
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
      <el-input placeholder="请输入应用包名称" clearable @clear="filter" class="w-full" v-model="formData.applicationName"></el-input>
    </query-box-item>
  </query-box>
</template>

<script>
import QueryBoxItem from '@/components/public/QueryBox/QueryBoxItem'
import QueryBox from '@/components/public/QueryBox'
import { awaitTo as to, isObject } from '@/utils'
import { getLanguageList } from '@/api/home/assets/app/codeV4'
export default {
  name: 'AppQueryBoxQueryBox',
  components: { QueryBox, QueryBoxItem },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    statusOptions: Array
  },
  data () {
    return {
      formData: {
        applicationName: undefined,
        status: undefined,
        languageCodes: []
      },
      languagesOptions: []
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler (value) {
        Object.keys(value).forEach(key => {
          this.$set(this.formData, key, value[key])
        })
      }
    }
  },
  computed: {
    projectUserId () {
      return this.$store.state.home.project?.userId
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
      this.formData = this.$options.data().formData
      this.filter()
    },
    async getLanguageList () {
      const [error, res] = await to(getLanguageList({ loading: false }))
      if (isObject(error) && error.message) {
        this.$message.error(error.message)
      } else {
        this.languagesOptions = this.get(res, 'data', [])
      }
    }
  },

  mounted () {
    if (this.$store.state.home.project !== null) {
      this.filter()
    }
    this.getLanguageList()
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
      border-right-color: #8B5CF6;
    }
  }
}
</style>
