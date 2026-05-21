<template>
  <div class="content-wrap">
    <dialog-dependence ref="dependence"></dialog-dependence>
    <VersionAvailableDialog ref="versionAvailableDialog"></VersionAvailableDialog>
    <el-row style="border-bottom: 1px solid #f3f4f4;" :gutter="15" class="p-b-15">
      <el-col :span="18">
        <div class="first-title">
          <level-tag :level="componentInfo.securityLevel"></level-tag>
          <span class="name">{{ componentInfo.name || '-' }}</span>
          <i class="iconfont iconfengefu divide-icon" v-if="componentInfo.version"></i>
          <span class="version">{{ componentInfo.version || '-' }}</span>
          <el-button class="btn" v-if="!['/scan/node/details/component'].includes($route.path)" type="primary" size="medium" @click="$refs.dependence.open(assetComponentId)">查看依赖关系</el-button>
        </div>
        <info-wrap>
          <info-row>
            <info-item class="word-left" label="所属语言：" :span="8" v-if="componentInfo.language">
              <div class="inline-block m-r-10 m-b-5" v-for="(row,index) in componentInfo.language" :key="index">
                <div class="level-tag primary">{{ row }}</div>
              </div>
            </info-item>
            <info-item label="发布厂商：" :span="8">{{ componentInfo.vendor || '-' }}</info-item>
            <info-item label="发布日期：" :span="8">{{ componentInfo.releaseDate || '-' }}</info-item>
          </info-row>
          <info-row>
            <info-item class="word-left" label="解析深度：" :span="8">
              {{ componentInfo.parseDeep || 0 }}层
              {{ (componentInfo.parseDeep > 1) ? '（间接依赖）' : (componentInfo.parseDeep === 1 || !componentInfo.parseDeep) ? '（直接依赖）' : '' }}
            </info-item>
            <info-item label="组件完整性：" :span="8">{{ matching(checkResultOptions,componentInfo.md5Check,'value','text', '-') }}</info-item>
            <info-item label="推荐等级：" :span="8">
              <el-rate
                v-model="componentInfo.recommendNum"
                :show-score="false"
                text-color="#ff9900"
                score-template="{value}"
                disabled>
              </el-rate>
            </info-item>
          </info-row>
          <info-row>
            <info-item label="是否实际引入：" :span="8">
              <span class="m-r-5">{{componentInfo.realInUse === 1 ? '是' : "否"}}</span>
              <el-tooltip effect="dark" content="是否实际引入：是否在生产环境被引入，即判断该组件是否会在项目编译后被打包" :open-delay="150" placement="top">
                <i class="el-icon-info" style="color: #999999;"></i>
              </el-tooltip>
            </info-item>
            <info-item v-if="(componentInfo.parseDeep === 1 || !componentInfo.parseDeep)" label="关联漏洞统计：" :span="8">
              <span class="m-r-5">{{componentInfo.indirectVulnCount ? componentInfo.indirectVulnCount : 0}}</span>
              <el-tooltip effect="dark" content="统计直接依赖组件本身及实际引入子依赖的漏洞数量" :open-delay="150" placement="top">
                <i class="el-icon-info" style="color: #999999;"></i>
              </el-tooltip>
            </info-item>
          </info-row>
          <info-row>
            <info-item class="word-left" label="组件路径：" :span="24">{{ componentInfo.path || '-' }}</info-item>
          </info-row>
          <info-row v-if="componentInfo.parseInfo">
            <info-item label="文件位置：" :span="24">
              {{ componentInfo.parseInfo.fileName }}<span
              class="text-success m-l-10">line:{{ componentInfo.parseInfo.lineNum | ceil }}</span>
              <div class="code-wrap">
                <code-mirror ref="codeMirror" v-model="componentInfo.parseInfo.originText" :mode="'application/xml'"
                             :options="{readOnly: false, lineNumberFormatter}"></code-mirror>
              </div>
            </info-item>
          </info-row>
        </info-wrap>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span style="font-size: 16px;font-weight: bold">使用建议</span>
          </div>
          <div class="clearfix">
            <div class="component-suggest">
              <div class="icon-wrapper">
                <i class="iconfont icontuijianshengjibanben text-warning"></i>
              </div>
              <div class="content-wrapper">
                <p>推荐升级版本：</p>
                <h4>{{ componentInfo.nonVulnVersion ? componentInfo.nonVulnVersion : '--' }}</h4>
                <br>
                <span class="font-sm" v-if="get(componentInfo, 'recommendReleaseDate', false)">
                  发布日期：{{get(componentInfo, 'recommendReleaseDate', '--')}}
                </span>
              </div>
            </div>
            <div class="component-suggest">
              <div class="icon-wrapper">
                <i class="iconfont iconzuixinfabubanben text-primary"></i>
              </div>
              <div class="content-wrapper">
                <p>最新发布版本：</p>
                <h4>{{ componentInfo.latestVersion ?  componentInfo.latestVersion : '--' }}</h4>
                <br>
                <span class="font-sm" v-if="get(componentInfo, 'latestReleaseDate', false)">
                  发布日期：{{get(componentInfo, 'latestReleaseDate', '--')}}
                </span>
              </div>
            </div>
            <div class="component-suggest" @click="$refs.versionAvailableDialog.open(componentInfo, token)">
              <div class="icon-wrapper" style="padding-top: 5px;">
                <!--              <i class="iconfont icontuijianshengjibanben text-primary"></i>-->
                <img height="30" style="margin-right: 12px;" :src="require('@/assets/images/svg/use-jianyi.svg')" alt="">
              </div>
              <div class="content-wrapper">
                <p style="color: #8B5CF6;">
                  其它无漏洞可用版本
                  <i class="el-icon-d-arrow-right" style="font-weight: bold;"></i>
                </p>
              </div>
            </div>
          </div>
        </el-card>
