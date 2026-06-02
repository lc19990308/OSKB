<template>
  <el-button @click="$emit('input', !value)" plain size="medium"
             :style="styles"
             class="floating-button" circle>
    <i :class="['font-bold', value ? 'el-icon-close text-secondary' : 'el-icon-pie-chart text-primary']"></i>
  </el-button>
</template>

<script>
export default {
  name: 'FloatingButton',
  props: ['left', 'right', 'bottom', 'top', 'value'],
  computed:{
    styles(){
      return {
        ...(this.left && { left: this.left + 'px' }),
        ...(this.right && { right: this.right + 'px' }),
        ...(this.bottom && { bottom: this.bottom + 'px' }),
        ...(this.top && { top: this.top + 'px' })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@keyframes halo {
  0% {
    box-shadow: 0 1px 8px 2px rgba(30, 136, 229, 0.5), inset 0 6px 14px -6px rgba(30, 136, 229, 0.2);
  }
  50% {
    box-shadow: 0 1px 8px 2px rgba(30, 136, 229, 0.8), inset 0 6px 14px -6px rgba(30, 136, 229, 0.5);
  }
  100% {
    box-shadow: 0 1px 8px 2px rgba(30, 136, 229, 0.5), inset 0 6px 14px -6px rgba(30, 136, 229, 0.2);
  }

}

.floating-button {
  position: absolute;
  z-index: 999;
  box-shadow: 0 1px 8px 2px rgba(30, 136, 229, 0.7);
  border: 2px solid rgba(30, 136, 229, 1);
  display: block;
  font-size: 16px;
  animation: halo 2s infinite ease-in-out;
  i{
    transition: all 0.1s;
  }
  &:hover i{
    color: #8BAAC4;
    transform: scale(1.1);
  }
}
</style>
