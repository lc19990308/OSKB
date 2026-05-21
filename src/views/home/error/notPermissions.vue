
<template>
  <el-main class="main">
    <img :src="notPermissions" alt="">
  </el-main>
</template>
<script>
export default {
  name: 'notPermissions',
  data () {
    return {
      notPermissions: require('@/assets/images/notPermissions.png')
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
