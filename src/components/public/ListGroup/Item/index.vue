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
    background-color: #2C5F8A;
  }
  .name {
    color: #2C5F8A;
  }
  .version {
    color: #2C5F8A;
    &.iconfengefu {
      color: #8B9CB0;
    }
  }
}
.list-item {
  &:hover{
    .name {
      color: #2C5F8A;
    }
    .version {
      color: #2C5F8A;
      &.iconfengefu {
        color: #8B9CB0;
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
