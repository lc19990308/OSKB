/* 是否是手机号 */
export function validatePhone (str) {
  // const reg = /^1[3456789][0-9](\d|\*){8}$/
  const reg = /^1[3456789][0-9](\d|\*){4}\d{4}$/
  return reg.test(str)
}

/* 是否是邮箱 */
export function validateEmail (str) {
  const reg = /^[a-zA-Z0-9_.*-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/g
  return reg.test(str.trim())
}

/* 密码 */
export function validatePassword (str) {
  const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*()_+\-={}|\][:";'<>?,./]).{8,16}$/g
  return reg.test(str)
}

/* 校验用户名 */
export function validateUsername (str) {
  const reg = /^[a-zA-Z0-9_-]{4,30}$/g
  return reg.test(str)
}

/* ip */
export function validateIp (str) {
  const reg = /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/g
  return reg.test(str)
}

/* git url地址 */
export function validateGitUrl (str) {
  // const reg = /^(http(s)?:\/\/([^/]+?\/)+|((ssh:\/\/)|git@)[^:]+:[^/]+?\/)[.a-zA-Z/\d_-]*?(\.git)?$/g
  const reg = /^(http|https)?:\/\/\S*/g
  return reg.test(str)
}

/* svn url地址 */
export function validateSvnUrl (str) {
  const reg = /^(http|https|svn)?:\/\/\S*/g
  // const reg = /^(http|https|svn):\/\/(([\w-]+(\.[\w-]+)*(:(0|[1-9][0-9]{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?([/#?]([（）()\u4e00-\u9fa5\w\-,!@?^=%&:/~+#.]*[（）()\u4e00-\u9fa5\w\-@?^=%&/~+#])?)?)|\[([a-zA-Z\d]{0,4}:){5}([a-zA-Z\d]{0,4})](:(0|[1-9][0-9]{0,3}|[1-5]\d{4}|6[1-4]\d{3}|65[1-4]\d{2}|655[1-2]\d|6553[1-5]))?([/#?]([\w\-,@?^=%&:/~+#.]*[\w\-@?^=%&/~+#])?)?)$/g
  return reg.test(str)
}

/* Firefly url地址 */
export function validateFireflyUrl (str) {
  const reg = /^(http|https)?:\/\/\S*/g
  // const reg = /^(([\w-]+(\.[\w-]+)*(:(0|[1-9][0-9]{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?([/#?]([\u4e00-\u9fa5\w\-,!@?^=%&:/~+#.]*[\u4e00-\u9fa5\w\-@?^=%&/~+#])?)?)|\[([a-zA-Z\d]{0,4}:){5}([a-zA-Z\d]{0,4})](:(0|[1-9][0-9]{0,3}|[1-5]\d{4}|6[1-4]\d{3}|65[1-4]\d{2}|655[1-2]\d|6553[1-5]))?([/#?]([\w\-,@?^=%&:/~+#.]*[\w\-@?^=%&/~+#])?)?)$/g
  return reg.test(str)
}

/* url地址 */
export function validateUrl (str) {
  const reg = /^(http|https)?:\/\/[\w-]+(\.[\w-]+)*([\w\-,@?^=%&:/~+#.]*[\w\-@?^=%&/~+#])?$/g
  return reg.test(str)
}

/* ftp url地址 */
export function validateFtpUrl (str) {
  const reg = /^(ftp)?:\/\/\S*/g
  return reg.test(str)
}

/*
* suf 格式为逗号分隔的多个后缀，例如jpg,gif,png
*/
export function checkSuffix (str, suf) {
  const strRegex = new RegExp('(' + suf.split(',').join('|') + ')$')
  return strRegex.test(str.toLowerCase())
}

/* 校验ipv6 */
export function validateIpv6 (str) {
  const reg = /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$/g
  return reg.test(str)
}

/* 端口 */
export function validatePort (str) {
  const reg = /^(0|[1-9][0-9]{0,3}|[1-5]\d{4}|6[1-4]\d{3}|65[1-4]\d{2}|655[1-2]\d|6553[1-5])$/g
  return reg.test(str)
}

/* 路径 */
export function validateRoute (str) {
  const reg = /^\/[\w-]+(\.[\w-]+)*([\w\-,@?^=%&:/~+#.]*[\w\-@?^=%&~+#])?$/g
  return reg.test(str)
}

// 标准的SSH协议语法格式：ssh://[<username>@]<server>[:<port>]<path>
// 非标准的SSH协议语法格式（SCP格式）：[<username>@]<server>:<path>
export function validateSshUrl (url) {
  const standard = /^ssh:\/\/(?:([^:@]+)(?::([^@]+))?@)?([^:/]+)(?::(\d+))?(?:\/(.*))?$/
  const nonStandard = /^(?:([^:]+)@)?([^:]+):(.+)$/
  return url.startsWith('ssh:') ? standard.test(url) : nonStandard.test(url)
}
