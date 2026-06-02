<template>
  <el-drawer :visible.sync="visible" size="540px" :modal="false">
    <div class="title" slot="title">
      <i class="iconfont iconmoshi text-regular"></i>
      <span class="m-r-15">{{ createStrSuffix(taskInfo.packageName, 20) || '应用包信息' }}</span>
      <level-tag class="m-b-5" :level="taskInfo.securityLevel"></level-tag>
    </div>
    <el-form label-width="100px" label-position="left" style="padding: 0 25px;">
      <el-form-item label="版本">
        {{ taskInfo.version || '-' }}
      </el-form-item>
      <el-form-item label="质量门禁">
        {{ taskInfo.qualityResult === 0 ? '不通过' : taskInfo.qualityResult === 1 ? '通过' : '-' }}
        <i class="cursor-pointer text-primary el-icon-loading" v-if="loading"></i>
        <el-tooltip v-else class="item" effect="dark" content="点击查看详情" placement="top">
          <i class="el-icon-info text-primary cursor-pointer" style="font-size: 16px;" @click="getQualityDetails"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="大小">
        {{ taskInfo.byteSize | byteSize }}
      </el-form-item>
      <el-form-item label="开始检测">
        {{ taskInfo.startDate || '-' }}
      </el-form-item>
      <el-form-item label="检测完成">
        {{ taskInfo.finishDate || '-' }}
      </el-form-item>
      <el-form-item label="检测时长">
        {{ taskInfo.detectDuration || '-' }}
      </el-form-item>
      <el-form-item label="检测规则">
        <div style="background: rgba(242, 242, 242, 0.4);border-radius: 4px;padding: 10px;line-height: 30px;">
          <div>审查方式：{{ taskInfo.checkType === 0 ? '快速审查' : taskInfo.checkType === 1 ? '深度审查' : '-' }}</div>
          <div>解析深度：{{ taskInfo.deepLimit > -1 ? taskInfo.deepLimit + '层' : '默认层级' }}</div>
          <div>数据清洗：{{
              taskInfo.cleanLevel === 1 ? '快速清洗' : taskInfo.cleanLevel === 2 ? '深度清洗' : '-'
            }}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="仓库说明">
        <div style="background: rgba(242, 242, 242, 0.4);border-radius: 4px;padding: 10px;line-height: 30px;">
          {{ get(taskInfo, 'description', '-') }}
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import to from '@/utils/await-to'
import { getTaskQualityDetails } from '@/api/home/scan/integration/sourceCode'
import { isObject } from '@/utils'

