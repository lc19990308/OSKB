<template>
  <el-dialog
    title="免责声明"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <pre>
      总则
      用户在接受服务之前，请务必仔细阅读本条款并同意声明。
      用户直接或通过各种方式（包括API引用等）间接使用此服务和数据的行为，都将被视作已无条件接受本声明所涉全部内容。
      若用户对本声明的任何条款有异议，请停止使用其所提供的全部服务。

      用户使用此服务的过程中，不得以任何方式利用其直接或间接从事违反中国法律、中国网络安全法的行为，且用户应当恪守下述承诺：
      1、仅用其为用户企业自主研发的软件提供安全测试和风险检测服务；
      2、若使用其为第三方用户企业提供安全测试和风险检测服务，需征得第三方用户企业的官方授权；
      3、不得利用其在未经授权时擅自对其他企业或机关单位等进行漏洞扫描活动；
      4、不得利用其扰乱、损害当地网络安全秩序；

      注意
      1、若用户违反上述承诺，本公司有权举报并移交司法机关处理。
      2、若用户违反上述承诺，本公司有权终止为您提供服务。
      3、若用户违反国家法律规定，该用户将承担全部法律及连带责任，本公司不承担任何法律责任及连带责任。

      附则
      对免责声明的解释、修改及更新权均属于本公司。

      <span class="text-right">2019年8月10日</span>
    </pre>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="medium">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'DialogDisclaimer',
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
    },

    // 取消
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
  pre {
    white-space: pre-line;

    .text-right {
      display: block;
      text-align: right;
    }
  }
</style>
