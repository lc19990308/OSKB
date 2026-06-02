<template>
  <div class="empty-container">
    <div class="empty-mask">
      <div>
        <img :src="emptyImg" alt="" />
        <div>暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Empty',
  data () {
    return {
      emptyImg: require('@/assets/images/empty.png'),
    }
  }
}
</script>
<style scoped lang="scss">
.empty-container{
  position: relative;
  .empty-mask{
    width: 100%;
    color: #b4bccc;
    height: 100px;
    padding: 50px 0;
    background-color: rgba(#FFFFFF, 1);
    position: relative;
    z-index: 1;
    top: 0;
    & > div{
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-55px);
      text-align: center;
      img{
        width: 100px;
        margin-bottom: 3px;
      }
    }
  }
}
</style>
