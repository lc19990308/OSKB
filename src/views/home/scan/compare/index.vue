<template>
    <div class="view-content result-vs-wrapper" style="margin-top:0">
        <div class="vs-header">
          <div class="vs-header-left" @click="back">
          <span>
            <i class="iconfont iconcijiyemianfanhuiicon5" @click="back"></i>
          </span>
            <div>结果对比</div>
          </div>
          <div class="vs-header-right">
            <el-button type="primary" size="medium" @click="exportCompare" :disabled="!(behindTaskId && previousTaskId)">导出报告</el-button>
          </div>
        </div>
        <section class="batch-no-wrapper">
          <select-target
            index="previous"
            :moduleName="moduleName"
            :projectId="project.id"
            :disabledId="behindTaskId"
            v-model="previousTaskId"
            @change="previousChange"
          />
          <span class="txt-vs">VS</span>
          <select-target
            index="behind"
            :moduleName="moduleName"
            :projectId="project.id"
            :disabledId="previousTaskId"
            v-model="behindTaskId"
            @change="behindChange"
          />
        </section>
        <!-- 基本信息对比 -->
        <section class="base-info-wrapper">
          <div class="box-header">
          基本信息对比
          </div>
          <div class="box-body">
            <base-info :baseInfo="previousInfo"/>
            <span class="txt-vs">VS</span>
            <base-info :baseInfo="behindInfo"/>
          </div>
        </section>
        <!-- 组件结果对比 -->
        <section class="base-info-wrapper">
          <div class="box-header">
          组件结果对比
          </div>
          <div class="table-body">
            <el-tabs type="card" lazy v-model="componentTab">
              <el-tab-pane :label="tabs[0].label">
                <table-component-list
                  :moduleName="moduleName"
                  type='INCR'
                  key="1"
                  v-if="componentTab === '0'"
                  :previousTaskId="previousTaskId"
                  :behindTaskId="behindTaskId"/>
              </el-tab-pane>
              <el-tab-pane :label="tabs[1].label">
                <table-component-list
                :moduleName="moduleName"
                 type='DECR'
                 key="2"
                 v-if="componentTab === '1'"
                 :previousTaskId="previousTaskId"
                  :behindTaskId="behindTaskId"
                />
              </el-tab-pane>
              <el-tab-pane :label="tabs[2].label">
                <table-component-list
                :moduleName="moduleName"
                  type='SAME'
                  key="3"
                  v-if="componentTab === '2'"
                  :previousTaskId="previousTaskId"
                  :behindTaskId="behindTaskId"
                  />
              </el-tab-pane>
            </el-tabs>
          </div>
        </section>
        <!-- 漏洞结果对比 -->
        <section class="base-info-wrapper">
          <div class="box-header">
          漏洞结果对比
          </div>
          <div class="table-body">
            <el-tabs type="card" lazy v-model="vulTab">
              <el-tab-pane :label="tabs[3].label">
                <table-vul-list
                  :moduleName="moduleName"
                  type='INCR'
                  key="1"
                  v-if="vulTab === '0'"
                  :previousTaskId="previousTaskId"
                  :behindTaskId="behindTaskId"/>
              </el-tab-pane>
              <el-tab-pane :label="tabs[4].label">
                <table-vul-list
                  :moduleName="moduleName"
                  type='DECR'
                  key="2"
                  v-if="vulTab === '1'"
                  :previousTaskId="previousTaskId"
                    :behindTaskId="behindTaskId"/>
              </el-tab-pane>
              <el-tab-pane :label="tabs[5].label">
                <table-vul-list
                  :moduleName="moduleName"
                  type='SAME'
                  key="3"
                  v-if="vulTab === '2'"
                  :previousTaskId="previousTaskId"
                    :behindTaskId="behindTaskId"/>
              </el-tab-pane>
            </el-tabs>
          </div>
        </section>
        <!-- 许可证结果对比 -->
        <section class="base-info-wrapper">
          <div class="box-header">
          许可证结果对比
          </div>
          <div class="table-body">
            <el-tabs type="card" lazy v-model="licenceTab">
              <el-tab-pane :label="tabs[6].label">
                <table-licence-list
                  :moduleName="moduleName"
                  type='INCR'
                  key="1"
                  v-if="licenceTab === '0'"
                  :previousTaskId="previousTaskId"
                  :behindTaskId="behindTaskId"
                  />
              </el-tab-pane>
              <el-tab-pane :label="tabs[7].label">
                <table-licence-list
                  :moduleName="moduleName"
                  type='DECR'
                  key="2"
                  v-if="licenceTab === '1'"
                  :previousTaskId="previousTaskId"
                  :behindTaskId="behindTaskId"/>
              </el-tab-pane>
              <el-tab-pane :label="tabs[8].label">
                <table-licence-list
                  :moduleName="moduleName"
                  type='SAME'
                  key="3"
                  v-if="licenceTab === '2'"
                  :previousTaskId="previousTaskId"
                  :behindTaskId="behindTaskId"/>
              </el-tab-pane>
            </el-tabs>
          </div>
        </section>
      </div>
