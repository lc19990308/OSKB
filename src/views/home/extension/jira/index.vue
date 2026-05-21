<template>
  <div class="view-content">
    <panel v-loading="loading">
      <div slot="header">
        jira配置
      </div>
      <code-mirror v-model="textarea" class="codemirror" :mode="'application/javascript'"></code-mirror>
      <div slot="footer">
        <el-button size="medium" type="primary" class="w-90" @click="save">保  存</el-button>
      </div>
    </panel>
  </div>
</template>
<script>
import CodeMirror from '@/components/public/CodeMirror'

export default {
  name: 'jira',
  components: {
    CodeMirror
  },
  data () {
    return {
      textarea: '{\n' +
          '    "url":"http://xx.xx.xx.xx:8080",  //jira地址\n' +
          '    "auth":{\n' +
          '        "user":"xmi...",  //jira账户名\n' +
          '        "pwd":"xxxx..."   //jira 密码\n' +
          '    },\n' +
          '    "project":{\n' +
          '        "id":"10301"    //jira中的项目的id\n' +
          '    },\n' +
          '    "issue":{\n' +
          '        "type":"1212",   //jira问题类型id\n' +
          '        "id":"1122",   //jira \n' +
          '        "fields":[\n' +
          '            {\n' +
          '                "key":"cuss_1101",   //jira 自定义字段的key\n' +
          '                "vul":"title",         //漏洞标题\n' +
          '                "type":"string"       // 字符类型\n' +
          '            },\n' +
          '            {\n' +
          '                "key":"cuss_1112",   // jira 自定义字段的key\n' +
          '                "vul":"level",        //漏洞等级 \n' +
          '                "type":"id",         // 选项类型\n' +
          '                "sel":{\n' +
          '                    "0":[\n' +
          '                        "High"],    //漏洞等级对应jira选项的id\n' +
          '                    "1":[\n' +
          '                        "Medium"],\n' +
          '                    "2":[\n' +
          '                        "Low"],\n' +
          '                    "3":[\n' +
          '                        "Informatio"]\n' +
          '                }\n' +
          '            },\n' +
          '            {\n' +
          '                "key":"cuss_1103",  // jira 自定义字段的key\n' +
          '                "vul":"impact",     //漏洞的影响范围\n' +
          '                "type":"string"     // 字符类型\n' +
          '            },\n' +
          '            {\n' +
          '                "key":"cuss_1104", // jira 自定义字段的key\n' +
          '                "vul":"advice",    //漏洞的修复建议\n' +
          '                "type":"string"    // 字符类型\n' +
          '            },\n' +
          '            {\n' +
          '                "key":"cuss_1105",   // jira 自定义字段的key\n' +
          '                "vul":"url",         //漏洞的url地址\n' +
          '                "type":"string"      // 字符类型\n' +
          '            }]\n' +
          '    }\n' +
          '}'
    }
  },
  methods: {
    save () {
      this.$message.success('操作成功！')
    }
  },
  mounted () {}
}
</script>
<style scoped lang="scss">
.codemirror {
  border-radius: 3px;
  border: 1px solid #dcdee0;
  line-height: 1.4;
  font-size: 13px;
  height: 300px;
}
</style>
