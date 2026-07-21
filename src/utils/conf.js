/**
 * 全局变量
 * AUTH_EVENTS        请求的状态码代表的意思
 * MENUS              菜单
 * NO_LOADING_URL     不需要loading动画的url
 * USE_POWER          是否使用权限控制  false不使用（全权限）
 * **/
import openPages from '@/router/open'

export const AUTH_EVENTS = {
  success: 0, // 成功
  notPermit: 403, // 没权限
  notFound: 410001, // 获取不到资源
  loginTimeout: 401 // 登录超时
}

export const PAGE_CONF = {
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [5, 10, 20, 50, 100],
  pageSize: 10,
  pageCount: 5,
  prevText: '上一页',
  nextText: '下一页'
}

export const VERSION = '3.10.4.GA'

// 路由白名单，不需要走登录的页面
export const WHITE_LIST_ROUTERS = [
  ...openPages.map(route => route.path),
  '/transfer',
  '/sso'
]

// 不展示页头的选择项目select的页面名单
export const hideProjectList = [
  '/project/conf/list',
  '/project/conf/details',
  '/project/conf/details/overview',
  '/project/conf/details/app',
  '/overview',
  '/integrated/devops/page',
  '/black-white/baseline/list',
  '/black-white/baseline/add/batch',
  '/black-white/baseline/add/quick',
  '/black-white/loophole',
  '/black-white/loophole/main',
  '/black-white/loophole/main/black/list',
  '/black-white/loophole/main/white/list',
  '/black-white/loophole/black/add/batch',
  '/black-white/loophole/black/add/quick',
  '/black-white/loophole/white/add/batch',
  '/black-white/loophole/white/add/quick',
  '/assets/module/list',
  '/assets/module/details',
  '/assets/vul/list',
  '/assets/vul/details/component',
  '/assets/vul/details/app',
  '/assets/vul/details/project',
  '/report/list',
  '/template-report',
  '/black-white/license/main/black/list',
  '/black-white/license/black/add/quick',
  '/black-white/license/main/white/list',
  '/black-white/license/white/add/quick',
  '/block-management',
  '/block-management/main',
  '/block-management/main/private',
  '/block-management/main/private/main',
  '/block-management/main/private/main/list',
  '/block-management/main/private/main/rule',
  '/block-management/main/private/main/conf',
  '/search',
  '/search/main',
  '/search/details',
  '/search/license/details',
  '/block-management/main/private/main/conf',
  '/log',
  '/report-config',
  '/report-config/template',
  '/report-config/style',
  '/settings/warnConf',
  '/system',
  '/system/backstage',
  '/system/backstage',
  '/system/safety',
  '/system/warnConf',
  '/system/backups',
  '/system/webConf',
  '/system/rule',
  '/system/docking',
  '/account',
  '/user',
  '/update'
]

