<script>
const types = ['warning', 'info', 'danger', 'primary', 'success']
export default {
  name: 'Dot',
  functional: true,
  props: {
    type: {
      type: String,
      validator (type) {
        if (type && !types.includes(type)) {
          console.error('dot的type类型必须为' + types.join('、'))
        }
        return true
      },
      default: 'success'
    },
    plain: { // false：闪烁
      type: Boolean,
      default: false
    }
  },
  render (createElement, context) {
    return createElement('span', context.data, [
      createElement('span', {
        class: {
          'dot-base': true,
          ['dot-' + context.props.type]: true,
          'dot-halo-paused': context.props.plain
        }
      }),
      context.children
    ])
  }
}
</script>

<style lang="scss" scoped>
.dot-base {
  height: 7px;
  width: 7px;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  margin-right: 5px;
  vertical-align: 0.1em;
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 50%;
    animation: scaleout 1.2s infinite ease-in-out;
    // 开启gpu动画加速
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    transform: translateZ(0);
  }
}
.dot-halo-paused{
  &:before{
    animation-play-state: paused;
  }
}

@each $type, $color in (
  primary:$color-primary,
  info:$color-secondary,
  success:$color-success,
  danger:$color-danger,
  warning:$color-warning
) {
  .dot-#{$type} {
    background-color: $color;

    &:before {
      background-color: $color;
    }
  }
}

@keyframes scaleout {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>
