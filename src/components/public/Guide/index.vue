<template>
  <div class="container">
    <p class="title">先创建一个项目，然后进行开源威胁治理！</p>
    <p class="content">
      <el-button class="btn" type="primary" @click="addProject" v-if="authorityFilter(101)">新建项目</el-button>
      <el-button class="btn" @click="next" v-show="$route.path === '/guide'" v-if="firstLogin !== 1">跳过</el-button>
    </p>
  </div>
</template>
<script>
import globalBus from '@/utils/bus'
import { mapState } from 'vuex'

export default {
  name: 'Guide',
  components: {},
  props: {
    next: {
      type: Function,
      default () {}
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState({
      firstLogin: state => state.login.firstLogin
    })
  },
  methods: {
    // 新建项目
    addProject () {
      this.$router.push('/project/conf/list')
      // if (this.firstLogin === 1) {
      //   globalBus.$emit('addProject', 'guide')
      // } else {
      //   globalBus.$emit('addProject')
      // }
    }
  },
  mounted () {}
}
</script>
<style scoped lang="scss">
.container{
  text-align: center;
  width: 500px;
  margin: 150px auto 0;
  .title{
    font-size: 16px;
    color: #1B2838;
    margin-bottom: 50px;
  }
  .content{
    .btn{
      width: 100px;
    }
  }
}
</style>
