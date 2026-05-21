<template>
  <el-col :span="span" class="info-panel-item">
    <label class="title" :style="{'width': labelWidth + 'px'}">
      <slot name="label" v-if="$slots.label"></slot>
      <template v-else-if="label">{{ label }}</template>
    </label>
    <div :class="['content', {'table-span': !noEllipsis ? false : ellipsis }]" :style="{'marginLeft': labelWidth +
    'px'}">
      <slot></slot>
    </div>
  </el-col>
</template>
<script>

export default {
  name: 'InfoItem',
  data () {
    return {}
  },
  inject: {
    ellipsis: {
      default: false
    }
  },
  props: {
    label: String,
    labelWidth: {
      type: Number,
      default () {
        return 100
      }
    },
    noEllipsis: {
      type: Boolean,
      default () {
        return true
      }
    },
    span: {
      type: Number,
      default () {
        return 8
      }
    }
  },

}

</script>
<style lang="scss" scoped>
.info-panel-item {
  padding: 15px 15px;
  color: #333333;

  &:before,&:after {
    display: table;
    content: "";
  }

  &:after {
    clear: both;
  }

  .title {
    float: left;
  }

  .content {
    word-break: break-all;
    //overflow: hidden;
    //white-space: nowrap;
    //text-overflow: ellipsis;
    //word-break: break-all;
  }
}
</style>
