<template>
  <div class="view-content" v-loading="loading">
    <el-row>
      <h3 style="margin-top: 0;">应用检测包清理</h3>
    </el-row>
    <el-row class="m-b-20">
      <el-button v-if="authorityFilter(3595)" :loading="cleaningLoading" size="medium" plain class="plain-button"
                 @click="oneClickCleaning">清理所有检测包
      </el-button>
    </el-row>
    <el-form @submit.native.prevent ref="form" :disabled="!authorityFilter(3593)" :model="formState" size="small"
             label-position="left"
             label-width="140px">
        <el-form-item label="清理模块：">
          <div style="display: flex;">
            <div style="width: 75px;">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </div>
            <div style="flex: 1; width: 0;min-width: 0;">
              <el-checkbox-group v-model="formState.moduleCodes" @change="handleCheckedCitiesChange">
                <el-checkbox
                  v-for="item in modules"
                  :label="item.code"
                  :key="item.code">
                  {{item.description }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
        <el-form-item label-width="240px" label="是否开启每次检测成功后立即清理：">
          <el-switch v-model="formState.deleteAfterCheck"></el-switch>
        </el-form-item>
        <el-form-item label="是否开启自动清理：">
          <el-switch @change="$refs.form.clearValidate()" v-model="formState.autoClean"></el-switch>
        </el-form-item>
        <el-form-item
          label="执行策略："
          prop="strategy"
          :rules="{ required: true, message: '请选择', trigger: 'change' }"
        >
          <el-radio-group :disabled="!formState.autoClean" v-model="strategy" @change="() => {
            formState.time = undefined
            $nextTick(() => $refs.form.clearValidate())
          }">
            <el-radio :label="1">单次执行</el-radio>
            <el-radio :label="2">周期执行</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="执行时间：" :rules="{ required: true}">
          <template v-if="strategy === 1">
            <el-form-item
              style="margin-right: 0;"
              prop="time"
              label=""
              :rules="{ required: true, message: '请选择时间', trigger: 'change' }"
            >
              <el-date-picker
                :disabled="!formState.autoClean"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="formState.time"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </template>
          <template v-if="strategy === 2">
            <div style="display: flex;">
              <div>
                <el-form-item
                  style="margin-right: 0;" prop="strategy"
                  label=""
                  :rules="{ required: true, message: '请选择', trigger: 'change' }"
                >
                  <el-select
                    class="w-100 m-r-10"
                    :disabled="!formState.autoClean"
                    v-model="formState.strategy"
                    @change="formState.week = 1"
                    placeholder="请选择">
                    <el-option :label="'每天'" :value="1"></el-option>
                    <el-option :label="'每周'" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-if="formState.strategy === 2">
                <el-form-item
                  style="margin-right: 0;"
                  prop="week"
                  label=""
                  :rules="{ required: true, message: '请选择', trigger: 'change' }"
                >
                  <el-select
                    class="w-100 m-r-10"
                    v-model="formState.week"
                    :disabled="!formState.autoClean"
                    placeholder="请选择">
                    <el-option
                      v-for="(value, index) in weekOptions"
                      :key="index"
                      :label="value.label"
                      :value="value.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  prop="time"
                  label=""
                  :rules="{ required: true, message: '请选择', trigger: 'change' }"
                >
                  <el-time-picker
                    style="width: 130px;"
                    :disabled="!formState.autoClean"
                    v-model="formState.time"
                    :value-format="'HH:mm'"
                    :format="'HH:mm'"
                    placeholder="任意时间点">
                  </el-time-picker>
                </el-form-item>
              </div>
            </div>
          </template>
        </el-form-item>
      <el-form-item label="数据保留：" :rules="{ required: true, message: '请选择', trigger: 'change' }">
        最近<el-input-number
                style="margin: 0 5px;"
                :disabled="!formState.autoClean"
                v-model="formState.expire"
                :min="7"
                :max="10000"
                @change="numberChange"
                size="small" /> 天
      </el-form-item>
    </el-form>
    <el-button v-if="authorityFilter(3593)" style="width: 70px;" size="medium" type="primary" @click="save">保存
    </el-button>
    <el-button style="width: 70px;" size="medium" @click="resetConfig">还原</el-button>
  </div>
</template>

<script>
import * as API from '@/api/home/system/cleanup'
import { to } from '@/utils'
export default {
  name: 'cleanup',
  data () {
    return {
      loading: false,
      cleaningLoading: false,
      isIndeterminate: false,
      checkAll: false,
      modules: [],
      formState: {
        deleteAfterCheck: false,
        autoClean: true,
        expire: 0,
        moduleCodes: [],
        strategy: 1,
        time: undefined,
        week: 1
      },
      weekOptions: [
        {
          label: '周一',
          value: 1
        },
        {
          label: '周二',
          value: 2
        },
        {
          label: '周三',
          value: 3
        },
        {
          label: '周四',
          value: 4
        },
        {
          label: '周五',
          value: 5
        },
        {
          label: '周六',
          value: 6
        },
        {
          label: '周日',
          value: 7
        }
      ]
    }
  },
  computed: {
    strategy: {
      get () {
        return [1, 2].includes(this.formState.strategy) ? 2 : 1
      },
      set (v) {
        this.formState.strategy = v === 1 ? 0 : 1
      }
    }
  },
  methods: {
    async oneClickCleaning () {
      this.$popup({
        width: '550px',
        underline: true,
        render (h) {
          return h('div', { style: { padding: '0 25px' } }, '确定要一键清理系统中所有检测包吗？清理后部分应用将无法重审！')
        },
        beforeClose: async (a, c) => {
          if (a === 'confirm') {
            const [error] = await to(API.clean())
            if (error && error.message) return this.$message.error(error)
            this.$message.success('清理成功')
          }
          c()
        }
      })
    },
    async save () {
      this.formState.autoClean && await this.$refs.form.validate()
      this.loading = true
      const [error] = await to(API.putCleanConfig(this.formState))
      this.loading = false
      if (error && error.message) return this.$message.error(error)
      this.$message.success('操作成功')
      this.getCleanConfig()
    },
    handleCheckAllChange (v) {
      this.formState.moduleCodes = v ? this.modules.map(item => item.code) : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.modules.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.modules.length
    },
    async getModuleOptions () {
      const [error, response] = await to(API.getCleanModules())
      if (error && error.message) return this.$message.error(error)
      this.modules = response.data || []
    },
    async resetConfig () {
      const [error] = await to(API.resetCleanConfig())
      if (error && error.message) return this.$message.error(error)
      await this.getCleanConfig()
    },
    async getCleanConfig () {
      if (!this.authorityFilter(3594)) return
      this.loading = true
      const [error, response] = await to(API.getCleanConfig())
      this.loading = false
      if (error && error.message) return this.$message.error(error)
      this.formState.moduleCodes = response.data.moduleCodes
      this.formState.week = response.data.week
      this.formState.autoClean = response.data.autoClean
      this.formState.expire = response.data.expire
      this.formState.strategy = response.data.strategy
      this.formState.time = response.data.time
      this.formState.deleteAfterCheck = response.data.deleteAfterCheck
      this.handleCheckedCitiesChange(response.data.moduleCodes)

      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    numberChange (numValue) {
      if (typeof numValue === 'undefined') {
        this.$nextTick(() => {
          this.formState.expire = 7
        })
      }
    }
  },
  mounted () {
    this.getModuleOptions()
    this.getCleanConfig()
  }
}
</script>
