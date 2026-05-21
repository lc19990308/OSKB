<template>
  <div class="progress-wrapper">
    <span class="progress-text">{{ progressText }}</span>
    <div
      :style="{width: percentage + '%'}"
      class="progress-bar"
    >
      <span class="progress-light"></span>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Progress',
  props: {
    percentage: {
      required: true,
      type: Number,
      default: () => 0
    },
    format: {
      type: Function,
      default: (percentage) => {
        return percentage + '%'
      }
    }
  },
  computed: {
    progressText () {
      return this.format(this.percentage)
    }
  }
}
</script>
<style lang="scss" scoped>
.progress-wrapper {
  width: 100px;
  height: 20px;
  border-radius: 2px;
  position: relative;
  background-color: #f3f6f9;

  .progress-bar {
    height: 100%;
    background-color: #89bfef;
    border-radius: 2px;
    overflow: hidden;
    position: relative;

    &::after {
      content: "";
      display: block;
      background-size: 100% auto;
      position: absolute;
      width: 0;
      height: 100%;
      box-shadow: 0 0 13px 6px hwb(0deg 100% 0% / 60%);
      top: 0;
      border-radius: 50%;
      left: 0;
      opacity: 0;
      animation-name: to-left;
      animation-duration: 1.5s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
  }

  .progress-text {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    margin: auto;
    font-size: 12px;
    line-height: 12px;
    color: #333;
    display: block;
    width: 40px;
    text-align: center;
    height: 14px;
  }
}
@keyframes to-left {
  0% {
    left: 0;
    opacity: 0;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    left: 100%;
    opacity: 0;
  }
}

</style>
