import { has, isArray } from 'lodash-es'

// 给树结构生成唯一key
export function createKeysTree (treeNode, parentKey) {
  for (let i = 0, len = treeNode.length; i < len; i++) {
    treeNode[i].id = parentKey ? `${parentKey}-${i + 1}` : `${i + 1}`
    if (has(treeNode[i], 'children') && isArray(treeNode[i].children)) {
      treeNode[i].children = createKeysTree(treeNode[i].children, treeNode[i].id)
    }
  }
  return treeNode
}
