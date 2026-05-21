/*
 * ========================
 * table.js
 * 用途：处理el-table的辅助函数
 * 开发人员：penglei
 * ========================
 * 功能：处理el-table工具函数
 * ========================
 */

import { get } from './index'

/**
 * @desc 点击表格行，展开详情
 * @desc 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
 * @param { Object } row
 * @param { String } defaultExpand
 * @param { String } rowKey
 * @example @row-click="(row) => rowClickExpand(row,'defaultExpand','dicVulId')"
 */
export function rowClickExpand (row, defaultExpand, rowKey) {
  if (this[defaultExpand].includes(row[rowKey])) {
    this[defaultExpand] = []
  } else {
    this[defaultExpand] = [row[rowKey]]
  }
}

export function expandChange (row, arr, defaultExpand, rowKey) {
  if (arr.indexOf(row) !== -1) {
    this[defaultExpand] = [row[rowKey]]
  } else {
    this[defaultExpand] = []
  }
}

/**
 * @desc  匹配list中key的值和value相等的一项
 * @param { Array } list 对象数组
 * @param { Any } value  和数组对象的key的值比对的value
 * @param { String } path 和value比对的key
 * @param { String } attr 取值的属性
 * @param { String } defaultContext 取值的默认值
 * @returns { * }
 */
export const matching = (
  list = [],
  value,
  path,
  attr = '',
  defaultContext = ''
) => {
  const temp = list.find(item => get(item, path) === value) || {}
  if (attr) {
    return get(temp, attr, defaultContext)
  } else {
    return temp
  }
}
