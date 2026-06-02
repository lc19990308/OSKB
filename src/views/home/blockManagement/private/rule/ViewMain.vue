<template>
  <div>
    <div class="oss-title">
      设置阻断规则
    </div>
    <div class="p-l-10">
      <div class="text-regular m-b-15">
        阻止任一满足以下风险条件的组件，当检测结果中含有白名单组件和漏洞时，优先级高于下面的阻断条件，不进行阻断
      </div>
      <el-form label-width="150px" label-position="left">
        <el-form-item label="设置阻断规则">
          <el-tag size="medium" class="cursor-pointer" :effect="formData.status === 1 ? 'dark' : 'plain'" style="border-right: 0;border-top-right-radius: initial;border-bottom-right-radius: initial;" @click="formData.status = 1">启用</el-tag>
          <el-tag size="medium" class="cursor-pointer" :effect="formData.status === 0 ? 'dark' : 'plain'" style="border-left: 0;border-top-left-radius: initial;border-bottom-left-radius: initial;" @click="formData.status = 0">关闭</el-tag>
        </el-form-item>
        <el-form-item label="组件黑名单规则：">
          <span class="m-r-10">当检测结果中含有黑名单组件时，进行阻断</span><el-switch v-model="formData.componentBlacklist"></el-switch>
        </el-form-item>
        <el-form-item label="漏洞黑名单规则：">
          <span class="m-r-10">当检测结果中含有黑名单漏洞时，进行阻断</span><el-switch v-model="formData.vulnerabilityBlacklist"></el-switch>
        </el-form-item>
        <el-form-item label="组件版本基线规则：">
          <span class="m-r-10">当检测结果中含不在版本基线范围内的组件时，进行阻断</span><el-switch v-model="formData.componentBaseline"></el-switch>
        </el-form-item>
        <el-form-item label="开源许可证等级：">
          <el-checkbox v-for="item in licenceOptions" v-model="formData[item.key]" :class="item.color" :key="item.value">
            {{ item.label }}
          </el-checkbox>
        </el-form-item>
        <el-form-item label="漏洞等级：">
          <el-checkbox v-for="item in vulOptions" v-model="formData[item.key]" :class="item.color" :key="item.value">
            {{ item.label }}
          </el-checkbox>
        </el-form-item>
        <el-form-item label="许可证：">
          <el-select size="medium" placeholder="请选择许可证" allow-create default-first-option filterable clearable multiple v-model="formData.licenses" class="block"
                     style="max-width: 720px;">
            <el-option v-for="item in licences" :label="item" :value="item" :key="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="CVE漏洞：">
          <el-input class="block m-b-10" :rows="3" resize="none" style="max-width: 720px;" show-word-limit
                    v-model="formData.cves" type="textarea"
                    placeholder="请输入漏洞的CVE编号，多个以英文逗号隔开，例如：CVE-2019-8457,CVE-2019-3856"></el-input>
<!--          <span style="color: #8B9CB0;font-size: 12px;">优先级高于漏洞白名单</span>-->
        </el-form-item>
      </el-form>
    </div>
    <div class="text-center">
      <el-button type="primary" style="min-width: 70px;font-weight: normal" size="medium" @click="submit" v-if="authorityFilter(3542)">保存</el-button>
      <el-button style="min-width: 70px; font-weight: normal" plain size="medium" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { to } from '@/utils'
import { getLicensesApi, postRegularsApi } from '@/api/home/blockManagement/private'

export default {
  name: 'ViewMain',
  props: ['visiblePreview', 'rule'],
  data () {
    return {
      formData: {
        status: 0,
        cves: '',
        licenses: [],
        vulnerabilityHigh: false,
        vulnerabilityLow: false,
        vulnerabilityMedium: false,
        vulnerabilitySerious: true,
        licenseHigh: true,
        licenseLow: false,
        licenseMedium: false,
        componentBaseline: false,
        componentBlacklist: false,
        vulnerabilityBlacklist: false
      },
      licenceOptions: [
        {
          label: '高风险',
          value: 1,
          color: 'text-danger',
          key: 'licenseHigh'
        },
        {
          label: '中风险',
          value: 2,
          color: 'text-warning',
          key: 'licenseMedium'
        },
        {
          label: '低风险',
          value: 3,
          color: 'text-primary',
          key: 'licenseLow'
        }
      ],
      vulOptions: [
        {
          label: '严重',
          value: 1,
          color: 'text-severity',
          key: 'vulnerabilitySerious'
        },
        {
          label: '高危',
          value: 2,
          color: 'text-danger',
          key: 'vulnerabilityHigh'
        },
        {
          label: '中危',
          value: 3,
          color: 'text-warning',
          key: 'vulnerabilityMedium'
        },
        {
          label: '低危',
          value: 4,
          color: 'text-primary',
          key: 'vulnerabilityLow'
        }
      ],
      licences: []
    }
  },
  watch: {
    rule: {
      handler (v) {
        Object.keys(this.formData).forEach(key => {
          this.formData[key] = v[key]
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async submit () {
      const [error, result] = await to(postRegularsApi({ ...this.formData, handlers: [1] }))
      if (result) {
        this.$emit('change')
        this.$message.success('保存成功')
        this.$emit('update:visiblePreview', true)
      } else if (error && error.message) {
        this.$message.error(error.message)
      }
    },
    cancel () {
      this.$emit('update:visiblePreview', true)
    },
    getLicenses () {
      getLicensesApi({ loading: false }).then(res => {
        this.licences = this.get(res, 'data', [])
      })
    }
  },
  mounted () {
    this.getLicenses()
  }

}
</script>
