<template>
  <el-drawer class="drawer-vul" title="组件版本详情" :visible.sync="drawer" :size="'1100px'" :direction="direction"
    @open="open" :before-close="handleClose">
    <dialog-generate-report ref="report"></dialog-generate-report>
    <el-scrollbar class="drawer-body-scrollbar hide-x">
      <div class="drawer-body">
        <h4 class="vul-title">
          <i class="iconfont iconcomponent"></i>{{ data.projectName || '-' }}<i class="iconfont iconfengefu divide-icon" v-if="version"></i>
          <!-- <level-tag :level="data.securityLevel"></level-tag> -->
          <span class="version">{{ version }}</span>
        </h4>
        <el-row>
          <el-col :span="14">
            <div class="vul-info">
              <div class="vul-item">
                <div>
                  <span class="vul-item-label">
                    许可证：
                  </span>
                  <div class="vul-item-content">
                    {{ data.licenseName || '-' }}
                  </div>
                </div>
              </div>
              <div class="vul-item">
                <div>
                  <span class="vul-item-label">
                    发布厂商：
                  </span>
                  <div class="vul-item-content">
                    {{ data.vendor || '-' }}
                  </div>
                </div>
              </div>
              <div class="vul-item">
                <div>
                  <span class="vul-item-label">
                    推荐指数：
                  </span>
                  <div class="vul-item-content">
                    <el-rate v-model="data.recommendNum" disabled text-color="#faad14"></el-rate>
                  </div>
                </div>
              </div>
              <div class="vul-item">
                <div>
                  <span class="vul-item-label">
                    发布日期：
                  </span>
                  <div class="vul-item-content">
                    {{ data.updateTime || '-' }}
                  </div>
                </div>

              </div>
              <!--              <div class="vul-item">-->
              <!--                <div>-->
              <!--                  <span class="vul-item-label">-->
              <!--                    组件官网：-->
              <!--                  </span>-->
              <!--                  <div class="vul-item-content">-->
              <!--                    {{ data.xmirrorId || '-' }}-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--              </div>-->
              <!--              <div class="vul-item">-->
              <!--                <div>-->
              <!--                  <span class="vul-item-label">-->
              <!--                    版本链接：-->
              <!--                  </span>-->
              <!--                  <div class="vul-item-content">-->
              <!--                    {{ data.xmirrorId || '-' }}-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--              </div>-->
            </div>
          </el-col>
          <el-col :span="10">
            <vul-chart :percentage="'1:0.453'" :chart-data="chartData"></vul-chart>
          </el-col>
        </el-row>
        <vul-list ref="vulList" :id="id" :packageManager="packageManager"></vul-list>
      </div>
    </el-scrollbar>
    <div class="footer-drawer">
      <el-button plain type="primary" size="small" class="close-btn" @click="exportHandler"> <i class="iconfont icondaochu"></i> 导出</el-button>
      <el-button plain type="primary" size="small" class="close-btn" @click="generateReportHandler"> <i class="iconfont iconshengchengbaogao"></i> 生成报告</el-button>
    </div>
  </el-drawer>
</template>
<script>
import {
  componentDetail, exportExcel
} from '@/api/home/search'

import VulList from './Vul/index.vue'
import VulChart from './VulChart/index.vue'
import { downloadBlobFile } from '@/utils'
import DialogGenerateReport from '@/views/home/search/details/component/dialogGenerateReport.vue'

export default {
  name: 'DrawerVulDetail',
  components: {
    DialogGenerateReport,
    VulList,
    VulChart
  },
  data () {
    return {
      drawer: false,
      direction: 'rtl',
      packageManager: null,
      id: null,
      version: null,
      data: {},
      chartData: {
        data: [{
          value: 0,
          name: '严重漏洞',
          color: '#8B1A1A',
          key: 'serious'
        },
        {
          value: 0,
          name: '高危漏洞',
          color: '#D9534F',
          key: 'high'
        },
        {
          value: 0,
          name: '中危漏洞',
          color: '#D4932A',
          key: 'medium'
        },
        {
          value: 0,
          name: '低危漏洞',
          color: '#1a78cf',
          key: 'low'
        }
        ],
        sum: 0
      },
      levelDict: ['无漏洞', '严重', '高危', '中危', '低危', '无漏洞']
    }
  },
  methods: {
    // 生成报告
    generateReportHandler () {
      this.$refs.report.dialogVisible = true
      this.$refs.report.row = {
        id: this.id,
        packageManager: this.packageManager
      }
    },
    /**
     * @name 导出
     * @return {void}
     */
    async exportHandler () {
      try {
        const result = await exportExcel({
          id: this.id,
          packageManager: this.packageManager
        })
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    handleClose (done) {
      this.data = {}
      done()
    },

    // 初始化详情
    initDetail () {
      componentDetail({
        id: this.id,
        packageManager: this.packageManager
      }).then(response => {
        this.data = response.data
        this.data.vulNumVO = this.data.vulNumVO ? this.data.vulNumVO : {}
        this.chartData.data.forEach(item => {
          if (Object.hasOwnProperty.call(this.data.vulNumVO, item.key)) {
            item.value = this.data.vulNumVO[item.key]
          }
        })
        if (this.data.securityLevel) {
          this.chartData.sum = this.levelDict[this.data.securityLevel]
        }
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 打开窗口时的回调
    open () {
      this.$nextTick(() => {
        this.initDetail()
        this.$refs.vulList.search()
      })
    }
  }
}

</script>
<style scoped lang="scss">
  .drawer-vul {
    :deep(.el-drawer__header) {
      background: #2C5F8A;
      color: #fff;
      font-size: 16px;
      padding: 15px 20px;
      margin-bottom: 0;
    }

    :deep(.el-drawer__body) {
      height: calc(100% - 58px);
    }

    .drawer-body-scrollbar {
      height: calc(100% - 51px);

      .drawer-body {
        padding: 20px;

        .vul-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 20px;
          vertical-align: middle;

          .iconfont {
            font-size: 20px;
            color: #2C5F8A;
            vertical-align: middle;
            margin-right: 10px;
            font-weight: 500;
          }

          .version {
            color: #333;
            font-weight: 500;
            font-size: 18px;
          }
        }

        .vul-item {
          border-bottom: 1px solid #edeff2;
          padding: 15px;
          display: flex;

          div {
            flex: 1;
            display: flex;

            .vul-item-label {
              display: block;
              width: 85px;
              color: #666;
            }

            .vul-item-content {
              flex: 1;
              color: #333;
            }
          }
        }
      }
    }

    .footer-drawer {
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      text-align: center;
      padding-bottom: 10px;
    }

    .close-btn {
      width: 200px;
      background-color: transparent;
      height: 30px;

      &:active,
      &:focus {
        color: #2C5F8A;
      }

      &:hover {
        background-color: #2C5F8A;
      }
    }
  }

  .divide-icon {
    font-size: 12px !important;
    color: #999 !important;
    padding: 0 5px 0 20px;
  }

  //滚动条样式
  :deep(.el-scrollbar__thumb) {
    background-color: #bfbfbf;
  }

  :deep(.el-scrollbar__bar) {
    width: 10px;
  }

</style>
