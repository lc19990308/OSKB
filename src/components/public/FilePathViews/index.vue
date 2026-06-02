<template>
  <div class="file_path_views">
    <el-button plain class='back-btn' type="primary">
      <i class="iconfont icona-zuzhijiagou1"></i>
    </el-button>
    <div class='file_path_input'>
      <FileDirItem v-for='(path, index) in paths' :last="(paths.length - 1) === index" @click.native='click(index + 1)' :key=' paths + index ' :path='path'></FileDirItem>
    </div>
  </div>
</template>

<script>
import FileDirItem from '@/components/public/FilePathViews/FileDirItem'
import to from '@/utils/await-to'
export default {
  name: 'FilePathViews',
  components: { FileDirItem },
  props: ['globalParams'],
  data () {
    return {
      paths: []
    }
  },
  methods: {
    click (index) {
      this.paths.splice(index)
      this.$emit('change', { path: this.paths, type: 'click' })
    },
    setPaths(paths){
      this.paths = paths.slice()
      this.$emit('change', { path: this.paths, type: 'setPaths' })
    }
  }
}
</script>

<style scoped lang='scss'>
.file_path_views{
  &:hover{
    border-color: #2C5F8A;
  }
}
.back-btn{
  width:31px;
  font-size: 16px;
  padding: 7px 0;
  vertical-align: top;
  border: none !important;
  border-radius: 3px;
  &:hover,&:active,&:focus{
    color: #2C5F8A !important;
    background: #e9f3fc !important;
  }
}
.back-btn:first-child{
  border-left: none;
}
.back-btn:last-child{
  border-right: none;
}
.file_path_input{
  display: inline-block;
  height: 31px;
  box-sizing: border-box;
  position: relative;
}
</style>
