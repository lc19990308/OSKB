<template>
  <el-select-v2
    ref="select"
    v-bind="$attrs"
    v-on="$listeners"
    filterable
    clearable
    placeholder="请选择所属项目"
    :options="projectListMixin"
    :extra-props="{ label: 'name', value: 'id' }"
  >
  </el-select-v2>
</template>

<script>
import ElSelectV2 from '@/components/public/SelectV2'
export default {
  name: 'ElSelectV2Project',
  components: { ElSelectV2 }
}
</script>
