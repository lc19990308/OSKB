import { getCurrentInstance } from 'vue'
import { authorityFilter, handleTheResponse } from '@/utils'

export function useApp () {
  const {
    $router: router,
    $route: route,
    $store: store,
    $refs: refs,
    $message: message,
    $popup: popup,
    $emit: emit,
    $listeners: listeners,
    $attrs: attrs,
    $el,
    $options
  } = getCurrentInstance().proxy

  return {
    $options,
    $el,
    router,
    store,
    refs,
    route,
    message,
    popup,
    emit,
    listeners,
    attrs,
    authorityFilter,
    handleTheResponse
  }
}
