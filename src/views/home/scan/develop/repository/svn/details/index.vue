<template>
  <div>
    <DescDrawer ref="info"></DescDrawer>
    <top-banner @buttonClick="$refs.info.open(taskInfo, weekOptions)">
      <template slot="left">
        <level-tag class="m-r-10" :level="taskInfo.securityLevel"></level-tag>
        <span class="m-r-10">
              {{taskInfo.url}}
        </span>
        <el-select v-model="historyId" size="medium" style="width: 300px;" placeholder="请选择" @change="selectHistory">
          <el-option
            v-for="item in historyOptions"
            :key="item.id"
            :label="item.createDate"
            :value="item.id">
            {{ item.createDate }}
          </el-option>
        </el-select>
      </template>
    </top-banner>
    <StickyTab v-model="activeTab" @tab-click="handleClick" :tabs="tabs"></StickyTab>
    <router-view />
  </div>
</template>
<script>
import { checkHistory, repositoryPackageDetail, exportDetail } from '@/api/home/scan/develop/repository/svn'
import { downloadBlobFile } from '@/utils'
import TopBanner from '@/views/home/scan/public/TopBanner'
import DescDrawer from './DescDrawer'
import StickyTab from '@/views/home/public/StickyTab'

export default {
  name: 'ScanDevelopRepositorySvnDetails',
  components: {
    StickyTab,
    DescDrawer,
    TopBanner
  },
  data () {
    return {
      id: this.$route.query.id,
      weekOptions: [
        {
          label: '周一',
          value: 2
        },
        {
          label: '周二',
          value: 3
        },
        {
          label: '周三',
          value: 4
        },
        {
          label: '周四',
          value: 5
        },
        {
          label: '周五',
          value: 6
        },
        {
          label: '周六',
          value: 7
        },
        {
          label: '周日',
          value: 1
        }
      ],
      tabs: [
        {
          label: '组件',
          name: '/scan/develop/repository/svn/details/component'
        },
        {
          label: '漏洞',
          name: '/scan/develop/repository/svn/details/vul'
        },
        {
          label: '许可证',
          name: '/scan/develop/repository/svn/details/license'
        },
        // {
        //   label: '代码溯源分析',
        //   hide: this.$route.query.source === '0',
        //   name: '/scan/develop/repository/svn/details/source'
        // },
        {
          label: '依赖关系图',
          name: '/scan/develop/repository/svn/details/depend'
        }
      ],
      checkResultOptions: [
        {
          value: 0,
          text: '未校验'
        },
        {
          value: 1,
          text: '校验通过'
        },
        {
          value: 2,
          text: '校验未通过'
        },
        {
          value: 3,
          text: '私服库校验通过'
        }
      ],
      componentInfo: [],
      name: '',
      historyOptions: [],
      historyId: null,
      taskInfo: {}
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
        query: {
          task: this.taskInfo.taskId,
          ...this.$route.query
        }
      })
    },

    selectHistory () {
      repositoryPackageDetail({
        id: this.historyId
      }).then(response => {
        const hist = this.historyOptions.find(item => item.id === this.historyId)
        this.taskInfo = { ...response.data, ...hist, ...this.$route.query }
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 导出文件
    async exportFile (type) {
      try {
        const response = await exportDetail({
          taskId: this.taskInfo.taskId,
          type: type
        })
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    changeVersion (event) {
      this.componentId = event.dicComponentId
      this.dicComponentId = event.dicComponentId
      this.taskId = event.taskId
      this.init()
      // this.initLicenseDetail()
      this.getAffectedCount()
    },

    // 检测记录下拉框
    initHistorySelect () {
      checkHistory({
        svnRepositoryId: this.id,
        loading: false
      }).then(response => {
        this.historyOptions = []
        response.data.forEach(item => {
          if (!item.name) {
            item.name = '-'
          }
          this.historyOptions.push(item)
        })
        if (this.historyOptions && this.historyOptions.length > 0) {
          this.historyId = this.historyOptions[0].id
          this.selectHistory()
        }
        if (this.componentInfo.language) {
          this.componentInfo.language = this.componentInfo.language.split(',')
        }
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    //  返回
    back () {
      this.$router.push({
        name: 'ScanDevelopRepositoryListSvn',
        params: {
          back: 1
        }
      })
    }
  },
  mounted () {
    if (this.id !== undefined) {
      this.initHistorySelect()
    }
  }
}
</script>
<style scoped lang="scss">
:deep(.xmirror-select-warp) {
  .table-span {
    overflow: initial !important;
  }
}
</style>
