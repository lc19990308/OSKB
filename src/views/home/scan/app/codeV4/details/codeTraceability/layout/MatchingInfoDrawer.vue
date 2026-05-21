<template>
  <el-drawer
    title="匹配信息"
    append-to-body
    modal-append-to-body
    size="1200px"
    :visible.sync="drawer">
    <CodeMatchingInfoDrawer @change="init" :table-data="tableData" ref="codeMatchingInfoDrawer"></CodeMatchingInfoDrawer>
    <MaskOpenDialog @change="init" ref="MaskOpenDialog"></MaskOpenDialog>
    <el-row class="content">
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
      <div class="m-b-15 flex between">
        <el-dropdown
          trigger="click"
          :disabled="!multipleSelection.length"
        >
          <el-button :disabled="!multipleSelection.length" size="medium" type="primary">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$refs.MaskOpenDialog.open(multipleSelection, baseInfo)">标记开源</el-dropdown-item>
            <el-dropdown-item @click.native="markSelfResearch(multipleSelection)">标记自研</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="text-right">
          <div class="inline-block m-r-20">
            <span
              v-for="(item, index) in [
                {
                  text: '全部',
                  type: undefined,
                  value: '',
                  field: 'sum'
                },...statusList]"
              @click="() => { searchData.signStatus = item.value; search() }"
              :key="index"
              class="m-r-10 btn-select-status"
              :class="searchData.signStatus === item.value ? 'active' : ''"
            >
              <oss-dot
                v-if="item.type"
                plain
                :type="item.type"
              >
               {{ item.text }}
              </oss-dot>
              <template v-else>
                {{ item.text }}
              </template>
            </span>
          </div>

          <oss-button-search
            placeholder="请输入检测路径"
            @search="search"
            style="width: 315px;"
            size="medium"
            v-model="searchData.sourceProjectName">
        </oss-button-search>
        </div>
      </div>
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        @filter-change="searchFilter"
        row-key="homologyFileMatchProjectFileResultId"
        @selection-change="multipleSelection = $event"
        @sort-change="searchSort">
        <el-table-column reserve-selection type="selection" width="55"></el-table-column>
        <el-table-column
          label="应用文件检测路径"
          prop="fullName"
          min-width="20%">
          <template slot-scope="{row, $index}">
            <el-link type="primary" style="line-height: 18px;" @click="$refs.codeMatchingInfoDrawer.open($index, baseInfo, row)" :underline="false">
              {{get(row, 'sourceFilePath', '-')}}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="匹配开源项目文件路径"
          prop="version"
          min-width="20%">
          <template slot-scope="{row}">
            <div style="line-height: 18px;" >{{get(row, 'openFilePath', '-')}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="语言"
          prop="language"
          min-width="15%"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{get(row, 'language', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="info.matchType === 0"
          label="相似度(%)"
          prop="source"
          width="150"
          show-overflow-tooltip>
<!--          <template #header>-->
<!--            <similarity-slider-popover v-model="searchData.similarity" @filter="search"></similarity-slider-popover>-->
<!--          </template>-->
          <template slot-scope="{row}">
            {{get(row, 'similarityPercentage', 0)}}%
          </template>
        </el-table-column>
        <el-table-column
          v-else
          label="匹配代码行"
          prop="similarityCode"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="{row}">
            {{ disposeSimilarityCode(row.similarityCode) }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="license"
          width="150"
          show-overflow-tooltip>
          <template #header>
            <oss-table-filter
              :default-props="{label: 'text', value: 'value' }"
              v-model="searchData.signStatus"
              :filters="statusList"
              @change="search"
              title="状态"
            />
          </template>
          <template slot-scope="{row}">
            <oss-dot v-if="get(row, 'signStatus') === 1" type="success" plain>标记开源</oss-dot>
            <oss-dot v-else-if="get(row, 'signStatus') === 0" type="warning" plain>标记自研</oss-dot>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" fixed="right"
          width="170px">
          <template slot-scope="{row}">
            <span
              class="handle-btn"
              v-if="get(row, 'signStatus') === 0"
              @click="() => $refs.MaskOpenDialog.open(row, baseInfo)"
            >标记开源
            </span>
            <el-popconfirm
              v-else
              confirm-button-text='确定'
              cancel-button-text='取消'
              placement="top"
              icon="el-icon-info"
              @confirm="submitMarkSelfResearch(row)"
              title="确定要将匹配的代码标记为自研吗？"
            >
                <span
                  class="handle-btn"
                  slot="reference"
                >标记自研</span>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer-wrapper clearfix">
        <pagination
          small
          :background="false"
          @size-change="initList"
          @current-change="initList"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :layout="'total, prev, pager, next, jumper'"
          :total="total"
          class="right"
          :prev-text="''"
          :next-text="''"
        >
        </pagination>
      </div>
    </el-row>
  </el-drawer>
</template>
<script>

import { PAGE_CONF } from '@/utils/conf'
import CodeMatchingInfoDrawer from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/CodeMatchingInfoDrawer'
import { getMatchResult, getOpenProjectInfo, updateSign } from '@/api/home/assets/app/codeV4'
import { awaitTo as to, isArray, isString } from '@/utils'
import MaskOpenDialog from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/MaskOpenDialog'
import LicenseTag from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/LicenseTag.vue'
import bus from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/event'
// import SimilaritySliderPopover from '@/views/home/scan/app/codeV4/details/codeTraceability/layout/SimilaritySliderPopover'

export default {
  name: 'MatchingInfoDrawer',
  components: {
    // SimilaritySliderPopover,
    MaskOpenDialog,
    CodeMatchingInfoDrawer,
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
      drawer: false,
      baseInfo: {},
      desc: {},
      tableData: [
        {
          fullName: '/WebGoat-8.0.0.M25/lib/mockito-core-1.10.19.\n' +
            'jar/org/mockito/ArgumentCaptor.java',
          version: '/WebGoat-8.0.0.M25/lib/mockito-core-1.10.19.\n' +
            'jar/org/mockito/ArgumentCaptor.java',
          source: 'GitHub',
          license: 'GPL3.0',
          fileNum: 10,
          language: 'Java,Python,PHP'
        }
      ],
      currentPage: 1,
      loading: false,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      similarityVisible: false,
      searchData: {
        signStatus: '',
        similarity: [0, 0],
        sourceProjectName: undefined,
        openProjectId: undefined,
        codeLines: undefined,
        language: undefined
      },
      searchText: '',
      multipleSelection: [],
      statusList: [
        {
          text: '标记开源',
          type: 'success',
          value: 1,
          field: 'openSign'
        },
        {
          text: '标记自研',
          type: 'warning',
          value: 0,
          field: 'selfSign'
        }
      ]
    }
  },
  computed: {
    info () {
      let row = decodeURIComponent(this.$route.query?.row)
      if (row) {
        row = JSON.parse(row)
      }
      return row
    }
  },
  methods: {
    isArray,
    isString,
    // 处理匹配代码行字段
    disposeSimilarityCode (v) {
      return Array.isArray(v) && v.length ? v.reduce((prev, cur, i, arr) => prev + JSON.stringify(cur) + ((i + 1 < arr.length) ? ',' : ''), '') : '-'
    },

    init () {
      this.$refs.multipleTable.clearSelection()
      this.initList()
    },
    markSelfResearch (row) {
      this.$popup({
        title: '提示',
        width: '500px',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: false,
        content: '确定要将匹配的代码标记为自研吗？',
        beforeClose: async (action, close) => {
          if (action === 'confirm') {
            await this.submitMarkSelfResearch(row)
            this.$refs.multipleTable.clearSelection()
          }
          close()
        }
      })
    },

    async submitMarkSelfResearch (row) {
      const [err] = await to(updateSign({
        signStatus: 0,
        sourceFileIdList: isArray(row) ? row.map(item => item.sourceFileId) : [row.sourceFileId],
        taskId: this.$route.query.taskId
      }))
      if (err && err.message) {
        this.$message.error(err.message)
      } else {
        this.$message.success('操作成功')
        this.initList()
        bus.$emit('markChange')
      }
    },

    open (row, { codeLines, similarityPerStart, similarityPerEnd }) {
      this.searchData.openProjectId = row.openProjectId
      this.searchData.sourceProjectName = row.sourceFilePath
      this.searchData.language = row.language
      this.searchData.similarityPerStart = similarityPerStart
      this.searchData.similarityPerEnd = similarityPerEnd
      this.searchData.codeLines = codeLines
      this.search()
      this.getBaseInfo()
      this.drawer = true
    },

    async getBaseInfo () {
      const [err, res] = await to(getOpenProjectInfo({
        openProjectId: this.searchData.openProjectId,
        language: this.searchData.language
      }))

      if (err && err.message) return this.$message.error(err.message)
      this.baseInfo = res.data
    },
    async initList () {
      this.loading = true
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        taskId: this.$route.query.taskId,
        ...this.searchData,
        loading: false
      }
      if (!(this.searchData.similarity[0] === 0 && this.searchData.similarity[1] === 0)) {
        params.similarityPercentageLeastValue = this.searchData.similarity[0]
        params.similarityPercentageMaxValue = this.searchData.similarity[1]
      }
      delete params.similarity
      const [err, res] = await to(getMatchResult(params))
      this.loading = false
      if (err && err.message) {
        this.$message.error(err.message)
      } else {
        this.tableData = this.get(res, 'data.records', [])
        this.total = this.get(res, 'data.total', 0)
      }
    },
    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = undefined
        this.searchData.sortTypeList = undefined
      }
      this.search()
    },

    searchFilter (filers) {
      for (const x in filers) {
        if (Array.isArray(filers[x])) {
          this.searchData[x] = filers[x][0]
        }
      }
      this.search()
    },

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    }
  }
}

</script>
<style scoped lang="scss">
:deep(.el-drawer__header) {
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

.btn-select-status {
  cursor: pointer;
  color: #666666;
  transition: all 0.1s;
  display: inline-block;
  padding: 4px 8px;
  &.active,&:hover {
    color: #333333;
    border-radius: 1px;
    background: #f3f6f9;
  }
}

.content {
  padding: 20px;
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
}

.iconloudou:hover {
  color: $color-primary;
}

:deep(.el-slider__marks-text) {
  color: #666666;
}

.handle-btn {
  color: $color-primary;
  padding: 0 5px;
  cursor: pointer;
  user-select: none;
}
</style>
