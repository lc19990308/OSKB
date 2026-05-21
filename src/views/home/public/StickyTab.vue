<template>
  <sticky
    :sticky-top="65"
    sticky-class-name="fixed-operating-wrap"
  >
    <div class="clearfix">
      <el-tabs ref="tabs" v-bind="$attrs" v-on="$listeners" class="customize-tabs_no_border">
        <template
          v-for="(val,key) in tabs"
        >
          <el-tab-pane
            v-if="whetherToDisplay(val)"
            :key="key"
            :label="val.label"
            :name="val.name"
          >
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </sticky>
</template>

<script>
import { hasOwn } from "@/utils";
export default {
  name: "StickyTab",
  props: ["tabs"],
  methods: {
    whetherToDisplay(tab) {
      return (hasOwn(tab, "powerId") ? this.authorityFilter(tab.powerId) : true) && (hasOwn(tab, "hide") ? !tab.hide : true);
    },
  },
  watch: {
    tabs: {
      deep: true,
      handler(){
        this.$refs.tabs && this.$refs.tabs.calcPaneInstances(true)
      }
    }
  }
};
</script>

<style scoped lang="scss">
:deep(.el-tabs__header) {
  margin-bottom: 0 !important;
}
</style>
