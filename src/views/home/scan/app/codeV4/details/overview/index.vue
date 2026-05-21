<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="statistics-card-item" style="height: 246px; padding: 0;">
              <pie-chart
                :title='"文件总数"'
                :sum="statistics.fileNums"
                :data="[
              {
                  name: '匹配文件数',
                  value: statistics.matchFileNums,
                  color: '#48CDC5'
                },
                {
                  name: '匹配代码片段',
                  value: statistics.matchCodeLines,
                  color: '#48CD7F'
                },
                {
                  name: '标记开源',
                  value: statistics.openSignStatusFileNums,
                  color: '#1E88E5'
                },
                {
                  name: '标记自研',
                  value: statistics.selfSingStatusFileNums,
                  color: '#F59E0B'
                }
            ]"
              />
            </div>
          </el-col>
          <el-col :span="16">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="statistics-card-item m-b-20">
                  <div class="statistics-card-item-desc">
                    <div class="m-b-5">匹配文件数</div>
                    <count-to class="number" :startVal="0" :endVal="statistics.matchFileNums" :duration="3000"></count-to>
                  </div>
                  <div class="statistics-card-item-icon card-bg-2">
                    <i class="iconfont iconwenjian1"></i>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="statistics-card-item m-b-20">
                  <div class="statistics-card-item-desc">
                    <div class="m-b-5">匹配代码片段</div>
                    <count-to class="number" :startVal="0" :endVal="statistics.matchCodeLines" :duration="3000"></count-to>
                  </div>
                  <div class="statistics-card-item-icon card-bg-3">
                    <i class="iconfont icondaimashili"></i>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="statistics-card-item m-b-20">
                  <div class="statistics-card-item-desc">
                    <div class="m-b-5">标记开源</div>
                    <count-to class="number" :startVal="0" :endVal="statistics.openSignStatusFileNums" :duration="3000"></count-to>
                  </div>
                  <div class="statistics-card-item-icon card-bg-3">
                    <i class="iconfont iconjiyukaiyuanjianrongkaiyuan font-bold"></i>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="statistics-card-item m-b-20">
                  <div class="statistics-card-item-desc">
                    <div class="m-b-5">标记自研</div>
                    <count-to class="number" :startVal="0" :endVal="statistics.selfSingStatusFileNums" :duration="3000"></count-to>
                  </div>
                  <div class="statistics-card-item-icon card-bg-5">
                    <i class="iconfont iconbianmaguize"></i>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <div class="oss-border self-research m-b-20">
          <div class="statistics-card-item">
            <div class="statistics-card-item-desc">
              <div class="m-b-5">自研率</div>
              <count-to class="number" style="font-size: 26px;" :startVal="0" :endVal="statistics.sinceTheStudyRate" suffix="%" :duration="3000"></count-to>
            </div>
            <div class="statistics-card-item-icon card-bg-1">
              <i class="iconfont iconziyan"></i>
            </div>
          </div>
          <div class="self-research-content">
            <div class="self-research-bar">
              <el-tooltip effect="dark" v-for="item in selfResearchData" :key="item.name" :content=" item.name + '： ' + item.cont + '个'" placement="top">
                <div class="left" :style="{ width: item.width + '%', background: item.bg}"></div>
              </el-tooltip>
            </div>
          </div>
          <div class="self-research-bottom">
            <el-row>
              <el-col :span="6">
                <div>文件总数</div>
                <div>
                  <count-to class="number" style="padding-left: 0;" :startVal="0" :endVal="statistics.fileNums" suffix="个" :duration="3000"></count-to>
                </div>
              </el-col>
              <el-col :span="6">
                <div><oss-dot type="warning" plain></oss-dot> 标记自研</div>
                <div>
                  <count-to class="number" :startVal="0" :endVal="statistics.selfSingStatusFileNums" suffix="个" :duration="3000"></count-to>
                </div>
              </el-col>
              <el-col :span="6">
                <div><oss-dot type="success" plain></oss-dot> 标记开源</div>
                <div>
                  <count-to class="number" :startVal="0" :endVal="statistics.openSignStatusFileNums" suffix="个" :duration="3000"></count-to>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="details-box-item oss-border" style="margin-bottom: 0">
          <div class="p-t-15">开源项目引用TOP 5</div>
          <row-bar-chart
            :data="barChartData"
            :options="barOptions"
            :height="376">
          </row-bar-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RowBarChart from '@/views/home/assets/module/details/RowBarChart'
