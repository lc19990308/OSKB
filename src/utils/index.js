/*
 * ========================
 * index.js
 * 用途：utils统一导出
 * 开发人员：penglei
 * ========================
 * 功能：utils统一导出
 * ========================
 */

export { to as awaitTo, to } from './await-to'
export { debounce, throttle, cloneDeep as deepClone, has as hasOwn, has, merge, set, noop, sortBy, last, first, once } from 'lodash-es'
export { isUndefined, isNull, isFunction, isObject, isArray, isNumber, isString, toPath, isEqual as diff, pick, compact, omit } from 'lodash-es'
export { isIE, getValue as get, pickBy, isVNode, escape, simulatePaging, createStrSuffix, handleTheResponse, whetherScroll, fuzzyQuery } from './base'

export { copyText } from './copyText'
export { default as bus } from './bus'
export { authorityFilter } from './permission'
export { rowClickExpand, matching } from './table'
export { downloadFile, downloadBlobFileStart, downloadBlobFile } from './downloadFile'
export { sessionStore, localStore } from './storage'
