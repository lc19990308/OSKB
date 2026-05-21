<script>
import { once } from 'lodash-es'
import { knowledgeGraphApplicationApi } from '@/api/home/scan/app'
import LicenseTag from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/LicenseTag.vue'

export default {
  name: 'ApplicationDrawer',
  components: { LicenseTag },
  data () {
    return {
      visible: false,
      loading: false,
      details: {},
      knowledgeGraphApplication: () => undefined,
      sourceMaps: {
        1: '本地上传',
        2: 'FTP拉取',
        3: '华为云OBS',
        4: '阿里云OSS',
        5: 'HTTP'
      }
    }
  },
  methods: {
    open () {
      this.visible = true
      this.knowledgeGraphApplication()
    }
  },
  created () {
    this.knowledgeGraphApplication = once(async function () {
      this.loading = true
      const [error, response] = await to(knowledgeGraphApplicationApi(this.$route.query.task))
      this.loading = false
      if (error && error.message) return this.$message.error(error.message)
      this.details = response.data || {}
    })
  }
}
</script>

<template>
  <el-drawer title="概要" :visible.sync="visible" size="700px" :modal="false">
    <div class="title" slot="title">
      <span style="font-weight: 600;font-size: 16px;color: #333;">{{details.name || '应用名称'}}</span>
    </div>
    <div style="padding: 0 20px;" v-loading="loading">
      <div class="oss-title">节点信息</div>
      <el-form label-width="90px" label-position="left">
        <el-form-item label="应用版本：" style="margin-bottom: 0;">{{details.version || '-'}}</el-form-item>
        <el-form-item label="检测类型：" style="margin-bottom: 0;">组件依赖检测</el-form-item>
        <el-form-item label="检测来源：">{{sourceMaps[details.source] || '-'}}</el-form-item>
      </el-form>
      <div class="oss-title">关联信息</div>
      <el-form label-width="130px" label-position="left">
        <el-form-item>
          <template v-slot:label>
            <div style="display: inline-flex;align-items: center;">
              <span
                style="display: inline-block;width: 18px;height: 18px;border: 1px solid #666;margin-right: 10px;border-radius: 50%;">
              </span>
              <span>组件（{{details.componentTotal || 0}}）</span>
            </div>
          </template>
          <ul
            v-if="details.components && Array.isArray(details.components)"
            style="list-style: none;padding: 0;margin: 0;max-height: 200px;overflow-y:auto;"
          >
            <li v-for="(item, i) in details.components" :key="item.name + i" style="display: flex;align-items: center;">
              <span
                class="hover-text-primary"
                style="
                  display: inline-block;
                  max-width: 200px;
                  white-space: nowrap;
                  overflow: hidden;
                  word-break: break-all;
                  text-overflow:ellipsis;"
              >
                {{item.name}}
              </span>
              <i class="iconfont iconfengefu" style="font-size: 12px;margin: 0 5px;line-height: 1;"></i>
              <span class="m-r-5">{{item.version}}</span>
              <level-group :value="[
                 item.vulNumVO.serious || 0,
                 item.vulNumVO.high || 0,
                 item.vulNumVO.medium || 0,
                 item.vulNumVO.low || 0
             ]"/>
            </li>
          </ul>
          <div v-else class="no-data">
            <svg class="icon svg-icon" aria-hidden="true" :style="{width:'50px',height: '50px' ,marginRight: '100px'}">
              <use xlink:href="#iconkongshujuicon"></use>
            </svg>
          </div>
        </el-form-item>
        <el-form-item>
          <template v-slot:label>
            <div style="display: inline-flex;align-items: center;">
              <i
                class="iconfont iconloudongku"
                style="font-size: 22px;line-height: 1;margin-right: 5px;"></i>
              <span>漏洞（{{details.vulnerabilityTotal || 0}}）</span>
            </div>
          </template>
          <ul
            v-if="details.vulnerabilities && Array.isArray(details.vulnerabilities)"
            style="list-style: none;padding: 0;margin: 0;max-height: 150px;overflow-y:auto;"
          >
            <li v-for="(item, i) in details.vulnerabilities" :key="item.vulCode + i">
              <span class="m-r-15 hover-text-primary">{{item.vulCode}}</span>
              <level-tag :level="item.securityLevelId"></level-tag>
            </li>
          </ul>
          <div v-else class="no-data">
            <svg class="icon svg-icon" aria-hidden="true" :style="{width:'50px',height: '50px' ,marginRight: '100px'}">
              <use xlink:href="#iconkongshujuicon"></use>
            </svg>
          </div>
        </el-form-item>
        <el-form-item>
          <template v-slot:label>
            <div style="display: inline-flex;align-items: center;">
              <i
                class="iconfont iconpermission"
                style="font-size: 22px;line-height: 1;margin-right: 5px;"></i>
              <span>许可证（{{details.licenseTotal || 0}}）</span>
            </div>
          </template>
          <div v-if="details.licenseTotal > 0" style="word-break: break-all;white-space: pre-wrap;">
            <LicenseTag
              v-for="(item) in get(details, 'licenses', [])"
              license
              style="display: inline-block;line-height: 16px;"
              class="m-r-5"
              :level="item.securityLevelId"
              :key="item.licenseShortName">
              {{item.licenseShortName}}
            </LicenseTag>
          </div>
          <div v-else class="no-data">
            <svg class="icon svg-icon" aria-hidden="true" :style="{width:'50px',height: '50px' ,marginRight: '100px'}">
              <use xlink:href="#iconkongshujuicon"></use>
            </svg>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
:deep(.el-drawer__body) {
  overflow-x: hidden;
  overflow-y: auto;
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
    top: 3px;
    width: 3px;
    background: $color-primary;
  }
}

.no-data{
  width: 100%;
  text-align: center;
  color: #b4bccc;
  padding-top: 40px;
}

</style>
