<template>
  <el-popover
    :placement="placement"
    :width="width"
    :visible-arrow="true"
    popper-class="config-table__popper"
    v-model="visible"
    trigger="click">
    <div class="operating" style="padding: 13px 15px 9px 15px;">
      <span class="reset" @click="reset">重置</span>
      <el-checkbox style="padding: 0;" v-model="checkedAll" @change="checkAll">全选</el-checkbox>
      <span class="font-sm" style="color: #bbbbbb;"> {{ selected_total }}/{{ total }}</span>
    </div>
    <div style="padding:5px 0;">
      <el-checkbox-group v-model="checkList" @change="confirm">
        <draggable
          v-model="rawData"
          :move="onMove"
          @input="draggableConfirm"
          v-bind="{
          animation: 300,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost',
          filter:'.undraggable'
        }">
          <template v-for="item in rawData">
            <el-checkbox
              v-if="item.label !== '所属项目'"
              :class="['block', item.disabled ? 'undraggable' : 'draggable']"
              @change="changeTable(item)"
              :checked="item.checked"
              :key="item.label"
              :label="item.label"
              :disabled="item.disabled">
              {{ item.label }}
              <i class="el-icon-rank"></i>
            </el-checkbox>
            <el-checkbox
              v-else-if="project_id === -1"
              class="block"
              @change="changeTable(item)"
              :checked="item.checked"
              :key="item.label"
              :label="item.label"
              :disabled="item.disabled">
            </el-checkbox>
          </template>
        </draggable>
      </el-checkbox-group>
    </div>
    <span slot="reference" :class="['el-icon-s-tools', { 'text-primary': visible }]"></span>
  </el-popover>
</template>
<script>
import { deepClone, diff, get, isObject } from '@/utils'
import store from '@/store/store'
import { sessionStore } from '@/utils/storage'
import draggable from 'vuedraggable'

export default {
  name: 'configTable',
  components: {
    draggable
  },
  props: {
    value: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    placement: {
      type: String,
      default: 'bottom-end'
    },
    sessionKey: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 210
    },
    change: {
      type: Function,
      default: () => {
      }
    }
  },
  data () {
    return {
      checkList: [], // 选中的数据
      checkedAll: false, // 全选选中状态
      rawData: [], // 本组件需要操作的数据，
      defaultData: [],
      visible: false,
      CONFIG_TABLE: {},
      fixedList: []
    }
  },
  computed: {
    project_id () {
      return store.state.home.project.id
    },
    total () {
      if (this.defaultData.findIndex(col => col.label === '所属项目') > -1) {
        if (this.project_id === -1) {
          return this.defaultData.length
        } else {
          return this.defaultData.length - 1
        }
      } else {
        return this.defaultData.length
      }
    },
    selected_total () {
      return (this.rawData.filter(col => {
        if (col.label === '所属项目' && this.project_id !== -1) {
          return false
        }
        return col.checked
      }) || []).length
    }
  },
  methods: {
    onMove(e) {
      const { relatedContext } = e
      const { index } = relatedContext
      return !this.fixedList.includes(index)
    },
    draggableConfirm () {
      this.confirm()
    },
    // 选择显示的字段
    changeTable (value) {
      value.checked = !value.checked
      // 全选选中状态
      this.checkedAll = this.rawData.filter(item => item.checked).length === this.rawData.length
    },

    // 全选/反选
    checkAll () {
      this.checkList = []
      if (this.checkedAll) {
        this.rawData.forEach(item => {
          this.checkList.push(item.label)
          item.checked = true
        })
      } else {
        this.rawData.forEach(item => {
          if (item.disabled) {
            this.checkList.push(item.label)
          } else {
            item.checked = false
          }
        })
      }
      this.confirm()
      this.visible = false
    },

    // 确认
    confirm () {
      // 将选中的数据返回父组件
      this.change(deepClone(this.rawData))
      this.CONFIG_TABLE[this.sessionKey] = deepClone(this.rawData)
      this.cache()
    },
    // 重置
    reset () {
      this.checkList = []
      // 和保存的默认数据对比，重置数据的选中状态
      this.$set(this, 'rawData', deepClone(this.defaultData))
      this.rawData.forEach(item => {
        if (item.checked) {
          this.checkList.push(item.label)
        }
      })
      this.checkedAll = this.rawData.filter(item => item.checked).length === this.rawData.length
      this.confirm()
      this.visible = false
    },
    // 缓存到session
    cache () {
      if (this.sessionKey) sessionStore.set('CONFIG_TABLE', this.CONFIG_TABLE)
    },
    // 获取缓存到session记录
    getCache () {
      if (get(this.CONFIG_TABLE, this.sessionKey)) {
        this.rawData = get(this.CONFIG_TABLE, this.sessionKey)
        if (!diff(this.rawData, this.value)) {
          this.$nextTick(this.confirm)
        }
      } else {
        this.rawData = deepClone(this.value)
        this.CONFIG_TABLE[this.sessionKey] = this.rawData
        this.cache()
      }
    }
  },
  mounted () {
    // 缓存到session
    if (this.sessionKey) {
      this.getCache()
    } else {
      this.rawData = deepClone(this.value)
    }
    this.defaultData = deepClone(this.value)
    this.checkedAll = this.rawData.filter(item => item.checked).length === this.rawData.length

    this.fixedList = this.rawData.reduce((acc, cur, index) => {
      if (cur.disabled) { acc.push(index) }
      return  acc
    }, [])

  },
  created () {
    const CONFIG_TABLE = sessionStore.get('CONFIG_TABLE')
    if (CONFIG_TABLE && isObject(CONFIG_TABLE)) {
      this.CONFIG_TABLE = CONFIG_TABLE
    } else {
      sessionStore.set('CONFIG_TABLE', {})
    }
  }
}
</script>

<style lang="scss">
.config-table__popper {
  padding: 0 !important;
}

</style>

<style scoped lang="scss">
.config-table {
  line-height: normal;
}

.el-icon-s-tools {
  display: flex;
  justify-content: center;
  line-height: normal;
  font-weight: bold;
  position: relative;
  cursor: pointer;
  border-radius: 7px;
  padding: 2px 0 0 0;
  vertical-align: middle;
  font-size: 18px;
  box-sizing: border-box;
  transition: all 0.5s;
  color: #666666;

  &:hover, &:focus, &:active {
    color: #A78BFA;
  }

  &:active, &:focus {
    outline: none;
  }
}

.el-icon-s-tools.text-primary {
  color: #A78BFA;
}

.operating {
  border-bottom: 1px solid #DCDEE0;

  .confirm {
    float: right;
    margin-right: 10px;
    color: #8B5CF6;
    cursor: pointer;
  }

  .reset {
    float: right;
    color: #8B5CF6;
    cursor: pointer;
  }
}

.draggable {
  cursor: move;

  .el-checkbox__label {
    cursor: pointer;
  }

  .el-checkbox__input {
    cursor: pointer;
  }

  &:hover {
    background: #F3F6F9;

    .el-icon-rank {
      opacity: 1;
      cursor: move;
    }
  }
}
:deep(.el-checkbox) {
  padding: 5px 15px;
  margin-right: 0 !important;
  transition: background-color 0.5s;
  position: relative;

  .el-icon-rank {
    position: absolute;
    right: 15px;
    top: 50%;
    font-size: 16px;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.4s;
    color: #333333 !important;
  }
}


</style>
