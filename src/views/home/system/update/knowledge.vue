<template>
  <div class="common-bg">
    <div class="common-header">
      知识库更新
    </div>
    <div class="common-body">
      <input
        @change="uploadWeb($event)"
        style="display: none;"
        placeholder="请选择文件"
        ref="webFileInput"
        type="file"
        accept=".zip"
      />
      <!-- 选择文件后 显示进度条 -->
      <div v-if="updateStep === 0" class="version-info">
        <!-- 初始显示 -->
        <div><img :src="img1" alt="" @click="$refs.webFileInput.click()" /></div>
        <div>
          <!-- <img class="last-time-box" :src="img5" alt="" @click="$refs.webFileInput.click()" /> -->
          <span class="last-time">最近更新：</span>{{ lastTime || '-' }}
        </div>
      </div>
      <div v-else :class="[{ 'updata-progress': updateStep === 1 } , { 'updata-progress': updateStep === 2 } , { 'updata-progress': updateStep === 3 } , { 'updata-progress': updateStep === 4 }]">
        <!-- 进度条 -->
        <el-progress
          v-if="updateStep === 1 || updateStep === 2 || updateStep === 3 || updateStep === 4"
          :text-inside="true"
          :stroke-width="12"
          :percentage="uploadProgress"
        ></el-progress>
        <!-- 更新失败图标 -->
        <div v-if="updateStep === 5" class="version-info">
          <img :src="img2" @click="updateStep = 0" alt="" />
        </div>
        <!-- 上传中 -->
        <div v-if="updateStep === 1" class="p-t-15 left">更新包上传中...</div>
        <!-- 上传成功 -->
        <div v-if="updateStep === 2" class="p-t-15 left">更新包上传成功，开始更新...</div>
        <!--  更新中 -->
        <div v-if="updateStep === 3" class="p-t-15 left">正在更新...</div>
        <!--  更新成功 -->
        <div v-if="updateStep === 4" class="p-t-15 left">更新成功！</div>
        <!-- 更新失败 -->
        <div class="btn-bad" v-if="updateStep === 5">
          <img :src="img3" @click="updateStep = 0" alt="" />&nbsp;
          <img :src="img4" @click="updateStep = 0" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import img1 from '@/assets/images/icon-upload.png'
import img2 from '@/assets/images/icon-upload-bad.png'
import img3 from '@/assets/images/updata-bad.png'
import img4 from '@/assets/images/bad-click.png'
import img5 from '@/assets/images/before-updata.png'
import { lastTime, uploadWeb, updateProgress } from '@/api/home/system/update'
export default {
  props: ['list'],
  data () {
    return {
      img1: img1,
      img2: img2,
      img3: img3,
      img4: img4,
      img5: img5,
      updateStep: 0, // 上传文件0  1上传中 2上传成功，开始更新  3正在更新  4更新成功  5更新失败  6取消更新
      uploadProgress: 0, // 上传包进度条
      lastTime: '',
      timeout: null
    }
  },
  methods: {
    // 上传web端更新包 input内容发生改变时候执行
    // 选择上传更新包
    uploadWeb (event) {
      this.updateStep = 1
      // 开始上传更新包
      const file = event.target.files[0]
      /**
       * 校验文件格式只允许zip的
       * **/
      if (!file || file.name.slice(-4) !== '.zip') {
        this.$refs.file.value = null
        this.updateStep = 5
        return this.$message.error('文件格式错误，文件仅支持.zip格式！')
      }
      this.$message.info('文件开始上传....')
      const _this = this
      _this.source = axios.CancelToken.source()
      const fileId = 'file_' + Date.now()
      const data = new FormData()
      data.append('file', file)
      uploadWeb(data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        cancelToken: _this.source.token,
        onUploadProgress (e) {
          if (e.lengthComputable) {
            // 获取上传文件的进度
            _this.uploadProgress = Math.floor((e.loaded / e.total) * 100)
          }
        },
        params: {
          id: fileId,
          loading: false
        }
      })
        .then((response) => {
          this.updateStep = 2
          this.$refs.webFileInput.value = null
          this.$message.success('上传成功！')
          this.uploadProgress = 0
          setTimeout(() => {
            this.getUpdateProgress()
          }, 1000)
        })
        .catch((error) => {
          this.$refs.webFileInput.value = null
          if (error.message) {
            this.updateStep = 5
            this.uploadProgress = 0
            this.$message.error(error.message)
          }
        }).finally(() => {
          this.list.search()
        })
    },

    // 获取更新进度
    getUpdateProgress () {
      updateProgress({
        loading: false
      }).then(response => {
        this.uploadProgress = response.data
        if (this.uploadProgress === -1) {
          this.updateStep = 5
        }
        if (this.uploadProgress > 0 && this.uploadProgress !== 100) {
          this.updateStep = 3
          if (this.timeout !== null) {
            clearTimeout(this.timeout)
            this.timeout = null
          }
          this.timeout = setTimeout(() => {
            this.getUpdateProgress()
          }, 1000)
        } else if (this.uploadProgress === 100 && this.updateStep !== 0) {
          this.updateStep = 4
          setTimeout(() => {
            this.updateStep = 0
          }, 3000)
        }
      }).catch(error => {
        this.list.search()
        this.updateStep = 5
        this.$message.error(error.message)
      })
    },

    // 获取最近的更新日期
    initLastTime () {
      lastTime({
        loading: false
      }).then(response => {
        this.lastTime = response.data.createDate
      }).catch(error => {
        this.$message.error(error.message)
      })
    }
  },
  beforeDestroy () {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  },
  mounted () {
    if (this.updateStep === 4) {
      this.updateStep = 0
    }
    this.initLastTime()
    this.getUpdateProgress()
  }
}
</script>

<style lang="scss" scoped>
.common-header {
  position: relative;

  .el-button {
    position: absolute;
    right: 30px;
  }
}

.common-body {
  padding: 75px 30px 30px;
  margin-bottom: 20px;
  text-align: center;
  box-sizing: border-box;
  height: 300px;

  .version-info {
    img {
      max-width: 80px;
      margin-bottom: 20px;
      cursor: pointer;
    }
  }

  i {
    color: #9da2a6;
    font-size: 40px;
    outline: none;
    cursor: pointer;

    &:hover {
      color: #3ba3ff;
    }
  }

  .updata-progress {
    width: 575px;
    margin: 32px auto 0;
  }
}

.btn-bad {
  cursor: pointer;
}

.last-time {
  color: #73b5ef;
  font-size: 15px;
}

//了解产品后面的计划，提前调研
//解决问题的方式可能不止一个，别人选了这个方式可能舍弃什么
</style>
