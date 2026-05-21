<template>
  <el-drawer :visible.sync="visible" size="540px" :modal="false">
    <div class="title" slot="title">
      <i class="iconfont iconmoshi text-regular"></i>
      <span>{{ taskInfo.applicationName || '应用包信息' }}</span>
      <span class="m-r-5">@{{ get(taskInfo, 'version') }}</span>
    </div>
    <el-form label-width="120px" label-position="left" style="padding: 0 25px;">
      <el-form-item label="所属项目">
        {{get(taskInfo, 'projectName', '-')}}
      </el-form-item>
      <el-form-item label="应用包大小">
        {{ get(taskInfo, 'packageSize', 0) | byteSize }}
      </el-form-item>
      <el-form-item label="检测状态">
        <el-tooltip v-if="[2].includes(taskInfo.status)" class="item" effect="dark" :content="matching(statusOptions, taskInfo.status, 'value', 'text')" placement="top">
          <oss-progress :percentage="get(taskInfo,'progress', 60)"></oss-progress>
        </el-tooltip>
        <oss-dot v-else :type="matching(statusOptions, taskInfo.status, 'value', 'type')">
          {{ matching(statusOptions, taskInfo.status, 'value', 'text') }}
        </oss-dot>
      </el-form-item>
      <el-form-item label="检测精度">
        {{get(taskInfo, 'matchType') === 0 ? '文件级' : get(taskInfo, 'matchType') === 1 ? '代码片段级' : '-' }}
      </el-form-item>
      <el-form-item label="检测语言">
        {{get(taskInfo, 'languageList', []).join('、')}}
      </el-form-item>
      <el-form-item label="上传时间">
        {{ taskInfo.createDate || '-' }}
      </el-form-item>
      <el-form-item label="开始检测">
        {{ taskInfo.detectStartTime || '-' }}
      </el-form-item>
      <el-form-item label="检测完成">
        {{ taskInfo.detectEndTime || '-' }}
      </el-form-item>
      <el-form-item label="检测时长">
        {{ taskInfo.detectTime || '-' }}
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
          value: 0,
          text: '未检测',
          type: 'info',
          progress: 10
        },
        {
          value: 1,
          text: '排队中',
          type: 'warning',
          progress: 30
        },
        {
          value: 2,
          text: '检测中',
          type: 'primary',
          progress: 70
        },
        {
          value: 3,
          text: '检测完成',
          type: 'success',
          progress: 100
        },
        {
          value: 4,
          text: '检测失败',
          type: 'warning',
          progress: 100
        },
        {
          value: 5,
          text: '检测超时',
          type: 'danger',
          progress: 100
        },
        {
          value: 6,
          text: '暂停检测',
          type: 'info',
          progress: 100
        },
        {
          value: 7,
          text: '取消检测',
          type: 'info',
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
