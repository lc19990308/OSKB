<template>
    <span v-if="showText && visible">
    {{matching(markStatusOptions, status, 'value', 'label')}}
    </span>
    <el-tag
      v-else-if="visible"
      size="small"
      class="cm-tag"
    >
      {{matching(markStatusOptions, status, 'value', 'label')}}
    </el-tag>
</template>

<script>
export default {
  name: 'MarkTag',
  props: ['status', 'type', 'showText'],
  data() {
    return {
      markStatusOptions: []

    }
  },
  computed: {
    visible() {
      return typeof this.status === 'number' && ( this.type === 'component' ? this.status > 2 : this.status > 0)
    }
  },
  created () {
    this.markStatusOptions = this.type === 'component' ? [
      {
        value: 3,
        label: '黑名单'
      },
      {
        value: 4,
        label: '白名单'
      }
    ] : [
      {
        value: 1,
        label: '黑名单'
      },
      {
        value: 2,
        label: '白名单'
      }
    ]
  }
}
</script>
