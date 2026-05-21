<template>
  <el-dialog
    title="标记开源"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    @close="pageData.pageNum = 1000"
    width="600px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <el-form
      v-loading="loading"
      label-width="160px"
      size="medium"
      ref="form"
      style="padding-right: 50px;"
      :model="form"
      label-position="right"
    >
      <el-form-item prop="matchType" label="匹配等级：">
        <el-select v-model="form.matchType" class="w-full">
          <el-option label="文件级" :value="0"></el-option>
          <el-option label="代码片段级" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="project" label="匹配开源项目：">
        <el-select-v2  v-model="form.projectId"
                       :options="projectOptions"
                       filterable
                       class="w-full"
                       :extra-props="{ label: 'projectName', value: 'projectId' }"
                       @change="changeProject">
        </el-select-v2>
      </el-form-item>
      <el-form-item prop="matchOpenProjectVersion" label="开源项目版本号：" >
        <el-select
          v-model="form.matchOpenProjectVersion"
          class="w-full"
          filterable
        >
          <el-option
            v-for="item in versionOptions"
            :value="item.version"
            :label="item.version"
            :key="item.version"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="matchOpenProjectLicense" label="开源项目许可证：">
        <el-input v-model="form.matchOpenProjectLicense" class="w-full" readonly>
        </el-input>
      </el-form-item>
      <el-form-item prop="projectUrl" label="开源项目地址：">
        <el-input v-model="form.matchOpenProjectUrl" readonly placeholder="开源项目许可证" class="w-full">
        </el-input>
      </el-form-item>
      <el-form-item prop="precision" label="备注：">
        <el-input
          class="w-full"
          type="textarea"
          placeholder="请输入内容"
          v-model="form.remark"
          maxlength="30"
          :rows="4"
          show-word-limit
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" style="width: 80px;" @click="confirm" size="medium">保存</el-button>
      <el-button @click="cancel" style="width: 80px;" size="medium">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getVersionList,
  getAllProject,
  getOpenLicense,
  updateSign
} from '@/api/home/assets/app/codeV4'
import to from '@/utils/await-to'
import { isObject } from '@/utils'
import ElSelectV2 from '@/components/public/SelectV2'
import bus from '@/views/home/scan/app/code/details/codeTraceability/layout/event'
import { toNumber } from 'lodash-es'
export default {
  name: 'MaskOpenDialog',
  components: { ElSelectV2 },
  data () {
    return {
      meta: {},
      projectPageInfo: {
        searchName: '',
        loading: false,
        page: 1,
        pageSize: 20,
        total: -1
      },
      projectInfo: {},
      dialogVisible: false,
      versionOptions: [],
      projectOptions: [],
      loading: false,
      form: {
        matchType: 0,
        projectId: undefined,
        matchOpenProjectName: undefined,
        matchOpenProjectUrl: undefined,
        remark: undefined,
        matchOpenProjectVersion: undefined,
        matchOpenProjectLicense: undefined
      },
      projectTotal: 0,
      pageData: {
        pageNum: 1, // 当前页
        pageSize: 1000, // 每页显示条数
        nameOrUrl: undefined
      }
    }
  },
  directives: {
    'el-select-loadmore': {
      bind (el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  methods: {
    async changeProject (v) {
      const item = this.projectOptions.find(item => item.projectId === v)
      this.form.matchOpenProjectUrl = get(item, 'projectUrl')
      this.form.matchOpenProjectName = get(item, 'projectName')
      await this.getVersionList(v)
      await this.getLicense(v)
    },

    // 提交
    confirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },

    async submit () {
      const params = {
        signStatus: 1,
        sourceFileIdList: isArray(this.meta) ? this.meta.map(item => item.sourceFileId) : [this.meta.sourceFileId],
        ...this.form,
        taskId: this.$route.query.taskId
      }
      delete params.project
      const [err] = await to(updateSign(params))
      if (err && err.message) {
        this.$message.error(err.message)
      } else {
        this.$emit('change')
        bus.$emit('markChange')
        this.$message.success('操作成功')
        this.dialogVisible = false
      }
    },

    // 取消
    cancel () {
      this.dialogVisible = false
    },

    async getLicense (v) {
      const [err, res] = await to(getOpenLicense({
        openProjectId: v,
        language: this.projectInfo.language

      }))
      if (err && err.message) {
        this.$message.error(err.message)
      } else {
        this.form.matchOpenProjectLicense = get(res, 'data', []).join('，')
      }
    },

    async getAllProject () {
      const [err, res] = await to(getAllProject({
        loading: false,
        pageSize: 10000,
        pageNum: 1,
        language: this.projectInfo.language
      }))
      if (err && err.message) {
        this.$message.error(err.message)
      } else {
        this.projectOptions = get(res, 'data.records', [])
      }
    },

    async getVersionList (id) {
      const [error, res] = await to(getVersionList({
        loading: false,
        language: this.projectInfo.language,
        projectId: id,
        pageSize: 10000
      }))
      if (isObject(error) && error.message) {
        this.$message.error(error.message)
      } else {
        this.versionOptions = this.get(res, 'data', []).map(item => ({ version: item }))
      }
    },

    getBaseInfo () {
      const data = this.projectInfo
      this.form.matchOpenProjectLicense = get(data, 'licenses', []).join('、')
      this.form.matchOpenProjectName = get(data, 'projectName')
      this.form.projectId = get(data, 'projectName')
      this.form.matchOpenProjectVersion = get(data, 'version')
      this.form.matchOpenProjectUrl = get(data, 'fromUrl')
      this.form.matchType = toNumber(this.$route.query.matchType) || 0
    },

    async open (row, projectInfo) {
      this.form = this.$options.data().form
      this.meta = row
      this.projectInfo = projectInfo
      this.dialogVisible = true
      this.getBaseInfo()
      this.loading = true
      await this.getAllProject()
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.form-item-language {
  :deep(.el-form-item__label) {
    flex: none !important;
  }
}
</style>
