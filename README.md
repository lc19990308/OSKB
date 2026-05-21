### 项目的启动
1.拉下带代码后先   ``` npm install ```  安装环境包

2.拉下带代码后先安装环境包再修改 vue.config.js 里的代理地址和访问地址  OSS的后端接口在 https://192.168.172.244:8011 或者  http://192.168.172.244:8012
   
3.配置修改完毕后   ```   npm run serve   ```  运行
    
4.打包  ```   npm run build   ```
   
-------------------------------------------------------------------
   
### 注意事项：
 * 为了防止开发的时候没有出现问题但是上线后出现问题，尽量在本地的虚拟机内配置一个访问地址 功能开发完毕后自行打包测试，虚拟机的 xampp 配置参考之前的灵脉配置

 * 主要用的 vue + element-ui 开发时参考两个官网

 * git提交代码时不要提交 dist，node_modules，.idea 等没必要的文件夹   已经在 .gitignore 写了配置理论上不会提交上去，如果不小心提交上去了可能是缓存造成，git清除缓存方式自行百度
    
 * 项目配置了ESlint编辑器内如果发现代码风格告警解决完后再进行git提交，格式优化命令  ```   npm run lint   ```  （执行后如果控制台有报错需要手动解决，引入文件代码不规范可忽略）

-------------------------------------------------------------------

### 代码风格

 * 命名方式：驼峰命名或者大写加下换线 （如：reportConf 或者 SET_ACCESS_TOKEN，大写加下滑线多用于vuex下的mutations）
 
 * 空格缩进：两个空格缩进
 
 * 变量声明：严禁使用var声明变量
 
 * loading需要时再加入loading，如列表有列表的loading，图表有图表的loading，全局的loading只作为操作时加入

 * 使用echarts时不再用原生的方法封装组件了，用到了一个新的依赖 vue-echarts，使用方法可参考vue-echarts的github或者参考当前封装好的组件 （参考：\src\components\chart\AnnulusPieChart.vue，其他的图因为OSS的项目还没用到所以暂时没改成这种方式，后续用到的时候在改也行）
    ```vue
    <template>
      <div class="chart-wrap" ref="chart" :style="{height:(height ? height : 460) + 'px',width:width}"
           v-loading="loading"
           element-loading-background="rgba(255, 255, 255, 1)">
        <v-chart :options="option" autoresize />
        <div class="no-data" v-if="noData">暂无数据</div>
      </div>
    </template>
    
    <script>
    
    // 不再使用统一引入的方式，改成了按需引入需要echarts的哪个模块引入哪个
    // loading需要引入的时候绑定
    
    import Vue from 'vue'
    import ECharts from 'vue-echarts'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/legendScroll'
    Vue.component('v-chart', ECharts)
    
    export default {
      name: 'AnnulusPieChart',
      data () {
        return {
          width: '100%',
          height: 460,
          routePath: this.$route.path
        }
      },
      props: {
        className: {
          type: String,
          default: 'chart'
        },
        chartData: {
          type: Object,
          required: true
        },
        centerLabel: {
          type: String,
          default: ''
        },
        legend: {
          type: Boolean,
          default: true
        },
        loading: {
          type: Boolean,
          default: false
        }
      },
      methods: {
        __resizeHandler () {
          if (this.routePath === this.$route.path) {
            this.height = parseInt(this.$refs.chart.clientWidth * 0.58)
          }
        },
        fontSize (res) {
          const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
          if (!clientWidth) return
          const fontSize = 100 * (clientWidth / 1920)
          return res * fontSize
        }
      },
      computed: {
        option () {
          const { data, sum } = this.chartData
          let has = false
          let _data = []
          if (Array.isArray(data)) {
            _data = data.map(x => {
              if (x.value > 0) {
                has = true
              }
              return {
                name: x.name,
                value: x.value,
                itemStyle: {
                  normal: {
                    color: x.color
                  }
                }
              }
            })
          }
          if (has) {
            _data = _data.filter(y => {
              return y.value > 0
            })
          }
          return {
            color: this.color,
            tooltip: {
              show: true
            },
            xAxis: [
              {
                type: 'category',
                show: false
              }
            ],
            yAxis: [
              {
                type: 'value',
                show: false
              }
            ],
            title: [
              {
                text: this.centerLabel,
                x: 'center',
                top: '52%',
                textStyle: {
                  color: '#666666',
                  fontSize: this.fontSize(0.14),
                  fontWeight: '500'
                }
              },
              {
                text: sum !== undefined ? sum : '',
                x: 'center',
                top: '42%',
                textStyle: {
                  fontSize: this.height * 0.10,
                  color: '#333333',
                  fontWeight: '500'
                }
              }
            ],
            series: [
              {
                type: 'pie',
                radius: ['44%', '55%'],
                startAngle: [224],
                label: {
                  normal: {
                    position: 'outside',
                    fontSize: this.fontSize(0.14),
                    color: '#333333',
                    lineHeight: 6,
                    formatter: function (x) {
                      return x.name + '：' + x.value + '个'
                    },
                    borderWidth: 6,
                    borderRadius: 4
                  }
                },
                labelLine: {
                  normal: {
                    show: true,
                    lineStyle: {
                      type: 'solid',
                      color: '#333333'
                    },
                    length: 8,
                    length2: 8
                  }
                },
                data: _data
              }
            ],
            legend: {
              show: this.legend,
              textStyle: {
                fontSize: this.fontSize(0.14)
              },
              type: 'scroll',
              orient: 'vertical',
              right: '5%',
              top: 'center',
              itemGap: 10
            }
          }
        },
        noData () {
          if (Array.isArray(this.chartData.data) && this.chartData.data.length === 0 && this.chartData.sum === undefined) {
            return true
          } else {
            return false
          }
        }
      },
      mounted () {
        this.__resizeHandler()
        window.addEventListener('resize', this.__resizeHandler)
      },
      beforeDestroy () {
        window.removeEventListener('resize', this.__resizeHandler)
      }
    }
    </script>
    <style lang="scss" scoped>
    .chart-wrap{
      .echarts{
        width: 100%;
        height: 100%;
      }
      position: relative;
      .no-data{
        width: 100%;
        text-align: center;
        color: #b4bccc;
        position: absolute;
        top: 50%;
      }
    }
    </style>
    
    ```
