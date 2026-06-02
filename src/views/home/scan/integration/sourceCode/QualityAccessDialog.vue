<template>
  <el-dialog :width="step === 2 ? '900px' : '600px'" class="dialog-vertical-center" :close-on-click-modal="false" title="质量门禁" :visible.sync="visible" append-to-body
             modal-append-to-body>
    <div style="padding: 10px 20px">
      <template v-if="step === 2">
        <el-alert :closable="false" type="primary" class="header-alert">
          <div class="alert-content">
            <i class="el-icon-info"></i>
            配置插件检测的质量门禁规则，根据团队对开源组件引入质量的要求设置门禁阈值，当质量门禁开启时，检测结果超过质量门禁时终止流水线构建。
          </div>
        </el-alert>
        <div>
          <div class="m-b-10 font-md">基线规则</div>
          <div class="m-b-15 p-l-15">
            <el-checkbox style="width: 125px;" :true-label="1" :false-label="0"
                         v-model="formData.componentBaseLineSwitch">
              组件版本基线：
            </el-checkbox>
            当任务检测结果中含有不在版本基线范围内的组件时，本次任务将不允许构建（白名单内的组件会继续构建）
          </div>
        </div>
        <div>
          <div class="m-b-10 font-md">组件规则</div>
          <div class="m-b-15 p-l-15">
            <el-checkbox style="width: 125px;" :true-label="1" :false-label="0" v-model="formData.componentBlacklistSwitch">
              组件黑名单：</el-checkbox>
            当任务检测结果中含有黑名单组件时，本次任务将不允许构建
          </div>
          <div class="m-b-15 p-l-15">
            <el-checkbox style="width: 125px;" :true-label="1" :false-label="0" v-model="formData.componentWhitelistSwitch">
              组件白名单：</el-checkbox>
            当任务检测结果中含有白名单组件时，系统会忽略组件本身的风险，不影响任务的正常构建
          </div>
        </div>
        <div>
          <div class="m-b-10 font-md">漏洞规则</div>
          <div class="m-b-15 p-l-15">
            <el-checkbox style="width: 125px;" :true-label="1" :false-label="0" v-model="formData.blackSwitch">
              漏洞黑名单：</el-checkbox>
            当任务检测结果中含有黑名单漏洞时，本次任务将不允许构建
          </div>
          <div class="m-b-15 p-l-15">
            <el-checkbox style="width: 125px;" :true-label="1" :false-label="0" v-model="formData.whiteSwitch">
              漏洞白名单：</el-checkbox>
            当任务检测结果中含有白名单漏洞的组件时，系统会忽略漏洞本身的风险，不影响任务的正常构建
          </div>
        </div>
        <div>
          <div class="m-b-10 font-md">许可证规则</div>
          <div class="m-b-15 p-l-15">
            <el-checkbox style="width: 125px;" :true-label="1" :false-label="0" v-model="formData.licenseBlackListSwitch">
              许可证黑名单：</el-checkbox>
            当任务检测结果中含有黑名单许可证时，本次任务将不允许构建
          </div>
          <div class="p-l-15">
            <el-checkbox style="width: 125px;" :true-label="1" :false-label="0" v-model="formData.licenseWhiteListSwitch">
              许可证白名单：</el-checkbox>
            当任务检测结果中含有白名单许可证的组件时，系统会忽略许可证本身的风险，不影响任务的正常构建
          </div>
        </div>
        <el-row class="rules-item" style="padding-top: 20px;">
          <label>自定义门禁阈值：</label>
          <el-switch :active-value="1" :inactive-value="0" v-model="formData.qualitySwitch"></el-switch>
        </el-row>
        <el-row class="form-container">
          <el-row class="m-b-20">
            <el-row class="m-b-10">
              <el-checkbox :true-label="1" :false-label="0" :disabled="formData.qualitySwitch === 0" v-model="formData.vulQualitySwitch">漏洞风险阈值</el-checkbox>
            </el-row>
            <el-row>
              <el-col :span="6">
            <span class="m-r-5">
              <span class="text-severity">严重</span>
            </span>
                <el-input-number style="width: 90px;" :disabled="formData.qualitySwitch === 0 || formData.vulQualitySwitch === 0" size="mini" v-model="formData.vulSeriousNum" controls-position="right" :min="0" :max="10000"></el-input-number>
              </el-col>
              <el-col :span="6">
            <span class="m-r-5">
              <span class="text-danger">高危</span>
            </span>
                <el-input-number style="width: 90px;" size="mini" :disabled="formData.qualitySwitch === 0 || formData.vulQualitySwitch === 0" v-model="formData.vulHighNum" controls-position="right" :min="0" :max="10000"></el-input-number>
              </el-col>
              <el-col :span="6">
            <span class="m-r-5">
              <span class="text-warning">中危</span>
            </span>
                <el-input-number style="width: 90px;" size="mini" :disabled="formData.qualitySwitch === 0 || formData.vulQualitySwitch === 0" v-model="formData.vulMediumNum" controls-position="right" :min="0" :max="10000"></el-input-number>
              </el-col>
              <el-col :span="6">
            <span class="m-r-5">
              <span class="text-primary">低危</span>
            </span>
                <el-input-number style="width: 90px;" size="mini" :disabled="formData.qualitySwitch === 0 || formData.vulQualitySwitch === 0" v-model="formData.vulLowNum" controls-position="right" :min="0" :max="10000"></el-input-number>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-row class="m-b-10">
              <el-checkbox :disabled="formData.qualitySwitch === 0" :true-label="1" :false-label="0" v-model="formData.licenseQualitySwitch">许可证风险阈值</el-checkbox>
            </el-row>
            <el-row>
              <el-col :span="6">
            <span class="m-r-5">
              <span class="text-danger">高风险</span>
            </span>
                <el-input-number style="width: 90px;" :disabled="formData.qualitySwitch === 0 || formData.licenseQualitySwitch === 0" size="mini" v-model="formData.licenseHighNum" controls-position="right" :min="0" :max="10000"></el-input-number>
              </el-col>
              <el-col :span="6">
            <span class="m-r-5">
              <span class="text-warning">中风险</span>
            </span>
                <el-input-number style="width: 90px;" :disabled="formData.qualitySwitch === 0 || formData.licenseQualitySwitch === 0" size="mini" v-model="formData.licenseMediumNum" controls-position="right" :min="0" :max="10000"></el-input-number>
              </el-col>
              <el-col :span="6">
            <span class="m-r-5">
              <span class="text-primary">低风险</span>
            </span>
                <el-input-number style="width: 90px;" :disabled="formData.qualitySwitch === 0 || formData.licenseQualitySwitch === 0" size="mini" v-model="formData.licenseLowNum" controls-position="right" :min="0" :max="10000"></el-input-number>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
      </template>
      <template v-else>
        <el-form ref="uploadForm" style="padding: 30px 0 20px; width: 400px;margin: 0 auto;" :rules="rules" :model="formData" size="medium">
          <el-form-item label="所属项目：" prop="projectId">
            <el-select-v2-project style="width: 250px;" class="input" v-model="formData.projectId"></el-select-v2-project>
          </el-form-item>
        </el-form>
      </template>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" style="width: 70px;" v-if="step === 1" @click="next" size="medium">确 定</el-button>
      <el-button type="primary" style="width: 70px;" v-if="step === 2" @click="confirm" size="medium">保 存</el-button>
      <el-button @click="cancel" style="width: 70px;" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getQualityDetails, updateQuality } from '@/api/home/scan/integration/sourceCode'
