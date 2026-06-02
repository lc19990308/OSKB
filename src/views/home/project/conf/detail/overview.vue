<template>
  <div>
    <div>
      <cs-title>风险统计</cs-title>
      <el-row v-loading="loading">
<!--        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">-->
<!--          <app-pie :state="packageNumVO"></app-pie>-->
<!--        </el-col>-->
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <component-pie :state="componentNumVO"></component-pie>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <vul-pie :state="vulNumVO"></vul-pie>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <LicensePie :state="licenseNumVO"></LicensePie>
        </el-col>
      </el-row>
    </div>
    <div class="p-t-15">
      <cs-title>各场景检测统计</cs-title>
      <el-row :gutter="20">
        <template v-for="(item, index) in state">
          <el-col :key="item.title" :xs="24" :sm="12" :md="12" :lg="8" :xl="6" class="m-b-20"
                  v-if="typeof item.powerId === 'function' ? item.powerId() : authorityFilter(item.powerId)">
            <div class="cm-item-box">
              <div class="cm-item-box_head">
                <span>{{item.title}}</span>
                <span style="position: relative;">
                  <template v-if="item.powerId === 2301">
                    <el-select
                      v-model="item.source"
                      size="mini"
                      style="width: 100px;position: absolute;right: 0;top:-10px;"
                      @change="getCont(item.xhr, index)"
                    >
                      <el-option :value="0" label="Git"></el-option>
                      <el-option :value="1" label="SVN"></el-option>
                      <el-option :value="2" label="FireFly"></el-option>
                    </el-select>
                  </template>
                  <template v-if="item.powerId === 2309">
                    <el-select
                      v-model="item.source"
                      size="mini"
                      style="width: 100px;position: absolute;right: 0;top:-10px;"
                      @change="getCont(item.xhr, index)"
                    >
                      <el-option :value="0" label="源码"></el-option>
                      <el-option :value="1" label="镜像"></el-option>
                    </el-select>
                  </template>
                </span>
              </div>
              <div class="cm-item-box_content">
                <el-row :gutter="10">
                  <el-col :span="12" v-for="(citem, i) in item.children" :key="item.title + citem.title" :class="{
                    'm-b-10': (item.children.length % 2 === 0) ? i < (item.children.length - 2) : i <
                    (item.children.length - 1)
                  }">
                    <div class="cm-item-box_content__count">
                      <div>
                        <label>{{citem.title}}：</label>{{citem.total}}
                      </div>
                      <div class="icon-box"><i :class="['iconfont', citem.icon]"></i></div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="p-t-10 text-right">
                <el-button class="plain-button" plain size="small" @click="toList(item.route)">查看详情
                </el-button>
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script>
import ComponentPie from './chart/ComponentPie'
import VulPie from './chart/VulPie'
import LicensePie from './chart/LicensePie'
import * as api from '@/api/home/project/conf'
import { to, get, authorityFilter } from '@/utils'

