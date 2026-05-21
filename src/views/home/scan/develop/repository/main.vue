<template>
  <div>
    <el-tabs ref="tabs" class="customize-tabs_no_border" v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane
        v-for="(val,key) in tabs"
        :key="key"
        :label="val.label"
        :name="val.name"
      >
        <span slot="label">
          <i :class="val.icon" v-if="val.icon"></i>{{ val.label }}
        </span>
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>
<script>

export default {
  name: 'RepositoryMain',
  components: {
  },
  data () {
    return {
      activeTab: this.$route.fullPath,
      tabs: [
        {
          label: 'Git',
          name: '/scan/develop/repository/list/git',
          icon: 'iconfont icongit'
        },
        {
          label: 'SVN',
          name: '/scan/develop/repository/list/svn',
          icon: 'iconfont iconsvn'
        },
        {
          label: 'FireFly',
          name: '/scan/develop/repository/list/firefly',
          icon: 'iconfont iconFirefly'
        }

      ]
    }
  },
  methods: {
    handleClick (row) {
      this.$router.push({
        path: row.name,
        query: this.$route.query
      })
    }
  },
  created () {
    this.activeTab = this.$route.fullPath
  },
  watch: {
    '$route' (to) {
      this.activeTab = to.fullPath
    }
  }
}
</script>
<style scoped lang="scss">
.iconfont {
  font-size: 20px;
  margin-right: 5px;

  &.iconsvn {
    font-size: 24px;
  }
}
</style>
