<template>
  <el-row :gutter="40">
    <el-col :span="18" :offset="3" v-if="licenseInfo.licenseDesc">
      <h3>许可证描述</h3>
      <pre>
        {{ licenseInfo.licenseDesc }}
      </pre>
    </el-col>
    <el-col :span="18" :offset="3" v-if="licenseInfo.licenseCondition">
      <h3>使用条件</h3>
      <p>{{ licenseInfo.licenseCondition }}</p>
    </el-col>
    <el-col :span="18" :offset="3" v-if="licenseInfo.licenseAllow">
      <h3>允许范围</h3>
      <p>{{ licenseInfo.licenseAllow }}</p>
    </el-col>
    <el-col :span="18" :offset="3" v-if="licenseInfo.licenseLimitations">
      <h3>局限性</h3>
      <p>{{ licenseInfo.licenseLimitations }}</p>
    </el-col>
  </el-row>
</template>
<script>

export default {
  name: 'license-details-content',
  components: {},
  data () {
    return {

    }
  },
  computed: {
    licenseInfo () {
      return this.$parent.licenseInfo
    }
  },
  methods: {

  }
}
</script>
<style scoped lang="scss">
  .el-row {
    padding-bottom: 30px;
  }

  pre {
    line-height: 2;
    white-space: pre-wrap;
  }

  p {
    line-height: 2;
    margin-left: 20px;
  }
</style>
