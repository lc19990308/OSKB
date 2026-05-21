import fetch from '@/utils/fetch'

// 获取报告列表
export function reportList (data) {
  return fetch({
    url: '/oss/api-v1/data/report/list',
    method: 'get',
    params: data
  })
}

// 逻辑删除报告
export function delReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/delete/physic',
    method: 'post',
    data: data
  })
}

// 获取报告分类饼状图
export function reportTypeChart (data) {
  return fetch({
    url: '/oss/api-v1/data/report/typeNumPie',
    method: 'get',
    params: data
  })
}

// 获取今日生成报告数
export function reportTodayNum (data) {
  return fetch({
    url: '/oss/api-v1/data/report/todayNum',
    method: 'get',
    params: data
  })
}

// 生成应用包审查任务word报告：
export function createImageWordReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/image/word/generate',
    method: 'post',
    data: data
  })
}

// 生成镜像审查任务excel报告
export function createImageExcelReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/image/excel/generate',
    method: 'post',
    data: data
  })
}

// 生成应用包省查word报告
export function createWordReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/appPackage/word/generate',
    method: 'post',
    data: data
  })
}

// 生成应用包审查json报告
export function createJsonReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/appPackage/json/generate',
    method: 'post',
    data: data
  })
}

// 生成应用包审查任务excel报告
export function createExcelReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/appPackage/excel/generate',
    method: 'post',
    data: data
  })
}

// 生成应用包审查html报告
export function createHtmlReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/appPackage/html/generate',
    method: 'post',
    data: data
  })
}

// 生成应用包审查pdf报告
export function createPdfReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/appPackage/pdf/generate',
    method: 'post',
    data: data
  })
}

// 下载报告
export function downloadReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/download',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}

// 下载容器sbom报告
export function downloadContainerSBOMReport (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/data/report/container/sbom/download',
    method: 'post',
    responseType: 'blob',
    data: data,
    ...config
  })
}

// 下载应用包威胁审查sbom报告
export function downloadAppSBOMReport (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/data/report/appPackage/sbom/download',
    method: 'post',
    responseType: 'blob',
    data: data,
    ...config
  })
}

// 下载sbom扫描报告
export function downloadSbomPackageSBOMReport (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/data/report/sbomPackage/sbom/download',
    method: 'post',
    responseType: 'blob',
    data: data,
    ...config
  })
}

// 下载二进制成分分析扫描sbom报告
export function downloadBinarySBOMReport (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/data/report/binaryAnalysis/sbom/download',
    method: 'post',
    responseType: 'blob',
    data: data,
    ...config
  })
}

// 下载集成部署sbom报告
export function downloadDevopsSBOMReport (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/data/report/devops/sbom/download',
    method: 'post',
    responseType: 'blob',
    data: data,
    ...config
  })
}

// 下载IDE开发管理sbom报告
export function downloadIdeSBOMReport (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/data/report/ide/sbom/download',
    method: 'post',
    responseType: 'blob',
    data: data,
    ...config
  })
}

// 下载项目维度sbom报告
export function downloadProjectSBOMReport (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/data/report/project/sbom/download',
    method: 'post',
    responseType: 'blob',
    data: data,
    ...config
  })
}

// 下载代码库管理sbom报告
export function downloadScmSBOMReport (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/data/report/scm/sbom/download',
    method: 'post',
    responseType: 'blob',
    data: data,
    ...config
  })
}

// 导出html报告
export function downloadHTMLReport (taskId, config = {}) {
  return fetch({
    url: `/oss/api-v1/data/report/devops/html/download/${taskId}`,
    method: 'post',
    responseType: 'blob',
    data: {},
    ...config
  })
}

// 下载镜像安全扫描sbom报告
export function downloadImageSBOMReport (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/data/report/image/sbom/download',
    method: 'post',
    responseType: 'blob',
    data: data,
    ...config
  })
}

// 生成应用包审查报告
export function createAppPackageReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/appPackage',
    method: 'post',
    data
  })
}

// 生成二进制成分分析报告
export function createBinaryReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/binary',
    method: 'post',
    data
  })
}

// 生成Firefly报告
export function createFireflyReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/firefly',
    method: 'post',
    data
  })
}

// 生成git报告
export function createGitReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/git',
    method: 'post',
    data
  })
}

// 生成測試運行報告报告
export function createIastReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/iast',
    method: 'post',
    data
  })
}

// 生成IDE开发管理报告
export function createIdeReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/ide',
    method: 'post',
    data
  })
}

// 生成镜像安全扫描报告
export function createImageReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/image',
    method: 'post',
    data
  })
}

// 生成集成部署报告
export function createIntegrationReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/integration',
    method: 'post',
    data
  })
}

// 生成私服库安全扫描报告
export function createRepositoryReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/repository',
    method: 'post',
    data
  })
}

// 生成SBOM风险扫描报告
export function createSbomReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/sbom',
    method: 'post',
    data
  })
}

// 生成svn报告
export function createSvnReport (data) {
  return fetch({
    url: '/oss/api-v2/data/report/svn',
    method: 'post',
    data
  })
}
