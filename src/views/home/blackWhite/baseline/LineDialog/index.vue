<template>
  <el-dialog :visible.sync="visible" :title="title" width="620px" append-to-body modal-append-to-body
             :close-on-click-modal="false">
    <el-form ref="form" size="small" label-width="100px" style="padding: 0 30px 0 0;">
      <el-form-item label="发布厂商：">
        {{ obj.row.vendor || '--'}}
      </el-form-item>
      <el-form-item label="组件名称：">
        {{ obj.row.name || '--'}}
      </el-form-item>
      <el-form-item label="版本基线：" style="margin-bottom: 0;">
        <template v-if="versions.length">
          <div v-for="(version, index) in versions" :key="version + index" class="flex m-b-20" style="align-items: center;">
            <el-input :value="version" style="width: 325px;" readonly class="m-r-10"></el-input>
            <span class="btn-icon" @click="del(version, index)">
              <i class="el-icon-close"></i>
            </span>
            <span class="btn-icon" v-if="index === versions.length-1" @click="$refs.popover.show(version)">
              <i class="el-icon-plus"></i>
            </span>
          </div>
        </template>
        <template v-else>
          <el-link type="primary" @click="$refs.popover.show()" :underline="false">点击设置</el-link>
        </template>
      </el-form-item>
      <popover v-if="visible" ref="popover" @change="popoverCallback"></popover>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="versions.length <= 0" size="medium" class="w-70" @click="submit">保存</el-button>
      <el-button @click="cancel" size="medium" class="w-70">取消</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, defineExpose, nextTick, defineEmits } from 'vue'
import Popover from './popover'
import { useApp } from '@/hooks/useApp'
import { awaitTo, handleTheResponse, pick, deepClone } from '@/utils'
import { componentBaselineAppend, componentBaselineUpdate } from '@/api/home/blackwhite/baseline'

const emit = defineEmits(['change'])
const { refs } = useApp()
const visible = ref(false)
const title = ref('dialog')
const versions = ref([])
const obj = reactive({ row: {} })

const open = (row, type) => {
  visible.value = true
  title.value = type ? '编辑' : '版本基线'
  obj.row = deepClone(row)
  versions.value = deepClone(get(row, 'versions', []))
  nextTick(() => {
    refs.popover && refs.popover.getVersions(obj.row)
  })
}

const cancel = () => {
  visible.value = false
}

const submit = async () => {
  if (title.value === '编辑') {
    const [error, res] = await awaitTo(componentBaselineUpdate({
      id: obj.row.id,
      versions: versions.value
    }))
    handleTheResponse(error, () => {
      visible.value = false
      emit('change')
    })
  } else {
    const [error, res] = await awaitTo(componentBaselineAppend({
      ...pick(obj.row, ['vendor', 'language', 'name']),
      versions: versions.value
    }))
    handleTheResponse(error, () => {
      visible.value = false
      emit('change')
    })
  }
}

const del = (version, index) => {
  versions.value.splice(index, 1)
  refs.popover.hide()
}

const popoverCallback = (version) => {
  versions.value.push(version)
}

defineExpose({
  open
})

</script>

<script>
export default {
  name: 'LineDialog'
}
</script>

<style lang="scss" scoped>
.btn-icon {
  display: inline-block;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  text-align: center;
  cursor: pointer;
  color: #2C5F8A;
  background: #EDE9FE;
  transition: all 0.2s;
  margin-right: 10px;
  position: relative;

  i {
    font-weight: bold;
  }

  &:hover {
    color: #8BAAC4;
    background: #EDE9FE;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 10%);
  }
}

:deep(.el-dialog__body) {
  padding-bottom: 15px !important;
}
</style>
