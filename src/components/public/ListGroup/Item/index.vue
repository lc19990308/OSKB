<template>
  <li
    class="list-item"
    :class="{
    'active': active,
    'list-head': type === 'head'
    }"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </li>
</template>
<script>

export default {
  name: 'ListItem',
  data () {
    return {}
  },
  props: {
    active: {
      type: Boolean,
      default () {
        return false
      }
    },
    type: {
      type: String,
      default () {
        return 'item'
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.list-head {
  font-weight: 600;
  &:hover {
    background-color: #ffffff;
  }
}
.active{
  &:before{
    content: '';
    width: 5px;
    height: 100%;
    position: absolute;
    left: -15px;
    top: 0;
    background-color: #7C3AED;
  }
  .name {
    color: #7C3AED;
  }
  .version {
    color: #7C3AED;
    &.iconfengefu {
      color: #999999;
    }
  }
}
.list-item {
  &:hover{
    .name {
      color: #7C3AED;
    }
    .version {
      color: #7C3AED;
      &.iconfengefu {
        color: #999999;
      }
    }
  }

  &::after {
    content: "";
    display: block;
    clear: both;
    width: 0;
    height: 0;
  }
  padding: 12px 0;
  position: relative;
  display: block;
  border-bottom: 1px solid #e7ecee;
  cursor:pointer;
}
</style>
