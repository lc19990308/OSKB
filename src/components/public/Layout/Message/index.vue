<template>
  <el-popover
    placement="bottom"
    width="300"
    v-model="visible"
    :disabled="!hasMessage"
    trigger="hover">
    <div class="message-title">
      <span>消息通知</span>
      <el-link :underline="false" class="right m-r-10" type="primary" @click="changeAllReadStatus">全部已读</el-link>
    </div>
    <el-scrollbar v-if="visible">
      <ul class="list">
        <li
          class="item"
          v-for="(row, index) in tableData"
          :key="index"
          @click="changeReadStatus(row)"
        >
          <p class="title"><el-badge is-dot><span class="p-r-10">{{TYPE_EICT[row.type]}}</span></el-badge></p>
          <p class="content">{{ row.title }}</p>
          <p class="time">{{ row.createDate }}</p>
        </li>
      </ul>
    </el-scrollbar>
    <div class="message-footer text-primary text-center cursor-pointer" @click="toMessage">
      查看更多>>
    </div>
    <div class="header-btn" slot="reference" @click="toMessage">
      <el-badge is-dot :hidden="!hasMessage" style="vertical-align:middle;">
        <i class="iconfont iconxiaoxi"></i>
      </el-badge>
    </div>
  </el-popover>
</template>
<script>
import {
  messageList,
  changeReadStatus,
  changeAllReadStatus,
  taskSubscribe,
  systemUpdateSubscribe,
  checkResultSubscribe
} from '@/api/home/message'
import { mapState } from 'vuex'
import Socket from './socket'
import globalBus from '@/utils/bus'

// 定义一个消息队列，收集notify实例
const notifyTaskQueue = []
const TYPE_EICT = {
  0 : '系统消息',
  1: '监控预警',
  2: '检测结果'
}
export default {
  name: 'Message',
  data () {
    return {
      TYPE_EICT,
      hasMessage: false,
      currentPage: 1,
      pageSize: 10,
      visible: false,
      tableData: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo,
      accessToken: state => state.login.accessToken
    })
  },

  methods: {
    // 获取告警列表
    initList () {
      this.loading = true
      messageList({
        userId: this.userInfo.userId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        isRead: 0,
        loading: false
      }).then(response => {
        const data = response.data
        this.tableData = []
        data.records.forEach(item => {
          this.tableData.push(item)
        })
        this.hasMessage = data.total > 0
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 标记为已读
    changeReadStatus (row) {
      this.$router.push({
        path: '/message/detail',
        query: {
          id: row.id,
          t: row.type
        }
      })
      changeReadStatus({
        idList: [row.id],
        readStatus: 1
      }).then(() => {
        this.initList()
        this.refreshMessageList()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 全部标记为已读
    changeAllReadStatus () {
      changeAllReadStatus({
        readStatus: 1
      }).then(() => {
        this.initList()
        this.refreshMessageList()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 刷新消息通知的列表
    refreshMessageList () {
      if (this.$route.path === '/message/list') {
        globalBus.$emit('refreshMessageList')
      }
    },

    // 查看所有
    toMessage () {
      this.$router.push({
        path: '/message'
      })
    },

    // 系统更新消息订阅
    systemUpdateSubscribe () {
      return systemUpdateSubscribe(
        (response) => {
          try {
            const { data, code } = JSON.parse(response.body)
            this.$notify({
              type: code === 0 ? 'success' : 'error',
              title: '系统消息',
              message: data.title,
              duration: 10000,
              offset: 60
            })
          } catch (error) {}
        }
      )
    },

    // 任务消息订阅
    taskSubscribe () {
      const _this = this
      return taskSubscribe(
        (response) => {
          try {
            const data = JSON.parse(response.body).data
            const ele = this.$createElement
            const notify = this.$notify({
              type: data.type === 1 ? 'warning' : 'info',
              title: TYPE_EICT[data.type],
              message: ele('div', {}, [
                ele('p', {
                  style: {
                    wordBreak: 'break-all'
                  }
                }, data.title),
                ele('a', {
                  style: {
                    fontSize: '13px',
                    float: 'right',
                    marginTop: '5px'
                  },
                  class: 'el-link el-link--primary',
                  on: {
                    click () {
                      notify.close()
                      _this.changeReadStatus({ id: data.messageId })
                    }
                  }
                }, '查看详情')
              ]),
              duration: 0,
              offset: 60
            })
            notifyTaskQueue.push(notify)
            this.initList()
          } catch (error) {}
        }
      )
    },

    // 检测结果订阅
    checkResultSubscribe () {
      const _this = this
      return checkResultSubscribe(
        (response) => {
          try {
            const data = JSON.parse(response.body).data
            const ele = this.$createElement
            const notify = this.$notify({
              type: data.type === 2 ? 'warning' : 'info',
              title: TYPE_EICT[data.type],
              message: ele('div', {}, [
                ele('p', {
                  style: {
                    wordBreak: 'break-all'
                  }
                }, data.title),
                ele('a', {
                  style: {
                    fontSize: '13px',
                    float: 'right',
                    marginTop: '5px'
                  },
                  class: 'el-link el-link--primary',
                  on: {
                    click () {
                      notify.close()
                      _this.changeReadStatus({ id: data.messageId,type: data.type })
                    }
                  }
                }, '查看详情')
              ]),
              duration: 0,
              offset: 60
            })
            notifyTaskQueue.push(notify)
            this.initList()
          } catch (error) {}
        }
      )
    },

    // 创建连接
    createSocket () {
      const subscribe = [
        this.taskSubscribe(),
        this.systemUpdateSubscribe(),
        this.checkResultSubscribe()
      ]
      this.Socket = new Socket({
        subscribe,
        errorCallback: () => {
          this.$message.error('消息通知不可用！')
        }
      })
    },

    // 关闭连接
    closeSocket () {
      this.Socket.close()
    }
  },
  beforeDestroy () {
    this.closeSocket()

    // 清空消息队列
    while (notifyTaskQueue.length){
      const notify = notifyTaskQueue.pop()
      notify.close()
    }
  },
  mounted () {
    globalBus.$on('initMessage', () => {
      this.initList()
    })
    this.createSocket()
    this.initList()
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-scrollbar__wrap){
  max-height: calc(100vh - 200px); // 最大高度
  overflow-x: hidden; // 隐藏横向滚动栏
  margin-bottom: 0 !important;
}
.header-btn {
  float: left;
  padding: 0 20px;
  cursor: pointer;
}
.el-badge{
  line-height: 1;
}
.message-footer{
  border-top: 1px solid #dcdfe6;
  padding-top: 10px;
  margin-top: 10px;
}
.message-title{
  & > span{
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
}
.list{
  overflow: hidden;
  padding: 20px 0 0;
  margin: 0;
  li{
    list-style: none;
    padding: 8px 10px;
    transition: all 0.5s;
    border-radius: 5px;
    cursor: pointer;
    &:hover{
      background: #f0f0f0;
    }
    p{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
      padding-bottom: 5px;
    }
    .time{
      color: #999999;
      font-size: 12px;
    }
    .title{
      font-size: 15px;
      color: #333333;
      .el-badge {
        .el-badge__content.is-dot{
          top: 7px !important;
        }
      }
    }
  }
}
</style>
