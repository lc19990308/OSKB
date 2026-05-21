import Vue from 'vue'

const fileItemEvents = Symbol('fileItemEvents')
let uuid = 1

export class FileItem {
  constructor (file, options = {}) {
    this[fileItemEvents] = new Vue()
    this.options = options
    this.params = options.params || {} // FormData的参数
    this.chunks = Math.ceil(file.size / options.chunkSize) // 当前文件可以被切多少块
    this.chunkSize = options.chunkSize // 块的大小
    this.name = file.name // 文件名称
    this.md5 = null // foundFileMd5
    this.source = null // 终止ajax用
    this.sliceReceived = [] // 已经收到的切片
    this.status = 'waiting' // 当前状态
    this.size = file.size  // 文件大小
    this.uploadedSize = 0 // 已经上传过的
    this.previousSize = 0 // 一秒钟之前的
    this.progress = 0 // 进度
    this.speed = 0 // 流量
    this.file = file // file对象
    this.uuid = 'upload-'+ uuid++

    this.worker = { // 管理worker
      chunk:  {
        worker: null,
        stop: () => {}
      },
      file: {
        worker: null,
        stop: () => {}
      }
    }
  }

  pause () {
    this.worker.file.stop()
    this.source?.cancel('cancel')
    this.status = 'paused'
  }

  // 获取上传秒流量
  getSpeed (action) {
    if (action === 'clear') {
      clearInterval(this._timer)
      this._timer = null
      return
    }
    if (this._timer) return
    this._timer = setInterval(() => {
      const speed = Math.abs(this.uploadedSize - this.previousSize)
      this.speed = speed <= 0 ? this.speed : speed
      this.previousSize = this.uploadedSize
      if (this.status !== 'uploading') {
        this.getSpeed('clear')
      }
    }, 1000)
  }

  // 继续
  resume () {
    this.status = 'uploading'
    this.getSpeed()
  }

  on (event, callback) {
    this[fileItemEvents].$on(event, callback)
    return this
  }

  emit (event, fileItem, ...args) {
    this[fileItemEvents].$emit(event, fileItem, ...args)
    return this
  }

  off (event, callback) {
    this[fileItemEvents].$off(event, callback)
    return this
  }
}
