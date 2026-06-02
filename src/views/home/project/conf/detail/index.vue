<template>
  <div>
    <DialogExportSBOM ref="exportSBOM"/>
    <dialog-add-project ref="addProject" @editCallback="getProjectInfo"></dialog-add-project>
    <dialogNotificationConfig @change="getProjectInfo" ref="notificationConfig" />
    <div class="view-content top-bar m-b-20" style="padding: 20px 20px 10px 20px;" v-loading="loading">
      <div style="height: 100%;">
        <div>
          <span class="font-lg font-bold m-r-20">{{projectDetails.name}}</span>
          <icon-button
            :disabled="!( authorityFilter(104) && (get(projectDetails,'principal.username', '-') === userInfo.username || userInfo.roleId === 1))"
            tooltip-content="编辑"
            class="iconbianji1 m-r-20"
            @click="editProject"
          ></icon-button>
          <el-button v-if="authorityFilter(110)" class="plain-button" plain size="small"
                     @click="$refs.notificationConfig.open(projectDetails)">
            消息通知</el-button>
          <el-button class="plain-button" plain size="small" @click="exportSBOM">导出SBOM</el-button>
        </div>
        <div>
          <el-form label-width="90px" label-position="left">
            <el-form-item label="负责人：" style="margin-bottom: 5px;">
              {{ get(projectDetails,'principal.username', '-') }}
            </el-form-item>
            <el-form-item label="项目成员：" style="margin-bottom: 5px;">
              {{get(projectDetails,'members', []).map(item => item.username).join('、')}}
            </el-form-item>
            <el-form-item label="项目描述：" style="margin-bottom: 5px;">{{projectDetails.description || '-'}}</el-form-item>
          </el-form>
        </div>
      </div>
      <div style="flex: 1; padding-left: 50px;padding-top: 29px;">
        <el-form label-width="90px" label-position="left">
          <el-form-item label="消息通知：" style="margin-bottom: 5px;">
          {{get(projectDetails,'notificationConfig.mailNoticeSwitch', 0) === 1 ? '已开启' : '未开启'}}
          <template v-if="get(projectDetails,'notificationConfig.mailNoticeSwitch', 0) === 1">
            <el-form-item label="漏洞：" style="margin-bottom: 0;">
              <template v-if="!!get(projectDetails,'notificationConfig.vulNoticeLevelList', []).length">
                {{
                  vulOptions
                    .filter(item => get(projectDetails,'notificationConfig.vulNoticeLevelList', []).includes(item.value))
                    .map(item => item.label)
                    .join('、')
                }}
              </template>
              <template v-else>-</template>
            </el-form-item>
            <el-form-item label="组件：" style="margin-bottom: 0;">
              <template v-if="!!get(projectDetails,'notificationConfig.componentNoticeLevelList', []).length">
                {{
                  vulOptions
                    .filter(item => get(projectDetails,'notificationConfig.componentNoticeLevelList', []).includes(item.value))
                    .map(item => item.label)
                    .join('、')
                }}
              </template>
              <template v-else>-</template>
            </el-form-item>
            <el-form-item label="许可证：" style="margin-bottom: 0;">
              <template v-if="!!get(projectDetails,'notificationConfig.licenseNoticeLevelList', []).length">
                {{
                  licenceOptions
                    .filter(item => get(projectDetails,'notificationConfig.licenseNoticeLevelList', []).includes(item.value))
                    .map(item => item.label)
                    .join('、')
                }}
              </template>
              <template v-else>-</template>
            </el-form-item>
            <el-form-item label="通知人员：" style="margin-bottom: 0;">
              <template v-if="!!get(projectDetails,'notificationConfig.users', []).length">
                {{
                  get(projectDetails, 'notificationConfig.users', [])
                    .map(item => item.username)
                    .join('、')
                }}
              </template>
              <template v-else>-</template>
            </el-form-item>
          </template>
        </el-form-item>
        </el-form>
      </div>
      <div style="height: 120px;width: 120px;">
        <el-progress type="circle" :format="format" :percentage="90" :width="120"
                     :color="customColorMethod" :stroke-width="12"></el-progress>
      </div>
    </div>
    <div class="view-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="数据概览" name="/project/conf/details/overview"></el-tab-pane>
        <el-tab-pane label="应用列表" name="/project/conf/details/app"></el-tab-pane>
      </el-tabs>
      <router-view :key="$route.query.id" :project="projectDetails"></router-view>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/home/project/conf'
