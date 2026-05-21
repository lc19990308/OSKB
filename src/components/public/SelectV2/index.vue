<template>
  <el-select
    ref="select"
    :popper-class="'virtualSelect ' + popperClass"
    filterable
    :filter-method="remoteMethod"
    @visible-change="visiblePopup"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <slot></slot>
    <virtual-list style="max-height: 200px; overflow-y: auto; overflow-x: hidden;scrollbar-width: thin;"
                  ref="virtual"
                  :data-key="extraProps.value"
                  :data-sources="virtualOptions"
                  class="scrollbar-custom"
                  :data-component="component ? component : optionItem"
                  :keeps="30"
                  :estimate-size="35"
                  :extra-props="extraProps"
    >
    </virtual-list>
  </el-select>
</template>
<script setup>
import {defineExpose, ref, nextTick, watch} from 'vue'
import { useApp } from '@/hooks/useApp'
import virtualList from 'vue-virtual-scroll-list'
import { fuzzyQuery } from '@/utils'
import optionItem from '@/components/public/SelectV2/optionItem'

const { refs } = useApp()

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
    required: true
  },
  extraProps: {
    type: Object,
    default: () => ({
      label: 'label',
      value: 'value'
    })
  },
  component: {
    type: Object,
    default: undefined
  },
  popperClass: {
    type: String,
    default: ''
  }
})

const virtualOptions = ref([])


const remoteMethod = (query) => {
  if (query !== '') {
    virtualOptions.value = fuzzyQuery(props.options, query, props.extraProps.label)
  } else {
    virtualOptions.value = props.options.slice();
  }

  refs.virtual?.reset()
}

const visiblePopup = (v) => {
  if(v) {
    refs.virtual?.reset()
    nextTick(() => {
      virtualOptions.value = props.options.slice();
    });
  }
}

const instance = () => {
  return refs.select
}

watch(() => props.options, visiblePopup)

defineExpose({ instance })

</script>
<script>
export default {name:'ElSelectV2'}
</script>
<style>
.virtualSelect .el-scrollbar .el-scrollbar__bar.is-vertical{
  width: 0;
}
</style>
