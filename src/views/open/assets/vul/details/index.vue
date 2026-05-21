<template>
  <layout>
    <div class="view-content">
      <div class="headline p-b-5">
        <level-tag
          class="m-r-10"
          :level="appInfo.securityLevelId || 5"
        ></level-tag>
        {{ get(appInfo, "name", '漏洞名称') }}
        <el-button
          class="right"
          size="medium"
          type="primary"
          :disabled="!dicVulId"
          v-if="authorityFilter(1102)"
          @click="exportFile"
          >导出
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="details-box-item">
            <template v-if="appInfo.name || appInfo.securityLevelId">
              <span
                 class="p-t-15"
                 style="display: inline-block; color: #666; margin-left: -10px;"
               >漏洞编号</span
               >
              <ul class="details-box-item__desc">
                <li v-if="appInfo.xmirrorId">
                  <dot plain type="info">
                    {{ get(appInfo, 'xmirrorId')}}
                  </dot>
                </li>
                <li v-if="appInfo.cveId">
                  <dot plain type="info">
                    {{ appInfo.cveId }}
                  </dot>
                </li>
                <li v-if="appInfo.cnnvdId">
                  <dot plain type="info">
                    {{ appInfo.cnnvdId }}
                  </dot>
                </li>
                <li v-if="appInfo.cnvdId">
                  <dot plain type="info">
                    {{ get(appInfo, 'cnvdId') }}
                  </dot>
                </li>
                <li v-if="appInfo.cweId">
                  <dot plain type="info">
                    {{ appInfo.cweId }}
                  </dot>
                </li>
              </ul>
            </template>
            <empty v-else style="padding-top: 50px;"></empty>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="details-box-item scrollbar-custom">
            <info-wrap>
              <info-row>
                <info-item :label-width="80" label="漏洞类型：" :span="8">
                  {{get(appInfo, 'vulType', '其它')}}
                </info-item>
                <info-item :label-width="100" label="利用难度：" :span="8">
                  {{ appInfo.exploitLevel === 0 ? "困难" : appInfo.exploitLevel === 1 ? "容易" : "-" }}
                </info-item>
                <info-item :label-width="80" label="发布日期：" :span="8">{{
                    get(appInfo, "releaseDate", "-")
                  }}</info-item>
              </info-row>
              <info-row>
                <info-item label="漏洞描述：" :span="24">
                  <pre
                    v-clamp="{ clamp: 5, text: get(appInfo, 'description', '-')}"
                    style="
                      white-space: pre-line;
                      padding: 0;
                      margin: 0;
                      line-height: 25px;
"
                    v-html="get(appInfo, 'description', '-')"
                  ></pre>
                </info-item>
              </info-row>
              <info-row>
                <info-item label="修复建议：" :span="24">
                  <pre
                    v-clamp="{ clamp: 3, text: get(appInfo, 'suggestion', '-') }"
                    v-html="get(appInfo, 'suggestion', '-')"
                    style="
                      white-space: pre-line;
                      padding: 0;
                      margin: 0;
                      line-height: 25px;
"
                  ></pre>
                </info-item>
              </info-row>
            </info-wrap>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="height: 330px; box-sizing: border-box;">
            <div
              class="details-box-item"
              style="height: 160px; margin-bottom: 10px; padding: 0;"
            >
              <pie-chart
                :legend="true"
                :height="160"
                :center-label="'依赖路径数'"
                :chart-data="licenseLevelChart"
              ></pie-chart>
            </div>
            <div
              class="details-box-item"
              style="height: 160px; margin-bottom: 0; padding: 0;"
            >
              <row-bar-chart :data="barChartData" :height="160"></row-bar-chart>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-tabs ref="tabs" v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane
          v-for="(val, key) in tabs"
          :key="key"
          :label="val.label"
          :name="val.name"
        >
        </el-tab-pane>
      </el-tabs>
      <router-view v-if="dicVulId" />
      <empty v-else></empty>
    </div>
  </layout>
