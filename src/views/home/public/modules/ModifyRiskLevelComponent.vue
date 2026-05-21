<template>
  <el-dropdown v-if="authorityFilter(3713)"  trigger="click" :placement="type === 'button' ? 'bottom-start' :
  'bottom-end'">
    <el-button
      v-if="type === 'button'"
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
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in levelOptions" :key="item.value" @click.native="onClick(item.value)">{{item
        .text}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { levelOptions } from '@/store/constant'
import { to } from '@/utils'
import { customizeComponentData } from '@/api/home/public/component'
import bus from '@/utils/bus'
export default {
  name: 'ModifyRiskLevelComponent',
  props: ['name', 'vendor', 'version', 'type', 'row'],
  data() {
    return {
      levelOptions
    }
  },
  methods: {
    async onClick(v) {
      const [error] = await to(customizeComponentData({
        name: this.name,
        vendor: this.vendor,
        version: this.version,
        securityLevelId: v
      }))
      if (error && error.message) return this.$message.error(error.message)
      this.$message.success('操作成功')
      this.$emit('change')
      if (this.row) {
        this.row.securityLevel = v
        this.row.securityLevelId = v
      }
      bus.$emit('onModifyRiskLevel', this.row)
    }
  }
}
</script>
