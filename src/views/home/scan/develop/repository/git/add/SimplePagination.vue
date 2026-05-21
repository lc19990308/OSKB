<template>
<div class="simple-pagination">
<!--  <el-select v-model="_pageSize" disabled size="mini" style="width: 100px;" class="m-r-15">-->
<!--    <el-option-->
<!--      v-for="item in pageSizes"-->
<!--      :key="item.value"-->
<!--      :label="item.label"-->
<!--      :value="item.value">-->
<!--    </el-option>-->
<!--  </el-select>-->
  <el-button size="mini" plain :disabled="currentPage <= 1" class="custom-btn" @click="goHome">回到首页</el-button>
  <el-button size="mini" plain :disabled="currentPage <= 1" class="custom-btn" @click="prevChange">上一页</el-button>
  <el-button size="mini" plain :disabled="_length < pageSize" class="custom-btn" @click="nextChange">下一页</el-button>
</div>
</template>

<script>
import { PAGE_CONF } from '@/utils/conf'
export default {
  name: 'SimplePagination',
  props: ['pageSize', 'currentPage', 'data'],
  data () {
    return {
      pageSizes: PAGE_CONF.pageSizes.map(n => {
        return { label: n + '条/页', value: n }
      })
    }
  },
  computed: {
    _length () {
      return this.data.length || 0
    },
    _pageSize: {
      get () {
        return this.pageSize || 10
      },
      set (v) {
        this.$emit('update:page-size', v)
        this.$emit('size-change', v)
      }
    }
  },
  methods: {
    goHome () {
      this.$emit('update:current-page', 1)
      this.$emit('current-change', 1)
    },
    prevChange () {
      this.$emit('update:current-page', this.currentPage - 1)
      this.$emit('current-change')
    },
    nextChange () {
      this.$emit('update:current-page', this.currentPage + 1)
      this.$emit('current-change')
    }
  }
}
</script>

<style scoped lang="scss">
.simple-pagination {
  display: inline-block;
}

.custom-btn {
  width: 80px;
  height: 28px;
  color: $color-primary;
  margin-left: 5px;

  &.is-disabled {
    color: #DCDEE0;
    border: 1px solid #ddd;
    &:hover,&:active,&:focus {
      color: #DCDEE0;
      border: 1px solid #ddd;
    }
  }
}
</style>
