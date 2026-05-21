<template>
  <el-form-item label=" " v-show="visible">
    <div class="popover-box compound-search-box">
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <el-select class="customize-select" @change="compareTypeChangeV1" style="width: 100px;" v-model="v1.symbol" placeholder="请选择">
          <el-option
            v-for="item in rangeOptionsV1"
            :key="'v1-' + item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select-v2  ref="select1"
                       @change="v1VersionChange"
                       :options="v1.calcVersionOptions"
                       v-model="v1.version"
                       :extra-props="{ label: 'version', value: 'version' }"
                       :component="optionItem"
                       popper-class="el-select-v2-1"
                       style="width: 205px;"
                       class="customize-input m-r-15"
                       placeholder="请选择组件版本基线"
                       size="small">
          <teleports to=".el-select-v2-1" reference=".el-scrollbar">
            <div class="e-checkbox-warp">
              <el-checkbox @change="calcVersions(v1)" v-model="v1.noLoopholes">仅查看无漏洞组件版本</el-checkbox>
            </div>
          </teleports>
        </el-select-v2>
        <el-checkbox element-loading-spinner="el-icon-loading" v-if="['(a,)', '[a,)'].includes(v1.symbol) && v2.sourceVersionOptions.length" @change="checkboxChange" v-model="and">并且</el-checkbox>
        <i class="el-icon-loading text-primary" v-else-if="loadingV2"></i>
      </div>
      <div style="display: flex;align-items: center;margin-bottom: 20px;" v-show="and && v1.version && v2.sourceVersionOptions.length">
        <el-select @change="compareTypeChangeV2" class="customize-select" style="width: 100px;" v-model="v2.symbol" placeholder="请选择">
          <el-option
            v-for="item in rangeOptionsV2"
            :key="'v2-' + item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select-v2  ref="select2"
                       :disabled="loadingV2 || (v2.sourceVersionOptions.length <=0) "
                       @change="v2VersionChange"
                       :options="v2.calcVersionOptions"
                       v-model="v2.version"
                       :extra-props="{ label: 'version', value: 'version' }"
                       popper-class="el-select-v2-2"
                       :component="optionItem"
                       style="width: 205px;"
                       class="customize-input m-r-15"
                       :placeholder="loadingV2 ? '正在获取版本基线...' : '请选择组件版本基线'"
                       size="small">
          <teleports to=".el-select-v2-2" reference=".el-scrollbar">
            <div class="e-checkbox-warp">
              <el-checkbox @change="calcVersions(v2)" v-model="v2.noLoopholes">仅查看无漏洞组件版本</el-checkbox>
            </div>
          </teleports>
        </el-select-v2>
        <i class="el-icon-loading text-primary" v-if="loadingV2"></i>
      </div>
      <el-row style="padding: 20px 15px;background-color: rgba(242, 242, 242, 50%);border-radius: 8px;">
        基线范围：{{result}}
      </el-row>
      <el-row class="p-t-15 text-center">
        <el-button type="primary" :disabled="!(v1.version)" style="padding: 6px 5px;" size="mini" class="w-60 blue-btn" @click="confirm">确定</el-button>
        <el-button @click="visible = false" style="padding: 6px 5px;" size="mini" class="w-60">取消</el-button>
      </el-row>
    </div>
  </el-form-item>
</template>

<script setup>
import { reactive, ref, defineExpose, defineEmits } from 'vue'
import { useApp } from '@/hooks/useApp'
import optionItem from '../add/quick/optionItem'
import Teleports from '@/components/public/Teleport'
import ElSelectV2 from '@/components/public/SelectV2'
import { awaitTo, get, pick } from '@/utils'
import { versionList } from '@/api/home/blackwhite/baseline'

const emit = defineEmits(['change'])
const { handleTheResponse } = useApp()
const visible = ref(false)
const loadingV2 = ref(false)
const reg = new RegExp('a', 'g')
const rangeOptionsV1 = [
  {
    value: '(a,)',
    label: '大于',
    compareType: 'gt'
  },
  {
    value: '[a,)',
    label: '大于等于',
    compareType: 'ge'
  },
  {
    value: '(,a)',
    label: '小于',
    compareType: 'lt'
  },
  {
    value: '(,a]',
    label: '小于等于',
    compareType: 'le'
  },
  {
    value: '[a,a]',
    label: '等于',
    compareType: 'eq'
  },
  {
    value: '(,a) || (a,)',
    label: '不等于',
    compareType: 'ne'
  }
]
const rangeOptionsV2 = [
  {
    value: 'lt',
    label: '小于'
  },
  {
    value: 'le',
    label: '小于等于'
  }
]

