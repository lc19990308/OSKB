<template>
  <el-dialog
    title="补充人工证据"
    :visible.sync="dialogVisible"
    width="560px"
    append-to-body
    :close-on-click-modal="false"
    @closed="resetForm"
  >
    <el-form ref="evidenceForm" :model="form" :rules="rules" label-width="92px">
      <el-form-item label="评估指标">
        {{ metric.metricName || metric.metricCode }}
      </el-form-item>
      <el-form-item label="证据链接" prop="sourceUrl">
        <el-input v-model.trim="form.sourceUrl" placeholder="请输入公开且可审计的证据链接"></el-input>
      </el-form-item>
      <el-form-item label="证据摘要" prop="summary">
        <el-input v-model.trim="form.summary" type="textarea" :rows="4" :maxlength="2000" show-word-limit placeholder="描述该证据能够支持的社区健康结论"></el-input>
      </el-form-item>
      <el-form-item label="观察时间" prop="observedAt">
        <el-date-picker
          v-model="form.observedAt"
          type="datetime"
          value-format="yyyy-MM-ddTHH:mm:ss"
          placeholder="选择证据观察时间"
          class="w-full"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="save">保存证据</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveManualEvidence } from '@/api/home/communityHealth'

export default {
  name: 'ManualEvidenceDialog',
  data () {
    const validateUrl = (rule, value, callback) => {
      try {
        const url = new URL(value)
        if (url.protocol === 'http:' || url.protocol === 'https:') callback()
        else callback(new Error('请输入以 http 或 https 开头的链接'))
      } catch (error) {
        callback(new Error('请输入有效的证据链接'))
      }
    }
    return {
      dialogVisible: false,
      saving: false,
      assessmentId: null,
      metric: {},
      form: {
        sourceUrl: '',
        summary: '',
        observedAt: ''
      },
      rules: {
        sourceUrl: [
          { required: true, message: '请输入证据链接', trigger: 'blur' },
          { validator: validateUrl, trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '请输入证据摘要', trigger: 'blur' },
          { max: 2000, message: '证据摘要不能超过 2000 个字符', trigger: 'blur' }
        ],
        observedAt: [
          { required: true, message: '请选择观察时间', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    open (assessmentId, metric) {
      this.assessmentId = assessmentId
      this.metric = metric || {}
      this.dialogVisible = true
    },
    save () {
      this.$refs.evidenceForm.validate(async valid => {
        if (!valid) return
        this.saving = true
        try {
          const payload = {
            ...this.form,
            observedAt: this.formatObservedAt(this.form.observedAt)
          }
          await saveManualEvidence(this.assessmentId, this.metric.metricCode, payload)
          this.$message.success('人工证据已保存，评分结果已更新')
          this.dialogVisible = false
          this.$emit('saved')
        } catch (error) {
          this.$message.error(error.message || '保存人工证据失败')
        } finally {
          this.saving = false
        }
      })
    },
    formatObservedAt (value) {
      if (!value || /(Z|[+-]\d{2}:\d{2})$/i.test(value)) return value

      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value

      const offsetMinutes = -date.getTimezoneOffset()
      const sign = offsetMinutes >= 0 ? '+' : '-'
      const absoluteOffset = Math.abs(offsetMinutes)
      const hours = String(Math.floor(absoluteOffset / 60)).padStart(2, '0')
      const minutes = String(absoluteOffset % 60).padStart(2, '0')
      return `${value}${sign}${hours}:${minutes}`
    },
    resetForm () {
      this.assessmentId = null
      this.metric = {}
      this.form.sourceUrl = ''
      this.form.summary = ''
      this.form.observedAt = ''
      this.$nextTick(() => this.$refs.evidenceForm && this.$refs.evidenceForm.clearValidate())
    }
  }
}
</script>
