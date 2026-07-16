<template>
  <el-main class="main">
    <el-row :gutter="20" class="version-row">
      <el-col :span="12">
        <div class="common-bg">
          <div class="common-header">系统当前版本</div>
          <div class="version-body">
            <div class="sys-identity">
              <div class="sys-name">船舶工业软件SBOM检查与代码分析工具</div>
              <span class="version-tag">V1.0 版</span>
            </div>
            <div class="version-divider"></div>
            <div class="sub-version-row">
              <div class="sub-version-item">
                <div class="sub-icon">
                  <img :src="img2" alt="">
                </div>
                <div class="sub-info">
                  <div class="sub-label">前端</div>
                  <div class="sub-value">{{ version }}</div>
                </div>
              </div>
              <div class="sub-version-item">
                <div class="sub-icon">
                  <img :src="img1" alt="">
                </div>
                <div class="sub-info">
                  <div class="sub-label">后端</div>
                  <div class="sub-value">{{ currentVersion.webBackendVersion || '-' }}</div>
                </div>
              </div>
              <div class="sub-version-item">
                <div class="sub-icon">
                  <img :src="img3" alt="">
                </div>
                <div class="sub-info">
                  <div class="sub-label">引擎端</div>
                  <div class="sub-value">{{ currentVersion.engineVersion || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="common-bg">
          <div class="common-header">知识库版本</div>
          <div class="version-body">
            <div class="sys-identity">
              <div class="sys-name" style="font-size:16px;">知识库与组件信息</div>
              <span class="version-tag" style="background:linear-gradient(135deg,#38a169,#276749);">已同步</span>
            </div>
            <div class="version-divider" style="background:linear-gradient(90deg,transparent,#38a169,transparent);"></div>
            <div class="sub-version-row">
              <div class="sub-version-item">
                <div class="sub-icon">
                  <img :src="img1" alt="">
                </div>
                <div class="sub-info">
                  <div class="sub-label">组件库</div>
                  <div class="sub-value">{{ currentVersion.dbComponentVersion || '-' }}</div>
                </div>
              </div>
              <div class="sub-version-item">
                <div class="sub-icon">
                  <img :src="img2" alt="">
                </div>
                <div class="sub-info">
                  <div class="sub-label">漏洞库</div>
                  <div class="sub-value">{{ currentVersion.dbVulVersion || '-' }}</div>
                </div>
              </div>
              <div class="sub-version-item">
                <div class="sub-icon">
                  <img :src="img3" alt="">
                </div>
                <div class="sub-info">
                  <div class="sub-label">许可证库</div>
                  <div class="sub-value">{{ currentVersion.dbLicenseVersion || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="system-info-row">
      <el-col :span="24">
        <div class="common-bg">
          <div class="common-header">运行环境信息</div>
          <div class="system-info-body">
            <div
              v-for="item in systemInfo"
              :key="item.label"
              class="system-info-item"
            >
              <div class="system-info-label">{{ item.label }}</div>
              <div class="system-info-value">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <Knowledge :list="$refs.history" v-if="authorityFilter(2252)"/>
    <History ref="history"/>
  </el-main>
</template>

<script>
import History from '@/views/home/system/update/history.vue'
import Knowledge from '@/views/home/system/update/knowledge.vue'
import img1 from '@/assets/images/system/icon_h.png'
import img2 from '@/assets/images/system/icon_q.png'
import img3 from '@/assets/images/system/icon_oss.png'
import { currentVersion } from '@/api/home/system/update'
import { VERSION } from '@/utils/conf'
export default {
  components: {
    History,
    Knowledge
  },
  data () {
    return {
      version: VERSION,
      vulSwitch: false,
      img1: img1,
      img2: img2,
      img3: img3,
      systemInfo: [
        {
          label: 'CPU',
          value: '飞腾D2000'
        },
        {
          label: '操作系统',
          value: '银河麒麟v10'
        }
      ],
      currentVersion: {
        webFrontendVersion: '',
        webBackendVersion: '',
        engineVersion: ''
      }
    }
  },
  methods: {
    // 获取当前版本号
    initCurrentVersion () {
      currentVersion({
        loading: false
      }).then(response => {
        this.currentVersion = response.data
      }).catch(error => {
        this.$message.error(error.message)
      })
    }
  },
  mounted () {
    this.initCurrentVersion()
  }
}
</script>

<style lang="scss" scoped>
.version-row {
  display: flex;
  flex-wrap: wrap;

  .el-col {
    display: flex;
  }
}

.system-info-row {
  margin-top: 20px;
}

.common-bg {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.common-header {
  position: relative;

  .el-button {
    position: absolute;
    right: 30px;
  }
}

.version-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 30px;
  box-sizing: border-box;
}

.sys-identity {
  text-align: center;
  margin-bottom: 16px;

  .sys-name {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .version-tag {
    display: inline-block;
    padding: 4px 20px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    background: linear-gradient(135deg, #3a7bd5, #2b6cb0);
    border-radius: 20px;
    letter-spacing: 1px;
  }
}

.version-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3a7bd5, transparent);
  margin-bottom: 20px;
}

.sub-version-row {
  display: flex;
  width: 100%;
  gap: 12px;
}

.sub-version-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 10px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #edf2f7;
  transition: all 0.2s;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }

  .sub-icon {
    margin-bottom: 8px;

    img {
      width: 36px;
      height: 36px;
      display: block;
    }
  }

  .sub-info {
    text-align: center;

    .sub-label {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 4px;
    }

    .sub-value {
      font-size: 15px;
      font-weight: 600;
      color: #334155;
    }
  }
}

.system-info-body {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding: 24px 30px;
  box-sizing: border-box;
}

.system-info-item {
  display: flex;
  align-items: center;
  min-height: 72px;
  padding: 0 24px;
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 8px;
}

.system-info-label {
  min-width: 96px;
  font-size: 13px;
  color: #64748b;
}

.system-info-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 900px) {
  .system-info-body {
    grid-template-columns: 1fr;
  }
}

</style>