export default {
  name: 'overview',
  props: ['project'],
  components: {
    ComponentPie,
    VulPie,
    LicensePie,
    CsTitle: {
      render (h) {
        return h('div', { class: 'oss-title' }, this.$scopedSlots.default())
      }
    }
  },
  data () {
    const self = this
    return {
      loading: false,
      state: [
        {
          title: '组件依赖检测',
          xhr: api.assetPackageCount,
          loading: false,
          route: '/scan/app/component',
          powerId: 900,
          level: 1,
          children: [
            {
              title: '应用包总数',
              total: 0,
              icon: 'iconmoshi'
            },
            {
              title: '组件总数',
              total: 0,
              icon: 'iconcomponent'
            },
            {
              title: '漏洞总数',
              total: 0,
              icon: 'iconloudongku'
            },
            {
              title: '许可证总数',
              total: 0,
              icon: 'iconpermission'
            }
          ]
        },
        {
          title: 'IDE开发管理',
          loading: false,
          xhr: api.idePluginCount,
          route: '/scan/develop/ide',
          powerId: 2315,
          level: 2,
          children: [
            {
              title: '应用包总数',
              total: 0,
              icon: 'iconmoshi'

            },
            {
              title: '组件总数',
              total: 0,
              icon: 'iconcomponent'
            },
            {
              title: '漏洞总数',
              total: 0,
              icon: 'iconloudongku'
            },
            {
              title: '许可证总数',
              total: 0,
              icon: 'iconpermission'
            }
          ]
        },
        {
          title: '代码库管理',
          xhr: [
            api.gitRepository,
            api.svnRepository,
            api.fireflyRepository
          ],
          loading: false,
          route: '/scan/develop/repository',
          level: 1,
          powerId: 2301,
          source: 0,
          children: [
            {
              title: '仓库总数',
              total: 0,
              icon: 'iconmoshi'

            },
            {
              title: '组件总数',
              total: 0,
              icon: 'iconcomponent'
            },
            {
              title: '漏洞总数',
              total: 0,
              icon: 'iconloudongku'
            },
            {
              title: '许可证总数',
              total: 0,
              icon: 'iconpermission'
            }
          ]
        },
        {
          title: '集成部署',
          xhr: [
            api.integrationCount,
            api.integrationImageCount
          ],
          loading: false,
          route: '/scan/integration',
          level: 3,
          powerId: 2309,
          source: 0,
          children: [
            {
              title: '应用包总数',
              total: 0,
              icon: 'iconmoshi'

            },
            {
              title: '组件总数',
              total: 0,
              icon: 'iconcomponent'
            },
            {
              title: '漏洞总数',
              total: 0,
              icon: 'iconloudongku'
            },
            {
              title: '许可证总数',
              total: 0,
              icon: 'iconpermission'
            }
          ]
        },
        {
          title: '二进制成分分析',
          loading: false,
          xhr: api.binaryAnalysisCount,
          route: '/scan/binary',
          powerId: 2800,
          level: 1,
          children: [
            {
              title: '应用包总数',
              total: 0,
              icon: 'iconmoshi'

            },
            {
              title: '组件总数',
              total: 0,
              icon: 'iconcomponent'
            },
            {
              title: '漏洞总数',
              total: 0,
              icon: 'iconloudongku'
            },
            {
              title: '许可证总数',
              total: 0,
              icon: 'iconpermission'
            }
          ]
        },
        {
          title: '测试运行监控',
          loading: false,
          xhr: api.iastNodeCount,
          route: '/scan/node',
          level: 5,
          powerId: 1000,
          children: [
            {
              title: '节点总数',
              total: 0,
              icon: 'iconmoshi'

            },
            {
              title: '组件总数',
              total: 0,
              icon: 'iconcomponent'
            },
            {
              title: '漏洞总数',
              total: 0,
              icon: 'iconloudongku'
            },
            {
              title: '许可证总数',
              total: 0,
              icon: 'iconpermission'
            }
          ]
        },
        {
          title: '私服库安全扫描',
          loading: false,
          xhr: api.nexusRepositoryCount,
          route: '/scan/private',
          level: 1,
          powerId: 2400,
          children: [
            {
              title: '仓库总数',
              total: 0,
              icon: 'iconmoshi'

            },
            {
              title: '组件总数',
              total: 0,
              icon: 'iconcomponent'
            },
            {
              title: '漏洞总数',
              total: 0,
              icon: 'iconloudongku'
            },
            {
              title: '许可证总数',
              total: 0,
              icon: 'iconpermission'
            }
          ]
        },
        {
          title: 'SBOM风险扫描',
          loading: false,
          xhr: api.sbomCount,
          route: '/scan/sbom',
          level: 1,
          powerId: 3570,
          children: [
            {
              title: '应用总数',
              total: 0,
              icon: 'iconmoshi'

            },
            {
              title: '组件总数',
              total: 0,
              icon: 'iconcomponent'
            },
            {
              title: '漏洞总数',
              total: 0,
              icon: 'iconloudongku'
            },
            {
              title: '许可证总数',
              total: 0,
              icon: 'iconpermission'
            }
          ]
        },
        {
          title: '镜像安全扫描',
          loading: false,
          xhr: api.imageCount,
          route: '/scan/container/mirror/list',
          level: 1,
          powerId () {
            return self.$store.state.site.imageEnable && authorityFilter(3609)
          },
          formatter (data, self) {
            self.level = get(data, 'security', 5)
            self.children[0].total = get(data, 'packageNumVO.total', 0)
            self.children[1].total = get(data, 'imagePackageNumVO.total', 0)
            self.children[2].total = get(data, 'componentNumVO.total', 0)
            self.children[3].total = get(data, 'vulNumVO.total', 0)
            self.children[4].total = get(data, 'licenseNumVO.totalNum', 0)
          },
          children: [
            {
              title: '应用总数',
              total: 0,
              icon: 'iconmoshi'
            },
            {
              title: '软件包总数',
              total: 0,
              icon: 'iconcomponent'
            },
            {
              title: '组件总数',
              total: 0,
              icon: 'iconcomponent'
            },
            {
              title: '漏洞总数',
              total: 0,
              icon: 'iconloudongku'
            },
            {
              title: '许可证总数',
              total: 0,
              icon: 'iconpermission'
            }
          ]
        }
      ],
      packageNumVO: {
        total: 0,
        serious: 0,
        high: 0,
        medium: 0,
        low: 0,
        normal: 0
      },
      licenseNumVO: {
        totalNum: 0,
        highNum: 0,
        mediumNum: 0,
        lowNum: 0
      },
      vulNumVO: {
        total: 0,
        serious: 0,
        high: 0,
        medium: 0,
        low: 0,
        normal: 0
      },
      componentNumVO: {
        total: 0,
        serious: 0,
        high: 0,
        medium: 0,
        low: 0,
        normal: 0
      }
    }
  },
  computed: {
    projectId () {
      return this.$route.query.id
    }
  },
  methods: {
    async getProjectCount () {
      this.loading = true
      const [error, response] = await to(api.projectCount(this.projectId))
      this.loading = false
      if (error && error.message) return this.$message.error(error.message)
      this.packageNumVO = get(response, 'data.packageNumVO', this.$options.data().packageNumVO)
      this.licenseNumVO = get(response, 'data.licenseNumVO', this.$options.data().licenseNumVO)
      this.vulNumVO = get(response, 'data.vulNumVO', this.$options.data().vulNumVO)
      this.componentNumVO = get(response, 'data.componentNumVO', this.$options.data().componentNumVO)
    },
    async getCont (xhr, i) {
      const _xhr = isArray(xhr) ? xhr[this.state[i].source] : xhr
      this.state[i].loading = true
      const [error, response] = await to(_xhr(this.projectId))
      this.state[i].loading = false
      if (error && error.message) return this.$message.error(error.message)
      if (typeof this.state[i].formatter === 'function') {
        this.state[i].formatter(response.data || {}, this.state[i])
      } else {
        this.state[i].level = get(response, 'data.security', 5)
        this.state[i].children[0].total = get(response, 'data.packageNumVO.total', 0)
        this.state[i].children[1].total = get(response, 'data.componentNumVO.total', 0)
        this.state[i].children[2].total = get(response, 'data.vulNumVO.total', 0)
        this.state[i].children[3].total = get(response, 'data.licenseNumVO.totalNum', 0)
      }
    },
    async toList (path) {
      await this.$store.dispatch('selectProject', {
        text: this.project.name,
        value: this.project.id,
        label: this.project.name,
        id: this.project.id,
        name: this.project.name,
        userId: this.project.userId
      })
      this.$router.push(path)
    }
  },
  created () {
    this.state.forEach((item, i) => {
      (typeof item.powerId === 'function' ? item.powerId() : this.authorityFilter(item.powerId)) && this.getCont(item.xhr, i)
    })
    this.getProjectCount()
  }
}
</script>

<style scoped lang="scss">
.oss-title {
  font-size: 16px;
  font-weight: bold;
  position: relative;
  padding-left: 10px;
  margin-bottom: 15px;

&::before {
   content: '';
   position: absolute;
   height: 60%;
   left: 0;
   top: 4px;
   width: 3px;
   background: $color-primary;
 }
}

:deep(.common-header){
  padding-top: 0 !important;
  padding-left: 0 !important;
}

.cm-item-box {
  border-radius: 3px;
  background: #FFFFFF;
  box-shadow: 0px 0px 8px 0px #004B900F;
  padding: 15px 20px;
  .cm-item-box_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .cm-item-box_content {
    .cm-item-box_content__count {
      border-radius: 3px;
      background: #FFFFFF;
      border: 1px solid #F0F0F1;
      padding: 14px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      label {
        color: $text-color-regular;
        font-size: 14px;
      }
      .icon-box {
        width: 18px;
        height: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FFFFFF;
        border: 1px solid #8B9CB0;
        border-radius: 50%;
        .iconfont {
          font-size: 12px;
          transform: scale(0.9);
        }
      }
    }
  }
}
</style>
