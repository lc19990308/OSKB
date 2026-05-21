<template>
  <el-dialog
    title="上传应用包"
    :visible.sync="dialogVisible"
    class="dialog-vertical-center"
    :append-to-body="true"
    width="900px"
    @open="open"
    @close="close"
    :close-on-click-modal="false"
  >
    <div style="padding: 20px 15px 0 20px;">
      <el-alert :closable="false" type="primary">
        支持的开发语言：Java、C/C++、JavaScript(nodejs)、Python、PHP、Golang、Scala、C#(.NET)、Ruby、Swift、Objective-C、Erlang、Rust、R、Clojure、Groovy、Lua、Kotlin等
      </el-alert>
    </div>
    <el-form
      :model="form"
      label-width="170px"
      :rules="rules"
      ref="uploadForm"
      inline
      size="medium"
      class="form"
      label-position="right"
    >
      <el-row v-if="projectMixin.id === -1">
        <el-form-item prop="projectId"  label="所属项目：">
          <el-select-v2-project class="input" @change="$refs.uploadForm.validateField('version')" v-model="form.projectId" v-if="projectMixin.id === -1"></el-select-v2-project>
          <el-input
            v-model="projectMixin.name"
            v-else
            readonly
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="appName" label="应用包名称：">
          <el-input
            @input="$refs.uploadForm.validateField('version')"
            v-model="form.appName"
            clearable
            placeholder="请输入应用包名称"
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="version" label="版本号：">
          <el-input
            clearable
            v-model="form.version"
            placeholder="请输入版本号"
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="上传成功后自动检测：">
          <el-switch
            v-model="isDetect">
          </el-switch>
        </el-form-item>
      </el-row>
      <div style="padding-left: 100px;" :class="{disabled: !isDetect}">
        <el-row>
          <el-form-item prop="check" label="审查方式：">
        <span slot="label">
          <el-tooltip class="item" placement="top">
            <div style="width: 300px; line-height: 18px;" slot="content">
              快速审查：检测速度快。通过成分分析、依赖分析、特征分析、引用识别等技术精确识别应用内引入的开源组件的基本信息、已知漏洞、开源许可证等信息<br><br>
              深度审查：在快速审查的基础上进一步检测并分析开源组件的子依赖，检测速度较慢
            </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
        </span>
            <span slot="label">
          审查方式：
        </span>
            <el-radio v-model="form.checkType" :disabled="!isDetect" :label="0">快速审查</el-radio>
            <el-radio v-model="form.checkType" :disabled="!isDetect" :label="1">深度审查</el-radio>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item prop="deepLimit" label="解析深度：">
              <span slot="label">
                <el-tooltip class="item" placement="top">
                  <div style="width: 300px; line-height: 18px;" slot="content">
                    组件依赖解析深度：可自定义组件依赖的解析深度。<br><br>
                    选择默认时，平台会默认根据组件的实际依赖层级进行检测；选择自定义时，用户可根据实际需求设置组件依赖检测层级（1-100层，默认检测5层）。
                  </div>
                  <i class="iconfont iconbangzhu"></i>
                </el-tooltip>
                解析深度：
              </span>
              <el-select style="width: 200px;" :disabled="!isDetect"  v-model="deepApply" @change="form.deepLimit = 5"
                  placeholder="活动区域">
              <el-option label="默认（组件实际依赖层级）" :value="0"></el-option>
              <el-option label="自定义" :value="1"></el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              label=""
              prop="deepLimit"
              v-if="deepApply === 1">
              <el-input-number
                style="width: 125px;"
                :disabled="!isDetect"
                v-model="form.deepLimit"
                @change="numberChange"
                controls-position="right"
                :min="1"
                :max="100"
                placeholder="自定义"
              ></el-input-number>
              层
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item prop="cleanLevel" label="数据清洗：">
        <span slot="label">
          <el-tooltip class="item" placement="top">
            <div style="width: 300px; line-height: 18px;" slot="content">
                快速清洗：只清洗无效组件，结果包含项目中所有可能引入的组件<br><br>
                深度清洗：清洗重复声明和未使用的组件，结果只包含有可能直接影响项目安全的组件，推荐使用该选项
              </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
          <span>
            数据清洗：
          </span>
        </span>
            <el-radio-group :disabled="!isDetect" v-model="form.cleanLevel">
              <!--          <el-radio :label="0">不做清洗</el-radio>-->
              <el-radio :label="1">快速清洗</el-radio>
              <el-radio :label="2">深度清洗</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </div>

      <div class="tabs-wrapper">
        <el-tabs v-model="form.from" @tab-click="tabsChange">
          <el-tab-pane label="本地上传" name="1">
          <div>
            <el-form-item label="选择应用包：" prop="upload" style="margin-bottom: 0;" :rules="[{ required: form.from === '1', message: '请选择应用包', trigger: 'change'}]">
              <div class="upload-warp">
                <el-upload
                  action="#"
                  class="upload-demo"
                  drag
                  @drop.native="e => beforeUpload(e.dataTransfer.files[0])"
                  :http-request="customUpload"
                  :show-file-list="true"
                  :on-change="uploadChange"
                  :on-remove="onRemove"
                  ref="upload"
                  name="file"
                  :limit="1"
                  :auto-upload="false"
                  :accept="accept">
                  <i class="iconfont icona-wenjianshangchuan1" style="margin-top: 15px;margin-bottom: 0;"></i>
                  <div class="el-upload__text" style="padding:0 10px 10px;line-height: 24px;">
                    点击或将文件拖拽到这里上传<br>
                    <span style="font-size: 13px">支持上传的应用包格式：*.jar, *.war, *.rar, *.zip, *.tar, *.tar.gz, *.tgz, *.tar.bz2, *.nuget, *.egg, *.whl</span>
                  </div>
                </el-upload>
              </div>
            </el-form-item>
          </div>
        </el-tab-pane>
          <el-tab-pane label="FTP拉取" name="2">
            <div v-if="form.from === '2'">
              <el-form-item prop="connectType" label="连接信息：">
                <el-select
                  v-model="form.connectType"
                  placeholder="请选择链接信息"
                  class="input"
                >
                  <el-option :value="0" label="FTP"></el-option>
                  <el-option :value="1" label="SSL FTP"></el-option>
                </el-select>
              </el-form-item>
              <div style="padding-left: 110px;">
                <el-row>
                  <el-form-item required class="m-0">
                  <span slot="label" style="width: 90px;text-align: left; display: inline-block;">
                    FTP地址：
                  </span>
                    <el-row class="input__mini input__mini__content" type="flex">
                      <el-col>
                        <el-form-item prop="ftpIP"
                                      :rules="[{ required: form.from === '2', message: '请输入正确的FTP地址', trigger: 'change'}]"
                        >
                          <el-input
                            clearable
                            v-model="form.ftpIP"
                            placeholder="请输入正确的FTP地址"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col class="m-l-10" style="width: 160px">
                        <el-form-item
                          prop="port"
                          :rules="[{ required: form.from === '2', message: '请输入端口号', trigger: 'change'}]"
                        >
                          <el-input
                            clearable
                            v-model="form.port"
                            placeholder="端口"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item required class="m-0">
                  <span slot="label" style="width: 90px;text-align: left; display: inline-block;">
                    用户名密码：
                  </span>
                    <el-row class="input__mini input__mini__content" type="flex">
                      <el-col>
                        <el-form-item
                          prop="username"
                          :rules="[{ required: form.from === '2', message: '请输入用户名', trigger: 'change'}]"
                        >
                          <el-input
                            clearable
                            v-model="form.username"
                            placeholder="请输入用户名"
                            style="width: 100%"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col class="m-l-10">
                        <el-form-item
                          prop="password"
                          :rules="[{ required: form.from === '2', message: '请输入密码', trigger: 'change'}]"
                        >
                          <el-input
                            clearable
                            v-model="form.password"
                            placeholder="请输入密码"
                            type="password"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-row>
                <div style="padding-left: 169px;">
                  <div style="width: 495px">
                    <el-row type="flex" justify="space-between">
                      <el-col :span="20">
                        <el-input
                          size="medium"
                          placeholder="可输入ftp路径进行查找"
                          v-model="ftpSearch">
                        </el-input>
                      </el-col>
                      <el-col style="text-align: center; padding-top: 5px;" :span="2">
                        <el-tooltip class="item" placement="top">
                          <div style="width: 300px; line-height: 18px;" slot="content">
                            您可以输入桶或对象的路径，登录成功后，将只看到在此处指定的桶或对象。
                          </div>
                          <i class="iconfont iconbangzhu"></i>
                        </el-tooltip>
                      </el-col>
                      <el-col class="text-right" :span="2">
                        <el-button
                          type="text"
                          @click="getFtpList"
                          :loading="ftpListLoading"
                        >连接</el-button>
                      </el-col>
                    </el-row>
                    <el-form-item>
                      <div class="tree-wrapper m-t-15" style="width: 490px !important;">
                        <div style="padding: 12px;" class="tree-tool">
                          <el-button size="small" :disabled="ftpTreeData.length === 0" @click="onClickFtpTreeCheckAll">
                            <i class="iconfont iconquanxuan m-r-5"></i>全选
                          </el-button>
                          <el-button size="small" :disabled="ftpTreeData.length === 0" @click="onClickFtpTreeClear">
                            <i class="iconfont iconquxiaoquanxuan m-r-5" ></i>取消全选
                          </el-button>
                        </div>
                        <div v-loading="ftpListLoading" class="tree-scroll-wrapper">
                          <el-tree
                            :data="ftpTreeData"
                            show-checkbox
                            node-key="key"
                            ref="tree"
                            lazy
                            :load="loadFtpNode"
                            :props="{
                          label: 'filename',
                          isLeaf: 'isLeaf',
                        }"
                          >
                          </el-tree>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="HTTP拉取" name="3">
            <div v-if="form.from === '3'" style="padding-top: 15px;">
              <el-form-item
                label="URL:"
                prop="url"
                :rules="[{ required: true, message: '请输入拉取地址', trigger:  'change'}]"
              >
                <el-row>
                  <el-col :span="6">
                    <el-select style="width: 150px;" v-model="form.method">
                      <el-option label="GET" value="get"></el-option>
