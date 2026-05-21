<template>
  <li class="folder-children clearfix">
    <div
      :class="['file_fold', { file_fold_active:  currentActive.id=== data.id }] "
      @click="handleClick"
      :style="{
        paddingLeft: paddingLeft
      }"
    >
      <i :style="{visibility: !data.isFile && isChildren ? '' : 'hidden' }"
         :class="['el-icon-arrow-right', { rotate: state }]">
      </i>
      <span class="file_title">
         <i v-if="loading" class="el-icon-loading text-primary font-md m-r-5" ></i>
         <span v-else-if="!data.isFile" :class="['font-xl', 'folder-icon', (state && isChildren) ?  'el-icon-folder-opened' : 'el-icon-folder']"></span>
         <span v-else class="icona-wenjian1 font-lg iconfont"></span>
         <el-badge is-dot :type="data.signStatus === 0 ? 'warning' : 'success'" class="custom-badge"></el-badge>
         <span class="m-r-5 file_title-content">
           <node-content :data="data" :node="node" :props="props"></node-content>
         </span>
      </span>
    </div>
    <ul class="folder-sub" v-if="!data.isFile && isChildren && state">
      <folder-children
        v-on="$listeners"
        v-for="(item, idx) in get(data, props.children, [])"
        :data="item"
        :z-idx="zIndex"
        :index="idx"
        :props="props"
        :load="load"
        :key="data.id + data[props.label] + '子集' + idx"
      >
      </folder-children>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'FolderChildren',
  components: {
    NodeContent: {
      props: {
        data: {
          required: true
        },
        node: {
          required: true
        },
        props: {
          type: Object,
          default: () => ({
            children: 'children',
            label: 'label'
          })
        }
      },
      render () {
        const parent = this.$parent
        const data = this.data
        const node = this.node
        const folder = parent.folder
        return (
          folder.$scopedSlots.default
            ? folder.$scopedSlots.default({ data, node })
            : data[this.props.label]
        )
      }
    }
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    load: Function,
    props: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label'
      })
    },
    zIdx: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    }
  },
  inject: ['active', 'setActive'],
  data () {
    return {
      state: false,
      folder: null,
      zIndex: 0,
      status: {
        1: 'danger',
        2: 'success',
        3: 'warning'
      },
      loading: false
    }
  },
  created () {
    const parent = this.$parent
    if (parent.isFolder) {
      this.folder = parent
    } else {
      this.folder = parent.folder
    }
    this.zIndex = this.zIdx ? this.zIdx + 1 : this.zIndex + 1
  },
  // mounted () {
  //   this.init()
  // },
  computed: {
    paddingLeft () {
      const value = (this.zIndex - 1) * 23
      return value + 'px'
    },
    isChildren () {
      return get(this.data, this.props.children, []).length > 0
    },
    node () {
      const obj = { parentNode: null }
      let z = this.zIndex
      const run = ($parent, o) => {
        o.parentNode = {
          data: $parent.data,
          node: $parent,
          parentNode: null
        }
        z--
        z > 1 && run($parent.$parent, o.parentNode)
      }
      z > 1 && run(this.$parent, obj)
      return {
        node: this,
        data: this.data,
        index: this.index,
        zIndex: this.zIndex,
        parentNode: obj.parentNode,
        active: this.currentActive
      }
    },
    currentActive () {
      return this.active()
    }
  },
  methods: {
    init () {
      if (this.zIndex === 1 && this.index === 0) {
        this.handleClick()
      }
    },
    handleClick () {
      this.setActive(this.data)
      this.$emit('node-click', this.node)
      if (this.loading || this.data.isFile) return
      if (typeof this.load === 'function' && !this.data[this.props.children] && this.state === false) {
        this.loading = true
        this.load(this.node, (data) => {
          this.$set(this.data, this.props.children, data)
          this.state = true
          this.loading = false
        })
      } else {
        this.state = !this.state
      }
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  list-style: none;
  padding: 0;
}

li {
  cursor: pointer;

  .file_fold {
    display: flex;
    align-items: center;
    padding: 5px;
    margin-bottom: 1px;
    transition: background-color 300ms ease;
    .el-icon-arrow-right {
      font-weight: bold;
      margin-right: 8px;
      display: inline-block;
      color: #999999;
      //transition: all 0.1s;
    }

    .rotate {
      transform: rotate(90deg);
    }

    .file_title {
      display: flex;
      align-items: center;
      flex: 1;
      flex-shrink: 0;
      position: relative;

      .custom-badge {
        width: 10px;
        height: 10px;
        position: absolute;
        left: 12px;
        bottom:  0;
      }

      .folder-icon {
        color: #999999;
        margin-right: 8px;
      }

      .icona-wenjian1 {
        color: #999999;
        margin-right: 8px;
      }

      .file_title-content{
         flex: 1;
        display: flex;
        flex-shrink: 0;
        justify-content: space-between;
        white-space:nowrap;
      }
    }
  }

  .file_fold:hover {
    background: #F5F9FE;

    .el-icon-arrow-right{
      color: $color-primary !important;
    }

    .folder-icon {
      color: $color-primary !important;
    }

    .icona-wenjian1 {
      color: $color-primary !important;
    }

    .file_title {
      .file_title-content {
        color: $color-primary;
      }
    }
  }

  .file_fold_active {
    background: #F5F9FE;

    .el-icon-arrow-right{
      color: $color-primary !important;
    }

    .folder-icon {
      color: $color-primary !important;
    }

    .icona-wenjian1 {
      color: $color-primary !important;
    }

    .file_title {
      .file_title-content {
        color: $color-primary;
      }
    }
  }
}
</style>
