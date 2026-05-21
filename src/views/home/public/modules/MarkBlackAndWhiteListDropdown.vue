<template>
  <el-dropdown
    trigger="click"
    v-bind="dropdownOptions"
    v-if="authorityFilter(3711)"
  >
    <slot>
      <el-button
        v-if="showButton"
        class="plain-button m-r-10"
        size="medium"
        plain
      >
        <span class="iconfont iconbiaoji2 m-r-5" style="font-size: 14px;"></span>标记为<i class="el-icon-arrow-down"></i>
      </el-button>
      <icon-button v-else style="margin-right: 0 !important;"  tooltip-content="标记为" class="iconbiaoji2"></icon-button>
    </slot>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in markStatusOptions"
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
import { markLicenseBlackWhiteList, changeStatusBatch, markVulBlackWhitelist } from '@/api/home/public'
import { markStatusOptions } from '@/store/constant'
import bus from '@/utils/bus'

export default {
  name: 'MarkBlackAndWhiteListDropdown',
  props: ['showButton', 'dicComponentIds', 'projectIdList', 'type', 'dropdownOptions'],
  data () {
    return {
      markStatusOptions: [
        {
          value: 3,
          label: '黑名单'
        },
        {
          value: 4,
          label: '白名单'
        }
      ]
    }
  },
  methods: {
    dispense (val) {
      switch (this.type) {
        case 'component':
          this.markComponent(val)
          break
        case 'license':
          this.markLicense(val)
          break
        case 'vul':
          this.markVul(val)
          break
      }
    },
    async markComponent (status) {
      const [error] = await to(changeStatusBatch({
        dicComponentIds: this.dicComponentIds,
        projectIdList: this.projectIdList,
        status
      }))
      if (error && error.message) return this.$message.error(error.message)
      this.$message({
        type: 'success',
        message: '操作成功！'
      })

      this.$emit('change', 0)
      bus.$emit('onMarkStatus', { status, id: this.dicComponentIds[0] })
    },
    async markLicense (status) {
      const [error] = await to(markLicenseBlackWhiteList({
        ids: this.dicComponentIds,
        projectIdList: this.projectIdList,
        status
      }))
      if (error && error.message) return this.$message.error(error.message)
      this.$message({
        type: 'success',
        message: '操作成功！'
      })

      this.$emit('change', 0)
      bus.$emit('onMarkStatus', { status, id: this.dicComponentIds[0] })
    },
    async markVul (status) {
      const [error] = await to(markVulBlackWhitelist({
        ids: this.dicComponentIds,
        projectIdList: this.projectIdList,
        status
      }))
      if (error && error.message) return this.$message.error(error.message)
      this.$message({
        type: 'success',
        message: '操作成功！'
      })

      this.$emit('change', 0)
    }
  },
  created () {
    if (this.type === 'component') return
    this.markStatusOptions = markStatusOptions.filter(item => item.value !==0)
  }
}
</script>
