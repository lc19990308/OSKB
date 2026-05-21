<template>
  <div class="view-warp">
    <el-form :model="form" label-width="150px" :rules="rules" ref="form" size="medium" label-position="right">
      <el-form-item prop="projectId" label="所属项目：" ref="projectItem">
        <el-select-v2-project class="w-full" placeholder="请输入项目名" v-model="form.projectId" v-if="project.id === -1"></el-select-v2-project>
        <el-input
          v-model="project.name"
          v-else
          disabled
          class="w-full"
        ></el-input>
      </el-form-item>
      <el-form-item label="FireFly地址：" prop="url">
        <el-input class="w-full" v-model="form.url" placeholder='请输入服务器IP地址，例如：ip:port(端口非必填)'></el-input>
      </el-form-item>
      <el-form-item label="用户名密码：" style="margin-bottom: 10px;" :rules="[
          { required: true, message: '', trigger: ['blur', 'change'] }
        ]">
        <el-row class="w-full m-b-10">
          <el-col :span="11">
            <el-form-item :rules="rules.username" prop="username">
              <el-input v-model="form.username" class="w-full" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="12">
            <el-form-item :rules="rules.password" prop="password">
              <el-input v-model="form.password" class="w-full" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row class="w-full" type="flex" justify="space-between">
            <el-checkbox v-model="checked" @change="rememberHandle">记住用户名密码</el-checkbox>
          </el-row>
        </el-row>
      </el-form-item>
      <el-form-item label="是否启用SSL：" prop="sslEnable">
        <el-radio-group v-model="form.sslEnable">
          <el-radio :label="0">不启用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="FireFly项目名称：" prop="name" :rules="rules.name">
        <el-input class="w-full" v-model="form.name" placeholder="请输入仓库名称，对应FireFly系统中的项目名称"></el-input>
      </el-form-item>
      <el-form-item label="检测分支：" prop="branch" :rules="[
          { required: !form.label, message: '请输入FireFly分支名称', trigger: ['blur', 'change'] }
        ]">
        <el-input class="w-full" v-model="form.branch" placeholder="请输入FireFly分支名称"></el-input>
      </el-form-item>
      <el-form-item label="标记名称：" prop="label" :rules="[
          { required: !form.branch, message: '请输入FireFly系统中的标记名称', trigger: ['blur', 'change'] }
        ]">
        <el-input class="w-full" v-model="form.label" placeholder="请输入FireFly系统中的标记名称"></el-input>
      </el-form-item>
      <el-form-item label="仓库说明：" prop="description">
        <el-input class="w-full" show-word-limit v-model="form.description" :maxlength="100" :rows="3" type="textarea"
                  placeholder="请输入仓库说明"></el-input>
      </el-form-item>
      <el-form-item label="" style="margin-bottom: 0;">
        <div class="p-t-15 w-full text-center">
          <el-button type="primary" class="w-80" @click="confirm()" size="medium">保 存</el-button>
          <el-button @click="cancel" class="w-80 m-r-20" size="medium">返 回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add } from '@/api/home/scan/develop/repository/firefly'
import { localStore } from '@/utils'
import { mapState } from 'vuex'
import ElSelectV2Project from '@/views/home/project/conf/ElSelectV2Project'

export default {
  name: 'quick',
  components: { ElSelectV2Project },
  data () {
    // 校验name
    const validatorName = (rule, value, callback) => {
      if (value.length <= 30) {
        callback()
      } else {
        callback(new Error('不可超过30个字符'))
      }
    }

    return {
      dialogVisible: false,
      checked: false,
      loading: false,
      form: {
        url: '',
        username: '',
        password: '',
        projectId: '',
        description: '',
        name: '',
        sslEnable: 0,
        label: '',
        branch: ''
      },
      rules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: ['change', 'blur'] }
        ],
        url: [
          { required: true, message: '请输入FireFly地址', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '请输入FireFly系统中的项目名称', trigger: ['blur', 'change'] },
          { validator: validatorName, trigger: ['blur', 'change'] }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] }
        ],
        // label: [
        //   { required: !vm.form.branch, message: '请输入FireFly系统中的标记名称', trigger: ['blur', 'change'] }
        // ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      projectList: state =>
        state.home.projectList.map(item => ({ text: item.name, ...item }))
    }),
    project () {
      return this.$store.state.home.project
    }
  },
  methods: {
    // 提交
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },

    // 提交后端
    submit () {
      add(this.form).then(response => {
        this.$confirm('添加成功，是否继续添加？点击“确定”留在此页面继续添加其他仓库', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '返回列表页',
          type: 'success',
          customClass: 'svn-message-box'
        }).then(() => {
          this.resetForm()
        }).catch(() => {
          this.cancel()
        })
      }).catch(error => {
        if (error) {
          this.$message.error(error.message)
        }
      })
    },

    // 记住密码
    rememberHandle (v) {
      if (v) {
        localStore.set(this.$route.path, {
          checked: v,
          username: this.form.username,
          password: this.form.password
        })
      } else {
        localStore.remove(this.$route.path)
      }
    },

    resetForm () {
      this.$refs.form.resetFields()
      const cache = localStore.get(this.$route.path)
      if (cache && cache.checked) {
        this.checked = cache.checked
        this.form.password = cache.password
        this.form.username = cache.username
      }
      this.form.projectId = this.project.id === -1 ? null : this.project.id
    },
    // 取消
    cancel () {
      this.$router.push({ path: '/scan/develop/repository/list/firefly' })
    }
  },
  mounted () {
    this.resetForm()
    const obKeys = ['form.password', 'form.username']
    obKeys.forEach(key => {
      this.$watch(key, () => {
        this.rememberHandle(this.checked)
      })
    })
  }
}
</script>
<style scoped lang="scss">
.view-warp {
  width: 700px;
  margin: 0 auto;
  padding-top: 30px;
}

.header-alert {
  position: relative;
  margin-bottom: 32px;
  padding-left: 12px !important;
  padding-right: 12px !important;

  :deep(.el-alert__content) {
    width: 100% !important;
    display: block !important;
    padding: 0;

    .el-alert__description {
      margin: 0;
    }
  }

  .custom-alert-btn {
    width: 70px;
    height: 28px;
  }
}

:deep(.el-textarea .el-input__count) {
  color: #333;
}
</style>
