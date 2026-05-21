<template>
  <el-dialog v-if="[1,3].includes(desc.type) && visible" width="800px" modal-append-to-body append-to-body
             title="版本推荐分析" :visible.sync="visible">
    <div style="padding: 15px 0 30px 0">
      <!--      case1      -->
      <template v-if="desc.type === 1">
        <p class="paragraph">
          <i class="el-icon-info m-r-5 text-primary"></i>
          当前组件
          <template v-if="desc.vendor">
            {{ desc.vendor }}:
          </template>
          {{ desc.name }}
          <template v-if="desc.name && desc.version">
            :
          </template>
          {{ desc.version }}
          本身及子依赖均无漏洞，可在您的项目或应用中安全引入使用。建议定期审查组件，以检查组件是否有新的漏洞曝出。
        </p>
      </template>
      <!--      case3     -->
      <template v-if="desc.type === 3">
        <p class="paragraph">
          <span class="prefix">1</span> 组件
          <span class="text-info">
            <template v-if="desc.vendor">
              {{ desc.vendor }}:
            </template>
            {{ desc.name }}
            <template v-if="desc.name && desc.version">
              :
            </template>
            {{ desc.version }}
          </span>
          共
          <span class="text-danger">{{ desc.totalVulNum }}</span>
          个漏洞，其中组件本身漏洞有
          <span class="text-danger">{{ desc.selfVulNum }}</span>
          个，子依赖漏洞数有
          <span class="text-danger">{{ desc.childrenVulNum }}</span>
          个。
        </p>
        <p class="paragraph">
          <span class="prefix">2</span>组件
          <span class="text-info">
              <template v-if="desc.vendor">
              {{ desc.vendor }}:
            </template>
            {{ desc.name }}
            <template v-if="desc.name && desc.bestVersion">
              :
            </template>
            {{ desc.bestVersion }}
          </span>
          的自身及子依赖均无漏洞，因此建议将您应用中引入的组件升级至
          <span class="text-info">{{ desc.bestVersion }}</span>
          版本，可修复组件的全部漏洞（含子依赖漏洞）。
        </p>
        <p class="paragraph">
          <span class="prefix">3</span>若要升级组件版本，请在升级成功后重新检测您的应用，验证相应漏洞是否已成功修复。
        </p>
      </template>
    </div>
    <div style="text-align: center">
      <el-button plain size="small" class="close-btn" @click="visible = false">
        我知道了
      </el-button>
    </div>
  </el-dialog>
  <el-drawer v-else-if="[2,4].includes(desc.type) && visible" class="drawer-vul" title="版本推荐分析" :visible.sync="visible"
             :size="'860px'" :direction="direction">
    <el-scrollbar class="drawer-body-scrollbar hide-x">
      <div class="drawer-body">
        <!--      case2      -->
        <template v-if="desc.type === 2">
          <p class="paragraph">
            <span class="prefix">1</span>
            组件
            <span class="text-info">
              <template v-if="desc.vendor">
              {{ desc.vendor }}:
            </template>
              {{ desc.name }}
            <template v-if="desc.name && desc.version">
              :
            </template>
              {{ desc.version }}
            </span>
            共
            <span class="text-danger"> {{ desc.totalVulNum }} </span>
            个漏洞，其中组件本身漏洞有
            <span class="text-danger"> {{ desc.selfVulNum }} </span>
            个，子依赖漏洞数有
            <span class="text-danger"> {{ desc.childrenVulNum }} </span>
            个。
          </p>
          <p class="paragraph">
            <span class="prefix">2</span>当前组件版本为该组件的最新版本，目前无法通过升级进行修复，您可通过相应的漏洞修复建议临时修复该版本组件存在的漏洞，该组件本身及子依赖漏洞信息详见下表。
          </p>
        </template>
        <!--      case4     -->
        <template v-if="desc.type === 4">
          <p class="paragraph">
            <span class="prefix">1</span>
            组件
            <span class="text-info">
              <template v-if="desc.vendor">
              {{ desc.vendor }}:
            </template>
              {{ desc.name }}
            <template v-if="desc.name && desc.version">
              :
            </template>
              {{ desc.version }}
            </span>
            共
            <span class="text-danger">
              {{ desc.totalVulNum }}
            </span>
            个漏洞，其中组件本身漏洞有
            <span class="text-danger"> {{ desc.selfVulNum }} </span>
            个，子依赖漏洞数有
            <span class="text-danger"> {{ desc.childrenVulNum }} </span>
            个。
          </p>
          <p class="paragraph">
            <span class="prefix">2</span>升级组件至
            <span class="text-info">{{ desc.latestVersion }} </span>
            版本可修复
            <span class="text-danger">{{ desc.repairVulNum }}</span>
            个漏洞（含子依赖漏洞），剩余
            <span class="text-danger">{{ desc.surplusVulNum }}</span>
            个漏洞在该版本无法修复，详见下表。
          </p>
          <p class="paragraph">
            <span class="prefix">3</span>若要升级组件版本，请在升级成功后重新检测您的应用，验证相应漏洞是否已成功修复。
          </p>
        </template>
        <!--  case2 case4     -->
        <template v-if="[2,4].includes(desc.type)">
          <el-table
            class="w-full"
            style="margin-top: 20px"
            :data="tableData"
            v-loading="loading"
            tooltip-effect="dark"
            row-key="xmirrorId"
            :expand-row-keys="defaultExpand"
            @expand-change="expandChange"
            @row-click="(row) => rowClickExpand(row,'defaultExpand','xmirrorId')"
          >

            <el-table-column type="expand">
              <template slot-scope="{row}">
                <el-row class="table-expand">
                  <el-col tag="p" :span="24">
                    <div class="title primary">
                      <dot type="warning"></dot>
                      漏洞编号：
                    </div>
                    <div class="content">
                      <template v-if="row.cveId">
                        {{ row.cveId }} ｜
                      </template>
                      <template v-if="row.cnnvdId">
                        {{ row.cnnvdId }} ｜
                      </template>
                      <template v-if="row.cnvdId">
                        {{ row.cnvdId }}
                        <template v-if="row.cweId">
                          {{ row.cweId }} ｜
                        </template>
                      </template>
                      <template v-if="row.cweId">
                        {{ row.cweId }}
                      </template>
                    </div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title danger">
                      <dot type="danger"></dot>
                      漏洞描述：
                    </div>
                    <div class="content">
                      <pre style="margin: 0">{{ row.description || '-' }}</pre>
                    </div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title primary">
                      <dot type="success"></dot>
                      修复建议：
                    </div>
                    <div class="content">
                      <pre style="margin: 0">{{ row.suggestion || '-' }}</pre>
                    </div>
                  </el-col>
                  <el-col tag="p" :span="24">
                    <div class="title primary">
                      <dot type="primary"></dot>
                      影响子依赖：
                    </div>
                    <div class="content">
                      <pre style="margin: 0">{{ row.affectComponents | affect }}</pre>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column
              label="XMIRROR编号"
              min-width="15%"
              prop="xmirrorId"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="漏洞名称"
              min-width="15%"
              prop="vulName"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              min-width="15%"
              label="风险等级"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <level-tag :level="scope.row.securityLevel"></level-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="影响子依赖数"
              min-width="15%"
              prop="exploitLevelId"
              show-overflow-tooltip>
              <template slot-scope="{ row }">
                {{ row.affectCount }}
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
        </template>
      </div>
    </el-scrollbar>
    <div class="footer-drawer">
      <el-button plain size="small" class="close-btn" @click="visible = false">
        我知道了
      </el-button>
    </div>
  </el-drawer>
