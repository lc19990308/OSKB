<template>
  <div class="tn-code">
    <div ref="imgwrap"></div>
    <div class="tncode_div" id="tncode_div" ref="tncode_div">
      <transition name="el-zoom-in-bottom">
        <div class="tncode_box" v-show="boxIsShow">
          <div class="tools">
            <div class="tncode_refresh" ref="tncode_refresh"></div>
            <div class="tncode_tips"></div>
          </div>
          <div class="loading">加载中</div>
          <canvas class="tncode_canvas_bg" width="390" height="256" ref="tncode_canvas_bg"></canvas>
          <canvas class="tncode_canvas_mark" width="390" height="256" ref="tncode_canvas_mark"></canvas>
          <div class="tncode_msg_error"></div>
          <div class="tncode_msg_ok"></div>
        </div>
      </transition>
      <div class="slide" @mouseover="showBox(true)" @mouseleave="showBox(false)">
        <div class="slide_block" ref="slide_block">
          <div class="slide_block_arrows lr" ref="slide_block_arrows"></div>
        </div>
        <div class="slide_bt_bg" ref="slide_bt_bg">
          <span id="result-msg" ref="resultMsg"></span>
        </div>
        <div class="slide_btn" ref="slide_btn"></div>
        <div class="slide_block_text noselect" ref="slide_block_text">拖动左侧滑块登录</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TNcode',
  data () {
    return {
      boxIsShow: false,
      onlyInit: true,
      obj: null,
      tncode: null,
      img: null,
      send_url: null,
      img_src: null,
      img_loaded: false,
      is_draw_bg: false,
      is_moving: false,
      block_start_x: 0,
      block_start_y: 0,
      doing: false,
      login_error_time: 0,
      mark_w: 67,
      mark_h: 55,
      mark_offset: 0,
      img_w: 390,
      img_h: 256,
      result: false,
      err_c: 0,
      onsuccess: null,
      ratio: 0
    }
  },
  props: ['imgCodeUrl', 'loginService', 'user', 'password', 'disclaimer'],
  methods: {
    _bind (elm, evType, fn) {
      if (elm.addEventListener) {
        elm.addEventListener(evType, fn)
        return true
      } else if (elm.attachEvent) {
        const r = elm.attachEvent(evType, fn)
        return r
      }
    },
    _draw_fullbg () {
      const tncode = this
      const canvasBg = tncode.$refs.tncode_canvas_bg
      canvasBg.width = tncode.img_w
      canvasBg.height = tncode.img_h
      const ctxBg = canvasBg.getContext('2d')
      ctxBg.drawImage(tncode.img, 0, tncode.img_h * 2, tncode.img_w, tncode.img_h, 0, 0, tncode.img_w, tncode.img_h)
      tncode._draw_bg()
    },
    _draw_bg () {
      const tncode = this
      if (tncode.is_draw_bg) {
        return
      }
      tncode.is_draw_bg = true
      const canvasBg = tncode.$refs.tncode_canvas_bg
      const ctxBg = canvasBg.getContext('2d')
      ctxBg.drawImage(tncode.img, 0, 0, tncode.img_w, tncode.img_h, 0, 0, tncode.img_w, tncode.img_h)
    },
    _draw_mark () {
      const tncode = this
      const canvasMark = tncode.$refs.tncode_canvas_mark
      const ctxMark = canvasMark.getContext('2d')
      // 清理画布
      ctxMark.clearRect(0, 0, canvasMark.width, canvasMark.height)
      ctxMark.drawImage(tncode.img, 0, tncode.img_h, tncode.mark_w, tncode.img_h, tncode.mark_offset, 0, tncode.mark_w, tncode.img_h)
      const imageData = ctxMark.getImageData(0, 0, tncode.img_w, tncode.img_h)
      ctxMark.putImageData(imageData, 0, 0)
    },
    refresh () {
      const tncode = this
      tncode.err_c = 0
      tncode.is_draw_bg = false
      tncode.result = false
      tncode.img_loaded = false
      let obj = tncode.$refs.tncode_canvas_bg
      obj.style.display = 'none'
      obj.width = tncode.img_w
      obj.height = tncode.img_h
      obj = tncode.$refs.tncode_canvas_mark
      obj.width = tncode.img_w
      obj.height = tncode.img_h
      obj.style.display = 'none'
      tncode.img_src = tncode.imgCodeUrl
      tncode.img = new Image()
      tncode.img.src = tncode.img_src
      tncode.img.onload = () => {
        let obj
        tncode._draw_fullbg()
        const canvasMark = tncode.$refs.tncode_canvas_mark
        canvasMark.width = tncode.img_w
        canvasMark.height = tncode.img_h
        const ctxMark = canvasMark.getContext('2d')
        // 清理画布
        ctxMark.clearRect(0, 0, canvasMark.width, canvasMark.height)
        tncode.img_loaded = true
        obj = tncode.$refs.tncode_canvas_bg
        obj.style.display = ''
        obj = tncode.$refs.tncode_canvas_mark
        obj.style.display = ''
        tncode.mark_offset = 0
        tncode._draw_mark()
      }
    },
    _block_start_move (e) {
      if (!this.disclaimer) {
        return 0
      }
      const tncode = this
      if (tncode.doing || !tncode.img_loaded) {
        return
      }
      e.preventDefault()
      let theEvent = window.event || e
      if (theEvent.touches) {
        theEvent = theEvent.touches[0]
      }
      const obj = tncode.$refs.slide_block_text
      obj.style.display = 'none'
      tncode._draw_bg()
      tncode.block_start_x = theEvent.clientX
      tncode.block_start_y = theEvent.clientY
      tncode.doing = true
      tncode.is_moving = true
    },
    _block_on_move (e) {
      if (!this.disclaimer) {
        return 0
      }
      const tncode = this
      if (!tncode.doing) return true
      if (!tncode.is_moving) return true
      e.preventDefault()
      let theEvent = window.event || e
      if (theEvent.touches) {
        theEvent = theEvent.touches[0]
      }
      tncode.is_moving = true
      let offset = theEvent.clientX - tncode.block_start_x
      if (offset < 0) {
        offset = 0
      }
      const maxOff = tncode.img_w - tncode.mark_w
      if (offset > maxOff) {
        offset = maxOff
      }
      const obj = tncode.$refs.slide_block
      obj.style.cssText = 'transition:none;transform: translate(' + offset + 'px, 0px)'

      const slideBtBg = tncode.$refs.slide_bt_bg
      slideBtBg.style.cssText = 'transition:none;width:' + offset + 'px'

      const slideBtn = tncode.$refs.slide_btn
      slideBtn.style.cssText = 'transition:none;width:' + ((324 - offset) <= 0 ? 0 : (324 - offset)) + 'px'

      tncode.mark_offset = offset / maxOff * (tncode.img_w - tncode.mark_w)
      tncode._draw_bg()
      tncode._draw_mark()
    },
    _block_on_end (e) {
      if (!this.disclaimer) {
        return 0
      }
      const tncode = this
      if (!tncode.doing) return true
      e.preventDefault()
      let theEvent = window.event || e
      if (theEvent.touches) {
        theEvent = theEvent.touches[0]
      }
      tncode.doing = false
      tncode.is_moving = false
      this.loginService(this.mark_offset, this._send_result)
    },
    _send_result (res) {
      if (res) {
        this._send_result_success()
      } else {
        this._send_result_failure()
      }
    },
    _send_result_success () {
      const tncode = this
      tncode.doing = false
      // tncode._showmsg('√验证成功',1);
      const resultMsg = tncode.$refs.resultMsg
      resultMsg.innerHTML = '<i class="fa fa-check"></i>验证成功'
      resultMsg.style.cssText = 'display:block'
      setTimeout(() => {
        resultMsg.innerText = '登录中，请稍候...'
      }, 1000)

      tncode.result = true
      const obj = tncode.$refs.slide_block
      obj.style.cssText = 'transition:all 0.5s;transform: translate(339px, 0px);opacity: 0;'

      const slideBtBg = tncode.$refs.slide_bt_bg
      slideBtBg.style.cssText = 'transition:all 0.5s;'
      slideBtBg.style.width = '100%'

      const slideBtn = tncode.$refs.slide_btn
      slideBtn.style.cssText = 'transition:all 0.5s;'
      slideBtn.style.width = '0px'

      tncode.img = null
      tncode.err_c = 0
    },
    _send_result_failure () {
      const tncode = this
      tncode.doing = false
      const slideBlockArrows = tncode.$refs.slide_block_arrows

      slideBlockArrows.classList.add('slide_block_arrows_error')
      slideBlockArrows.classList.remove('lr')
      setTimeout(() => {
        slideBlockArrows.classList.remove('slide_block_arrows_error')
        slideBlockArrows.classList.add('lr')

        let obj = tncode.$refs.slide_block
        obj.style.cssText = 'transition:all 0.5s;opacity: 1;'

        const slideBtBg = tncode.$refs.slide_bt_bg
        slideBtBg.style.cssText = 'width:0px;transition:all 0.5s;'

        const slideBtn = tncode.$refs.slide_btn
        slideBtn.style.cssText = 'width:324px;transition:all 0.5s;'

        obj = tncode.$refs.slide_block_text
        obj.style.display = 'block'
        if (tncode.err_c <= 0) {
          tncode.refresh()
        }
      }, 1000)
      tncode.result = false
    },
    init () {
      const tncode = this
      if (!tncode.img) {
        let obj = tncode.$refs.slide_block
        tncode._bind(obj, 'mousedown', tncode._block_start_move)
        tncode._bind(document, 'mousemove', tncode._block_on_move)
        tncode._bind(document, 'mouseup', tncode._block_on_end)
        obj = tncode.$refs.tncode_refresh
        tncode._bind(obj, 'click', tncode.refresh)
        tncode.refresh()
      }
    },
    showBox (show) {
      if (!this.disclaimer) {
        return 0
      }
      if (this.onlyInit === false) {
        this.boxIsShow = show
      }
    }
  },
  watch: {
    user (n) {
      if (n && this.password && this.disclaimer && this.loginService && this.onlyInit) {
        this.onlyInit = false
        this.init()
      }
    },
    password (n) {
      if (n && this.user && this.disclaimer && this.loginService && this.onlyInit) {
        this.onlyInit = false
        this.init()
      }
    },
    disclaimer (n) {
      if (n && this.user && this.password && this.loginService && this.onlyInit) {
        this.onlyInit = false
        this.init()
      }
    }
  },
  mounted () {},
  created () {}
}
</script>
<style lang="scss" scoped>
  $color-primary: #2C5F8A;
  $color-primary-light: #3E7CB1;
  $color-accent: #8fd6ff;

  .tn-code {
    z-index: 1000;
    width: 100%;
    height: 54px;
    position: relative;
    margin: 10px auto 0;

    .slide {
      position: absolute;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: visible;
      background: linear-gradient(180deg, rgba(16, 42, 69, 0.54) 0%, rgba(8, 26, 46, 0.48) 100%);
      border: 1px solid rgba($color-accent, 0.50);
      border-radius: 10px;
      box-shadow: inset 0 0 20px rgba($color-primary, 0.22);
    }

    .slide_block {
      background-image: url(~@/assets/images/ver_01.png);
      background-position: 0;
      background-size: auto 100%;
      width: 100px;
      height: 100%;
      position: absolute;
      border-radius: 9px 0 0 9px;
      left: 0;
      top: 0;
      transition: all 0.5s;
      z-index: 10000;
      cursor: pointer;
      box-shadow: 0 0 12px rgba($color-accent, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.12);

      .slide_block_arrows {
        width: 20px;
        position: absolute;
        top: 26px;
        left: 25px;

        &::before {
          content: "";
          display: block;
          position: absolute;
          width: 40px;
          height: 2px;
          background-color: #fff;
        }

        &::after {
          content: "";
          display: block;
          position: absolute;
          width: 12px;
          height: 2px;
          background-color: #fff;
          transform: rotateZ(30deg);
          right: -20px;
          top: -3px;
        }
      }
    }

    .slide_btn {
      background-image: url(~@/assets/images/ver_003.png);
      background-size: auto 100%;
      width: 324px;
      height: 100%;
      position: absolute;
      right: 0;
      cursor: initial;
      border-radius: 0 9px 9px 0;
      overflow: hidden;

      &::after {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-radius: 50%;
        background-color: rgba($color-accent, 0.55);
        box-shadow: 0 0 70px 14px rgba($color-accent, 0.35);
        position: relative;
        top: 0;
        left: 0;
        animation: to-right 3s ease-in 0s infinite;
      }
    }

    .slide_bt_bg {
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 9px 0 0 9px;
      width: 0;
      height: 100%;
      background: linear-gradient(90deg, $color-primary, $color-primary-light, rgba($color-accent, 0.7));
    }

    .slide_block_text {
      position: absolute;
      left: 202px;
      top: 35px;
      margin: -4.62% 0 0 -7.31%;
      font-size: 16px;
      color: rgba($color-accent, 0.9);
      cursor: initial;
      letter-spacing: 0.06em;
    }

    #result-msg {
      width: 100%;
      height: 100%;
      line-height: 50px;
      color: #dff3ff;
      font-size: 14px;
      text-align: center;
    }

    .tncode_box {
      width: 390px;
      position: absolute;
      top: -292px;
      height: 256px;
      overflow: hidden;
      border: 1px solid rgba($color-accent, 0.22);
      border-radius: 10px;
      box-shadow: 0 20px 50px rgba(5, 20, 36, 0.44);
    }

    .tools {
      position: absolute;
      z-index: 10001;
      top: 6px;
      right: 8px;
    }

    .tools .tncode_refresh {
      background-position: 0 94%;
      height: 30px;
      width: 30px;
      float: left;
      cursor: pointer;
      background-repeat: no-repeat;
      background-image: url(~@/assets/images/tncodebtn.png);
      filter: brightness(1.3) saturate(0.6) hue-rotate(160deg);
      opacity: 0.85;

      &:hover {
        opacity: 1;
        filter: brightness(1.5) saturate(0.6) hue-rotate(160deg);
      }
    }

    .tncode_tips {
      float: right;
    }

    .tncode_div .loading {
      position: absolute;
      left: 0;
      top: 0;
      background:
        radial-gradient(circle at top, rgba(84, 147, 202, 0.16) 0, transparent 32%),
        linear-gradient(180deg, rgba(17, 44, 73, 0.96) 0%, rgba(8, 26, 46, 0.98) 100%);
      width: 390px;
      height: 256px;
      text-align: center;
      box-sizing: border-box;
      line-height: 255px;
      color: rgba($color-accent, 0.8);
    }

    .tncode_canvas_bg,
    .tncode_canvas_mark {
      z-index: 10000;
      width: 390px;
    }

    .tncode_div canvas {
      position: absolute;
      left: 0;
      top: 0;
    }

    .tncode_div .tncode_canvas_bg {
      z-index: 0;
    }
  }

  @keyframes to-right {
    0% {
      left: -10%;
    }

    60% {
      left: -10%;
    }

    100% {
      left: 110%;
    }
  }
</style>
