<template>
  <el-main class="main">
    <dialog-edit-pwd ref="editPwd"/>
    <dialog-edit-email ref="editEmail" @callback="initUser"/>
    <div class="wrap">
      <div class="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconyonghu"></use>
        </svg>
        <p class="user-name">{{ userInfo.username }}</p>
      </div>

      <el-tabs class="tabs" v-model="fullPath">
        <template v-for="(val,key) in tabs">
          <el-tab-pane v-if="authorityFilter(val.powerId)" :key="key" :label="val.label" :name="val.path"></el-tab-pane>
        </template>
      </el-tabs>

      <div class="view-content" v-if="authorityFilter(210)" v-show="fullPath === '个人信息'">
        <div class="item clearfix">
          <div class="title">
            <img class="icon" :src="idCardImg" alt="">
            登录账号：
          </div>
          <div class="content">
            {{ userInfo.username }}
          </div>
        </div>
        <div class="item clearfix">
          <div class="title">
            <img class="icon" :src="passwordImg" alt="">
            登录密码：
          </div>
          <div class="content">
            建议您定期更换密码，密码格式为8~16位的数字字母特殊字符组合
            <a class="edit-pwd-btn iconfont iconbianji" href="javascript:void 0" @click="editPwd"></a>
          </div>
        </div>
        <div class="item clearfix">
          <div class="title">
            <img class="icon" :src="emailImg" alt="">
            <span>邮箱：</span>
          </div>
          <div class="content">
            <span class="user-name">{{ email || '-' }}</span>
            <a class="edit-pwd-btn iconfont iconbianji" href="javascript:void 0" @click="editEmail"></a>
          </div>
        </div>
      </div>
      <div class="view-content" v-if="authorityFilter(220)" style="min-height: 236px;padding: 30px;" v-show="fullPath === '访问令牌'">
        <el-alert :closable="false" type="primary" class="header-alert">
          <div class="alert-content">
            <i class="el-icon-info m-r-5"></i>个人访问令牌（Token）可用于访问 SCA API。默认令牌由系统自动生成，若要修改令牌值，可选择自定义修改或随机生成。
          </div>
        </el-alert>
        <div class="item clearfix" style="padding: 20px 100px;">
          <div class="title" style="text-align: right;text-align-last: right;">
            访问令牌：
          </div>
          <div class="content">
            <div style="display: flex;width: 100%;">
              <div style="flex: 1;" class="m-r-15">
                <el-input ref="input" placeholder="令牌格式为32~64位的数字及英文字母组合" style="width: 100%;" size="medium" :disabled="readonly" v-model="token">
                  <span v-if="readonly" class="token-copy-btn text-regular font-base cursor-pointer" slot="suffix" @click="copyToken">复制</span>
                </el-input>
              </div>
              <div>
                <el-button size="medium" v-if="readonly" plain class="token-action-btn m-r-15" @click="readonly = false">修改</el-button>
                <el-button size="medium" v-else type="primary" class="m-r-15" @click="saveToken()">保存</el-button>
                <el-button size="medium" class="token-action-btn token-action-btn--adjacent" plain v-if="readonly" @click="randomlyGeneratedToken">随机生成</el-button>
                <el-button size="medium" v-else style="margin-left: 0;" plain @click="cancelTokenCreate">取消</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-main>
</template>
<script>
import DialogEditPwd from '@/views/home/account/dialogEditPwd.vue'
import DialogEditEmail from '@/views/home/account/dialogEditEmail.vue'
import { userInfo, getToken, randomToken, updateToken } from '@/api/home/user'
import { mapState } from 'vuex'
import copyText from '../../../utils/copyText'
import to from '@/utils/await-to'
import { isObject } from '@/utils'

