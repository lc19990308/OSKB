<template>
  <div class="upload-progress-container">
    <div class="upload-loading-wrap" @click="show = true" v-show="!show">
      <i class="el-icon-d-arrow-left"></i>
    </div>
    <div class="upload-progress-wrap el-notification" v-show="show" v-if="uploadListLen > 0">
      <div class="el-notification__group">
        <h2 class="el-notification__title">文件上传中</h2>
        <div class="el-notification__content">
          <ul class="upload-progress-list">
            <li v-for="(item, index) in uploadList" :key="index">
              <h4>
                {{ item.title }}
              </h4>
              <div class="clearfix">
                <el-progress :percentage="item.progress" class="el-progress"></el-progress>
                <i class="el-icon-close" @click="cancelUpload(item)"></i>
              </div>
            </li>
          </ul>
        </div>
        <div class="el-notification__closeBtn el-icon-d-arrow-right" @click="show = false"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'UploadProgress',
  data () {
    return {
      show: true
    }
  },
  computed: {
    ...mapState({
      uploadList: state => state.home.uploadList,
      uploadListLen: state => {
        return Object.keys(state.home.uploadList).length
      }
    })
  },
  methods: {
    // 取消上传
    cancelUpload (item) {
      if (item.source) {
        item.source.cancel('取消上传')
        this.$message.error('已经取消上传')
        this.$store.dispatch('cancelUpload', item.id)
      }
    }
  },
  mounted () {}
}
</script>
<style scoped lang="scss">
.upload-progress-container{
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9;
}
.upload-progress-wrap{
  padding: 14px 6px 14px 13px;
  bottom: 16px;
  right: 16px;
  z-index: 9;
  .el-notification__group{
    width: 100%;
    .upload-progress-list{
      list-style: none;
      padding: 0;
      margin: 0;
      width: 100%;
      li{
        list-style: none;
        padding: 10px 0;
        h4{
          font-size: 14px;
          color: #666666;
          font-weight: 500;
          margin: 0;
        }
        .el-icon-close{
          float: left;
          width: 10%;
        }
        .el-progress{
          font-size: 12px;
          width: 90%;
          float: left;
        }
      }
    }
  }
}
.upload-loading-wrap{
  padding: 12px;
  background: #ffffff;
  border: 1px solid #DCDEE0;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  transition: all .3s;
  margin-right: -16px;
  &:hover{
    background: #f1f1f1;
  }
}
</style>
