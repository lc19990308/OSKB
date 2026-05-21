<template>
  <el-dialog
    title="消息通知配置"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="700px"
    :close-on-click-modal="false"
>
    <el-form style="padding-left: 20px;" :model="formData" label-width="120px" ref="addProject" size="small"
             label-position="right">
      <el-form-item label="消息通知：">
        <el-switch v-model="formData.mailNoticeSwitch" :active-value="1"
                   :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="消息内容：" style="margin-bottom: 0;">
        <el-form-item label="漏洞：" label-width="70px">
          <el-checkbox-group v-model="formData.vulNoticeLevelList" :disabled="!formData.mailNoticeSwitch">
            <el-checkbox v-for="item in vulOptions" :class="item.color" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="组件：" label-width="70px">
          <el-checkbox-group v-model="formData.componentNoticeLevelList" :disabled="!formData.mailNoticeSwitch">
            <el-checkbox v-for="item in vulOptions" :class="item.color" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="许可证：" label-width="70px">
          <el-checkbox-group v-model="formData.licenseNoticeLevelList" :disabled="!formData.mailNoticeSwitch">
            <el-checkbox v-for="item in licenceOptions"  :class="item.color" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
      <el-form-item label-width="40px" style="margin-bottom: 0;">
        <div>通过用户中心配置的账号邮箱进行消息通知（默认发送给项目管理员）</div>
        <el-select-v2
          :disabled="!formData.mailNoticeSwitch"
          style="width: 500px;"
          ref="selectV2"
          filterable
          size="medium"
          v-model="formData.userIds"
          multiple
          placeholder="请选择成员"
          :options="userList"
          :extra-props="{ label: 'label', value: 'value' }"
        >
        </el-select-v2>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitEdit" size="medium" :loading="loading">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { projectUpdate } from '@/api/home/project'
import { allUser } from '@/api/home/user'
import ElSelectV2 from '@/components/public/SelectV2'
export default {
  name: 'DialogNotificationConfig',
  components: { ElSelectV2 },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      projectDetails: {},
      userList: [],
      index: null,
      rootUserList: [],
      formData: {
        vulNoticeLevelList: [],
        licenseNoticeLevelList: [],
        componentNoticeLevelList: [],
        userIds: [],
        mailNoticeSwitch: 0
      },
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
      ]
    }
  },
  methods: {
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
    // 选择项目成员
    selectUser () {
      let notSelectUser = true
      this.rootUserList = []
      this.userList.forEach(item => {
        if (this.formData.userIdList.includes(item.value)) {
          if (item.value === this.formData.userId) {
            notSelectUser = false
          }
          this.rootUserList.push(item)
        }
      })
      if (notSelectUser) {
        this.formData.userId = ''
      }
    },

    // 编辑项目时执行
    submitEdit () {
      projectUpdate({
        id: this.projectDetails.id,
        name: this.projectDetails.name,
        userIdList: this.projectDetails.userIdList,
        userId: this.projectDetails.userId,
        description: this.projectDetails.description,
        notificationConfig: {
          ...this.formData
        }
      }).then(response => {
        this.$message.success('操作成功！')
        this.dialogVisible = false
        this.$emit('change')
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 取消
    cancel () {
      this.dialogVisible = false
    },

    // 打开窗口时的回调
    async open (projectDetails) {
      this.dialogVisible = true
      this.projectDetails = projectDetails
      if (projectDetails) {
        if (projectDetails.notificationConfig) {
          Object.keys(this.formData).forEach(key => {
            this.formData[key] = projectDetails.notificationConfig[key]
          })
          this.$nextTick(() => {
            this.formData.userIds = projectDetails.notificationConfig.users.map(item => {
              this.$refs.selectV2.instance().cachedOptions.push({
                currentLabel: item.username, // 当前绑定的数据的label
                currentValue: item.id, // 当前绑定数据的value
                label: item.username, // 当前绑定的数据的label
                value: item.id // 当前绑定数据的value
              })
              return item.id
            })
          })
        } else if (projectDetails.principal) {
          this.$nextTick(() => {
            this.$refs.selectV2.instance().cachedOptions.push({
              currentLabel: projectDetails.principal.username, // 当前绑定的数据的label
              currentValue: projectDetails.principal.id, // 当前绑定数据的value
              label: projectDetails.principal.username, // 当前绑定的数据的label
              value: projectDetails.principal.id // 当前绑定数据的value
            })
            this.formData.userIds = [projectDetails.principal.id]
          })
        }
      }
    }
  },
  created () {
    this.initUserList()
  }
}
</script>