-------------------------------------------------------------------

### 样式

 * CSS扩展语言：scss  （参考网站：https://www.sass.hk/）
 * 命名方式：样式尽量使用 ’-‘ 做连接（主要），也可使用 ’_‘做连接（次要 做辅助使用），如：panel-header  
 * 注意事项：
     1. 严格遵循scss官网标准。
     2. 每个文件内部最多只能有一个style标签，标签需要加上 lang="scss" scoped  声明要使用的语法和只在本页面生效，全局样式写在src/style/app.scss内。
     3. app.scss内有许多已经预定义过的样式只需添加类名即可，尽量避免一个套样式出现多个类名不方便后期维护。
     4. 尽量使用已有的组件加上预定义的样式进行布局，熟练后一个界面其实基本上用不到自己写样式。
 
 
-------------------------------------------------------------------

### HTML规范
 1. 标签的属性必须使用**双引号** 
 2. 能使用element-ui的组件尽量使用组件（组件有样式没必要重新加类名加样式）
 3. 保证语义化的同时**代码量越少越好**
 
 
-------------------------------------------------------------------

### 目录结构
```
│  .editorconfig
│  .gitignore
│  babel.config.js
│  package-lock.json
│  package.json
│  README.md
│  tree.txt
│  vue.config.js  
│  
├─.idea       
├─dist     
├─node_modules         
├─public
│  │  index.html
│  │  robots.txt
│  │  
│  └─img
│      └─icons
│              favicon.ico
│              
└─src                                  // 开发的文件夹
    │  App.vue 
    │  main.js 
    │  registerServiceWorker.js
    │  
    ├─api                              // 所有请求写在这里
    │  ├─home                          // 登录后里面的请求
    │  │          
    │  ├─login                         // 登录相关请求
    │  │      
    │  └─public                        // 全局请求
    │          
    ├─assets                           // 引入的静态资源
    │  │  config.json
    │  │  
    │  ├─fonts
    │  │  └─iconFont
    |  |
    │  ├─images
    |  |
    |  |
    │  ├─js
    |  |
    │  └─theme
    │              
    ├─components                        // 全局组件
    │  ├─chart                          // 图表组件
    │  │      
    │  ├─dialog                         // 弹窗组件
    │  │      
    │  └─public                         // 全局的通用组件
    │          
    ├─router                            // 路由文件夹
    │  │  router.js                    
    │  │  routerGuard.js                // 路由守卫
    │  │  
    │  └─home
    │              
    ├─store                             // vuex
    │  │  store.js
    │  │  
    │  └─modules
    │          home.js
    │          login.js
    │          site.js
    │          
    ├─style                             // 全局样式
    │      app.css
    │      app.css.map
    │      app.scss
    │      config.scss
    │      
    ├─utils                             // 全局配置
    │      fetch.js                     // axios的全局配置
    │      filters.js                   // 筛选
    │      index.js                     // 全局的通用函数
    │      conf.js                     // 全局变量
    │      validate.js                  // 正则
    │      
    └─views
        ├─home
        │  ├─scan                     
        │     │  index.vue            
        │     │  
        │     ├─app
        │        │  dialogAddTask.vue
        │        │  index.vue
        │        │  main.vue
        │        │  
        │        └─details
        │                component.vue
        │                index.vue
        │                vul.vue
        │         
        └─login
                index.vue
 ```
