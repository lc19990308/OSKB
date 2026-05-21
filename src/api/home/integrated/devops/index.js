import fetch from '@/utils/fetch'

// 导出流水线脚本
export function downloadScript (name, data) {
  return fetch({
    url: `/oss/api-v1/open/devops/download/script/${name}`,
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 下载DevOps检测插件
export function downloadDetectPlugin (name, data) {
  return fetch({
    url: `/oss/api-v1/open/devops/download/detectPlugin/${name}`,
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 下载DevOps生成报告插件
export function downloadReportPlugin (name, data) {
  return fetch({
    url: `/oss/api-v1/open/devops/download/reportPlugin/${name}`,
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 下载DevOps使用文档
export function downloadUsingDocument (name, data) {
  return fetch({
    url: `/oss/api-v1/open/devops/download/usingDocument/${name}`,
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 下载gitlab_ci_pipeline
export function downloadGitlabCiPipeline (name, data) {
  return fetch({
    url: '/oss/api-v1/open/devops/download/script/gitlab_ci_pipeline',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

export function downloadCLI (name, data) {
  return fetch({
    url: '/oss/api-v1/open/devops/download/detectPlugin/sca_cli',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 下载jenkins_shell
export function downloadJenkinsShell (name, data) {
  return fetch({
    url: '/oss/api-v1/open/devops/download/script/jenkins_shell',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 下载jenkins_pipeline
export function downloadJenkinsPipeline (name, data) {
  return fetch({
    url: '/oss/api-v1/open/devops/download/script/jenkins_pipeline',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
