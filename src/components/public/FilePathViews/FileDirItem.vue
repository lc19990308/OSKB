<template>
  <div class='file_dir_item'>
    <div class='item'>
      <span>{{path.node.name}}</span>
      <i class='el-icon-arrow-right' v-if="!last"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileDirItem',
  props: ['path', 'last']
}
</script>

<style scoped lang='scss'>
.file_dir_item:last-child {
  color: #1B2838;
}
.file_dir_item {
  display: inline-block;
  height: 100%;
  padding: 0 4px 0 8px;
  transition: all 200ms;
  cursor: pointer;
  font-size: 14px;
  vertical-align: top;
  color: $text-color-regular;
  &:hover {
    color: #2C5F8A;
  }

  .item {
    height: 100%;
    display: flex;
    align-items: center;
    span{
      margin-right: 2px;
    }
    i {
      padding-left: 3px;
      vertical-align: middle;
    }
  }
}
</style>
