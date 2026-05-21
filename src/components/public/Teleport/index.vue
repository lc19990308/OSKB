<script>
export default {
  name: 'teleport',
  props: {
    /* 移动至哪个标签内，最好使用id */
    to: {
      type: String,
      required: true
    },
    reference:{
      type: String,
      required: false
    }
  },

  mounted() {
    const element = document.querySelector(this.to)
    const ref = element.querySelector(this.reference)
    element.insertBefore(this.$el,ref);
  },

  destroyed() {
    this.$el.parentNode.removeChild(this.$el)
  },

  render() {
    return <div>{this.$scopedSlots.default()}</div>
  }
}
</script>
