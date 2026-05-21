<template>
  <div>
    <div class="m-b-20" style="display: flex;justify-content: space-between;align-items: center;">
      <search-area style="width: 80%;float:left;display: block" placeholder="请输入搜索关键词" @search="search"
                   v-model="formData.name"></search-area>
      <el-popover
        placement="right-start"
        width="350"
        popper-class="popper-no-padding"
        v-model="popoverVisible"
        trigger="click">
        <div style="padding: 13px 20px;border-bottom: 1px solid #DCDEE0;display: flex;justify-content: space-between;">
          <span>高级筛选</span>
          <el-tooltip effect="dark">
            <div slot="content" style="width: 300px">
              <p> 搜索框内搜索关键词：可根据发布厂商、组件名、版本号模糊搜索，回车或点击搜索按钮进行搜索。</p>
              <p>1. 根据组件名称模糊匹配搜索，直接输入关键词进行搜索即可；</p>
              <p> 2. 根据组件名称、版本号模糊匹配搜索，按照 {组件名称}:{版本号}格式搜索，即将组件名称与版本号通过冒号（：）分隔进行搜索，不区分中英文及大小写；</p>
              <p>3、根据组件名称、版本号、发布厂商模糊匹配搜索，按照{发布厂商}:{组件名称}:{版本号}格式搜索，即将发布厂商、组件名、版本号通过冒号（：）分隔进行搜索，不区分中英文及大小写。</p>
            </div>
            <i style="font-size: 18px" class="el-icon-warning-outline cursor-pointer"></i>
          </el-tooltip>
        </div>
        <el-form status-icon label-width="110px" style="padding: 20px;" label-position="left">
          <el-form-item style="margin-bottom: 15px" label="解析深度：">
            <el-select v-model="formData.parseDeep" placeholder="解析深度" clearable size="medium" class="w-full">
              <el-option
                v-for="(item, index) in tierNum"
                :key="index"
                :label="index + ' 层'"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 15px" label="风险等级：">
            <el-select class="w-full" v-model="formData.securityLevelList" multiple placeholder="请选择风险等级" clearable size="medium">
              <el-option
                v-for="(item) in levelOptions"
                :key="item.value + 'levelOptions'"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 15px" label="组件依赖：">
            <el-select class="w-full" v-model="formData.dependencyType" placeholder="请选择" clearable size="medium">
              <el-option label="直接依赖" :value="0"></el-option>
              <el-option label="间接依赖" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否实际引入：" style="margin-bottom: 15px">
            <el-select class="w-full" v-model="formData.realInUse" placeholder="请选择" clearable size="medium">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审计状态：" style="margin-bottom: 15px">
            <el-select
              v-model="formData.auditStatus"
              placeholder="请选择审计状态"
              clearable
              class="w-full"
              size="medium"
            >
              <el-option
                v-for="(item) in auditStatusOptions"
                :key="item.value"
                :label='item.label'
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标记状态：" style="margin-bottom: 0;">
            <el-select
              v-model="formData.markStatus"
              placeholder="请选择标记状态"
              clearable
              class="w-full"
              size="medium"
            >
              <el-option
                v-for="(item) in markComponentStatusOptions"
                :key="item.value"
                :label='item.label'
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="漏洞黑名单组件：" label-width="170px" style="margin-bottom: 15px">-->
          <!--            <el-switch class="right m-t-10" v-model="formData.parseDeep"></el-switch>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="不符合基线版本组件：" label-width="170px" style="margin-bottom: 15px">-->
          <!--            <el-switch class="right m-t-10" v-model="formData.parseDeep"></el-switch>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="组件黑名单：" style="margin-bottom: 15px">-->
          <!--            <el-switch class="right m-t-10" v-model="formData.parseDeep"></el-switch>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="许可证黑名单：" style="margin-bottom: 0">-->
          <!--            <el-switch class="right m-t-10" v-model="formData.parseDeep"></el-switch>-->
          <!--          </el-form-item>-->
        </el-form>
        <el-row style="padding: 13px 0;text-align: center;border-top: 1px solid #DCDEE0;">
          <el-button size="medium" type="primary" @click="search(), popoverVisible = false" style="width: 80px">确定
          </el-button>
          <el-button size="medium" plain @click="resetForm" style="width: 80px">重置</el-button>
        </el-row>
        <div slot="reference" class="text-primary oss-text-button">
          筛选 <i style="font-size: 14px" class="iconfont icongengduoshaixuan"></i>
        </div>
      </el-popover>
    </div>
    <list-group ref="list" class="component-list scrollbar-custom" v-loading="loading">
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
          @hook:mounted="handlePagination"
          @size-change="initList"
          @current-change="initList"
          :current-page.sync="currentPage"
          ref="pagination"
          :layout="'prev, jumper, next'"
          :page-size.sync="pageSize"
          :prev-text="''"
          :next-text="''"
          :total="total"
        >
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
import { getMaxDependency } from '@/api/home/scan/app'
import { getIdeMaxDependency } from '@/api/home/scan/develop/ide'
import { getGitMaxDependency } from '@/api/home/scan/develop/repository/git'
import { getSvnMaxDependency } from '@/api/home/scan/develop/repository/svn'
import { getIntegrationMaxDependency } from '@/api/home/scan/integration/sourceCode'
import { getAppMaxDependency } from '@/api/home/scan/node'
import { getNexusMaxDependency } from '@/api/home/scan/private'
import { getAssetMaxDependency } from '@/api/home/assets/app/component'
import { getSbomMaxDependency } from '@/api/home/scan/sbom'
import { pickBy } from '@/utils'


