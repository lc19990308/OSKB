<template>
  <div>
    <div class="search-component">
      <search-area placeholder="请输入许可证名称" @search="search" v-model="shortName"></search-area>
    </div>
    <h3 class="list-title">
      许可证名称
      <span class="total">{{ total }}</span>
    </h3>
    <el-scrollbar class="component-list-wrap scrollbar-hide-x">
      <list-group class="component-list">
        <list-item
          v-for="(row,index) in tableData"
          :key="index"
          :active="active !== undefined && active === row.dicLicenseId"
          @click="selectItem(row)"
        >
          <div class="name">
            <span class="level-tag danger" v-if="row.securityLevel === 1">高风险</span>
            <span class="level-tag warning" v-else-if="row.securityLevel === 2">中风险</span>
            <span class="level-tag info" v-else-if="row.securityLevel === 3">低风险</span>
            {{ row.shortName }}
          </div>
        </list-item>
        <list-item v-if="tableData.length === 0" class="text-center">
          暂无数据
        </list-item>
        <list-item class="list-footer">
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
    </el-scrollbar>
  </div>
</template>
<script>
import { PAGE_CONF } from '@/utils/conf'
import StickyContent from '@/components/public/StickyContent'

export default {
  name: 'ScanAppDetailsLicense',
  components: {
    StickyContent
  },
  props: {
    initListXhr: {
      type: Function,
      default () {
        return false
      }
    },
    auto: { // 是否进入界面的时候就立即请求
      default () {
        return true
      }
    }
  },
  inject: ['app'],
  data () {
    return {
      tableData: [],
      shortName: '',
      currentPage: 1,
      pageSize: PAGE_CONF.pageSize,
      total: 0,
      loading: false,
      pageConf: PAGE_CONF,
      active: null
    }
  },
  methods: {
    // 搜索
    search () {
      this.currentPage = 1
      this.initList()
    },

    // 初始化列表
    initList () {
      if (this.app.params.projectId === null) {
        return 0
      }
      this.initListXhr({
        taskId: this.app.params.taskId,
        shortName: this.shortName,
        projectId: this.app.params.projectId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loading: false
      }).then(response => {
        this.tableData = []
        const data = response.data
        data.records.forEach(item => {
          this.$set(item, 'checked', false)
          this.tableData.push(item)
        })
        this.total = data.total
        this.selectItem(this.tableData[0] || {})
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 选中
    selectItem (row) {
      this.active = row.dicLicenseId
      this.$emit('select', row || {})
    }
  },
  mounted () {
    if (this.app.params.projectId !== null && this.app.params.taskId !== null && this.auto) {
      this.search()
    }
  }
}
</script>
<style scoped lang="scss">
.level-tag{
  border-radius: 10px;
  background: #F3F4F4;
  font-size: 12px;
  line-height: 1;
  font-weight: 500;
  padding: 2px 7px;
  margin-right: 8px;
}
.search-component{
  margin-bottom: 20px;
}
.list-title{
  color: #333333;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  .total{
    border-radius: 3px;
    background: #F3F4F4;
    color: #4BA0EA;
    padding: 2px 8px;
    font-size: 12px;
    margin-left: 10px;
    font-weight: 500;
    position: relative;
    display: inline-block;
    &:before{
      content: '';
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      top: 5px;
      left: -10px;
      border: {
        width: 5px;
        style: solid;
        top-color: transparent;
        bottom-color: transparent;
        left-color: transparent;
        right-color: #F3F4F4;
      }
    }
  }
}
ul.component-list{
  padding: 0 15px;
  border: 1px solid #e7ecee;
  .list-item{
    border-left: 0;
    border-right: 0;
    padding: 12px 0;
    &:first-child {
      border-top: 0;
      border-radius: 0;
    }
    &:last-child {
      border-bottom: 0;
      border-radius: 0;
    }
    &:hover, &.active {
      background-color: transparent;
      color: #7C3AED;
    }
    &.active:before {
      width: 5px;
      left: -15px;
    }
    .name{
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      max-width: 100%;
      transition: all 0.5s;
    }
  }
}
</style>
