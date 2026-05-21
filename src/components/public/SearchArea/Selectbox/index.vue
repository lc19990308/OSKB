<template>
  <!-- 编号选择器 -->
  <el-select v-model="searchSelect" style="min-width: 150px" @change="checkSelect" size="medium">
    <el-option
      v-for="item in selectOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SearchSelect',
  model: {
    prop: 'search-select',
    event: 'change'
  },
  props: {
    value: {
      type: String
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    selectOptions: {
      type: Array,
      default () {
        return []
      }
    },
    select: {
      default () {
        return []
      }
    }
  },
  data () {
    return {
      searchSelect: this.selectOptions[0].label
    }
  },
  methods: {
    checkSelect () {
      this.$emit('change', this.searchSelect)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  //margin-right:10px;
  width:150px
}
</style>
