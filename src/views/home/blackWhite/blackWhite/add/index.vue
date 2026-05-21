<template>
  <div class="view-content">
    <div class="header-warp m-b-5">
      <icon-button tooltip-disabled el-icon="el-icon-back" radius @click="$router.push({ path: `/black-white/black-white/main/${isBlackList ? 'black' : 'white'}/list` })"></icon-button>添加组件{{ isBlackList ? '黑' : '白' }}名单
    </div>
    <add-list></add-list>
  </div>
</template>

<script>
import AddList from './addList'

export default {
  name: 'index',
  components: {
    AddList
  },
  computed: {
    isBlackList: function () {
      return this.$route.path.indexOf('add-black-list') !== -1
    }
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.view-content {
  padding: 0 0 20px !important;
}

.header-warp {
  border-bottom: 1px solid #dcdee0;
  height: 50px;
  padding-left: 20px;
  display: flex;
  align-items: center;
  color: #333;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0.4px;

  i {
    margin-top: 2px;
    font-weight: bold;
    margin-right: 8px;
  }
}

.tabs-warp {
  width: 200px;
  margin: 0 auto;
}

:deep(.el-tabs__nav-wrap::after) {
  width: 0 !important;
}
</style>
