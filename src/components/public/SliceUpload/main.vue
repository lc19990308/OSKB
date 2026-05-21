<template>
  <transition name="el-zoom-in-bottom">
    <div class="chunk-uploader-wrapper"  v-show="visible" v-dialog-drag>
      <div class="dialog-wrap" ref="wrap">
        <div class="chunk-uploader">
          <div class="uploader-header file-title" :style="collapse ? {borderBottom: '1px solid #EFF0F0'} : {}">
            <div class="uploader-header-title">
              <span>文件列表 <span class="m-l-10">正在上传（{{ uploadedTotal }}/{{fileList.length}}）</span></span>
            </div>
            <el-button class="close-btn" type="text" style="margin-top: -3px">
              <i class="el-icon-minus m-r-5" style="vertical-align: middle;" v-if="collapse" @click="[collapse = false, $refs.wrap.style = null]"></i>
              <i class="iconfont icona-fangda1 m-r-5" style="vertical-align: middle;" v-else @click="collapse = true"></i>
              <el-popconfirm
                v-if="isClosable"
                confirm-button-text='确定'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                @confirm="removeAll"
                @Confirm="removeAll"
                title="此操作会取消所有上传任务，是否确定?"
              >
                <i slot="reference" class="el-icon-close"></i>
              </el-popconfirm>
              <i v-else class="el-icon-close" @click="removeAll"></i>
            </el-button>
          </div>
          <el-collapse-transition>
            <div class="uploader-body" v-show="collapse">
              <div class="uploader-empty" v-if="fileList.length === 0">
                <div>
                  <img :src="require('@/assets/images/icon-no-data.png')" alt=""/>
                  <div>暂无数据</div>
                </div>
              </div>
              <el-scrollbar class="scrollbar-hide-x" v-else>
                <ul class="uploader-file-list">
                  <file-item v-for="file in sortList" :file="file" :key="file.uuid"></file-item>
                </ul>
              </el-scrollbar>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import { foundFileChunkMd5, foundFileMd5 } from './foundMd5'
import { FileItem } from './fileItem/class-file'

import to from '@/utils/await-to'
import { hasOwn } from '@/utils'
import FileItemComponent from '@/components/public/SliceUpload/fileItem/FileItem'
import { isPlainObject, get } from 'lodash-es'
import { objectToFormData } from '@/utils/base'

