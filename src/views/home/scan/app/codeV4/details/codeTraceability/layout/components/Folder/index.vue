<template>
  <ul class="folder clearfix" v-loading="loading">
    <empty style="padding-top: 80px;" v-if="data.length === 0"></empty>
    <template v-else>
      <folder-children ref="folderItem" :load="load" v-on="$listeners" :index="idx" v-for="(item, idx) in data" :data="item" :props="props" :key="item.id + '一级'"></folder-children>
    </template>
  </ul>
</template>

<script>
import FolderChildren from './FolderChildren'

export default {
  name: 'Folder',
  components: { FolderChildren },
  data () {
    return {
      zIndex: 0,
      isFolder: true,
      active: {}
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    load: Function,
    loading: Boolean,
    props: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label'
      })
    }
  },
  provide () {
    return {
      active: () => this.active,
      setActive: (data) => {
        this.active = data
      }
    }
  },
  methods: {
    setActive (data) {
      this.active = data
    },
    init () {
      this.$nextTick(() => {
        if (this.$refs.folderItem && this.$refs.folderItem.length) {
          this.$refs.folderItem.forEach(item => item.init())
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  list-style: none;
  display: inline-block;
  padding: 0 15px 0 15px;
  min-width: calc(100% - 30px);
}

</style>
