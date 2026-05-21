<template>
  <div class="search-main">
    <div class="search-wrap">
      <h3 class="search-title">
        <span>
          知识库查询
        </span>
      </h3>
      <div class="search-container">
        <div class="search-auth-item">
          <img :src="cveSrc" alt="">
        </div>
        <div class="search-auth-item">
          <img :src="cweSrc" alt="">
        </div>
        <div class="search-area">
          <el-autocomplete v-if="activeTab==='component'" ref="autocomplete" :fetch-suggestions="querySearchAsync"
                           @select="handleSelect" clearable
                           placeholder="请输入组件名称"
                           v-model="searchText" :hide-loading="false" @keydown.enter.native="search">
            <template slot-scope="{ item }">
              <div class="search-item">
                {{ item.value }}
                <i class="iconfont iconclose" @click.stop.prevent="remove(item)" v-if="item.searchType === 1"></i>
              </div>
            </template>
            <el-button slot="append" class="btn" @click="search" icon="el-icon-search">查&nbsp;询</el-button>
          </el-autocomplete>
          <div class="vul-all" v-else>
            <el-input v-model="searchText" @keydown.enter.native="search" clearable
                      :placeholder="activeTab==='vul' ? '请输入漏洞编号/漏洞名称' : '请输入许可证名称'" class="btn vul-input"
                      size="medium">
              <el-button slot="append" class="btn vul-button" @click="search" icon="el-icon-search">查&nbsp;询</el-button>
            </el-input>
          </div>
        </div>
<!--        <transition name="v-zoom-w">-->
<!--          <el-button  v-if="activeTab==='component'"  class="btn-batch" @click="$router.push({ path: '/search/batch' })">风险扫描</el-button>-->
<!--        </transition>-->
        <div class="search-auth-item">
          <img :src="cnnvdSrc" alt="">
        </div>
        <div class="search-auth-item">
          <img :src="caictSrc" alt="">
        </div>
      </div>
    </div>
    <div class="view-content">
      <el-tabs class="tabs" v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="(val,key) in tabs" :key="key" :label="val.label" :name="val.name">
        </el-tab-pane>
      </el-tabs>
      <keep-alive>
        <Module
          v-if="activeTab ===  'component'"
          ref="module"
          :statistic="statistic.componentTotal"
          :set-package-manager.sync="packageManager"
        />
        <Vul
          v-else-if="activeTab === 'vul'"
          ref="vul"
          :statistic="statistic.vulTotal"
        />
        <License
          v-else
          ref="license"
          :statistic="statistic.licenseTotal"
        />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import Module from './list/module.vue'
import Vul from './list/vul.vue'
import License from './list/license.vue'
import {
  recommendList,
  historyList,
  removeHistory,
  knowledgeStatistic
} from '@/api/home/search'
import { to } from '@/utils'

