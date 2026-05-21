<template>
  <div>
    <DescDrawer ref="info"></DescDrawer>
    <top-banner @buttonClick="$refs.info.open(taskInfo, weekOptions)">
      <template slot="left">
        <level-tag class="m-r-10" :level="taskInfo.securityLevel"></level-tag>
        <span class="m-r-10">
              {{taskInfo.gitUrl}}
        </span>
        <span>
          <i class="iconfenzhi iconfont"></i>
          <el-select
            v-model="id"
            size="medium"
            filterable
            style="width: 200px;margin-right: 15px;"
            placeholder="请选择"
            @change="selectBranch"
          >
          <el-option
            v-for="item in branchOptions"
            :key="item.gitRepositoryId"
            :label="item.branch"
            :value="item.gitRepositoryId"
          >
          </el-option>
        </el-select>
        </span>
        <el-select
          v-model="historyId"
          size="medium"
          filterable
          style="width: 200px;margin-right: 15px;"
          placeholder="请选择"
          @change="selectHistory"
        >
          <el-option
            v-for="item in historyOptions"
            :key="item.id"
            :label="item.createDate"
            :value="item.id"
            class="app-item"
          >
            <div class="flex between">
              <div>{{ item.createDate }}</div>
              <div v-if="item.branch"><i class="iconfenzhi iconfont"> {{ item.branch }} </i></div>
            </div>
          </el-option>
        </el-select>
        <!-- <el-button size="medium" type="primary" @click="exportFile">导出</el-button> -->
      </template>
      <template slot="right"></template>
    </top-banner>
    <StickyTab v-model="activeTab" @tab-click="handleClick" :tabs="tabs"></StickyTab>
    <router-view v-if="reload" />
  </div>
</template>
<script>
import {
  checkHistory,
  repositoryPackageDetail,
  checkBranchSelect, excelConfirm, excelGenerate
} from '@/api/home/scan/develop/repository/git'
import TopBanner from '@/views/home/scan/public/TopBanner'
import DescDrawer from './DescDrawer'
import StickyTab from '@/views/home/public/StickyTab'
import to from '../../../../../../../utils/await-to'
import { popup } from '@/components/public/Popup'

