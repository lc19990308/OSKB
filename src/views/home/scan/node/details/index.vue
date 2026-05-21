<template>
  <div>
    <DescDrawer ref="info"></DescDrawer>
    <top-banner @buttonClick="$refs.info.open(activeApp)">
      <template slot="left">
        <i class="iconfont iconmoshi text-regular"></i>
        <level-tag class="m-r-10" :level="activeApp.securityLevel"></level-tag>
        <span class="m-r-10">{{ activeApp.name || '--' }}</span>
        <el-select
          class="m-r-15"
          v-model="activeApp"
          :value-key="'name'"
          size="medium"
          style="width: 300px;"
          placeholder="请选择"
          @change="selectApp">
          <el-option
            v-for="item in appOptions"
            :key="item.id"
            :label="item.name"
            :value="item"
            class="app-item">
            <span class="left">{{ item.name }}</span>
            <span class="center">{{ item.vulTotal }}</span>
            <span class="right">
                  <level-tag :level="item.securityLevel"></level-tag>
                </span>
          </el-option>
        </el-select>
        <span style="font-weight: normal;font-size: 14px;" v-if="activeApp.ip">节点IP: {{ activeApp.ip || '-' }}</span>
      </template>
    </top-banner>
    <StickyTab v-model="activeTab" @tab-click="handleClick" :tabs="tabs"></StickyTab>
    <router-view/>
  </div>
</template>
<script>
import { appSelect, exportNode } from '@/api/home/scan/node'
import { downloadBlobFile, hasOwn } from '@/utils'
import TopBanner from '@/views/home/scan/public/TopBanner'
import DescDrawer from './DescDrawer'
import StickyTab from '@/views/home/public/StickyTab'

export default {
  name: 'ScanNodeDetails',
  components: {
    StickyTab,
    DescDrawer,
    TopBanner
  },
  data () {
    return {
      nodeId: this.$route.query.id,
      projectId: this.$route.query.project,
      tabs: [
        {
          label: '组件(0个)',
          name: '/scan/node/details/component'
        },
        {
          label: '漏洞(0个)',
          name: '/scan/node/details/vul'
        },
        {
          label: '许可证(0个)',
          name: '/scan/node/details/license'
        }
      ],
      appOptions: [],
      activeApp: {},
      appId: ''
    }
  },
  provide () {
    const self = this
    return {
      updateDetails () {
        self.initAppSelect()
      }
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
    handleClick (row) {
      this.$router.push({
        path: row.name,
        query: { ...this.$route.query, appId: this.appId }
      })
    },

    selectApp () {
      this.appId = this.activeApp.id
      this.$set(this.tabs[0], 'label', `组件(${this.activeApp.componentTotal || 0}个)`)
      this.$set(this.tabs[1], 'label', `漏洞(${this.activeApp.vulTotal || 0}个)`)
      this.$set(this.tabs[2], 'label', `许可证(${this.activeApp.licenseNum || 0}个)`)
    },

    // 导出文件
    async exportFile (type) {
      try {
        const response = await exportNode({
          param: [this.nodeId],
          projectId: this.projectId,
          type: type
        })
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    // 初始化节点下所有应用
    initAppSelect () {
      appSelect({
        projectId: this.projectId,
        nodeId: this.nodeId,
        loading: false
      }).then(response => {
        this.appOptions = []
        response.data.forEach(item => {
          if (!item.name) {
            item.name = '-'
          }
          this.appOptions.push(item)
        })
        if (this.appOptions && this.appOptions.length > 0) {
          this.activeApp = this.appOptions[0]
          this.appId = this.appOptions[0].id
          this.tabs[0].label = `组件(${this.activeApp.componentTotal || 0}个)`
          this.tabs[1].label = `漏洞(${this.activeApp.vulTotal || 0}个)`
          this.tabs[2].label = `许可证(${this.activeApp.licenseNum || 0}个)`
        }
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  mounted () {
    if (hasOwn(this.$route.query, 'id')) {
      this.initAppSelect()
    }
  }
}
</script>
<style scoped lang="scss">
.app-item {
  display: flex;

  .left {
    width: 60%;
  }

  .center {
    width: 10%;
  }

  .right {
    width: 30%;
    text-align: right;
  }
}
</style>