<!--                      <el-option label="POST" value="post"></el-option>-->
<!--                      <el-option label="PUT" value="put"></el-option>-->
<!--                      <el-option label="PATCH" value="patch"></el-option>-->
<!--                      <el-option label="DELETE" value="delete"></el-option>-->
<!--                      <el-option label="HEAD" value="head"></el-option>-->
<!--                      <el-option label="OPTIONS" value="options"></el-option>-->
                    </el-select>
                  </el-col>
                  <el-col :span="18">
                    <el-input
                      style="width: 470px;"
                      clearable
                      v-model="form.url"
                      placeholder="请输入拉取地址"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="用户名：">
                <el-input
                  clearable
                  v-model="form.username"
                  placeholder="请输入用户名"
                  style="width: 625px;"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码：" style="margin-bottom: 0;">
                <el-input
                  clearable
                  style="width: 625px;"
                  v-model="form.password"
                  placeholder="请输入密码"
                  type="password"
                ></el-input>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="华为云OBS" name="4">
            <div v-if="form.from === '4'">
              <el-form-item required label="连接信息" style="margin-bottom: 0"></el-form-item>
              <div style="padding-left: 110px;">
                <el-form-item
                  prop="服务提供商"
                  label="服务提供商："
                >
                  <el-select style="width: 490px" v-model="form.server">
                    <el-option label="华为对象存储服务（默认）" :value="1"></el-option>
                    <el-option label="其他对象存储服务" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="form.server === 2"
                  prop="endpoint"
                  label="服务器地址："
                  :rules="[{ required: true, message: '请输入服务器地址', trigger: 'change'}]"
                >
                  <el-input
                    style="width: 490px"
                    clearable
                    v-model="form.endpoint"
                    placeholder="服务器地址"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  prop="accessKey"
                  label="Access Key ID："
                  :rules="[{ required: true, message: '请输入Access Key ID', trigger: 'change'}]"
                >
                  <el-input
                    style="width: 490px"
                    clearable
                    v-model="form.accessKey"
                    placeholder="Access Key ID"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  prop="accessKeySecret"
                  label="Secret Access Key："
                  :rules="[{ required: true, message: '请输入Secret Access Key', trigger: 'change'}]"
                >
                  <el-input
                    style="width: 490px"
                    clearable
                    v-model="form.accessKeySecret"
                    placeholder="Secret Access Key"
                  ></el-input>
                </el-form-item>
                <div style="padding-left: 169px;">
                  <div style="width: 495px">
                    <el-row type="flex" justify="space-between">
                      <el-col :span="20">
                        <el-input
                          size="medium"
                          placeholder="请输入访问路径，示例：obs://bucket/folder"
                          v-model="ftpSearch">
                        </el-input>
                      </el-col>
                      <el-col style="text-align: center; padding-top: 5px;" :span="2">
                        <el-tooltip class="item" placement="top">
                          <div style="width: 300px; line-height: 18px;" slot="content">
                            您可以输入桶或对象的路径，登录成功后，将只看到在此处指定的桶或对象。
                          </div>
                          <i class="iconfont iconbangzhu"></i>
                        </el-tooltip>
                      </el-col>
                      <el-col class="text-right" :span="2">
                        <el-button
                          type="text"
                          @click="getObsList"
                          :loading="ftpListLoading"
                        >连接</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <el-form-item>
                    <div class="tree-wrapper m-t-15" style="width: 490px !important;">
                      <div style="padding: 12px;" class="tree-tool">
                        <el-button size="small" :disabled="ftpTreeData.length === 0" @click="onClickFtpTreeCheckAll">
                          <i class="iconfont iconquanxuan m-r-5"></i>全选
                        </el-button>
                        <el-button size="small" :disabled="ftpTreeData.length === 0" @click="onClickFtpTreeClear">
                          <i class="iconfont iconquxiaoquanxuan m-r-5" ></i>取消全选
                        </el-button>
                      </div>
                      <div v-loading="ftpListLoading" class="tree-scroll-wrapper">
                        <el-tree
                          :data="ftpTreeData"
                          show-checkbox
                          node-key="key"
                          ref="tree"
                          lazy
                          :load="loadObsNode"
                          :props="{
                          label: 'filename',
                          isLeaf: 'isLeaf',
                        }"
                        >
                        </el-tree>
                      </div>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="阿里云OSS" name="5">
            <div v-if="form.from === '5'">
              <el-form-item required label="连接信息" style="margin-bottom: 0"></el-form-item>
              <div style="padding-left: 110px;">
                <el-row>
                  <el-form-item required class="m-0">
                    <span slot="label" style="width: 90px;text-align: left; display: inline-block;">
                      Endpoint：
                    </span>
                    <el-row class="input__mini input__mini__content" type="flex">
                      <el-col :span="form.server === 1 ? 24 : 8">
                        <el-form-item prop="server">
                          <el-select v-model="form.server" style="width: 100%;" @change="form.endpoint = undefined">
                            <el-option label="默认(公共云)" :value="1"></el-option>
                            <el-option label="自定义" :value="2"></el-option>
                            <el-option label="cname" :value="3"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col v-if="form.server !== 1" style="margin-left: 10px">
                        <el-form-item
                          prop="endpoint"
                          :rules="[{ required: true, message: '请输入地址', trigger: 'change'}]"
                        >
                          <el-input
                            clearable
                            v-model="form.endpoint"
                            placeholder="请输入地址"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-row>
                <el-form-item
                  prop="accessKey"
                  label="Access Key ID："
                  :rules="[{ required: true, message: '请输入Access Key ID', trigger: 'change'}]"
                >
                  <el-input
                    style="width: 490px"
                    clearable
                    v-model="form.accessKey"
                    placeholder="Access Key ID"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  prop="accessKeySecret"
                  label="Secret Access Key："
                  :rules="[{ required: true, message: '请输入Secret Access Key', trigger: 'change'}]"
                >
                  <el-input
                    style="width: 490px"
                    clearable
                    v-model="form.accessKeySecret"
                    placeholder="Secret Access Key"
                  ></el-input>
                </el-form-item>
                <div style="padding-left: 169px;">
                  <div style="width: 495px">
                    <el-row type="flex" justify="space-between">
                      <el-col :span="20">
                        <el-input
                          size="medium"
                          placeholder="请输入访问路径，示例：oss://bucket/folder"
                          v-model="ftpSearch">
                        </el-input>
                      </el-col>
                      <el-col style="text-align: center; padding-top: 5px;" :span="2">
                        <el-tooltip class="item" placement="top">
                          <div style="width: 300px; line-height: 18px;" slot="content">
                            您可以输入桶或对象的路径，登录成功后，将只看到在此处指定的桶或对象。
                          </div>
                          <i class="iconfont iconbangzhu"></i>
                        </el-tooltip>
                      </el-col>
                      <el-col class="text-right" :span="2">
                        <el-button
                          type="text"
                          @click="getOssList"
                          :loading="ftpListLoading"
                        >连接</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <el-form-item>
                    <div class="tree-wrapper m-t-15" style="width: 490px !important;">
                      <div style="padding: 12px;" class="tree-tool">
                        <el-button size="small" :disabled="ftpTreeData.length === 0" @click="onClickFtpTreeCheckAll">
                          <i class="iconfont iconquanxuan m-r-5"></i>全选
                        </el-button>
                        <el-button size="small" :disabled="ftpTreeData.length === 0" @click="onClickFtpTreeClear">
                          <i class="iconfont iconquxiaoquanxuan m-r-5" ></i>取消全选
                        </el-button>
                      </div>
                      <div v-loading="ftpListLoading" class="tree-scroll-wrapper">
                        <el-tree
                          :data="ftpTreeData"
                          show-checkbox
                          node-key="key"
                          ref="tree"
                          lazy
                          :load="loadOssNode"
                          :props="{
                          label: 'filename',
                          isLeaf: 'isLeaf',
                        }"
                        >
                        </el-tree>
                      </div>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-tab-pane>
      </el-tabs>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">上传并保存</el-button>
      <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  addTask,
  checkVersion,
  ftpAddTask,
  ftpList,
  obsList,
  obsAddTask,
  ossList,
  ossAddTask,
  httpAddTask
} from '@/api/home/public/app'
import { awaitTo } from '@/utils'
import { append } from '@/components/public/SliceUpload'
import { checkSuffix } from '@/utils/validate'
import { appPackageFileSlice, appPackageFileReceived } from '@/api/public'
import ElSelectV2Project from '@/views/home/project/conf/ElSelectV2Project'
import { isArray } from 'lodash-es'

