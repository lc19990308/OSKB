<template>
<div class="view-content" v-loading="loading">
  <el-form @submit.native.prevent>
    <el-form-item label="检测超时时长：">
      <el-radio-group class="m-r-5" v-model="formState.radio" @change="formState.detectTimeoutValue = $event === 1 ?
       -1 : 1200">
        <el-radio :label="1">无限制</el-radio>
        <el-radio :label="2">自定义</el-radio>
      </el-radio-group>
      <template v-if="formState.radio === 2">
        <el-input-number v-model="formState.detectTimeoutValue" :min="0" :max="10000" size="small"></el-input-number> 秒
      </template>
    </el-form-item>
<!--    <el-form-item label="检测任务配置：">-->
<!--      <el-radio-group class="m-r-5" v-model="formState.detectTaskConfig">-->
<!--        <el-radio :label="1">检测完成后保留检测包</el-radio>-->
<!--        <el-radio :label="2">检测完成后立即删除检测包</el-radio>-->
<!--      </el-radio-group>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="登录验证方式：">-->
<!--      <el-radio-group class="m-r-5" v-model="formState.loginVerifyType">-->
<!--        <el-radio :label="1">滑块验证登录</el-radio>-->
<!--        <el-radio :label="2">按钮验证登录</el-radio>-->
<!--      </el-radio-group>-->
<!--    </el-form-item>-->
  </el-form>
  <el-button style="width: 70px;" size="medium" type="primary" @click="save" v-if="authorityFilter(3582)">保存</el-button>
  <el-button style="width: 70px;" size="medium" @click="reset" v-if="authorityFilter(3582)">还原</el-button>
</div>
</template>

<script>
import * as api from '@/api/home/system/backstage'
import { to, omit } from '@/utils'
// import bus from '@/utils/bus'
export default {
  name: 'backstage',
  data () {
    return {
      loading: false,
      formState: {
        radio: 1,

        // detectTaskConfig: 1,
        detectTimeoutValue: -1
        // loginVerifyType: 1
      }
    }
  },
  methods: {
    async save () {
      this.loading = true
      const [error] = await to(api.updateBackgroundSetting({
        ...omit(this.formState, 'radio'),
        loading: false
      }))
      this.loading = false
      if (error && error.message) return this.$message.error(error.message)
      this.init()
      // bus.$emit('initSiteInfo')
      this.$message.success('保存成功')
    },
    async reset () {
      this.loading = true
      const [error] = await to(api.updateBackgroundSetting({
        ...omit(this.$options.data().formState, 'radio'),
        loading: false
      }))
      this.loading = false
      if (error && error.message) return this.$message.error(error.message)
      this.init()
      // bus.$emit('initSiteInfo')
      this.$message.success('操作成功')
    },
    async init () {
      this.loading = true
      const [error, response] = await to(api.getBackgroundSetting({ loading: false }))
      this.loading = false
      if (error && error.message) return this.$message.error(error.message)
      this.formState = {
        radio: response.data.detectTimeoutValue > -1 ? 2 : 1,
        // detectTaskConfig: response.data.detectTaskConfig,
        detectTimeoutValue: response.data.detectTimeoutValue
        // loginVerifyType: response.data.loginVerifyType
      }
    }
  },
  created () {
    this.init()
  }
}
</script>
