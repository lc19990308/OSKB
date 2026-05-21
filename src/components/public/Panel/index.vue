<template>
  <div class="panel" :class="'panel-' + size">
    <div class="panel-header" v-if="$slots.header || title">
      <slot name="header" v-if="$slots.header"></slot>
      <span v-else-if="title">{{ title }}</span>
    </div>
    <div class="panel-body">
      <slot></slot>
    </div>
    <div class="panel-footer" v-if="$slots.footer">
      <slot name="footer" v-if="$slots.footer"></slot>
    </div>
  </div>
</template>
<script>
/**
 * 使用方法：
 *  <panel title="这是标题（头）">
 *    这是内容
 *    <div slot="footer">
 *      这是脚
 *    </div>
 *  </panel>
 *  或者
 *  <panel>
 *    <div slot="header">
 *      这是头
 *    </div>
 *
 *     这是内容
 *
 *    <div slot="footer">
 *      这是脚
 *    </div>
 *  </panel>
 *
 * **/
export default {
  name: 'Panel',
  props: {
    title: String,
    size: {
      type: String,
      default () {
        return 'medium'
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {}
}
</script>
<style lang="scss" scoped>
.panel {
  border: 1px solid #eff3f6;
  margin-bottom: 20px;
  &:last-child{
    margin-bottom: 0;
  }
  .panel-header {
    color: #333;
    background-color: #eff3f6;
    padding: 24px 15px;
    border-bottom: 1px solid #eff3f6;
  }
  .panel-body {
    padding: 20px;
    border-bottom: 1px solid #eff3f6;
    &:last-child {
      border-bottom: 0;
    }
  }
  .panel-footer {
    color: #333;
    padding: 24px 15px;
  }
  &.panel-small .panel-header {
    padding: 10px 15px;
    min-height: 30px;
  }
}
</style>
