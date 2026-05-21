<template>
  <el-main class="main">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </el-main>
</template>
<script>

export default {
  name: 'warning',
  data () {
    return {}
  }
}
</script>
