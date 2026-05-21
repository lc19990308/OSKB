<template>
  <li class="uploader-file-item">
    <div class="file-name">
      <i class="file-icon iconfont iconwendang"></i>
      <el-tooltip class="item" effect="dark" :content="file.name" placement="top">
        <el-link style="white-space: nowrap;" @click="to" :underline="false">{{ file.name | ellipsis }}</el-link>
      </el-tooltip>
    </div>
    <div class="file-size">{{ formatSize }}</div>
    <div class="file-handle">
      <span class="file-upload-speed" v-if="file.status === 'uploading'">{{ formatSpeed }}/s</span>
      <span class="file-upload-status" v-else>{{ file.status === 'error' ?  file.errorMessage || formatStatus : formatStatus}}</span>
      <i v-if="file.status === 'waiting' || file.status === 'md5'" class="icon-btn el-icon-time"></i>
      <i v-else-if="file.status === 'error'" class="icon-btn refresh el-icon-refresh" style="font-size: 26px" title="重试" @click="retry"></i>
      <i class="icon-btn el-icon-circle-check" v-else-if="file.status === 'success'"></i>
      <div class="progress-wrapper" v-else>
        <i class="icon iconfont iconpause" v-if="file.status === 'uploading'" title="暂停" @click="pause"></i>
        <i class="icon iconfont iconxiangshang" v-else-if="file.status === 'paused'" title="继续" @click="resume"></i>
        <el-progress
          type="circle"
          :show-text="false"
          :color="'#8B5CF6'"
          :stroke-width="2"
          :percentage="file.progress"
          :width="26"
        >
        </el-progress>
      </div>
      <el-button class="remove-btn" type="text" title="关闭" @click="remove">
        <i class="el-icon-close"></i>
      </el-button>
    </div>
  </li>
</template>

<script>
import router from '@/router/router'
import { createStrSuffix } from '@/utils'
export default {
  name: 'FileItem',
  props: {
    file: {
      type: Object,
      default () {
        return {}
      }
    },
    list: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileStatusText: {
        uploading: '上传中',
        paused: '暂停',
        md5: 'MD5校验中',
        waiting: '等待中',
        success: '上传成功',
        error: '上传失败'
      }
    }
  },
  computed: {
    formatSize () {
      return this.formatFileSize(this.file.size)
    },
    formatSpeed () {
      return this.formatFileSize(this.file.speed)
    },
    formatStatus () {
      return this.fileStatusText[this.file.status]
    }
  },
  filters:{
    ellipsis(str){
      return createStrSuffix(str, 20)
    }
  },
  inject:['uploader'],
  methods: {
    formatFileSize (byteSize) {
      let format = byteSize + ' bytes'
      const size = byteSize
      if  (size < 1024) {
        format = size.toFixed(0) + ' B'
      } else if (size < 1048576) {
        format = (size / 1024).toFixed(0) + ' KB'
      } else if (size < 1073741824) {
        format = (size/1024/1024).toFixed(1) +' MB'
      }else {
        format = (size/1024/1024/1024).toFixed(1)+' GB'
      }
      return format
    },

    to(){
      const path = this.get(this.file, 'options.payload.origin')
      path && router.push(path)
    },

    // 暂停
    pause () {
      this.file.pause()
    },

    // 继续
    resume () {
      this.file.resume()
    },

    // 重试
    retry () {
      this.uploader.generateMd5(this.file)
    },

    remove () {
      this.uploader.removeItem(this.file)
    }
  }
}
</script>

<style lang="scss">
.uploader-file-item{
  position: relative;
  height: 55px;
  line-height: 55px;
  overflow: hidden;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;

  .el-icon-close {
    &:hover {
      color: $color-danger !important;
    }
  }

  &:nth-child(odd) {
    background-color: #f3f4f4;
  }
  .file-name {
    text-indent: 14px;
    width: 45%;
    .file-icon {
      margin-right: 5px;
      margin-left: 4px;
      font-size: 25px!important;
      color: #8B5CF6;
      vertical-align: middle;
    }
  }
  .file-size {
    width: 15%;
    box-sizing: border-box;
    font-size: 13px;
    text-align: center;
    padding: 0 3px;
  }
  .file-handle{
    width: 40%;
    text-align: right;
    padding-right: 12px;
    box-sizing: border-box;
    vertical-align: middle;
    span{
      padding: 0 10px;
      vertical-align: middle;
    }
    .icon-btn{
      padding: 0 7px;
      font-size: 29px;
      vertical-align: middle;
      color: #8B5CF6;
      &.refresh{
        cursor: pointer;
      }
    }
    .progress-wrapper{
      padding: 0 10px;
      display: inline-block;
      width: 26px;
      height: 26px;
      position: relative;
      vertical-align: middle;
      cursor: pointer;
      .waiting{
        transform: rotateZ(316deg) translate(2px, -2px);
      }
      .icon{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        color: #8B5CF6;
        text-align: center;
        line-height: 26px;
        margin: auto;
        z-index: 1;
      }
      .el-progress{
        margin: 0;
        display: block;
      }
    }
    .icon-wrapper{
      vertical-align: middle;
      display: inline-block;
      margin: 0 10px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 2px solid #8B5CF6;
      box-sizing: border-box;
      position: relative;
      i{
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
        line-height: 22px;
        display: block;
        width: 100%;
        height: 100%;
        color: #8B5CF6;
      }
    }
    .el-button{
      font-size: 16px;
      color: #666666;
    }
  }
}
</style>
