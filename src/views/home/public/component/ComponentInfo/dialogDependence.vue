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
          <span>展示当前组件的依赖关系</span>
          <div v-if="moduleOptions.length > 1" class="module-filter">
            <span class="module-label">模块筛选</span>
            <el-select
              v-model="moduleTreeNodeId"
              size="mini"
              class="module-select"
              clearable
              placeholder="全部模块"
              @change="getDependencyPath(assetComponentId)"
            >
              <el-option
                v-for="item in moduleOptions"
                :key="item.treeNodeId"
                :label="item.name"
                :value="item.treeNodeId"
              />
            </el-select>
          </div>
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
        '#8B1A1A',
        '#D9534F',
        '#D4932A',
        '#2C5F8A',
        '#4A9C8C'
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
      chartData: [],
      assetComponentId: null,
      moduleTreeNodeId: null,
      moduleOptions: []
    }
  },
  methods: {

    open(id) {
      this.assetComponentId = id
      this.moduleTreeNodeId = null
      this.moduleOptions = []
      this.dialogVisible = true
      this.getDependencyPath(id)
    },

    /**
     * @desc 获取单组件依赖关系列表，所有详情页面共用一个接口
     * @param id 是assetComponentId
     */
    async getDependencyPath(id) {
      try {
        const res = await dependencyPathApi(id, {
          treeMode: true,
          moduleTreeNodeId: this.moduleTreeNodeId
        })
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
      if (!this.moduleOptions.length) {
        this.moduleOptions = data.filter(item => item.parentTreeNodeId === 0)
      }
      data.forEach((item, idx) => {
        const parentIdx = data.findIndex(parent => parent.treeNodeId === item.parentTreeNodeId)
        if (parentIdx >= 0) {
          this.chartLink.push({
            source: parentIdx,
            target: idx,
            value: (item.parseDeep || 0) + '层',
            lineStyle: {
              width: 1
            }
          })
        }

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
    display: flex;
    align-items: center;
    gap: 10px;

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.module-filter {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.module-label {
  color: #2f6f9f;
  font-size: 14px;
  white-space: nowrap;
}

.module-select {
  width: 220px;
}

:deep(.el-dialog__body) {
  padding-bottom: 0 !important;
}
</style>
