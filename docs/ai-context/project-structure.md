# 项目结构

本文档提供了 frontend (OSS SBOM 前端) 的完整技术栈、文件树和项目组织方式。**AI 智能体必须先阅读此文件以了解项目组织，然后再进行任何更改。**

## 技术栈

### 前端框架
- **JavaScript (ES6+) 与 npm** - 开发语言和包管理
- **Vue 2.7+** - 前端 SPA 框架（选项式 API）
- **Vue CLI 4.5+** - 项目脚手架和构建工具（基于 Webpack 4）
- **Element UI 2.15+** - UI 组件库

### 状态管理与路由
- **Vuex 3.4+** - 集中式状态管理
- **vuex-along** - Vuex 状态持久化到 localStorage
- **Vue Router 3.2+** - 前端路由

### HTTP 与实时通信
- **Axios 0.27+** - HTTP 客户端
- **STOMP.js + SockJS** - WebSocket 实时通信

### 数据可视化
- **ECharts 5** - 图表库
- **echarts-liquidfill** - 水球图插件
- **AntV G6 4.8+** - 图可视化引擎（组件依赖关系图）
- **html2canvas** - HTML 截图导出
- **xlsx** - Excel 文件处理

### 工具库
- **lodash-es** - 工具函数库
- **js-cookie** - Cookie 管理
- **js-base64 / spark-md5 / js-md5** - 编码和哈希
- **qs** - URL 查询字符串解析
- **xss** - XSS 过滤
- **nprogress** - 顶部进度条
- **vue-codemirror** - 代码编辑器
- **vue-virtual-scroll-list** - 虚拟滚动列表

### 代码质量
- **ESLint** - JavaScript 代码检查
- **Stylelint** - 样式代码检查
- **Commitlint** - 提交信息规范
- **Husky** - Git hooks 管理
- **lint-staged** - 暂存文件检查

### 样式
- **SCSS (Sass)** - CSS 预处理器
- **PostCSS** - CSS 后处理器

### 优化与构建
- **TerserWebpackPlugin** - JS 压缩（生产环境移除 console）
- **cache-loader / thread-loader** - 构建缓存和并行编译
- **SplitChunks** - 代码分割优化

## 项目结构

```
frontend/
├── CLAUDE.md                           # 主 AI 上下文文件
├── MCP-ASSISTANT-RULES.md              # MCP 助手规则
├── README.md                           # 项目概览和设置
├── package.json                        # 依赖和脚本配置
├── vue.config.js                       # Vue CLI 配置（Webpack、代理等）
├── babel.config.js                     # Babel 配置
├── commitlint.config.js                # 提交信息规范
├── stylelint.config.js                 # 样式检查配置
├── .eslintignore                       # ESLint 忽略文件
├── .stylelintignore                    # Stylelint 忽略文件
├── .editorconfig                       # 编辑器配置
├── .nvmrc                              # Node.js 版本锁定
├── .gitignore                          # Git 忽略模式
├── .husky/                             # Git hooks
│   ├── pre-commit                      # 提交前检查
│   └── commit-msg                      # 提交信息检查
├── .claude/                            # Claude Code 配置
│   ├── .gitignore                      # .claude 目录忽略规则
│   ├── CONTRIBUTING.md                 # 贡献指南
│   ├── rules/                          # 项目级规则（空）
│   ├── commands/                       # 项目级命令（空）
│   └── hooks/                          # 项目级 hooks（空）
├── docs/                               # 文档
│   ├── README.md                       # 文档系统指南
│   ├── ai-context/                     # AI 上下文文档
│   │   ├── project-structure.md        # 此文件
│   │   ├── docs-overview.md            # 文档架构
│   │   ├── system-integration.md       # 集成模式
│   │   ├── deployment-infrastructure.md # 基础设施
│   │   └── handoff.md                  # 任务交接
│   ├── CONTEXT-tier2-component.md      # 第2层组件模板
│   └── CONTEXT-tier3-feature.md       # 第3层功能模板
├── public/                             # 静态资源
│   ├── index.html                      # HTML 入口
│   ├── img/icons/                      # 图标资源
│   └── package-lock.json
├── src/                                # 源代码
│   ├── main.js                         # 应用入口
│   ├── App.vue                         # 根组件
│   ├── api/                            # API 接口模块
│   │   ├── login/                      # 登录相关接口
│   │   ├── home/                       # 首页相关接口
│   │   ├── public/                     # 公开接口
│   │   └── open/                       # 开放平台接口
│   ├── assets/                         # 静态资源
│   │   ├── config.json                 # 应用配置
│   │   ├── fonts/                      # 字体文件
│   │   ├── images/                     # 图片资源
│   │   └── theme/                      # 主题配置
│   ├── components/                     # 公共组件
│   │   ├── index.js                    # 组件注册入口
│   │   ├── public/                     # 全局注册组件
│   │   │   └── Layout/                 # 布局组件
│   │   ├── chart/                      # 图表组件
│   │   └── dialog/                     # 对话框组件
│   ├── directive/                      # 自定义指令
│   │   ├── directives.js               # 指令注册
│   │   └── clamp.js                    # 文字截断指令
│   ├── hooks/                          # 组合式函数
│   │   ├── useApp.js                   # 应用状态 hook
│   │   └── useTable.js                 # 表格操作 hook
│   ├── mixins/                         # 混入
│   │   ├── index.js                    # 混入注册入口
│   │   ├── chartMixins.js              # 图表混入
│   │   └── list.js                     # 列表混入
│   ├── router/                         # 路由配置
│   │   ├── router.js                   # 路由实例创建
│   │   ├── routerGuard.js              # 路由守卫
│   │   ├── home/                       # 主页路由
│   │   └── open/                       # 开放平台路由
│   ├── store/                          # Vuex 状态管理
│   │   ├── store.js                    # Store 创建
│   │   ├── constant.js                 # 状态常量
│   │   └── modules/                    # Store 模块
│   ├── style/                          # 全局样式
│   │   ├── app.scss                    # 应用主样式
│   │   ├── config.scss                 # 样式变量配置
│   │   ├── element.scss                # Element UI 主题覆盖
│   │   └── transition.scss             # 过渡动画
│   ├── utils/                          # 工具函数
│   │   ├── index.js                    # 核心工具函数（全局注入）
│   │   ├── await-to.js                 # async/await 错误处理
│   │   ├── base.js                     # 基础工具函数
│   │   ├── bus.js                      # 事件总线
│   │   ├── conf.js                     # 配置管理
│   │   ├── copyText.js                 # 文本复制
│   │   ├── downloadFile.js             # 文件下载
│   │   ├── fetch.js                    # Axios 实例和拦截器
│   │   ├── filters.js                  # 过滤器
│   │   ├── openWindow.js               # 窗口打开工具
│   │   ├── permission.js               # 权限管理
│   │   ├── storage.js                  # 存储工具
│   │   ├── table.js                    # 表格工具
│   │   ├── tree.js                     # 树形数据处理
│   │   └── validate.js                 # 表单验证
│   └── views/                          # 页面视图
│       ├── home/                       # 主页
│       ├── login/                      # 登录页
│       └── open/                       # 开放平台页面
└── dist/                               # 构建输出
```

---

*此文档为项目结构提供了全面概述，是 AI 智能体了解项目的首要入口点。*
