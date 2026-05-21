<template>
  <div :class="['is-sortable cursor-pointer', ...classNames ]" @click="handleClick()">
    <slot>{{label}}</slot>
    <span class="caret-wrapper">
      <i class="sort-caret ascending" @click.stop="handleClick(2, 'ascending')"></i>
      <i class="sort-caret descending" @click.stop="handleClick(1, 'descending')"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'TableSort',
  props: {
    sortField: {
      type: Array,
      default: () => [],
      required: true
    },
    sortType: {
      type: Array,
      default: () => [],
      required: true
    },
    sortOrders: {
      type: Array,
      default: () => ['descending','ascending',null]
    },
    prop: {
      type: String,
      required: true
    },
    label: {
      type: String
    }
  },
  data() {
    return {
      // i: 0,
      mapping: {
        1: 'descending',
        2: 'ascending'
      }
    }
  },
  computed: {
    classNames() {
      if (this.sortField[0] === this.prop) {
        return [ this.sortType[0] === 1 ? 'descending' : this.sortType[0] === 2 ? 'ascending' : null]
      }else {
        return []
      }
    },
    i() {
      if (this.sortField[0] === this.prop) {
        return this.sortOrders.findIndex(item => this.mapping[this.sortType[0]] === item) + 1
      }else {
        return  0
      }
    }
  },
  methods: {
    handleClick(order, s) {
      if (order) {
        const res = (this.sortType[0] === order && this.prop === this.sortField[0]) ? [] :  [order]
        this.$emit('update:sort-type', res)
        this.$emit('update:sort-field', res.length ? [this.prop] : [])
      }else {
        const o = this.sortOrders[this.i]
        const res = o === 'descending' ? [1] : o === 'ascending' ? [2] : []
        this.$emit('update:sort-type', res)
        this.$emit('update:sort-field', res.length ? [this.prop] : [])
      }
      this.$emit('change')
    }
  }
}
</script>