export default {
  name: 'DialogUploadApp',
  components: { ElSelectV2Project },
  props: {
    callback: {
      type: Function,
      default: () => {
      }
    }
  },
  data () {
    const versionValidatorFn = (rule, val, cb) => {
      if (this.form.appName && this.form.projectId) {
        checkVersion({
          appName: this.form.appName,
          version: val,
          projectId: this.form.projectId
        }).then(res => {
          cb()
        }).catch(error => {
          if (error) {
            if (error.code === 400042) {
              cb(new Error(`应用 ${this.form.appName} 的版本号已存在，请重新输入`))
            } else if (error.message) {
              cb(error.message)
            }
          }
        })
      } else {
        cb()
      }
    }

    return {
      accept: '.jar,.war,.rar,.zip,.tar,.tar.gz,.tgz,.gz,.tar.bz2,.nuget,.egg,.whl',
      isDetect: true,
      ftpListLoading: false,
      currentPage: 1,
      pageSize: 100,
      loading: false,
      rules: {
        projectId: [{
          required: true,
          message: '请选择项目',
          trigger: 'change'
        }],
        appName: [{
          required: true,
          message: '请输入应用包名称',
          trigger: 'change'
        }],
        version: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'change'
          },
          {
            validator: versionValidatorFn,
            trigger: 'change'
          }
        ],
        ftpIP: [
          {
            message: '请输入正确的FTP地址',
            trigger: 'change'
          }
          // {
          //   validator: validatorFtpUrl,
          //   message: 'FTP地址错误',
          //   trigger: ['blur', 'change']
          // }
        ],
        port: [{
          message: '请输入端口号',
          trigger: 'change'
        }],
        username: [{
          message: '请输入用户名',
          trigger: 'change'
        }],
        password: [{
          message: '请输入密码',
          trigger: 'change'
        }]
      },
      dialogVisible: false,
      file: null,
      ftpSearch: null,
      deepApply: 0,
      form: {
        projectId: null,
        checkType: 0,
        cleanLevel: 2,
        deepLimit: 5,

        upload: null,
        appName: null,
        version: null,
        from: '1',
        connectType: 0,

        // ftp
        // ftpIP: '180.76.138.98',
        // port: 21,
        // username: 'lixiaolong',
        // password: 'SEiPL726G2c4tzxf'
        ftpIP: null,
        port: 21,
        username: null,
        password: null,

        // obs
        accessKey: undefined,
        accessKeySecret: undefined,
        endpoint: undefined,
        path: undefined,
        server: 1,

        // http
        method: 'get',
        url: ''
      },
      ftpData: [],
      ftpTreeData: []
    }
  },
  watch: {
    dialogVisible () {
      this.$refs.uploadForm && this.$refs.uploadForm.clearValidate()
    },
    'form.connectType' (newVal) {
      this.ftpTreeData = []
      if (newVal === 1) {
        this.form.port = 22
      } else {
        this.form.port = 21
      }
    },
    'form.ftpIP' () {
      this.ftpTreeData = []
    },
    'form.port' () {
      this.ftpTreeData = []
    },
    'form.username' () {
      this.ftpTreeData = []
    },
    'form.password' () {
      this.ftpTreeData = []
    }
  },
  methods: {
    tabsChange () {
      this.signal && this.signal.abort()
      this.form = {
        ...this.form,
        ftpIP: null,
        port: 21,
        username: null,
        password: null,

        // obs
        accessKey: undefined,
        accessKeySecret: undefined,
        endpoint: undefined,
        path: undefined,
        server: 1,

        // http
        method: 'get',
        url: ''
      }
      this.ftpTreeData = []
      this.ftpListLoading = false
      this.ftpSearch = null
      this.files = []
      this.$refs.upload.clearFiles()
      this.$refs.uploadForm.resetFields()
    },
    onRemove () {
      this.form.appName = undefined
      this.form.upload = null
      this.$refs.uploadForm.validateField('upload')
    },
    uploadChange (file, list) {
      this.form.appName = this.form.appName ? this.form.appName : (list.length > 0 ? file.name : null)
      this.form.upload = list.length > 0 ? true : null
      this.$refs.uploadForm.validateField('upload')
    },
    beforeUpload (file) {
      if (!checkSuffix(file.name, this.accept)) {
        this.$message.error('不支持该文件格式上传')
      }
    },
    onClickFtpTreeCheckAll () {
      const checkedKeys = this.ftpTreeData.map(item => item.key)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(checkedKeys)
      })
    },
    onClickFtpTreeClear () {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      })
    },
    _getFtpRootPath () {
      let ftpSearch = this.ftpSearch || '/'
      if (!ftpSearch.startsWith('/')) {
        ftpSearch = '/' + ftpSearch
      }
      if (!ftpSearch.endsWith('/')) {
        ftpSearch = ftpSearch + '/'
      }
      return ftpSearch
    },
    initFtpRoot () {
      const ftpSearch = this._getFtpRootPath()
      this.ftpTreeData = []
      this.ftpListLoading = true
      this.signal && this.signal.abort()
      this.signal = new AbortController()
      return ftpList({
        ssl: this.form.connectType === 1,
        ip: this.form.ftpIP,
        port: this.form.port,
        username: this.form.username,
        password: this.form.password,
        path: ftpSearch
      }, this.signal.signal).then(res => {
        this.ftpListLoading = false
        const ftpData = (res.data || []).filter(item => (item.filename !== '.' && item.filename !== '..')).map(item => ({
          ...item,
          isLeaf: item.type === 0,
          key: ftpSearch + item.filename,
          parentKeyList: [ftpSearch],
          parentKey: ftpSearch
        }))
        const checkedKeys = ftpData.map(item => item.key)
        this.ftpTreeData = ftpData
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(checkedKeys)
        })
      }).catch(error => {
        if (typeof error === 'object' && error.message) {
          this.ftpListLoading = false
          this.$message.error(error.message)
        }
      })
    },
    initObsRoot () {
      let ftpSearch = this._getFtpRootPath()
      if (ftpSearch.indexOf('//') > -1) {
        ftpSearch = ftpSearch.slice(ftpSearch.indexOf('//') + 1)
      }
      this.ftpTreeData = []
      this.ftpListLoading = true
      this.signal && this.signal.abort()
      this.signal = new AbortController()
      return obsList({
        accessKey: this.form.accessKey,
        accessKeySecret: this.form.accessKeySecret,
        endpoint: this.form.endpoint,
        server: this.form.server,
        path: ftpSearch === '/' ? undefined : 'obs:/' + ftpSearch
      }, this.signal.signal).then(res => {
        this.ftpListLoading = false
        const ftpData = (res.data || []).filter(item => (item.filename !== '.' && item.filename !== '..')).map(item => ({
          ...item,
          isLeaf: item.type === 0,
          key: ftpSearch + item.filename,
          parentKeyList: [ftpSearch],
          parentKey: ftpSearch
        }))
        const checkedKeys = ftpData.map(item => item.key)
        this.ftpTreeData = ftpData
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(checkedKeys)
        })
      }).catch(error => {
        if (typeof error === 'object' && error.message) {
          this.ftpListLoading = false
          this.$message.error(error.message)
        }
      })
    },
    initOssRoot () {
      let ftpSearch = this._getFtpRootPath()
      if (ftpSearch.indexOf('//') > -1) {
        ftpSearch = ftpSearch.slice(ftpSearch.indexOf('//') + 1)
      }
      this.ftpTreeData = []
      this.ftpListLoading = true
      this.signal && this.signal.abort()
      this.signal = new AbortController()
      return ossList({
        accessKey: this.form.accessKey,
        accessKeySecret: this.form.accessKeySecret,
        endpoint: this.form.endpoint,
        server: this.form.server,
        path: ftpSearch === '/' ? undefined : 'oss:/' + ftpSearch
      }, this.signal.signal).then(res => {
        this.ftpListLoading = false
        const ftpData = (res.data || []).filter(item => (item.filename !== '.' && item.filename !== '..')).map(item => ({
          ...item,
          isLeaf: item.type === 0,
          key: ftpSearch + item.filename,
          parentKeyList: [ftpSearch],
          parentKey: ftpSearch
        }))
        const checkedKeys = ftpData.map(item => item.key)
        this.ftpTreeData = ftpData
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(checkedKeys)
        })
      }).catch(error => {
        if (typeof error === 'object' && error.message) {
          this.ftpListLoading = false
          this.$message.error(error.message)
        }
      })
    },
    loadFtpNode (node, resolve) {
      if (node.level === 0) {
        return resolve([])
      }
      return ftpList({
        ssl: this.form.connectType === 1,
        ip: this.form.ftpIP,
        port: this.form.port,
        username: this.form.username,
        password: this.form.password,
        path: node.data.key
      }).then(res => {
        this.ftpListLoading = false
        const ftpData = (res.data || []).filter(item => (item.filename !== '.' && item.filename !== '..')).map(item => ({
          ...item,
          isLeaf: item.type === 0,
          key: node.data.key + '/' + item.filename,
          parentKeyList: [...node.data.parentKeyList, node.data.key],
          parentKey: node.data.key
        }))
        resolve(ftpData)
      }).catch(error => {
        if (typeof error === 'object' && error.message) {
          this.$message.error(error.message)
        }
      })
    },
    loadObsNode (node, resolve) {
      if (node.level === 0) {
        return resolve([])
      }
      return obsList({
        accessKey: this.form.accessKey,
        accessKeySecret: this.form.accessKeySecret,
        endpoint: this.form.endpoint,
        server: this.form.server,
        path: `obs:/${node.data.key}`
      }).then(res => {
        this.ftpListLoading = false
        const ftpData = (res.data || []).filter(item => (item.filename !== '.' && item.filename !== '..')).map(item => ({
          ...item,
          isLeaf: item.type === 0,
          key: node.data.key + '/' + item.filename,
          parentKeyList: [...node.data.parentKeyList, node.data.key],
          parentKey: node.data.key
        }))
        resolve(ftpData)
      }).catch(error => {
        if (typeof error === 'object' && error.message) {
          this.$message.error(error.message)
        }
      })
    },
    loadOssNode (node, resolve) {
      if (node.level === 0) {
        return resolve([])
      }
      return ossList({
        accessKey: this.form.accessKey,
        accessKeySecret: this.form.accessKeySecret,
        endpoint: this.form.endpoint,
        server: this.form.server,
        path: `oss:/${node.data.key}`
      }).then(res => {
        this.ftpListLoading = false
        const ftpData = (res.data || []).filter(item => (item.filename !== '.' && item.filename !== '..')).map(item => ({
          ...item,
          isLeaf: item.type === 0,
          key: node.data.key + '/' + item.filename,
          parentKeyList: [...node.data.parentKeyList, node.data.key],
          parentKey: node.data.key
        }))
        resolve(ftpData)
      }).catch(error => {
        if (typeof error === 'object' && error.message) {
          this.$message.error(error.message)
        }
      })
    },
    async getFtpList  () {
      const validate = (fieldName) => {
        return new Promise((resolve) => {
          this.$refs.uploadForm.validateField(fieldName, valid => {
            if (!valid) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
      }
      Promise.all([
        validate('ftpIP'),
        validate('port'),
        validate('username'),
        validate('password')
      ]).then((valid) => {
        if (valid.indexOf(false) === -1) {
          this.initFtpRoot()
        }
      })
    },
    async getObsList  () {
      const validate = (fieldName) => {
        return new Promise((resolve) => {
          this.$refs.uploadForm.validateField(fieldName, valid => {
            if (!valid) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
      }
      const validateTask = [validate('accessKey'), validate('accessKeySecret')]
      if (this.form.server === 2) {
        validateTask.push(validate('endpoint'))
      }
      Promise.all(validateTask).then((valid) => {
        if (valid.indexOf(false) === -1) {
          this.initObsRoot()
        }
      })
    },
    async getOssList  () {
      const validate = (fieldName) => {
        return new Promise((resolve) => {
          this.$refs.uploadForm.validateField(fieldName, valid => {
            if (!valid) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
      }
      const validateTask = [validate('accessKey'), validate('accessKeySecret')]
      if (this.form.server === 2) {
        validateTask.push(validate('endpoint'))
      }
      Promise.all(validateTask).then((valid) => {
        if (valid.indexOf(false) === -1) {
          this.initOssRoot()
        }
      })
    },
    customUpload ({ file }) {
      const that = this
      const fileItem = append(file, {
        request: {
          slice: appPackageFileSlice,
          received: appPackageFileReceived
        },
        params: {
          handler: 'app_package',
          projectId: this.form.projectId,
          appName: this.form.appName,
          version: this.form.version
        },
        payload: {
          isDetect: this.isDetect,
          ...this.form,
          deepApply: this.deepApply
        }
      })

      fileItem.on('success', async (fileItem, response) => {
        const { options } = fileItem
        const { payload } = options
        setTimeout(() => {
          that.$emit('callback')
        }, 1000)
        if (payload.isDetect) {
          // 上传成功自动检测
          const params = {
            appPackageIds: [response.data.uploaded.id],
            cleanLevel: payload.cleanLevel,
            checkType: payload.checkType
          }
          payload.deepApply === 1 && (params.deepLimit = payload.deepLimit)
          await awaitTo(addTask(params))
          setTimeout(() => {
            that.$emit('callback')
          }, 1000)
        }
      })
    },
    uploadFtpTask () {
      const paths = []
      const checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const checkedKeys = this.$refs.tree.getCheckedKeys(false)
      const getChildren = (parentKey) => {
        const children = checkedNodes.filter(item => item.parentKey === parentKey)
        if (children.length === 0) {
          return []
        }
        children.forEach(item => {
          item.children = getChildren(item.key)
        })
        return children
      }
      const ftpRootPath = this._getFtpRootPath()
      const treeData = getChildren(ftpRootPath)
      const recombine = (children = []) => {
        children.forEach(item => {
          if (checkedKeys.includes(item.key)) {
            paths.push(item.key)
          } else if (isArray(item.children) && item.children.length) {
            recombine(item.children, item.key)
          }
        })
      }
      recombine(treeData)
      if (!paths.length) {
        return this.$message.warning('请确定连接状态并选择文件')
      }
      let params = {
        loading: true,
        handler: 'app_package',
        isDetect: this.isDetect,
        deepApply: this.deepApply,
        projectId: this.form.projectId,
        version: this.form.version,
        from: this.form.from,
        remoteBaseInfo: {
          projectId: this.form.projectId,
          packageName: this.form.appName,
          packageVersion: this.form.version,
          remoteInfo: {
            ip: this.form.ftpIP,
            paths,
            ssl: this.form.connectType === 1,
            port: this.form.port,
            username: this.form.username,
            password: this.form.password
          }
        }
      }
      // 上传成功自动检测
      if (this.isDetect) {
        params = {
          ...params,
          cleanLevel: this.form.cleanLevel,
          checkType: this.form.checkType,
          deepLimit: this.deepApply === 1 ? this.form.deepLimit : null
        }
      }
      ftpAddTask(params).then(() => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        setTimeout(() => {
          this.$emit('callback')
        }, 1000)
      }).catch(error => {
        if (typeof error === 'object' && error.message) {
          this.$message.error(error.message)
        }
      })
    },
    submitHttpTask () {
      let params = {
        loading: true,
        handler: 'app_package',
        isDetect: this.isDetect,
        deepApply: this.deepApply,
        projectId: this.form.projectId,
        version: this.form.version,
        from: this.form.from,
        remoteBaseInfo: {
          projectId: this.form.projectId,
          packageName: this.form.appName,
          packageVersion: this.form.version,
          remoteInfo: {
            method: this.form.method,
            password: this.form.password,
            url: this.form.url,
            username: this.form.username
          }
        }
      }
      // 上传成功自动检测
      if (this.isDetect) {
        params = {
          ...params,
          cleanLevel: this.form.cleanLevel,
          checkType: this.form.checkType,
          deepLimit: this.deepApply === 1 ? this.form.deepLimit : null
        }
      }
      httpAddTask(params).then(() => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        setTimeout(() => {
          this.$emit('callback')
        }, 1000)
      }).catch(error => {
        if (typeof error === 'object' && error.message) {
          this.$message.error(error.message)
        }
      })
    },
    submitAbsTask () {
      const paths = []
      const checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const checkedKeys = this.$refs.tree.getCheckedKeys(false)
      const getChildren = (parentKey) => {
        const children = checkedNodes.filter(item => item.parentKey === parentKey)
        if (children.length === 0) {
          return []
        }
        children.forEach(item => {
          item.children = getChildren(item.key)
        })
        return children
      }

      const getFtpRootPath = () => {
        let ftpSearch = this.ftpSearch || '/'
        if (ftpSearch.indexOf('//') > -1) {
          ftpSearch = ftpSearch.slice(ftpSearch.indexOf('//') + 1)
        }
        if (!ftpSearch.startsWith('/')) {
          ftpSearch = '/' + ftpSearch
        }
        if (!ftpSearch.endsWith('/')) {
          ftpSearch = ftpSearch + '/'
        }
        return ftpSearch
      }
      const ftpRootPath = getFtpRootPath()
      const treeData = getChildren(ftpRootPath)

      const recombine = (children = []) => {
        children.forEach(item => {
          if (checkedKeys.includes(item.key)) {
            paths.push(item.key)
          } else if (isArray(item.children) && item.children.length) {
            recombine(item.children, item.key)
          }
        })
      }
      recombine(treeData)
      if (!paths.length) {
        return this.$message.warning('请确定连接状态并选择文件')
      }
      let params = {
        loading: true,
        handler: 'app_package',
        isDetect: this.isDetect,
        deepApply: this.deepApply,
        projectId: this.form.projectId,
        version: this.form.version,
        from: this.form.from,
        remoteBaseInfo: {
          projectId: this.form.projectId,
          packageName: this.form.appName,
          packageVersion: this.form.version,
          remoteInfo: {
            paths: paths.map(p => 'obs:/' + p),
            accessKey: this.form.accessKey,
            accessKeySecret: this.form.accessKeySecret,
            endpoint: this.form.endpoint,
            server: this.form.server
          }
        }
      }
      // 上传成功自动检测
      if (this.isDetect) {
        params = {
          ...params,
          cleanLevel: this.form.cleanLevel,
          checkType: this.form.checkType,
          deepLimit: this.deepApply === 1 ? this.form.deepLimit : null
        }
      }
      obsAddTask(params).then(() => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        setTimeout(() => {
          this.$emit('callback')
        }, 1000)
      }).catch(error => {
        if (typeof error === 'object' && error.message) {
          this.$message.error(error.message)
        }
      })
    },
    submitOssTask () {
      const paths = []
      const checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const checkedKeys = this.$refs.tree.getCheckedKeys(false)
      const getChildren = (parentKey) => {
        const children = checkedNodes.filter(item => item.parentKey === parentKey)
        if (children.length === 0) {
          return []
        }
        children.forEach(item => {
          item.children = getChildren(item.key)
        })
        return children
      }
      const getFtpRootPath = () => {
        let ftpSearch = this.ftpSearch || '/'
        if (ftpSearch.indexOf('//') > -1) {
          ftpSearch = ftpSearch.slice(ftpSearch.indexOf('//') + 1)
        }
        if (!ftpSearch.startsWith('/')) {
          ftpSearch = '/' + ftpSearch
        }
        if (!ftpSearch.endsWith('/')) {
          ftpSearch = ftpSearch + '/'
        }
        return ftpSearch
      }
      const ftpRootPath = getFtpRootPath()
      const treeData = getChildren(ftpRootPath)
      const recombine = (children = []) => {
        children.forEach(item => {
          if (checkedKeys.includes(item.key)) {
            paths.push(item.key)
          } else if (isArray(item.children) && item.children.length) {
            recombine(item.children, item.key)
          }
        })
      }
      recombine(treeData)
      if (!paths.length) {
        return this.$message.warning('请确定连接状态并选择文件')
      }
      let params = {
        loading: true,
        handler: 'app_package',
        isDetect: this.isDetect,
        deepApply: this.deepApply,
        projectId: this.form.projectId,
        version: this.form.version,
        from: this.form.from,
        remoteBaseInfo: {
          projectId: this.form.projectId,
          packageName: this.form.appName,
          packageVersion: this.form.version,
          remoteInfo: {
            paths: paths.map(p => 'oss:/' + p),
            accessKey: this.form.accessKey,
            accessKeySecret: this.form.accessKeySecret,
            endpoint: this.form.endpoint,
            server: this.form.server
          }
        }
      }
      // 上传成功自动检测
      if (this.isDetect) {
        params = {
          ...params,
          cleanLevel: this.form.cleanLevel,
          checkType: this.form.checkType,
          deepLimit: this.deepApply === 1 ? this.form.deepLimit : null
        }
      }
      ossAddTask(params).then(() => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        setTimeout(() => {
          this.$emit('callback')
        }, 1000)
      }).catch(error => {
        if (typeof error === 'object' && error.message) {
          this.$message.error(error.message)
        }
      })
    },
    /**
     * @desc 防止传入空值
     * @param numValue
     */
    numberChange (numValue) {
      if (typeof numValue === 'undefined') {
        this.$nextTick(() => {
          this.form.deepLimit = 1
        })
      }
    },
    // 提交
    confirm () {
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          if (this.form.from === '2') {
            this.uploadFtpTask()
          } else if (this.form.from === '3') {
            this.submitHttpTask()
          } else if (this.form.from === '4') {
            this.submitAbsTask()
          } else if (this.form.from === '5') {
            this.submitOssTask()
          } else {
            if (this.$refs.upload.uploadFiles.length) {
              this.$refs.upload.submit()
              this.dialogVisible = false
            }
          }
        } else {
          return false
        }
      })
    },

    // 打开窗口时的回调
    open () {
      this.form.projectId = this.projectMixin.id !== -1 ? this.projectMixin.id : null
    },

    close () {
      this.form.from = '1'
      this.ftpSearch = null
      this.$refs.upload.clearFiles()
      this.$refs.uploadForm.resetFields()
      this.files = []
      this.signal && this.signal.abort()
    }
  }
}
</script>
<style scoped lang="scss">
.disabled {
  :deep(.el-form-item__label) {
    color: #dcdee0 !important;
    cursor: not-allowed;
  }
}

.form-item-language {
  :deep(.el-form-item__label) {
    flex: none !important;
  }
}

.upload-warp {
  width: 598px;

  .upload-demo {
    :deep(.el-upload-dragger) {
      width: 598px;
      height: 150px;

      .iconfont {
        display: inline-block;
        color: $color-primary;
        font-size: 40px;
        line-height: initial;
        margin: 40px 0 10px;
      }
    }
  }
}

.form {
  padding: 30px 0;
  margin: 0 auto;

  .input {
    width: 600px;
  }

  .el-form-item {
    margin-bottom: 20px;
    width: 100%;
  }

  .input__mini {
    width: 490px;

    &.input__mini__content {

      :deep(.el-form-item__content) {
        width: 100%;
      }
    }
  }
}

.read-file {
  .read-file-head {
    font-size: 16px;
    text-align: center;
  }

  .read-file-body {
    cursor: pointer;
    background-image: url(~@/assets/images/disabled-min-2.png);
    background-position: center;
    position: relative;
    overflow: hidden;
    margin: 0 auto 40px;
    width: 340px;
    height: 270px;

    #app-file {
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
}

.tabs-wrapper {

  :deep(.el-tabs__header) {
    padding: 0 85px;
    }
}

.tree-wrapper {
  border: 1px solid #DCDEE0;
  width: 598px;
  border-radius: 3px;

  .tree-tool {
    .el-button {
      border: none;

      .iconfont  {
        font-size: 14px;
      }

      &.is-disabled {
        background-color: transparent;
        color: #9da2a6;
      }
    }
  }

  .tree-scroll-wrapper {
    height: 200px;
    overflow-y: auto;
  }
}
</style>