export default {
  name: 'SearchMain',
  components: {
    Module,
    Vul,
    License
  },
  watch: {
    packageManager () {
      this.search()
    }
  },
  data () {
    return {
      logoSrc: require('@/assets/images/confimg/logo.png'),
      cveSrc: require('@/assets/images/CVE.svg'),
      cnnvdSrc: require('@/assets/images/cnnvd.svg'),
      caictSrc: require('@/assets/images/CAICT.svg'),
      cweSrc: require('@/assets/images/CWE.svg'),
      statistic: {
        componentTotal: 0,
        licenseTotal: 0,
        vulTotal: 0
      },
      tabs: [
        {
          label: '组件库',
          name: 'component'
        },
        {
          label: '漏洞库',
          name: 'vul'
        },
        {
          label: '许可证库',
          name: 'license'
        }
      ],
      activeTab: 'component',
      searchText: '',
      packageManager: 1
    }
  },
  methods: {
    handleClick (row) {
      // this.$router.push({
      //   path: row.name,
      //   query: this.$route.query
      // })
    },
    async getStatistic () {
      const [error, response] = await to(knowledgeStatistic())
      if (error && error.message) return this.$message.error(error.message)
      this.statistic = response.data || {}
    },
    search () {
      if (this.activeTab === 'component') {
        this.$refs.module.searchId = null
        this.$refs.module.searchText = this.searchText
        this.$refs.module.searchType = 3
        this.$refs.module.search()
      } else if (this.activeTab === 'vul') {
        this.$refs.vul.searchText = this.searchText
        this.$refs.vul.search()
      } else {
        this.$refs.license.searchText = this.searchText
        this.$refs.license.search()
      }
    },

    async querySearchAsync (queryString, callback) {
      if (this.activeTab !== 'component') {
        return
      }
      try {
        if (queryString === '') {
          let {
            data
          } = await this.initHistory()
          data = data.map(item => {
            return {
              value: item.content,
              searchType: 1,
              ...item
            }
          })
          callback(data)
        } else {
          let {
            data
          } = await this.initRecommend({
            searchCondition: queryString,
            packageManager: this.packageManager
          })
          data = data.map(item => {
            return {
              value: item.content,
              searchType: 2,
              ...item
            }
          })
          callback(data)
        }
      } catch (error) {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      }
    },

    // 移除搜索记录
    remove (item) {
      removeHistory({
        type: item ? 0 : 1, // 0删除一个   1删除全部
        id: item.id || '',
        loading: false
      }).then(() => {
        this.$refs.autocomplete.focus()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 初始化历史记录
    initHistory () {
      return historyList({
        loading: false
      })
    },

    // 推荐
    initRecommend (data) {
      return recommendList({
        ...data,
        loading: false
      })
    },

    handleSelect (item) {
      if (item) {
        this.$refs.module.searchText = this.searchText
        this.$refs.module.searchId = item.id
        this.$refs.module.searchType = item.searchType
        this.$refs.module.packageManager = item.packageManager
        this.$refs.module.search()
      } else {
        this.$refs.module.searchId = null
        this.$refs.module.searchType = 3
      }
    }
  },
  beforeDestroy () {
  },
  mounted () {
    this.getStatistic()
  }
}

</script>
<style scoped lang="scss">
// 解决ie11下 表格宽度异常 start
//::v-deep .el-table__header,
//::v-deep .el-table__body,
//::v-deep .el-table__empty-block {
//  width: 100% !important;
//}
:deep(.el-table__header,.el-table__body,.el-table__empty-block) {
  width: 100% !important;
}

// 解决ie11下 表格宽度异常 end

.search-wrap {
  background-image: url("~@/assets/images/search_bg.png");
  background-size: 100% 100%;
  padding: 17px 0 25px;
  box-shadow: 0 0 14px -8px rgba(124, 58, 237, 50%);
  margin-bottom: 10px;

  .search-title {
    font-size: 26px;
    text-align: center;
    color: #fff;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 0;

    .logo {
      vertical-align: middle;
      width: 60px;
    }

    span {
      vertical-align: middle;
    }
  }

  .search-container {
    margin: 20px auto 0;
    text-align: center;

    .search-auth-item {
      display: inline-block;
      vertical-align: bottom;
      margin: 0 20px;

      @media (max-width: 1600px) and (min-width: 1360px) {
        margin: 0 15px;
      }

      @media (max-width: 1359px) and (min-width: 1180px) {
        margin: 0 10px;
      }

      @media (max-width: 1179px) {
        margin: 0 5px;
      }

      img {
        margin-top: 2px;
        max-height: 40px;
      }
    }

    .search-area {
      margin: 0 20px;
      width: 704px;
      vertical-align: middle;
      flex: 1;
      max-width: 594px;
      display: inline-block;

      @media (max-width: 1600px) and (min-width: 1360px) {
        max-width: 510px;
        margin: 0 15px;
      }

      @media (max-width: 1359px) and (min-width: 1180px) {
        max-width: 350px;
        margin: 0 10px;
      }

      @media (max-width: 1179px) {
        max-width: 400px;
        margin: 0 8px;
      }

      .el-autocomplete,
      .el-input {
        width: 100%;

        //box-shadow: 0 2px 3px 0 rgba(0, 26, 92, 0.4);
        max-width: 594px;
        height: 44px;
        margin-bottom: 2px;

        :deep(input) {
          height: 44px;
          border-color: #fff;

          &:focus {
            border-color: #fff;
            outline: 0;
          }
        }
      }

      :deep(.el-input-group__append) {
        background: #fff;
        border-color: #fff;
        color: #666;
        position: relative;

        &::before {
          content: "";
          display: block;
          height: 20px;
          background: #c4c4c4;
          width: 1px;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto 0;
        }
      }

      :deep(.el-input-group > .el-input__inner) {
        border-right: 0;
      }

      .btn {
        width: 90px;
        font-size: 14px;
      }

      :deep(.vul-all) {
        //box-shadow: 0 2px 3px 0 rgba(0, 26, 92, 0.4);
        .vul-input {
          width: 100%;
          border-color: transparent;
          box-shadow: none;
        }
      }
    }

    .btn-batch {
      box-shadow: 0 2px 3px 0 rgba(0, 26, 92, 40%);
      color: #666;
      width: 90px;
      height: 44px;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
  }
}

.view-content {
  .tabs {
    margin: {
      top: -15px;
      left: -20px;
      right: -20px;
    }

    :deep(.el-tabs__nav-scroll) {
      margin: auto;
      width: 225px;
    }

    :deep(.el-tabs__header) {
      margin: 0;
    }
  }
}

.search-item {
  padding-right: 40px;
  position: relative;

  i {
    opacity: 0;
    position: absolute;
    right: 0;
    transition: all 0.3s;
  }

  &:hover {
    i {
      opacity: 1;
    }
  }
}

.v-zoom-w-enter-active,
.v-zoom-w-leave-active {
  transition: width 0.1s;
}

.v-zoom-w-enter,
.v-zoom-w-leave-to {
  width: 0 !important;
}
</style>
