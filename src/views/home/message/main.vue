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
         {{ val.label }}
        </span>
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>
<script>

export default {
  name: 'messageList',
  components: {
  },
  data () {
    return {
      tabs: [
        {
          label: '消息通知',
          name: '/message/main/list'
        },
        {
          label: '通知设置',
          name: '/message/main/conf'
        }
      ]
    }
  },
  computed: {
    activeTab: {
      get () {
        return this.$route.fullPath
      }
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
  }
}
</script>
