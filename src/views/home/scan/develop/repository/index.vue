<template>
  <el-main class="main" id="gitViewMain" v-loading="initProjectLoading">
    <router-view v-if="project"/>
    <guide v-show="!project && !initProjectLoading"></guide>
  </el-main>
</template>
<script>
import Guide from '@/components/public/Guide/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'ScanRepository',
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
