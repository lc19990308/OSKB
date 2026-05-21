<template>
  <div>
    <!--    <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap'">-->
    <!--      <div class="clearfix">-->
    <!--        <el-button size="medium" type="primary" @click="back">返回</el-button>-->
    <!--        <el-button size="medium" type="primary" v-if="authorityFilter(1402)" @click="exportFile" :disabled="dicComponentId === undefined">导出漏洞</el-button>-->
    <!--      </div>-->
    <!--    </sticky>-->
    <div class="view-content">
      <info-wrap title="组件信息">
        <info-row>
          <info-item label="组件名称：" :span="8">{{
            componentInfo.name || "-"
          }}</info-item>
          <info-item label="组件版本：" :span="8">
            {{ componentInfo.version.version }}
            <!--            <div class="content">
                          <el-select
                            v-model="componentInfo.dicComponentId"
                            :value-key="'version'"
                            placeholder="组件版本"
                            size="medium"
                          >
                            <el-option
                              v-for="item in componentInfo.dicComponentVersionList"
                              @click.native="changeVersion(item)"
                              :key="item.dicComponentId"
                              :label="item.version"
                              :value="item.dicComponentId"
                            >
                            </el-option>
                          </el-select>
                        </div>-->
          </info-item>
          <info-item label="发布厂商：" :span="8">{{
            componentInfo.vendor || "-"
          }}</info-item>
          <!--          <info-item label="更新时间：" :span="8">{{ componentInfo.createDate || '-' }}</info-item>-->
        </info-row>
        <info-row>
          <info-item label="风险等级：" :span="8">
            <div class="content table-span">
              <level-tag :level="componentInfo.securityLevel"></level-tag>
            </div>
          </info-item>
          <info-item label="推荐等级：" :span="8">
            <el-rate
              v-model="componentInfo.recommendNum"
              :show-score="false"
              text-color="#ff9900"
              score-template="{value}"
              disabled
            >
            </el-rate>
          </info-item>
          <!--          <info-item label="解析深度：" :span="8">-->
          <!--            {{ componentInfo.parseDeep || 0 }}层-->
          <!--            {{ (componentInfo.parseDeep > 1) ? '（间接依赖）' : (componentInfo.parseDeep === 1 || !componentInfo.parseDeep) ? '（直接依赖）' : '' }}-->
          <!--          </info-item>-->
        </info-row>
        <info-row>
          <!--          <info-item label="发布日期：" :span="8">{{ componentInfo.releaseDate || '-' }}</info-item>-->
          <!--          <info-item label="组件完整性：" :span="8">{{ matching(checkResultOptions,componentInfo.md5Check,'value','text','-') }}</info-item>-->
          <info-item
            label="最新版本："
            v-if="componentInfo.latestVersion"
            :span="8"
            >{{ componentInfo.latestVersion }}</info-item
          >
        </info-row>
        <info-row v-if="componentInfo.language">
          <info-item label="所属语言：" :span="8">
            <div
              class="inline-block m-r-10 m-b-5"
              v-for="(row, index) in componentInfo.language"
              :key="index"
            >
              <div class="level-tag primary">{{ row }}</div>
            </div>
          </info-item>
        </info-row>
        <!--        <info-row>-->
        <!--          <info-item label="组件路径：" :span="24">{{ componentInfo.path || '-' }}</info-item>-->
        <!--        </info-row>-->
        <info-row v-if="componentInfo.parseInfo">
          <info-item label="文件位置：" :span="24">
            {{ componentInfo.parseInfo.fileName
            }}<span class="text-success m-l-10"
              >line:{{ componentInfo.parseInfo.lineNum | ceil}}</span
            >
          </info-item>
        </info-row>
        <info-row v-if="componentInfo.parseInfo">
          <info-item :span="24">
            <div class="code-wrap">
              <code-mirror
                ref="codeMirror"
                v-model="componentInfo.parseInfo.originText"
                :mode="'application/xml'"
                :options="{ readOnly: true }"
              ></code-mirror>
            </div>
          </info-item>
        </info-row>
      </info-wrap>
      <h3 class="headline m-t-20">
        <i class="iconfont iconloudongku"></i>漏洞信息
      </h3>
      <el-row class="info-section">
        <el-col :span="24">
          <div class="text-right m-b-15 compound-search-box--btn">
            <el-select style="width: 150px;" @change="[searchText && search()]" class="customize-select" v-model="searchSelect" size="medium">
              <el-option
                v-for="item in searchSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <search-area
              class="customize-input"
              @search="search"
              v-model="searchText"
              right-float
            ></search-area>
          </div>
          <el-table
            class="w-full"
            :data="tableData"
            v-loading="loading"
            tooltip-effect="dark"
            row-key="dicVulId"
            :expand-row-keys="defaultExpand"
            @filter-change="searchFilter"
            @sort-change="searchSort"
            @expand-change="expandChange"
            @row-click="row => rowClickExpand(row, 'defaultExpand', 'dicVulId')"
          >

            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row class="table-expand">
                  <el-col tag="p" :span="24">
                    <div class="title primary">CNNVD：</div>
                    <div class="content">{{ scope.row.cnnvdId || "-" }}</div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title success">CNVD：</div>
                    <div class="content">{{ scope.row.cnvdId || "-" }}</div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title warning">CWE：</div>
                    <div class="content">{{ scope.row.cweId || "其他" }}</div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title primary">利用难度：</div>
                    <div class="content">
                      {{ scope.row.exploitLevel === 0 ? "困难" : "" }}
                      {{ scope.row.exploitLevel === 1 ? "容易" : "" }}
                    </div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title danger">漏洞描述：</div>
                    <div class="content">
                      <pre style="margin: 0;">{{
                        scope.row.description || "-"
                      }}</pre>
                    </div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title primary">修复建议：</div>
                    <div class="content">
                      <pre style="margin: 0;">{{
                        scope.row.suggestion || "-"
                      }}</pre>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column
              label="漏洞名称"
              min-width="15%"
              prop="vulName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="XMIRROR"
              min-width="15%"
              prop="xmirrorId"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="CVE"
              min-width="15%"
              prop="cveId"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              min-width="10%"
              label="风险等级"
              show-overflow-tooltip
            >
              <template #header>
                <oss-table-filter
                  :default-props="{label: 'text', value: 'value' }"
                  v-model="searchData.securityLevels"
                  :filters="levelOptions"
                  @change="search"
                  title="风险等级"
                  multiple
                />
              </template>
              <template slot-scope="scope">
                <level-tag :level="scope.row.securityLevel"></level-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="漏洞类型"
              min-width="10%"
              prop="vulType"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="发布时间"
              min-width="15%"
              prop="release_date"
              sortable="custom"
              :sort-orders="['descending', 'ascending', null]"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.releaseDate }}
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
        </el-col>
      </el-row>
      <affected :dic-component-id="componentInfo.dicComponentId"></affected>
    </div>
  </div>
