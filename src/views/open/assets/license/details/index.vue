<template>
  <layout-open>
    <div class="view-content">
      <info-wrap title="基本信息">
        <info-row>
          <info-item label="许可证名称：" :span="24">{{ licenseInfo.shortName || '-' }}</info-item>
        </info-row>
        <info-row>
          <info-item :label-width="120" label="许可证全名：" :span="8">
            {{licenseInfo.longName || licenseInfo.shortName || '-' }}
          </info-item>
          <info-item label="安全等级：" :label-width="120" :span="8">
            <span class="level-tag danger" v-if="licenseInfo.securityLevel === 1">高风险</span>
            <span class="level-tag warning" v-else-if="licenseInfo.securityLevel === 2">中风险</span>
            <span class="level-tag info" v-else-if="licenseInfo.securityLevel === 3">低风险</span>
            <span v-else>-</span>
          </info-item>
          <info-item :label-width="120" label="GPL兼容：" :span="8">{{ licenseInfo.gplCompatible === 0 ? '不兼容': '兼容'
            }}</info-item>
        </info-row>

        <info-row>
          <info-item :label-width="120" label="许可证链接：" :span="24">
            <template v-if="licenseInfo.url === '未知'">未知</template>
            <el-link v-else-if="licenseInfo.url " type="primary" :href="licenseInfo.url" target="_blank">
              {{licenseInfo.url }}
            </el-link>
            <template v-else>-</template>
          </info-item>
        </info-row>

        <info-row >
          <info-item :label-width="120" :no-ellipsis="false" label="GPL兼容性说明：" :span="24">
            {{licenseInfo.gplCompatibleDesc || '-'}}
          </info-item>
        </info-row>

        <info-row >
          <info-item :label-width="120" :no-ellipsis="false" label="风险说明：" :span="24">
            {{licenseInfo.securityDesc || '-'}}
          </info-item>
        </info-row>

        <info-row >
          <info-item :label-width="120" :no-ellipsis="false" label="摘要：" :span="24">
            <template v-if="licenseInfo.content">
              <div v-clamp="clampConfig">
                {{licenseInfo.content || '-'}}
              </div>
            </template>
            <template v-else>-</template>
          </info-item>
        </info-row>

      </info-wrap>
      <info-wrap title="许可授权">
        <el-row type="flex" :gutter="20" style="align-items: stretch;">
          <el-col :span="12">
            <div class="box-item">
              <p style="font-size: 16px;font-weight: bold;padding: 0;margin: 0 0 16px 0;">
                为了合理使用该许可证下的代码，您的义务是
              </p>
              <el-row type="flex" style="align-items: stretch;flex: 1;" :gutter="20">
                <el-col :span="12">
                  <div style="display: flex;flex-direction: column;" class="h-full">
                    <div style="text-align: center;font-size: 16px;line-height: 34px;color: white;background: #f64e60;">
                      必须
                    </div>
                    <div style="flex: 1;padding: 20px;border: 1px solid #f0f0f0;border-top: none;min-height: 370px;">
                      <template v-if="licenseInfo.licenseMust">
                        <div style="margin-bottom: 16px;" v-for="(value, key, index) in licenseInfo.licenseMust" :key="key">
                          <div style="font-size: 14px;margin-bottom: 8px;">{{index + 1}}、{{key}}</div>
                          <div style="font-size: 12px;padding-left: 22px;line-height: 20px;color: rgba(0, 0, 0, 0.65);">
                            {{value}}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div style="display: flex;flex-direction: column;" class="h-full">
                    <div style="text-align: center;font-size: 16px;line-height: 34px;color: white;background: #50cd89;">
                      无需
                    </div>
                    <div style="flex: 1;padding: 20px;border: 1px solid #f0f0f0;border-top: none;min-height: 370px;">
                      <template v-if="licenseInfo.licenseCanNot">
                        <div style="margin-bottom: 16px;" v-for="(value, key, index) in licenseInfo.licenseCanNot" :key="key">
                          <div style="font-size: 14px;margin-bottom: 8px;">{{index + 1}}、{{key}}</div>
                          <div style="font-size: 12px;padding-left: 22px;line-height: 20px;color: rgba(0, 0, 0, 0.65);">
                            {{value}}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="box-item">
              <p style="font-size: 16px;font-weight: bold;padding: 0;margin: 0 0 16px 0;">
                该许可证授予您的权利是
              </p>
              <el-row type="flex" style="align-items: stretch;flex: 1;" :gutter="20">
                <el-col :span="12">
                  <div  style="display: flex;flex-direction: column;" class="h-full">
                    <div style="text-align: center;font-size: 16px;line-height: 34px;color: white; background: #50cd89;">
                      允许
                    </div>
                    <div style="flex:1;padding: 20px;border: 1px solid #f0f0f0;border-top: none;min-height: 370px;">
                      <template v-if="licenseInfo.licenseCan">
                        <div style="margin-bottom: 16px;" v-for="(value, key, index) in licenseInfo.licenseCan" :key="key">
                          <div style="font-size: 14px;margin-bottom: 8px;">{{index + 1}}、{{key}}</div>
                          <div style="font-size: 12px;padding-left: 22px;line-height: 20px;color: rgba(0, 0, 0, 0.65);">
                            {{value}}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div style="display: flex;flex-direction: column;" class="h-full">
                    <div style="text-align: center;font-size: 16px;line-height: 34px;color: white; background: #f64e60;">
                      禁止
                    </div>
                    <div style="flex:1;padding: 20px;border: 1px solid #f0f0f0;border-top: none;min-height: 370px;">
                      <template v-if="licenseInfo.licenseMustNot">
                        <div style="margin-bottom: 16px;" v-for="(value, key, index) in licenseInfo.licenseMustNot"
                             :key="key">
                          <div style="font-size: 14px;margin-bottom: 8px;">{{index + 1}}、{{key}}</div>
                          <div style="font-size: 12px;padding-left: 22px;line-height: 20px;color: rgba(0, 0, 0, 0.65);">
                            {{value}}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </info-wrap>
      <StickyContent
        :sticky-top="45"
      >
        <el-tabs ref="tabs" v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane
            v-for="val in tabs"
            :key="val.name"
            :label="val.label"
            :name="val.name"
          >
          </el-tab-pane>
        </el-tabs>
      </StickyContent>
      <router-view :licenseInfo="licenseInfo" />
    </div>
  </layout-open>
