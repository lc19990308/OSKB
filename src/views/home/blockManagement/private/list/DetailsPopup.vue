<template>
  <el-drawer :visible.sync="visible" size="610px" title="阻断详情">
    <el-form label-width="100px" label-position="left" style="padding: 0 25px;">
      <oss-title>基础信息</oss-title>
      <div class="dec-box m-b-20">
        <el-form-item label="组件名称">
          {{get(info, 'componentName', '-')}}
        </el-form-item>
        <el-form-item label="阻断时间">
          {{get(info, 'createdTime', '-')}}
        </el-form-item>
        <el-form-item label="请求IP">
          {{get(info, 'requestIP', '-')}}
        </el-form-item>
        <el-form-item label="阻断代理">
          {{get(info,'agentName','-')}}
        </el-form-item>
      </div>
      <oss-title>阻断资产</oss-title>
      <div class="dec-box m-b-20">
        <el-form-item label="仓库名称">
          {{get(info, 'upstreamAlias', '-')}}
        </el-form-item>
        <el-form-item label="仓库地址">
          {{get(info, 'upstream', '-')}} <copy-button :text="get(info, 'upstream')"></copy-button>
        </el-form-item>
        <el-form-item label="组件漏洞">
          <level-group style="margin-top: 10px;"  :value="[
              get(info, 'vulNum.serious',0),
              get(info, 'vulNum.high',0),
              get(info, 'vulNum.medium',0),
              get(info, 'vulNum.low',0),]">
          </level-group>
        </el-form-item>
        <el-form-item label="组件许可证">
          <el-tag size="mini" v-if="get(info, 'componentLicense')">{{get(info, 'componentLicense')}}</el-tag>
          <template v-else>-</template>
        </el-form-item>
      </div>
      <oss-title>阻断规则</oss-title>
      <div class="dec-box m-b-20">
        <el-form-item label-width="130px" v-if="get(info, 'regular.componentBlacklist')"  label="组件黑名单规则">
          当检测结果中含有黑名单组件时，进行阻断
        </el-form-item>
        <el-form-item label-width="130px" v-if="get(info, 'regular.vulnerabilityBlacklist')" label="漏洞黑名单规则">
          当检测结果中含有黑名单漏洞时，进行阻断
        </el-form-item>
        <el-form-item label-width="130px"  v-if="get(info, 'regular.componentBaseline')" label="组件版本基线规则">
          当检测结果中含不在版本基线范围内的组件时，进行阻断
        </el-form-item>
        <el-form-item label="漏洞等级" v-if="get(info, 'regular.vulnerabilitySerious') || get(info, 'regular.vulnerabilityHigh') || get(info, 'regular.vulnerabilityMedium') || get(info, 'regular.vulnerabilityLow')">
          <level-tag v-if="get(info, 'regular.vulnerabilitySerious')" :level="1" class="m-r-15"></level-tag>
          <level-tag v-if="get(info, 'regular.vulnerabilityHigh')" :level="2" class="m-r-15"></level-tag>
          <level-tag v-if="get(info, 'regular.vulnerabilityMedium')" :level="3" class="m-r-15"></level-tag>
          <level-tag v-if="get(info, 'regular.vulnerabilityLow')" :level="4" class="m-r-15"></level-tag>
        </el-form-item>
        <el-form-item label="许可证等级" v-if="get(info, 'regular.licenseHigh') || get(info, 'regular.licenseMedium') || get(info, 'regular.licenseLow')" >
          <level-tag v-if="get(info, 'regular.licenseHigh')" license :level="1" class="m-r-15"></level-tag>
          <level-tag v-if="get(info, 'regular.licenseMedium')" license :level="2" class="m-r-15"></level-tag>
          <level-tag v-if="get(info, 'regular.licenseLow')" license :level="3" class="m-r-15"></level-tag>
        </el-form-item>
        <el-form-item label="许可证" v-if="get(info, 'regular.licenses', []).length">
          <el-tag class="m-r-10" size="mini" v-for="item in get(info, 'regular.licenses', [])" :key="item"> {{item}}</el-tag>
        </el-form-item>
        <el-form-item label="CVE编号" v-if="visible && get(info, 'cves')">
          <div style="line-height: 24px;padding-top: 8px;" v-clamp="clampConfig" v-text="get(info, 'cves', '-')"></div>
        </el-form-item>
      </div>
      <oss-title>命中规则</oss-title>
      <div class="dec-box m-b-20" style="border-bottom: none;">
        <el-form-item label-width="130px" v-if="get(info, 'hitRegular.componentBlacklist')"  label="组件黑名单规则">
          当检测结果中含有黑名单组件时，进行阻断
        </el-form-item>
        <el-form-item label-width="130px" v-if="get(info, 'hitRegular.vulnerabilityBlacklist')" label="漏洞黑名单规则">
          当检测结果中含有黑名单漏洞时，进行阻断
        </el-form-item>
        <el-form-item label-width="130px"  v-if="get(info, 'hitRegular.componentBaseline')" label="组件版本基线规则">
          当检测结果中含不在版本基线范围内的组件时，进行阻断
        </el-form-item>
        <el-form-item label="漏洞编号" v-if="visible && get(info, 'hitRegular.cves')">
          <div style="line-height: 24px;padding-top: 8px;" v-clamp="clampConfigB" v-text="get(info, 'hitRegular.cves', '-')"></div>
        </el-form-item>
        <el-form-item label="漏洞等级" v-if="get(info, 'hitRegular.vulnerabilitySerious') || get(info, 'hitRegular.vulnerabilityHigh') || get(info, 'hitRegular.vulnerabilityMedium') || get(info, 'hitRegular.vulnerabilityLow')">
          <level-tag v-if="get(info, 'hitRegular.vulnerabilitySerious')" :level="1" class="m-r-15"></level-tag>
          <level-tag v-if="get(info, 'hitRegular.vulnerabilityHigh')" :level="2" class="m-r-15"></level-tag>
          <level-tag v-if="get(info, 'hitRegular.vulnerabilityMedium')" :level="3" class="m-r-15"></level-tag>
          <level-tag v-if="get(info, 'hitRegular.vulnerabilityLow')" :level="4" class="m-r-15"></level-tag>
        </el-form-item>
        <el-form-item label="许可证" v-if="get(info, 'hitRegular.licenses', []).length">
          <el-tag class="m-r-10" size="mini" v-for="item in get(info, 'hitRegular.licenses', [])" :key="item"> {{item}}</el-tag>
        </el-form-item>
        <el-form-item label="许可证等级" v-if="get(info, 'hitRegular.licenseHigh') || get(info, 'hitRegular.licenseMedium') || get(info, 'hitRegular.licenseLow')">
          <level-tag v-if="get(info, 'hitRegular.licenseHigh')" license :level="1" class="m-r-15"></level-tag>
          <level-tag v-if="get(info, 'hitRegular.licenseMedium')" license :level="2" class="m-r-15"></level-tag>
          <level-tag v-if="get(info, 'hitRegular.licenseLow')" license :level="3" class="m-r-15"></level-tag>
        </el-form-item>
      </div>
    </el-form>
  </el-drawer>
