<template>
  <el-row :gutter="40">
    <el-col :span="18" :offset="3">
      <div class="no-data" v-if="licenseInfo.content=='暂无内容'">
        <img :src="nodata" />
        <div>暂无数据</div>
      </div>
      <div v-else>
        <h3>许可证内容</h3>
        <pre>
          {{ licenseInfo.content }}
        </pre>
      </div>
    </el-col>
  </el-row>
</template>
<script>

export default {
  name: 'license-details-content',
  components: {},
  data () {
    return {
      nodata: require('@/assets/images/icon-no-data.png')
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
  pre {
    line-height: 2;
    white-space: pre-wrap;
  }

  .no-data {
    width: 100%;
    height: 42vh;
    text-align: center;
    color: #b4bccc;
    top: 50%;

    img {
      width: 100px;
      margin-top: 14vh;
      margin-bottom: 3px;
    }
  }

</style>
