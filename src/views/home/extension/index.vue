<template>
  <el-main class="main">
    <el-tabs ref="tabs" v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tabs" :key="'key' + index" :label="item.label" :name="item.name"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </el-main>
</template>

<script>
export default {
  name: 'extension',
  data () {
    return {
      tabs: [
        {
          label: 'jira配置',
          name: '/extension/jira'
        },
        {
          label: '自定义解析配置',
          name: '/extension/parse'
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

      }
    }
  },
  methods: {
    // 点击tag 跳转
    handleClick (val) {
      this.$router.push({
        path: val.name
      })
    }
  }
}
</script>
