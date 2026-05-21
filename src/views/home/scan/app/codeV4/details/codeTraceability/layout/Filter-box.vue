<template>
  <div class="filter-container" :style="{ maxHeight: expansion ? '1000px' : '45px' }">
    <div class="filter-top">
      <el-badge is-dot :hidden="isDot" @click.native="expansion = !expansion" type="primary" class="cursor-pointer">
        <el-button size="mini" plain>
          <i style="font-size: 14px;" class="iconfont icongengduoshaixuan"></i>
        </el-button>
      </el-badge>
      <el-link v-if="!isDot" :underline="false" type="primary" @click="reset">重置</el-link>
    </div>
    <div class="filter-content">
      <div class="m-b-20 m-t-10">
        <div class="item-title m-b-15 between">
          <span @click="$set(visible, 0, !visible[0])">
            <i :class="[visible[0] ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i> 检测语言
          </span>

          <el-tooltip class="item" effect="dark" content="匹配的文件数量，同一文件中匹配了多个代码片段时，匹配数量为1" placement="top">
            <i class="text-secondary iconfont iconbangzhu"></i>
          </el-tooltip>
        </div>
        <div class="item-content" v-show="visible[0]">
          <el-checkbox-group v-model="formData.languageList" @change="onChange">
            <el-checkbox v-for="l in languages" :label="l.value" :key="l.value">
              <div>
                <span> {{l.label}}</span>
                <span> {{l.total}} </span>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="m-b-20">
        <div class="item-title m-b-15">
          <span @click="$set(visible, 1, !visible[1])">
            <i :class="[visible[1] ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i> 状态
          </span>
        </div>
        <div class="item-content" v-show="visible[1]">
          <el-checkbox-group v-model="formData.signStatus" @change="onChange">
            <el-checkbox v-for="s in signStatusAndFileNumsVOList" :label="s.signStatus"  :key="s.signStatus">
              <div>
                <span> {{s.signName}}</span>
                <span> {{s.fileNums}} </span>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div style="margin-bottom: 30px;" v-if="matchType === 0">
        <div class="item-title">
          <span @click="$set(visible, 2, !visible[2])">
            <i :class="[visible[2] ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i> 相似度
          </span>
        </div>
        <div class="item-content" v-show="visible[2]" style="padding-right: 15px;">
          <el-slider
            @change="onChange('slider')"
            v-model="similarity"
            range
            input-size="mini"
            :marks="marks"
            :max="100">
          </el-slider>
        </div>
      </div>

      <div class="m-b-20">
        <div class="item-title m-b-15 between">
          <span @click="$set(visible, 3, !visible[3])">
            <i :class="[visible[3] ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i> 源文件代码行数
          </span>
          <el-tooltip class="item" effect="dark" content="过滤展示源文件内代码行数大于某行的源文件，默认展示源文件代码行数大于10行的文件" placement="top">
            <i class="text-secondary iconfont iconbangzhu"></i>
          </el-tooltip>
        </div>
        <div class="item-content" v-show="visible[3]" style="padding-right: 15px;">
          大于
          <el-input-number
          size="medium"
          style="width: 130px; display: inline-block;"
          v-model="formData.codeLines"
          @change="lineNumberChange"
          controls-position="right"
          :min="0"
          >
          </el-input-number>
          行
        </div>
      </div>
    </div>
    <div class="filter-bottom" @click="expansion = false">
      <i class="el-icon-arrow-up font-xxxl"></i>
    </div>
  </div>