const and = ref(false)
let row = null

const v1 = reactive({
  sourceVersionOptions: [],
  calcVersionOptions: [],
  noLoopholes: false,
  version: '',
  symbol: '(a,)'
})
const v2 = reactive({
  sourceVersionOptions: [],
  calcVersionOptions: [],
  noLoopholes: false,
  version: '',
  symbol: 'lt'
})

const result = ref('')

const show = async (version) => {
  if (visible.value) return
  v1.version = ''
  v1.symbol = '(a,)'
  v1.noLoopholes = false
  v2.version = ''
  v2.symbol = 'lt'
  v2.noLoopholes = false
  result.value = ''
  and.value = false
  v2.sourceVersionOptions = []
  compareTypeChangeV1('(a,)')
  visible.value = true
}

const hide = () => {
  visible.value = false
}

const getVersions = async (params) => {
  row = params
  const [error, response] = await awaitTo(versionList(pick(params, ['language', 'name', 'vendor'])))
  handleTheResponse(error, () => {
    v1.sourceVersionOptions = response.data || []
    calcVersions(v1)
  })
}

const getVersionsV2 = async (compareType) => {
  v2.version = ''
  v2.symbol = 'lt'
  loadingV2.value = true
  const [error, response] = await awaitTo(versionList({
    ...pick(row, ['language', 'name', 'vendor']),
    compareVersion: v1.version,
    compareType
  }))
  loadingV2.value = false
  handleTheResponse(error, () => {
    v2.sourceVersionOptions = response.data || []
    calcVersions(v2)
  })
}

const calcVersions = (select) => {
  select.calcVersionOptions = select.noLoopholes ? select.sourceVersionOptions.filter(item => item.security === 5) : select.sourceVersionOptions
}

const compareTypeChangeV1 = async (sy) => {
  if (v1.version) {
    v1VersionChange(v1.version)
  }
  and.value = ['(a,)', '[a,)'].includes(v1.symbol) ? and.value : false
}

const compareTypeChangeV2 = (sy) => {
  if (v2.version) v2VersionChange(v2.version)
}

const v1VersionChange = (ver) => {
  result.value = v1.symbol.replace(reg, ver)
  const compareType = get(rangeOptionsV1.find(item => item.value === v1.symbol), 'compareType')
  if (['gt', 'ge'].includes(compareType) && ver) {
    getVersionsV2(compareType)
  }
}

const v2VersionChange = (ver) => {
// 大于等于，小于 [)
// 大于，小于等于（】
// 大于，小于（）
// 大于等于，小于等于[]
  if (v1.version === v2.version) {
    result.value = `[${v1.version},${v2.version}]`
  } else if (v1.symbol === '[a,)' && v2.symbol === 'lt') { // 大于等于，小于 [)
    result.value = `[${v1.version},${v2.version})`
  } else if (v1.symbol === '(a,)' && v2.symbol === 'le') { // 大于，小于等于（】
    result.value = `(${v1.version},${v2.version}]`
  } else if (v1.symbol === '(a,)' && v2.symbol === 'lt') { // 大于，小于（）
    result.value = `(${v1.version},${v2.version})`
  } else if (v1.symbol === '[a,)' && v2.symbol === 'le') { // 大于等于，小于等于[]
    result.value = `[${v1.version},${v2.version}]`
  }
}

const checkboxChange = () => {
  v1VersionChange(v1.version)
}

const confirm = () => {
  emit('change', result.value)
  visible.value = false
}

defineExpose({ show, getVersions, hide })
</script>

<script>
export default {
  name: 'popover'
}
</script>

<style lang="scss" scoped>
.blue-btn {
  background: rgb(0, 0, 255);
  border-color: rgb(0, 0, 255);
}

.blue-btn.is-disabled,
.blue-btn.is-disabled:focus,
.blue-btn.is-disabled:hover {
  color: #fff;
  cursor: not-allowed;
  background-image: none;
  background-color: #9da2a6;
  border-color: #9da2a6;
  opacity: 0.65;
  box-shadow: none;
}

.e-checkbox-warp {
  padding: 12px 20px 0;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
}

:deep(.popover-box) {
  background: #fff;
  width: 85%;
  border-radius: 4px;
  border: 1px solid #dcdee0;
  padding: 30px 20px 15px;
  z-index: 2000;
  color: #666;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgb(0, 0, 0, 10%);
  word-break: break-all;
}
</style>
