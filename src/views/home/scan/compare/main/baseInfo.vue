<template>
  <div class="info-wrapper">
    <el-descriptions :column="1">
      <el-descriptions-item label="大小：" v-if="baseInfo.hasOwnProperty('byteSize')">{{baseInfo.byteSize | byteSize}}</el-descriptions-item>
      <el-descriptions-item label="上传时间：" v-if="baseInfo.hasOwnProperty('uploadDate')">
        {{ baseInfo.uploadDate || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="开始检测：" v-if="baseInfo.hasOwnProperty('startDate')">
        {{ baseInfo.startDate || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="检测完成：" v-if="baseInfo.hasOwnProperty('finishDate')">{{baseInfo.finishDate || '-'}}</el-descriptions-item>
      <el-descriptions-item label="检测时长：" v-if="baseInfo.hasOwnProperty('detectDuration')">{{baseInfo.detectDuration  || '-'}}</el-descriptions-item>
      <el-descriptions-item label="安装时间：" v-if="baseInfo.hasOwnProperty('installTime')">{{baseInfo.installTime  || '-'}}</el-descriptions-item>
      <el-descriptions-item label="检测规则：" v-if="baseInfo.hasOwnProperty('checkType')">
        <el-link :underline="false" v-if="baseInfo.status !== null && baseInfo.status > -1">
              {{ baseInfo.checkType === 0 ? '快速审查；' : baseInfo.checkType === 1 ? '深度审查；' : '' }}
              {{ baseInfo.deepLimit > -1 ? baseInfo.deepLimit + '层解析；' : '默认层级；' }}
              {{ baseInfo.cleanLevel === 1 ? '快速清洗' : baseInfo.cleanLevel === 2 ? '深度清洗' : '' }}
            </el-link>
            <template v-else>-</template>
      </el-descriptions-item>
      <el-descriptions-item label="漏洞：" v-if="hasVulNum">
        <level-group :value="[
          vulNum.serious,
          vulNum.high,
          vulNum.medium,
          vulNum.low,
        ]" v-if="vulNum"/>
          <span v-else>-</span>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script>
export default {
  name: 'baseInfo',
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    },
    moduleName: {
      type: String,
      default: 'component'
    }
  },
  computed: {
    vulNum () {
      const keys = Object.keys(this.baseInfo)
      if (keys.includes('vulNum') || keys.includes('vulNumVO')) {
        return (this.baseInfo.vulNum || this.baseInfo.vulNumVO)
      }
      return null
    },
    hasVulNum () {
      const keys = Object.keys(this.baseInfo)
      if (keys.includes('vulNum') || keys.includes('vulNumVO')) {
        return true
      }
      return false
    }
  }
}
</script>
<style scoped lang="scss">
.info-wrapper {
  flex: 1;
  padding: 14px 20px;
  background: #FFF;
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(0, 75, 144, 13%);
  .el-descriptions-item__container {
    display: flex;
  }
}
</style>
