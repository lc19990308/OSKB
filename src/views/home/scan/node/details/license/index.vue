<template>
  <div style="display: flex;">
    <div class="oss-border m-r-15" style="padding:15px 10px 0 10px;width: 335px;flex-shrink: 0;">
      <StickyContent
        :sticky-top="140"
      >
        <LicenseSelect
          ref="licenseSelect"
          :init-list-xhr="licenseList"
          :project-id="projectId"
          :task-id="taskId"
          @select="select"
          :auto="false"
        >
        </LicenseSelect>
      </StickyContent>
    </div>
    <div class="second-main oss-border" style="padding: 20px; flex: 1;">
      <empty v-if="!dicLicenseId"></empty>
      <template v-else>
        <LicenseInfo
          :project-id="projectId"
          :task-i-d="taskId"
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
import { licenseList, getLicenseUrlList } from '@/api/home/scan/node'
import StickyContent from '@/components/public/StickyContent/index.vue'
import LicenseSelect from '@/views/home/public/license/LicenseSelect/index.vue'
import LicenseInfo from '@/views/home/public/license/LicenseInfo/index.vue'
import LicenseUrl from '@/views/home/public/license/LicenseUrl/index.vue'

export default {
  name: 'NodeDetailsLicense',
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
  computed: {
    appId () {
      return this.$parent.appId
    }
  },
  watch: {
    appId () {
      this.$refs.licenseSelect.search()
    }
  },
  methods: {
    licenseList (data) {
      const appId = this.appId
      return licenseList({
        appId: appId,
        ...data
      })
    },

    // 获取路径列表
    getLicenseUrlList (data) {
      const appId = this.appId
      return getLicenseUrlList({
        appId: appId,
        ...data
      })
    },

    // 组件
    select (item) {
      this.dicLicenseId = item.dicLicenseId
      this.taskId = item.taskId
    }
  },
  mounted () {
    if (this.appId) {
      this.$refs.licenseSelect.search()
    }
  }
}
</script>
