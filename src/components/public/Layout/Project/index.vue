<template>
  <el-select-v2
    v-model="currentProject"
    popper-class="project-select_popper"
    filterable
    style="width: 220px;"
    ref="select"
    placeholder="请输入项目名称"
    @change="handleClick"
    :component="ProItem"
    :options="projectOptions"
    :extra-props="{ label: 'name', value: 'name' }">
    <dialog-project-detail ref="projectDetail"></dialog-project-detail>
  </el-select-v2>
</template>

<script>
import { mapState } from 'vuex'
import DialogProjectDetail from '@/components/dialog/dialogProjectDetail'
import ElSelectV2 from '@/components/public/SelectV2'
import ProItem from '@/components/public/Layout/Project/ProItem'
export default {
  components: { ElSelectV2, DialogProjectDetail },
  data() {
    return {
      ProItem,
      currentPage: 1,
      pageSize: 100000,
      loading: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo
    }),
    currentProject: {
      get(){
        return this.projectMixin?.name
      },
      set(v){
        const current = this.projectOptions.find(item => item.name === v)
        this.$store.dispatch("selectProject", current);
      }
    },
    projectOptions() {
      return [].concat((this.userInfo && this.userInfo.userId === 1 ? [{ id: -1, name: "所有项目" }] : []), this.projectListMixin)
    }
  },
  provide() {
    const vm = this
    return {
      detail(item) {
        vm.detail(item)
      }
    }
  },
  methods: {
    async detail(item){
      this.$refs.projectDetail.id = item.id;
      this.$refs.projectDetail.dialogVisible = true;
    },
    handleClick(v){
      this.$nextTick(() => {
        this.$refs.select.instance().blur()
        if (this.$route.path.includes('/project/conf/details')) {
          this.$router.push({
            path: this.$route.path,
            query: {
              id: this.projectMixin.id
            }
          })
        } else if (
          this.$route.meta &&
          this.$route.meta.breadcrumb &&
          this.$route.meta.breadcrumb.length > 0
        ) {
          const breadcrumb = this.$route.meta.breadcrumb;
          for (const x in breadcrumb) {
            if (
              Object.hasOwnProperty.call(breadcrumb, x) &&
              breadcrumb[x].path !== ""
            ) {
              this.$router.push({
                path: breadcrumb[x].path
              });
              break;
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-input__inner){
  background: #eff3f6 !important;
  color: #333 !important;
  border-radius: 4px;
  border-color: #eff3f6 ;
}
:deep(.el-select__caret){
  color: #333 !important;

}
:deep(.el-select__caret.is-reverse){
  color: $color-primary !important;
  font-weight: bold;
}

</style>
<style lang="scss">
.project-select_popper{
  .el-select-dropdown__item{
    height: 40px !important;
    line-height: 40px !important;
    padding-right: 15px !important;
    width: 215px !important;
  }
  .el-select-dropdown__item.selected {
    background: #EFF3F6;
  }
  .el-select-dropdown__item.hover{
    .el-button{
      opacity: 1 !important;
      cursor: pointer;
    }
  }
}
</style>
