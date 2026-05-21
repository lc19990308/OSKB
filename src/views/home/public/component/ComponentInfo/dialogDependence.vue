<template>
  <el-dialog
    title="依赖关系"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    modal-append-to-body
    width="900px"
    :close-on-click-modal="false"
    :destroy-on-close="true">
    <div>
      <el-alert :closable="false" type="primary" class="header-alert">
        <div class="alert-content">
          <i class="el-icon-info"></i>
          展示当前的的组件依赖关系，从0层（应用包本身）到当前组件的依赖路径
        </div>
      </el-alert>
      <RelationChart :chart-data="chartData" :chart-link="chartLink"></RelationChart>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="medium">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>

import {dependencyPathApi} from "@/api/home/public/component";
import RelationChart from "@/components/chart/RelationChart";

import yanzhong from '@/assets/images/svg/Group516.svg';
import gaowei from '@/assets/images/svg/Group515.svg';
import zhongwei from '@/assets/images/svg/Group512.svg';
import diwei from '@/assets/images/svg/Group514.svg';
import wu from '@/assets/images/svg/Group.svg';

import yanzhong_img from '@/assets/images/svg/Group516_img.png';
import gaowei_img from '@/assets/images/svg/Group515_img.png';
import zhongwei_img from '@/assets/images/svg/Group512_img.png';
import diwei_img from '@/assets/images/svg/Group514_img.png';
import wu_img from '@/assets/images/svg/Group_img.png';

import {isIE} from "@/utils";

export default {
  name: 'dialogDependence',
  components: {RelationChart},
  data() {
    return {
      dialogVisible: false,
      list: [],
      color: [
        '#991B1B',
        '#EF4444',
        '#F59E0B',
        '#8B5CF6',
        '#10B981'
      ],
      texts: [
        '严重',
        '高危',
        '中危',
        '低危',
        '无漏洞'
      ],
      // ie11不展示svg 使用图片代替
      icons: isIE() ?
        [
          yanzhong_img,
          gaowei_img,
          zhongwei_img,
          diwei_img,
          wu_img
        ] :
        [
          yanzhong,
          gaowei,
          zhongwei,
          diwei,
          wu
        ],
      chartLink: [],
      chartData: []
    }
  },
  methods: {

    open(id) {
      this.dialogVisible = true
      this.getDependencyPath(id)
    },

    /**
     * @desc 获取单组件依赖关系列表，所有详情页面共用一个接口
     * @param id 是assetComponentId
     */
    async getDependencyPath(id) {
      try {
        const res = await dependencyPathApi(id)
        this.parseChartData(res.data)
      } catch (error) {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
        this.parseChartData()
      }
    },
    // 解析数据
    parseChartData(data = []) {
      this.chartLink = []
      this.chartData = []
      data.forEach((item, idx) => {
        this.chartLink.push({
          source: idx,
          target: idx + 1,
          value: idx + 1 + '级',
          lineStyle: {
            width: 1
          }
        })

        const tmp = {
          name: item.name,
          texts: this.texts[item.securityLevel - 1],
          id: idx,
          itemStyle: {
            color: this.color[item.securityLevel - 1]
          },
          symbol: `image://${this.icons[item.securityLevel - 1]}`,
          emphasis: {
            itemStyle: {
              shadowColor: this.color[item.securityLevel - 1],
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20
            }
          }
        }
        // 根元素不显示漏洞等级
        idx === 0 && (delete tmp.symbol)
        this.chartData.push(tmp)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.header-alert {
  position: relative;
  margin-bottom: 20px;
  padding-left: 12px !important;
  padding-right: 12px !important;

  :deep(.el-alert__content) {
    padding: 0;
  }

  :deep(.alert-content) {
    margin-bottom: 5px;
    padding: 0;

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

:deep(.el-dialog__body) {
  padding-bottom: 0 !important;
}
</style>