<!--        <div class="headline"><i class="iconfont icontuijianshengjibanben"></i>使用建议</div>-->
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {
    assetComponentDetail
  } from '@/api/open/scan/develop/integration'
  import CodeMirror from '@/components/public/CodeMirror'
  import DialogDependence from "@/views/open/scan/develop/integration/details/public/component/ComponentInfo/dialogDependence";
  import VersionAvailableDialog from '@/views/home/assets/module/details/VersionAvailableDialog'

  export default {
    name: 'ScanAppDetailsComponent',
    props: ['assetComponentId'],
    components: {
      VersionAvailableDialog,
      DialogDependence,
      CodeMirror
    },
    data() {
      return {
        componentInfo: {},
        token: this.$route.query.token,
        checkResultOptions: [{
            value: 0,
            text: '未校验'
          },
          {
            value: 1,
            text: '校验通过'
          },
          {
            value: 2,
            text: '校验未通过'
          },
          {
            value: 3,
            text: '私服库校验通过'
          }
        ],
        loading: false
      }
    },
    methods: {

      lineNumberFormatter (line) {
        // eslint-disable-next-line vue/no-mutating-props
        return get(this.componentInfo, 'parseInfo.lineNumber', 0) + line - 1
      },

      // 初始化组件详情
      init() {
        this.componentInfo = {}
        assetComponentDetail({
          id: this.assetComponentId,
          loading: false
        },this.token).then(response => {
          this.componentInfo = {
            ...this.componentInfo,
            ...response.data
          }
          if (this.componentInfo.parseInfo && this.componentInfo.parseInfo.originText) {
            this.$set(this.componentInfo.parseInfo, 'lineNum', ((this.componentInfo.parseInfo.originText.split('\n')
              .length - 1) / 2) + this.componentInfo.parseInfo.lineNumber)
          }
          if (this.componentInfo.language) {
            this.componentInfo.language = this.componentInfo.language.split(',')
          }
        }).catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }
    },
    watch: {
      assetComponentId(newVal) {
        if (newVal) {
          this.init()
        } else {
          this.componentInfo = {}
        }
      }
    },
    mounted() {
      if (this.assetComponentId) {
        this.init()
      }
    }
  }

</script>
<style scoped lang="scss">

.btn{
  top: 17px;
}
  .content-wrap {
    padding: 0 0 0;

    // ::v-deep .info-panel-item label {
    //   width: 210px !important;
    // }
  }

  .component-suggest {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 2px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    cursor: pointer;
    transition: .3s;
    margin-bottom: 20px;

    &:hover{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(30,136,229,1);
      .content-wrapper{
        p{
          color: rgba(30,136,229,1);
        }
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    .icon-wrapper {
      i {
        font-size: 30px;
        margin-right: 12px;
        display: block;
      }
    }

    .content-wrapper {
      flex: 1;

      h4 {
        display: inline-block;
        color: #333333;
        font-weight: bold;
        font-size: 16px;
        margin: 0;
      }

      p {
        display: inline-block;
        margin: 0;
        color: #7D90A9;
        font-weight: 500;
        font-size: 14px;
      }
    }
  }

  .word-left {
    :deep(label) {
      width: 85px !important;
    }

  }

</style>
