<template>
  <el-tooltip v-if="license" :disabled="disabled" effect="dark" :content="levelText" placement="top">
      <span class="level-tag" v-bind="$attrs" v-on="$listeners" :class="{
    'gray': levelDict.indexOf(levelText) === -1,
    'danger': levelText === '高风险',
    'warning': levelText === '中风险',
    'primary': levelText === '低风险'
   }">
        <slot :text="levelText">{{ levelText }}</slot>
     </span>
  </el-tooltip>
  <span v-else class="level-tag" v-bind="$attrs" v-on="$listeners" :class="{
    'gray': levelDict.indexOf(levelText) === -1,
    'severity': levelText === '严重',
    'danger': levelText === '高危',
    'warning': levelText === '中危',
    'primary': levelText === '低危',
    'success': levelText === '无漏洞'
   }">
    <slot :text="levelText">{{ levelText }}</slot>
  </span>
</template>
<script>
export default {
  name: 'LevelTag',
  props: {
    level: {
      type: [Number, String],
      default () {
        return 0
      }
    },
    disabled: {
      type: Boolean
    },
    license: {
      type: Boolean
    }
  },
  computed: {
    levelText () {
      let text = this.level
      if (typeof this.level === 'number') {
        text = this.level - 1 >= 0 ? this.levelDict[this.level - 1] : this.level
      }
      return text
    },
    levelDict () {
      return this.license ? ['高风险', '中风险', '低风险'] : ['严重', '高危', '中危', '低危', '无漏洞']
    }
  }
}
</script>
