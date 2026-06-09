# MCP 助手规则 - frontend (OSS SBOM 前端)

## 项目上下文
SBOM (Software Bill of Materials) 系统的前端管理界面。提供组件依赖分析、漏洞追踪、许可证合规管理和数据可视化功能。基于 Vue 2 SPA 架构，使用 Element UI 组件库。

### 核心愿景与架构
- **产品目标**：为 SBOM 管理提供直观、高效的前端界面
- **目标平台**：Web 浏览器（桌面端优先）
- **架构**：Vue SPA + Element UI + Vuex 状态管理 + Vue Router 前端路由
- **关键技术**：Vue 2.7、Element UI、ECharts 5、AntV G6、Axios、Webpack 4

### 关键技术原则
- **组件化开发** - 高内聚低耦合，复用 UI 组件
- **API 统一管理** - 所有请求通过 `src/api/` 模块集中管理
- **状态集中管理** - Vuex 统一管理全局状态，避免状态分散
- **安全优先** - 前端做好 XSS 防护，敏感信息不落地

**注意：** 完整的项目结构和技术栈在附加的 `project-structure.md` 文件中提供。

## 关键项目标准

### 核心原则
- 遵循 KISS、YAGNI 和 DRY - 优先选择经过验证的解决方案而不是自定义实现
- 永远不要模拟、使用占位符或省略代码 - 始终完全实现
- 对想法的好坏要坦率诚实
- API 调用采用 async/await 模式

### 代码组织
- 保持文件在 350 行以内 - 通过提取工具、常量、mixins 来拆分
- 每个文件单一职责，目的明确
- 优先组合而非继承
- 组件文件使用 PascalCase.vue，工具函数使用 kebab-case.js

### Vue 标准
- 使用 Vue 2 选项式 API
- 组件命名使用 PascalCase，模板中使用 kebab-case
- scoped SCSS 样式隔离
- 全局组件在 `src/components/public/` 注册

### 错误处理与日志记录
- API 统一错误拦截处理（axios 响应拦截器）
- 用户友好错误提示（Element UI Message/Notification）
- 开发环境保留 console.log 调试信息

### API 设计
- 所有 API 通过 `src/utils/fetch.js` 创建的 axios 实例调用
- 统一前缀 `/oss-saas` 或 `/oss` 由代理转发
- 响应格式统一处理

### 安全与状态
- token 通过 axios 拦截器自动附加到请求头
- 敏感数据不存储在前端
- 使用 vuex-along 持久化必要状态到 localStorage

## 项目特定指南

### 领域特定规则
- SBOM 数据展示大量使用表格（Element UI el-table）和图表（ECharts）
- 图谱可视化使用 AntV G6 展示组件依赖关系
- 涉及大量数据的列表需考虑虚拟滚动（vue-virtual-scroll-list）

### 集成点
- 后端 API 通过代理转发，开发环境配置在 vue.config.js
- WebSocket 使用 STOMP + SockJS 实现实时通信
- 文件导出使用 xlsx 库处理 Excel

### 性能考虑
- 路由懒加载，按需加载组件
- 大数据量表格使用虚拟滚动
- 图表按需渲染，避免不必要的重绘

## 重要约束
- 你不能创建、修改或执行代码
- 你在只读支持能力中运作
- 你的建议是给主要 AI（Claude Code）实现的
- 专注于分析、理解和咨询支持

## 快速参考
- **启动项目**：`npm run serve`
- **构建项目**：`npm run build`
- **代码检查**：`npm run lint`
- **样式检查**：`npm run stylelint:fix`
- **关键路径**：`src/views/`（页面）、`src/components/`（组件）、`src/api/`（接口）、`src/store/`（状态）