// 事件系统
// created 创建完成文件对象、还没生成md5
// createdMd5 生成md5完成、准备开始上传
// progress 进度 只触发子任务的progress事件
// error 出错
// success 上传成功
const fileEvents = Symbol('fileEvents')
export default {
  name: 'WebUpload',
  components: { FileItem: FileItemComponent },
  data () {
    return {
      visible: false,
      collapse: true,
      fileList: [],
      options: {
        chunkSize: 1024 * 1024 * 50, // 分片大小 默认50MB
      },
      maxGenerateMd5: 2, //最多多少个文件同时生成md5
      generateMd5Num: 0, // 当前在md5生成中的文件数量
    }
  },

  computed: {
    // 状态为等待中的
    statusWaitingList () {
      return this.fileList.reverse().filter(fileItem => {
        return fileItem.status === 'waiting'
      })
    },
    sortList () {
      const filter = (status) => {
        return this.fileList.filter(item => item.status === status)
      }
      return [
        'uploading',
        'md5',
        'paused',
        'waiting',
        'success',
        'error'].reduce((acc, status) => acc.concat(filter(status)), [])
    },
    isClosable(){
      const isTrue = this.fileList.every(fileItem => {
        return fileItem.status === 'error' || fileItem.status === 'success'
      })
      return this.fileList.length > 0 && !isTrue
    },

    uploadedTotal (){
      return this.fileList.filter(item => ['success', 'error'].includes(item.status)).length
    }
  },
  watch: {
    generateMd5Num () { // 监听generateMd5Num的值、创建md5生成任务
      this.generateMd5NumMonitor()
    }
  },

  methods: {
    // 添加上传任务、接收外传的文件对象
    append (file, options = { params: {} }) {
      this.visible = true
      const fileItem = new FileItem(file, { ...this.options, ...options })
      this.fileList.unshift(fileItem)
      this.emit('created', fileItem)
      this.generateMd5NumMonitor()
      return fileItem
    },

    // 生成md5
    async generateMd5 (fileItem) {
      try {
        fileItem.status = 'md5'
        this.generateMd5Num += 1
        await foundFileMd5(fileItem)
        this.emit('createdMd5', fileItem)
        this.generateMd5Num -= 1
        // md5已经生成完毕、开始上传
        fileItem.status = 'uploading'
        await this.hasReceived(fileItem) // 看看已经接收的分片
      } catch (error) {
        fileItem.status = 'error'
        this.emit('error', fileItem, error)
      }
    },

    // 生成md5数量的监听器 - 生成md5任务派发
    generateMd5NumMonitor () {
      if (this.generateMd5Num < this.maxGenerateMd5 && this.statusWaitingList.length > 0) {
        const firstWaitingFileMd5 = this.statusWaitingList[0]
        this.generateMd5(firstWaitingFileMd5)
      }
    },

    // 看看已经接收的分片，是否是秒传。
    async hasReceived (fileItem) {
      const [error, response] = await to(fileItem.options.request.received({
        md5: fileItem.md5,
        originName: fileItem.name,
        ...fileItem.params
      }))

      if (response?.data) { // res
        const {
          uploaded,
          sliceReceived = []
        } = response.data
        fileItem.sliceReceived = sliceReceived
        if (uploaded?.id) { // 秒传
          fileItem.status = 'success'
          this.emit('success', fileItem, response)
        } else {
          await this.upload(fileItem, 1)
        }
      } else if (error) {
        fileItem.status = 'error'
        fileItem.errorMessage = error.message
        this.emit('error', fileItem, error)
      }
    },

    // 上传、递归上传分片
    async upload (fileItem, index) {
      // 已经上传过的分片数组判断当前的块有没有，没有就上传、有的话就判断下一块
      if (fileItem.sliceReceived.indexOf(index) === -1) {
        const formData = await this.createFormData(fileItem, index)
        fileItem.source = axios.CancelToken.source()
        const startSize = fileItem.chunks === 1 ? 0 : (index - 1) * fileItem.chunkSize
        fileItem.previousSize === 0 && (fileItem.previousSize = startSize)
        fileItem.getSpeed() // 时实上传流量
        fileItem.resume = () => { // 暂停后继续上传
          fileItem.status = 'uploading'
          this.upload(fileItem, index)
        }
        const [error, response] = await to(fileItem.options.request.slice(formData, {
          cancelToken: fileItem.source.token,
          onUploadProgress (e) { // 进度
            if (e.lengthComputable) {
              fileItem.uploadedSize = e.loaded + startSize
              const progress = (startSize + e.loaded) / fileItem.size * 100
              fileItem.progress = progress > 100 ? 100 : progress
            }
            fileItem.emit('progress', fileItem, e)
          }
        }))
        await this.handlerUploadResponse(response, error, fileItem, index)
      } else {
        await this.upload(fileItem, ++index) // 递归继续上传
      }
    },

    async handlerUploadResponse (response, error, fileItem, index) {
      if (response) {
        const {
          uploaded,
          sliceReceived = []
        } = response.data
        fileItem.sliceReceived = sliceReceived
        if (uploaded?.id) { // 上传成功
          fileItem.status = 'success'
          this.emit('success', fileItem, response)
        } else {
          await this.upload(fileItem, ++index) // 递归继续上传
        }
      } else if (error) {
        fileItem.status = 'error'
        this.emit('error', fileItem, error)
      }
    },
    // 创建FormData对象
    async createFormData (fileItem, index) {
      const { chunkSize } = fileItem
      let upSize = (index - 1) * chunkSize
      let sliceChunkSize = upSize + chunkSize
      if (fileItem.file.size < sliceChunkSize) {
        sliceChunkSize = fileItem.file.size
      }
      let blob = fileItem.file.slice(upSize, sliceChunkSize) // 截取文件
      const chunkMd5 = await foundFileChunkMd5(fileItem, blob)
      const formData = new FormData()
      formData.append('slice', blob) // 数据流
      formData.append('md5', fileItem.md5) // 整个文件md5值
      formData.append('sliceMd5', chunkMd5) // 分片md5值
      formData.append('originName', fileItem.name) // 整个文件的文件名
      formData.append('sliceIndex', index) // 当前分片的索引，起始分片索引为1
      formData.append('sliceTotal', fileItem.chunks) // 总分片数
      formData.append('sliceByteSize', chunkSize) // 每片分片大小
      if (isPlainObject(fileItem.params) && Object.keys(fileItem.params).length) {
        objectToFormData(formData, fileItem.params)
      }
      // for (const key in fileItem.params) {
      //   if (hasOwn(fileItem.params, key)) {
      //     if (isPlainObject(fileItem.params[key])) {
      //         loop([key], fileItem.params[key])
      //     }else {
      //       if (formData.has(key)) {
      //         formData.set(key, fileItem.params[key])
      //       }else {
      //         formData.append(key, fileItem.params[key])
      //       }
      //     }
      //   }
      // }
      return formData
    },

    // 清除所有上传任务
    removeAll () {
      this.visible = false
      this.generateMd5Num = 0
      this.fileList.forEach(fileItem => {
        fileItem.source?.cancel('cancel')
        fileItem.worker.file.stop()
        fileItem.worker.chunk.stop()
        fileItem.getSpeed('clear')
      })
      this.fileList = []
    },

    // 清除单个上传任务
    removeItem (fileItem) {
      const remove = (fileItem) => {
        for (let index = 0; index < this.fileList.length; index++) {
          if (this.fileList[index] === fileItem) {
            fileItem.worker.file.stop()
            fileItem.worker.chunk.stop()
            fileItem.getSpeed('clear')
            this.fileList.splice(index, 1)
            this.generateMd5Num -= 1
          }
        }
      }
      if (fileItem.status === 'uploading') {
        this.$confirm('该文件正在上传中，是否取消?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (fileItem.source) {
              fileItem.source.cancel('cancel')
            }
            remove(fileItem)
          })
          .catch(() => {
          })
      } else {
        remove(fileItem)
      }
    },

    // 关闭上传面板
    close () {
      const isTrue = this.fileList.every(fileItem => {
        return fileItem.status === 'error' || fileItem.status === 'success'
      })
      if (this.fileList.length > 0 && !isTrue) {
        this.$confirm('此操作会取消所有上传任务，是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.visible = false
          this.removeAll()
        })
      } else {
        this.visible = false
        this.removeAll()
      }
    },

    off (event, callback) {
      this[fileEvents].$off(event, callback)
    },

    on (event, callback) {
      this[fileEvents].$on(event, callback)
    },

    emit (event, fileItem, ...args) {
      fileItem.emit(event, fileItem, ...args)
      this[fileEvents].$emit(event, fileItem, ...args)
    }

  },
  provide () {
    return {
      uploader: this,
    }
  },
  created () {
    this[fileEvents] = new Vue()
  }
}
</script>
<style scoped lang="scss">
.dialog-wrap {
  position: absolute;
}

