<template>
  <div>
    <div class="view-content">
      <info-wrap title="基本信息">
        <info-row>
          <info-item label="许可证名称：" :span="8">{{ licenseInfo.shortName || '-' }}</info-item>
          <info-item label="安全等级：" :span="8">
            <span class="level-tag danger" v-if="licenseInfo.securityLevel === 1">高风险</span>
            <span class="level-tag warning" v-else-if="licenseInfo.securityLevel === 2">中风险</span>
            <span class="level-tag info" v-else-if="licenseInfo.securityLevel === 3">低风险</span>
          </info-item>
          <info-item label="GPL兼容：" :span="8">{{ licenseInfo.gplCompatible === 0 ? '不兼容': '兼容' }}</info-item>
        </info-row>
        <info-row>
          <info-item label="OSI认证：" :span="8">
            <i :class="licenseInfo.isOsi === 1 ? 'el-icon-check' : 'el-icon-close'"></i>
          </info-item>
          <info-item label="FSF认证：" :span="8">
            <i :class="licenseInfo.isFsf === 1 ? 'el-icon-check' : 'el-icon-close'"></i>
          </info-item>
        </info-row>
        <info-row>
          <info-item label="链接：" :span="24">{{ licenseInfo.url || '-' }}</info-item>
        </info-row>
        <info-row>
          <info-item label="禁止使用：" :span="24">
            <span v-for="(item, index) in permissionList" :key="'per' + index">
              <el-tooltip effect="dark" :content="item.tooltip" v-show="item.select" placement="top-start">
                <span class="license-permission">
                  <span :class="{'success':item.select}"></span>{{ item.text }}</span>
              </el-tooltip>
            </span>
          </info-item>
        </info-row>
        <info-row>
          <info-item label="允许使用：" :span="24">
            <span v-for="(item, index) in limitationList" :key="'per' + index">
              <el-tooltip effect="dark" :content="item.tooltip" placement="top-start">
                <span class="license-limitation" v-show="item.select">
                  <span :class="{'success':item.select}"></span>{{ item.text }}</span>
              </el-tooltip>
            </span>
          </info-item>
        </info-row>
        <info-row>
          <info-item label="条件使用：" :span="24">
            <span v-for="(item, index) in conditionList" :key="'per' + index">
              <el-tooltip effect="dark" :content="item.tooltip" v-show="item.select" placement="top-start">
                <span class="license-condition">
                  <span :class="{'success':item.select}"></span>{{ item.text }}</span>
              </el-tooltip>
            </span>
          </info-item>
        </info-row>
      </info-wrap>
      <StickyContent
        :sticky-top="45"
      >
        <el-tabs ref="tabs" v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane
            v-for="(val, key) in tabs"
            :key="key"
            :label="val.label"
            :name="val.name"
          >
          </el-tab-pane>
        </el-tabs>
      </StickyContent>
      <router-view />
    </div>
  </div>
</template>
<script>
import { licenseDetail } from '@/api/home/public/license'
import StickyContent from '@/components/public/StickyContent/index.vue'

export default {
  name: 'license-details',
  components: {
    StickyContent
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
      appPackageId: this.$route.query.appPackage,
      project: this.$store.state.home.project,
      id: this.$route.query.id,
      activeTab: this.$route.path,
      licenseInfo: {},
      tabs: [
        {
          label: '对应组件',
          name: '/assets/license/details/component'
        }
      ],
      tabs2: [
        // {
        //   label: '许可证介绍',
        //   name: '/assets/license/details/intro'
        // },
        {
          label: '许可证内容',
          name: '/assets/license/details/content'
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
        // projectId: this.project.id,
        loading: false
      }).then(response => {
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
    },

    //  返回
    back () {
      this.$router.push({
        name: 'AssetsLicenseList',
        params: {
          back: 1
        }
      })
    }
  },
  mounted () {
    if (this.id !== null && this.project) {
      this.initDetail()
    }
  }
}
</script>
<style scoped lang="scss">
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
