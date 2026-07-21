<template>
  <el-dialog
    title="免责声明"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    custom-class="disclaimer-dialog"
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
:deep(.disclaimer-dialog) {
  border: 1px solid rgba(153, 235, 226, 0.3);
  border-radius: 20px;
  overflow: hidden;
  background:
    linear-gradient(145deg, rgba(22, 112, 121, 0.76) 0%, rgba(7, 57, 69, 0.78) 100%),
    rgba(6, 45, 57, 0.68);
  backdrop-filter: blur(22px) saturate(120%);
  -webkit-backdrop-filter: blur(22px) saturate(120%);
  box-shadow: 0 30px 90px rgba(2, 24, 35, 0.38), inset 0 1px 0 rgba(224, 255, 251, 0.12);

  .el-dialog__header {
    background: rgba(5, 55, 68, 0.24);
    border-bottom: 1px solid rgba(173, 245, 238, 0.16);
  }

  .el-dialog__body {
    padding: 22px 24px 18px;
    background: transparent;
  }

  .el-dialog__footer {
    padding: 0 24px 22px;
    border-top: none;
    background: linear-gradient(180deg, transparent 0%, rgba(3, 42, 53, 0.16) 100%);
  }

  .el-button {
    color: #dcfffb;
    background: rgba(17, 132, 142, 0.2);
    border-color: rgba(159, 241, 233, 0.32);

    &:hover,
    &:focus {
      color: #ffffff;
      background: rgba(21, 150, 163, 0.42);
      border-color: rgba(194, 255, 249, 0.58);
    }
  }
}

pre {
  margin: 0;
  white-space: pre-line;
  color: rgba(222, 248, 245, 0.9);
  line-height: 1.85;
  font-size: 14px;
  font-family: "Microsoft YaHei", sans-serif;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 8px;

  .text-right {
    display: block;
    text-align: right;
    color: rgba(173, 229, 224, 0.8);
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(129, 225, 216, 0.44);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(197, 255, 249, 0.06);
  }
}
</style>
