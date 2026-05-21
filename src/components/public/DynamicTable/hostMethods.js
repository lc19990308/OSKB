export default {
  methods: {
    getHostInstance () {
      return this.$refs.table
    },
    clearSelection () {
      this.$refs.table.clearSelection(...arguments)
    },
    toggleRowSelection () {
      this.$refs.table.toggleRowSelection(...arguments)
    },
    toggleAllSelection () {
      this.$refs.table.toggleAllSelection(...arguments)
    },
    toggleRowExpansion () {
      this.$refs.table.toggleRowExpansion(...arguments)
    },
    setCurrentRow () {
      this.$refs.table.setCurrentRow(...arguments)
    },
    clearSort () {
      this.$refs.table.clearSort(...arguments)
    },
    clearFilter () {
      this.$refs.table.clearFilter(...arguments)
    },
    doLayout () {
      this.$refs.table.doLayout(...arguments)
    },
    sort () {
      this.$refs.table.sort(...arguments)
    }
  }
}
