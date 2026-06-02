<template>
  <div class="wrap">
    <info-wrap
      v-if="licenseInfo.shortName"
      title="许可证信息">
      <info-row>
        <info-item label="许可证名称：" :span="24">
          <el-select
            size="small"
            v-model="licenseInfo.shortName"
            placeholder="请选择"
            @change="select"
          >
            <el-option
              v-for="item in selectOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </info-item>
      </info-row>
      <info-row>
        <info-item label="安全等级：" :span="12">
          <span class="level-tag danger" v-if="licenseInfo.securityLevel === 1">高风险</span>
          <span class="level-tag warning" v-else-if="licenseInfo.securityLevel === 2">中风险</span>
          <span class="level-tag info" v-else-if="licenseInfo.securityLevel === 3">低风险</span>
        </info-item>
        <info-item label="GPL兼容：" :span="12">{{ licenseInfo.gplCompatible === 0 ? '不兼容': '兼容' }}</info-item>
      </info-row>
      <info-row>
        <info-item label="链接：" :span="24">{{ licenseInfo.url || '-' }}</info-item>
      </info-row>
      <info-row>
        <info-item label="禁止使用：" :span="24">
        <span v-for="(item, index) in permissionList" :key="'per' + index">
          <el-tooltip effect="dark" :content="item.tooltip" placement="top-start">
          <span class="license-limitation">
              <span class="success"></span>{{ item.text }}</span>
          </el-tooltip>
        </span>
        </info-item>
      </info-row>
      <info-row>
        <info-item label="允许使用：" :span="24">
        <span v-for="(item, index) in limitationList" :key="'per' + index">
          <el-tooltip effect="dark" :content="item.tooltip" placement="top-start">
            <span class="license-limitation">
              <span class="success"></span>{{ item.text }}</span>
          </el-tooltip>
        </span>
        </info-item>
      </info-row>
      <info-row>
        <info-item label="条件使用：" :span="24">
        <span v-for="(item, index) in conditionList" :key="'per' + index">
          <el-tooltip effect="dark" :content="item.tooltip" placement="top-start">
            <span class="license-limitation">
              <span class="success"></span>{{ item.text }}</span>
          </el-tooltip>
        </span>
        </info-item>
      </info-row>
    </info-wrap>
    <h3
      class="headline"
      v-if="!licenseInfo.shortName"
    >许可证信息</h3>
    <div
      v-if="!licenseInfo.shortName"
      class="no-data">
      <img :src="nodata" alt="" />
      <div>暂无数据</div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'LicenseInfo',
  data () {
    return {
      nodata: require('@/assets/images/empty.png'),
      drawer: false,
      licenseInfo: {},
      defaultPermissionList: [
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
      defaultLimitationList: [
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
      defaultConditionList: [
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
      ]
    }
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    select (option) {
      this.list.forEach(item => {
        if (item.shortName === option) {
          this.licenseInfo = item
        }
      })
    }
  },
  computed: {
    permissionList () {
      return this.defaultPermissionList.filter(item => {
        return this.licenseInfo.permissionList && this.licenseInfo.permissionList.includes(item.value)
      })
    },

    limitationList () {
      return this.defaultLimitationList.filter(item => {
        return this.licenseInfo.limitationList && this.licenseInfo.limitationList.includes(item.value)
      })
    },

    conditionList () {
      return this.defaultConditionList.filter(item => {
        return this.licenseInfo.conditionList && this.licenseInfo.conditionList.includes(item.value)
      })
    },

    selectOptions () {
      return this.list.map(item => item.shortName)
    }
  },
  watch: {
    list (newVal) {
      if (newVal.length > 0) {
        this.licenseInfo = newVal[0]
      } else {
        this.licenseInfo = {}
      }
    }
  }
}
</script>
<style scoped lang="scss">
.license-limitation {
  margin-right: 50px;
}

.wrap {
  height: 320px;
  position: relative;

  .no-data {
    text-align: center;
    color: #b4bccc;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    height: 100px;

    img {
      width: 100px;
      margin-bottom: 3px;
    }
  }
}
</style>
