const path = require('path')
// const WebpackBar = require('webpackbar') // build 进度条
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin') // 构建速度测量工具
// const smp = new SpeedMeasurePlugin()
// const CompressionPlugin = require('compression-webpack-plugin') // 开启gzip时会用到
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')  // 缓存用于提升构建速度

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = !isDevelopment
const ossProxyTarget = process.env.VUE_APP_OSS_PROXY_TARGET || 'https://47.95.168.108/backend/oss'
const ossSaasProxyTarget = process.env.VUE_APP_OSS_SAAS_PROXY_TARGET || 'https://47.95.168.108/backend/oss-saas'

const provide = {
  to: [path.resolve(__dirname, 'src/utils/await-to.js'), 'to'],
  get: [path.resolve(__dirname, 'src/utils/index.js'), 'get'],
  isFunction: ['lodash-es', 'isFunction'],
  isObject: ['lodash-es', 'isObject'],
  isArray: ['lodash-es', 'isArray'],
  isNumber: ['lodash-es', 'isNumber'],
  isUndefined: ['lodash-es', 'isUndefined'],
  isNull: ['lodash-es', 'isNull']
}

// const productionGzipExtensions = ['js', 'css']

const configureWebpack = isProduction
  ? {
    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          use: ['thread-loader', 'cache-loader', 'babel-loader?cacheDirectory=true'],
          include: [path.resolve(__dirname, 'src')]
        }
      ]
    },
    plugins: [
      // new WebpackBar(),
      // new CompressionPlugin({
      //   test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      //   algorithm: 'gzip',
      //   threshold: 10240,
      //   minRatio: 0.8
      // }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 20, // 必须大于或等于 1
        minChunkSize: 1000
      }),
      new webpack.ProvidePlugin(provide)
      // new HardSourceWebpackPlugin()
    ],
    externals: {},
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true, // 是否启用文件缓存
          parallel: true, // 使用多进程并行运行来提高构建速度
          sourceMap: false,
          terserOptions: {
            warnings: false,
            compress: {
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log']
            }
          }
        })
      ],
      splitChunks: {
        maxInitialRequests: 6, // 默认是5
        cacheGroups: {
          common: {
            name: 'common',
            chunks: 'initial',
            minChunks: 2, // 模块被引用次数
            priority: -20, // 优先级
            reuseExistingChunk: true // 重用已拆分模块
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true
          }
        }
      }
    },
    performance: { hints: false }
  }
  : {
    plugins: [
      // new WebpackBar()
      new webpack.ProvidePlugin(provide)
    ],
    module: {}
  }
// ==================== 联调适配层（调通后删除）====================
// 背景：远程 Tosslib 三包后端（docs/openapi.yaml）与前端旧 OSS 接口（/oss/api-v1/**）不是同一套 API。
// dev-server 前置中间件：精确映射优先（真实数据），其次全局兜底（GET 空分页 / 非 GET 业务失败），
// 均未命中的路径继续走下方 proxy 转发。
const REMOTE_BASE = 'https://47.95.168.108/backend'
const REMOTE_TOKEN = 'xPaXVa0o-k57lKHhgN3DdqIcoPqeYnj2RxklZRu8Rx8'

// 远程调用：跳过 IP 自签证书校验
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

async function remoteGet (path) {
  const res = await fetch(`${REMOTE_BASE}${path}`, {
    headers: { Authorization: `Bearer ${REMOTE_TOKEN}` }
  })
  if (!res.ok) throw new Error(`remote ${path} -> ${res.status}`)
  return res.json()
}

