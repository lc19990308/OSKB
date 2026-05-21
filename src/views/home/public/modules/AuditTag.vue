<template>
  <el-tag
    v-if="visible"
    size="small"
    class="cm-tag m-r-5"
  >
    {{matching(auditStatusOptions, status, 'value', 'label')}}
  </el-tag>
</template>

<script>
export default {
  name: 'AuditTag',
  props: ['status'],
  data() {
    return {
      auditStatusOptions: [
        {
          value: 1,
          label: '忽略'
        },
        {
          value: 2,
          label: '误报'
        },
        {
          value: 3,
          label: '挂起'
        },
        {
          value: 4,
          label: '已修复'
        },
        {
          value: 5,
          label: '已确认'
        }
      ]

    }
  },
  computed: {
    visible() {
      return typeof this.status === 'number' &&  this.status < 6
    }
  }
}
</script>