.uploader-file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-panel {
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  .file-title {
    display: flex;
    height: 55px;
    line-height: 55px;
    padding: 0 15px;

    .operate {
      flex: 1;

      .el-button {
        margin-left: 15px;
      }

      .close-btn {
        float: right;
        margin-top: 9px;
      }
    }
  }

  .file-list {
    position: relative;
    height: 240px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #fff;
    margin-bottom: 15px;

    > li:nth-child(odd) {
      background-color: #f3f4f4;
    }
  }
}

.chunk-uploader-wrapper {
  position: fixed;
  z-index: 2000;
  right: 20px;
  bottom: 15px;
  height: 0;
  width: 0;
}

.chunk-uploader {
  position: absolute;
  left: 0;
  bottom: 0;
  margin-left: -580px;
  width: 580px;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  .uploader-header {
    display: flex;
    height: 55px;
    line-height: 55px;
    padding: 0 15px;
    cursor: pointer;
    justify-content: space-between;
    .uploader-header-title {
      span {
        color: #666666;
      }

      .fold-btn {
        margin-left: 10px;
        color: #666666;

        i {
          transition: all 0.5s;
          transform: rotateZ(-180deg);

          &.open {
            transform: rotateZ(0deg);
          }
        }

      }
    }

    .close-btn {
      font-size: 20px;
      i{
        color: #C4C4C4;
        font-weight: bold;
        transition: color 0.2s;

        &:hover {
          color: $color-primary;
        }
      }

      .el-icon-close {
        font-weight: bold;
        &:hover {
          color: $color-danger !important;
        }
      }
    }
  }

  .uploader-body {
    height: 229px;
    position: relative;

    .uploader-empty {
      width: 100%;
      color: #b4bccc;
      height: 100px;
      padding: 65px 0;
      background-color: rgba(#FFFFFF, 1);
      position: relative;
      z-index: 1;
      top: 0;

      & > div {
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-55px);
        text-align: center;

        img {
          width: 70px;
          margin-bottom: 3px;
        }
      }
    }

    .el-scrollbar {
      height: 100%;
    }
  }
}
</style>