export default {
  name: 'DescDrawer',
  components: {},

  data () {
    return {
      visible: false,
      taskId: this.$route.query.task,
      taskInfo: {},
      loading: false
    }
  },
  methods: {
    open (taskInfo) {
      this.taskInfo = taskInfo
      this.visible = true
    },
    async getQualityDetails () {
      this.loading = true
      let [error, response] = await to(getTaskQualityDetails(this.taskId))
      this.loading = false
      if (isObject(error)) return this.$message.error(error.message)
      response = response.data
      this.$popup({
        title: '质量门禁规则',
        width: '750px',
        showConfirmButton: false,
        cancelButtonText: '关闭',
        content: (
          <div style="width: 640px;margin: 0 auto">
            {
              response.componentBaseLineSwitch === 1 ? (
                <div style="color: #8B9CB0;" class="m-b-15">
                  <label style="color: #1B2838; width: 140px; font-size: 16px;">基线规则</label>
                  <div style="padding: 10px 0 0 38px;">
                    <div style="display: flex" class="m-b-10">
                      <label style="color: #1B2838;">组件版本基线：</label>
                      <span style="flex: 1;">
                            当任务检测结果中含有不在版本基线范围内的组件时，本次任务将不允许构建（白名单内的组件会继续构建）
                      </span>
                    </div>
                  </div>
                </div>) : ''
            }

            {
              [response.componentBlacklistSwitch, response.componentWhitelistSwitch].includes(1) ? (
                <div style="color: #8B9CB0;" class="m-b-15">
                  <label style="color: #1B2838; width: 140px; font-size: 16px;">组件规则</label>
                  {
                    response.componentBlacklistSwitch ? (
                      <div style="padding: 10px 0 0 38px;">
                        <div style="display: flex" class="m-b-10">
                          <label style="color: #1B2838;">组件黑名单：</label>
                          <span style="flex: 1;">
                            当任务检测结果中含有黑名单组件时，本次任务将不允许构建
                          </span>
                        </div>
                      </div>
                    ) : ''
                  }

                  {
                    response.componentWhitelistSwitch ? (
                      <div style="padding: 10px 0 0 38px;">
                        <div style="display: flex" class="m-b-10">
                          <label style="color: #1B2838;">组件白名单：</label>
                          <span style="flex: 1;">
                            当任务检测结果中含有白名单组件时，系统会忽略组件本身的风险，不影响任务的正常构建
                          </span>
                        </div>
                      </div>
                    ) : ''
                  }
                </div>) : ''
            }

            {
              [response.blackSwitch, response.whiteSwitch].includes(1) ? (
                <div style="color: #8B9CB0;" class="m-b-15">
                  <label style="color: #1B2838; width: 140px; font-size: 16px;">漏洞规则</label>
                  {
                    response.blackSwitch ? (
                      <div style="padding: 10px 0 0 38px;">
                        <div style="display: flex" class="m-b-10">
                          <label style="color: #1B2838;">漏洞黑名单：</label>
                          <span style="flex: 1;">
                            当任务检测结果中含有黑名单漏洞时，本次任务将不允许构建
                          </span>
                        </div>
                      </div>
                    ) : ''
                  }

                  {
                    response.whiteSwitch ? (
                      <div style="padding: 10px 0 0 38px;">
                        <div style="display: flex" class="m-b-10">
                          <label style="color: #1B2838;">漏洞白名单：</label>
                          <span style="flex: 1;">
                            当任务检测结果中含有白名单漏洞的组件时，系统会忽略漏洞本身的风险，不影响任务的正常构建
                          </span>
                        </div>
                      </div>
                    ) : ''
                  }
                </div>) : ''
            }

            {
              [response.licenseBlackListSwitch, response.licenseWhiteListSwitch].includes(1) ? (
                <div style="color: #8B9CB0;" class="m-b-15">
                  <label style="color: #1B2838; width: 140px; font-size: 16px;">许可证规则</label>
                  {
                    response.licenseBlackListSwitch ? (
                      <div style="padding: 10px 0 0 38px;">
                        <div style="display: flex" class="m-b-10">
                          <label style="color: #1B2838;">许可证黑名单：</label>
                          <span style="flex: 1;">
                            当任务检测结果中含有黑名单许可证时，本次任务将不允许构建
                          </span>
                        </div>
                      </div>
                    ) : ''
                  }

                  {
                    response.licenseWhiteListSwitch ? (
                      <div style="padding: 10px 0 0 38px;">
                        <div style="display: flex" class="m-b-10">
                          <label style="color: #1B2838;">许可证白名单：</label>
                          <span style="flex: 1;">
                            当任务检测结果中含有白名单许可证的组件时，系统会忽略许可证本身的风险，不影响任务的正常构建
                          </span>
                        </div>
                      </div>
                    ) : ''
                  }
                </div>) : ''
            }

            {
              response.qualitySwitch === 1 ? (
                <div style="color: #8B9CB0;display: flex" class="m-b-15">
                  <label style="color: #1B2838; width: 130px; font-size: 16px;">自定义门禁阈值</label>
                  <span style="flex: 1">
                    {response.vulQualitySwitch === 1
                      ? <div style="display: flex" class="m-b-10">
                        <label>漏洞风险阈值：</label>
                        <span style="flex: 1;color: #1B2838">
                          <span class="text-severity">严重</span>{'<='}{response.vulSeriousNum}，
                          <span class="text-danger">高危</span>{'<='}{response.vulHighNum}，
                          <span class="text-warning">中危</span>{'<='}{response.vulMediumNum}，
                          <span class="text-primary">低危</span>{'<='}{response.vulLowNum}
                        </span>
                      </div>
                      : ''}
                    {
                      response.licenseQualitySwitch === 1 ? (
                        <div style="display: flex">
                          <label>许可证风险阈值：</label>
                          <span style="flex: 1;color: #1B2838">
                            <span class="text-danger">高风险</span>{'<='}{response.licenseHighNum}，
                            <span class="text-warning">中风险</span>{'<='}{response.licenseMediumNum}，
                            <span class="text-primary">低风险</span>{'<='}{response.licenseLowNum}
                          </span>
                        </div>
                      ) : ''
                    }
                  </span>
                </div>) : ''
            }
          </div>
        )
      })
    }
  }
}
</script>

<style scoped lang="scss">
.title {
  font-weight: 600;
  font-size: 18px;
  color: #333;

  .iconfont {
    font-size: 21px;
    margin-right: 5px;
    vertical-align: middle;
    font-weight: normal;
  }
}

:deep(.el-form-item) {
  margin-bottom: 10px !important;
}
</style>
