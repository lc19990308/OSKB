export default [
  {
    path: 'black-white',
    name: 'BlackWhiteBlackWhite',
    redirect: '/black-white/black-white/main/black/list',
    component: () => import('@/views/home/blackWhite/blackWhite'),
    children: [
      {
        path: 'add-black-list',
        name: 'AddBlackList',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '组件黑白名单',
              path: ''
            },
            {
              name: '添加组件黑名单',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/blackWhite/blackWhite/add/index')
      },
      {
        path: 'add-white-list',
        name: 'AddWhiteList',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '组件黑白名单',
              path: ''
            },
            {
              name: '添加组件白名单',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/blackWhite/blackWhite/add/index')
      },
      {
        path: 'main',
        name: 'BlackWhiteMain',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '组件黑白名单',
              path: ''
            }
          ]
        },
        redirect: '/black-white/black-white/main/black/list',
        component: () => import('@/views/home/blackWhite/blackWhite/main'),
        children: [
          {
            path: 'black/list',
            name: 'BlackList',
            meta: {
              requiresAuth: false,
              keepAlive: true,
              breadcrumb: [
                {
                  name: '组件黑白名单',
                  path: ''
                },
                {
                  name: '组件黑名单',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/blackWhite/black/main.vue')
          },
          {
            path: 'white/list',
            name: 'WhiteList',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '组件黑白名单',
                  path: ''
                },
                {
                  name: '组件白名单',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/blackWhite/white/main.vue')
          }
        ]
      },
      {
        path: 'main/black/details',
        name: 'BlackDetails',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '组件黑白名单',
              path: ''
            },
            {
              name: '组件黑名单',
              path: '/black-white/black-white/main/black/list'
            },
            {
              name: '组件详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/blackWhite/blackWhite/black/details/index.vue')
      },
      {
        path: 'main/white/details',
        name: 'WhiteDetails',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '组件黑白名单',
              path: ''
            },
            {
              name: '组件白名单',
              path: '/black-white/black-white/main/white/list'
            },
            {
              name: '组件详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/blackWhite/blackWhite/white/details/index.vue')
      }
    ]
  },
  {
    path: 'loophole',
    name: 'loophole',
    redirect: '/black-white/loophole/main/black/list',
    component: () => import('@/views/home/blackWhite/loophole/index.vue'),
    children: [
      {
        path: 'main',
        name: 'loopholeMain',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '漏洞黑白名单',
              path: ''
            }
          ]
        },
        redirect: '/black-white/loophole/main/black/list',
        component: () => import('@/views/home/blackWhite/loophole/main'),
        children: [
          {
            path: 'black/list',
            name: 'loopholeBlackList',
            meta: {
              requiresAuth: false,
              keepAlive: true,
              breadcrumb: [
                {
                  name: '漏洞黑白名单',
                  path: ''
                },
                {
                  name: '漏洞黑名单',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/loophole/black/main.vue')
          },
          {
            path: 'white/list',
            name: 'loopholeWhiteList',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '漏洞黑白名单',
                  path: ''
                },
                {
                  name: '漏洞白名单',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/loophole/white/main.vue')
          }
        ]
      },
      {
        path: 'black/add',
        name: 'loopholeBlackAdd',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '漏洞黑白名单',
              path: ''
            },
            {
              name: '漏洞黑名单',
              path: '/black-white/loophole/main/black/list'
            },
            {
              name: '添加黑名单漏洞',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/blackWhite/loophole/black/add/index'),
        redirect: '/black-white/loophole/black/add/quick',
        children: [
          {
            path: 'quick',
            name: 'loopholeBlackAddQuick',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '漏洞黑白名单',
                  path: ''
                },
                {
                  name: '漏洞黑名单',
                  path: '/black-white/loophole/main/black/list'
                },
                {
                  name: '添加黑名单漏洞',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/loophole/black/add/quick/main.vue')
          },
          {
            path: 'batch',
            name: 'loopholeBlackAddBatch',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '漏洞黑白名单',
                  path: ''
                },
                {
                  name: '漏洞黑名单',
                  path: '/black-white/loophole/main/black/list'
                },
                {
                  name: '添加黑名单漏洞',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/loophole/black/add/batch/main.vue')
          }
        ]
      },
      {
        path: 'white/add',
        name: 'loopholeWhiteAdd',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '漏洞黑白名单',
              path: ''
            },
            {
              name: '漏洞白名单',
              path: '/black-white/loophole/main/white/list'
            },
            {
              name: '添加白名单漏洞',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/blackWhite/loophole/white/add/index'),
        redirect: '/black-white/loophole/white/add/quick',
        children: [
          {
            path: 'quick',
            name: 'loopholeWhiteAddQuick',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '漏洞黑白名单',
                  path: ''
                },
                {
                  name: '漏洞白名单',
                  path: '/black-white/loophole/main/white/list'
                },
                {
                  name: '添加白名单漏洞',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/loophole/white/add/quick/main.vue')
          },
          {
            path: 'batch',
            name: 'loopholeWhiteAddBatch',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '漏洞黑白名单',
                  path: ''
                },
                {
                  name: '漏洞白名单',
                  path: '/black-white/loophole/main/white/list'
                },
                {
                  name: '添加白名单漏洞',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/loophole/white/add/batch/main.vue')
          }
        ]
      }
    ]
  },
  {
    path: 'baseline',
    name: 'baseline',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '组件版本基线管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/blackWhite/baseline/index.vue'),
    redirect: '/black-white/baseline/list',
    children: [
      {
        path: 'list',
        name: 'baselineList',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '组件版本基线管理',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/blackWhite/baseline/main')
      },
      {
        path: 'add',
        name: 'baselineAdd',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '组件版本基线管理',
              path: '/black-white/baseline/list'
            },
            {
              name: '添加组件版本基线',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/blackWhite/baseline/add/index'),
        redirect: '/black-white/baseline/add/quick',
        children: [
          {
            path: 'quick',
            name: 'baselineAddQuick',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '组件版本基线管理',
                  path: '/black-white/baseline/list'
                },
                {
                  name: '添加组件版本基线',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/baseline/add/quick/main.vue')
          },
          {
            path: 'batch',
            name: 'baselineAddBatch',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '组件版本基线管理',
                  path: '/black-white/baseline/list'
                },
                {
                  name: '添加组件版本基线',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/baseline/add/batch/main.vue')
          }
        ]
      }
    ]

  },
  {
    path: 'license',
    name: 'licenseBlackAndWhiteList',
    redirect: '/black-white/license/main/black/list',
    component: () => import('@/views/home/blackWhite/licenseBlackAndWhiteList'),
    children: [
      {
        path: 'main',
        name: 'licenseMain',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '许可证黑白名单',
              path: ''
            }
          ]
        },
        redirect: '/black-white/license/main/black/list',
        component: () => import('@/views/home/blackWhite/licenseBlackAndWhiteList/main'),
        children: [
          {
            path: 'black/list',
            name: 'licenseBlackList',
            meta: {
              requiresAuth: false,
              keepAlive: true,
              breadcrumb: [
                {
                  name: '许可证黑白名单',
                  path: ''
                },
                {
                  name: '许可证黑名单',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/licenseBlackAndWhiteList/black/main.vue')
          },
          {
            path: 'white/list',
            name: 'licenseWhiteList',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '许可证黑白名单',
                  path: ''
                },
                {
                  name: '许可证白名单',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/licenseBlackAndWhiteList/white/main.vue')
          }
        ]
      },
      {
        path: 'black/add',
        name: 'licenseBlackAdd',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '许可证黑名单',
              path: '/black-white/license/main/black/list'
            },
            {
              name: '添加许可证黑名单',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/blackWhite/licenseBlackAndWhiteList/black/add/index'),
        redirect: '/black-white/license/black/add/quick',
        children: [
          {
            path: 'quick',
            name: 'licenseBlackAddQuick',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '许可证黑名单',
                  path: '/black-white/license/main/black/list'
                },
                {
                  name: '添加许可证黑名单',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/licenseBlackAndWhiteList/black/add/quick/main.vue')
          },
          {
            path: 'batch',
            name: 'licenseBlackAddBatch',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '许可证黑名单',
                  path: '/black-white/license/main/black/list'
                },
                {
                  name: '添加许可证黑名单',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/licenseBlackAndWhiteList/black/add/batch/main.vue')
          }
        ]
      },
      {
        path: 'white/add',
        name: 'licenseWhiteAdd',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '许可证白名单',
              path: '/black-white/license/main/white/list'
            },
            {
              name: '添加许可证白名单',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/blackWhite/licenseBlackAndWhiteList/white/add/index'),
        redirect: '/black-white/license/white/add/quick',
        children: [
          {
            path: 'quick',
            name: 'licenseWhiteAddQuick',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '许可证白名单',
                  path: '/black-white/license/main/white/list'
                },
                {
                  name: '添加许可证白名单',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/licenseBlackAndWhiteList/white/add/quick/main.vue')
          },
          {
            path: 'batch',
            name: 'licenseWhiteAddBatch',
            meta: {
              requiresAuth: false,
              breadcrumb: [
                {
                  name: '许可证白名单',
                  path: '/black-white/license/main/white/list'
                },
                {
                  name: '添加许可证白名单',
                  path: ''
                }
              ]
            },
            component: () => import('@/views/home/blackWhite/licenseBlackAndWhiteList/white/add/batch/main.vue')
          }
        ]
      }
    ]
  }
]
