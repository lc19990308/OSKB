<template>
  <el-dropdown
    trigger="click"
    v-bind="dropdownOptions"
    v-if="authorityFilter(3712)"
  >
    <slot>
      <el-button
        v-if="showButton"
        class="plain-button m-r-10"
        size="medium"
        plain
      >
        <span class="iconfont iconshencha m-r-5" style="font-size: 14px;"></span>审计为<i class="el-icon-arrow-down"></i>
      </el-button>
      <icon-button v-else style="margin-right: 0 !important;" tooltip-content="审计为" class="iconshencha"></icon-button>
    </slot>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in auditStatusOptions"
        :key="item.value"
        @click.native="dispense(item.value)"
      >
        {{item.label}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { awaitTo as to } from '@/utils'
import { auditStatusOptions } from '@/store/constant'
import { changeAuditStatusBatch, changeLicenseAuditStatusBatch } from '@/api/home/public'
import bus from '@/utils/bus'

export default {
  name: 'AuditDropdown',
  props: ['showButton', 'dicRiskId', 'projectIdList', 'type', 'dropdownOptions'],
  data () {
    return {
      auditStatusOptions
    }
  },
  methods: {
    dispense (val) {
      switch (this.type) {
        case 'component':
          this.auditComponent(val)
          break
        case 'license':
          this.auditLicense(val)
          break
      }
    },
    async auditComponent (status) {
      const [error] = await to(changeAuditStatusBatch({
        dicRiskId: this.dicRiskId,
        projectIdList: this.projectIdList,
        status
      }))
      if (error && error.message) return this.$message.error(error.message)
      this.$message({
        type: 'success',
        message: '操作成功！'
      })

      this.$emit('change', 0)
    },
    async auditLicense (status) {
      const [error] = await to(changeLicenseAuditStatusBatch({
        dicRiskId: this.dicRiskId,
        projectIdList: this.projectIdList,
        status
      }))
      if (error && error.message) return this.$message.error(error.message)
      this.$message({
        type: 'success',
        message: '操作成功！'
      })

      this.$emit('change', 0)
      bus.$emit('onAuditStatus')
    }
  }
}
</script>
