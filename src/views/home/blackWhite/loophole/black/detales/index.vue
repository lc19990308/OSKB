<template>
  <el-drawer
    class="drawer-vul"
    title="漏洞详情"
    :visible.sync="drawer"
    :size="'670px'"
    :direction="direction">
    <el-scrollbar class="drawer-body-scrollbar hide-x">
      <div class="drawer-body">
        <h4 class="vul-title">
          <level-tag :level="data.security"></level-tag>
          <span>{{ data.name || '-' }}</span>
          <img :src="cnnvdImage" alt="">
        </h4>
        <div class="vul-info">
          <div class="vul-item">
            <span class="vul-item-label">
              XMIRROR
            </span>
            <div class="vul-item-content">
                {{ data.xmirror || '-' }}
            </div>
          </div>
          <div class="vul-item">
            <span class="vul-item-label">
              CVE
            </span>
            <div class="vul-item-content">
              {{ data.cve || '-' }}
            </div>
          </div>
          <div class="vul-item">
            <span class="vul-item-label">
              CNNVD
            </span>
            <div class="vul-item-content">
              {{ data.cnnvd || '-' }}
            </div>
          </div>
          <div class="vul-item">
            <span class="vul-item-label">
              CNVD
            </span>
            <div class="vul-item-content">
              {{ data.cnvd || '-' }}
            </div>
          </div>
          <div class="vul-item">
            <span class="vul-item-label">
              CWE
            </span>
            <div class="vul-item-content">
              {{ data.cwe || '-' }}
            </div>
          </div>
          <div class="vul-item">
            <span class="vul-item-label">
              漏洞类型
            </span>
            <div class="vul-item-content">
              {{ data.vulType || '其它'}}
            </div>
          </div>
          <div class="vul-item">
            <span class="vul-item-label">
              利用难度
            </span>
            <div class="vul-item-content">
              {{ data.exploit === 0 ? "困难" : "" }}
              {{ data.exploit === 1 ? "容易" : "" }}
            </div>
          </div>
          <div class="vul-item">
            <span class="vul-item-label">
              发布日期
            </span>
            <div class="vul-item-content">
              {{ data.releaseDate || '-' }}
            </div>
          </div>
          <div class="vul-item-bg description">
            <span class="vul-item-label">
              漏洞描述
            </span>
            <div class="vul-item-content" style="white-space: pre-wrap;word-break: break-all;"  v-html="data.description || data.descriptionEn || '-'">
            </div>
          </div>
          <div class="vul-item-bg suggestion">
            <span class="vul-item-label">
              修复建议
            </span>
            <div class="vul-item-content" style="white-space: pre-wrap;word-break: break-all;" v-html="data.suggestion || '-'">
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <el-button plain type="primary" size="small" class="close-btn" @click="drawer = false">关 闭</el-button>
  </el-drawer>
</template>
<script>
export default {
  name: 'DrawerVulDetail',
  data () {
    return {
      drawer: false,
      cnnvdImage: require('@/assets/images/CNNVD.png'),
      direction: 'rtl',
      data: {}
    }
  },
  methods: {
    open (row) {
      this.data = row || {}
      this.drawer = true
    }
  }
}
</script>
<style scoped lang="scss">
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.drawer-vul {
  :deep(.el-drawer__header) {
    background: #8B5CF6;
    color: #fff;
    font-size: 16px;
    padding: 15px 20px;
    margin-bottom: 0;
  }

  :deep(.el-drawer__body) {
    height: calc(100% - 58px);
  }

  .drawer-body-scrollbar {
    height: calc(100% - 51px);

    .drawer-body {
      padding: 20px;

      .vul-title {
        font-size: 18px;
        margin: 0 0 20px;
        font-weight: 600;
        vertical-align: middle;
        padding-right: 50px;
        padding-left: 65px;
        position: relative;

        .level-tag {
          //margin-right: 10px;
          position: absolute;
          left: 10px;
        }

        .iconfont {
          font-size: 20px;
          color: #8B5CF6;

          //font-weight: 500;
        }

        img {
          margin-left: 10px;
          width: 40px;
          vertical-align: bottom;
          position: absolute;
          right: 0;
          top: -5px;
        }
      }

      .vul-item {
        &:first-child {
          border-top: 1px solid #edeff2;
        }

        border-bottom: 1px solid #edeff2;
        padding: 15px;
        display: flex;
        align-items: center;

        .vul-item-label {
          display: block;
          width: 120px;
          color: #666;
        }

        .vul-item-content {
          flex: 1;
          color: #333;
        }
      }

      .export-item {
        padding: 9px 15px;

        .vul-item-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }

      .vul-item-bg {
        padding: 15px;
        border-radius: 0 0 20px;
        position: relative;
        margin-top: 40px;

        .vul-item-label {
          color: #fff;
          background-repeat: no-repeat;
          padding: 6px 13px;
          position: absolute;
          top: -16px;
          left: -1px;
        }

        &.description {
          background: rgba(#EF4444, 0.1);
          border: 1px solid rgba(#EF4444, 0.2);

          .vul-item-label {
            background-image: url(~@/assets/images/name-bg.png);
          }

          &::after {
            content: "";
            display: block;
            width: 45px;
            height: 8px;
            background-color: #EF4444;
            position: absolute;
            right: 20px;
            top: -4px;
          }
        }

        &.suggestion {
          background: rgba(#8B5CF6, 0.1);
          border: 1px solid rgba(#8B5CF6, 0.2);

          .vul-item-label {
            background-image: url(~@/assets/images/name-bg2.png);
          }

          &::after {
            content: "";
            display: block;
            width: 45px;
            height: 8px;
            background-color: #8B5CF6;
            position: absolute;
            right: 20px;
            top: -4px;
          }
        }
      }
    }
  }

  .close-btn {
    width: 200px;
    background-color: transparent;
    display: block;
    position: absolute;
    bottom: 10px;
    left: 50%;
    margin-left: -100px;
    height: 30px;

    &:active,
    &:focus {
      color: #8B5CF6;
    }

    &:hover {
      background-color: #8B5CF6;
    }
  }
}
</style>
