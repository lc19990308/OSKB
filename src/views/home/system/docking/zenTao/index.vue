<template>
  <div>
    <h1 class="h1">对接配置</h1>
    <el-form class="m-b-70" :model="form" label-width="150px" :rules="rules" ref="form" size="medium" label-position="right"
             v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="禅道地址：" prop="url">
            <el-input v-model="form.url" placeholder="请输入禅道地址" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="禅道用户名：" prop="user">
            <el-input v-model="form.user" placeholder="请输入禅道用户名" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="禅道密码：" prop="pwd">
            <el-input type="password" v-model="form.pwd" placeholder="请输入禅道密码" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-col :span="24" style="text-align: center;">
      <el-button type="primary" size="medium" @click="testJiraConfig()" class="w-100 m-r-20">测试连接</el-button>
      <el-button type="primary" size="medium" @click="setJiraConfig()" class="w-100">应用</el-button>
    </el-col>
  </div>
</template>

<script>
import { getJiraConfig, getList, setJiraConfig, testJiraConfig } from '@/api/home/system/docking/jira'

export default {
  name: 'ldap',
  data () {
    return {
      loading: false,
      form: {
        url: '',
        user: '',
        pwd: '',
        projectKey: '',
        issueTypeId: '',
        fieldList: []
      },
      valueListChinese: [],
      activeData: {},
      editIndex: 0,
      rules: {
        url: [
          { required: true, message: '请输入禅道地址', trigger: ['change', 'blur'] }
        ],
        user: [
          { required: true, message: '请输入禅道用户名', trigger: ['change', 'blur'] }
        ],
        pwd: [
          { required: true, message: '请输入禅道密码', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    // 测试配置
    testJiraConfig () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          testJiraConfig({
            ...this.form
          }).then(response => {
            this.$message.success('配置可用！')
          }).catch(error => {
            if (error.message) {
              this.$message.error(error.message)
            }
          })
        } else {
          return false
        }
      })
    },

    // 通过value匹配对应的值
    matchType (data, list) {
      let i = null
      list.forEach(x => {
        if (x.id === data) {
          i = x
        }
      })
      return i !== null ? i : ''
    },

    // 编辑数据类型列表
    edit (row, index) {
      this.activeData = { ...row }
      this.editIndex = index
      this.$refs.dialogAddProblemType.dialogVisible = true
      this.$refs.dialogAddProblemType.type = 'edit'
    },

    // 添加数据类型
    add () {
      this.$refs.dialogAddProblemType.dialogVisible = true
      this.$refs.dialogAddProblemType.type = 'add'
    },

    // 删除数据类型
    del (index) {
      this.form.fieldList.splice(index, 1)
      this.$message.success('删除成功')
    },

    // 回调函数
    addType (data) {
      this.form.fieldList.push(data)
    },
    editType (data) {
      this.$set(this.form.fieldList[this.editIndex], 'fieldKey', data.fieldKey)
      this.$set(this.form.fieldList[this.editIndex], 'type', data.type)
      this.$set(this.form.fieldList[this.editIndex], 'id', data.id)
    },

    // 设置配置
    setJiraConfig () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          setJiraConfig({
            ...this.form
          }).then(response => {
            this.$message.success('操作成功！')
            this.initJiraConfig()
          }).catch(error => {
            if (error.message) {
              this.$message.error(error.message)
            }
          })
        } else {
          return false
        }
      })
    },
    // 获取本平台字段列表
    getList () {
      getList({
        loading: false
      }).then(response => {
        this.valueListChinese = response.data
      }).catch(error => {
        if (error.message) {
          this.$message.error(error.message)
        }
      })
    },
    // 初始化配置
    initJiraConfig () {
      this.loading = true
      getJiraConfig({
        loading: false
      }).then(response => {
        this.loading = false
        const data = response.data

        for (const i in data) {
          if (i === 'fieldList') {
            this.form.fieldList = data[i] || []
          } else {
            this.form[i] = data[i] || ''
          }
        }

        /* this.form = {
          ...this.form,
          ...data,
          fieldList: this.form.fieldList || []
        } */
      }).catch(error => {
        this.loading = false
        if (error.message) {
          this.$message.error(error.message)
        }
      })
    }
  },
  mounted () {
    // this.initJiraConfig()
    // this.getList()
  }
}
</script>
<style lang="scss">
.view-content {
  overflow: hidden;
}

.h1 {
  color: #333;
  font-weight: bold;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0.2px;
  text-align: left;
  padding-left: 10px;
}

.item-center {
  align-items: center;
}
</style>
