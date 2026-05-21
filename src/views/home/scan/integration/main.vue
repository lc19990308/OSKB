<template>
  <div>
    <el-tabs ref="tabs" class="customize-tabs_no_border" v-model="activeTab" @tab-click="handleClick">
<!--      <el-tab-pane-->
<!--        v-for="(val,key) in tabs"-->
<!--        :key="key"-->
<!--        :label="val.label"-->
<!--        :name="val.name"-->
<!--      >-->
<!--        <span slot="label">-->
<!--          {{ val.label }}-->
<!--        </span>-->
<!--      </el-tab-pane>-->
      <template
        v-for="(val,key) in tabs"
      >
        <el-tab-pane
          :key="key"
          :label="val.label"
          :name="val.name"
          v-if="has(val, 'powerId') ? val.powerId === 2324 ? imageEnable && authorityFilter(val.powerId) : authorityFilter(val.powerId) : true"
        >
        </el-tab-pane>
      </template>
    </el-tabs>
    <router-view />
  </div>
</template>
<script>
import { has } from 'lodash-es'
import { mapState } from 'vuex'

export default {
  name: 'IntegrationMain',
  components: {
  },
  computed: {
    ...mapState({
      imageEnable: state => state.site.imageEnable
    })
  },
  data () {
    return {
      activeTab: this.$route.fullPath,
      tabs: [
        {
          label: '源码',
          powerId: 2323,
          name: '/scan/integration/list/sourceCode'
        },
        {
          label: '镜像',
          name: '/scan/integration/list/mirrorImage',
          powerId: 2324
        }
      ]
    }
  },
  methods: {
    has,
    handleClick (row) {
      this.$router.push({
        path: row.name,
        query: this.$route.query
      })
    }
  },
  created () {
    const firstTab = this.tabs.find(tab => this.authorityFilter(tab.powerId))

    if (firstTab) {
      const activeTab = this.tabs.find(tab => this.$route.fullPath.includes(tab.name))
      if (!this.authorityFilter(activeTab.powerId)) {
        this.handleClick(activeTab)
      }
    } else {
      this.$router.push('/notPermissions')
    }
  },
  watch: {
    $route (route) {
      this.activeTab = route.fullPath
    }
  }
}
</script>
