<template>
  <el-container class="h-full">
    <el-header height="65px">
      <app-header class="header"></app-header>
    </el-header>
    <el-main class="main scrollbar-custom">
      <slot></slot>
    </el-main>
  </el-container>
</template>

<script>
import AppHeader from '@/views/open/layout/AppHeader'

export default {
  name: 'layout-open',
  components: { AppHeader }
}
</script>

<style scoped lang="scss">
:deep(.el-main) {
  background-color: #f4f7fa;
  color: $text-color-primary;
  flex: 1;

  &::-webkit-scrollbar {
    background: transparent;
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: $color-primary-dark;
    width: 6px;
    border-radius: 4px;
  }
}

.el-container {
  flex-direction: column !important;
}

.el-header {
  padding: 0 0 0 20px;
  background-color: #fff;
  box-shadow: -1px 1px 26px -13px rgba(26, 58, 92, 50%);
  line-height: 65px;
  height: 65px;
  box-sizing: border-box;
  position: relative;
  z-index: 999;
}
</style>
