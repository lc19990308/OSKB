import fetch from '@/utils/fetch'

// 二进制成分分析列表
export function binaryAnalysisList (data) {
  return fetch({
    url: '/oss/api-v1/asset/binaryAnalysis/list',
    method: 'get',
    params: data
  })
}
