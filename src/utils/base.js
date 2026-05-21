/*
 * =======================
 * base.js
 * 用途：常用函数封装
 * 开发人员：penglei
 * =======================
 * 功能：基础函数库
 * =======================
 */

import { isNull, isUndefined, isObject } from './index'
import { get, isArray, has as hasOwn, noop, sortBy } from 'lodash-es'
import { Message as message } from 'element-ui'
/**
 * @desc 判断当前环境是否是ie浏览器
 * @returns { boolean }
 *
 */
export const isIE = () => {
  return !!window.ActiveXObject || 'ActiveXObject' in window
}

/**
 * @desc 获取对象的值
 * @returns { * }
 * @param { *? } defaultValue
 */
export function getValue (object, path, defaultValue) {
  const result = get(object, path)
  if ((isUndefined(result) || isNull(result) || result === '') && !isUndefined(defaultValue)) {
    return defaultValue
  } else {
    return result
  }
}

/**
 * @desc 创建一个从 object 中选中不包含ignore的对象。
 * @param source { Object }
 * @param ignore { Array | String | Number | Number | Boolean | Null | Undefined }
 * @returns { Object }
 */
export function pickBy (source, ignore) {
  const newObj = {}
  for (const key in source) {
    if (isArray(ignore) && !ignore.includes(source[key])) {
      newObj[key] = source[key]
    } else if (!isArray(ignore) && source[key] !== ignore) {
      newObj[key] = source[key]
    }
  }
  return newObj
}

export function isVNode (node) {
  return node !== null && typeof node === 'object' && hasOwn(node, 'componentOptions')
}

export function escape (str) {
  str = str.replace(/</g, '&lt')
  str = str.replace(/>/g, '&gt')
  return str
}

// 模拟分页
export function simulatePaging (arr = [], current = 1, pageSize = 10) {
  const index = current * pageSize - pageSize
  return arr.slice(index, current * pageSize)
}

// 处理报错信息
export function handleTheResponse (error, successCallback = noop, errorCallback) {
  if (isObject(error) && hasOwn(error, 'message')) {
    if (isFunction(errorCallback)) {
      errorCallback(error)
    } else {
      message.error(error.message)
    }
  } else {
    successCallback()
  }
}

// 截取字符串、添加后缀
export function createStrSuffix (str, start, suffix = '...') {
  if (str && typeof str === 'string' && str.length > start) {
    return str.slice(0, start) + suffix
  } else {
    return str
  }
}

export function whetherScroll (el) {
  el.scrollTop = 10
  setTimeout(() => {
    el.scrollTop = 0
  }, 100)
  return el.scrollTop > 0
}

// 模糊查询
export function fuzzyQuery (list = [], keyWord, prop = 'name') {
  const record = {}
  for (let i = 0, len = list.length; i < len; i++) {
    const obj = { ...list[i] }
    const index = get(obj, prop).toLowerCase().indexOf(keyWord.toLowerCase())

    if (index === -1) continue

    Object.defineProperty(obj, '__index__', {
      value: get(obj, prop).length,
      enumerable: false,
      configurable: false,
      writable: false
    })

    if (!hasOwn(record, index)) {
      record[index] = []
    }

    record[index].push(obj)
  }

  const arr = []
  Object.keys(record).sort().forEach(k => {
    arr.push(...sortBy(record[k], '__index__'))
  })
  return arr
}

export function objectToFormData (formData, data, parentKey) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key => {
      const value = data[key]
      const formKey = parentKey ? `${parentKey}.${key}` : key
      if (isUndefined(value)) {
        // isUndefined
      } else if (Array.isArray(value)) {
        value.forEach((element, index) => {
          const arrayKey = `${formKey}[${index}]`
          objectToFormData(formData, element, arrayKey)
        })
      } else if (isObject(value)) {
        objectToFormData(formData, value, formKey)
      } else {
        if (formData.has(formKey)) {
          formData.set(formKey, value)
        } else {
          formData.append(formKey, value)
        }
      }
    })
  } else {
    if (formData.has(parentKey)) {
      formData.set(parentKey, data)
    } else {
      formData.append(parentKey, data)
    }
  }
}
