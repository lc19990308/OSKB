<template>
  <el-main class="main">
    <h1>访问资源不存在，请返回刷新页面重试</h1>
    <img :src="png404" alt="">
    <br>
    <br>
    <br>
    <el-button type="primary" style="width: 80px;" @click="$router.back(-1)" size="medium">返回</el-button>
  </el-main>
</template>
<script>
export default {
  name: 'notFound',
  data () {
    return {
      png404: require('@/assets/images/404_2.png')
    }
  },
  methods: {},
  mounted () {}
}
</script>
<style scoped lang="scss">
.main {
  text-align: center;

  h1 {
    margin-top: 150px;
    color: #666;
    font-size: 28px;
  }

  img {
    width: 400px;
  }
}
</style>
