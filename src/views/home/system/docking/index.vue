<template>
  <div class="view-content">
    <card-tab :tabs="tabs" v-model="activeTab" @tab-click="handleClick"></card-tab>
    <router-view />
  </div>
</template>
<script>
import CardTab from '@/components/public/CardTab'
export default {
  name: 'docking',
  components: { CardTab },
  data () {
    return {
      tabs: [
        // {
        //   label: '蓝鲸DevOps',
        //   name: '/system/docking/blueWhale'
        // },
        {
          label: 'jira',
          name: '/system/docking/jira',
          powerId: 3310
        },
        // {
        //   label: '禅道',
        //   name: '/system/docking/zenTao'
        // },
        {
          label: 'LDAP配置',
          name: '/system/docking/ldap',
          powerId: 3320
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
    search (val) {
      this.$router.push({
        path: val
      })
    },
    handleClick (val) {
      this.$router.push({
        path: val.name
      })
    }
  },
  created () {
    for (let i = 0, len = this.tabs.length; i < len; i++) {
      if (this.authorityFilter(this.tabs[i].powerId)) {
        this.$router.push(this.tabs[i].name)
        break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.view-content {
  font-size: 14px;

  .el-dropdown {
    color: inherit;
  }
}
</style>