</template>
<script>
import { licenseDetail } from '@/api/open/assets/license'
import StickyContent from '@/components/public/StickyContent/index.vue'
import LayoutOpen from '@/views/open/layout'

export default {
  name: 'license-details',
  components: {
    LayoutOpen,
    StickyContent
  },
  computed: {
    clampConfig () {
      return {
        text: this.licenseInfo.content,
        clamp: 5,
        collapse: true,
        collapseBeforeSuffixHTML: '...<span class="text-primary m-l-5">展开</span><i class="el-icon-arrow-down text-primary"></i>',
        collapseAfterSuffixHTML: '<span class="text-primary m-l-5">收起</span><i class="el-icon-arrow-up text-primary"></i>'
      }
    }
  },
  data () {
    return {
      permissionList: [
        {
          text: '责任',
          value: 1,
          tooltip: '本许可证包括责任限制。',
          select: false
        },
        {
          text: '担保',
          value: 2,
          tooltip: '许可证明确声明它不提供任何保证。',
          select: false
        },
        {
          text: '商标使用',
          value: 3,
          tooltip: '本许可证明确声明不授予商标权，即使没有此类声明的许可证可能不会授予任何隐含的商标权。',
          select: false
        },
        {
          text: '专利使用',
          value: 4,
          tooltip: '本许可证明确不授予专利权。',
          select: false
        }
      ],
      limitationList: [
        {
          text: '商业使用',
          value: 1,
          tooltip: '此软件及衍生产品可用于商业用途。',
          select: false
        },
        {
          text: '分发',
          value: 2,
          tooltip: '此软件允许被分发。',
          select: false
        },
        {
          text: '修改',
          value: 3,
          tooltip: '此软件允许被修改。',
          select: false
        },
        {
          text: '私人使用',
          value: 4,
          tooltip: '此软件可以私下使用和修改。',
          select: false
        },
        {
          text: '专利使用',
          value: 5,
          tooltip: '本许可证提供了贡献者对专利权的明确授予。',
          select: false
        }
      ],
      conditionList: [
        {
          text: '许可证和版权声明',
          value: 1,
          tooltip: '许可证和版权声明的副本必须包含在软件中。',
          select: false
        },
        {
          text: '许可证和版权声明（源码）',
          value: 2,
          tooltip: '许可证和版权声明的副本必须包含在源代码形式的软件中，但二进制文件不需要。',
          select: false
        },
        {
          text: '公开代码',
          value: 3,
          tooltip: '软件分发时必须提供源代码。',
          select: false
        },
        {
          text: '状态更改',
          value: 4,
          tooltip: '对代码所做的更改必须记录在案。',
          select: false
        },
        {
          text: '网络使用分发',
          value: 5,
          tooltip: '通过网络与软件交互的用户有权接收源代码的副本。',
          select: false
        },
        {
          text: '相似许可证',
          value: 6,
          tooltip: '分发软件时，必须在同一许可证下发布修改。在某些情况下，可以使用类似或相关的许可证。',
          select: false
        },
        {
          text: '相似许可证（原项目被修改的代码）',
          value: 7,
          tooltip: '在分发软件时，必须在同一许可下发布现有文件的修改。在某些情况下，可以使用类似或相关的许可证。',
          select: false
        },
        {
          text: '相似许可证（非链接库）',
          value: 8,
          tooltip: '非用作库分发软件时，必须在同一许可证下发布修改。在某些情况下，可能会使用类似或相关的许可证，或者将软件用作库使用不作要求。',
          select: false
        }
      ],
      id: this.$route.query.id,
      token: this.$route.query.token,
      activeTab: this.$route.path,
      licenseInfo: {},
      tabs: [
        {
          label: '对应组件',
          name: '/open/assets/license/details/component'
        }
      ],
      tabs2: [
        // {
        //   label: '许可证介绍',
        //   name: '/open/assets/license/details/intro'
        // },
        {
          label: '许可证内容',
          name: '/open/assets/license/details/content'
        }
      ]
    }
  },
  methods: {
    handleClick (row) {
      this.$router.push({
        path: row.name,
        query: this.$route.query
      })
    },

    // 初始化证书详情详情
    initDetail () {
      licenseDetail({
        id: this.id,
        loading: false
      }, this.token).then(response => {
        this.licenseInfo = response.data
        const data = response.data
        if (data.conditionList && data.conditionList.length > 0) {
          this.conditionList.forEach(item => {
            if (data.conditionList.includes(item.value)) {
              item.select = true
            }
            if (!data.conditionList.includes(item.value)) {
              item.select = false
            }
          })
        }
        if (data.limitationList && data.limitationList.length > 0) {
          this.limitationList.forEach(item => {
            if (data.limitationList.includes(item.value)) {
              item.select = true
            }
            if (!data.limitationList.includes(item.value)) {
              item.select = false
            }
          })
        }
        if (data.permissionList && data.permissionList.length > 0) {
          this.permissionList.forEach(item => {
            if (data.permissionList.includes(item.value)) {
              item.select = true
            }
            if (!data.permissionList.includes(item.value)) {
              item.select = false
            }
          })
        }
        if (this.licenseInfo.type !== '自研') {
          this.tabs = this.tabs.concat(this.tabs2)
        }

        this.$refs.tabs.calcPaneInstances(true)
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  mounted () {
    if (![null, '', undefined].includes(this.id)) {
      this.initDetail()
    }
  }
}
</script>
<style scoped lang="scss">
.box-item {
  border: 1px solid #f0f0f0;
  box-sizing: border-box;
  padding: 20px;
  height: 100%;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
}
.view-content {
  padding-bottom: 10px;

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
