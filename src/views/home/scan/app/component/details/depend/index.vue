<template>
  <div class="oss-border" style="padding: 20px;position: relative;">
    <OutlineDrawer ref="outline"></OutlineDrawer>
    <ApplicationDrawer ref="application"></ApplicationDrawer>
    <ComponentDrawer ref="component"></ComponentDrawer>
    <el-checkbox
      v-model="hasVul"
      :true-label="1"
      :false-label="0"
      @change="init"
    >仅展示有漏洞的依赖</el-checkbox>
    <div class="trapezoid-button-warp" @click="$refs.outline.open()">
      <i class="icon-font el-icon-d-arrow-left" style="transition: all 0.3s;"></i>
      <div class="trapezoid-button">
        <el-tooltip class="item" effect="dark" content="展开概要" placement="left">
          <div class="w-full h-full"></div>
        </el-tooltip>
      </div>
    </div>
    <div ref="g6" style="height: calc(100vh - 300px);"></div>
  </div>
</template>
<script>
import { dependTreeChart } from '@/api/home/scan/app'
import OutlineDrawer from '@/views/home/scan/app/component/details/depend/OutlineDrawer.vue'
import { omit } from 'lodash-es'
import G6 from '@antv/g6'
import { createKeysTree } from '@/utils/tree'
import ApplicationDrawer from '@/views/home/scan/app/component/details/depend/ApplicationDrawer.vue'
import ComponentDrawer from '@/views/home/scan/app/component/details/depend/ComponentDrawer.vue'
const VUL_COLORS = ['#a80022', '#f64e60', '#fead33', '#3596fa', '#50cd89']
const VUL_BG_COLORS = ['#db8c92', '#ffcccc', '#ffe7ad', '#87cbff', '#a3e6bc']
export default {
  name: 'Depend',
  components: {
    ComponentDrawer,
    ApplicationDrawer,
    OutlineDrawer
  },
  data () {
    return {
      componentTotal: 0,
      projectId: this.$route.query.project,
      appPackageId: this.$route.query.appPackage,
      taskId: this.$route.query.task,
      loading: false,
      hasVul: 1,
      data: []
    }
  },
  methods: {
    // 初始化
    init () {
      this.loading = true
      dependTreeChart({
        taskId: this.taskId,
        projectId: this.projectId,
        hasVul: this.hasVul,
        loading: false
      }).then(response => {
        this.loading = false
        const data = response.data
        if (Object.hasOwnProperty.call(data, 'length') && data.length > 0) {
          this.componentTotal = data[0].componentTotal
          this.data = createKeysTree(this.processing(data))[0]
          this.data.type = 'rect'
          this.renderG6(this.data)
        }
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 处理数据
    processing (data) {
      return data.map(item => {
        const obj = {}
        if (Object.hasOwnProperty.call(item, 'sub') && item.sub !== null) {
          obj.children = this.processing(item.sub)
        }
        return {
          ...obj,
          ...omit(item, ['sub']),
          type: 'circle',
          style: {
            fill: VUL_BG_COLORS[typeof item.securityLevel === 'number' ? item.securityLevel - 1 : 4],
            stroke: VUL_COLORS[typeof item.securityLevel === 'number' ? item.securityLevel - 1 : 4], // 样式属性，元素的描边色
            lineWidth: 2,
            cursor: 'pointer'
          }
        }
      })
    },

    renderG6 (data) {
      if (this._destroyed || !this.$refs.g6) return
      this.graph && this.graph.destroy()
      const graph = new G6.TreeGraph({
        container: this.$refs.g6,
        width: this.$refs.g6.scrollWidth,
        height: this.$refs.g6.scrollHeight,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange (item, collapsed) {
                const data = item.getModel()
                data.collapsed = collapsed
                return true
              }
            },
            'drag-canvas',
            'zoom-canvas'
          ]
        },
        defaultNode: {
          size: 26,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5]
          ]
        },
        defaultEdge: {
          type: 'cubic-horizontal'
        },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: function getId (d) {
            return d.id
          },
          getHeight: function getHeight () {
            return 16
          },
          getWidth: function getWidth () {
            return 16
          },
          getVGap: function getVGap () {
            return 10
          },
          getHGap: function getHGap () {
            return 150
          }
        }
      })
      this.graph = graph

      graph.node(function (node) {
        return {
          label: node.name,
          labelCfg: {
            offset: 10,
            position: node.children && node.children.length > 0 ? 'left' : 'right'
          }
        }
      })

      graph.on('node:mouseenter', (evt) => {
        const { item } = evt
        graph.setItemState(item, 'active', true)
      })

      graph.on('node:mouseleave', (evt) => {
        const { item } = evt
        graph.setItemState(item, 'active', false)
      })

      // 点击节点
      graph.on('node:click', (e) => {
        if (e.item._cfg.model.type === 'rect') { // application
          this.$refs.application.open()
        } else {
          this.$refs.component.open(e.item._cfg.model.dicComponentId)
        }
      })

      graph.data(data)
      graph.render()
      graph.zoom(0.5)
      graph.fitView(true)
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    this._destroyed = true
  }
}
</script>
<style lang="scss" scoped>
.trapezoid-button-warp {
  width: 25px;
  height: 80px;
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 999;
  cursor: pointer;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    .el-icon-d-arrow-left {
      transform: translateX(-3px);
      color: $color-primary;
      font-weight: bold;
    }
  }
}
.trapezoid-button {
  width: 25px;
  height: 80px;
  border: 1px solid #d9d9d9;
  position: absolute;
  top: 0;
  right: 0;
  z-index: -1;
  background: white;
  transform: perspective(7px) rotateY(-3deg);
}
</style>
