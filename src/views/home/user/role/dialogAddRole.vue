<template>
  <el-dialog
    :title="type === 'add'?'添加角色':'编辑角色'"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-row>
      <el-col :offset="4" :span="15">
       <div class="role-input-wrap">
         <div class="title">角色名称：</div>
         <el-input
           class="role-input"
           placeholder="请填写角色名称"
           size="medium"
           v-model="name">
         </el-input>
       </div>
      </el-col>
      <el-col :offset="4" :span="15">
        <div class="role-input-wrap">
          <div class="title" style="vertical-align: top;">描述：</div>
          <el-input
              type="textarea"
              class="role-input"
              placeholder="请填写描述"
              size="medium"
              v-model="description">
          </el-input>
        </div>
      </el-col>
      <el-col :span="24">
        <el-scrollbar class="scrollbar-hide-x" style="height: 400px;">
          <el-tree
            ref="tree"
            :data="tree"
            default-expand-all
            show-checkbox
            @check="changeCheck"
            :default-checked-keys="activePower"
            node-key="id">
          </el-tree>
        </el-scrollbar>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { MENUS } from '@/utils/conf'
import { powerTree, roleAdd, roleUpdate } from '@/api/home/user/index'
import { mapState } from 'vuex'

export default {
  name: 'dialogAddRole',
  data () {
    return {
      type: 'add',
      id: '',
      tree: [],
      dialogVisible: false,
      name: '',
      description: '',
      activePower: [],
      activeParentPower: [],
      defaultId: 1
    }
  },
  computed: {
    ...mapState({
      showViewSetting: state => state.site.showViewSetting,
      homologyEnable: state => state.site.homologyEnable,
      imageEnable: state => state.site.imageEnable,
      binaryEnable: state => state.site.binaryEnable,
      sourceCheckEnable: state => state.site.sourceCheckEnable
    })
  },
  methods: {
    // 取消
    cancel () {
      this.activePower = []
      this.activeParentPower = []
      this.name = ''
      this.description = ''
      this.dialogVisible = false
    },

    confirm () {
      if (this.type === 'add') {
        this.submitAdd()
      } else {
        this.submitEdit()
      }
    },
    handleClose (done) {
      done()
    },

    // 添加角色的时候执行
    submitAdd () {
      const powers = this.activePower.concat(this.activeParentPower).filter(x => {
        return x > 0
      })
      if (powers.length === 0) {
        this.$message.error('未选择角色权限！')
        return 0
      }
      roleAdd({
        name: this.name,
        description: this.description,
        permission: powers
      }).then(response => {
        this.$message.success('操作成功！')
        this.dialogVisible = false
        this.activePower = []
        this.activeParentPower = []
        this.name = ''
        this.$emit('callback')
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 编辑角色的时候执行
    submitEdit () {
      const powers = this.activePower.concat(this.activeParentPower).filter((item, index, arr) => {
        return item > 0 && arr.indexOf(item, 0) === index
      })
      if (powers.length === 0) {
        this.$message.error('未选择权限！')
        return 0
      }
      roleUpdate({
        id: this.id,
        name: this.name,
        description: this.description,
        permission: powers
      }).then(response => {
        this.$message.success('操作成功！')
        this.dialogVisible = false
        this.activePower = []
        this.activeParentPower = []
        this.name = ''
        this.$emit('callback')
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    initRole () {
      const run = (item) => {
        if (item.sub) {
          this.activeParentPower.push(item.id)
          item.sub.forEach(run)
        } else {
          this.activePower.push(item.id)
        }
      }
      powerTree({
        roleId: this.id
      }).then(response => {
        this.activePower = []
        this.activeParentPower = []
        if (response.data) { response.data.forEach(run) }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // 解析菜单转化成树结构
    initTree (children) {
      return children.filter(item => {
        if (item.href === '/scan/app/v4_code') return false
        switch (item.text) {
          case '界面配置':
            return this.showViewSetting !== 1
          case '二进制成分分析':
            return this.binaryEnable
          case '代码溯源分析':
            return this.homologyEnable || this.sourceCheckEnable
          case '镜像安全扫描':
            return this.imageEnable
          case '镜像':
            return this.imageEnable
          default:
            return true
        }
      }).map(item => {
        this.defaultId++
        const x = {}
        if (item.powerId) {
          x.id = item.powerId
          x.powerId = item.powerId
        } else {
          x.id = this.defaultId * -1
        }
        if (item.text) {
          x.label = item.text
        }
        if (item.submenu) {
          x.children = this.initTree(item.submenu)
        }
        if (item.ops) {
          x.children = this.initTree(item.ops)
        }
        return x
      })
    },

    // 选择的时候执行
    changeCheck (data, nodes) {
      this.activePower = nodes.checkedKeys
      this.activeParentPower = nodes.halfCheckedKeys
    },

    // 打开窗口时的回调
    open () {
      this.activePower = []
      this.activeParentPower = []
      this.tree = [{
        id: -1,
        label: '全选',
        children: this.initTree(MENUS)
      }]

      if (this.type === 'edit' && this.id !== '') {
        this.initRole()
      } else {
        this.name = ''
        this.description = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.role-input-wrap {
  margin-bottom: 20px;

  .title {
    display: inline-block;
    width: 70px;
  }

  .role-input {
    max-width: 260px;
  }
}
</style>