import to from '@/utils/await-to'
import { isObject, get } from '@/utils'
import ElSelectV2Project from '@/views/home/project/conf/ElSelectV2Project'
export default {
  name: 'QualityAccessDialog',
  components: { ElSelectV2Project },
  data () {
    return {
      visible: false,
      rules: {
        projectId: [{
          required: true,
          message: '请选择项目',
          trigger: 'blur'
        }]
      },
      step: 1,
      formData: {
        projectId: -1,
        qualitySwitch: 0,
        vulQualitySwitch: 1,
        licenseQualitySwitch: 1,
        vulSeriousNum: 0,
        vulHighNum: 0,
        vulMediumNum: 0,
        vulLowNum: 0,
        licenseHighNum: 0,
        licenseMediumNum: 0,
        licenseLowNum: 0,

        componentBaseLineSwitch: 1,
        componentBlacklistSwitch: 0,
        componentWhitelistSwitch: 0,
        blackSwitch: 0,
        whiteSwitch: 0,
        licenseBlackListSwitch: 0,
        licenseWhiteListSwitch: 0
      }
    }
  },
  methods: {
    open () {
      this.visible = true
      this.formData.projectId = this.projectMixin.id === -1 ? undefined : this.projectMixin.id
      this.step = this.formData.projectId === undefined ? 1 : 2
      if (this.step === 2) this.getQualityDetails()
    },
    cancel () {
      this.visible = false
    },
    next () {
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          this.step = 2
          this.getQualityDetails()
        } else {
          return false
        }
      })
    },
    async getQualityDetails () {
      const [, response] = await to(getQualityDetails(this.formData.projectId))
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = get(response.data, key, 0)
      })
    },
    async confirm () {
      const [error] = await to(updateQuality(this.formData))
      if (isObject(error)) return this.$message.error(error.message)
      this.$message.success('保存成功')
      this.cancel()
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  padding-bottom: 10px;
}

.header-alert {
  position: relative;
  padding-left: 12px !important;
  padding-right: 12px !important;
  margin-bottom: 20px;
  border-style: dashed;

  :deep(.el-alert__content) {
    padding: 0 !important;
    margin-bottom: 5px;
    font-size: 12px;
    color: rgb(51, 51, 51);

    .el-icon-info {
      color: #2C5F8A;
    }

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.rules-item {
  color: #999;
  font-size: 14px;
  line-height: normal;
  padding-left: 10px;
  letter-spacing: 0;
  text-align: left;
  margin-bottom: 15px;
  display: flex;

  label {
    display: inline-block;
    color: rgb(51, 51, 51);
  }
}

.form-container {
  border: 1px solid rgb(220, 222, 224);
  padding: 20px;
  margin: 0 10px;
  margin-bottom: 20px;
}
</style>