</template>

<script>

import CopyButton from '@/components/public/IconButton/copy'
export default {
  name: 'DetailsPopup',
  components: {
    CopyButton,
    OssTitle: {
      render (h) {
        return h('div', { class: 'oss-title' }, this.$scopedSlots.default())
      }
    }
  },
  computed: {
    clampConfig () {
      return {
        text: this.info.regular.cves,
        clamp: 5,
        collapse: true,
        collapseBeforeSuffixHTML: '...<span class="text-primary m-l-5">展开</span><i class="el-icon-arrow-down text-primary"></i>',
        collapseAfterSuffixHTML: '<span class="text-primary m-l-5">收起</span><i class="el-icon-arrow-up text-primary"></i>'
      }
    },
    clampConfigB () {
      return {
        text: this.info.hitRegular.cves,
        clamp: 5,
        collapse: true,
        collapseBeforeSuffixHTML: '...<span class="text-primary m-l-5">展开</span><i class="el-icon-arrow-down text-primary"></i>',
        collapseAfterSuffixHTML: '<span class="text-primary m-l-5">收起</span><i class="el-icon-arrow-up text-primary"></i>'
      }
    }
  },
  data () {
    return {
      visible: false,
      statusOptions: [
        {
          value: -1,
          text: '未检测',
          className: 'text-regular',
          type: 'info',
          progress: 10
        },
        {
          value: 0,
          text: '排队中',
          className: 'text-secondary',
          type: 'warning',
          progress: 30
        },
        {
          value: 1,
          text: '检测中',
          className: 'text-primary',
          type: 'primary',
          progress: 80
        },
        {
          value: 2,
          text: '检测完成',
          className: 'text-success',
          type: 'success',
          progress: 100
        },
        {
          value: 3,
          text: '出错结束',
          className: 'text-danger',
          type: 'danger',
          progress: 100
        }
      ],
      info: {
        regular: {},
        hitRegular: {}
      }
    }
  },
  methods: {
    open (info) {
      this.info = info
      this.visible = true
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-drawer__header) {
  border-bottom: 1px solid #F0F0F1;
  padding: 15px 20px;
  font-size: 16px;
  margin-bottom: 0;
  line-height: normal;
  [role="heading"] {
    color: #333333;
  }
}
:deep(.el-drawer__body) {
  padding-top: 20px;
  overflow-y: auto;
}
.dec-box {
  border-bottom: 1px solid #F0F0F1;
  padding-left: 10px;
}
.oss-title {
  color: $color-primary;
  font-size: 16px;
  position: relative;
  padding-left: 10px;
  margin-bottom: 10px;

  &::before {
    content: '';
    position: absolute;
    height: 65%;
    left: 0;
    top: 2px;
    width: 3px;
    background: $color-primary;
  }
}
:deep(.el-form-item) {
  margin-bottom: 10px !important;
}
</style>
