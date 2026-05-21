<template>
  <el-drawer :visible.sync="visible" size="540px" :modal="false">
    <div class="title" slot="title">
      <i class="iconfont iconmoshi text-regular"></i>
      <span>{{ taskInfo.realPackageName || '应用包信息' }}</span>
      <span class="m-r-5">@{{ get(taskInfo, 'version') }}</span>
      <level-tag class="m-b-5" :level="taskInfo.securityLevel"></level-tag>
    </div>
    <el-form label-width="100px" label-position="left" style="padding: 0 25px;">
      <el-form-item label="大小">
        {{ taskInfo.byteSize | byteSize }}
      </el-form-item>
      <el-form-item label="上传时间">
        {{ taskInfo.uploadDate || '-' }}
      </el-form-item>
      <el-form-item label="检测状态">
        <oss-dot :type="matching(statusOptions, taskInfo.status, 'value', 'type')">
          {{ matching(statusOptions, taskInfo.status, 'value', 'text') }}
        </oss-dot>
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
          <div>审查方式：{{ taskInfo.checkType === 0 ? '快速审查' : taskInfo.checkType === 1 ? '深度审查' : '' }}</div>
          <div>解析深度：{{ taskInfo.deepLimit > -1 ? taskInfo.deepLimit + '层' : '默认层级' }}</div>
          <div>数据清洗：{{ taskInfo.cleanLevel === 1 ? '快速清洗' : taskInfo.cleanLevel === 2 ? '深度清洗' : '' }}</div>
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  name: 'DescDrawer',
  components: {},

  data () {
    return {
      visible: false,
      taskInfo: {},
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
      ]
    }
  },
  methods: {
    open (taskInfo) {
      this.taskInfo = taskInfo
      this.visible = true
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