function sendJson (res, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

// 解析请求 query（兼容 webpack-dev-server 的 req.url）
function parseQuery (url) {
  const i = url.indexOf('?')
  return i === -1 ? {} : Object.fromEntries(new URLSearchParams(url.slice(i + 1)))
}

// 项目下拉已映射到 /work/tasks，projectId 即任务 id；-1（"所有项目"）表示无任务上下文
function taskIdOf (query) {
  const id = query.projectId || query.id
  return id && id !== '-1' ? id : null
}

// 旧接口 → 新接口 映射表（按匹配优先级排序，具体路径在前）
const apiAdapters = [
  {
    // 站点界面配置：新后端无此概念（纯前端 UI 配置），返回站点默认值；功能开关全开避免菜单隐藏
    match: url => url.startsWith('/oss/api-v1/system/setting/getViewSetting'),
    handle: async () => ({
      code: 0,
      data: {
        brandLogoUrl: '',
        faviconUrl: '',
        loginLogoUrl: '',
        navMenuIconUrl: '',
        navMenuIconMiniUrl: '',
        copyright: '',
        loginPageTitle: '开源知识库系统',
        loginVerifyType: 1,
        licenseExpire: 0,
        showViewSetting: 0,
        binaryEnable: true,
        imageEnable: true,
        homologyEnable: true,
        sourceCheckEnable: true,
        ossoidcProperties: {}
      }
    })
  },
  {
    // 项目下拉 → 新后端任务列表 TaskSummary{id,title,state,owner,created,updated}
    match: url => url.startsWith('/oss/api-v1/asset/project/select'),
    handle: async () => {
      const tasks = await remoteGet('/work/tasks')
      const records = (Array.isArray(tasks) ? tasks : []).map(t => ({
        id: t.id,
        name: t.title,
        taskState: t.state,
        owner: t.owner,
        createTime: t.created,
        updateTime: t.updated
      }))
      return { code: 0, data: { records, total: records.length } }
    }
  },
  {
    // 负责人列表 → 新后端账号列表 [{name,role}]
    match: url => url.startsWith('/oss/api-v1/asset/project/principal/all'),
    handle: async () => {
      const users = await remoteGet('/work/users')
      const data = (Array.isArray(users) ? users : []).map(u => ({
        userId: u.name,
        username: u.name,
        role: u.role
      }))
      return { code: 0, data }
    }
  },
  {
    // 用户消息列表：新后端无"用户消息"概念（/work/events 是审计日志，语义不同），先返回空列表
    match: url => url.startsWith('/oss/api-v1/system/user/getUserMessageList'),
    handle: async () => ({ code: 0, data: { records: [], total: 0 } })
  },
  {
    // 安全态势汇总：新后端无对应统计接口，返回零值结构（字段名与页面消费保持一致）
    match: url => url.startsWith('/oss/api-v1/system/securityPosture/projectSummary'),
    handle: async () => ({
      code: 0,
      data: {
        appPackageTotal: 0,
        componentNumVO: { total: 0 },
        vulNumVO: { total: 0 },
        licenseNumVO: { totalNum: 0 }
      }
    })
  },
  {
    // 风险项目 Top10：页面消费 response.data.riskProjectList
    match: url => url.startsWith('/oss/api-v1/system/securityPosture/riskProjectBarTop10'),
    handle: async () => ({ code: 0, data: { riskProjectList: [] } })
  },
  {
    // 其余态势图表（趋势线/饼图/Top10）：页面直接对 response.data 数组 forEach，空数组即安全空态
    match: url => url.startsWith('/oss/api-v1/system/securityPosture/'),
    handle: async () => ({ code: 0, data: [] })
  },
  {
    // 社区健康评估-服务就绪状态：新后端无此服务能力，如实返回"服务不可用"
    match: url => url.startsWith('/oss/api-v1/system/communityHealth/readiness'),
    handle: async () => ({
      code: 0,
      data: {
        repositorySourceReady: false,
        publishedModelReady: false,
        executorReady: false,
        degraded: false,
        message: '远程后端暂未提供社区健康评估服务'
      }
    })
  },
  {
    // 社区健康评估-评估列表：返回空分页
    match: url => url.startsWith('/oss/api-v1/system/communityHealth/assessments'),
    handle: async () => ({ code: 0, data: { records: [], total: 0 } })
  },
  {
    // 报告模板-模块选项：页面消费 response.data 数组
    match: url => url.startsWith('/oss/api-v1/data/report/templates/modules'),
    handle: async () => ({ code: 0, data: [] })
  },
  {
    // 报告样式配置：页面消费 data.headerText/title/watermarkText/各图片路径
    match: url => url.startsWith('/oss/api-v1/data/report/templates/style'),
    handle: async () => ({
      code: 0,
      data: { headerText: '', title: '', watermarkText: '' }
    })
  },
  {
    // 报告模板列表：新后端只有任务报告导出（/work/report），无模板管理概念，返回空分页
    match: url => url.startsWith('/oss/api-v1/data/report/templates'),
    handle: async () => ({ code: 0, data: { records: [], total: 0 } })
  },
  {
    // 许可证列表 → 新后端许可证库（2712 条真实数据）
    // 字段映射：shortName/name/spdxId/category 为真实数据；
    // securityLevel/gplCompatible/isOsi/isFsf 新后端无此字段（数据缺口，页面该列显示空）
    match: url => url.startsWith('/oss/api-v1/dic/license/list'),
    handle: async (req) => {
      const q = parseQuery(req.url)
      const pageNum = parseInt(q.pageNum || '1', 10)
      const pageSize = parseInt(q.pageSize || '10', 10)
      const offset = (pageNum - 1) * pageSize
      const keyword = q.shortName ? `&q=${encodeURIComponent(q.shortName)}` : ''
      const data = await remoteGet(`/licenses?offset=${offset}&limit=${pageSize}${keyword}`)
      const records = (data.items || []).map(item => ({
        id: item.id,
        shortName: item.short_name || item.name,
        name: item.name,
        spdxId: item.spdx_id,
        category: item.category,
        sourceUrl: item.source_url
      }))
      return { code: 0, data: { records, total: data.total || 0 } }
    }
  },
  {
    // 许可证导出 Excel → /work/catalog.xlsx（真实文件流转发）
    match: url => url.startsWith('/oss/api-v1/dic/license/exportExcel'),
    stream: true,
    handle: async () => {
      const res = await fetch(`${REMOTE_BASE}/work/catalog.xlsx`, {
        headers: { Authorization: `Bearer ${REMOTE_TOKEN}` }
      })
      if (!res.ok) throw new Error(`remote /work/catalog.xlsx -> ${res.status}`)
      return {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileName: 'license-catalog.xlsx',
        body: Buffer.from(await res.arrayBuffer())
      }
    }
  },
  {
    // 组件列表 → /work/objects?id=<任务id>（项目即任务；无任务上下文时返回空分页）
    match: url => url.startsWith('/oss/api-v1/asset/component/list'),
    handle: async (req) => {
      const q = parseQuery(req.url)
      const taskId = taskIdOf(q)
      if (!taskId) return { code: 0, data: { records: [], total: 0 } }
      try {
        const data = await remoteGet(`/work/objects?id=${encodeURIComponent(taskId)}`)
        const records = (data.objects || []).map(o => ({
          id: (o.coordinates && (o.coordinates.version_key || o.coordinates.component_key)) || o.name,
          vendor: (o.coordinates && o.coordinates.ecosystem) || '',
          name: (o.coordinates && o.coordinates.name) || '',
          version: (o.coordinates && o.coordinates.version) || ''
        }))
        return { code: 0, data: { records, total: data.unique_purls || records.length } }
      } catch (e) {
        // 任务不存在/无数据时按空分页处理，避免页面报错
        return { code: 0, data: { records: [], total: 0 } }
      }
    }
  },
  {
    // 漏洞列表 → /work/vulnerabilities?id=<任务id>（同上，待任务数据验证字段）
    match: url => url.startsWith('/oss/api-v1/data/vul/list'),
    handle: async (req) => {
      const q = parseQuery(req.url)
      const taskId = taskIdOf(q)
      if (!taskId) return { code: 0, data: { records: [], total: 0 } }
      try {
        const data = await remoteGet(`/work/vulnerabilities?id=${encodeURIComponent(taskId)}&offset=0`)
        const list = data.vulnerabilities || data.items || []
        return { code: 0, data: { records: list, total: data.total || list.length } }
      } catch (e) {
        return { code: 0, data: { records: [], total: 0 } }
      }
    }
  },
  // ========== 全局兜底（OSS 接口已被后端废弃）==========
  // 命中说明该请求没有精确映射：GET 返回通用空分页让页面渲染空态；
  // 非 GET 返回业务失败，避免增删改"假成功"。命中日志打印在 dev-server 控制台。
  {
    match: url => url.startsWith('/oss/api-v1/') || url.startsWith('/oss-saas/api-v1/'),
    handle: async (req) => {
      console.log(`[adapter-fallback] ${req.method} ${req.url}`)
      if (req.method === 'GET') {
        return { code: 0, data: { records: [], total: 0, list: [], rows: [] } }
      }
      return { code: -1, message: 'OSS 接口已被后端废弃，该操作待新后端(/api/v1)实现后开放' }
    }
  }
]

function ossApiAdapter (app) {
  app.use(async (req, res, next) => {
    const adapter = apiAdapters.find(a => a.match(req.url))
    if (!adapter) return next()
    try {
      const result = await adapter.handle(req)
      // 文件流类响应（导出下载）
      if (result && result.body) {
        res.setHeader('Content-Type', result.contentType)
        res.setHeader('Content-Disposition', `attachment; filename=${result.fileName}`)
        res.end(result.body)
        return
      }
      sendJson(res, result)
    } catch (e) {
      sendJson(res, { code: 9999, message: `适配层调用远程失败: ${e.message}` })
    }
  })
}
// ==================== 联调适配层 END ====================

module.exports = {
  publicPath: '/', // 基本路径
  outputDir: 'dist', // 输出文件目录
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  productionSourceMap: isDevelopment,
  devServer: {
    before: ossApiAdapter, // 联调适配层：先于 proxy 执行
    open: false,
    // host: '192.168.172.137', // 允许外部ip访问
    // port: 8011, // 端口
    https: false, // 启用https
    overlay: {
      warnings: true,
      errors: true
    }, // 错误、警告在页面弹出
    disableHostCheck: true,
    proxy: {
      '/oss-saas': {
        target: ossSaasProxyTarget,
        secure: false, // 远程为 IP + https，跳过证书校验
        changeOrigin: true,
        pathRewrite: {
          '^/oss-saas': ''
        }
      },
      '/oss': {
        target: ossProxyTarget,
        secure: false, // 远程为 IP + https，跳过证书校验
        changeOrigin: true,
        pathRewrite: {
          '^/oss': ''
        }
      }
    } // 代理转发配置，用于调试环境
  },
  configureWebpack: configureWebpack,
  chainWebpack: config => {
    config.output.globalObject('this')
  },
  parallel: false,
  // 第三方插件配置
  pluginOptions: {},
  css: {
    extract: isProduction ? {
      ignoreOrder: true
    } : false,
    loaderOptions: {
      scss: {
        prependData: '@import "~@/style/config.scss";'
      }
    }
  },
  transpileDependencies: [
    'js-base64',
    'sockjs-client',
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]src/,
    'resize-detector'
  ]
}
