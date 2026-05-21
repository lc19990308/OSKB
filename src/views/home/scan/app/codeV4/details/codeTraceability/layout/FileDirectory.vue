<template>
  <div class="file-directory">
    <el-row class="p-r-15 p-l-15 m-b-15">
      <oss-button-search
        @search="getDirectory" placeholder="请输入目录名或文件名"
        v-model="params.keyword"
        size="medium"
        clearable>
      </oss-button-search>
    </el-row>
    <div style="text-align: right;" class="text-primary m-b-15 p-r-15 p-l-15">
      仅展示已匹配的代码文件
      <el-switch
        :inactive-value="0"
        :active-value="1"
        @change="getDirectory"
        v-model="params.isMatch">
      </el-switch>
    </div>
    <el-row>
      <el-scrollbar ref="scrollbar" class="hide-x">
        <Folder :props="defaultProps" :data="data" :loading="loading" ref="folder" @node-click="nodeClick">
          <span class="flex between" style="flex: 1;" slot-scope="{ data }">
            {{ data.name }}
          </span>
        </Folder>
      </el-scrollbar>
    </el-row>
  </div>
</template>

<script>
import Folder from './components/Folder'
import { getDirectory } from '@/api/home/assets/app/codeV4'
import to from '@/utils/await-to'
import { isObject } from '@/utils'
import { cloneDeep, has, isArray } from 'lodash-es'

export default {
  name: 'FileDirectory',
  components: { Folder },
  props: ['globalParams'],
  data () {
    return {
      name: '',
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      params: {
        isMatch: 1,
        keyword: undefined
      },
      data: []
    }
  },
  methods: {
    nodeClick (node) {
      const {
        parentNode,
        data
      } = node
      const paths = []
      paths.push({
        path: data.path,
        node: data
      })
      const run = (node) => {
        paths.unshift({
          path: node.data.path,
          node: node.data
        })
        node.parentNode && run(node.parentNode)
      }
      parentNode && run(parentNode)
      this.$emit('node-click', paths)
    },
    handleSelect (paths) {
      this.$refs.folder.setActive(paths[paths.length - 1].node)
    },
    async getDirectory () {
      this.loading = true
      const [err, res] = await to(getDirectory({
        ...this.params,
        ...this.globalParams,
        taskId: this.$route.query.taskId,
        loading: false
      }))
      this.loading = false
      if (isObject(err)) {
        this.$message.error(err.message)
      } else {
        const createKeysTree = (treeNode, parentKey) => {
          for (let i = 0, len = treeNode.length; i < len; i++) {
            const key = parentKey ? `${parentKey}-${i + 1}` : `${i + 1}`
            treeNode[i] = {
              ...treeNode[i],
              ...treeNode[i].data,
              id: key
            }
            if (has(treeNode[i], 'children') && isArray(treeNode[i].children)) {
              treeNode[i].children = createKeysTree(treeNode[i].children, key)
            }
          }
          return treeNode
        }

        this.data = createKeysTree(cloneDeep(this.get(res, 'data', [])))
        this.$refs.folder.init()
      }
    }
  },
  watch: {
    globalParams: {
      deep: true,
      handler () {
        this.getDirectory()
      }
    }
  }
  // created () {
  //   this.getDirectory()
  // }
}
</script>

<style scoped lang="scss">
.file-directory {
  width: 100%;
  border: 1px solid #FFFFFF;
  background-color: #FFFFFF;
  padding: 15px 0 0 0;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 4px;
}

:deep(.el-scrollbar) {
  height: calc(100vh - 380px);
  box-sizing: border-box;

  .el-scrollbar__wrap {
    margin-top: 0;
    overflow-x: hidden;
    height: 100%;
  }

  .is-horizontal {
    width: 340px;
    height: 10px;
    bottom: 0;
  }

  .is-vertical{
    background: #ffffff;
    width: 9px;
    right: 0;
  }
}
</style>
