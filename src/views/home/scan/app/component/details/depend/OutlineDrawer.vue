<script>
import { once } from 'lodash-es'
import { knowledgeGraphOverviewApi } from '@/api/home/scan/app'

export default {
  name: 'OutlineDrawer',
  data () {
    return {
      visible: false,
      loading: false,
      overview: {
        vulNumVO: {},
        licenseNumVO: {}
      },
      getKnowledgeGraphOverview: () => undefined
    }
  },
  methods: {
    open () {
      this.visible = true
      this.getKnowledgeGraphOverview()
    }
  },
  created () {
    this.getKnowledgeGraphOverview = once(async function () {
      this.loading = true
      const [error, response] = await to(knowledgeGraphOverviewApi(this.$route.query.task))
      this.loading = false
      if (error && error.message) return this.$message.error(error.message)
      this.overview = response.data || this.$options.data().overview
    })
  }
}
</script>

<template>
  <el-drawer title="概要" :visible.sync="visible" size="540px" :modal="false">
    <div class="title" slot="title">
      <span style="font-weight: 600;font-size: 16px;color: #333;">概要</span>
    </div>
    <div style="padding: 0 20px;" v-loading="loading">
      <el-form label-position="top" label-width="80px">
        <el-form-item :label="`包含类型：（${(overview.componentTotal || 0) + 1}）`">
          <div class="flex m-b-15" style="color: #666;">
            <span
              style="display: inline-block;width: 22px;height: 22px;border: 1px solid #d9d9d9;margin-right: 10px;">
            </span>
            <span>应用（1）</span>
          </div>
          <div class="flex" style="color: #666;">
            <span
              style="display: inline-block;width: 22px;height: 22px;border: 1px solid #d9d9d9;margin-right: 10px;border-radius: 50%;">
            </span>
            <span>组件（{{overview.componentTotal || 0}}）</span>
          </div>
        </el-form-item>
        <el-form-item :label="`包含漏洞：（${overview.vulNumVO.total || 0}）`">
          <div style="line-height: 20px;">
            <level-group
              plain
              :value="[
                overview.vulNumVO.serious || 0,
                overview.vulNumVO.high || 0,
                overview.vulNumVO.medium || 0,
                overview.vulNumVO.low || 0
               ]"
              :layout="{
                colors: ['#991B1B', '#EF4444', '#F59E0B', '#8B5CF6'],
                tooltip: ['严重', '高危', '中危', '低危']
              }"
            />
          </div>
        </el-form-item>
        <el-form-item :label="`包含许可证：（${overview.licenseNumVO.totalNum || 0}）`">
          <div style="line-height: 20px;">
            <level-group
              plain
              :value="[
                overview.licenseNumVO.highNum || 0,
                overview.licenseNumVO.mediumNum || 0,
                overview.licenseNumVO.lowNum || 0
              ]"
              :layout="{
                colors: ['#EF4444', '#F59E0B', '#8B5CF6'],
                tooltip: ['高风险', '中风险', '低风险']
              }"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>
