<script>
import { debounce, isVNode } from '@/utils'
export default {
  name: 'QueryBox',
  props: {
    labelWidth: {
      type: Number,
      default: 80
    },
    defaultRowNum: {
      type: Number,
      default: 4
    }
  },
  data(){
    return {
      collapse: false,
      row: 4
    }
  },
  mounted () {
    this.row = this.defaultRowNum
    const resize = debounce(() => {

      const width = document.documentElement.clientWidth

      switch (true) {
        case (width < 1500):
          this.row = this.defaultRowNum - 1
          break;
        default:
          this.row = this.defaultRowNum
          break;
      }
    })

    resize()

    addEventListener('resize', resize)

    this.$once("hook:beforeDestroy", () => {
      removeEventListener('resize', resize)
    });

  },
  render () {
    const defaults =  this.$scopedSlots.default && this.$scopedSlots.default().filter(node => isVNode(node) && node.componentOptions?.tag === "query-box-item")
    const border = this.row * 2 - 1
    const el = defaults.length <= border ?  defaults : this.collapse ? defaults : defaults.slice(0, border)
    const share = 1 / this.row // 0.33
    const span = Math.ceil(24 - (el.length / this.row - Math.floor(el.length / this.row)) / share * (24 / this.row))
    return (
      <el-row gutter={20} class="query-box__wrapper">
        { el }
        <el-col span={span} class={"query-box-item-right text-right"}>
          <el-button size="medium" type="primary" onClick={()=> this.$emit('filter')}>搜 索</el-button>
          <el-button size="medium" onClick={()=> this.$emit('reset')}>重 置</el-button>
          {
            defaults.length > border && (
              <el-button size="medium" type="text" onClick={() => {
                this.collapse = !this.collapse
              }}>
                {this.collapse ? '收起' : '展开'}
                <i class={this.collapse ? 'el-icon-arrow-up' : 'el-icon-arrow-down'}>
                </i>
              </el-button>
            )
          }
        </el-col>
      </el-row>
    )
  },
  provide(){
    return {
      QueryBox: this
    }
  }
}
</script>

<style scoped lang="scss">

.query-box__wrapper{
  padding: 20px 10px 0 0;
  box-sizing: border-box;
  margin-left: 0 !important;
  margin-right: 0 !important;
  background: rgba(247,250,251,1);
  border: 1px solid rgba(243,243,244,1);
}

.query-box-item-right{
  margin-bottom: 20px;
}

</style>
