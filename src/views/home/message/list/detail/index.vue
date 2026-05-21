<template>
  <div>
    <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap'">
      <div class="clearfix">
        <el-button size="medium" type="primary" @click="goBack">返回</el-button>
      </div>
    </sticky>
    <div class="view-content">
      <panel v-loading="loading">
        <div slot="header">
          消息通知
        </div>
        <div class="detail">
          <h3 class="title">
            {{ detail.title }}
          </h3>
          <div class="sendDate">
            {{ detail.sendDate }}
          </div>
          <div class="content" v-html="xss(detail.content)"></div>
        </div>
        <div class="text-center" style="padding-top: 30px;" v-if="type == 2">
          <el-button type="primary" size="medium" @click="$router.push('/search/batch')">查看详情</el-button>
        </div>
      </panel>
    </div>
  </div>
</template>

<script>
import { messageDetail } from '@/api/home/message'
import Sticky from '@/components/public/Sticky/index.vue'
import xss from 'xss'

export default {
  components: {
    Sticky
  },
  data () {
    return {
      id: this.$route.query.id,
      type: this.$route.query.t,
      loading: false,
      detail: {
        title: '',
        sendDate: '',
        content: ''
      }
    }
  },
  methods: {
    // 返回
    goBack () {
      this.$router.go(-1)
    },

    xss: xss,

    // 初始化
    initMessage () {
      this.loading = true
      messageDetail({
        id: this.id,
        loading: false
      })
        .then(response => {
          this.loading = false
          this.detail = response.data
        }).catch(error => {
          this.tableData = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    }

  },
  mounted () {
    this.initMessage()
  },
  watch: {
    $route (to, from) {
      if (to.query.id !== from.query.id) {
        this.id = to.query.id
        this.type = to.query.t
        this.initMessage()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 20px;
}

.sendDate {
  text-align: center;
  margin-bottom: 40px;
}

p {
  margin: 0;
}

.content {
  margin: 0 auto;
  font-size: 16px;
  max-width: 550px;
  color: #666;
}
</style>
