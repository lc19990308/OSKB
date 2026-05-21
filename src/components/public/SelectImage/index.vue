<template>
  <div class="upload-image-container">
    <ul class="el-upload-list el-upload-list--picture-card">
      <li tabindex="0" class="el-upload-list__item is-ready" v-for="(file, index) in files" :key="index">
        <img :src="file.url" alt="" class="el-upload-list__item-thumbnail">
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="preview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete"  @click="remove(index)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </li>
    </ul>
    <div tabindex="0" class="el-upload el-upload--picture-card" @click="$refs.file.click()" v-show="limit !== -1 ? files.length < limit : true">
      <i class="el-icon-plus"></i>
      <input type="file" name="file" ref="file" class="el-upload__input" :accept="accept" :multiple="multiple" @change="selectFile">
    </div>
    <el-dialog :custom-class="'img-dialog'" :center="true" :destroy-on-close="true" :visible.sync="dialogVisible" :title="dialogImageName">
      <img :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'SelectImage',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    accept: {
      type: String,
      default () {
        return ''
      }
    },
    multiple: {
      type: Boolean,
      default () {
        return false
      }
    },
    limit: {
      type: Number,
      default () {
        return -1
      }
    },
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      files: [],
      dialogVisible: false,
      dialogImageUrl: '',
      dialogImageName: ''
    }
  },
  watch: {
    value (n) {
      this.files = n
    }
  },
  methods: {
    remove (index) {
      this.files.splice(index, 1)
    },
    preview (file) {
      this.dialogImageUrl = file.url
      this.dialogImageName = file.name
      this.dialogVisible = true
    },
    selectFile (e) {
      if (e.target.files.length > 0) {
        for (let i = 0,len = e.target.files.length; i<len; i++){
          const item = e.target.files.item(i)
          const accepts = this.accept.split(',')
          const name = item.name
          const type = name.slice(name.lastIndexOf('.'))
          if (accepts.length === 0 || (accepts.length > 0 && accepts.includes(type))) {
            item.url = URL.createObjectURL(item)
            this.files.push(item)
            this.$emit('value', this.files)
            this.$emit('change', this.files)
          } else {
            this.$message.error('文件格式错误！')
          }
        }
        this.$refs.file.value = null
      }
    }
  }
}
</script>
<style scoped type="scss">
.upload-image-container{
  display: inline-block;
}
.el-upload-list__item{
  background-color: #000000!important;
}
</style>
