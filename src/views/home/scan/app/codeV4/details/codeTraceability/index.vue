<template>
  <div class="source-layout">
    <div class="source-l">
      <FilterBox @change="globalParams = $event" />
      <FileDirectory :globalParams="globalParams" ref="fileDirectory" @node-click="nodeClick"/>
    </div>
    <div class="source-r">
      <FilePathViews @change="filePathChange" ref='filePathView'></FilePathViews>
      <SourceList :globalParams="globalParams" ref="table" :filePath="filePath"></SourceList>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import FilterBox from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/Filter-box'
import FileDirectory from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/FileDirectory'
import FilePathViews from '@/components/public/FilePathViews'
import SourceList from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/Table'
import { last } from '@/utils'
export default defineComponent({
  components: {
    SourceList,
    FilePathViews,
    FilterBox,
    FileDirectory
  },
  data () {
    return {
      filePath: '',
      globalParams: {}
    }
  },
  methods: {
    filePathChange ({ path, type }) {
      if (type === 'click') {
        this.$refs.fileDirectory.handleSelect(path)
      }
      this.filePath = get(last(path), 'path')
      this.$nextTick(() => {
        this.$refs.table.search()
      })
    },
    nodeClick (paths) {
      this.$refs.filePathView.setPaths(paths)
    }
  }
})
</script>

<style lang="scss" scoped>
.source-layout {
  position: relative;
  display: flex;
  overflow: hidden;

  .source-l {
    width: 355px;
    margin-right: 15px;
    //float: left;
    flex-shrink: 0;
    align-items: stretch;
  }

  .source-r {
    flex: 1;
    //float: left;
    //width: calc(100% - 410px);
    background-color: #FFFFFF;
    padding: 20px;
    border-radius: 4px;
    align-items: stretch;
  }
}
</style>
