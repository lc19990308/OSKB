<template>
  <div class="view-content" v-loading="loading">
    <div class="view-header">
      <icon-button tooltip-disabled el-icon="el-icon-back" radius @click="back"></icon-button>
      配置Git
    </div>
    <dialog-git-conf ref="editConf" @callback="init"></dialog-git-conf>
    <el-row :gutter="20">
      <el-col
        :span="8"
        v-for="(value, key) in sortList"
        :key="key"
      >
        <div class="item-container">
          <div
            :class="[gitServerType[value.gitServerType].text, !value.hasConf ? 'has-conf' : '','logo-wrapper']"
          >
            <div class="center-wrapper">
              <img :src="gitServerType[value.gitServerType].img" alt="">
              <p v-if="!value.hasConf">
                <el-button size="medium" :disabled="[2].includes(value.gitServerType / 1)"
                           @click="editConf(value, 'add')">添加配置
                </el-button>
              </p>
            </div>
          </div>
          <div class="content">
            <div class="info-wrapper">
              <el-form label-width="110px" size="medium" label-position="left">
                <el-form-item :label="gitServerType[value.gitServerType].text + '地址：'">
                  {{ value.baseUrl }}
                </el-form-item>
                <el-form-item label="Token：" v-if="value.authType === 2">
<!--                  {{ value.gitlabPersonAccessToken }}-->
                  **************
                </el-form-item>
                <el-row v-if="value.authType === 1">
                  <el-col :span="12">
                    <el-form-item label="用户名：">
                      {{ value.username }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="密码：">
<!--                      {{ value.password }}-->
                      **************
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="handle-wrapper">
              <el-button size="medium" type="primary" @click="editConf(value, 'edit')" v-if="value.hasConf">修改配置
              </el-button>
              <el-button size="medium" @click="clearConf(value)" v-if="value.hasConf">清除配置</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import DialogGitConf from './dialogGitConf.vue'
import { getGitConf, clearGitConf } from '@/api/home/scan/develop/repository/git/index.js'
import LogoGitLab from '@/assets/images/gitlab.png'
import LogoGitHub from '@/assets/images/github.png'
import LogoGitee from '@/assets/images/gitee.png'

export default {
  name: 'ScanDevelopRepositoryGitConfig',
  components: {
    DialogGitConf
  },
  data () {
    return {
      project: this.$route.query.projectId ? { id: this.$route.query.projectId } : this.$store.state.home.project,
      loading: false,
      gitServerType: {
        1: {
          text: 'GitLab',
          img: LogoGitLab
        },
        2: {
          text: 'GitHub',
          img: LogoGitHub
        },
        3: {
          text: 'Gitee',
          img: LogoGitee
        }
      },
      data: {
        1: {
          baseUrl: '',
          gitServerType: 1,
          gitlabApiVersion: '',
          gitlabPersonAccessToken: '',
          id: '',
          authType: 1,
          password: '',
          projectId: '',
          username: ''
        },
        2: {
          baseUrl: '',
          gitServerType: 2,
          gitlabApiVersion: '',
          gitlabPersonAccessToken: '',
          id: '',
          authType: 1,
          password: '',
          projectId: '',
          username: ''
        },
        3: {
          baseUrl: '',
          gitServerType: 3,
          gitlabApiVersion: '',
          gitlabPersonAccessToken: '',
          id: '',
          authType: 1,
          password: '',
          projectId: '',
          username: ''
        }
      }
    }
  },
  computed: {
    sortList () {
      const sort = [1, 3, 2]
      return sort.map(item => {
        return this.data[item]
      })
    }
  },
  methods: {
    // 返回
    back () {
      this.$router.push({
        path: '/scan/develop/repository/list/git'
      })
    },

    // 初始化
    init () {
      this.loading = true
      getGitConf({
        projectId: this.project.id,
        loading: false
      }).then(response => {
        this.loading = false
        const data = response.data
        Object.keys(this.data).forEach(key => {
          const current = data.find(resItem => resItem.gitServerType / 1 === key / 1)
          if (current) {
            this.$set(this.data, key, {
              hasConf: true,
              ...this.data[key],
              ...current
            })
          } else {
            this.$set(this.data, key, {
              baseUrl: '',
              gitServerType: key / 1,
              gitlabApiVersion: '',
              gitlabPersonAccessToken: '',
              id: '',
              authType: 2,
              password: '',
              projectId: '',
              username: ''
            })
          }
        })
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 编辑配置
    editConf (row, type = 'add') {
      this.$refs.editConf.form = {
        ...row
      }
      this.$refs.editConf.type = type
      this.$refs.editConf.configType = row.gitServerType
      this.$refs.editConf.dialogVisible = true
    },

    // 清除配置
    clearConf (row) {
      this.$confirm('清除操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearGitConf({
          gitServerType: row.gitServerType,
          projectId: this.project.id
        }).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.init()
        }).catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }).catch(() => {
        this.$message({
          message: '已取消操作'
        })
      })
    }
  },
  mounted () {
    if (this.project.id !== null) {
      this.init()
    }
  }
}
</script>
<style scoped lang="scss">
.view-content {
  min-height: calc(100vh - 145px);

  .view-header {
    i {
      margin-bottom: -2px;
      font-weight: bold;
      margin-right: 5px;
      vertical-align: bottom;
    }
  }

  .item-container {
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(43, 117, 183, 15%);
    border-radius: 6px;
    width: 100%;
    height: 320px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    margin-top: 30px;

    .content {
      margin-top: 120px;
      padding: 20px;
      box-sizing: border-box;

      .el-form {
        padding: 8px 0 10px;

        .el-form-item {
          margin-bottom: 0;
          height: 50px;
          line-height: 25px;

          :deep(.el-form-item__content) {
            //line-height: 25px;
            display: flex by final spec;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
        }
      }

      .handle-wrapper {
        text-align: center;

        .el-button {
          width: 100px;
        }
      }
    }

    .logo-wrapper {
      width: 100%;
      height: 120px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      z-index: 1;

      //transition: height 0.2s;
      &.has-conf {
        height: 100%;
      }

      &.GitLab {
        background-color: #fff2ec;
      }

      &.Gitee {
        background-color: #fbe9e9;
      }

      &.GitHub {
        background-color: #e6e6e6;
      }

      .center-wrapper {
        img {
          height: 40px;
        }

        p {
          margin-top: 40px;
        }

        .el-button {
          width: 150px;
          border: 0;
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 10%);
        }
      }
    }
  }
}
</style>
