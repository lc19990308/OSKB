import Vue from 'vue'
import Popup from './main.vue'
import {noop, isVNode, isFunction } from '@/utils'
const PopupConstructor = Vue.extend(Popup)


let instance;
let instances = [];
let seed = 1;

export const popup = (options = {}) => {
  const id = 'popup-' + seed++
  const userOnClose = options.onClose || noop
  options.onClose = () => { popup.close(id, userOnClose) }
  instance = new PopupConstructor({
    data: options
  })
  instance.id = id
  if (isFunction(options.render)){
    options.content = options.render(instance.$createElement, instance)
  }
  if (isFunction(options.footer)){
    instance.$slots.footer = [options.footer(instance.$createElement, instance)]
  }
  isVNode(options.content) && (instance.$slots.default = [options.content])
  instance.$mount()
  instance.dialogVisible = true
  instances.push(instance)
  return instance
}


popup.close = function (id, userOnClose) {
  let len = instances.length;
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      userOnClose()
      instances.splice(i, 1);
      break;
    }
  }
}

popup.closeAll = function () {
    while (instances.length){
      instances.pop().close()
    }
}

