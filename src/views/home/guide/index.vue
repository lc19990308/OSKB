<template>
  <el-main class="main">
    <guide v-show="!(project || breakGuide)" :next="next"></guide>
    <div class="container" v-show="breakGuide || project">
      <p>进入供应链场景管理模块</p>
      <p>你可进行<span><router-link to="/scan/app/component/list" class="link">应用包审查任务添加</router-link>或</span><router-link to="/scan/node/list" class="link">添加运行时节点</router-link>操作</p>
    </div>
  </el-main>
</template>
<script>
import Guide from '@/components/public/Guide/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'GuideView',
  components: {
    Guide
  },
  data () {
    return {
      breakGuide: false
    }
  },
  methods: {
    next () {
      this.breakGuide = true
    }
  },
  computed: {
    ...mapState({
      project: state => state.home.project,
      powerId: ''
    })
  }
}
</script>
<style scoped lang="scss">
.container {
  text-align: center;
  width: 800px;
  margin: 150px auto 0;
  font-size: 16px;

  p {
    .link {
      color: #2C5F8A;
    }
  }
}
</style>
