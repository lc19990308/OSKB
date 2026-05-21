<template>
  <el-dialog
    v-bind="$attrs"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="550px"
    :close-on-click-modal="false"
    modal-append-to-body
    :destroy-on-close="true"
  >
    <el-form
      label-width="160px"
      ref="addTaskForm"
      size="medium"
      inline
      class="form"
      label-position="right"
    >
      <el-row>
        <el-form-item  label="报告维度：">
          <el-radio v-model="radio" :label="0">应用维度</el-radio>
          <el-radio v-model="radio" :label="1">项目维度</el-radio>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"   @click="confirm" size="medium">{{confirmText}}</el-button>
      <el-button @click="cancel"  size="medium">取 消</el-button>
      <div id="foot"></div>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'dialogSvnExport',
  props: {
    confirmText: {
      type: String,
      default: '导 出'
    }
  },
  data () {
    return {
      searchProject: '',
      radio: 0,
      loading: false,
      dialogVisible: false,
      title: '导出'
    }
  },
  methods: {
    openDialog () {
      this.radio = 0
      this.dialogVisible = true
    },
    // 提交
    confirm () {
      this.$emit('change', this.radio)
      this.dialogVisible = false
    },
    // 取消
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  padding-top: 40px;
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
