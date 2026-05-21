/**
 * 下载文件
 * **/
export function downloadFile (url, name = '') {
  const a = document.createElement('a')
  a.setAttribute('download', decodeURIComponent(name))
  a.setAttribute('href', url)
  a.target = '_black'
  a.click()
  if (url.indexOf('blob') === 0) {
    window.URL.revokeObjectURL(url)
  }
  a.remove()
}

/**
 * 开始下载
 * **/
export function downloadBlobFileStart (response) {
  const data = response.data
  const blob = new Blob([data], {
    type: data.type
  })
  const url = URL.createObjectURL(blob)
  downloadFile(url, response.fileName)
}

/**
 * 二进制下载文件
 * **/
export function downloadBlobFile (response) {
  return new Promise((resolve, reject) => {
    const data = response.data
    const fileReader = new FileReader()
    fileReader.onload = function (event) {
      try {
        /**
         * 返回的结果如果是json格式的话有可能是出错了，需要判断返回的json有没有code字段
         * **/
        const json = JSON.parse(event.target.result)
        if (json.code) {
          reject(json)
        } else {
          downloadBlobFileStart(response)
          resolve(json)
        }
      } catch (error) {
        /**
         * 解析成对象失败，说明是正常的文件流
         * **/
        if (window.navigator.msSaveOrOpenBlob) {
          // 兼容ie11
          try {
            window.navigator.msSaveOrOpenBlob(data, response.fileName)
            resolve()
          } catch (err) {
            reject(err)
          }
        } else {
          downloadBlobFileStart(response)
          resolve()
        }
      }
    }
    fileReader.readAsText(data)
  })
}
