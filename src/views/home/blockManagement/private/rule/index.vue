<template>
  <div>
    <el-alert type="primary" class="header-alert">
      <div class="alert-content">
        <i class="el-icon-info" style="margin-right: 3px;"></i>
        <span style="color: #333;">记录阻断规则，可阻止未满足安全要求的CICD流程</span>
      </div>
    </el-alert>
    <div v-loading="loading">
      <Preview :rule="rule" v-if="visiblePreview" :visiblePreview.sync="visiblePreview"></Preview>
      <ViewMain ref="view" @change="init" :rule="rule" v-else :visiblePreview.sync="visiblePreview"></ViewMain>
    </div>
  </div>
</template>

<script>
import ViewMain from './ViewMain'
import Preview from './Preview'
import { getRegularsApi } from '@/api/home/blockManagement/private'
import { to } from '@/utils'
export default {
  name: 'blockManagement-private-rule',
  components: { ViewMain, Preview },
  data () {
    return {
      visiblePreview: true,
      rule: {
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
      loading: false
    }
  },
  methods: {
    async init () {
      this.loading = true
      const [error, response] = await to(getRegularsApi({ loading: false }))
      this.loading = false
      if (response) {
        this.rule = get(response, 'data', {})
      } else {
        error.message && this.$message.error(error.message)
      }
    }
  },
  async created () {
    await this.init()
  }
}
</script>

<style scoped lang="scss">
.header-alert {
  position: relative;
  margin-bottom: 20px;
  padding-left: 12px !important;
  padding-right: 12px !important;

  :deep(.el-alert__content) {
    padding: 0;
  }

  :deep(.alert-content) {
    margin-bottom: 5px;
    padding: 0;

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  :deep(.el-alert__closebtn) {
    font-size: 18px;
    color: #999;
    font-weight: bold;
    top: 14px;

    &:hover {
      color: lighten(#999, 10%);
    }
  }
}

:deep(.oss-title) {
  color: #333333;
  font-size: 16px;
  position: relative;
  padding-left: 10px;
  margin-bottom: 10px;

  &::before {
    content: '';
    position: absolute;
    height: 70%;
    left: 0;
    top: 3px;
    width: 3px;
    background: $color-primary;
  }
}
:deep(.el-form-item__content) {
  line-height: initial;
}
:deep(.el-form-item__label) {
  color: #222222;
  font-family: Microsoft YaHei UI;
  font-weight: regular;
  font-size: 15px;
  line-height: normal;
  letter-spacing: 0px;
  text-align: left;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label){
  color: inherit;
}
</style>
