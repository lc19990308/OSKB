<template>
  <div class="table-footer-bar__container">
    <transition name="fade">
      <div class="table-footer-bar" v-show="visible">
        <div class="m-r-15" style="flex-shrink: 0;width: 145px;">
          <el-checkbox
            :disabled='tableCheckboxDisabled'
            :indeterminate='tableCheckboxIndeterminate'
            @input='tableCheckboxInput'
            :value='tableCheckboxValue'>
            全选
          </el-checkbox>
          <span class="p-l-15">已选{{ multipleSelection }}条</span>
        </div>
        <div class="table-footer-btns">
          <slot></slot>
        </div>
        <span class="el-icon-close" @click="close"></span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TableFooterBar',
  props: {
    table: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      visible: false
    }
  },
  watch: {
    multipleSelection (newValue, oldValue) {
      if (newValue > 0) {
        this.visible = true
      } else if (newValue <= 0) {
        this.visible = false
      }
    }
  },
  computed: {
    tableCheckboxDisabled () {
      return this.table.store?.states?.data && this.table?.store?.states?.data?.length === 0
    },
    tableCheckboxIndeterminate () {
      return this.table.store?.states?.selection?.length > 0 && !this.tableCheckboxValue
    },
    tableCheckboxValue () {
      return this.table.store?.states?.isAllSelected
    },
    multipleSelection () {
      return this.table.store?.states?.selection?.length
    }
  },
  methods: {
    tableCheckboxInput (...arg) {
      this.table.toggleAllSelection(...arg)
    },
    close() {
      this.table.clearSelection()
      this.visible = false
    }
  },
  mounted () {
    const container = document.body.querySelector('.el-main.main') ? document.body.querySelector('.el-main.main') : document.body
    container.append(this.$el)
  },
  destroyed () {
    this.$el.parentNode?.removeChild(this.$el)
  }
}
</script>

<style scoped lang="scss">
.table-footer-bar__container {
  position: fixed;
  bottom: 5px;
  z-index: 1000;
  left: 50%;
  transform: translateX(-55%);
}

.table-footer-bar {
  border-radius: 3px;
  background: rgba(52, 52, 52, 90%);
  box-shadow: 0 0 8px 0 #2B75B726;
  min-width: 550px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  position: relative;
  color: #BCBCC2;

  :deep(.el-checkbox__label) {
    color: #BCBCC2 !important;
  }

  .table-footer-btns {
    flex: 1;
    text-align: right;
    white-space: nowrap;
    padding-right: 30px;
  }

  .el-icon-close {
    position: absolute;
    right: 15px;
    top: 50%;
    font-size: 18px;
    cursor: pointer;
    transform: translateY(-50%);
    color: #FFFFFF7F;

    &:hover {
      color: red;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter, .fade-leave-to {
  transform: scale(0.5);
  opacity: 0;
}

</style>