import { to } from '@/utils'
import DialogExportSBOM from '@/views/home/report/report/dialogExportSBOM.vue'
import { downloadProjectSBOMReport } from '@/api/home/report'
import DialogAddProject from '@/components/dialog/dialogAddProject.vue'
import { mapState } from 'vuex'
import { allUser } from '@/api/home/user'
import DialogNotificationConfig from '@/views/home/project/conf/detail/dialogNotificationConfig.vue'

const colors = {
  1: {
    color: '#8B1A1A',
    text: '严重'
  },
  2: {
    color: '#D9534F',
    text: '高危'
  },
  3: {
    color: '#D4932A',
    text: '中危'
  },
  4: {
    color: '#2C5F8A',
    text: '低危'
  },
  5: {
    color: '#4A9C8C',
    text: '无漏洞'
  }
}

export default {
  name: 'projectInfo',
  components: { DialogNotificationConfig, DialogAddProject, DialogExportSBOM },
  data () {
    return {
      level: 5,
      projectId: this.$route.query.id,
      projectDetails: {},
      loading: false,
      licenceOptions: [
        {
          label: '高风险',
          value: 1,
          color: 'text-danger',
          key: 'licenseHigh'
        },
        {
          label: '中风险',
          value: 2,
          color: 'text-warning',
          key: 'licenseMedium'
        },
        {
          label: '低风险',
          value: 3,
          color: 'text-primary',
          key: 'licenseLow'
        }
      ],
      vulOptions: [
        {
          label: '严重',
          value: 1,
          color: 'text-severity',
          key: 'vulnerabilitySerious'
        },
        {
          label: '高危',
          value: 2,
          color: 'text-danger',
          key: 'vulnerabilityHigh'
        },
        {
          label: '中危',
          value: 3,
          color: 'text-warning',
          key: 'vulnerabilityMedium'
        },
        {
          label: '低危',
          value: 4,
          color: 'text-primary',
          key: 'vulnerabilityLow'
        }
      ],
      members: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo
    }),
    activeName: {
      get () {
        return this.$route.path
      },
      set (v) {
      }
    },
    customColorMethod () {
      return () => {
        return colors[this.level].color
      }
    },
    format () {
      return () => {
        return colors[this.level].text
      }
    }
  },
  methods: {
    handleClick (row) {
      this.$router.push({
        path: row.name,
        query: this.$route.query
      })
    },
    // 初始化所以用户
    async initUserList () {
      await allUser({ loading: false }).then(response => {
        this.userList = []
        if (response.data) {
          response.data.forEach(item => {
            this.userList.push({
              value: item.id,
              label: item.username
            })
          })
        }
      }).catch(error => {
        if (error && error.message) {
          this.$message.error(error.message)
        }
      })
    },
    // 编辑项目
    editProject () {
      this.$refs.addProject.type = 'edit'
      this.$refs.addProject.id = this.projectDetails.id
      this.$refs.addProject.dialogVisible = true
    },

    // 导出 SBOM
    exportSBOM () {
      this.$refs.exportSBOM.xhr = downloadProjectSBOMReport
      this.$refs.exportSBOM.form.projectId = this.projectDetails.id
      this.$refs.exportSBOM.form.reportName = this.projectDetails.name
      this.$refs.exportSBOM.dialogVisible = true
    },
    async getProjectInfo () {
      this.loading = true
      const [error, response] = await to(api.projectInfo(this.projectId))
      if (error && error.message) return this.$message.error(error.message)
      this.loading = false
      this.projectDetails = response.data || {}
      this.level = this.get(response, 'data.securityLevel', 5)
    }
  },
  created () {
    this.getProjectInfo()
    this.initUserList()
  }
}
</script>
<style scoped lang="scss">
.top-bar{
  display: flex;
  justify-content: space-between;
  //align-items: center;
}
</style>