</template>
<script>
import projectMixins from '@/components/public/Layout/Project/mixins'
import tableComponentList from './main/tableComponentList.vue'
import TableVulList from './main/tableVulList.vue'
import TableLicenceList from './main/tableLicenceList.vue'
import BaseInfo from './main/baseInfo.vue'
import SelectTarget from './main/selectTarget.vue'
import requestApi from './utils'
import { downloadBlobFile } from '@/utils'
import axios from 'axios'

export default {
  components: { tableComponentList, TableVulList, TableLicenceList, BaseInfo, SelectTarget },
  name: 'compare',
  mixins: [projectMixins],
  props: {
    callback: {
      type: Function,
      default: () => {}
    },
    moduleName: {
      type: String,
      default: 'component'
    }
  },
  data () {
    return {
      project: this.$store.state.home.project,
      drawerVisible: false,
      componentTab: '0',
      licenceTab: '0',
      vulTab: '0',
      previousTaskId: null,
      previousInfo: {},
      behindTaskId: null,
      behindInfo: {},
      tabs: [
        {
          label: '新增组件'
        },
        {
          label: '减少组件'
        },
        {
          label: '相同组件'
        },
        {
          label: '新增漏洞'
        },
        {
          label: '减少漏洞'
        },
        {
          label: '相同漏洞'
        },
        {
          label: '新增许可证'
        },
        {
          label: '减少许可证'
        },
        {
          label: '相同许可证'
        }
      ]
    }
  },
  computed: {
    selectValue () {
      const { previousTaskId, behindTaskId } = this
      return {
        previousTaskId,
        behindTaskId
      }
    }
  },
  mounted () {
    this.initBaseInfo('previous')
    this.initBaseInfo('behind')
    this.defaultCompare()
  },
  methods: {
    // 取消
    cancel () {
      this.dialogVisible = false
    },

    handleClose (done) {
      done()
    },

    // 打开窗口时的回调
    open () {
      this.drawerVisible = true
    },

    back () {
      this.$router.push({
        path: requestApi.getBackPath(this.moduleName)
      })
    },

    previousChange (value, selectedItem) {
      this.initBaseInfo('previous')
      if (selectedItem) {
        this.previousInfo = {
          ...this.previousInfo,
          ...selectedItem
        }
      }
    },
    behindChange (value, selectedItem) {
      this.initBaseInfo('behind')
      if (selectedItem) {
        this.behindInfo = {
          ...this.behindInfo,
          ...selectedItem
        }
      }
    },
    initBaseInfo (target = 'previous') {
      if (target === 'previous') {
        this.previousInfo = {}
        requestApi.getBaseInfoFieldKeys(this.moduleName).forEach(key => {
          this.previousInfo[key] = null
        })
      }

      if (target === 'behind') {
        this.behindInfo = {}
        requestApi.getBaseInfoFieldKeys(this.moduleName).forEach(key => {
          this.behindInfo[key] = null
        })
      }
    },
    /**
     * 默认对比分析
     * @returns {any}
     */
    defaultCompare () {
      const { previousTask = null, behindTask = null } = this.$route.params
      if (previousTask) {
        this.previousTaskId = (this.moduleName === 'node' ? previousTask.id : previousTask.taskId)
        this.previousInfo = {
          ...this.previousInfo,
          ...previousTask
        }
      }

      if (behindTask) {
        this.behindTaskId = (this.moduleName === 'node' ? behindTask.id : behindTask.taskId)
        this.behindInfo = {
          ...this.behindInfo,
          ...behindTask
        }
      }
    },
    exportCompare () {
      this.submit()
    },
    async submit () {
      try {
        this.loading = true
        this.messageBox = this.$message({
          dangerouslyUseHTMLString: true,
          customClass: 'loading-message-box',
          iconClass: 'el-icon-loading text-primary',
          duration: 0,
          message: '<span class="text-regular">导出中...</span>'
        })
        this.cancelToken = axios.CancelToken.source()
        let params = {
          projectId: this.project.id,
          loading: false
        }
        if (this.moduleName === 'node') {
          params = {
            ...params,
            previousNodeId: this.previousTaskId,
            behindNodeId: this.behindTaskId
          }
        } else {
          params = {
            ...params,
            previousTaskId: this.previousTaskId,
            behindTaskId: this.behindTaskId
          }
        }
        const response = await requestApi.exportCompareSBOM(this.moduleName, params, {
          cancelToken: this.cancelToken.token
        })

        await downloadBlobFile(response)
        this.messageBox.close()
        this.$message.success('导出成功')
      } catch (error) {
        this.messageBox.close()
        if (error && error.message) this.$message.error(error.message)
      } finally {
        this.loading = false
      }
    }

  },
  watch: {
    selectValue: {
      deep: true,
      handler (value) {
        if (value.previousTaskId && value.behindTaskId) {
          let params = {
            projectId: this.project.id,
            loading: false
          }
          if (this.moduleName === 'node') {
            params = {
              ...params,
              previousNodeId: this.previousTaskId,
              behindNodeId: this.behindTaskId
            }
          } else {
            params = {
              ...params,
              previousTaskId: this.previousTaskId,
              behindTaskId: this.behindTaskId
            }
          }
          requestApi.getCompareCount(this.moduleName, params).then(response => {
            this.tabs[0].label = `新增组件(${response.data.componentIncrCount || 0}个)`
            this.tabs[1].label = `减少组件(${response.data.componentDecrCount || 0}个)`
            this.tabs[2].label = `相同组件(${response.data.componentSameCount || 0}个)`
            this.tabs[3].label = `新增漏洞(${response.data.vulIncrCount || 0}个)`
            this.tabs[4].label = `减少漏洞(${response.data.vulDecrCount || 0}个)`
            this.tabs[5].label = `相同漏洞(${response.data.vulSameCount || 0}个)`
            this.tabs[6].label = `新增许可证(${response.data.licenseIncrCount || 0}个)`
            this.tabs[7].label = `减少许可证(${response.data.licenseDecrCount || 0}个)`
            this.tabs[8].label = `相同许可证(${response.data.licenseSameCount || 0}个)`
          }).catch(error => {
            if (typeof error === 'object') {
              this.$message.error(error.message)
            }
          })
        } else {
          this.tabs = [
            {
              label: '新增组件'
            },
            {
              label: '减少组件'
            },
            {
              label: '相同组件'
            },
            {
              label: '新增漏洞'
            },
            {
              label: '减少漏洞'
            },
            {
              label: '相同漏洞'
            },
            {
              label: '新增许可证'
            },
            {
              label: '减少许可证'
            },
            {
              label: '相同许可证'
            }]
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.table-select-option:not(.is-disabled):hover {
  color: $color-primary;
}
.search-select-input {
  :deep(.el-input__prefix) {
    display: flex;
    align-items: center;
  }
  :deep(.el-input__inner) {
    border-width: 0;
    border-bottom-width: 1px;
    border-color: #e5e6e7;
  }
  :deep(.el-input__inner:hover) {
    border-color: #e5e6e7 !important;
  }
  :deep(.el-input__inner:focus) {
    border-color: #e5e6e7 !important;
    box-shadow: none !important;
  }
}

.result-vs-wrapper {
  .vs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .vs-header-left {
      display: flex;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      align-items: center;
      .iconcijiyemianfanhuiicon5 {
        padding: 3px;
        font-size: 21px;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
        margin-left: -30px;
        margin-right: 10px;
        align-self: center;
        &:hover {
          color: $color-primary;
        }
      }
    }
  }
  .export-btn {
    text-align: right;
    padding-right: 24px;
    padding-bottom: 5px;
    padding-top: 5px;
    border-bottom: 1px solid #f0f0f0;
  }
  .el-drawer__title {
    flex-direction: row-reverse;
  }

  .app-name {
    font-size: 18px;
    font-weight: 700;
    color: #333;
  }

  :deep(.el-drawer__header ){
    margin-bottom: 0;
    padding: 10px 24px 0;
  }
  :deep(.el-drawer__body ){
    height: 100%;
    .drawer-content {
      padding: 24px;
      padding-top: 0;
      padding-bottom: 100px;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  :deep(.batch-no-wrapper) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;

    .txt-vs {
      padding: 0 30px;
      font-size: 20px;
      font-weight: 700;
      line-height: 25px;
      color: #DDD;
    }

    // .select-wrapper {
    //   flex: 1;
    //   padding: 14px 20px;
    //   background: #FFF;
    //   border-radius: 3px;
    //   box-shadow: 0 0 8px rgba(0, 75, 144, 13%);

    //   .el-select {
    //     width: 100%;
    //   }
    // }
  }

  :deep(.base-info-wrapper){
    margin-top: 30px;

    .box-header {
      position: relative;
      padding-left: 9px;
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      color: #333;

      &::after {
        position: absolute;
        top: 2px;
        left: 0;
        display: block;
        width: 3px;
        height: 16px;
        content: "";
        background: $color-primary;
      }
    }

    .table-body {
      margin-top: 15px;
      padding: 14px 20px;
      box-shadow: 0 0 8px rgba(0, 75, 144, 13%);

    }

    .box-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 15px;
      .info-wrapper {
        flex: 1;
        padding: 14px 20px;
        background: #FFF;
        border-radius: 3px;
        box-shadow: 0 0 8px rgba(0, 75, 144, 13%);
        .el-descriptions-item__container {
          padding-bottom: 8px;
          display: flex;
        }
      }
      .txt-vs {
        padding: 0 30px;
        font-size: 20px;
        font-weight: 700;
        line-height: 25px;
        color: #DDD;
      }
    }
  }

  .quality-flaw-wrapper {
    margin-top: 30px;

    .box-header {
      position: relative;
      padding-left: 9px;
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      color: #333;

      &::after {
        position: absolute;
        top: 2px;
        left: 0;
        display: block;
        width: 3px;
        height: 16px;
        content: "";
        background: #AD3393;
      }
    }

    .box-body {
      padding: 14px 20px;
      margin-top: 15px;
      background: #FFF;
      border-radius: 3px;
      box-shadow: 0 0 8px rgba(0, 75, 144, 13%);
    }
  }
}

</style>
