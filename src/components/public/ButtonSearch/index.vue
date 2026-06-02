<template>
  <el-input v-bind="$attrs" v-on="$listeners" @keydown.enter.native="$emit('search')" clearable @clear="$emit('search')">
    <el-button slot="append" size="medium"  icon="el-icon-search" @click="$emit('search')"></el-button>
  </el-input>
</template>

<script>
export default {
  name: 'ButtonSearch'
}
</script>

<style lang="scss" scoped>
:deep(.el-input-group__append) {
  background: #FFFFFF;
  color: #8B9CB0;
  font-size: 16px;
  font-weight: bold;

  &:focus,
  &:hover {
    border-color: $color-primary;
    border-left: 1px solid $color-primary !important;
    color: $color-primary;
  }
}

:deep(.el-input__suffix) {
  i {
    color: $color-primary;

    &::before {
      content: "";
    }

    &:hover {
      color: $color-primary;
    }
  }
}
</style>
