<template>
  <el-container class="h-full">
    <app-sidebar></app-sidebar>
    <el-container class="content" id="content">
      <el-header class="header" height="65px">
        <app-header></app-header>
      </el-header>
      <transition name="fade-transform" mode="out-in">
          <router-view />
      </transition>
    </el-container>
    <upload-progress></upload-progress>
    <dialog-copy-text></dialog-copy-text>
  </el-container>
</template>

<script>
import AppHeader from '@/components/public/Layout/AppHeader.vue'
import AppSidebar from '@/components/public/Layout/AppSidebar.vue'
import UploadProgress from '@/components/public/UploadProgress/index.vue'
import DialogCopyText from '@/components/dialog/dialogCopyText.vue'
import { destroy } from '@/components/public/SliceUpload'
export default {
  name: 'Home',
  components: {
    AppHeader,
    AppSidebar,
    UploadProgress,
    DialogCopyText
  },
  destroyed () {
    destroy()
  },
  created () {
    this.$store.dispatch('getProjectList')
    this.$store.dispatch('getOpticalUserList')
    this.projectMixin?.id && this.$store.dispatch('getOpenScaToken', this.projectMixin.id)
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  padding: 0;
  background: transparent;
  box-shadow: none;
  line-height: 65px;
  height: 65px;
  position: relative;
  z-index: 999;
}

.content {
  position: relative;

  //width: 100%;
  overflow-x: hidden;
  max-width: 100%;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  flex: 1;
  flex-direction: column;
}

:deep(.el-main.main) {
  background: url(~@/assets/images/layout-bg.png) no-repeat center top / cover !important;
}

.el-main {
  background:
    radial-gradient(circle at top, rgba(44, 95, 138, 0.04) 0, transparent 28%),
    linear-gradient(180deg, #f4f7fa 0%, #eef3f7 100%);
  color: $text-color-primary;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  flex: 1;

  &::-webkit-scrollbar {
    background: transparent;
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #2C5F8A;
    width: 6px;
    border-radius: 4px;
  }
}
</style>
