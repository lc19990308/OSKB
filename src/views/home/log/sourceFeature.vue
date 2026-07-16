<template>
  <el-main class="main source-feature-page">
    <div class="common-bg">
      <div class="workspace">
        <div class="module-panel">
          <div class="panel-title">业务模块</div>
          <div
            v-for="item in modules"
            :key="item.id"
            :class="['module-card', { active: currentModule.id === item.id }]"
            @click="selectModule(item)"
          >
            <div class="module-name">{{ item.name }}</div>
            <div class="module-business">{{ item.business }}</div>
            <div class="module-path">{{ item.sourcePath }}</div>
          </div>
        </div>

        <div class="operate-panel">
          <div class="selected-head">
            <div>
              <div class="selected-title">{{ currentModule.name }}</div>
              <div class="selected-desc">{{ currentModule.business }}</div>
            </div>
            <el-tag type="success">源码包不上传</el-tag>
          </div>

          <div class="process-flow">
            <div :class="['process-card', { done: currentModule.featureFile }]">
              <div class="process-top">
                <span class="process-index">1</span>
                <span class="process-name">源码特征文件</span>
              </div>
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-document"
                :loading="featureLoading"
                @click="generateFeature"
              >
                生成
              </el-button>
              <div class="process-result">{{ currentModule.featureFile || '未生成' }}</div>
              <div class="process-meta">{{ currentModule.featureSummary || '从当前业务源码中提取接口、调用关系、依赖配置' }}</div>
            </div>
            <div class="flow-arrow">→</div>
            <div :class="['process-card', { done: currentModule.fingerprintFile, disabled: !currentModule.featureFile }]">
              <div class="process-top">
                <span class="process-index">2</span>
                <span class="process-name">源码指纹文件</span>
              </div>
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-connection"
                :disabled="!currentModule.featureFile"
                :loading="fingerprintLoading"
                @click="extractFingerprint"
              >
                提取
              </el-button>
              <div class="process-result">{{ currentModule.fingerprintFile || '未提取' }}</div>
              <div class="process-meta">{{ currentModule.fingerprintSummary || '生成源码特征文件后可提取本地源码指纹' }}</div>
            </div>
            <div class="flow-arrow">→</div>
            <div :class="['process-card', { done: currentModule.taskNo, disabled: !currentModule.featureFile || !currentModule.fingerprintFile }]">
              <div class="process-top">
                <span class="process-index">3</span>
                <span class="process-name">检测任务</span>
              </div>
              <el-button
                type="success"
                size="medium"
                icon="el-icon-upload2"
                :disabled="!currentModule.featureFile || !currentModule.fingerprintFile"
                :loading="uploadLoading"
                @click="uploadResult"
              >
                上传检测
              </el-button>
              <div class="process-result">{{ currentModule.taskNo || '未上传' }}</div>
              <div class="process-meta">{{ currentModule.uploadSummary || '只上传特征文件和指纹文件，源码包不上传' }}</div>
            </div>
          </div>

          <div class="detail-box">
            <div class="detail-title">当前业务输入</div>
            <el-descriptions :column="2" border size="medium">
              <el-descriptions-item label="Jenkins任务">{{ currentModule.job }}</el-descriptions-item>
              <el-descriptions-item label="构建节点">{{ currentModule.agent }}</el-descriptions-item>
              <el-descriptions-item label="源码目录">{{ currentModule.sourcePath }}</el-descriptions-item>
              <el-descriptions-item label="业务负责人">{{ currentModule.owner }}</el-descriptions-item>
              <el-descriptions-item label="提取范围" :span="2">{{ currentModule.extractScope }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
    </div>

    <div class="common-bg">
      <div class="common-header">模块筛选节点数据</div>
      <div class="table-wrap">
        <el-table :data="modules" class="w-full" stripe>
          <el-table-column prop="name" label="业务模块" min-width="150" show-overflow-tooltip />
          <el-table-column prop="business" label="具体业务" min-width="190" show-overflow-tooltip />
          <el-table-column prop="featureFile" label="源码特征文件" min-width="240" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ row.featureFile || '-' }}</template>
          </el-table-column>
          <el-table-column prop="fingerprintFile" label="源码指纹文件" min-width="240" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ row.fingerprintFile || '-' }}</template>
          </el-table-column>
          <el-table-column prop="taskNo" label="检测任务" min-width="180" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ row.taskNo || '-' }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="110">
            <template slot-scope="{ row }">
              <span :class="statusClass(row.status)">{{ row.status }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="common-bg">
      <div class="common-header">操作日志</div>
      <div class="log-list">
        <div v-for="item in logs" :key="item.id" class="log-item">
          <div class="log-time">{{ item.time }}</div>
          <div class="log-type">{{ item.type }}</div>
          <div class="log-detail">{{ item.detail }}</div>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
const nowText = () => {
  const date = new Date()
  const pad = value => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export default {
  name: 'SourceFeatureLog',
  data () {
    const modules = [
      {
        id: 'order-api',
        name: 'order-api',
        business: '订单创建、订单查询接口',
        sourcePath: '/data/jenkins/workspace/procurement-order-service/order-api',
        extractScope: 'OrderCreateController、OrderQueryService、OrderDTO、pom.xml',
        job: 'procurement-order-service-source-check',
        agent: 'jenkins-agent-01',
        owner: '交易域研发组',
        featureFile: 'order-api-feature-20260708.json',
        featureSummary: '已提取 OrderCreateController、OrderQueryService、OrderDTO、pom.xml',
        fingerprintFile: 'order-api-fingerprint-20260708.fp',
        fingerprintSummary: '本地生成源码指纹 584 条',
        taskNo: 'task-238-order-api-source-check',
        uploadSummary: '已上传特征文件和指纹文件，源码包未上传',
        status: '已上传检测'
      },
      {
        id: 'order-core',
        name: 'order-core',
        business: '订单金额计算、订单状态流转',
        sourcePath: '/data/jenkins/workspace/procurement-order-service/order-core',
        extractScope: 'OrderAmountCalculator、OrderStateMachine、OrderRiskPolicy',
        job: 'procurement-order-service-source-check',
        agent: 'jenkins-agent-01',
        owner: '交易域研发组',
        featureFile: 'order-core-feature-20260708.json',
        featureSummary: '已提取 OrderAmountCalculator、OrderStateMachine、OrderRiskPolicy',
        fingerprintFile: 'order-core-fingerprint-20260708.fp',
        fingerprintSummary: '本地生成源码指纹 912 条',
        taskNo: 'task-238-order-core-source-check',
        uploadSummary: '已上传特征文件和指纹文件，源码包未上传',
        status: '已上传检测'
      },
      {
        id: 'approval-center',
        name: 'approval-center',
        business: '采购审批流、审批节点回调',
        sourcePath: '/data/jenkins/workspace/procurement-order-service/approval-center',
        extractScope: 'ApprovalTaskService、ApprovalCallbackController、workflow.yml',
        job: 'approval-center-source-check',
        agent: 'jenkins-agent-02',
        owner: '审批平台组',
        featureFile: 'approval-center-feature-20260708.json',
        featureSummary: '已提取 ApprovalTaskService、ApprovalCallbackController、workflow.yml',
        fingerprintFile: 'approval-center-fingerprint-20260708.fp',
        fingerprintSummary: '本地生成源码指纹 736 条',
        taskNo: 'task-238-approval-source-check',
        uploadSummary: '已上传特征文件和指纹文件，源码包未上传',
        status: '已上传检测'
      },
      {
        id: 'payment-adapter',
        name: 'payment-adapter',
        business: '支付回调、退款状态同步',
        sourcePath: '/data/jenkins/workspace/procurement-order-service/payment-adapter',
        extractScope: 'PaymentCallbackHandler、RefundSyncJob、PaymentSignUtil',
        job: 'payment-adapter-source-check',
        agent: 'jenkins-agent-02',
        owner: '支付平台组',
        featureFile: 'payment-adapter-feature-20260708.json',
        featureSummary: '已提取 PaymentCallbackHandler、RefundSyncJob、PaymentSignUtil',
        fingerprintFile: 'payment-adapter-fingerprint-20260708.fp',
        fingerprintSummary: '本地生成源码指纹 1,095 条',
        taskNo: 'task-238-payment-source-check',
        uploadSummary: '已上传特征文件和指纹文件，源码包未上传',
        status: '已上传检测'
      },
      {
        id: 'supplier-settlement',
        name: 'supplier-settlement',
        business: '供应商结算、对账单生成',
        sourcePath: '/data/jenkins/workspace/procurement-order-service/supplier-settlement',
        extractScope: 'SettlementBillService、SupplierAccountClient、ReconcileRule',
        job: 'supplier-settlement-source-check',
        agent: 'jenkins-agent-03',
        owner: '结算平台组',
        featureFile: 'supplier-settlement-feature-20260708.json',
        featureSummary: '已提取 SettlementBillService、SupplierAccountClient、ReconcileRule',
        fingerprintFile: 'supplier-settlement-fingerprint-20260708.fp',
        fingerprintSummary: '本地生成源码指纹 641 条',
        taskNo: 'task-238-settlement-source-check',
        uploadSummary: '已上传特征文件和指纹文件，源码包未上传',
        status: '已上传检测'
      }
    ]
    return {
      modules,
      currentModule: modules[0],
      featureLoading: false,
      fingerprintLoading: false,
      uploadLoading: false,
      logs: [
        {
          id: 1,
          time: '2026-07-08 22:45:01',
          type: '源码特征文件提取',
          detail: '业务:订单创建与订单查询；模块:order-api；生成:order-api-feature-20260708.json。'
        },
        {
          id: 2,
          time: '2026-07-08 22:45:02',
          type: '本地源码指纹生成',
          detail: '业务:订单金额计算与状态流转；模块:order-core；生成:order-core-fingerprint-20260708.fp。'
        },
        {
          id: 3,
          time: '2026-07-08 22:45:07',
          type: '提取结果上传检测',
          detail: '业务:订单创建与订单查询；源码包上传:否；上传特征文件和指纹文件；平台任务:task-238-order-source-check。'
        }
      ],
      logId: 4
    }
  },
  methods: {
    selectModule (item) {
      this.currentModule = item
    },
    generateFeature () {
      this.featureLoading = true
      window.setTimeout(() => {
        const file = `${this.currentModule.id}-feature-20260708.json`
        this.$set(this.currentModule, 'featureFile', file)
        this.$set(this.currentModule, 'featureSummary', `已提取 ${this.currentModule.extractScope}`)
        this.$set(this.currentModule, 'status', '已生成特征')
        this.unshiftLog('源码特征文件提取', `业务:${this.currentModule.business}；模块:${this.currentModule.name}；从 ${this.currentModule.sourcePath} 提取源代码特征；生成:${file}。`)
        this.featureLoading = false
      }, 500)
    },
    extractFingerprint () {
      this.fingerprintLoading = true
      window.setTimeout(() => {
        const file = `${this.currentModule.id}-fingerprint-20260708.fp`
        const count = this.currentModule.id.length * 73
        this.$set(this.currentModule, 'fingerprintFile', file)
        this.$set(this.currentModule, 'fingerprintSummary', `本地生成源码指纹 ${count} 条`)
        this.$set(this.currentModule, 'status', '已提取指纹')
        this.unshiftLog('本地源码指纹生成', `业务:${this.currentModule.business}；模块:${this.currentModule.name}；在 Jenkins 节点 ${this.currentModule.agent} 本地生成源码指纹文件；生成:${file}。`)
        this.fingerprintLoading = false
      }, 500)
    },
    uploadResult () {
      this.uploadLoading = true
      window.setTimeout(() => {
        const taskNo = `task-238-${this.currentModule.id}-source-check`
        this.$set(this.currentModule, 'taskNo', taskNo)
        this.$set(this.currentModule, 'uploadSummary', `已上传 ${this.currentModule.featureFile} 和 ${this.currentModule.fingerprintFile}`)
        this.$set(this.currentModule, 'status', '已上传检测')
        this.unshiftLog('提取结果上传检测', `业务:${this.currentModule.business}；模块:${this.currentModule.name}；源码包上传:否；上传文件:${this.currentModule.featureFile},${this.currentModule.fingerprintFile}；平台任务:${taskNo}。`)
        this.uploadLoading = false
      }, 500)
    },
    unshiftLog (type, detail) {
      this.logs.unshift({
        id: this.logId++,
        time: nowText(),
        type,
        detail
      })
    },
    statusClass (status) {
      if (status === '已上传检测') return 'text-success'
      if (status === '已提取指纹' || status === '已生成特征') return 'text-primary'
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.source-feature-page {
  .common-bg + .common-bg {
    margin-top: 20px;
  }
}

.workspace {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 20px;
  padding: 24px 30px 30px;
}

.panel-title,
.detail-title {
  margin-bottom: 12px;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.module-panel {
  min-width: 0;
}

.module-card {
  padding: 14px 16px;
  margin-bottom: 10px;
  cursor: pointer;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;

  &.active {
    background: #eff6ff;
    border-color: #2563eb;
  }
}

.module-name {
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
}

.module-business {
  margin-top: 6px;
  color: #475569;
  font-size: 13px;
}

.module-path {
  margin-top: 6px;
  color: #94a3b8;
  font-size: 12px;
  word-break: break-all;
}

.operate-panel {
  min-width: 0;
  padding: 18px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.selected-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.selected-title {
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
}

.selected-desc {
  margin-top: 6px;
  color: #64748b;
}

.process-flow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 34px minmax(0, 1fr) 34px minmax(0, 1fr);
  align-items: stretch;
  gap: 10px;
  margin-bottom: 20px;
}

.process-card {
  display: flex;
  flex-direction: column;
  min-height: 190px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 8px;

  &.done {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  &.disabled {
    background: #f8fafc;
    opacity: 0.72;
  }

  .el-button {
    align-self: flex-start;
    min-width: 118px;
    margin: 12px 0;
  }
}

.process-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.process-index {
  width: 28px;
  height: 28px;
  color: #fff;
  line-height: 28px;
  text-align: center;
  background: #2563eb;
  border-radius: 50%;
}

.process-name {
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
}

.process-result {
  min-height: 44px;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.45;
  word-break: break-all;
}

.process-meta {
  margin-top: 8px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.flow-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 24px;
  font-weight: 600;
}

.detail-box {
  margin-top: 8px;
}

.table-wrap {
  padding: 20px 20px 26px;
}

.log-list {
  padding: 20px 30px 30px;
}

.log-item {
  display: grid;
  grid-template-columns: 170px 150px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #edf2f7;
}

.log-time {
  color: #64748b;
  font-size: 13px;
}

.log-type {
  color: #1f2937;
  font-weight: 600;
}

.log-detail {
  color: #475569;
  line-height: 1.7;
}

@media (max-width: 1200px) {
  .workspace,
  .process-flow,
  .log-item {
    grid-template-columns: 1fr;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }
}
</style>
