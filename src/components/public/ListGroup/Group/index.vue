<template>
  <ul
    class="list-group"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </ul>
</template>
<script>

export default {
  name: 'ListGroup',
  data () {
    return {}
  }
}

</script>
<style lang="scss" scoped>
ul.list-group {
  margin: 0 0 2px 0;
  padding: 0 0 5px;
  box-sizing: border-box;
}
.list-group {
  background-color: #fff;
  border-radius: 2px;
}
</style>
