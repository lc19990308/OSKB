<template>
  <el-main class="main">
    <router-view />
  </el-main>
</template>
<script>
export default {
  name: 'user',
  components: {},
  data () {
    return {
      tabs: [
        {
          label: '账号管理',
          name: '/user/account'
        },
        {
          label: '权限审批',
          name: '/user/power'
        }
      ]
    }
  },
  computed: {
    activeTab: {
      get () {
        return this.$route.path
      },
      set () {
        return this.$route.path
      }
    }
  },
  methods: {
    tabChange (active, tab, event) {
      this.$router.push(active)
    }
  },
  beforeMount () {
    this.activeTab = this.$route.path
  },
  mounted () {}
}
</script>
