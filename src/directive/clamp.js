import { escape } from '@/utils'
import { popup } from '@/components/public/Popup'
import { createClamp } from '@penglei188288/clampjs'

function install (el, { value }) {
  el.clamp = createClamp(el, {
    suffixHTML: '<span class="text-primary m-l-5">...查看全部</span>',
    responsive: true,
    suffixClick (original) {
      popup({
        title: '查看全部',
        width: '650px',
        showCancelButton: false,
        content: `<pre style="white-space: pre-line;padding: 0; margin: 0;line-height: 25px">${escape(original)}</pre>`
      })
    },
    ...value
  })
}

export default {
  inserted () {
    install(...arguments)
  },
  update (el, { oldValue, value }) {
    if (oldValue.text === value.text) return
    install(...arguments)
  },
  unbind (el) {
    el.clamp.destroy()
  }
}
