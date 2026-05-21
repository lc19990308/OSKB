<template>
  <el-dialog
    title="新增"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="900px"
    @close="close"
    :before-close="handleClose">
    <el-form :model="form" label-width="180px" :rules="rules" ref="form" label-position="right">
      <el-form-item label="允许登录Ip:" prop="ip">
        <el-input v-model="form.ip" size="medium" placeholder="请输入IP地址"></el-input>
      </el-form-item>
      <el-form-item label="允许登录时段（日）：" prop="allDay">
        <el-radio-group v-model="form.allDay">
          <el-radio :label="1" >全天</el-radio>
          <el-radio :label="0">自定义</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.allDay === 0">
        <el-col :span="11">
          <el-form-item prop="dayStartTime">
            <el-time-picker
              v-model="form.dayStartTime"
              format='HH:mm'
              value-format='HH:mm'
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }"
              placeholder="开始时间">
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="dayEndTime">
            <el-time-picker
              v-model="form.dayEndTime"
              format='HH:mm'
              value-format='HH:mm'
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: form.dayStartTime
              }"
              placeholder="结束时间">
            </el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="允许登录时段（周）：" prop="weekAclList">
        <el-checkbox-group v-model="form.weekAclList">
          <el-checkbox v-for="item in weekList" :label="item.id" :key="item.id">{{item.type}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addIp } from '@/api/home/system/safety'
import { validateIp } from '@/utils/validate'

export default {
  name: 'DialogAddWhiteIp',
  data () {
    const isIp = (rule, value, callback) => {
      if (!validateIp(value)) {
        callback(new Error('请输入正确的ip'))
      } else {
        callback()
      }
    }

    const isWeekList = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择时段（周）'))
      } else {
        callback()
      }
    }

    return {
      type: 'add',
      userId: '',
      dialogVisible: false,
      passwordError: false,
      roleList: [],
      form: {
        ip: '',
        allDay: '',
        weekAclList: [],
        dayStartTime: '',
        dayEndTime: ''
      },
      weekList: [{
        type: '周一',
        id: 'monday'
      }, {
        type: '周二',
        id: 'tuesday'
      }, {
        type: '周三',
        id: 'wednesday'
      }, {
        type: '周四',
        id: 'thursday'
      }, {
        type: '周五',
        id: 'friday'
      }, {
        type: '周六',
        id: 'saturday'
      }, {
        type: '周天',
        id: 'sunday'
      }],
      rules: {
        ip: [
          { required: true, message: '请输入ip', trigger: 'change' },
          { validator: isIp, message: '请输入正确的ip', trigger: 'change' }
        ],
        allDay: [
          { required: true, message: '请选择时段（日）', trigger: 'change' }
        ],
        weekAclList: [
          { required: true, message: '请选择时段（周）', trigger: 'change' },
          { validator: isWeekList, message: '请选择时段（周）', trigger: 'change' }
        ],
        dayStartTime: [
          { required: true, message: '请选择允许登录开始时间', trigger: 'change' }
        ],
        dayEndTime: [
          { required: true, message: '请选择允许登录结束时间', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      done()
    },

    // 提交
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            this.submitAdd()
          }
        } else {
          return false
        }
      })
    },

    // 添加账号的时候执行
    submitAdd () {
      const week = {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      }

      this.form.weekAclList.forEach(item => {
        for (const i in week) {
          if (item === i) {
            week[i] = 1
          }
        }
      })

      addIp({
        ip: this.form.ip,
        allDay: this.form.allDay,
        dayStartTime: this.form.dayStartTime,
        dayEndTime: this.form.dayEndTime,
        ...week
      }).then(response => {
        this.$message.success('操作成功！')
        this.dialogVisible = false
        this.$refs.form.resetFields()
        this.$emit('callback')
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 取消
    cancel () {
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      this.dialogVisible = false
    },

    // 关闭窗口时的回调
    close () {
      this.form = {
        ip: '',
        allDay: '',
        weekAclList: [],
        dayStartTime: '',
        dayEndTime: ''
      }
    }
  }
}
</script>
<style lang="scss">
  .el-message-box__close {
    color: #000;
  }
</style>
<style scoped lang="scss">
  .el-form {
    padding: 15px 130px 0 40px;
  }

  .el-form-item {
    margin-bottom: 18px;
  }

  .el-checkbox {
    margin-right: 10px;
  }
</style>