export const MENUS = [
  {
    heading: true,
    text: '项目配置与管理',
    submenu: [
      {
        icon: 'iconzichan',
        text: '安全态势分析',
        href: '/overview',
        powerId: 2600
      },
      {
        icon: 'iconxiangmuguanli1',
        text: '项目管理',
        href: '/project',
        powerId: 100,
        ops: [
          {
            text: '查看项目',
            powerId: 102
          },
          {
            text: '新建项目',
            powerId: 101
          },
          {
            text: '编辑项目',
            powerId: 104
          },
          {
            text: '删除项目',
            powerId: 105
          },
          {
            text: '查看删除记录',
            powerId: 106
          },
          {
            text: '恢复项目',
            powerId: 107
          },
          {
            text: '彻底删除项目',
            powerId: 108
          },
          {
            text: '生成报告',
            powerId: 109
          },
          {
            text: '消息通知',
            powerId: 110
          }
        ]
      }
    ]
  },
  {
    text: '供应链场景管理',
    heading: true,
    submenu: [
      {
        icon: 'iconapp',
        text: '应用包威胁审查',
        href: '/scan/app',
        submenu: [
          {
            text: '组件依赖检测',
            href: '/scan/app/component',
            powerId: 900,
            ops: [
              {
                text: '查看审查列表',
                powerId: 901
              },
              {
                text: '添加应用',
                powerId: 503
              },
              {
                text: '审查',
                powerId: 903
              },
              {
                text: '删除',
                powerId: 904
              },
              {
                text: '生成报告',
                powerId: 905
              }
            ]
          }
        ]
      },
      {
        icon: 'iconSBOM1',
        text: 'SBOM风险扫描',
        href: '/scan/sbom',
        powerId: 3570,
        ops: [
          {
            text: '添加',
            powerId: 3571
          },
          {
            text: '删除',
            powerId: 3572
          },
          {
            text: '修改',
            powerId: 3573
          },
          {
            text: '查询',
            powerId: 3574
          }
        ]
      },
      {
        icon: 'iconmoshi',
        text: '二进制成分分析',
        href: '/scan/binary',
        powerId: 2800,
        ops: [
          {
            text: '查看分析列表',
            powerId: 2801
          },
          {
            text: '发起分析',
            powerId: 2802
          },
          {
            text: '删除',
            powerId: 2803
          },
          {
            text: '生成报告',
            powerId: 2804
          }
        ]
      },
      {
        icon: 'icondepend',
        text: '编码实现分析',
        href: '/scan/develop',
        powerId: 2300,
        submenu: [
          {
            text: '代码库管理',
            href: '/scan/develop/repository',
            powerId: 2301,
            ops: [
              {
                text: '查看代码库',
                powerId: 2302
              },
              {
                text: '添加仓库',
                powerId: 2303
              },
              {
                text: '删除代码库',
                powerId: 2304
              },
              {
                text: '更新代码库',
                powerId: 2305
              },
              {
                text: '导出代码库数据',
                powerId: 2306
              },
              {
                text: '审查代码库',
                powerId: 2307
              }
              // {
              //   text: '标记代码库组件',
              //   powerId: 2308
              // }
            ]
          },
          {
            text: '社区健康评估',
            href: '/community-health',
            alwaysShow: true
          }
        ]
      },
      {
        icon: 'iconjiedian',
        text: '测试运行监控',
        href: '/scan/node',
        powerId: 1000,
        ops: [
          {
            text: '查看节点',
            powerId: 1001
          },
          {
            text: '导出节点',
            powerId: 1002
          },
          {
            text: '添加节点',
            powerId: 1003
          },
          {
            text: '删除节点',
            powerId: 1004
          },
          {
            text: '启用/禁用节点',
            powerId: 1005
          }
          // {
          //   text: '标记组件',
          //   powerId: 1007
          // }
        ]
      }
    ]
  },
  {
    heading: true,
    text: '资产分析与管理',
    submenu: [
      {
        icon: 'iconsystemcomponent',
        text: '组件风险管理',
        href: '/assets/module',
        powerId: 400,
        ops: [
          {
            text: '查看组件',
            powerId: 401
          },
          {
            text: '导出组件',
            powerId: 402
          },
          // {
          //   text: '删除组件',
          //   powerId: 403
          // },
          {
            text: '标记组件',
            powerId: 404
          }
        ]
      },
      {
        icon: 'iconvulmanage',
        text: '漏洞风险管理',
        href: '/assets/vul',
        powerId: 1100,
        ops: [
          {
            text: '查看漏洞',
            powerId: 1101
          },
          {
            text: '导出漏洞',
            powerId: 1102
          },
          {
            text: '分享至Jira',
            powerId: 1104
          }
        ]
      },
      {
        icon: 'iconlicense',
        text: '许可证风险管理',
        href: '/assets/license',
        powerId: 700,
        ops: [
          {
            text: '查看许可证',
            powerId: 701
          },
          {
            text: '导出许可证',
            powerId: 702
          }
        ]
      }
    ]
  },
  {
    text: '报告管理',
    heading: true,
    submenu: [
      {
        icon: 'iconreport',
        text: '报告管理',
        href: '/report/list',
        powerId: 1200,
        ops: [
          {
            text: '查看报告',
            powerId: 1201
          },
          {
            text: '删除报告',
            powerId: 1202
          },
          {
            text: '下载报告',
            powerId: 1204
          }
        ]
      },
      {
        icon: 'icona-Group427320371',
        text: '报告配置',
        href: '/report-config',
        hideSubmenu: true,
        submenu: [{
          icon: 'iconreport',
          text: '报告模板',
          href: '/report-config/template',
          powerId: 3700,
          ops: [
            {
              text: '新增报告',
              powerId: 3701
            },
            {
              text: '删除报告',
              powerId: 3702
            },
            {
              text: '修改报告',
              powerId: 3703
            },
            {
              text: '查看报告',
              powerId: 3704
            }
          ]
        }, {
          icon: 'iconreport',
          text: '报告样式',
          href: '/report-config/style',
          powerId: 3731
        }]
      }
    ]
  },
  {
    text: '规则配置与管理',
    heading: true,
    submenu: [
      {
        icon: 'iconzuduanguanli',
        text: '阻断管理',
        href: '/block-management/main',
        powerId: 3500,
        ops: [
          {
            text: '私有仓库阻断',
            powerId: 3510,
            ops: [
              {
                text: '阻断记录',
                powerId: 3530,
                ops: [
                  {
                    text: '修改阻断记录',
                    powerId: 3531
                  },
                  {
                    text: '查看阻断记录',
                    powerId: 3532
                  },
                  {
                    text: '导出阻断记录',
                    powerId: 3533
                  }
                ]
              },
              {
                text: '阻断规则',
                powerId: 3540,
                ops: [
                  {
                    text: '查看阻断规则',
                    powerId: 3541
                  },
                  {
                    text: '修改阻断规则',
                    powerId: 3542
                  }
                ]
              },
              {
                text: '仓库配置',
                powerId: 3550,
                ops: [
                  {
                    text: '添加仓库配置',
                    powerId: 3551
                  },
                  {
                    text: '删除仓库配置',
                    powerId: 3552
                  },
                  {
                    text: '修改仓库配置',
                    powerId: 3553
                  },
                  {
                    text: '查看仓库配置',
                    powerId: 3554
                  }
                ]
              },
              {
                text: '查看代理节点',
                powerId: 3521
              }
            ]
          }
        ]
      },
      {
        icon: 'iconcomponent',
        text: '组件版本基线',
        href: '/black-white/baseline',
        powerId: 3100,
        ops: [
          {
            text: '添加组件版本基线',
            powerId: 3101
          },
          {
            text: '上传组件版本基线',
            powerId: 3102
          },
          {
            text: '删除上传组件版本基线记录',
            powerId: 3103
          },
          {
            text: '删除组件版本基线',
            powerId: 3104
          },
          {
            text: '修改组件版本基线',
            powerId: 3105
          },
          {
            text: '查询组件版本基线',
            powerId: 3106
          },
          {
            text: '导出组件版本基线',
            powerId: 3107
          }
        ]
      },
      {
        icon: 'iconblack',
        text: '组件黑白名单',
        href: '/black-white/black-white',
        powerId: 3000,
        ops: [
          {
            text: '查看详情',
            powerId: 3001
          },
          {
            text: '导出黑白名单',
            powerId: 3002
          },
          {
            text: '标记组件',
            powerId: 3003
          },
          {
            text: '删除黑白名单',
            powerId: 3004
          }
        ]
      },
      {
        icon: 'iconloudongku',
        text: '漏洞黑白名单',
        href: '/black-white/loophole',
        powerId: 3200,
        ops: [
          {
            text: '添加漏洞黑白名单',
            powerId: 3201
          },
          {
            text: '上传漏洞黑白名单',
            powerId: 3202
          },
          {
            text: '删除上传漏洞黑名单记录',
            powerId: 3203
          },
          {
            text: '删除漏洞黑白名单',
            powerId: 3204
          },
          {
            text: '修改漏洞黑白名单',
            powerId: 3205
          },
          {
            text: '查询漏洞黑白名单',
            powerId: 3206
          },
          {
            text: '导出漏洞黑白名单',
            powerId: 3207
          }
        ]
      },
      {
        icon: 'iconlicense',
        text: '许可证黑白名单',
        href: '/black-white/license',
        powerId: 3560,
        ops: [
          {
            text: '增加许可证黑白名单',
            powerId: 3561
          },
          {
            text: '删除许可证黑白名单',
            powerId: 3562
          },
          {
            text: '查询许可证黑白名单',
            powerId: 3563
          },
          {
            text: '导出许可证黑白名单',
            powerId: 3564
          }
        ]
      }
    ]
  },
  {
    text: '集成配置与管理',
    heading: true,
    submenu: [
      {
        icon: 'icondevops',
        text: 'DevOps集成',
        href: '/integrated/devops/page',
        powerId: 2900,
        ops: [
          {
            text: '下载资源',
            powerId: 2901
          }
        ]
      }
    ]
  },
  {
    isPublic: true,
    text: '账号中心',
    submenu: [
      {
        icon: 'iconzhanghao',
        text: '账号管理',
        href: '/user',
        powerId: 1900,
        ops: [
          {
            text: '查看账号',
            powerId: 1901
          },
          {
            text: '添加账号',
            powerId: 1902
          },
          {
            text: '删除账号',
            powerId: 1903
          },
          {
            text: '编辑账号',
            powerId: 1904
          },
          {
            text: '更改状态',
            powerId: 1905
          },
          {
            text: '重置密码',
            powerId: 1906
          },
          {
            text: '角色管理',
            href: '/user/role',
            powerId: 2000,
            ops: [
              {
                text: '查看角色',
                powerId: 2001
              },
              {
                text: '添加角色',
                powerId: 2002
              },
              {
                text: '删除角色',
                powerId: 2003
              },
              {
                text: '编辑角色',
                powerId: 2004
              }
            ]
          }
        ]
      },
      {
        icon: 'iconjiaosekongzhi',
        text: '个人中心',
        href: '/account',
        powerId: 200,
        ops: [
          {
            text: '个人信息',
            powerId: 210
          },
          {
            text: '访问令牌',
            powerId: 220
          }
        ]
      },
      {
        icon: 'iconjiaosekongzhi',
        text: '日志审计',
        href: '/log',
        powerId: 2100,
        ops: [
          {
            text: '查看日志',
            powerId: 2101
          },
          {
            text: '导出日志',
            powerId: 2102
          },
          {
            text: '删除日志',
            powerId: 2103
          }
        ]
      },
      {
        icon: 'iconjiaosekongzhi',
        text: '消息通知',
        href: '/settings/warnConf',
        powerId: 300
      },
      {
        icon: 'iconjiaosekongzhi',
        text: '关于系统',
        href: '/update',
        powerId: 2250,
        ops: [
          {
            text: '查看系统更新',
            powerId: 2251
          },
          {
            text: '知识库更新',
            powerId: 2252
          }
        ]
      }
    ]
  },
  {
    isPublic: true,
    icon: 'iconjiaosekongzhi',
    text: '系统设置',
    href: '/system',
    powerId: 2200,
    submenu: [
      {
        text: '安全配置',
        href: '/system/safety',
        powerId: 2240,
        ops: [
          {
            text: '查看安全配置',
            powerId: 2241
          },
          {
            text: '更新安全配置',
            powerId: 2242
          }
        ]
      },
      {
        text: '通知配置',
        href: '/system/warnConf',
        powerId: 2230,
        ops: [
          {
            text: '查看通知配置',
            powerId: 2231
          },
          {
            text: '保存通知配置',
            powerId: 2232
          }
        ]
      },
      {
        text: '数据备份',
        href: '/system/backups',
        powerId: 2210,
        ops: [
          {
            text: '查看备份',
            powerId: 2211
          },
          {
            text: '删除备份',
            powerId: 2212
          },
          {
            text: '立即备份',
            powerId: 2213
          },
          {
            text: '下载备份',
            powerId: 2214
          },
          {
            text: '更新数据备份设置',
            powerId: 2215
          }
        ]
      },
      {
        text: '界面配置',
        href: '/system/webConf',
        powerId: 2220,
        ops: [
          {
            text: '保存界面设置',
            powerId: 2221
          },
          {
            text: '恢复默认',
            powerId: 2222
          }
        ]
      },
      {
        text: '规则配置',
        href: '/system/rule',
        powerId: 2201,
        ops: [
          {
            text: '添加规则',
            powerId: 2202
          },
          {
            text: '查看规则',
            powerId: 2203
          },
          {
            text: '删除规则',
            powerId: 2204
          },
          {
            text: '修改状态',
            powerId: 2205
          }
        ]
      },
      {
        text: '对接配置',
        href: '/system/docking',
        powerId: 3300,
        ops: [
          {
            text: 'jira对接配置',
            powerId: 3310,
            ops: [
              {
                text: '添加jira配置',
                powerId: 3311
              },
              {
                text: '删除jira配置',
                powerId: 3312
              },
              {
                text: '修改jira配置',
                powerId: 3313
              },
              {
                text: '查看jira配置',
                powerId: 3314
              },
              {
                text: '测试jira连接',
                powerId: 3315
              }
            ]
          },
          {
            text: 'LDAP配置',
            powerId: 3320
          }
        ]
      },
      {
        text: '后台配置',
        href: '/system/backstage',
        powerId: 3580,
        ops: [
          {
            text: '更新后台配置',
            powerId: 3582
          }
        ]
      },
      {
        text: '数据清理',
        href: '/system/backstage',
        powerId: 3590,
        ops: [
          {
            text: '立即清理',
            powerId: 3595
          },
          {
            text: '更新配置',
            powerId: 3593
          },
          {
            text: '查看配置',
            powerId: 3594
          }
        ]
      }
      /*      {
        text: '任务队列',
        href: '/system/taskQueue',
        powerId: 3720
      } */
    ]
  },
  {
    isPublic: true,
    text: '组件库及漏洞库查询',
    href: '/search',
    powerId: 2500
  },
  {
    isPublic: true,
    text: '标记组件、漏洞、许可证',
    powerId: 3711
  },
  {
    isPublic: true,
    text: '审计组件、许可证',
    powerId: 3712
  },
  {
    isPublic: true,
    text: '修改组件风险等级、漏洞等级、许可证风险等级',
    powerId: 3713
  }
]
