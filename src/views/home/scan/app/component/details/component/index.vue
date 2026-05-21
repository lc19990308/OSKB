<template>
  <div style="display: flex;">
    <div class="oss-border m-r-15" style="padding:15px 10px 0 10px;width: 335px;flex-shrink: 0;">
      <StickyContent
        activeStickyClass="activeStickyClass"
        :sticky-top="140"
      >
        <ComponentSelect
          :init-list-xhr="componentList"
          :task-id="taskId"
          @select="select"
        ></ComponentSelect>
      </StickyContent>
    </div>
    <div class="second-main oss-border" style="padding: 20px; flex: 1;">
      <empty v-if="!dicComponentId"></empty>
      <template v-else>
        <ComponentInfo :asset-component-id="assetComponentId"></ComponentInfo>
        <ComponentVul :dic-component-id="dicComponentId" :task-id="taskId"></ComponentVul>
        <license-list :dic-component-id="dicComponentId" :task-id="taskId"></license-list>
        <affected :dic-component-id="dicComponentId"></affected>
      </template>
    </div>
  </div>
</template>
<script>
import Affected from '@/views/home/public/component/affected/index.vue'
import LicenseList from '@/views/home/public/component/license/index.vue'
import StickyContent from '@/components/public/StickyContent/index.vue'
import ComponentSelect from '@/views/home/public/component/ComponentSelect/index.vue'
import ComponentInfo from '@/views/home/public/component/ComponentInfo/index.vue'
import ComponentVul from '@/views/home/public/component/ComponentVul/index.vue'
import { taskComponentList } from '@/api/home/scan/app'

export default {
  name: 'ScanAppComponentDetailsComponent',
  components: {
    ComponentVul,
    ComponentSelect,
    ComponentInfo,
    StickyContent,
    Affected,
    LicenseList
  },
  data () {
    return {
      projectId: this.$route.query.project,
      assetComponentId: null,
      taskId: this.$route.query.task,
      dicComponentId: null
    }
  },
  methods: {
    componentList (data) {
      return taskComponentList(data)
    },

    // 组件选中
    select (item) {
      this.dicComponentId = item.dicComponentId
      this.assetComponentId = item.assetComponentId
    }
  },
  mounted () {
  }
}
</script>
