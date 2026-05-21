<template>
  <div class="report-center">
    <template v-if="mode === 'content'">
      <div class="form-data"  v-loading="treeLoading">
        <el-tree
          :data="inspireTree"
          show-checkbox
          node-key="id"
          ref="tree"
          default-expand-all
          :default-checked-keys="defaultReportContent"
          @check-change="onClickSureContent"
          :props="{
            label: 'name',
          }"
          >
        </el-tree>
      </div>
    </template>
    <template v-else>
      <div class="form-data"  v-loading="treeLoading">
        <el-tree
          :data="inspireTree"
          show-checkbox
          node-key="id"
          ref="tree"
          default-expand-all
          :default-checked-keys="defaultReportContent"
          @check-change="onClickSureContent"
          :props="{
            label: 'name',
          }"
          >
        </el-tree>
      </div>
      <div class="operating">
        <el-button @click="reset" size="medium">
          重置
        </el-button>
      </div>
      <div class="to-data">
        <ul>
          <li v-for="(item,index) in echoData" :key="index">
            <el-tag
              :closable="!(item.disabled) && mode !== 'view'"
              size="small"
              :type="item.disabled ? 'info' : ''"
              @close="onCloseTag(item)"
            > {{ item.name }}</el-tag>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import { defaultTemplateContent } from '@/api/home/report/template'

