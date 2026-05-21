<template>
  <div class="table-empty--box">
    <svg class="icon svg-icon" aria-hidden="true" :style="{width:'40px',height: '40px'}">
      <use xlink:href="#iconkongshujuicon"></use>
    </svg>
    <p>暂无数据</p>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style scoped lang="scss">
.table-empty--box{
  line-height: initial;
  padding: 30px 0;
  text-align: center;
  p{
    padding: 0;
    margin: 0;
    color: #999999;
    font-family: Source Han Sans CN;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0.2px;
    text-align: center;
  }
}

</style>
