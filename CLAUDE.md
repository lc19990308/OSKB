# frontend - Claude Code AI 上下文文件

## 1. 项目概览
- **愿景：** 为 SBOM (Software Bill of Materials) 系统提供直观高效的前端管理界面，支持组件依赖分析、漏洞追踪和许可证合规管理
- **当前阶段：** 初始开发阶段
- **核心架构：** Vue 2 SPA 单页应用，基于 Element UI 组件库，采用 Vuex 状态管理和 Vue Router 前端路由
- **开发策略：** 组件化开发，关注用户体验和数据可视化

## 2. 项目结构

**⚠️ 重要：AI 智能体在执行任何任务前，必须先阅读[项目结构文档](/docs/ai-context/project-structure.md)，了解完整的技术栈、文件树和项目组织方式。**

frontend 采用 Vue SPA + 组件化架构。完整的技术栈和文件树结构，请参见 [docs/ai-context/project-structure.md](/docs/ai-context/project-structure.md)。

## 3. 编码规范与 AI 指令

### 通用指令
- 你最重要的工作是管理自己的上下文。在规划变更前，务必先阅读相关文件。
- 更新文档时，保持更新简洁明了，防止内容冗余。
- 编写代码遵循 KISS、YAGNI 和 DRY 原则。
- 有疑问时遵循经过验证的最佳实践。
- 未经用户批准不要提交到 git。
- 不要运行任何服务器，而是告诉用户运行服务器进行测试。
- 优先考虑行业标准库/框架，而不是自定义实现。
- 永远不要模拟任何东西。永远不要使用占位符。永远不要省略代码。
- 相关时应用 SOLID 原则。使用现代框架特性而不是重新发明解决方案。
- 对想法的好坏要坦率诚实。
- 让副作用明确且最小化。
- 设计数据库模式要便于演进（避免破坏性变更）。

### 文件组织与模块化
- 默认创建多个小而专注的文件，而不是大而单一的文件
- 每个文件应该有单一职责和明确目的
- 尽可能保持文件在 350 行以内 - 通过提取工具、常量、类型或逻辑组件到单独模块来拆分大文件
- 分离关注点：工具、常量、类型、组件和业务逻辑到不同文件
- 优先组合而非继承 - 只在真正的 'is-a' 关系中使用继承，在 'has-a' 或行为混合时优先组合
- 遵循现有项目结构和约定 - 将文件放在适当目录。必要时创建新目录并移动文件。
- 使用定义明确的子目录保持组织和可扩展性
- 用清晰的文件夹层次和一致的命名约定构建项目
- 正确导入/导出 - 为可重用性和可维护性而设计

### Vue 特定规范
- 使用 Vue 2 选项式 API（data/computed/methods/watch）
- 组件命名使用 PascalCase，文件名也使用 PascalCase
- 模板中使用 kebab-case 引用组件
- 组件样式使用 scoped SCSS
- 状态管理使用 Vuex（modules 模式），避免组件间直接状态耦合
- 路由使用 Vue Router 3.x 的懒加载模式
- API 调用统一通过 `src/api/` 目录下的模块管理，使用 axios 实例
- 全局注册的组件放在 `src/components/public/` 目录

### 类型提示（适用时）
- 使用 JSDoc 注释为函数参数和返回值提供类型提示
- 对复杂数据结构使用 JSDoc `@typedef` 定义类型

### 命名约定
- **组件**：PascalCase（例如 `SbomTable.vue`）
- **函数/方法**：camelCase（例如 `fetchTableData`）
- **常量**：UPPER_SNAKE_CASE（例如 `MAX_PAGE_SIZE`）
- **文件**：kebab-case 用于非组件文件，PascalCase 用于组件文件
- **Vuex 模块**：camelCase（例如 `userModule`）

### 安全优先
- 永远不要信任外部输入 - 在边界处验证一切
- 将秘钥保存在环境变量中，永远不要在代码中
- 使用 axios 拦截器统一处理认证 token
- 所有 API 请求通过代理转发，避免跨域问题
- 前端做好 XSS 防护（使用 xss 库过滤用户输入）
- 敏感信息不在前端存储

### 错误处理
- API 请求使用 try/catch 统一处理错误
- 使用 Element UI 的 Message/Notification 组件展示用户友好的错误信息
- 统一的错误处理拦截器在 `src/utils/fetch.js` 中

### 状态管理
- 每个状态片段有一个真相来源（Vuex store）
- 让状态变更明确且可追踪
- 使用 vuex-along 持久化部分 store 数据到 localStorage

## 4. 多智能体工作流与上下文注入

### 子智能体的自动上下文注入
当使用 Task 工具生成子智能体时，核心项目上下文（CLAUDE.md、project-structure.md、docs-overview.md）会通过 subagent-context-injector hook 自动注入到它们的提示中。这确保所有子智能体都能立即访问基本项目文档，无需在每个 Task 提示中手动指定。

## 5. 任务完成后协议

完成任何编码任务后，遵循此检查清单：

### 1. 类型安全与质量检查
根据修改内容运行适当命令：
- **Vue 项目**：运行 `npm run lint` 检查代码质量
- **SCSS 文件**：运行 `npm run stylelint:fix` 检查样式

### 2. 验证
- 确保所有 lint 检查通过后再认为任务完成
- 如果发现错误，在标记任务完成前修复它们

## 6. 全局规则引用

本项目遵循用户级全局规则，详见 `~/.claude/CLAUDE.md`。
