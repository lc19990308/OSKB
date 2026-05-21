export const openWindow = (url, iWidth = 610, iHeight = 600, target) => {
  const iTop = (window.screen.availHeight - 30 - iHeight) / 2 // 获得窗口的垂直位置;

  const iLeft = (window.screen.availWidth - 10 - iWidth) / 2 // 获得窗口的水平位置;

  const params = 'width=' + iWidth +

      ',height=' + iHeight +

      ',top=' + iTop +

      ',left=' + iLeft +

      ',channelmode=no' +// 是否使用剧院模式显示窗口。默认为 no

      ',directories=no' +// 是否添加目录按钮。默认为 yes

      ',fullscreen=no' + // 是否使用全屏模式显示浏览器

      ',location=no' +// 是否显示地址字段。默认是 yes

      ',menubar=no' +// 是否显示菜单栏。默认是 yes

      ',resizable=no' +// 窗口是否可调节尺寸。默认是 yes

      ',scrollbars=no' +// 是否显示滚动条。默认是 yes

      ',status=no' +// 是否添加状态栏。默认是 yes

      ',titlebar=no' +// 默认是 yes

      ',toolbar=no'// 默认是 yes
  return window.open(url, '', params, target)
}
