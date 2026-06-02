<template>
  <div class="table-empty--box">
    <img :src="emptyImg" alt="" class="empty-image">
    <p>暂无数据</p>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      emptyImg: require('@/assets/images/empty.png')
    }
  }
}
</script>

<style scoped lang="scss">
.table-empty--box{
  line-height: initial;
  padding: 30px 0;
  text-align: center;
  .empty-image{
    width: 88px;
    height: 88px;
    object-fit: contain;
    margin-bottom: 8px;
  }
  p{
    padding: 0;
    margin: 0;
    color: #8B9CB0;
    font-family: Source Han Sans CN;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0.2px;
    text-align: center;
  }
}

</style>