</template>
<script>
import { awaitTo as to, hasOwn, isObject, deepClone } from '@/utils'
import { toNumber } from 'lodash-es'
import { getFileNums } from '@/api/home/assets/app/codeV4'
import bus from '@/views/home/scan/app/code/details/codeTraceability/layout/event'
export default {
  name: 'Filter-box',
  data () {
    return {
      visible: [true, true, true, true],
      similarity: [80, 100],
      languages: [],
      signStatusAndFileNumsVOList: [],
      formData: {
        signStatus: [],
        languageList: [],
        similarityPerStart: 80,
        similarityPerEnd: 100,
        codeLines: 10
      },
      expansion: true
      // marks: {
      //   0: '0%',
      //   50: '50%',
      //   100: '100%'
      // }
    }
  },
  methods: {
    reset () {
      this.similarity = this.$options.data().similarity
      this.formData = this.$options.data().formData
      const params = deepClone(this.formData)
      if (this.matchType !== 0) {
        delete params.similarityPerStart
        delete params.similarityPerEnd
      }
      delete params.languageList
      delete params.signStatus
      this.$emit('change', params)
    },
    onChange (t) {
      if (t === 'slider') {
        this.formData.similarityPerStart = this.similarity[0]
        this.formData.similarityPerEnd = this.similarity[1]
      }
      const params = this.formData
      if (this.matchType !== 0) {
        delete params.similarityPerStart
        delete params.similarityPerEnd
      }
      this.$emit('change', params)
    },
    lineNumberChange (numValue) {
      if (typeof numValue === 'undefined') {
        this.$nextTick(() => {
          this.formData.codeLines = 0
        })
      }

      this.onChange()
    },
    async getFileNums () {
      const [error, res] = await to(getFileNums(this.$route.query.taskId))
      if (isObject(error)) {
        this.$message.error(error.message)
      } else {
        const languageAndFileNumsVOList = this.get(res, 'data.languageAndFileNumsVOList', [])
        this.signStatusAndFileNumsVOList = this.get(res, 'data.signStatusAndFileNumsVOList', [])
        // 检测语言和匹配的文件数量 视图对象
        this.languages = languageAndFileNumsVOList.map(item => ({
          label: item.language,
          value: item.language,
          total: this.get(item, 'fileNums', 0)
        }))
      }
    }
  },
  computed: {
    marks () {
      return {
        [this.formData.similarityPerStart]: this.formData.similarityPerStart + '%',
        [this.formData.similarityPerEnd]: this.formData.similarityPerEnd + '%'
      }
    },

    matchType () {
      return toNumber(this.$route.query.matchType)
    },

    isDot () {
      return JSON.stringify(this.$options.data().formData) === JSON.stringify(this.formData)
    }
  },
  created () {
    if (hasOwn(this.$route.query, 'taskId')) {
      this.reset()
      this.getFileNums()
      bus.$off('markChange').$on('markChange', () => {
        this.getFileNums()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.filter-container {
  width: 100%;
  margin-bottom: 10px;
  max-height: 1000px;
  overflow: hidden;
  transition: max-height 0.3s;
  background-color: #FFFFFF;
  box-sizing: border-box;
  border-radius: 4px;

  .filter-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;

    :deep(.el-badge__content.is-fixed.is-dot) {
      right: 13px;
      bottom: -1px;
      top: auto;
    }
  }

  .filter-content {
    padding: 0 22px;
    margin-bottom: 10px;

    :deep(.el-checkbox) {
      display: flex;
      margin-bottom: 15px;
      margin-right: 0 !important;

      .el-checkbox__label {
        flex: 1;

        div {
          display: flex;
          justify-content: space-between;
        }
      }
    }

    .item-title{
      display: flex;
      align-items: center;
      color: #333333;

      span:nth-child(1) {
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .item-content {
      padding-left: 18px;
      padding-right: 4px;

      :deep(.el-slider__marks-text) {
        color: #666666;
      }
    }
  }

  .filter-bottom {
    text-align: center;
    transition: background-color 1s;
    cursor: pointer;
    padding: 5px 0;

    &:hover{
      background: #F5F9FE;
      .el-icon-arrow-up {
        color: $color-primary !important;
      }
    }

    i {
      cursor: pointer;
      color: $text-color-secondary;
    }
  }
  :deep(.el-slider__button){
    width: 12px !important;
    height: 12px !important;
  }
}
</style>
