<template>
  <el-tooltip effect="dark" :open-delay="150" placement="top" v-bind="attrs.tooltip" :disabled="tooltipDisabled">
    <i v-if="elIcon" style="display: inline" :class="[elIcon, 'icon-button', {'icon-button-radius': radius}]" v-bind="attrs.icon" v-on="attrs.icon.disabled ? {} : $listeners"></i>
    <i v-else class="icon-button iconfont" v-bind="attrs.icon" v-on="attrs.icon.disabled ? {} : $listeners"></i>
  </el-tooltip>
</template>

<script>
/**
 * 此组件为icon按钮
 * 调用方式：<icon-button tooltip-content="生成报告" class="iconxiangqing" @click="detail(scope.row)"></icon-button>
 * 按钮禁点直接 加个 disabled 属性就行
 * 事件会直接加在 “i” 标签上
 * "tooltip-" 开头的属性会绑定到 el-tooltip
 * 比如想把气泡的位置改在下方，内容改为“查看详情”
 * <icon-button tooltip-content="查看详情" tooltip-placement="bottom" class="iconxiangqing" @click="detail(scope.row)"></icon-button>
 * */
export default {
  name: 'IconButton',
  props: {
    tooltipDisabled: {
      type: Boolean,
      default: false
    },
    elIcon: {
      type: String,
      default: null
    },
    radius: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    attrs () {
      const attr = {
        tooltip: {
          placement: 'top',
          effect: 'dark'
        },
        icon: {
          disabled: false
        }
      }
      if (this.$attrs) {
        for (const i in this.$attrs) {
          if (i) {
            if (i.indexOf('tooltip') !== -1) {
              attr.tooltip[i.replace('tooltip-', '')] = this.$attrs[i]
            } else {
              attr.icon[i] = this.$attrs[i]
            }
          }
        }
      }
      return attr
    }
  }
}
</script>

<style lang="scss">
.icon-button-radius{
  border-radius: 50% !important;
  &:hover,&:focus{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
.icon-button{
  font-size: 18px;
  color: $color-primary;
  cursor: pointer;
  transition: all 0.3s;
  outline: none;
  //display: inline-block;
  //line-height: normal;
  padding: 4px;
  border-radius: 5px;
  overflow: hidden;
  //,&:focus
  &:hover,&:focus{
    color: #8BAAC4;
    background: #EDE9FE;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  &:active{
    color: #6D28D9;
    background: #EDE9FE;
  }
  &[disabled]{
    color: #9da2a6;
    cursor: not-allowed;
    background-color: transparent!important;
  }
}
.icon-button{
  margin-right: 10px;
  &:last-child{
    margin-right: 0;
  }
}
</style>
