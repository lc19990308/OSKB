<template>
  <div>
    <dialog-add-problem-type ref="dialogAddProblemType" :active-data="activeData" @add="addType" @edit="editType"></dialog-add-problem-type>
    <h1 class="h1">Jira对接配置</h1>
    <el-form :model="form" label-width="150px" :rules="rules" ref="form" size="medium" label-position="right"
             v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="jira地址：" prop="url">
            <el-input v-model="form.url" placeholder="请输入jira地址" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="jira用户名：" prop="user">
            <el-input v-model="form.user" placeholder="请输入jira用户名" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="jira密码：" prop="pwd" :rules=" [
          { required: pwdRequired, message: '请输入jira密码', trigger: ['blur'] }
        ]">
            <el-input type="password" v-model="form.pwd" placeholder="请输入jira密码" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="jira绑定项目Key：" prop="projectKey">
            <el-input v-model="form.projectKey" placeholder="请输入jira绑定项目Key" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问题类型Id：" prop="issueTypeId">
            <el-input v-model="form.issueTypeId" type="issueTypeId" placeholder="请输入问题类型Id"
                      autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="m-b-15 flex item-center">
      <el-col :span="12">
        <h1 class="h1">问题类型</h1>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" v-if="authorityFilter(3311)" size="medium" class="right m-b-md w-80" @click="add">
          添加类型
        </el-button>
      </el-col>
    </el-row>
    <el-row class="m-b-70">
      <el-table
        :data="form.fieldList"
        type="index"
        style="width: 100%;">
        <el-table-column
          prop="fieldKey"
          label="jira平台字段">
        </el-table-column>
        <el-table-column
          prop="value"
          label="本平台字段">
          <template slot-scope="scope">
            {{ matchType(scope.row.id, valueListChinese).name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="数据类型">
        </el-table-column>
        <el-table-column
          prop="operating"
          width="150"
          label="操作" fixed="right">
          <template slot-scope="scope">
            <icon-button tooltip-content="编辑" v-if="authorityFilter(3313)"  class="iconliebiaoneibianji" @click="edit(scope.row,scope.$index)"></icon-button>
            <icon-button tooltip-content="删除" v-if="authorityFilter(3312)"  class="icondel" @click="del(scope.$index)"></icon-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-col :span="24" style="text-align: center;">
      <el-button type="primary" size="medium" @click="testJiraConfig()" v-if="authorityFilter(3315)"  class="w-100 m-r-20">测试连接</el-button>
      <el-button type="primary" size="medium" @click="setJiraConfig()" v-if="authorityFilter(3311)"  class="w-100">应用</el-button>
    </el-col>
  </div>
</template>

<script>
import { getJiraConfig, getList, setJiraConfig, testJiraConfig } from '@/api/home/system/docking/jira'
import DialogAddProblemType from './dialogAddProblemType'

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
      pwdRequired: false,
      rules: {
        url: [
          { required: true, message: '请输入jira地址', trigger: ['blur'] }
        ],
        user: [
          { required: true, message: '请输入jira用户名', trigger: ['blur'] }
        ],
        projectKey: [
          { required: true, message: '请输入jira绑定项目Key', trigger: ['blur'] }
        ],
        issueTypeId: [
          { required: true, message: '请输入问题类型Id', trigger: ['blur'] }
        ]
      }
    }
  },
  components: {
    DialogAddProblemType
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
      if (!this.authorityFilter(3314)) return
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
        this.pwdRequired = !response.data.url
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
        this.pwdRequired = true
        if (error.message) {
          this.$message.error(error.message)
        }
      })
    }
  },
  mounted () {
    this.initJiraConfig()
    this.getList()
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