export default {
  name: 'checkReportContent',
  props: {
    mode: {
      type: String,
      default: 'add'
    },
    moduleCode: {
      type: [Number, String],
      default: 1
    },
    defaultTreeData: {
      type: [Array, Object],
      default: null
    }
  },
  data () {
    return {
      treeLoading: false,
      inspireTree: [{
        key: 'all',
        name: '全选',
        disabled: false,
        fixed: false,
        children: []
      }],
      defaultReportContent: [],
      resetDefaultData: [],
      allTreeNodes: [],
      parentTreeId: [],
      echoData: []
    }
  },
  watch: {
    moduleCode () {
      this.init()
    },
    mode () {
      this.init()
    },
    defaultTreeData () {
      this.initTemplateContentFormDefault()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init (value) {
      setTimeout(() => {
        this.inspireTree = []
        this.defaultReportContent = []
        this.resetDefaultData = []
        this.echoData = []
        if (this.mode === 'add' || this.mode === 'edit') {
          this.initTemplateContent()
        } else {
          this.initTemplateContentFormDefault()
        }
      }, 200)
    },
    /**
     * 初始化报告内容选项
     * @returns {any}
     */
    initTemplateContentFormDefault () {
      const rootNode = {
        key: 'all',
        id: 'all',
        parentId: -1,
        name: '全选',
        disabled: this.mode === 'content',
        enable: false,
        fixed: false,
        children: []
      }
      const inspireTree = [rootNode]
      const allTreeNodes = [rootNode]
      const defaultReportContent = []
      const resetDefaultData = []
      const oldData = (this.defaultTreeData || [])
      oldData.forEach(item => {
        const newNode = {
          id: item.key,
          parentId: 'all',
          key: item.key,
          name: item.name,
          disabled: this.mode === 'content' ? true : item.fixed,
          enable: item.enable,
          fixed: item.fixed,
          children: []
        }
        allTreeNodes.push(newNode)
        if (item.enable || item.fixed) defaultReportContent.push(item.key)
        if (item.fixed) resetDefaultData.push(item.key);
        (item.children || []).forEach(itemm => {
          const childrenNode = {
            id: item.key + '_' + itemm.key,
            parentId: item.key,
            key: itemm.key,
            name: itemm.name,
            disabled: this.mode === 'content' ? true : itemm.fixed,
            enable: itemm.enable,
            fixed: itemm.fixed
          }
          allTreeNodes.push(childrenNode)
          newNode.children.push(childrenNode)
          if (itemm.enable || itemm.fixed) defaultReportContent.push(item.key + '_' + itemm.key)
          if (itemm.fixed) resetDefaultData.push(item.key + '_' + itemm.key)
        })
        inspireTree[0].children.push(newNode)
      })

      this.allTreeNodes = allTreeNodes
      this.inspireTree = inspireTree
      this.defaultReportContent = defaultReportContent
      this.resetDefaultData = resetDefaultData
      this.$nextTick(() => {
        this.onClickSureContent()
      })
    },
    /**
     * 初始化报告内容选项
     * @returns {any}
     */
    initTemplateContent () {
      if (this.mode === 'edit' && this.defaultTreeData && this.defaultTreeData.length) {
        this.initTemplateContentFormDefault()
        return
      }
      this.treeLoading = true
      return defaultTemplateContent({
        moduleCode: this.moduleCode,
        loading: false
      })
        .then(response => {
          const rootNode = {
            key: 'all',
            id: 'all',
            parentId: -1,
            name: '全选',
            disabled: this.mode === 'content',
            enable: false,
            fixed: false,
            children: []
          }
          const inspireTree = [rootNode]
          const allTreeNodes = [rootNode]
          const defaultReportContent = []
          const resetDefaultData = []
          const oldData = (response.data || [])
          oldData.forEach(item => {
            const newNode = {
              id: item.key,
              parentId: 'all',
              key: item.key,
              name: item.name,
              disabled: this.mode === 'content' ? true : item.fixed,
              enable: item.enable,
              fixed: item.fixed,
              children: []
            }
            allTreeNodes.push(newNode)
            if (item.enable || item.fixed) defaultReportContent.push(item.key)
            if (item.fixed) resetDefaultData.push(item.key);
            (item.children || []).forEach(itemm => {
              const childrenNode = {
                id: item.key + '_' + itemm.key,
                parentId: item.key,
                key: itemm.key,
                name: itemm.name,
                disabled: this.mode === 'content' ? true : itemm.fixed,
                enable: itemm.enable,
                fixed: itemm.fixed
              }
              allTreeNodes.push(childrenNode)
              newNode.children.push(childrenNode)
              if (itemm.enable || itemm.fixed) defaultReportContent.push(item.key + '_' + itemm.key)
              if (itemm.fixed) resetDefaultData.push(item.key + '_' + itemm.key)
            })
            inspireTree[0].children.push(newNode)
          })

          this.allTreeNodes = allTreeNodes
          this.inspireTree = inspireTree
          this.defaultReportContent = defaultReportContent
          this.resetDefaultData = resetDefaultData
          this.$nextTick(() => {
            this.onClickSureContent()
          })
        })
        .catch(error => {
          this.loading = false
          this.inspireTree = []
          this.defaultReportContent = []
          this.resetDefaultData = []
          this.echoData = []
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        }).finally(() => {
          this.treeLoading = false
        })
    },
    /**
     * 点击报告内容关闭按钮
     * @param {any} treeNode
     * @returns {any}
     */
    onCloseTag (treeNode) {
      const checkedKeys = this.$refs.tree.getCheckedKeys().filter(item => item !== treeNode.id)
      this.$refs.tree.setCheckedKeys(checkedKeys, true)
      this.onClickSureContent()
    },
    setCheckedKeys (checkedKeys) {
      this.$refs.tree.setCheckedKeys(checkedKeys)
    },
    /**
     * 获取当前选中的报告内容(树状)
     * @returns {any}
     */
    getCheckedTreeNodes () {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const checkedNodes = this.allTreeNodes.map(item => ({
        id: item.id,
        parentId: item.parentId,
        key: item.key,
        name: item.name,
        enable: checkedKeys.indexOf(item.id) !== -1,
        fixed: item.fixed
      }))

      const getChildren = (parentNode) => {
        parentNode = {
          ...parentNode,
          enable: checkedKeys.indexOf(parentNode.id) !== -1,
          children: null
        }
        const children = checkedNodes.filter(item => (item.parentId === parentNode.id))
        if (children.length) {
          parentNode.children = children.map(item => getChildren(item))
        }
        return parentNode
      }
      const checkedTreeNode = getChildren(checkedNodes.find(item => item.id === 'all'))
      return checkedTreeNode.children
    },
    /**
     * 查找报告内容树结构
     * @param {any} arr
     * @returns {any}
     */
    findTree (arr) {
      arr.forEach(item => {
        if (item.children && item.children.length) {
          item.children.forEach(itemm => {
            if (this.termList.includes(itemm.id)) {
              this.echoData.push(itemm)
            }
          })
        }
      })
    },
    // 确认
    onClickSureContent () {
      this.echoData = []
      this.termList = this.$refs.tree.getCheckedNodes(false, true).filter(item => item.id !== 'all').map(item => item.id)
      this.findTree(this.inspireTree[0].children)
    },

    // 重置
    reset () {
      this.echoData = []
      this.$refs.tree.setCheckedKeys(this.resetDefaultData)
      this.onClickSureContent()
    }
  }
}
</script>

<style scoped lang="scss">
.report-center {
  display: flex;

  .form-data {
    flex: 1;
    height: 400px;
    overflow-y: auto;
    padding: 10px 0;
    box-sizing: border-box;
    border: 1px solid #dcdcdc;
  }

  .operating {
    width: 100px;
    position: relative;

    .el-button:nth-child(1) {
      position: absolute;
      left: 22px;
      top: 183px;
      margin: 0;
    }
  }

  .to-data {
    flex: 1;
    height: 400px;
    overflow-y: auto;
    padding: 10px 0;
    box-sizing: border-box;
    border: 1px solid #dcdcdc;

    ul {
      list-style-type: none;
      padding: 0 15px;
      margin: 0;

      li {
        margin: 8px 0;
        line-height: 24px;
      }
    }
  }
}

:deep(.el-tag.el-tag--info) {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}
</style>
