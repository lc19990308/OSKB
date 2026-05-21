<script>

import { licenseDetail } from '@/api/home/search'
import { to } from '@/utils'

export default {
  name: 'index',
  data () {
    return {
      licenseInfo: {},
      loading: false
    }
  },
  methods: {
    async getLicenseDetail () {
      this.loading = true
      const [error, response] = await to(licenseDetail(this.$route.query.id))
      this.loading = false
      if (error && error.message) return this.$message.error(error)
      this.licenseInfo = response.data || {}
    }
  },
  created () {
    this.getLicenseDetail()
  }
}
</script>

<template>
  <div class="view-content" v-loading="loading">
    <div class="first-title" style="display: flex;justify-content: space-between;">
      <div style="display: flex;align-items: center;float: left;">
        <span class="level-tag danger" style="padding: 7px 9px;" v-if="licenseInfo.securityLevel === 1">高风险</span>
        <span class="level-tag warning" style="padding: 7px 9px;" v-else-if="licenseInfo.securityLevel === 2">中风险</span>
        <span
          class="level-tag info"
          style="padding: 7px 9px;margin-bottom: 0;"
          v-else-if="licenseInfo.securityLevel=== 3"
        >低风险
        </span>
        <span class="name m-r-15">{{ licenseInfo.shortName  || '-' }}</span>
        <el-tag class="cm-tag m-r-15" size="small" v-if="licenseInfo.isOsi === 1">
          <div style="display: inline-flex;align-items: center;">
            <img class="m-r-5" src="@/assets/images/license/osi-icon.svg" alt="">
            OSI认证
          </div>
        </el-tag>
        <el-tag class="cm-tag m-r-15" size="small" v-if="licenseInfo.isFsf === 1">
          <div style="display: inline-flex;align-items: center;">
            <img class="m-r-5" src="@/assets/images/license/fsf-icon.svg" alt="">
            FSF许可
          </div>
        </el-tag>
        <el-tag class="cm-tag m-r-15" size="small" v-if="licenseInfo.isSpdx === 1">
          <div style="display: inline-flex;align-items: center;">
            <img class="m-r-5" src="@/assets/images/license/spdx-icon.svg" alt="">
            SPDX认证
          </div>
        </el-tag>
        <AuditTag :status="licenseInfo.auditStatus"></AuditTag>
        <MarkTag :status="licenseInfo.markStatus"></MarkTag>
      </div>
    </div>
    <info-wrap>
      <info-row>
        <info-item :label-width="120" label="许可证全名：" :span="12">
          {{licenseInfo.longName || licenseInfo.shortName || '-' }}
        </info-item>
        <info-item :label-width="120" label="GPL兼容：" :span="12">{{ licenseInfo.gplCompatible === 0 ? '不兼容': '兼容' }}</info-item>
      </info-row>

      <info-row>
        <info-item :label-width="120" label="许可证链接：" :span="24">
          <template v-if="licenseInfo.url === '未知'">未知</template>
          <el-link v-else-if="licenseInfo.url " type="primary" :href="licenseInfo.url" target="_blank">
            {{licenseInfo.url }}
          </el-link>
          <template v-else>-</template>
        </info-item>
      </info-row>

      <info-row >
        <info-item :label-width="120" :no-ellipsis="false" label="GPL兼容性说明：" :span="24">
          {{licenseInfo.gplCompatibleDesc || '-'}}
        </info-item>
      </info-row>

      <info-row >
        <info-item :label-width="120" :no-ellipsis="false" label="风险说明：" :span="24">
          {{licenseInfo.securityDesc || '-'}}
        </info-item>
      </info-row>

      <info-row >
        <info-item :label-width="120" :no-ellipsis="false" label="摘要：" :span="24">
          <template v-if="licenseInfo.content">
            <div style="white-space: pre-wrap;word-break: break-all;">
              {{licenseInfo.content || '-'}}
            </div>
          </template>
          <template v-else>-</template>
        </info-item>
      </info-row>
    </info-wrap>
  </div>
</template>
