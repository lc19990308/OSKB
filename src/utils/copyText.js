import { Message } from 'element-ui'
import Copy from 'copy-util'
import eventBus from '@/utils/bus.js'

/**
 * 复制文本
 * **/
export function copyText (txt) {
  const result = Copy(txt)
  if (result) {
    Message.success('已复制到剪切板！')
  } else {
    eventBus.$emit('openDialogCopyText', txt)
  }
}

/**
 * @desc 选中dom元素中的文本并复制
 * @returns { Undefined }
 *
 */
export function selectText (element) {
  if (document.body.createTextRange) {
    const range = document.body.createTextRange()
    range.moveToElementText(element)
    range.select()
    document.execCommand('Copy')
    Message.success('已复制到剪切板！')
  } else if (window.getSelection) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(range)
    document.execCommand('Copy')
    Message.success('已复制到剪切板！')
  } else {
    copyText(element.innerText)
  }
}

export default copyText
