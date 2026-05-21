<template>
  <div style="display: flex;">
    <div class="oss-border m-r-15" style="padding:15px 10px 0 10px;width: 335px;flex-shrink: 0;">
      <StickyContent
        :sticky-top="105"
        activeStickyClass="activeStickyClass"
      >
        <LicenseSelect
          :init-list-xhr="licenseList"
          :project-id="projectId"
          :task-id="taskId"
          @select="select"
        >
        </LicenseSelect>
      </StickyContent>
    </div>
    <div class="second-main oss-border" style="padding: 20px; flex: 1;">
      <empty v-if="!dicLicenseId"></empty>
      <template v-else>
        <LicenseInfo
          :project-id="projectId"
          :dic-license-id="dicLicenseId">
        </LicenseInfo>
        <LicenseUrl
          style="margin-top: 40px;"
          :project-id="projectId"
          :dic-license-id="dicLicenseId"
          :task-id="taskId"
          :init-xhr="getLicenseUrlList"
        >
        </LicenseUrl>
      </template>
    </div>
  </div>
</template>
<script>
import { licenseList, getLicenseUrlList } from '@/api/home/scan/develop/repository/firefly'
import StickyContent from '@/components/public/StickyContent/index.vue'
import LicenseSelect from '@/views/home/public/license/LicenseSelect/index.vue'
import LicenseInfo from '@/views/home/public/license/LicenseInfo/index.vue'
import LicenseUrl from '@/views/home/public/license/LicenseUrl/index.vue'

export default {
  name: 'ScanRepositorySvnDetailsLicense',
  components: {
    StickyContent,
    LicenseSelect,
    LicenseInfo,
    LicenseUrl
  },
  data () {
    return {
      taskId: this.$route.query.task,
      projectId: this.$route.query.project,
      dicLicenseId: null
    }
  },
  methods: {
    licenseList (data) {
      return licenseList(data)
    },

    // 获取路径列表
    getLicenseUrlList (data) {
      return getLicenseUrlList(data)
    },

    // 组件
    select (item) {
      this.dicLicenseId = item.dicLicenseId
    }
  }
}
</script>
