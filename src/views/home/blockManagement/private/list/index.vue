<template>
  <div>
    <!--  弹窗  -->
    <AddLabelPopup :tagList="tagList" @change="[getTagList(), initList()]" ref="addLabel"></AddLabelPopup>
    <DetailsPopup ref="detail"></DetailsPopup>
    <!--  弹窗end  -->
    <el-alert type="primary" class="header-alert">
      <div class="alert-content">
        <i class="el-icon-info" style="margin-right: 3px;"></i>
        <span style="color: #333;">记录所有阻断事件，您可以在阻断规则中修改规则。阻断记录保留{{retention}}天。</span>
      </div>
    </el-alert>
    <div v-loading="loading">
      <ModuleQueryBox ref="query" :tagList="tagList" v-model="searchData" @change="search"></ModuleQueryBox>
      <sticky
        :sticky-top="65"
        :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'"
      >
        <div class="clearfix">
          <el-button
            size="medium"
            type="primary"
            @click="exportFile"
            v-if="authorityFilter(3533)"
          >导出
          </el-button>
          <el-dropdown
            trigger="click"
          >
            <el-button size="medium" type="primary">
              批量管理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="batchDel(multipleSelection.map(item => item.id))">删除记录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </sticky>
      <el-table
        class="w-full"
        ref="multipleTable"
        :data="tableData"
        row-key="id"
        tooltip-effect="dark"
        @selection-change="multipleSelection = $event"
        :dynamic-options.sync="tableOptions"
      >
        <el-table-column reserve-selection type="selection" width="55"></el-table-column>
        <el-table-column
          width="150px"
          label="阻断时间"
          prop="vendor"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{get(row, 'createdTime', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="180px"
          label="请求IP"
          prop="vendor"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <div class="flex" style="flex-wrap: wrap;">
              <span class="m-r-5">{{get(row, 'requestIP')}}</span>
              <div class="ip-tag" :style="getTagColors(item.color || '#1E88E5')" v-for="item in get(row, 'tags', [])" :key="item.id">
                {{item.value}}
                <div class="conf-group" v-if="authorityFilter(3531)">
                  <i class="el-icon-edit" @click="$refs.addLabel.open(row,item)"></i>
                  <i class="el-icon-close" @click="delLabel(item)"></i>
                </div>
              </div>
              <i v-if="authorityFilter(3531)" class="iconfont icontianjiabiaoqian-03" @click="$refs.addLabel.open(row)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150px"
          label="阻断代理"
          prop="vendor"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{get(row,'agentName','-')}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="100px"
          label="仓库名称"
          prop="vendor"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{get(row, 'upstreamAlias', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="150px"
          label="仓库地址"
          prop="vendor"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{get(row, 'upstream', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="100px"
          label="组件名称"
          prop="vendor"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{get(row, 'componentName', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="100px"
          label="组件版本"
          prop="vendor"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            {{get(row, 'componentVersion', '-')}}
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          label="漏洞"
          prop="vul_total"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <level-group  :value="[
              get(row, 'vulNum.serious',0),
              get(row, 'vulNum.high',0),
              get(row, 'vulNum.medium',0),
              get(row, 'vulNum.low',0),]">
            </level-group>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100px"
          label="组件许可证"
          prop="vendor"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <el-tag size="mini" v-if="get(row, 'componentLicense')">{{get(row, 'componentLicense')}}</el-tag>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column
          width="150px"
          label="阻断原因"
          prop="vendor"
        >
          <template slot-scope="{row}">
            <template v-if="get(row, 'hitRegular.componentBlacklist')" >
              组件黑名单规则<br>
            </template>
            <template v-if="get(row, 'hitRegular.vulnerabilityBlacklist')">
              漏洞黑名单规则<br>
            </template>
            <template v-if="get(row, 'hitRegular.componentBaseline')" >
              组件版本基线规则<br>
            </template>
            <template v-if="get(row, 'hitRegular.cves')" >
              漏洞编号<br>
            </template>
            <template v-if="get(row, 'hitRegular.vulnerabilitySerious') || get(row, 'hitRegular.vulnerabilityHigh') || get(row, 'hitRegular.vulnerabilityMedium') || get(row, 'hitRegular.vulnerabilityLow')">
              漏洞等级<br>
            </template>
            <template v-if="get(row, 'hitRegular.licenses', []).length" >
              许可证<br>
            </template>
            <template v-if="get(row, 'hitRegular.licenseHigh') || get(row, 'hitRegular.licenseMedium') || get(row, 'hitRegular.licenseLow')">
              许可证等级
            </template>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100px"
          label="处理方式"
          prop="vendor"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <el-tag size="mini">
              {{get(row, 'regular.handlers[0]', 0) === 1 ? '阻断' : '未知'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="150px"
          label="操作"
          fixed="right"
          prop="vendor"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <icon-button tooltip-content="查看详情" @click="$refs.detail.open(row)" class="iconxiangqing" ></icon-button>
            <el-popconfirm
              placement="bottom-end"
              @confirm="del([row.id])"
              title="删除操作不可恢复。确定继续？"
            >
              <icon-button
                slot="reference"
                tooltip-content="删除"
                class="icondel"
              ></icon-button>
            </el-popconfirm>
<!--            <el-popconfirm-->
<!--              placement="bottom-end"-->
<!--              @confirm="joinHandle(row.id)"-->
<!--              title="您确定要加入组件白名单列表？"-->
<!--            >-->
<!--              <icon-button slot="reference" tooltip-content="点击加入白名单" class="icona-tianjiabaimingdan1" ></icon-button>-->
<!--            </el-popconfirm>-->
<!--            <el-popconfirm-->
<!--              placement="bottom-end"-->
<!--              @confirm="cancelWhitelist(row.id)"-->
<!--              title="您确定从白名单列表中取消？"-->
<!--            >-->
<!--              <icon-button slot="reference" tooltip-content="点击取消白名单" class="iconquxiaotianjiabaimingdan" ></icon-button>-->
<!--            </el-popconfirm>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer-wrapper clearfix">
        <pagination
          @size-change="initList"
          @current-change="initList"
          :current-page.sync="searchData.pageNum"
          :page-size.sync="searchData.pageSize"
          :total="total"
          class="right"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleQueryBox from './ModuleQueryBox'
import { PAGE_CONF } from '@/utils/conf'
import AddLabelPopup from '@/views/home/blockManagement/private/list/AddLabelPopup'
import DetailsPopup from '@/views/home/blockManagement/private/list/DetailsPopup'
import chroma from 'chroma-js'
import {
  getLogsApi,
  getTagsApi,
  delTagsApi,
  getLogsExcel,
  delLogs,
  joinWhitelist,
  cancelWhitelist,
  getLogsRetentionApi
} from '@/api/home/blockManagement/private'
import { createStrSuffix, get, to } from '@/utils'

export default {
  name: 'blockManagement-private-list',
  components: { DetailsPopup, AddLabelPopup, ModuleQueryBox },
  data () {
    return {
      tableOptions: {
        to: '操作',
        uuid: 'blockManagement-private-list',
        columns: [
          {
            label: '阻断时间',
            checked: true,
            disabled: true
          },
          {
            label: '请求IP',
            checked: true,
            disabled: true
          },
          {
            label: '阻断代理',
            checked: false,
            disabled: false
          },
          {
            label: '仓库名称',
            checked: true,
            disabled: false
          },
          {
            label: '仓库地址',
            checked: true,
            disabled: false
          },
          {
            label: '组件名称',
            checked: true,
            disabled: false
          },
          {
            label: '组件版本',
            checked: false,
            disabled: false
          },
          {
            label: '漏洞',
            checked: true,
            disabled: false
          },
          {
            label: '组件许可证',
            checked: true,
            disabled: false
          },
          {
            label: '阻断原因',
            checked: true,
            disabled: false
          },
          {
            label: '处理方式',
            checked: true,
            disabled: false
          },
          {
            label: '操作',
            checked: true,
            disabled: true
          }
        ]
      },
      loading: false,
      searchData: {
        pageNum: 1,
        pageSize: PAGE_CONF.pageSize,
        sortFieldList: [],
        sortTypeList: []
      },
      tagList: [],
      total: 0,
      tableData: [],
      multipleSelection: [],
      retention: 0
    }
  },
  methods: {
    createStrSuffix,
    async delLabel (tag) {
      const [error, response] = await to(delTagsApi(tag.id))
      if (response) {
        this.$message.success('操作成功')
        this.initList()
        this.getTagList()
      } else if (error && error.message) {
        this.$message.error(error.message)
      }
    },
    batchDel (ids) {
      this.$popup({
        width: '550px',
        underline: true,
        render (h) {
          return h('p', { style: { padding: '0 25px' } },
            ids.length ? '确定删除选中的记录吗，删除操作不可恢复？'
              : '确定删除所有的记录吗？删除操作不可恢复')
        },
        beforeClose: async (a, c) => {
          if (a === 'confirm') {
            await this.del(ids)
          }
          c()
        }
      })
    },
    async del (ids) {
      const [error, response] = await to(delLogs({ idList: ids }))
      if (response) {
        this.$message.success('操作成功')
        ids.length ? this.initList() : this.search()
        this.$refs.multipleTable.clearSelection()
      } else if (error && error.message) {
        this.$message.error(error.message)
      }
    },
    // 搜索
    search () {
      this.$refs.multipleTable.clearSelection()
      this.searchData.pageNum = 1
      this.initList()
    },
    async initList (auto) {
      if (!this.authorityFilter(3532)) return

      clearTimeout(this.timeout)
      this.timeout = null

      if (auto !== 'auto') {
        this.loading = true
      } else if (this.multipleSelection.length) {
        this.timeout = setTimeout(this.initList, 10000, 'auto')
        return
      }

      const [error, response] = await to(getLogsApi({ ...this.searchData, loading: false }))
      this.loading = false
      if (response) {
        this.tableData = this.get(response, ['data', 'records'], [])
        this.total = this.get(response, ['data', 'total'], 0)
        this.timeout = setTimeout(this.initList, 10000, 'auto')
      } else {
        error.message && this.$message.error(error.message)
      }
    },
    async cancelWhitelist (id) {
      const [error] = await to(cancelWhitelist(id))
      if (error && error.message) {
        this.$message.error(error.message)
      } else {
        this.$message.success('操作成功')
      }
    },
    async joinHandle (id) {
      const [error] = await to(joinWhitelist(id))
      if (error && error.message) {
        this.$message.error(error.message)
      } else {
        this.$message.success('操作成功')
      }
    },
    getTagColors (userColor) {
      return {
        background: chroma(userColor).alpha(0.2).hex(),
        color: userColor
      }
    },
    exportFile () {
      this.$popup({
        title: '提示',
        width: '600px',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        underline: true,
        render (h) {
          return h('el-row', {
            class: 'font-base text-center'
          }, [
            h('i', { class: 'el-icon-info m-r-5 text-primary' }),
            '导出所有阻断记录，是否继续导出？'
          ])
        },
        beforeClose: async (action, next) => {
          if (action === 'confirm') {
            const [error] = await to(getLogsExcel())
            if (error && error.message) {
              this.$message.error(error.message)
            } else {
              setTimeout(() => this.$popup({
                title: '提示',
                width: '550px',
                confirmButtonText: '去下载',
                cancelButtonText: '留在本页',
                underline: true,
                center: false,
                render (h) {
                  return h('el-row', {
                    class: 'font-base text-center'
                  }, [
                    h('div', { class: 'm-b-15' }, ['操作成功，请在报告管理中下载报告~'])
                  ])
                },
                beforeClose: (action, next) => {
                  if (action === 'confirm') {
                    this.$router.push({ path: '/report/list' })
                  }
                  next()
                }
              }), 200)
            }
          }
          next()
        }
      })
    },
    getTagList () {
      getTagsApi({ loading: false }).then(res => {
        this.tagList = get(res, 'data', [])
      })
    }
  },
  destroyed () {
    clearTimeout(this.timeout)
  },
  created () {
    this.getTagList()
    getLogsRetentionApi().then(res => {
      this.retention = get(res, 'data', 0)
    })
  }
}
</script>

<style scoped lang="scss">
.header-alert {
  position: relative;
  margin-bottom: 20px;
  padding-left: 12px !important;
  padding-right: 12px !important;

  :deep(.el-alert__content) {
    padding: 0;
  }

  :deep(.alert-content) {
    margin-bottom: 5px;
    padding: 0;

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  :deep(.el-alert__closebtn) {
    font-size: 18px;
    color: #999;
    font-weight: bold;
    top: 14px;
    &:hover {
      color: lighten(#999, 10%);
    }
  }
}

.icontianjiabiaoqian-03 {
  opacity: 0;
  font-size: 18px;
  vertical-align: bottom;
}

:deep(.el-table__row) {
  &:hover .icontianjiabiaoqian-03{
    color: $color-primary;
    cursor: pointer;
    opacity: 1;
  }
}

.ip-tag {
  color: #1E88E5;
  font-size: 12px;
  line-height: normal;
  text-align: center;
  display: inline-block;
  border-radius: 12px;
  background: #E1F0FF;
  padding: 4px 10px;
  cursor: pointer;
  margin-right: 3px;
  position: relative;
  overflow: hidden;

  .conf-group {
    transition: top 0.2s;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFFFFF;
    font-size: 14px;
    background-color: rgba(0,0,0,0.6);
    left: 0;
    top: -50px;
    .el-icon-close {
      font-size: 12px;
      transform: scale(0.7);
      //color: $color-danger;
      right: 2px;
      top: 1px;
      font-weight: bold;
      position: absolute;
      &:hover {
        color: red;
      }
    }
  }

  &:hover {
  .conf-group{
      top: 0;
    }
  }
}
</style>
