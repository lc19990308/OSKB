/**
 * @param { Promise } promise
 * @param { Object } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to (promise, errorExt = null) {
  return promise
    .then(function (data) { return [null, data] }) // 执行成功，返回数组第一项为 null。第二个是结果。
    .catch(function (err) {
      if (errorExt) {
        Object.assign(err, errorExt)
      }
      return [err, undefined] // 执行失败，返回数组第一项为错误信息，第二项为 undefined
    })
}

export default to