// 获取层级策略
const TIER_CONF = {
  '/scan/app/component/details/component': getMaxDependency, // 获取应用包审查任务组件最大依赖层级
  '/scan/develop/ide/details/component': getIdeMaxDependency, // 获取ide审查任务组件最大依赖层级
  '/scan/develop/repository/git/details/component': getGitMaxDependency, // 获取git仓库审查任务组件最大依赖层级
  '/scan/develop/repository/svn/details/component': getSvnMaxDependency, // // 获取svn仓库审查任务组件最大依赖层级
  '/scan/develop/integration/details/component': getIntegrationMaxDependency, // 获取集成部署审查任务组件最大依赖层级
  '/scan/node/details/component': getAppMaxDependency, // 获取测试运行监控任务组件最大依赖层级
  '/scan/private/details/component': getNexusMaxDependency, // 获取nexus审查任务组件最大依赖层级
  '/assets/app/details/component': getAssetMaxDependency, // 获取应用包审查任务组件最大依赖层级
  '/scan/sbom/details/component': getSbomMaxDependency // SBOM组件最大依赖层级
}
import { auditStatusOptions, markComponentStatusOptions } from '@/store/constant'

import bus from '@/utils/bus'
export default {
  name: 'ScanAppDetailsComponent',
  data () {
    return {
      auditStatusOptions,
      projectId: this.$route.query.project,
      markComponentStatusOptions,
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
        markStatus: undefined,
        auditStatus: undefined
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
    },
  },
  methods: {
    handlePagination(){
      const jump = this.$refs.pagination.$el.querySelector('.el-pagination__jump')
      jump.childNodes.forEach(node => {
        if (node.nodeType === 3){
          node.remove()
        }
      })
    },
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
        realInUse: undefined
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
        this.$nextTick(() => {
          this.$refs.list.$el.scrollTop = 0
        })
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
      const fn = TIER_CONF[this.$route.path]
      try {
        if (typeof fn === 'function') {
          const res = await fn({ taskId: this.taskId, ...this.params })
          this.tierNum = res.data + 1
        } else {
          this.tierNum = 5
        }
      } catch (error) {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      }
    }
  },
  watch: {
    taskId () {
      this.search()
      this.getTier()
    }
  },
  created () {
    bus.$off('onModifyRiskLevel').$on('onModifyRiskLevel', (row) => {
      this.tableData.forEach(item => {
        if (item.assetComponentId === row.assetComponentId) {
          item.oldSecurityLevelId = typeof item.oldSecurityLevelId === 'number' ? item.oldSecurityLevelId :
            item.securityLevelId
          item.securityLevelId = row.securityLevelId
        }
      })
    })

    bus.$off('onMarkStatus').$on('onMarkStatus', ({status, id}) => {
      this.tableData.forEach(item => {
        if (item.dicComponentId === id) {
          item.status = status
        }
      })
    })
  },
  destroyed () {
    bus.$off('onModifyRiskLevel')
  },
  mounted () {
    if (this.taskId && this.projectId !== null && this.initListXhr !== false) {
      this.search()
      this.getTier()
    }
  }
}
</script>
<style lang="scss">
.oss-text-button {
  display: inline-block;
  padding: 7px 5px 6px 5px;
  cursor: pointer;
  border-radius: 3px;
  transition: all .3s;
  &:hover {
    background: #F3F6F9;
  }
}
.popper-no-padding {
  padding: 0;
}
</style>
<style scoped lang="scss">

.tag-info {
  color: #333333;
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

:deep(.el-pagination__jump){
  margin-left: 0;
}
.left-icon {
  font-size: 20px;
  color: #8B5CF6;
  vertical-align: middle;
  margin-right: 5px;
}

ul.component-list {
  &::-webkit-scrollbar{
    width:  2px;
  }

  scrollbar-width: 2px;
  max-height: calc(100vh - 230px) !important;
  padding: 0 15px;
  overflow-y: auto;
  border: 1px solid #e7ecee;

  .list-item {
    .name {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      margin: 0;
      font-size: 14px;
      padding: 0;
      text-overflow: ellipsis;
      word-break: break-all;
      max-width: 60%;
      //transition: all 0.5s;
    }
    .version {
      margin: 0;
      padding: 0;
      font-size: 14px;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      i {
        &.iconfengefu {
          color: #999999;
          transform: scale(0.8);
          font-size: 12px;
        }

        display: inline-block;
        margin: 0 5px 0 8px;
      }
    }
  }
}

</style>
