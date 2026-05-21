import WebUpload from './main'
import Vue from 'vue'

let app
function mount(){
  const WebUploadConstructor = Vue.extend(WebUpload)
  app = new WebUploadConstructor().$mount()
  document.body.append(app.$el)
}

export function append (file, options) {
  if (!app) { mount() }
  app.visible = true
  app.$el.querySelector('.dialog-wrap').style = null
  return app.append(file, options)
}

export function getSliceUploadInstance () {
  return app
}

export function destroy () {
  if (!app) return
  app.removeAll()
  app.visible = false
  document.body.removeChild(app.$el)
  app.$destroy()
  app = null
}
