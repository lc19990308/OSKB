<template>
  <el-row :gutter="22" type="flex">
    <el-col class="second-sidebar">
      <StickyContent
        :sticky-top="125"
        activeStickyClass="activeStickyClass"
      >
        <ComponentSelect
          :init-list-xhr="componentList"
          :dic-component-id="dicComponentId"
          @select="select"
        ></ComponentSelect>
      </StickyContent>
    </el-col>
    <el-col class="second-main">
      <empty v-if="!dicComponentId"></empty>
      <template v-else>
        <ComponentInfo :asset-component-id="assetComponentId"></ComponentInfo>
        <ComponentVul :dic-component-id="dicComponentId"></ComponentVul>
        <license-list :dic-component-id="dicComponentId"></license-list>
<!--        <affected :dic-component-id="dicComponentId"></affected>-->
      </template>
    </el-col>
  </el-row>
</template>
<script>
// import Affected from '@/views/home/scan/develop/integration/jenkins/details/public/codeTraceability/affected/ModifyRiskLevelComponent.vue'
import LicenseList from '@/views/open/scan/develop/integration/details/public/component/license'
import StickyContent from '@/components/public/StickyContent'
import ComponentSelect from '@/views/open/scan/develop/integration/details/public/component/ComponentSelect'
import ComponentInfo from '@/views/open/scan/develop/integration/details/public/component/ComponentInfo'
import ComponentVul from '@/views/open/scan/develop/integration/details/public/component/ComponentVul'

import { componentList } from '@/api/open/scan/develop/integration'

export default {
  name: 'ScanDevelopIntegrationDetailsComponent',
  components: {
    ComponentVul,
    ComponentSelect,
    ComponentInfo,
    StickyContent,
    // Affected,
    LicenseList
  },
  data () {
    return {
      assetComponentId: null,
      dicComponentId: null
    }
  },
  inject: ['app'],
  methods: {
    componentList (data) {
      return componentList(data, this.app.params.token)
    },

    // 组件选中
    select (item) {
      this.dicComponentId = item.dicComponentId
      this.assetComponentId = item.assetComponentId
    }
  }
}
</script>
