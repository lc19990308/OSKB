<template>
  <el-main class="main">
    <img :src="png404" alt="">
  </el-main>
</template>
<script>
export default {
  name: 'notFound',
  data () {
    return {
      png404: require('@/assets/images/404.png')
    }
  },
  methods: {},
  mounted () {}
}
</script>
<style scoped lang="scss">
.main {
  text-align: center;

  img {
    margin-top: 200px;
    width: 400px;
  }
}
</style>
