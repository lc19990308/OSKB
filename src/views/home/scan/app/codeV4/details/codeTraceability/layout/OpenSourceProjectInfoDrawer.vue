<template>
  <el-drawer
    title="开源项目信息"
    append-to-body
    size="610px" :visible.sync="drawer"
    @close="desc = {}"
    :with-header="true">
    <div class="content scrollbar-custom" v-loading="loading">
      <oss-title>基本信息</oss-title>
      <el-form label-width="130px" label-position="left" class="m-b-20 p-l-10">
        <el-form-item label="项目名称">{{get(desc, 'projectName', '-')}}</el-form-item>
        <el-form-item label="分支/版本">{{get(desc, 'version', '-')}}</el-form-item>
        <el-form-item label="来源">{{get(desc, 'from', '-')}}</el-form-item>
        <el-form-item label="项目地址">
          <el-link v-if="get(desc, 'fromUrl')" target="_blank" :underline="false" :href="get(desc, 'fromUrl' )">
            {{get(desc, 'fromUrl', '-')}}
            <i class="el-icon-link font-bold"></i>
          </el-link>
          <template v-else>-</template>
        </el-form-item>
        <el-form-item label="语言">{{get(desc, 'language', '-')}}</el-form-item>
<!--        <el-form-item label="官网链接">{{get(desc, 'homepage', '-')}}</el-form-item>-->
        <el-form-item label="创建时间"> {{get(desc, 'createDate', '-')}}</el-form-item>
        <el-form-item label="项目描述" v-if="drawer">
          <div style="line-height: 24px;padding-top: 8px;" v-clamp="clampConfig" v-text="get(desc, 'description', '-')"></div>
        </el-form-item>
        <el-form-item label="基金会">{{get(desc, 'organization', '-')}}</el-form-item>
        <el-form-item label="主要贡献者">
          <template v-if="get(desc, 'contributors', []).length">
            {{get(desc, 'contributors', []).join('、')}}
          </template>
          <template v-else>-</template>
        </el-form-item>
        <el-form-item label="许可证">
          <div style="word-break: break-all;word-wrap: break-word;white-space: pre-wrap;" v-if="get(desc, 'licenses', []).length">
            <LicenseTag  class="m-r-5 m-b-5" v-for="(item, index) in get(desc, 'licenses', [])" license :level="3"
                         :key="item + '-' + index">{{item}}</LicenseTag>
          </div>
          <template v-else>-</template>
        </el-form-item>
      </el-form>
      <oss-title>项目活跃度</oss-title>
      <el-form label-width="150px" label-position="left" class="p-l-10">
        <el-form-item label="Star">{{get(desc, 'stars', 0)}}</el-form-item>
        <el-form-item label="Fork">{{get(desc, 'forks', 0)}}</el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>
<script>

import to from '@/utils/await-to'
import { getResultInfo } from '@/api/home/assets/app/codeV4'
import LicenseTag from '@/views/home/scan/app/code/details/codeTraceability/layout/LicenseTag.vue'
export default {
  name: 'OpenSourceProjectInfoDrawer',
  components: {
    OssTitle: {
      render (h) {
        return h('div', { class: 'oss-title' }, this.$scopedSlots.default())
      }
    },
    LicenseTag
  },
  data () {
    return {
      drawer: false,
      loading: true,
      desc: {}
    }
  },
  computed: {
    clampConfig () {
      return {
        text: this.desc.description,
        clamp: 5,
        collapse: true,
        collapseBeforeSuffixHTML: '...<span class="text-primary m-l-5">展开</span><i class="el-icon-arrow-down text-primary"></i>',
        collapseAfterSuffixHTML: '<span class="text-primary m-l-5">收起</span><i class="el-icon-arrow-up text-primary"></i>'
      }
    }
  },
  methods: {
    open (row) {
      this.drawer = true
      this.desc = row
      this.getInfo(row.openProjectId)
    },

    async getInfo (id) {
      this.loading = true
      const [error, res] = await to(getResultInfo({
        loading: false,
        openProjectId: id,
        language: this.desc.language
      }))
      this.loading = false
      if (error && error.message) {
        this.desc = {}
        this.$message.error(error.message)
      } else {
        this.desc = { ...this.get(res, 'data', {}), ...this.desc }
      }
    }
  }
}

</script>
<style scoped lang="scss">
:deep(.el-drawer__header) {
  //background: #8B5CF6;
  color: #333333;
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

.oss-title {
  color: $color-primary;
  font-size: 16px;
  position: relative;
  padding-left: 10px;
  margin-bottom: 10px;

  &::before {
    content: '';
    position: absolute;
    height: 65%;
    left: 0;
    top: 2px;
    width: 3px;
    background: $color-primary;
  }
}

:deep(.el-drawer__body) {
  overflow-y: scroll;

  .el-form-item {
    margin-bottom: 5px !important;
    .el-form-item__label, .el-form-item__content {
      line-height: 25px;
    }
  }
}

.content {
  padding: 20px;
}
</style>
