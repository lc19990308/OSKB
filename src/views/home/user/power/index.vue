<template>
  <div class="view-content">
    <el-row>
      <div class="left">
        <div class="left input-label">
          搜索资产：
        </div>
        <el-input size="medium" class="input" v-model="searchText"  placeholder="搜索网址或网站名称"></el-input>
        <el-button size="medium">搜索</el-button>
      </div>
      <div class="left">
        <div class="left input-label">
          分组筛选：
        </div>
        <el-select size="medium" v-model="searchGroup" multiple clearable placeholder="请选择">
          <el-option
            v-for="item in groupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="left">
        <div class="left input-label">
          安全评级：
        </div>
        <el-select size="medium" v-model="searchLevel" multiple clearable placeholder="请选择">
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </el-row>
    <el-table
      class="w-full"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="网址"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        label="网站名称"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        label="所在名称"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        label="添加时间"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        label="安全评级"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        label="操作" fixed="right"
        width="150"
        show-overflow-tooltip>
        <template>
          <el-button size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer-wrapper clearfix">
      <pagination
        background
        layout="prev, pager, next"
        :total="1000"
        class="right"
        prev-text="上一页"
        next-text="下一页"
      >
      </pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'power',
  components: {},
  data () {
    return {
      searchText: '',
      searchGroup: [],
      searchLevel: [],
      levelOptions: [
        {
          value: '-1',
          label: '未检测'
        },
        {
          value: '0',
          label: '安全'
        },
        {
          value: '1',
          label: '信息'
        },
        {
          value: '2',
          label: '低危'
        },
        {
          value: '3',
          label: '中危'
        },
        {
          value: '4',
          label: '高危'
        }
      ],
      groupOptions: [
        {
          value: '0',
          label: '全部'
        }
      ],
      tableData: [
        {}
      ],
      multipleSelection: []
    }
  },
  methods: {
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  },
  mounted () {}
}
</script>
<style scoped lang="scss">
.view-content {
  font-size: 14px;

  .el-row > .left {
    margin-right: 30px;
    margin-bottom: 15px;

    .input-label {
      line-height: 34px;
    }

    .input,
    .el-select {
      width: 240px;
      margin-right: 20px;
    }
  }
}
</style>
