<template>
  <el-row :gutter="22" type="flex" v-loading="loading">
    <el-col class="second-sidebar">
      <StickyContent
        :sticky-top="125"
      >
        <LicenseSelect
          :init-list-xhr="licenseList"
          @select="select"
        >
        </LicenseSelect>
      </StickyContent>
    </el-col>
    <el-col class="second-main">
      <empty v-if="!dicLicenseId"></empty>
      <template v-else>
        <LicenseInfo
          :dic-license-id="dicLicenseId">
        </LicenseInfo>
        <LicenseUrl
          @change="changeLoading"
          style="margin-top: 40px;"
          :dic-license-id="dicLicenseId"
          :init-xhr="getLicenseUrlList"
        >
        </LicenseUrl>
      </template>
    </el-col>
  </el-row>
</template>
<script>
import { licenseList, getLicenseUrlList } from '@/api/open/scan/develop/integration'
import StickyContent from '@/components/public/StickyContent'
import LicenseSelect from '@/views/open/scan/develop/integration/details/public/license/LicenseSelect'
import LicenseInfo from '@/views/open/scan/develop/integration/details/public/license/LicenseInfo'
import LicenseUrl from '@/views/open/scan/develop/integration/details/public/license/LicenseUrl'

export default {
  name: 'IntegrationDetailsLicense',
  components: {
    StickyContent,
    LicenseSelect,
    LicenseInfo,
    LicenseUrl
  },
  inject: ['app'],
  data () {
    return {
      dicLicenseId: null,
      loading: false
    }
  },
  methods: {
    licenseList (data) {
      return licenseList(data, this.app.params.token)
    },

    // 获取路径列表
    getLicenseUrlList (data) {
      return getLicenseUrlList(data, this.app.params.token)
    },

    changeLoading (v) {
      this.loading = v
    },

    // 组件
    select (item) {
      this.dicLicenseId = item.dicLicenseId
    }
  }
}
</script>
