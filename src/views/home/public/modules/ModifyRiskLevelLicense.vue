<template>
  <el-dropdown v-if="authorityFilter(3713)" trigger="click">
    <slot>
      <el-button
        v-if="showButton"
        class="plain-button m-r-10"
        size="medium"
        plain
      >修改风险等级
      </el-button>
      <icon-button
        v-else
        tooltip-content="修改风险等级"
        class="iconxiugaifengxiandengji"
      ></icon-button>
    </slot>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in licenseLevelOptions" :key="item.value" @click.native="onClick(item.value)">
        {{item.label}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { licenseLevelOptions } from '@/store/constant'
import { to } from '@/utils'
import bus from '@/utils/bus'
import { customizeLicenseData } from '@/api/home/public'
export default {
  name: 'ModifyRiskLevelLicense',
  props: ['shortName', 'row', 'showButton'],
  data() {
    return {
      licenseLevelOptions
    }
  },
  methods: {
    async onClick(v) {
      const [error] = await to(customizeLicenseData({
        shortName: this.shortName,
        securityLevelId: v
      }))
      if (error && error.message) return this.$message.error(error.message)
      this.$message.success('操作成功')
      this.$emit('change')
      if (this.row) {
        this.row.securityLevel = v
        this.row.securityLevelId = v
      }
      bus.$emit('onModifyRiskLevelLicense', { securityLevel: v, shortName: this.shortName })
    }
  }
}
</script>
