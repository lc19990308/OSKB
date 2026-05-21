<script>
import ConfigTable from '@/components/public/DynamicTable/ConfigTable'
import TableEmpty from '@/components/public/DynamicTable/TableEmpty'
import TableFooterBar from '@/components/public/DynamicTable/TableFooterBar'
import Vue from 'vue'
import { get, compact } from '@/utils'
import hostMethods from '@/components/public/DynamicTable/hostMethods'

let key = 0
export default {
  name: 'ElTableDynamic',
  components: {
    TableEmpty,
    TableFooterBar
  },
  mixins: [hostMethods],
  inheritAttrs: false,
  props: {
    dynamicOptions: {
      type: Object,
      default: () => {
        return {
          columns: [],
          uuid: '',
          to: null
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    columns: {
      get () {
        return this.dynamicOptions.columns
      },
      set (v) {
        this.$emit('update:dynamicOptions', {
          ...this.dynamicOptions,
          columns: v
        })
      }
    },
    isItDynamic(){
      return this.dynamicOptions.to && this.dynamicOptions.uuid
    }
  },
  mounted () {
    if (this.isItDynamic){
      this.tableConfigInstances = []
      this.$nextTick(() => this.mountConfig())
    }
  },
  destroyed () {
    if (this.isItDynamic) {
      this.tableConfigInstances.forEach(instance => instance.$destroy())
    }
  },
  methods: {
    mount (cell) {
      const Constructor = Vue.extend(ConfigTable)
      const instance = new Constructor({
        propsData: {
          value: this.columns,
          sessionKey: this.dynamicOptions.uuid,
          change: (val) => {
            this.columns = val
          }
        }
      }).$mount()
      cell.append(instance.$el)
      this.tableConfigInstances.push(instance)
    },
    mountConfig () {
      this.$el.querySelectorAll('.cell').forEach(cell => {
        if (cell.innerText === this.dynamicOptions.to) {
          const elm = cell.querySelector('.config-table')
          if (cell.contains(elm)) return
          cell.style.display = 'grid'
          cell.style.gridTemplateColumns = '60% 40%'
          this.mount(cell)
        }
      })
    },
    generateNodes() {
      // this.projectMixin.id;
      let defaults = []
      if ( this.isItDynamic ) {
        const child = this.$scopedSlots.default().filter(vNode => {
          const label = get(vNode, 'componentOptions.propsData.label')
          const item = this.columns.find(item => item.label === label)
          if (label && label !== this.dynamicOptions.to) {
            vNode.key = vNode.key ? (vNode.key + key++) : label ? (label + key++) : key++
          }
          return item ? item.checked : true
        })
        const record = []
        child.forEach(vnode => {
          const label = get(vnode, 'componentOptions.propsData.label')
          const i = this.columns.findIndex(column => column.label === label)
          if (i === -1) {
            record.push(vnode)
          }else {
            defaults[i] = vnode
          }
        })
        defaults = [].concat(record, compact(defaults))
        this.$nextTick(() => this.$refs.table.doLayout())
      } else {
        defaults = this.$scopedSlots.default()
      }
      return defaults
    }
  },
  render () {
    return (
      <el-table-host ref="table" {...{
        attrs: this.$attrs,
        on: this.$listeners
      }}>
        <table-empty slot={'empty'}/>
        { this.generateNodes() }
        {
          this.$scopedSlots.bar && (
            <table-footer-bar table={this.$refs.table}>
              {this.$scopedSlots.bar()}
            </table-footer-bar>
          )
        }
      </el-table-host>
    )
  }
}
</script>