</template>
<script>
import { exportVul, componentVulList } from '@/api/home/public/vul'
import { componentDetail } from '@/api/home/public/component'
import { PAGE_CONF } from '@/utils/conf'
import Affected from '@/views/home/public/component/affected'
import CodeMirror from '@/components/public/CodeMirror'
import { downloadBlobFile, get, hasOwn, rowClickExpand } from '@/utils'

export default {
  name: 'WhiteDetails',
  components: {
    Affected,
    CodeMirror
  },
  data () {
    return {
      dicComponentId: this.$route.query.dic,
      projectId: this.$route.query.project,
      version: this.$route.query.version,
      componentId: null,
      taskId: null,
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
        }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      loading: false,
      searchSelect: 'xmirrorId',
      searchSelectOptions: [
        {
          value: 'xmirrorId',
          label: 'XMIRROR编号'
        },
        {
          value: 'cveId',
          label: 'CVE编号'
        },
        {
          value: 'cnnvdId',
          label: 'CNNVD编号'
        },
        {
          value: 'cweId',
          label: 'CWE编号'
        },
        {
          value: 'vulName',
          label: '漏洞名称'
        }
      ],
      checkResultOptions: [
        {
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
      searchText: '',
      searchData: {
        securityLevels: [],
        sortFieldList: [],
        sortTypeList: []
      },
      componentInfo: {
        version: {}
      },
      defaultExpand: []
    }
  },
  methods: {
    rowClickExpand,
    expandChange (row, arr) {
      if (arr.indexOf(row) !== -1) {
        this.defaultExpand = [row.dicVulId]
      } else {
        this.defaultExpand = []
      }
    },

    // 导出文件
    async exportFile () {
      try {
        const response = await exportVul({
          dicComponentId: this.dicComponentId,
          projectId: this.projectId,
          type: 2
        })
        await downloadBlobFile(response)
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    //  返回
    back () {
      this.$router.push({
        name: 'WhiteList',
        params: {
          back: 1
        }
      })
    },

    changeVersion (event) {
      this.componentId = event
      this.dicComponentId = event
      this.taskId = event.taskId
      this.init()
      // this.initLicenseDetail()
    },

    // 初始化组件详情
    init () {
      componentDetail({
        id: this.dicComponentId,
        projectId: this.projectId,
        loading: false
      })
        .then(response => {
          this.componentInfo = response.data
          if (
            this.taskId === null &&
            this.componentInfo.dicComponentVersionList.length > 0
          ) {
            this.taskId = this.componentInfo.dicComponentVersionList.filter(
              item => item.version === this.componentInfo.version
            )[0].taskId
            this.componentId = this.componentInfo.dicComponentVersionList.filter(
              item => item.version === this.componentInfo.version
            )[0].dicComponentId
            this.componentInfo.version = this.componentInfo.dicComponentVersionList.filter(
              item => item.version === this.componentInfo.version
            )[0]
          }
          if (this.componentInfo.language) {
            this.componentInfo.language = this.componentInfo.language.split(
              ','
            )
          }
          this.initList()
        })
        .catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
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
      if (hasOwn(filers, 'securityLevels')) {
        this.searchData.securityLevels = filers.securityLevels
      } else {
        for (const x in filers) {
          if (Array.isArray(filers[x])) {
            this.searchData[x] = filers[x][0]
          }
        }
      }
      this.search()
    },

    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      this.loading = true
      componentVulList({
        dicComponentId: this.componentId,
        ...this.searchData,
        [this.searchSelect]: this.searchText,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        name: this.name,
        taskId: this.taskId,
        loading: false
      })
        .then(response => {
          this.loading = false
          this.tableData = []
          const data = response.data
          data.records.forEach(item => {
            this.tableData.push(item)
          })
          if (this.tableData.length > 0) {
            this.defaultExpand = [this.tableData[0].dicVulId]
          }
          this.total = data.total
        })
        .catch(error => {
          this.tableData = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    }
  },
  mounted () {
    if (this.dicComponentId !== undefined) {
      if (![10, '10'].includes(get(this.$route.query, '_securityLevel', 10))) {
        this.searchData.securityLevels = [Number(get(this.$route.query, '_securityLevel'))]
      }
      this.init()
    }
  }
}
</script>
<style scoped lang="scss">
.info-section {
  p {
    margin-top: 0;
    margin-bottom: 10px;
    line-height: 34px;
    color: #666;

    .title {
      width: 110px;
      float: left;
      vertical-align: middle;
    }

    .content {
      margin-left: 110px;
      vertical-align: middle;
    }
  }

  .search-wrap {
    text-align: right;
    margin-bottom: 15px;
  }

  .el-dropdown {
    color: inherit;
  }
}
</style>
