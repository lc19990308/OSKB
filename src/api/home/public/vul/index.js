import fetch from '@/utils/fetch'
import { componentManagementDetailByPdceiid } from '@/api/home/public/component'

// 漏洞详情
export function vulDetail (data) {
  return fetch({
    url: `/oss/api-v1/dic/vul/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 组件漏洞列表
export function componentVulList (data) {
  return fetch({
    url: '/oss/api-v1/dic/vul/list',
    method: 'get',
    params: data
  })
}

// 组件漏洞列表
export function componentVulListByPdceiid (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/management/vulnerability/list',
    method: 'get',
    params: data
  })
}




// 导出漏洞
export function exportVul (data) {
  return fetch({
    url: '/oss/api-v1/dic/vul/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
