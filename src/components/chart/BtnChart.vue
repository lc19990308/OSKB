<template>
  <div :class="className" class="chart-wrap btn-chart" ref="chart" :style="{height:(height ? height : 460) + 'px',width:width}">
    <el-row :gutter="20" class="btn-chart-row" v-for="(row,index) in chartData" :key="index">
      <el-col :offset="2" :span="20 / (row.value.length + 1)" class="btn-chart-title">
        {{ row.name }}
      </el-col>
      <el-col :span="20 / (row.value.length + 1)" v-for="(col,id) in row.value"  :key="index + '-' + id">
        <div>
          {{ col }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'BtnChart',
  data () {
    return {
      width: '100%',
      height: 460,
      routePath: this.$route.path
    }
  },
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    chartData: {
      type: Array,
      required: true
    }
  },
  methods: {
    __resizeHandler () {
      if (this.routePath === this.$route.path) {
        this.height = parseInt(this.$refs.chart.clientWidth * 0.58)
      }
    },
    fontSize (size) {
      if (!this.windowWidth) return
      const fontSize = 100 * (this.windowWidth / 1920)
      return size * fontSize
    }
  },
  mounted () {
    this.__resizeHandler()
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.__resizeHandler)
  }
}
</script>

<style scoped lang="scss">
  .btn-chart {
    width: 100%;
    height: 100%;
    padding-top: 10%;
    box-sizing: border-box;

    .btn-chart-row {
      text-align: center;
      padding: 25px 0;
      height: 20%;

      .el-col > div {
        color: white;
        height: 40px;
        border-radius: 5px;
        line-height: 40px;
      }

      .el-col:nth-child(2) > div {
        background-color: #D9534F;
      }

      .el-col:nth-child(3) > div {
        background-color: #D4932A;
      }

      .el-col:nth-child(4) > div {
        background-color: #2C5F8A;
      }

      .el-col:nth-child(5) > div {
        background-color: #5B8BA0;
      }
    }
  }
</style>
