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
module.exports = {
  publicPath: '/', // 基本路径
  outputDir: 'dist', // 输出文件目录
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  productionSourceMap: isDevelopment,
  devServer: {
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
        // logLevel: 'debug',
        // target: 'https://10.1.2.79:8011/oss-saas', // 成都
        target: 'https://192.168.172.199:8011/oss-saas', // 北京
        // target: 'http://tymdn6.natappfree.cc/oss-saas', // 长沙颜程
        // target: 'https://172.25.0.29:47011/oss-saas', // 长沙
        // target: 'http://x5sqti.natappfree.cc/oss-saas', // 长沙
        // target: 'http://x5sqti.natappfree.cc/oss-saas', // 长沙
        // target: 'https://v58r246643.oicp.vip/oss', // 军
        pathRewrite: {
          '^/oss-saas': ''
        }
      },
      '/oss': {
        target: 'http://localhost:8080/oss',
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
