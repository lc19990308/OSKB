<script>
import CodeMirror from '@/components/public/CodeMirror/index.vue'

export default {
  name: 'CodeEditor',
  components: { CodeMirror },
  props: ['code', 'marks'],
  methods: {
    markCodeBlockHandle ([start, end]) {
      this.$refs.code.markCode(start, end)
      this.$refs.code.resetLint()
    }
  },
  watch: {
    marks: {
      immediate: true,
      handler (newValue) {
        if (isArray(newValue) && newValue.length && this.code) {
          this.$nextTick(() => {
            this.markCodeBlockHandle(newValue)
          })
        }
      }
    },
    code: {
      immediate: true,
      handler (newValue, oldValue) {
        if (isArray(this.marks) && this.marks.length && newValue && newValue !== oldValue) {
          this.$nextTick(() => {
            this.markCodeBlockHandle(this.marks)
          })
        }
      }
    }
  }
}
</script>

<template>
  <CodeMirror
    ref="code"
    :editor-value="code"
    mode="javascript"
    :options="{ readOnly: true, theme: 'dracula' }">
  </CodeMirror>
</template>
