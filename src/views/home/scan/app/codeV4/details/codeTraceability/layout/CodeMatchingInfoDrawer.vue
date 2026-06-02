<template>
  <el-drawer
    append-to-body
    modal-append-to-body
    size="1200px"
    :visible.sync="drawer">
    <template slot="title">
      <span>
        <span class="text-primary cursor-pointer" @click="drawer = false">匹配信息</span> > 代码匹配详情
      </span>
    </template>
    <div class="oss-drawer-main">
      <div class="banner m-b-20">
        <div class="m-r-15">
          <img v-if="get(baseInfo, 'from') === 'github'" :src="icon.github" alt="">
          <img v-if="get(baseInfo, 'from') === 'gitlab'" :src="icon.gitlab" alt="">
          <img v-if="get(baseInfo, 'from') === 'bitbucket'" :src="icon.bitbucket" alt="">
          <img v-if="get(baseInfo, 'from') === 'gitee'" :src="icon.gitee" alt="">
          <img v-if="get(baseInfo, 'from') === 'codeberg'" :src="icon.codeberg" alt="">
        </div>
        <div style="flex: 1;">
          <div class="m-b-10 font-bold font-md">{{get(baseInfo, 'projectName', '-')}}</div>
          <div class="font-base">
            <span style="margin-right: 30px;">版本号：{{get(baseInfo, 'version', '-')}}</span>
            <span style="margin-right: 30px;">
              许可证：
              <template v-if="isArray(baseInfo.licenses)">
                 <LicenseTag
                   v-for="(item, index) in get(baseInfo, 'licenses', [])"
                   license
                   :level="3"
                   :key="item + '-'  + index">
                {{item}}
              </LicenseTag>
              </template>
              <template v-else-if="isString(baseInfo.licenses)">{{get(baseInfo, 'licenses', '-')}}</template>
              <template v-else>-</template>
            </span>
            <span>
              项目地址：
               <el-link v-if="get(baseInfo, 'fromUrl')" target="_blank" :underline="false" :href="get(baseInfo, 'fromUrl' )">
                  {{get(baseInfo, 'fromUrl', '-')}}
                  <i class="el-icon-link font-bold"></i>
              </el-link>
              <template v-else>-</template>
            </span>
          </div>
        </div>
      </div>
      <div class="oss-content">
        <div class="oss-content-header flex between">
          <div class="oss-header-wrapper">
            <span class="m-r-50">匹配等级： {{get(metadata, 'matchType') === 0 ? '文件级' : get(metadata, 'matchType') === 1 ? `代码片段级(${get(metadata, 'matchCodeLine', 0)}行)` : '-' }}</span>
            <span class="m-r-50">语言：{{ fileInfo.language || '-' }}</span>
            <span class="m-r-50">
              状态：
                <oss-dot v-if="get(row, 'signStatus') === 1" type="success" plain>标记开源</oss-dot>
                <oss-dot v-else-if="get(row, 'signStatus') === 0" type="warning" plain>标记自研</oss-dot>
                <template v-else>-</template>
            </span>
          </div>
          <div class="flex">
            <span class="m-r-10" style="padding-top: 2px;">{{currentPage + 1}}/{{tableData.length}}</span>
            <span :class="[currentPage ? 'icon-button-circular-blue' : 'icon-button-circular-ash','icon-button-circular', 'm-r-10']" @click="changePage($event,'-')">
              <i class="el-icon-arrow-left"></i>
            </span>
            <span :class="[(currentPage+1) >= tableData.length  ? 'icon-button-circular-ash' : 'icon-button-circular-blue','icon-button-circular']" @click="changePage($event,'+')">
              <i class="el-icon-arrow-right"></i>
            </span>
          </div>
        </div>
        <div style="padding: 20px;">
          <el-row class="m-b-10" style="line-height: 22px;" :gutter="30">
            <el-col :span="11">
              <div>应用文件检测路径</div>
              <div class="text-regular" style="word-wrap: break-word;word-break: break-all;">
                {{row.sourceFilePath}}
                <i class="el-icon-copy-document"
                   @click="copyText(row.sourceFilePath)"></i>
              </div>
            </el-col>
            <el-col :span="11">
              <div>匹配开源项目文件路径</div>
              <div class="text-regular" style="word-wrap: break-word;word-break: break-all;">
                {{get(row, 'openFilePath', '-')}}
                <i class="el-icon-copy-document"
                   @click="copyText(get(row, 'openFilePath', '-'))"></i>
              </div>
            </el-col>
            <el-col :span="2" v-if="get(metadata, 'matchType', 0) === 0">
              <div class="similarity">
                <span>{{get(row, 'similarityPercentage', 0)}}%</span>
                <span>相似度</span>
              </div>
            </el-col>
          </el-row>
          <div v-loading="loading" class="code-mirror-warp">
            <div class="jump-btn" v-if="visibleJump && marks.length > 0">
              <span :class="['icon-button-circular m-b-10', index === 0 ? 'icon-button-circular-ash' : 'icon-button-circular-blue']" @click="jump('up')">
               <i class="el-icon-arrow-up"></i>
              </span>
              <span :class="['icon-button-circular', index === marks.length - 1 ? 'icon-button-circular-ash' : 'icon-button-circular-blue']" @click="jump('down')">
              <i class="el-icon-arrow-down"></i>
              </span>
            </div>
            <el-row>
              <el-col :span="12">
                <CodeEditor :code="code.code" :marks="marks.code"></CodeEditor>
              </el-col>
              <el-col :span="12">
                <CodeEditor :code="code.openCode" :marks="marks.openCode"></CodeEditor>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script>

