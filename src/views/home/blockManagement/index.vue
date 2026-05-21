<template>
  <el-main class="main" style="padding: 10px 20px;" v-loading="initProjectLoading">
    <router-view v-if="project"/>
    <guide v-else-if="!initProjectLoading"></guide>
  </el-main>
</template>
<script>
import Guide from '@/components/public/Guide'
import { mapState } from 'vuex'

export default {
  name: 'blockManagement',
  components: {
    Guide
  },
  computed: {
    ...mapState({
      project: state => state.home.project,
      initProjectLoading: state => state.home.initProjectLoading
    })
  }
}
</script>
