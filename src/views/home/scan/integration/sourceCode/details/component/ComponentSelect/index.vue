<template>
  <div>
    <div class="clearfix">
      <search-area style="width: 85%;float: left;display: block;" placeholder="请输入搜索关键词" @search="search"
                   v-model="formData.name"></search-area>
      <el-tooltip effect="dark" placement="right">
        <div slot="content" style="width: 300px;">
          <p> 搜索框内搜索关键词：可根据发布厂商、组件名、版本号模糊搜索，回车或点击搜索按钮进行搜索。</p>
          <p>1. 根据组件名称模糊匹配搜索，直接输入关键词进行搜索即可；</p>
          <p> 2. 根据组件名称、版本号模糊匹配搜索，按照 {组件名称}:{版本号}格式搜索，即将组件名称与版本号通过冒号（：）分隔进行搜索，不区分中英文及大小写；</p>
          <p>3、根据组件名称、版本号、发布厂商模糊匹配搜索，按照{发布厂商}:{组件名称}:{版本号}格式搜索，即将发布厂商、组件名、版本号通过冒号（：）分隔进行搜索，不区分中英文及大小写。</p>
        </div>
        <el-button class="right" style="padding: 10px 9px 6.5px;" size="medium" plain>
          <i style="font-size: 18px;" class="el-icon-warning-outline"></i>
        </el-button>
      </el-tooltip>
    </div>
    <div class="component-opt clearfix">
      <el-select v-model="formData.securityLevelList" multiple placeholder="请选择风险等级" clearable @change="search"
                 size="medium" style="width: 50%;margin-right: 2px;">
        <el-option
          v-for="(item) in levelOptions"
          :key="item.value + 'levelOptions'"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="formData.parseDeep" placeholder="解析深度" clearable @change="search" size="medium"
                 style="width: 34%;">
        <el-option
          v-for="(item, index) in tierNum"
          :key="index"
          :label="index + ' 层'"
          :value="index">
        </el-option>
      </el-select>
      <el-popover
        placement="bottom-end"
        width="305"
        v-model="popoverVisible"
        trigger="click">
        <el-form status-icon label-width="120px" class="p-t-10 p-r-10 p-l-10" label-position="left">
          <el-form-item style="margin-bottom: 15px;" label="组件依赖：">
            <el-select v-model="formData.dependencyType" placeholder="请选择" clearable size="medium">
              <el-option label="直接依赖" :value="0"></el-option>
              <el-option label="间接依赖" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否实际引入：">
            <el-select v-model="formData.realInUse" placeholder="请选择" clearable size="medium">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="筛选漏洞黑名单组件：" label-width="170px" style="text-align: right;">
            <el-switch :active-value="1" :inactive-value="0" v-model="formData.isBlackVulComponent"></el-switch>
          </el-form-item>
          <el-form-item label="筛选不符合基线版本组件：" label-width="180px" style="text-align: right;">
            <el-switch :active-value="1" :inactive-value="0" v-model="formData.isOverComponentBaseLine"></el-switch>
          </el-form-item>
          <el-row style="text-align: center;border-top: 1px solid #dcdee0;padding-top: 13px;">
            <el-button size="medium" type="primary" @click="search(), popoverVisible = false" style="width: 80px;">确定
            </el-button>
            <el-button size="medium" plain @click="resetForm" style="width: 80px;">重置</el-button>
          </el-row>
        </el-form>
        <el-tooltip slot="reference" effect="dark" content="更多筛选" placement="top">
          <el-button class="right" style="padding: 10px 11px 7px;" size="medium" plain>
            <i style="font-size: 14px;" class="iconfont icongengduoshaixuan"></i>
          </el-button>
        </el-tooltip>
      </el-popover>
    </div>
    <list-group class="component-list scrollbar-custom" v-loading="loading">
      <list-item
        v-for="(row,index) in tableData"
        :key="index"
        :active="active !== undefined && active === row.dicComponentId"
        @click="selectComponent(row)"
      >
        <div class="flex items-center m-b-5">
          <span class="name">{{ row.name }}</span>
          <span class="version">
            <i class="iconfont iconfengefu" style="vertical-align: middle;" v-if="row.version"></i>
            {{ row.version }}
          </span>
          <span class="change-tag" v-if="isNumber(row.oldSecurityLevelId) && row.oldSecurityLevelId !==
          row.securityLevelId">
            <el-tooltip effect="dark"
                        :content="`${matching(levelOptions, row.oldSecurityLevelId, 'value', 'text')} => ${matching(levelOptions, row.securityLevelId, 'value', 'text')}`"
                        placement="top">
              <el-tag class="tag-info" size="mini" type="info">更改</el-tag>
            </el-tooltip>
          </span>
        </div>
        <div>
          <level-group
            class="m-r-10"
            style="display: inline-flex;"
            :value="[
                     row.vulNumVO.serious || 0,
                     row.vulNumVO.high || 0,
                     row.vulNumVO.medium || 0,
                     row.vulNumVO.low || 0
                     ]"/>
          <el-tag v-if="[3,4].includes(row.status)" class="tag-info m-r-10" size="mini" type="info">
            {{row.status === 3 ? '黑名单' : '白名单'}}
          </el-tag>

          <!--          <el-tag class="tag-info" size="mini" type="info">{{row.parseDeep || 0}}层</el-tag>-->
        </div>
      </list-item>
      <list-item v-if="tableData.length === 0" class="text-center">
        <i class="iconfont iconkong left-icon"></i>暂无数据
      </list-item>
      <list-item style="border-bottom: none" class="list-footer">
        <pagination
          small
          @size-change="initList"
          @current-change="initList"
          :current-page.sync="currentPage"
          :layout="'prev, slot, next'"
          :page-size.sync="pageSize"
          :prev-text="''"
          :next-text="''"
          :total="total"
        >
          <el-input
            v-model.number="currentPage"
            @blur="initList"
            class="el-pagination__editor is-in-pagination"
            type="number" autocomplete="off" min="1" max="4"
          ></el-input>
        </pagination>
        <span class="right line-height-26">
            共{{ total > 0 ? `${Math.ceil(total / pageSize)}` : '0' }}页
          </span>
      </list-item>
    </list-group>
  </div>
