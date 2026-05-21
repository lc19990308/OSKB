<template>
  <div class="view-content">
    <panel v-loading="loading">
      <div slot="header">
        自定义扩展配置
      </div>
      <code-mirror v-model="textarea" class="codemirror" :mode="'application/javascript'"></code-mirror>
      <div slot="footer">
        <el-button size="medium" type="primary" class="w-90">保  存</el-button>
      </div>
    </panel>
  </div>
</template>
<script>
import CodeMirror from '@/components/public/CodeMirror'

export default {
  name: 'parse',
  components: {
    CodeMirror
  },
  data () {
    return {
      textarea: '{\n' +
          '  "deep": 4,  //解析深度\n' +
          '  "data_clean": false,   //数据清理开关 true\\false\n' +
          '  "log": false ,   //日志开关 true\\false\n' +
          '  "check_oss": true ,  //组件检测开关   true\\false\n' +
          '  "check_license": true ,  //许可证检测开关   true\\false\n' +
          '  "white_list": true ,  //白名单检测开关   true\\false\n' +
          '  "black_list": true ,  //黑名单检测开关   true\\false\n' +
          '  "ignore_high": false,  //忽略高危开关   true\\false\n' +
          '  "ignore_middle": false,  //忽略中危开关   true\\false\n' +
          '  "ignore_low": false,  //忽略低危开关   true\\false\n' +
          '}'
    }
  },
  methods: {
    save () {
      this.$message.success('操作成功！')
    }
  },
  mounted () {}
}
</script>
<style scoped lang="scss">
.codemirror {
  border-radius: 3px;
  border: 1px solid #dcdee0;
  line-height: 1.4;
  font-size: 13px;
  height: 300px;
}
</style>
