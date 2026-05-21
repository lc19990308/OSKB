<template>
  <div style="display: flex; justify-content: space-between" class="m-b-5">
    <div>
      <el-tabs
        ref="tabs"
        class="customize-tabs_no_border"
        type="card"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <template v-for="(val, key) in tabs">
          <el-tab-pane
            :key="key"
            :label="val.label"
            :name="val.name"
            v-if="whetherToDisplay(val)"
          >
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
import { has } from "@/utils";
export default {
  name: "CardTab",
  props: ["tabs"],
  methods: {
    whetherToDisplay(tab) {
      return has(tab, "powerId") ? this.authorityFilter(tab.powerId) : true;
    },
  },
};
</script>

<style scoped lang="scss">
:deep(.el-tabs--card) {
  .el-tabs__header {
    border-bottom: 0 !important;

    .el-tabs__nav {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        height: 1px;
        background-color: #dcdee0;
        bottom: 0;
        width: 100%;
        left: 0;
        z-index: -1;
      }
    }
    .el-tabs__item:first-child {
      border-left: 1px solid #dcdee0;
    }
    .el-tabs__item:last-child {
      margin-right: 0 !important;
    }
    .el-tabs__item {
      margin-right: 10px !important;
      border-radius: 3px 3px 0px 0px;
      border: 1px solid #dcdee0;
      border-bottom-color: transparent !important;
      z-index: 999;
      margin-bottom: 0 !important;
      padding: 0 17px;
      height: 36px;
      line-height: 36px;
      cursor: pointer;
    }
    .el-tabs__item.is-active {
      border: 1px solid #3596fa !important;
      border-bottom-color: #ffffff !important;
      z-index: 9999;
    }
  }
}
</style>
