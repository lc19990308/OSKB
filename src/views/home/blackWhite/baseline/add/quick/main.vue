<template>
  <div class="view-warp" >
    <line-dialog ref="line" @change="append"></line-dialog>
    <div class="compound-search-box--btn" style="margin-bottom: 20px;margin-top: 5px;text-align: center;">
      <el-select class="customize-select" style="width: 140px;" v-model="formData.packageManager" placeholder="请选择">
        <el-option v-for="item in packageManagerList" :label="item.text" :value="item.value"
                   :key="'pack' + item.value"></el-option>
      </el-select>
      <el-input class="customize-input" style="max-width: 500px;margin-right: 15px;" clearable @clear="search" :readonly="loading" @keydown.enter.native="search" placeholder="请输入搜索内容"
                v-model="formData.searchCondition">
        <el-button slot="append" :loading="loading" style="padding: 14px 20px;border: none;" @click="search" icon="el-icon-search"></el-button>
      </el-input>
      <el-tooltip effect="dark" placement="bottom">
        <el-row slot="content" style="width: 350px;">
          <p>
            搜索框内搜索关键词：可根据发布厂商、组件名、版本号模糊搜索，回车或点击搜索按钮进行搜索。
          </p>
          <p>
            1. 根据组件名称模糊匹配搜索，直接输入关键词进行搜索即可；
          </p>
          <p>
            2. 根据发布厂商、组件名称模糊匹配搜索，按照 {发布厂商}:{组件名称}格式搜索，即将发布厂商与组件名称通过冒号（：）分隔进行搜索，不区分中英文及大小写；
          </p>
          <p>
            3、根据组件名称、版本号、发布厂商模糊匹配搜索，按照{发布厂商}:{组件名称}:{版本号}格式搜索，即将发布厂商、组件名、版本号通过冒号（：）分隔进行搜索，不区分中英文及大小写。
          </p>
        </el-row>
        <icon-button
          tooltipDisabled
          style="vertical-align: middle;"
          elIcon="el-icon-question"
        ></icon-button>
      </el-tooltip>
    </div>
    <template v-if="total > 0">
      <div class="fixed-warp">
        <el-table
          class="w-full"
          ref="multipleTable"
          :data="tableData"
          v-loading="loading"
          height="calc(100vh - 335px)"
          row-key="id"
          tooltip-effect="dark"
          @selection-change="multipleSelection = $event"
        >
          <el-table-column label="发布厂商" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ get(row, 'vendor', '-') }}
            </template>
          </el-table-column>
          <el-table-column label="组件名称" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ get(row, 'name', '-') }} <span v-if="get(row, 'exists')" class="tag-append">已添加</span>
            </template>
          </el-table-column>
          <el-table-column label="选择版本基线" show-overflow-tooltip>
            <template slot="header">
              选择版本基线
              <el-tooltip effect="dark" content="默认基线版本为对应组件的无漏洞最小版本" placement="bottom">
                <i class="el-icon-question text-secondary cursor-pointer font-md"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{row}">
              <el-link type="primary" @click="$refs.line.open(row)" :underline="false">{{row.version ? row. version : '点击设置'}}</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer-wrapper  clearfix" style="padding-bottom: 10px;padding-top: 10px;">
          <pagination
            layout="total,sizes,prev,next"
            @size-change="initList"
            @current-change="initList"
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            :total="total"
            class="right"
          ></pagination>
        </div>
      </div>
    </template>
    <template v-if="total <= 0">
      <div class="text-center p-b-15">
        <svg class="icon svg-icon" aria-hidden="true" :style="{width:'80px',height: '80px'}">
          <use xlink:href="#iconkongshujuicon"></use>
        </svg>
        <p style="margin-top: 0;">{{retrievalStatus ? '未查询到相关内容' : '在搜索框输入搜索内容，查询您要添加到基线列表的组件'}}</p>
      </div>
    </template>
  </div>
</template>

<script>
import { awaitTo, isObject } from '@/utils'
import { getComponentList } from '@/api/home/blackwhite/baseline'
import optionItem from './optionItem'
import LineDialog from '@/views/home/blackWhite/baseline/LineDialog/index'

export default {
  components: { LineDialog },
  data () {
    return {
      optionItem,
      currentPage: 1,
      retrievalStatus: false,
      loading: false,
      pageSize: 20,
      total: 0,
      multipleSelection: [],
      tableData: [],
      formData: {
        packageManager: 1,
        searchCondition: undefined
      },
      packageManagerList: [
        {
          text: 'Maven（Java）',
          value: 1
        },
        {
          text: 'PyPI（Python）',
          value: 2
        },
        {
          text: 'GoMod（Go）',
          value: 3
        },
        {
          text: 'Npm（JS）',
          value: 4
        },
        {
          text: 'NuGet（C#）',
          value: 5
        },
        {
          text: 'Composer（PHP）',
          value: 6
        },
        {
          text: 'RubyGems（Ruby）',
          value: 7
        },
        {
          text: 'CocoaPods（Swift/OC）',
          value: 8
        }
      ],
      manipulatedList: []
    }
  },
  methods: {
    append () {
      this.initList()
      this.$popup({
        width: '550px',
        cancelButtonText: '返回列表页',
        content: '<p style="padding: 20px 15px">添加成功，是否继续添加？<br>点击“确定”留在此页面继续添加基线版本组件</p>',
        beforeClose: (a, cd) => {
          cd()
          if (a === 'cancel') {
            this.$router.push({ path: '/black-white/baseline/list' })
          }
        }
      })
    },
    // 搜索
    search () {
      this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
      this.manipulatedList = []
      this.currentPage = 1
      this.initList()
    },

    async initList () {
      this.loading = true
      const [error, response] = await awaitTo(getComponentList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false,
        ...this.formData
      }))
      this.tableData = []
      this.loading = false
      if (isObject(error)) {
        return this.$message.error(error.message)
      }
      this.tableData = this.get(response, 'data.records', [])
      this.total = this.get(response, 'data.total', 0)
      this.retrievalStatus = this.total === 0 && this.formData.searchCondition

      this.$nextTick(() => {
        this.$refs.multipleTable.getHostInstance().bodyWrapper.scrollTop = 0
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.e-checkbox-warp {
  padding: 12px 20px 0;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
}

.tag-append {
  color: #fff;
  background: red;
  border-radius: 10px;
  padding: 2px 7px;
  margin: 0 5px;
  line-height: normal;
  font-size: 12px;
}

.fixed-warp {
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
}

:deep(.table-footer-wrapper .btn-prev) {
  margin-right: 5px !important;
}
</style>
