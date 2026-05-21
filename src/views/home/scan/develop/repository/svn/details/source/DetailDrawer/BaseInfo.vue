<template>
  <info-wrap title="基本信息">
    <info-row>
      <info-item label="项目名称：" :span="24">
        {{ data.fullName || '-' }} <span class="level-tag primary" v-if="data.language">{{ data.language }}</span>
      </info-item>
    </info-row>
    <info-row>
      <info-item label="项目地址：" :span="24">{{ data.gitUrl || '-' }}</info-item>
    </info-row>
    <info-row>
      <info-item label="官网链接：" :span="24">{{ data.homepage || '-' }}</info-item>
    </info-row>
    <info-row>
      <info-item label="创建时间：" :span="24">{{ data.createDate || '-' }}</info-item>
    </info-row>
    <info-row>
      <info-item label="项目描述：" :span="24">{{ data.description || '-' }}</info-item>
    </info-row>
  </info-wrap>
</template>
<script>

export default {
  name: 'BaseInfo',
  data () {
    return {}
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
