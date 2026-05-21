<template>
  <el-main class="main" v-loading="initProjectLoading">
    <router-view v-if="project"/>
    <guide v-show="!project && !initProjectLoading"></guide>
  </el-main>
</template>
<script>
import Guide from '@/components/public/Guide'
import { mapState } from 'vuex'

export default {
  name: 'ScanAppCodeV4',
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
