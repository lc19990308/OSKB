<template>
  <el-dialog
    title="许可证使用建议"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
      <div>
        <h4>1、简单宽松的协议</h4>
        <pre>
          如果你只想要一个简单点的协议不想太麻烦的话。
          MIT协议相对宽松但还是抓住了要点的。此协议允许别人以任何方式使用你的代码同时署名原作者，但原作者不承担代码使用后的风险，当然也没有技术支持的义务。jQuery和Rails就是MIT协议。
        </pre>
        <h4>2、考虑有专利的情况</h4>
        <pre>
          如果你的作品中涉及到专利相关。
          Apache协议也是个相对宽松与MIT类似的协议，但它简单指明了作品归属者对用户专利上的一些授权（我的理解是软件作品中含有专利，但它授权你可以免费使用）。Apache服务器，SVN还有NuGet等是使用的Apache协议。
        </pre>
        <h4>3、代码分享与促进</h4>
        <pre>
          如果你在乎作品的传播和别人的修改，希望别人也以相同的协议分享出来。
          GPL（ V2  或 V3  ）是一种版本自由的协议（可以参照copy right来理解，后者是版本保留，那copyleft便是版权自由，或者无版权，但无版权不代表你可以不遵守软件中声明的协议）。此协议要求代码分发者或者以此代码为基础开发出来的衍生作品需要以同样的协议来发布。此协议的版本3与版本2相近，只是多3中加了条对于不支持修改后代码运行的硬件的限制。
        </pre>
      </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="medium">关  闭</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'DialogUsageAdvice',
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

    // 关闭
    cancel () {
      this.dialogVisible = false
    },

    // 打开窗口时的回调
    open () {}
  }
}
</script>