</template>
<script>
import { getVulDetail, vulListExcel } from '@/api/open/assets/vul'
import PieChart from '../../../../home/assets/module/details/PieChart'
import RowBarChart from '../../../../home/assets/module/details/RowBarChart'
import { awaitTo as to, get, isObject } from '@/utils'
import dot from '@/components/public/Dot'
import layout from '@/views/open/layout'
export default {
  name: 'vul-details',
  components: {
    dot,
    PieChart,
    RowBarChart,
    layout
  },
  data () {
    return {
      dicVulId: this.$route.query.dicVulId,
      token: this.$route.query.token,
      appInfo: {
        cveId: '',
        cnnvdId: '',
        cweId: '',
        ctime: '',
        description: '',
        suggestion: '',
        affectedComponentList: [],
        affectedProjectList: []
      },
      tabs: [
        {
          label: '影响组件（0个）',
          name: '/open/assets/vul/details/component'
        },
        {
          label: '影响应用（0个）',
          name: '/open/assets/vul/details/app'
        },
        {
          label: '影响项目（0个）',
          name: '/open/assets/vul/details/project'
        }
      ],
      barChartData: [
        {
          name: '影响组件',
          value: 30,
          color: '#8B5CF6'
        },
        {
          name: '影响应用',
          value: 20,
          color: '#8B5CF6'
        },
        {
          name: '影响项目',
          value: 10,
          color: '#8B5CF6'
        }
      ],
      licenseLevelChart: {
        data: [
          {
            value: 2,
            name: '间接依赖',
            color: '#35D09C'
          },
          {
            value: 2,
            name: '直接依赖',
            color: '#8B5CF6'
          }
        ],
        sum: 4
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
    // 导出文件
    async exportFile () {
      this.$popup({
        title: '导出',
        width: '550px',
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        center: false,
        content:
          '<div style="padding: 20px">导出所选漏洞，是否继续导出？</div>',
        beforeClose: async (action, next) => {
          if (action === 'confirm') {
            const [error, response] = await to(vulListExcel({
              dicVulIdList: [JSON.parse(this.dicVulId)]
            }, this.token))
            if (isObject(error)) {
              this.$message.error(error.message)
            } else {
              setTimeout(() => this.$popup({
                title: '提示',
                width: '550px',
                confirmButtonText: '去下载',
                cancelButtonText: '留在本页',
                center: false,
                render (h) {
                  return h('el-row', { class: 'font-base', style: { padding: '20px' } }, [
                    h('div', { class: 'm-b-15' }, ['操作成功，请在报告管理中下载报告~']),
                    h('div', {}, ['报告名称：', get(response, 'data.reportName', '--')])
                  ])
                },
                beforeClose: (action, next) => {
                  if (action === 'confirm') {
                    this.$router.push({ path: '/report/list' })
                  }
                  next()
                }
              }), 200)
            }
          }
          next()
        }
      })
    },

    handleClick (row) {
      this.$router.push({
        path: row.name,
        query: this.$route.query
      })
    },

    // 初始化详情
    initDetail () {
      getVulDetail({
        dicVulId: this.dicVulId,
        loading: false
      }, this.token)
        .then((response) => {
          this.appInfo = response.data
          this.licenseLevelChart = {
            data: [
              {
                value: this.get(this.appInfo, 'dataVulDependencyNumPie.directDependencyCount', 0),
                name: '间接依赖',
                color: '#35D09C'
              },
              {
                value: this.get(this.appInfo, 'dataVulDependencyNumPie.indirectDependencyCount', 0),
                name: '直接依赖',
                color: '#8B5CF6'
              }
            ],
            sum: this.get(this.appInfo, 'dataVulDependencyNumPie.totalCount', 0)
          }
          this.barChartData = [
            {
              name: '影响组件',
              value: this.get(this.appInfo, 'dataVulAffectedNumColumnChart.componentNum', 0),
              color: '#8B5CF6'
            },
            {
              name: '影响应用',
              value: this.get(this.appInfo, 'dataVulAffectedNumColumnChart.appNum', 0),
              color: '#8B5CF6'
            },
            {
              name: '影响项目',
              value: this.get(this.appInfo, 'dataVulAffectedNumColumnChart.projectNum', 0),
              color: '#8B5CF6'
            }
          ]
          this.tabs = [
            {
              label: `影响组件（${this.barChartData[0].value}个）`,
              name: '/open/assets/vul/details/component'
            },
            {
              label: `影响应用（${this.barChartData[1].value}个）`,
              name: '/open/assets/vul/details/app'
            },
            {
              label: `影响项目（${this.barChartData[2].value}个）`,
              name: '/open/assets/vul/details/project'
            }
          ]

          this.$nextTick(() => {
            this.$refs.tabs.calcPaneInstances(true)
          })
        })
        .catch((error) => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    }
  },
  mounted () {
    if (![null, '', undefined].includes(this.dicVulId)) {
      this.initDetail()
    }
  }
}
</script>
<style scoped lang="scss">
.details-box-item {
  border-radius: 3px;
  background: rgb(255, 255, 255);
  box-shadow: 0 2px 8px 0 rgba(43, 117, 183, 15%);
  height: 330px;
  padding: 0 20px;
  box-sizing: border-box;

  .details-box-item__desc {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f4;
      box-sizing: border-box;

      &::marker {
        color: rgb(153, 153, 153);
        font-size: 18px;
      }

      label {
        width: 100px;
        display: inline-block;
        color: #666;
      }
    }
  }

  :deep(.info-panel-item) {
    label {
      color: #666 !important;
    }
  }
}

.view-content {
  padding-bottom: 20px;

  .el-tabs {
    margin-top: 20px;
    padding-bottom: 5px;
  }

  .info-section {
    .el-col {
      margin-top: 0;
      margin-bottom: 10px;
      line-height: 34px;
      color: #666;

      .title {
        width: 120px;
        float: left;
        vertical-align: middle;
      }

      .content {
        margin-left: 120px;
        vertical-align: middle;
      }
    }
  }
}
</style>
