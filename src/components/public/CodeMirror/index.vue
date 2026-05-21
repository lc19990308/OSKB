<template>
  <codemirror
    ref="myCm"
    :value="editorValue"
    :options="cmOptions"
    @changes="onCmCodeChanges"
    @blur="onCmBlur"
    @paste.native="onPaste"
  ></codemirror>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/mode/javascript/javascript'
// import 'codemirror/theme/xq-light.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/php/php'
import 'codemirror/mode/ruby/ruby'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/selection/mark-selection'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/jump-to-line'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
require('script-loader!jsonlint')
export default {
  name: 'CodeMirror',
  components: {
    codemirror
  },
  props: ['editorValue', 'mode', 'autoFormatJson', 'jsonIndentation', 'options'],
  model: {
    prop: 'editorValue',
    event: 'change'
  },
  computed: {
    codemirror () {
      return this.$refs.myCm.codemirror
    }
  },
  data () {
    return {
      cmOptions: {
        mode: !this.mode || this.mode === 'default' ? 'application/json' : this.mode,
        tabSize: 4,
        lineWrapping: true,
        lineNumbers: true,
        autofocus: true,
        smartIndent: false,
        autocorrect: true,
        spellcheck: true,
        scrollbarStyle: 'overlay',
        extraKeys: {
          Tab: 'autocomplete',
          'Ctrl-Alt-L': () => {
            try {
              if (this.cmOptions.mode === 'application/json' && this.editorValue) {
                this.$emit('change', this.formatStrInJson(this.editorValue))
              }
            } catch (e) {
              this.$message.error('格式化代码出错：' + e.toString())
            }
          }

        },
        lint: true,
        gutters: !this.mode || this.mode === 'application/json' ? [
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter'
        ] : [
          'CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'
        ],
        foldGutter: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchTags: { bothTags: true },
        matchBrackets: true,
        styleActiveLine: true,
        autoRefresh: true,
        highlightSelectionMatches: {
          minChars: 2,
          style: 'matchhighlight',
          showToken: true
        },
        styleSelectedText: true,
        enableAutoFormatJson: this.autoFormatJson === null ? true : this.autoFormatJson,
        defaultJsonIndentation: !this.jsonIndentation || typeof this.jsonIndentation !== typeof 1 ? 2 : this.jsonIndentation
      },
      enableAutoFormatJson: this.autoFormatJson === null ? true : this.autoFormatJson,
      defaultJsonIndentation: !this.jsonIndentation || typeof this.jsonIndentation !== typeof 1 ? 2 : this.jsonIndentation
    }
  },

  watch: {
    mode: function () {
      this.$set(this.cmOptions, 'mode', this.mode)
      this.resetLint()
      this.resetFoldGutter()
    }
  },

  methods: {
    resetLint () {
      if (!this.$refs.myCm.codemirror.getValue()) {
        this.$nextTick(() => {
          this.$refs.myCm.codemirror.setOption('lint', false)
        })
        return
      }
      this.$refs.myCm.codemirror.setOption('lint', false)
      this.$nextTick(() => {
        this.$refs.myCm.codemirror.setOption('lint', true)
      })
    },

    resetFoldGutter () {
      this.$refs.myCm.codemirror.setOption('foldGutter', false)
      this.$nextTick(() => {
        this.$refs.myCm.codemirror.setOption('foldGutter', true)
      })
    },

    // 获取值
    getValue () {
      try {
        return this.$refs.myCm.codemirror.getValue()
      } catch (e) {
        const errorInfo = e.toString()
        this.$message.error('获取编辑框内容失败：' + errorInfo)
        return errorInfo
      }
    },

    // 修改值
    setValue (value) {
      try {
        if (typeof value !== typeof '') {
          this.$message.error('修改编辑框内容失败：编辑宽内容只能为字符串')
          return
        }
        if (this.cmOptions.mode === 'application/json') {
          this.$emit('change', this.formatStrInJson(value))
        } else {
          this.$emit('change', value)
        }
      } catch (e) {
        this.$message.error('修改编辑框内容失败：' + e.toString())
      }
    },

    // 黏贴事件处理函数

    onPaste () {
      if (this.cmOptions.mode === 'application/json') {
        try {
          this.$emit('change', this.formatStrInJson(this.editorValue))
        } catch (e) {
          // 啥都不做
        }
      }
    },

    // 失去焦点时处理函数
    onCmBlur (cm) {
      try {
        const editorValue = cm.getValue()
        if (this.cmOptions.mode === 'application/json' && editorValue) {
          if (!this.enableAutoFormatJson) {
            return
          }
          this.$emit('change', this.formatStrInJson(editorValue))
        }
      } catch (e) {
        // 啥也不做
      }
    },

    onCmCodeChanges (cm) {
      this.$emit('change', cm.getValue())
      this.resetLint()
    },

    // 格式化字符串为json格式字符串
    formatStrInJson (strValue) {
      return JSON.stringify(JSON.parse(strValue), null, this.defaultJsonIndentation)
    },

    markCode (start = 0, end = 0) {
      this.codemirror.markText({
        line: start - 1,
        ch: 0
      }, {
        line: end,
        ch: 0
      }, { className: 'styled-background' })
    },

    jumpToLine (line) {
      // const t = this.codemirror.charCoords({
      //   line: line,
      //   ch: 0
      // }, 'local').top
      // const middleHeight = this.codemirror.getScrollerElement().offsetHeight / 2
      // this.codemirror.scrollTo(null, t - middleHeight - 5)


      this.codemirror.setCursor(line - 1)
    }
  },

  created () {
    try {
      if (this.options) {
        Object.assign(this.cmOptions, this.options)
      }
      if (!this.editorValue) {
        this.cmOptions.lint = false
        return
      }
      if (this.cmOptions.mode === 'application/json') {
        if (!this.enableAutoFormatJson) {
          return
        }
        this.$emit('change', this.formatStrInJson(this.editorValue))
      }
    } catch (e) {
      this.$message.error('初始化codemirror出错：' + e)
    }
  }
}

</script>
<style lang="scss" scoped>
:deep(.CodeMirror-linenumber) {
  text-align: center;
}
</style>
