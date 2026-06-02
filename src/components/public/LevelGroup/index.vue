<template>
  <div :class="[plain ? 'level-group-plain' : 'level-group']" :style="{cursor: $listeners.click ? 'pointer' : 'null'}">
      <template v-for="(item, index) in value">
         <span v-if="item !== null && plain" @click.stop="$emit('click', index + 1)"
               :style="{'border-color': item ? colors[index] : 'rgba(153, 153, 153, 0.15)', color:  item ? colors[index] : '#8B9CB0'}">
              {{tooltip[index]}}<i class="vertical-bar">|</i>{{ item }}
         </span>
        <el-tooltip v-else-if="item !== null" :disabled="disabled" effect="dark" :content="tooltip[index] + (item === 0 ? '' : ('：' + item))" placement="top">
            <span @click="$emit('click', index + 1)" :style="{background: item ? colors[index] : 'rgba(153, 153, 153, 0.15)', color:  item ? '#ffffff' : '#8B9CB0'}">
              {{ item }}
            </span>
        </el-tooltip>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => [0, 0, 0, 0]
  },
  plain: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  layout: {
    type: Object,
    default: () => ({
      colors: [],
      tooltip: null
    })
  }
})

const colors = computed(() => {
  const defaultColors = ['#8B1A1A', '#D9534F', '#D4932A', '#2C5F8A']
  return props.layout.colors.length > 0 ? props.layout.colors : defaultColors
})


const tooltip = computed(() => {
  return  props.layout.tooltip || ['严重', '高危', '中危', '低危']
})

</script>
<style lang="scss" scoped>
.level-group {
  display: flex;
  text-align: center;

  span {
    min-width: 16px;
    padding: 0 3px;
    flex-shrink: 0;
    line-height: 22px;
    font-size: 12px;
    color: #ffffff;
    display: inline-block;
    border-radius: 4px;
    margin-right: 3px;

    &:last-child {
      margin-right: 0;
    }
  }
}

.level-group-plain {
  display: flex;
  text-align: center;

  .vertical-bar {
    font-size: 14px;
    font-style: normal;
    padding: 0 7px;
    vertical-align: 1px;
  }

  span {
    border-radius: 2px;
    border-width: 1px;
    border-style: solid;
    padding: 5px 7px 4px 7px;
    font-size: 14px;
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
