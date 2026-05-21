<script>
export default {
  name: 'emptypage',
  data () {
    return {
      nextPagePath: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$router.push({
        path: from.path,
        query: to.query
      })
    })
  },
  render (createElement, context) {
    return createElement('div', null)
  }
}
</script>