export default {
  name: 'account',
  components: {
    DialogEditPwd,
    DialogEditEmail
  },
  data () {
    return {
      email: '',
      idCardImg: require('@/assets/images/icon-idcard.png'),
      passwordImg: require('@/assets/images/icon-locked.png'),
      emailImg: require('@/assets/images/icon-email.png'),
      fullPath: '个人信息',
      token: '',
      hostToken: '',
      readonly: true,
      tabs: [
        {
          label: '个人信息',
          path: '个人信息',
          powerId: 210
        },
        {
          label: '访问令牌',
          path: '访问令牌',
          powerId: 220
        }
      ]
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo
    })
  },
  methods: {

    cancelTokenCreate () {
      this.readonly = true
      this.token = this.hostToken
    },

    async saveToken () {
      const [error] = await to(updateToken({ token: this.token }))
      if (isObject(error)) { return this.$message.error(error.message) }
      this.$message.success('保存成功')
      this.readonly = true
      await this.getToken()
    },

    async randomlyGeneratedToken () {
      const [error, result] = await to(randomToken())
      if (isObject(error)) { return this.$message.error(error.message) }
      this.token = result.data
      this.hostToken = result.data
      this.$message.success('随机令牌生成功')
    },

    copyToken () {
      copyText(this.token)
    },

    async getToken () {
      const [error, result] = await to(getToken())
      if (isObject(error)) { return this.$message.error(error.message) }
      this.token = result.data
      this.hostToken = result.data
    },

    editPwd () {
      this.$refs.editPwd.dialogVisible = true
    },

    editEmail () {
      this.$refs.editEmail.form.email = this.email
      this.$refs.editEmail.dialogVisible = true
    },

    initUser () {
      userInfo({
        id: this.userInfo.userId,
        loading: false
      }).then(response => {
        this.email = response.data.email
      })
    }
  },
  mounted () {
    this.initUser()
    this.getToken()
  }
}
</script>
<style scoped lang="scss">
:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.header-alert {
  position: relative;
  margin-bottom: 20px;
  padding-left: 12px !important;
  padding-right: 12px !important;
  border-style: dashed;

  :deep(.el-alert__content) {
    padding: 0;
  }

  :deep(.alert-content) {
    margin-bottom: 5px;
    padding: 0;

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.token-copy-btn {
  display: inline-flex;
  align-items: center;
  height: 28px;
  margin: 2px 4px 2px 0;
  padding: 0 8px;
  border-left: 1px solid #cdebe8;
  border-radius: 3px;
  background: #edf8f8;
  color: #087e8b;
  transition: background-color 0.18s ease, color 0.18s ease;

  &:hover {
    background: #d8f1ef;
    color: #065a64;
  }
}

:deep(.el-button.token-action-btn) {
  border-color: #087e8b;
  background: #fff;
  color: #087e8b;

  &:focus,
  &:hover {
    border-color: #1596a3;
    background: #edf8f8;
    color: #087e8b;
  }

  &:active {
    border-color: #065a64;
    background: #d8f1ef;
    color: #065a64;
  }
}

:deep(.token-action-btn--adjacent) {
  margin-left: 0 !important;
}

.wrap {
  max-width: 1180px;
  width: 90%;
  margin: 100px auto 0;

  .header {
    text-align: center;
    margin-bottom: 30px;

    .user-name {
      text-align: center;
      font-size: 14px;
      color: #999;
    }

    .icon {
      font-size: 100px;
      box-sizing: initial;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 33%);
    }
  }

  .view-content {
    padding: 40px;

    .item {
      line-height: 32px;
      margin-bottom: 40px;

      .title {
        text-align-last: justify;
        width: 115px;
        float: left;

        img {
          width: 30px;
          vertical-align: middle;
          margin-right: 10px;
        }
      }

      .content {
        margin-left: 140px;

        .edit-pwd-btn {
          float: right;
          color: #2C5F8A;
          transition: all 0.5s;

          &:hover {
            color: #2898fb;
          }

          &:active {
            color: #70a3d0;
          }
        }
      }
    }
  }
}
</style>
