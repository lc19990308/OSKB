<template>
  <div class="view-warp">
    <DetailsPopup ref="details"></DetailsPopup>
    <div class="compound-search-box--btn" style="margin-bottom: 30px;margin-top: 5px;text-align: center;">
      <el-input style="max-width: 500px;margin-right: 15px;" clearable @clear="search" :readonly="loading" @keydown.enter.native="search" placeholder="请输入许可证名/许可证全名"
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
          row-key="dicLicenseId"
          :expand-row-keys="defaultExpand"
          @selection-change="multipleSelection = $event"
          @row-click="row => rowClickExpand(row, 'defaultExpand', 'id')"
          @expand-change="expandChange"
          tooltip-effect="dark">
          <el-table-column  :selectable="handleSelectable" reserve-selection type="selection" width="55"></el-table-column>
          <el-table-column
            min-width="20%"
            label="风险等级"
            show-overflow-tooltip
          >
            <template slot-scope="{row}">
              <span class="level-tag danger" v-if="row.securityLevel === 1">高风险</span>
              <span class="level-tag warning" v-else-if="row.securityLevel === 2">中风险</span>
              <span class="level-tag info" v-else-if="row.securityLevel === 3">低风险</span>
            </template>
          </el-table-column>
          <el-table-column label="许可证名" min-width="20%" show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-link type="primary" :underline="false" @click="$refs.details.open(row.dicLicenseId)">
                {{ get(row, 'shortName', '-') }}

                <el-tag
                  v-if="typeof row.status === 'number'"
                  size="mini"
                  type="danger"
                  effect="plain">
                  {{row.status === 1 ? '黑名单' : '白名单'}}
                </el-tag>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="许可证全名" min-width="20%" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ get(row, 'longName', '-') }}
            </template>
          </el-table-column>
          <el-table-column label="是否兼容GPL" min-width="20%" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ get(row, 'gplCompatible', 0) === 1 ? '是' : '否' }}
            </template>
          </el-table-column>
        </el-table>
<!--        <div class="table-footer-wrapper clearfix" style="padding-bottom: 10px;padding-top: 10px;">-->
<!--          <pagination-->
<!--            layout="total,sizes,prev,next"-->
<!--            @size-change="initList"-->
<!--            @current-change="initList"-->
<!--            :current-page.sync="currentPage"-->
<!--            :page-size.sync="pageSize"-->
<!--            :total="total"-->
<!--            class="right"-->
<!--          ></pagination>-->
<!--        </div>-->
      </div>
    </template>
    <template v-if="total > 0">
      <div class="bottom-action-bar">
        <div class="bottom-action-bar__content">
          <span>已选择 <span class="text-primary">{{ multipleSelection.length }}</span> 个许可证</span>
          <span>
          <el-button size="medium" :disabled="!(multipleSelection.length>0)" type="primary" @click="append" class="w-80 m-r-20">
            添 加
          </el-button><el-button size="medium" @click="$router.push({ path: '/black-white/license/main/white/list' })"
                                 class="w-80">
            返 回
          </el-button>
        </span>
          <span>
             <pagination
               layout="total,sizes,prev,next"
               @size-change="initList"
               @current-change="initList"
               :current-page.sync="currentPage"
               :page-size.sync="pageSize"
               :total="total"
               class="right"
             ></pagination>
          </span>
        </div>
      </div>
    </template>
    <template v-if="total <= 0">
      <div class="text-center p-b-15">
        <svg class="icon svg-icon" aria-hidden="true" :style="{width:'80px',height: '80px'}">
          <use xlink:href="#iconkongshujuicon"></use>
        </svg>
        <p style="margin-top: 0;">
          {{retrievalStatus ? '未查询到相关内容' : '在搜索框输入相应信息，查询您要添加到黑名单的许可证'}}
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import { awaitTo, isObject, rowClickExpand } from '@/utils'
import xss from 'xss'
import { getAddLicenseBlackWhiteList, batchAddLicenseBlackWhiteList } from '@/api/home/blackwhite/licenseBlackAndWhiteList'
import DetailsPopup from '@/views/home/blackWhite/licenseBlackAndWhiteList/DetailsPopup'
export default {
  components: { DetailsPopup },
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
        searchCondition: ''
      },
      manipulatedList: []
    }
  },
  methods: {
    handleSelectable (row) {
      return typeof row.status !== 'number'
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
      const [error] = await awaitTo(batchAddLicenseBlackWhiteList({
        dicLicenseIds: this.multipleSelection.map(row => row.dicLicenseId),
        status: 2
      }))
      if (isObject(error)) return this.$message.error(error.message)
      this.$popup({
        width: '550px',
        cancelButtonText: '返回列表页',
        underline: true,
        content: '<p style="padding: 0 15px">添加成功，是否继续添加？<br>点击“确定”留在此页面继续添加许可证白名单</p>',
        beforeClose: (a, cd) => {
          cd()
          if (a === 'cancel') {
            this.$router.push({ path: '/black-white/license/main/white/list' })
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
      const [error, response] = await awaitTo(getAddLicenseBlackWhiteList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false,
        ...this.formData
      }))

      this.tableData = []
      this.loading = false
      if (error && error.message) {
        return this.$message.error(error.message)
      }
      this.tableData = this.get(response, 'data.records', [])
      this.total = this.get(response, 'data.total', 0)
      this.retrievalStatus = this.total === 0 && this.formData.searchCondition
    },
    changeMainStyle (type) {
      const gitViewMain = document.getElementById('licenseBlackAndWhiteListViewMain')
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
