<template>
  <div class="oss-headline m-b-10">
    <div class="flex">
      <slot name="left"></slot>
    </div>
    <div class="flex">
      <slot name="right"></slot>
     <div class="oss-halo-button" @click="$emit('buttonClick')">
       <slot name="button">
         详细<br>
         信息
       </slot>
     </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBanner'
}
</script>

<style scoped lang="scss">
.level-tag {
  line-height: normal !important;
}

.oss-headline {
  background-color: #fff;
  padding: 13px;
  box-shadow: 0 0 14px -8px rgba(124, 58, 237, 50%);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 18px;

  .iconfont {
    font-size: 21px;
    margin-right: 5px;
    vertical-align: middle;
    font-weight: normal;
  }

  .oss-halo-button {
    box-shadow: 0 1px 8px 0 #8B5CF633;
    border: 3px solid #8B5CF67f;
    width: 46px;
    height: 46px;
    font-size: 12px;
    color: #8B5CF6;
    display: flex;
    box-sizing: border-box;
    border-radius: 50%;
    line-height: 14px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease-in;

    &::before, &::after {
      content: "";
      width: 130%;
      height: 130%;
      border-radius: 50%;
      border: 5px solid rgba(1, 88, 255, 0.5);
      //background-color: rgba(1, 88, 255, 0.5);
      position: absolute;
      top: -15%;
      left: -15%;
      box-sizing: border-box;
      transform-origin: center center;
    }

    &::before {
      transform: scale(1.1);
      opacity: 0.3;
      animation: scale 2s infinite ease-in;
    }

    &::after {
      transform: scale(1.3);
      opacity: 0.3;
      animation: scale2 2s infinite ease-out;
    }

  }
}

@keyframes scale {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes scale2 {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