</template>
<script>
import { analyzeVulApi, analyzeApi } from '@/api/home/public/component'
import to from '@/utils/await-to'
import { rowClickExpand, get, isArray } from '@/utils'
import Dot from '@/components/public/Dot'

export default {
  name: 'VersionRecommendationAnalysisDrawer',
  components: { Dot },
  data () {
    return {
      visible: false,
      assetComponentId: '',
      direction: 'rtl',
      desc: {},
      defaultExpand: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      loading: false,
      tableData: []
    }
  },
  filters: {
    affect (list) {
      if (list && isArray(list)) {
        return list.map(item => Object.values(item).filter(i => i).join(':')).join(',')
      }
      return '-'
    }
  },
  methods: {
    rowClickExpand,
    expandChange (row, arr) {
      if (arr.indexOf(row) !== -1) {
        this.defaultExpand = [row.xmirrorId]
      } else {
        this.defaultExpand = []
      }
    },

    // 点击组件的时候初始化漏洞列表
    search () {
      this.currentPage = 1
      this.tableData = []
      this.total = 0
      this.initList()
    },

    // 初始化漏洞列表
    initList () {
      this.loading = true
      analyzeVulApi({
        assetComponentId: this.assetComponentId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      }).then(response => {
        this.loading = false
        this.tableData = []
        const data = get(response, 'data.vuls', {})
        data.records.forEach(item => {
          this.tableData.push(item)
        })
        if (this.tableData.length > 0) {
          this.defaultExpand = [this.tableData[0].xmirrorId]
        }
        this.total = data.total
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    abort(){
      this.controller && this.controller.abort()
    },
    async open (assetComponentId) {
      this.controller = new AbortController();
      this.desc = {}
      this.tableData = []
      this.total = 0
      this.currentPage = 1
      this.defaultExpand = []
      this.assetComponentId = assetComponentId
      const [error, result] = await to(analyzeApi({
        assetComponentId,
        projectId: this.projectMixin.id,
        loading: false
      }, this.controller.signal))
      if (typeof error === 'object' && error !== null) {
        error.message && this.$message.error(error.message)
      } else {
        this.visible = true
        this.desc = result.data
        if ([2, 4].includes(this.desc.type)) {
          this.initList()
        }
      }
    }
  }
}

</script>
<style scoped lang="scss">
.drawer-vul {
  :deep(.el-drawer__header) {
    font-size: 16px;
    padding: 15px 20px;
    margin-bottom: 0;
    border-bottom: 1px solid rgba(220, 222, 224, 1);
  }

  :deep(.el-drawer__body) {
    height: calc(100% - 58px);
  }

  .drawer-body-scrollbar {
    height: calc(100% - 51px);

    .drawer-body {
      padding: 20px;
    }
  }

  .footer-drawer {
    position: absolute;
    bottom: 20px;
    width: 100%;
    background: #FFFFFF;
    left: 0;
    text-align: center;
  }

}

.prefix {
  width: 18px;
  line-height: 18px;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
  font-size: 12px;
  vertical-align: text-top;
  margin-right: 5px;
  color: #A78BFA;
  background: #EDE9FE;

}

.close-btn {
  width: 90px;
  background-color: transparent;
  height: 32px;
}

.divide-icon {
  font-size: 12px !important;
  color: #999999 !important;
  padding: 0 5px 0 20px;
}

.paragraph {
  margin: 0;
  padding: 0 0 0 25px;
  position: relative;
  line-height: 30px;

  .prefix {
    position: absolute;
    left: 0;
    top: 5px;
  }
}

//滚动条样式
:deep(.el-scrollbar__thumb) {
  background-color: #bfbfbf;
}

:deep(.el-scrollbar__bar) {
  width: 10px;
}

</style>