import PieChart from '@/views/home/scan/app/codeV4/details/overview/chart/pie.vue'
import CountTo from 'vue-count-to'
import { getOverview } from '@/api/home/assets/app/codeV4'
import to from '@/utils/await-to'
import { hasOwn } from '@/utils'
export default {
  name: 'ScanAppComponentDetailsOverview',
  components: {
    RowBarChart,
    CountTo,
    PieChart
  },
  data () {
    return {
      statistics: {
        fileNums: 0,
        matchFileNums: 0,
        matchCodeLines: 0,
        openSignStatusFileNums: 0,
        selfSingStatusFileNums: 0,
        sinceTheStudyRate: 0
      },

      licenseData: [],
      barOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter (i) {
            const item = i[0]
            return (
                    `<div>${item.name}</div>
                    <div>${item.marker}匹配文件数 <span class="font-bold">${item.value}个</span></div>`
            )
          }
        },
        title: {
          text: '匹配文件数',
          textStyle: {
            fontSize: '12px',
            color: '#999999',
            fontWeight: 'normal'
          }
        }
      },
      barChartData: [
        {
          name: '项目1',
          value: 0,
          color: '#EF4444'
        },
        {
          name: '项目2',
          value: 0,
          color: '#F59E0B'
        },
        {
          name: '项目3',
          value: 0,
          color: '#3699FF'
        },
        {
          name: '项目4',
          value: 0,
          color: '#48CDC5'
        },
        {
          name: '项目5',
          value: 0,
          color: '#10B981'
        }
      ]
    }
  },
  computed: {
    selfResearchData () {
      return [
        {
          width: (this.statistics.selfSingStatusFileNums / this.statistics.fileNums * 100).toFixed(2),
          name: '自研文件数',
          bg: '#F59E0B',
          cont: this.statistics.selfSingStatusFileNums
        },
        {
          width: (this.statistics.openSignStatusFileNums / this.statistics.fileNums * 100).toFixed(2),
          name: '标记开源',
          bg: '#10B981',
          cont: this.statistics.openSignStatusFileNums
        }
      ]
    }
  },
  methods: {
    async getOverview () {
      const [error, res] = await to(getOverview(this.$route.query.taskId))
      console.log(res)
      if (error && error.message) {
        this.$message.error(error.message)
      } else {
        this.barChartData = get(res, 'data.openProjectCitedTop5', []).map((item, i) => {
          return {
            name: item.projectName,
            value: item.matchFileNums,
            color: this.$options.data().barChartData[i].color
          }
        })
        Object.keys(this.statistics).forEach(key => {
          this.statistics[key] = get(res, ['data', key], 0)
        })
      }
    }
  },
  created () {
    if (hasOwn(this.$route.query, 'id')) this.getOverview()
  }
}
</script>
<style lang="scss" scoped>
 .statistics-card-item {
   border-radius: 3px;
   background: #FFFFFF;
   box-shadow: 0px 2px 8px 0px #2B75B70C;
   padding: 0 20px;
   height: 113px;
   display: flex;
   justify-content: space-between;
   align-items: center;

   .statistics-card-item-desc {

     .number {
       color: #333333;
       font-weight: bold;
       font-size: 20px;
       line-height: normal;
       letter-spacing: 0.4px;
       text-align: left;
     }

   }

   .statistics-card-item-icon {
     height: 46px;
     width: 46px;
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 4px;
     transition: all 200ms;
     i {
       font-size: 20px;
     }
   }
 }

 .card-bg-1 {
   background: lighten(#8B5CF6, 45%);
   color: #8B5CF6;

   &:hover {
     background: lighten(#8B5CF6, 46%);
     color: lighten(#8B5CF6, 10%);
   }
 }

 .card-bg-2 {
   background: lighten(#48CDC5, 42%);
   color: #48CDC5;

   &:hover {
     background: lighten(#48CDC5, 43%);
     color: lighten(#48CDC5, 10%);;
   }
 }

 .card-bg-3 {
   background: lighten(#10B981, 42%);
   color: #10B981;

   &:hover {
     background: lighten(#10B981, 43%);
     color: lighten(#10B981, 10%);;
   }
 }

 .card-bg-4 {
   background: lighten(#EF4444, 32%);
   color: #EF4444;

   &:hover {
     background: lighten(#EF4444, 33%);
     color: lighten(#EF4444, 10%);
   }
 }

 .card-bg-5 {
   background: lighten(#F59E0B, 35%);
   color: #F59E0B;

   &:hover {
     background: lighten(#F59E0B, 36%);
     color: lighten(#F59E0B, 10%);
   }
 }

 .details-box-item {
   border-radius: 3px;
   background: rgb(255, 255, 255);
   box-shadow: 0 2px 8px 0 rgba(43, 117, 183, 15%);
   padding: 0 20px;
   box-sizing: border-box;
   margin-bottom: 20px;
   div:nth-child(1) {
     font-size: 16px;
   }
 }

 .self-research {
   height: 246px;
   padding: 30px 0;
   box-sizing: border-box;

   .statistics-card-item {
     height: auto;
     box-shadow: none;
     align-items: start;
   }
   .self-research-content {
      padding:20px 40px;

     .self-research-bar {
       border-radius: 4px;
       height: 20px;
       background: #ebeef5;
       overflow: hidden;
       width: 100%;
       div {
         height: 100%;
         cursor: pointer;
       }
     }
   }

   .self-research-bottom {
     padding-top: 20px;
     padding-left: 60px;
     color: #666666;
     font-size: 14px;

     @media (max-width: 1700px){
       padding-left: 30px;
     }

     @media (max-width: 1400px){
       padding-left: 10px;
     }

     .number {
       color: #333333;
       padding-left: 20px;
       font-weight: bold;
       font-size: 14px;
       line-height: 28px;
     }

   }
 }
</style>
