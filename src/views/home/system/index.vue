<template>
  <el-main class="main">
    <el-tabs ref="tabs" class="customize-tabs_no_border" v-model="activeTab" @tab-click="handleClick">
      <template
        v-for="(val,key) in tabs"
      >
        <el-tab-pane
          :key="key"
          :label="val.label"
          :name="val.name"
          v-if="typeof val.powerId === 'function' ? val.powerId() : authorityFilter(val.powerId)"
        >
        </el-tab-pane>
      </template>
    </el-tabs>
    <router-view />
  </el-main>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'system',
  computed: {
    ...mapState({
      showViewSetting: state => state.site.showViewSetting
    })
  },
  data () {
    return {
      activeTab: this.$route.path,
      tabs: [
        {
          label: '安全配置',
          name: '/system/safety',
          powerId: 2240
        },
        {
          label: '通知配置',
          name: '/system/warnConf',
          powerId: 2230
        },
        {
          label: '数据备份',
          name: '/system/backups',
          powerId: 2210
        },
        {
          label: '界面配置',
          name: '/system/webConf',
          powerId: () => {
            if (this.showViewSetting !== 1) {
              return false
            }
            return this.authorityFilter(2220)
          }
        },
        {
          label: '规则配置',
          name: '/system/rule',
          powerId: 2201
        },
        {
          label: '对接配置',
          name: '/system/docking',
          powerId: 3300
        },
        {
          label: '后台配置',
          name: '/system/backstage',
          powerId: 3580
        },
        {
          label: '系统清理',
          name: '/system/cleanup',
          powerId: 3590
        },
        {
          label: '任务队列',
          name: '/system/taskQueue',
          powerId: 3720
        }
      ]
    }
  },
  watch: {
    '$route.path' (n) {
      this.tabs.forEach(item => {
        if (n.includes(item.name)) {
          this.activeTab = item.name
        }
      })
    }
  },
  methods: {
    handleClick () {
      this.$router.push({
        path: this.activeTab
      })
    }
  },
  mounted () {
    this.tabs.forEach(item => {
      if (this.$route.path.includes(item.name)) {
        this.activeTab = item.name
      }
    })
  }
}
</script>
