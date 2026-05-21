// 来源
export const sourceOptions = [
  {
    value: 1,
    text: '应用包威胁审查',
    route: '/scan/app/component',
    moduleCode: null, // 1?
    powerId: 900
  },
  {
    value: 2,
    text: '代码库管理-Git',
    route: '/scan/develop/repository/list/git',
    moduleCode: 3,
    powerId: 2301
  },
  {
    value: 3,
    text: '代码库管理-SVN',
    route: '/scan/develop/repository/list/svn',
    moduleCode: 6,
    powerId: 2301
  },
  {
    value: 4,
    text: 'IDE开发管理',
    route: '/scan/develop/ide',
    moduleCode: 5,
    powerId: 2315
  },
  {
    value: 5,
    text: '集成部署',
    route: '/scan/integration',
    moduleCode: 11,
    powerId: 2309
  },
  {
    value: 6,
    text: '二进制成分分析',
    route: '/scan/binary',
    moduleCode: 8,
    powerId: 2800
  },

  {
    value: 8,
    text: '测试运行监控',
    route: '/scan/node',
    moduleCode: 2,
    powerId: 1000
  },
  {
    value: 9,
    text: '私服库安全扫描',
    route: '/scan/private',
    moduleCode: 4,
    powerId: 2400
  },
  {
    value: 10,
    text: '代码库管理-firefly',
    route: '/scan/develop/repository/list/firefly',
    moduleCode: 12,
    powerId: 2301
  },
  {
    value: 11,
    text: 'SBOM风险扫描',
    route: '/scan/sbom',
    moduleCode: 14,
    powerId: 3570
  },
  {
    value: 12,
    text: '镜像安全扫描',
    route: '/scan/container/mirror',
    moduleCode: 15,
    powerId: 3609
  }
]

// 风险等级
export const levelOptions = [
  {
    value: 1,
    text: '严重'
  },
  {
    value: 2,
    text: '高危'
  },
  {
    value: 3,
    text: '中危'
  },
  {
    value: 4,
    text: '低危'
  },
  {
    value: 5,
    text: '无漏洞'
  }
]

// 许可证风险等级
export const licenseLevelOptions = [
  {
    value: 1,
    label: '高风险'
  },
  {
    value: 2,
    label: '中风险'
  },
  {
    value: 3,
    label: '低风险'
  }
]

// 审计状态
export const auditStatusOptions = [
  {
    value: 1,
    label: '忽略'
  },
  {
    value: 2,
    label: '误报'
  },
  {
    value: 3,
    label: '挂起'
  },
  {
    value: 4,
    label: '已修复'
  },
  {
    value: 5,
    label: '已确认'
  },
  {
    value: 6,
    label: '未审计'
  }
]

// 组件标记状态
export const markComponentStatusOptions = [
  {
    value: 1,
    label: '未标记'
  },
  {
    value: 3,
    label: '黑名单'
  },
  {
    value: 4,
    label: '白名单'
  }
]

// 组件 1未标记 3黑名单 4白名单
// 漏洞许可证 0未标记 1 黑名单；2白名单

// 许可证、漏洞标记状态
export const markStatusOptions = [
  {
    value: 0,
    label: '未标记'
  },
  {
    value: 1,
    label: '黑名单'
  },
  {
    value: 2,
    label: '白名单'
  }
]

// eslint-disable-next-line no-tabs
// exploitLevelId	漏洞利用难度 0 困难 1 简单
export const utilizeDifficultyOptions = [
  {
    value: 0,
    label: '困难'
  },
  {
    value: 1,
    label: '容易'
  }
]
