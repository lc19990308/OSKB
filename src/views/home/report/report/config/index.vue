<template>
  <div class="view-content">
    <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'">
      <div class="clearfix">
        <el-button size="medium" type="primary" @click="back">
          返回
        </el-button>
        <el-button size="medium" type="primary">
          保存
        </el-button>
        <el-button size="medium" type="primary">
          恢复默认
        </el-button>
      </div>
    </sticky>
    <el-form ref="ruleForm" label-width="200px" class="conf-form">
      <el-form-item label="报告名称设置：">
        <el-input type="text" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="logo设置：">
        <select-image :limit="1" :accept="'.png'"></select-image>
        <span class="hint">请上传.png格式图片，推荐尺寸200*88像素。</span>
      </el-form-item>
      <el-form-item label="效果预览：">
        <div class="report-bg">
          <img src="" class="report-logo" id="report-logo" alt="">
          <p class="report-name ng-binding">OSS</p>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import SelectImage from '@/components/public/SelectImage/index.vue'
import Sticky from '@/components/public/Sticky/index.vue'
import reportBg from '@/assets/images/report_bg.jpg'

export default {
  name: 'reportConf',
  components: {
    SelectImage,
    Sticky
  },
  data () {
    return {
      reportBg,
      filelist: []
    }
  },
  methods: {
    back () {
      this.$router.push({
        path: '/report/list'
      })
    }
  },
  mounted () {}
}
</script>
<style scoped lang="scss">
.conf-form {
  margin-top: 30px;
  max-width: 1000px;

  .hint {
    vertical-align: bottom;
    display: inline-block;
    margin-bottom: 30px;
    margin-left: 30px;
    color: #999;
  }

  .report-bg {
    width: 300px;
    height: 423px;
    background-image: url(~@/assets/images/report_bg.jpg);
    background-size: 100% auto;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;

    .report-logo {
      position: absolute;
      max-height: 50px;
      max-width: 124px;
      top: 324px;
      left: 34px;
    }

    .report-name {
      display: block;
      color: #fff;
      top: 288px;
      position: absolute;
      left: 30px;
    }
  }
}
</style>
