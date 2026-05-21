<template>
  <el-drawer :visible.sync="visible" size="750px" title="许可证详情">
    <div class="title" slot="title">许可证详情</div>
    <div style="padding: 20px;" v-loading="loading">
      <div class="first-title">
        <span class="level-tag danger" v-if="licenseInfo.securityLevel === 1">高风险</span>
        <span class="level-tag warning" v-else-if="licenseInfo.securityLevel === 2">中风险</span>
        <span class="level-tag info" v-else-if="licenseInfo.securityLevel === 3">低风险</span>
        <span class="name">{{ licenseInfo.shortName  || '-' }}</span>
      </div>
      <info-wrap :ellipsis="false">
        <info-row>
          <info-item :label-width="120" label="许可证全名" :span="24">{{ licenseInfo.longName  || '-' }}</info-item>
        </info-row>
        <info-row>
          <info-item :label-width="120" label="链接" :span="24">{{ licenseInfo.url || '-' }}</info-item>
        </info-row>
        <info-row>
          <info-item :label-width="120" label="是否兼容GPL" :span="24">{{ licenseInfo.gplCompatible === 0 ? '不兼容': '兼容' }}</info-item>
        </info-row>
        <info-row>
          <info-item :label-width="120" label="GPL兼容性说明" :span="24">
            {{get(licenseInfo, 'gplCompatibleDesc', '-')}}
          </info-item>
        </info-row>
        <info-row>
          <info-item :label-width="120" label="风险说明" :span="24">
            {{get(licenseInfo, 'securityDesc', '-')}}
          </info-item>
        </info-row>
        <info-row>
          <info-item :label-width="120" label="禁止使用" :span="24">
            <span v-for="(item, index) in permissionList" :key="'per' + index">
              <el-tooltip effect="dark" :content="item.tooltip" v-if="item.select" placement="top-start">
                <span class="m-r-20">
                  <i class="text-danger el-icon-error"></i>
                  {{ item.text }}
                </span>
              </el-tooltip>
            </span>
          </info-item>
        </info-row>
        <info-row>
          <info-item :label-width="120" label="允许使用" :span="24">
            <span v-for="(item, index) in limitationList" :key="'per' + index">
              <el-tooltip effect="dark"  v-if="item.select" :content="item.tooltip" placement="top-start">
                <span class="m-r-20">
                  <i class="text-success el-icon-success"></i> {{ item.text }}
                </span>
              </el-tooltip>
            </span>
          </info-item>
        </info-row>
        <info-row>
          <info-item :label-width="120" label="条件使用" :span="24">
            <span v-for="(item, index) in conditionList" :key="'per' + index">
              <el-tooltip effect="dark" :content="item.tooltip" v-if="item.select" placement="top-start">
                <span class="m-r-20">
                  <i class="text-primary el-icon-warning"></i> {{ item.text }}</span>
              </el-tooltip>
            </span>
          </info-item>
        </info-row>
        <info-row>
          <info-item :label-width="120" label="许可证内容" :span="24">
            <pre>{{get(licenseInfo, 'content', '-')}}</pre>
          </info-item>
        </info-row>
      </info-wrap>
    </div>
  </el-drawer>
</template>
<script>
import { licenseDetail } from '@/api/home/public/license'

export default {
  name: 'DetailsPopup',
  data () {
    return {
      visible: false,
      dicLicenseId: 17,
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
      licenseInfo: {},
      loading: false
    }
  },
  methods: {
    // 初始化许可证详情
    init (id) {
      this.licenseInfo = {}
      this.loading = true
      licenseDetail({
        id,
        loading: false
      }).then(response => {
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
        this.licenseInfo = {
          ...response.data,
          dicLicenseId: id
        }
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    open (id) {
      this.init(id)
      this.visible = true
    }
  }
}
</script>
<style scoped lang="scss">
pre {
  line-height: 2;
  white-space: pre-wrap;
}
.title {
  font-weight: 600;
  font-size: 18px;
  color: #333;

  .iconfont {
    font-size: 21px;
    margin-right: 5px;
    vertical-align: middle;
    font-weight: normal;
  }
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  border-bottom: 1px solid #e5e5e5;
  padding: 15px 20px;
}
:deep(.el-drawer__body) {
  overflow-y: auto;
}
</style>