import { awaitTo as to, copyText } from '@/utils'
import { getCodeApi } from '@/api/home/assets/app/codeV4'
import LicenseTag from '@/views/home/scan/app/code/details/codeTraceability/layout/LicenseTag.vue'
import CodeEditor from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/components/CodeEditor.vue'
export default {
  name: 'CodeMatchingInfoDrawer',
  components: {
    CodeEditor,
    LicenseTag
  },
  data () {
    return {
      icon: {
        github: require('@/assets/images/svg/scan/github.svg'),
        gitee: require('@/assets/images/svg/scan/gitee.svg'),
        gitlab: require('@/assets/images/svg/scan/gitlab.svg'),
        bitbucket: require('@/assets/images/svg/scan/bitbucket.svg'),
        codeberg: require('@/assets/images/svg/scan/codeberg.svg')
      },
      baseInfo: {},
      row: {},
      metadata: {},
      drawer: false,
      fileInfo: {},
      desc: {},
      currentPage: 1,
      code: {
        code: '',
        openCode: ''
      },
      loading: false,
      visibleJump: false,
      index: 0
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    marks () {
      const item = this.row
      return {
        code: (item && Array.isArray(item.similarityCode)) ? item.similarityCode[0] : [],
        openCode: (item && Array.isArray(item.similarityCode)) ? item.similarityCode[1] : []
      }
    }
  },
  methods: {
    changePage (e, t) {
      if (e.currentTarget.classList.contains('icon-button-circular-ash')) return
      this.currentPage = t === '+' ? this.currentPage + 1 : this.currentPage - 1
      this.init()
    },
    init () {
      this.row = this.tableData[this.currentPage]
      this.getCode()
    },
    copyText,
    async getCode () {
      this.loading = true
      const [err, res] = await to(getCodeApi({
        sourceFileId: this.row.sourceFileId,
        openFilePath: this.row.openFilePath,
        loading: false
      }))
      this.loading = false
      if (err && err.message) {
        this.$message.error(err.message)
      } else {
        this.code = res.data || this.$options.data().code
      }
    },
    open (currentPage, baseInfo, fileInfo) {
      this.drawer = true
      this.currentPage = currentPage
      this.baseInfo = baseInfo
      this.fileInfo = fileInfo
      this.metadata = JSON.parse(decodeURIComponent(this.$route.query.row))
      this.init()
    }
  }
}
</script>

<style lang="scss">
.code-mirror-warp {
  overflow: hidden;
  border-radius: 6px;
  position: relative;

  .jump-btn {
    position: absolute;
    z-index: 1000;
    right: 50px;
    top: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .CodeMirror {
    height: auto;
  }

  .code-mirror-head {
    background: #303347;
    color: #FFFFFF;
    padding: 10px 20px;
  }
}
</style>
<style scoped lang="scss">
:deep(.el-drawer__header) {
  color: #1B2838;
  font-size: 16px;
  padding: 15px 20px;
  border-bottom: 1px solid #DCDEE0;
  margin-bottom: 0;
  line-height: normal;

  .el-dialog__close {
    color: $text-color-placeholder;
    font-weight: bold;
  }
}

.icon-button-circular {
  color: #FFFFFF;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  transition: background-color 300ms;

  i {
    font-size: 14px;
  }
}

.icon-button-circular-blue {
  background: #2C5F8A;

  &:hover {
    background: #4ba0ea;;
  }
}

.icon-button-circular-ash {
  background: #8B9CB0;

  &:hover {
    background: #dcdee0;;
  }
}

.similarity {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #2C5F8A;
  box-shadow: 0px 0px 2px 0px #14304919;
  color: #2C5F8A;
  line-height: 14px;
  float: right;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  span:nth-child(2) {
    font-size: 12px;
    display: inline-block;
    transform: scale(0.9);
  }
}
.oss-header-wrapper {
  vertical-align: middle;
  * {
    vertical-align: initial;
  }
}
.oss-drawer-main {
  padding: 20px;
  box-sizing: border-box;
  color: #1B2838;
  max-height: calc(100vh - 60px);
  overflow-y: auto;

  .banner {
    box-shadow: 0px 0px 8px 0px #F0F0F0;
    border-radius: 4px;
    box-sizing: border-box;
    background: #FFFFFF;
    border: 1px solid #EBEEF5;
    width: 100%;
    padding: 15px 20px;
    display: flex;
    align-items: center;
  }

  .oss-content {
    border: 1px solid #DEDEE0;

    .oss-content-header {
      background: #F3F7FA;
      padding: 15px 20px;
    }
  }
}
</style>
