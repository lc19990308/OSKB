<template>
  <el-drawer :visible.sync="visible" size="540px" :modal="false">
    <div class="title" slot="title">
      <i class="iconfont iconmoshi text-regular"></i>
      <span class="m-r-15">{{ createStrSuffix(taskInfo.name, 30) }}</span>
      <level-tag class="m-b-5" :level="taskInfo.securityLevel"></level-tag>
    </div>
    <el-form label-width="100px" label-position="left" style="padding: 0 25px;">
      <el-form-item label="仓库地址">
        <el-link target="_blank" :underline="false" :href="taskInfo.url"> {{ taskInfo.url }} </el-link>
      </el-form-item>
      <el-form-item label="检测大小">
        {{ taskInfo.byteSize | byteSize }}
      </el-form-item>
      <el-form-item label="开始检测">
        {{
          taskInfo.startDate || "-"
        }}
      </el-form-item>
      <el-form-item label="检测完成">
        {{
          taskInfo.finishDate || "-"
        }}
      </el-form-item>
      <el-form-item label="检测时长">
        {{
          taskInfo.detectDuration || "-"
        }}
      </el-form-item>
      <el-form-item label="定时检测">
        <template v-if="taskInfo.scheduleTaskSwitchStatus === '1'">
          {{`每${
          taskInfo.scheduleTaskFrequencyType === '1'
            ? '天'
            : matching(
              weekOptions,
              taskInfo.scheduleTaskDayOfWeek / 1,
              'value',
              'label'
            )
        }${taskInfo.scheduleTaskTimeOfDay}`}}
        </template>
        <template v-else>-</template>
      </el-form-item>
      <el-form-item label="检测规则">
        <div style="background: rgba(242, 242, 242, 0.4);border-radius: 4px;padding: 10px;line-height: 30px;">
          <div>审查方式：{{ taskInfo.checkType === 0 ? '快速审查' : taskInfo.checkType === 1 ? '深度审查' : '' }}</div>
          <div>解析深度：{{ taskInfo.deepLimit > -1 ? taskInfo.deepLimit + '层' : '默认层级' }}</div>
          <div>数据清洗：{{ taskInfo.cleanLevel === 1 ? '快速清洗' : taskInfo.cleanLevel === 2 ? '深度清洗' : '' }}</div>
        </div>
      </el-form-item>
      <el-form-item label="仓库说明">
        <div style="background: rgba(242, 242, 242, 0.4);border-radius: 4px;padding: 10px;line-height: 30px;">
          {{get(taskInfo, 'description', '-')}}
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
      sourceOptions: [],
      weekOptions: []
    }
  },
  methods: {
    open (taskInfo, weekOptions) {
      this.weekOptions = weekOptions
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
