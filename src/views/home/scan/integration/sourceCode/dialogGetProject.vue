<template>
  <el-dialog
    title="请选择项目"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    :close-on-click-modal="false"
    modal-append-to-body
    :destroy-on-close="true"
  >
    <el-form
      :model="form"
      label-width="160px"
      :rules="rules"
      ref="addTaskForm"
      size="medium"
      inline
      class="form"
      label-position="right"
    >
      <el-row>
        <el-form-item prop="projectId" label="所属项目：" ref="projectItem">
          <el-select-v2-project style="width: 250px;" v-model="form.projectId"></el-select-v2-project>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"  @click="confirm" size="medium">{{confirmText}}</el-button>
      <el-button @click="cancel"  size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import ElSelectV2Project from '@/views/home/project/conf/ElSelectV2Project'
export default {
  name: 'dialogGetProject',
  components: { ElSelectV2Project },
  props: {
    confirmText: {
      type: String,
      default: '确 定'
    }
  },
  data () {
    return {
      rules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: ['change', 'blur'] }
        ]
      },
      searchProject: '',
      loading: false,
      dialogVisible: false,
      project: this.$store.state.home.project || {},
      form: {
        projectId: null
      }
    }
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
    },
    // 提交
    confirm () {
      this.$refs.addTaskForm.validate(valid => {
        if (valid) {
          this.$emit('change', this.form.projectId)
          this.cancel()
        } else {
          return false
        }
      })
    },
    // 取消
    cancel () {
      this.$refs.addTaskForm.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  padding-top: 20px;
  padding-left: 10px;
  min-height: 100px;

  .input {
    width: 100%;
    max-width: 260px;
  }

  .upload-page-btn {
    .iconfont {
      vertical-align: middle;
      margin-right: 2px;
    }

    padding-left: 15px;

    &:hover {
      cursor: pointer;
      color: $color-primary;
    }
  }
}
</style>