export default {
  name: 'ScanDevelopRepositoryGitDetails',
  components: {
    StickyTab,
    DescDrawer,
    TopBanner
  },
  data () {
    return {
      id: this.$route.query.id / 1,
      reload: true,
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
          label: '组件(0个)',
          name: '/scan/develop/repository/git/details/component'
        },
        {
          label: '漏洞(0个)',
          name: '/scan/develop/repository/git/details/vul'
        },
        {
          label: '许可证(0个)',
          name: '/scan/develop/repository/git/details/license'
        },
        // {
        //   label: '代码溯源分析',
        //   hide: this.$route.query.source === '0',
        //   name: '/scan/develop/repository/git/details/source'
        // },
        {
          label: '知识图谱',
          name: '/scan/develop/repository/git/details/depend'
        }
      ],
      historyOptions: [],
      branchOptions: [],
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
    selectBranch (v) {
      this.lock = true
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          task: this.taskInfo.taskId,
          id: v
        }
      }).then(() => {
        this.initHistorySelect()
      }).finally(() => {
        this.lock = false
      })
    },
    handleClick (row) {
      this.$router.push({
        path: row.name,
        query: {
          ...this.$route.query,
          task: this.taskInfo.taskId
        }
      })
    },
    selectHistory () {
      repositoryPackageDetail({
        id: this.historyId,
        loading: false
      })
        .then(response => {
          const hist = this.historyOptions.find(item => item.id === this.historyId)
          this.taskInfo = { ...response.data, ...hist, ...this.$route.query }
          this.$set(
            this.tabs[0],
            'label',
            `组件(${this.taskInfo.componentNumVO.total || 0}个)`
          )
          this.$set(
            this.tabs[1],
            'label',
            `漏洞(${this.taskInfo.vulNumVO.total || 0}个)`
          )
          this.$set(
            this.tabs[2],
            'label',
            `许可证(${this.taskInfo.licenseNum || 0}个)`
          )
          this.routerRedirect()
        })
        .catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    /**
     * @desc 根据query tabs值重定向router
     */
    routerRedirect () {
      this.handleClick(this.tabs.find(i => i.name === this.activeTab))
    },
    // 导出文件
    async exportFile () {
      const [error, res] = await to(excelConfirm({
        repoIds: [this.id],
        projectId: this.projectMixin.id,
        assetGitPackageId: this.historyId,
        dimensionality: 0
      }))
      if (res) {
        setTimeout(() => popup({
          title: '提示',
          width: '550px',
          showConfirmButton: true,
          render (h) {
            return h('el-row', { class: 'font-base' }, [
              h('p', {}, [
                '本次将导出 ',
                h('span', { class: 'text-primary font-bold' }, `${res.data.exportCount}`),
                ' 个检测结果，点击“确定”按钮继续导出~'
              ]),
              h('p', { style: { paddingTop: '15px' } }, '注：只有检测成功的仓库才可导出。')
            ])
          },
          beforeClose: async (action, next) => {
            if (action === 'confirm') {
              const [error, result] = await to(excelGenerate({
                repoIds: res.data.repoIds,
                projectId: this.projectMixin.id,
                assetGitPackageId: this.historyId,
                dimensionality: 0
              }))
              next()
              if (result) {
                setTimeout(() => popup({
                  title: '提示',
                  width: '550px',
                  confirmButtonText: '去下载',
                  cancelButtonText: '留在本页',
                  render (h) {
                    return h('el-row', { class: 'font-base' }, [
                      h('p', {}, [h('i', {
                        class: 'el-icon-success text-success font-xxl m-r-5',
                        style: { verticalAlign: 'bottom' }
                      }, ''), '操作成功，请在报告管理中下载报告~']),
                      h('p', {
                        style: {
                          paddingTop: '15px',
                          wordBreak: 'break-word'
                        }
                      }, `报告名称：${result.data.reportName}`)
                    ])
                  },
                  beforeClose: (action, next) => {
                    next()
                    if (action === 'confirm') {
                      this.$router.push({ path: '/report/list' })
                    }
                  }
                }), 200)
              } else if (error !== null && typeof error === 'object') {
                this.$message.error(error.message)
              }
            } else {
              next()
            }
          }
        }), 200)
      } else if (error !== null && typeof error === 'object') {
        this.$message.error(error.message)
      }
    },

    // 检测记录下拉框
    initHistorySelect () {
      checkHistory({
        gitRepositoryId: this.id,
        loading: false
      })
        .then(response => {
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
        })
        .catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },

    async initBranchSelect () {
      const [error, result] = await to(checkBranchSelect({
        gitRepositoryId: this.id,
        loading: false
      }))

      if (error) {
        return this.$message.error(error.message)
      }

      this.branchOptions = result.data || []
    },

    //  返回
    back () {
      this.$router.push({
        name: 'ScanDevelopRepositoryListGit',
        params: {
          back: 1
        }
      })
    },
    handleReload () {
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    }
  },
  mounted () {
    if (this.id !== undefined) {
      this.initHistorySelect()
      this.initBranchSelect()
    }
  },
  watch: {
    '$route' () {
      if (this.lock) {
        return
      }
      this.handleReload()
    }
  }
}
</script>
<style scoped lang="scss">
.app-item {
  //width: 400px;

  span {
    display: block;
  }

  .left {
    width: 60%;
  }

  .center {
    width: 10%;
    float: left;
  }

  .right {
    width: 30%;
    text-align: right;
  }
}

:deep(.xmirror-select-warp) {
  .table-span {
    overflow: initial !important;
  }
}
</style>