</template>
<script>
import { PAGE_CONF } from '@/utils/conf'
import { getIntegrationMaxDependency } from '@/api/home/scan/integration/sourceCode'
import { pickBy } from '@/utils'
import bus from '@/utils/bus'

export default {
  name: 'ScanAppDetailsComponent',
  data () {
    return {
      projectId: this.$route.query.project,
      tableData: [],
      popoverVisible: false,
      name: '',
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      hasVul: false,
      parseDeep: null,
      active: null,
      loading: false,
      tierNum: 1,
      params: {},
      formData: {
        name: undefined,
        parseDeep: undefined,
        securityLevelList: undefined,
        dependencyType: undefined,
        realInUse: undefined,
        isOverComponentBaseLine: 0,
        isBlackVulComponent: 0
      },
      levelOptions: [
        {
          value: 1,
          text: '严重'
        },
        {
          value: 2,
          text: '高危'
        },
        {
          value: 3,
          text: '中危'
        },
        {
          value: 4,
          text: '低危'
        },
        {
          value: 5,
          text: '无漏洞'
        }
      ]
    }
  },
  props: {
    initListXhr: {
      type: Function,
      default () {
        return false
      }
    },
    taskId: {
      default () {
        return this.$route.query.task
      }
    }
  },
  methods: {
    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 重置表单
    resetForm () {
      this.popoverVisible = false
      this.formData = {
        name: undefined,
        parseDeep: undefined,
        securityLevelList: undefined,
        dependencyType: undefined,
        realInUse: undefined,
        isOverComponentBaseLine: 0,
        isBlackVulComponent: 0
      }
      this.search()
    },

    // 初始化列表
    initList () {
      this.loading = true
      this.initListXhr({
        projectId: this.projectId,
        taskId: this.taskId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        hasVul: this.hasVul ? 1 : 0,
        ...pickBy(this.formData, [null, undefined, '']),
        loading: false,
        ...this.params
      }).then(response => {
        this.loading = false
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          this.tableData.push(item)
        })
        this.total = data.total
        this.selectComponent(this.tableData[0] || {})
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 初始化组件详情
    selectComponent (row) {
      this.active = row.dicComponentId
      this.$emit('select', row || {})
    },

    // 获取层级
    async getTier () {
      try {
        const res = await getIntegrationMaxDependency({ taskId: this.taskId, ...this.params })
        this.tierNum = res.data + 1
      } catch (error) {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      }
    }
  },
  created () {
    bus.$off('onModifyRiskLevel').$on('onModifyRiskLevel', (row) => {
      this.tableData.forEach(item => {
        if (item.assetComponentId === row.assetComponentId) {
          item.oldSecurityLevelId = typeof item.oldSecurityLevelId === 'number' ? item.oldSecurityLevelId
            : item.securityLevelId
          item.securityLevelId = row.securityLevelId
        }
      })
    })

    bus.$off('onMarkStatus').$on('onMarkStatus', ({ status, id }) => {
      this.tableData.forEach(item => {
        if (item.dicComponentId === id) {
          item.status = status
        }
      })
    })

    bus.$off('onAuditStatus').$on('onAuditStatus', () => {
      // this.search()
    })
  },
  destroyed () {
    bus.$off('onModifyRiskLevel')
  },
  watch: {
    taskId () {
      this.search()
      this.getTier()
    }
  },
  mounted () {
    if (this.taskId && this.projectId !== null && this.initListXhr !== false) {
      this.search()
      this.getTier()
    }
  }
}
</script>
<style scoped lang="scss">

.tag-info {
  color: #1B2838;
  font-size: 12px;
  border-radius: 3px;
  background: #F5F5F5;
  border: none;
  padding: 0 8px;
  height: 22px;
  line-height: 22px;
}

.change-tag {
  position: absolute;
  right: -3px;
}

.left-icon {
  font-size: 20px;
  color: #2C5F8A;
  vertical-align: middle;
  margin-right: 5px;
}

.component-opt {
  padding: 15px 0;
}

ul.component-list {

  &::-webkit-scrollbar{
    width:  2px;
  }

  scrollbar-width: 2px;
  max-height: calc(100vh - 270px) !important;
  padding: 0 15px;
  border: 1px solid #e7ecee;
  overflow-y: auto;

  .list-item {
    border-left: 0;
    border-right: 0;
    padding: 12px 0;

    &:first-child {
      border-top: 0;
      border-radius: 0;
    }

    .name {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      max-width: 60%;
      transition: all 0.5s;
    }

    .version {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      transition: all 0.5s;

      i {
        &.iconfengefu {
          color: #999;
          transform: scale(0.8);
          font-size: 12px;
        }

        display: inline-block;
        margin: 0 5px 0 8px;
      }
    }

    .level-group {
      padding-top: 8px;
      line-height: 16px;

      span {
        padding: 0 7px;
        font-size: 12px;
        color: #fff;
      }

      span:last-child {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }

      span:first-child {
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
      }
    }

    &:last-child {
      border-bottom: 0;
      border-radius: 0;
    }

    &:hover,
    &.active {
      background-color: transparent;

      .name {
        color: #2C5F8A;
      }

      .version {
        color: #2C5F8A;

        &.iconfengefu {
          color: #999;
        }
      }
    }

    &.active::before {
      width: 5px;
      left: -15px;
    }
  }
}

</style>
