<template>
  <div class="view-warp">
    <div class="compound-search-box--btn" style="margin-bottom: 20px;margin-top: 5px;text-align: center;">
      <el-select class="customize-select" style="width: 140px;" v-model="formData.searchConditionKey" placeholder="请选择">
        <el-option v-for="item in searchTypeOptions" :label="item.label" :value="item.value"
                   :key="'pack' + item.value"></el-option>
      </el-select>
      <el-input class="customize-input" style="max-width: 500px;margin-right: 15px;" clearable @clear="search" :readonly="loading" @keydown.enter.native="search" placeholder="请输入搜索内容"
                v-model="formData.searchCondition">
        <el-button slot="append" type="primary" style="padding: 14px 20px;border: none;" :loading="loading" @click="search" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <template v-if="total > 0">
      <div class="fixed-warp">
        <el-table
          class="w-full cursor-pointer"
          ref="multipleTable"
          :data="tableData"
          v-loading="loading"
          row-key="id"
          :expand-row-keys="defaultExpand"
          @selection-change="multipleSelection = $event"
          @row-click="row => rowClickExpand(row, 'defaultExpand', 'id')"
          @expand-change="expandChange"
          tooltip-effect="dark">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row class="table-expand">
                <el-col tag="p" :span="24">
                  <div class="title warning">漏洞类型：</div>
                  <div class="content">{{ scope.row.vulType || "其他" }}</div>
                </el-col>
                <el-col tag="p" :span="24">
                  <div class="title primary">利用难度：</div>
                  <div class="content">
                    {{ scope.row.exploit === 0 ? "困难" : "" }}
                    {{ scope.row.exploit === 1 ? "容易" : "" }}
                  </div>
                </el-col>
                <el-col tag="p" :span="24">
                  <div class="title danger">漏洞描述：</div>
                  <div class="content">
                    <pre style="margin: 0;">{{ scope.row.description || "-" }}</pre>
                  </div>
                </el-col>
                <el-col tag="p" :span="24">
                  <div class="title primary">修复建议：</div>
                  <div class="content">
                    <pre style="margin: 0;">{{ scope.row.suggestion || "-" }}</pre>
                  </div>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column  :selectable="handleSelectable" reserve-selection type="selection" width="55"></el-table-column>
          <el-table-column
            min-width="10%"
            label="风险等级"
            prop="securityLevel"
            show-overflow-tooltip>
            <template slot-scope="{ row }">
                 <level-tag :level="row.security" style="margin-right: 10px;" v-if="row.security"></level-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="XMIRROR"
            min-width="15%"
            prop="xmirrorId"
            show-overflow-tooltip>
            <template slot-scope="{row}">
              <span v-html="xss(row.xmirror)"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="CVE"
            min-width="15%"
            prop="cveId"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="xss(scope.row.cve)"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="CNNVD"
            min-width="15%"
            prop="cnnvdId"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="xss(scope.row.cnnvd)"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="CNVD"
            min-width="15%"
            prop="cnnvdId"
            show-overflow-tooltip>
            <template slot-scope="{row}">
              {{row.cnvd ? row.cnvd : '-'}}
            </template>
          </el-table-column>
          <el-table-column
            label="CWE"
            min-width="15%"
            prop="cwe"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="xss(scope.row.cwe) || '其他'"></span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="30%"
            label="漏洞名称"
            prop="securityLevel"
            show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span v-if="get(row, 'exists')" class="tag-append">{{row.status === 1 ? '黑名单' : '白名单'}}</span>
              <span v-html="xss(row.name)"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="发布时间"
            min-width="15%"
            show-overflow-tooltip>
            <template slot-scope="{ row }">
              {{get(row, 'releaseDate', '-')}}
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer-wrapper clearfix" style="padding-bottom: 10px;padding-top: 10px;">
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
    <template v-if="total > 0">
      <div class="bottom-action-bar">
        <div class="bottom-action-bar__content">
          <span>已选择 <span class="text-primary">{{ multipleSelection.length }}</span> 个漏洞</span>
          <span>
          <el-button size="medium" :disabled="!(multipleSelection.length>0)" type="primary" @click="append" class="w-80 m-r-20">
            添 加
          </el-button><el-button size="medium" @click="$router.push({ path: '/black-white/loophole/main/black/list' })"
                                 class="w-80">
            返 回
          </el-button>
        </span>
          <span></span>
        </div>
      </div>
    </template>
    <template v-if="total <= 0">
      <div class="text-center p-b-15">
        <svg class="icon svg-icon" aria-hidden="true" :style="{width:'80px',height: '80px'}">
          <use xlink:href="#iconkongshujuicon"></use>
        </svg>
        <p style="margin-top: 0;">
          {{retrievalStatus ? '未查询到相关内容' : '在搜索框输入相应信息，查询您要添加到黑名单的漏洞'}}
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import { awaitTo, isObject, rowClickExpand } from '@/utils'
import { getVulList, VulAppendBatch } from '@/api/home/blackwhite/loophole'
import xss from 'xss'
export default {
  data () {
    return {
      retrievalStatus: false,
      currentPage: 1,
      loading: false,
      pageSize: 10,
      total: 0,
      defaultExpand: [],
      multipleSelection: [],
      tableData: [],
      formData: {
        searchConditionKey: 1,
        searchCondition: undefined
      },
      searchTypeOptions: [
        {
          value: 4,
          label: 'XMIRROR编号'
        },
        {
          value: 1,
          label: 'CVE编号'
        },
        {
          value: 2,
          label: 'CNNVD编号'
        },
        {
          value: 3,
          label: 'CNVD编号'
        },
        {
          value: 5,
          label: '漏洞名称'
        }
      ],
      manipulatedList: []
    }
  },
  methods: {
    handleSelectable (row) {
      return !row.exists
    },
    xss,
    rowClickExpand,
    expandChange (row, arr) {
      if (arr.indexOf(row) !== -1) {
        this.defaultExpand = [row.id]
      } else {
        this.defaultExpand = []
      }
    },
    async append () {
      const [error] = await awaitTo(VulAppendBatch({
        xmirrors: this.multipleSelection.map(row => row.xmirror),
        status: 1
      }))
      if (isObject(error)) return this.$message.error(error.message)
      this.$popup({
        width: '550px',
        cancelButtonText: '返回列表页',
        content: '<p style="padding: 20px 15px">添加成功，是否继续添加？<br>点击“确定”留在此页面继续添加黑名单漏洞</p>',
        beforeClose: (a, cd) => {
          cd()
          if (a === 'cancel') {
            this.$router.push({ path: '/black-white/loophole/main/black/list' })
          } else {
            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
            this.formData = {
              searchConditionKey: 1,
              searchCondition: undefined
            }
            this.tableData = []
            this.total = 0
          }
        }
      })
    },

    // 搜索
    search () {
      this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
      this.currentPage = 1
      this.initList()
    },

    async initList () {
      this.loading = true
      const [error, response] = await awaitTo(getVulList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false,
        ...this.formData,
        status: 1
      }))
      this.tableData = []
      this.loading = false
      if (isObject(error)) {
        return this.$message.error(error.message)
      }
      this.tableData = this.get(response, 'data.records', [])
      this.total = this.get(response, 'data.total', 0)
      this.retrievalStatus = this.total === 0 && this.formData.searchCondition
    },
    changeMainStyle (type) {
      const gitViewMain = document.getElementById('loopholeViewMain')
      gitViewMain && (gitViewMain.style.paddingBottom = type === 'beforeDestroy' ? '20px' : '0')
    }
  },
  beforeDestroy () {
    this.changeMainStyle('beforeDestroy')
  },
  mounted () {
    this.changeMainStyle('mounted')
  }
}
</script>
<style lang="scss" scoped>
.bottom-action-bar__content {
  max-width: 1460px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
}

.e-checkbox-warp {
  padding: 15px 20px 5px 22px;
  width: 100%;
  z-index: 1;
  background: #fff;
  position: absolute;
  left: 0;
  box-sizing: border-box;
  top: 0;
}

.tag-append {
  color: #fff;
  background: red;
  border-radius: 10px;
  padding: 2px 7px;
  margin-right: 5px;
  line-height: normal;
  font-size: 12px;
}

.select-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fixed-warp {
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 320px);
  max-width: 1460px;
  margin: 0 auto;
  padding: 0 20px;
}

.bottom-action-bar {
  height: 60px;
  border: 0 solid rgb(227, 233, 241);
  box-shadow: 0 0 8px 0 rgba(0, 75, 144, 9%);
  position: sticky;
  z-index: 99;
  bottom: 0;
  background: #fff;
  width: 100%;
}
</style>
