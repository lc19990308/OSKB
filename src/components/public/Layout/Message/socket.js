import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import store from '@/store/store'
export default class Socket {
  constructor ({ subscribe, errorCallback }) {
    this.url = '/oss/message'
    this.headers = {
      Authorization: 'Bearea ' + store.state.login.accessToken
    }
    this.subscribe = subscribe || []
    this.socket = new SockJS(this.url)
    this.stompClient = Stomp.over(this.socket)
    this.stompClient.debug = null
    this.stompClient.connect(this.headers, () => {
      this.subscribe.forEach(sub => {
        this.stompClient.subscribe(sub.url, sub.callback, { ...this.headers })
      })
    }, (error) => {
      if (typeof errorCallback === 'function') {
        errorCallback(error)
      }
    })
  }

  // 关闭连接
  close () {
    this.stompClient.disconnect()
  }
}
