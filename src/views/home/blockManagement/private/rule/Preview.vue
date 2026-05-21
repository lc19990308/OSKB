<template>
  <div style="overflow: hidden;">
    <div class="oss-title flex between">
      设置阻断规则<el-button plain size="medium" class="plain-button" style="height: 32px;" v-if="authorityFilter(3542)" @click="$emit('update:visiblePreview', false)">编辑</el-button>
    </div>
    <div :class="['p-l-10', {gray: rule.status !== 1}]" style="margin-bottom: 20px;">
      <div class="text-regular m-b-15">
        阻止任一满足以下风险条件的组件，当检测结果中含有白名单组件和漏洞时，优先级高于下面的阻断条件，不进行阻断
      </div>
      <el-form label-width="150px" label-position="left">
        <el-form-item label="设置阻断规则">
          <oss-dot type="success" v-if="rule.status === 1">
            <span class="text-success" >启用</span>
          </oss-dot>
          <oss-dot type="danger" plain v-else>
            <span class="text-danger">关闭</span>
          </oss-dot>
        </el-form-item>
        <el-form-item label="组件黑名单规则：" v-if="rule.componentBlacklist">
           当检测结果中含有黑名单组件时，进行阻断
        </el-form-item>
        <el-form-item label="漏洞黑名单规则：" v-if="rule.vulnerabilityBlacklist">
          当检测结果中含有黑名单漏洞时，进行阻断
        </el-form-item>
        <el-form-item label="组件版本基线规则：" v-if="rule.componentBaseline">
          当检测结果中含不在版本基线范围内的组件时，进行阻断
        </el-form-item>
        <el-form-item label="开源许可证等级：" v-if="rule.licenseHigh || rule.licenseMedium || rule.licenseLow">
          <level-tag v-if="rule.licenseHigh" license :level="1" class="m-r-15"></level-tag>
          <level-tag v-if="rule.licenseMedium" license :level="2" class="m-r-15"></level-tag>
          <level-tag v-if="rule.licenseLow" license :level="3" class="m-r-15"></level-tag>
        </el-form-item>
        <el-form-item label="漏洞等级：" v-if="rule.vulnerabilitySerious || rule.vulnerabilityHigh || rule.vulnerabilityMedium || rule.vulnerabilityLow">
          <level-tag v-if="rule.vulnerabilitySerious" :level="1" class="m-r-15"></level-tag>
          <level-tag v-if="rule.vulnerabilityHigh" :level="2" class="m-r-15"></level-tag>
          <level-tag v-if="rule.vulnerabilityMedium" :level="3" class="m-r-15"></level-tag>
          <level-tag v-if="rule.vulnerabilityLow" :level="4" class="m-r-15"></level-tag>
        </el-form-item>
        <el-form-item label="许可证：" v-if="get(rule, 'licenses', []).length">
          <el-tag class="m-r-10 m-b-5" size="mini" v-for="item in get(rule, 'licenses', [])" :key="item"> {{item}}</el-tag>
        </el-form-item>
        <el-form-item label="CVE编号：" v-if="get(rule,'cves')" style="margin-bottom: 0;">
          {{get(rule,'cves', '-')}}
        </el-form-item>
       </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Preview',
  props: ['visiblePreview', 'rule'],
  created () {
    const el = document.querySelector('.view-content')
    if (el) {
      el.style.paddingBottom = 0
    }
  },
  destroyed () {
    const el = document.querySelector('.view-content')
    if (el) {
      el.style.paddingBottom = '20px'
    }
  }
}
</script>

<style scoped lang="scss">
.gray {
  background: #F5F5F5;
  padding: 20px;
}
</style>
