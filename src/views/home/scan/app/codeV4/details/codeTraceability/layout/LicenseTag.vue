<template>
  <el-tooltip v-if="license" :disabled="disabled" effect="dark" :content="levelText || '未知风险'" placement="top">
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
<style scoped lang="scss">
.level-tag{
  padding: 2px 5px;
}

.success {
  color: $color-success;
  border: 1px solid rgba($color-success,0.4);
  background-color: rgba($color-success, 0.15);
}

.info {
  color: $color-info;
  border: 1px solid rgba($color-info,0.4);
  background-color: rgba($color-info, 0.15);
}

.primary {
  color: $color-primary;
  border: 1px solid rgba($color-primary,0.4);
  background-color: rgba($color-primary, 0.15);
}

.warning {
  color: $color-warning;
  border: 1px solid rgba($color-warning,0.4);
  background-color: rgba($color-warning, 0.15);
}

.danger {
  color: $color-danger;
  border: 1px solid rgba($color-danger,0.4);
  background-color: rgba($color-danger, 0.15);
}

.severity {
  color: $color-serious;
  border: 1px solid rgba($color-serious,0.4);
  background-color: rgba($color-serious, 0.15);
}

.gray {
  color: $text-color-secondary;
  border: 1px solid rgba( $text-color-secondary,0.4);
  background-color: rgba($text-color-secondary, 0.15);
}
</style>
