import {mapState} from "vuex";

export default {
  computed: {
    ...mapState({
      projectList: state => state.home.projectList,
      currentProject: state => state.home.project
    })
  },
  methods: {
    // 选中项目
    selectProject_mixin(projectId){
      if (this.currentProject.id === -1) {
        this.$store.dispatch("selectProject", this.projectList.find(item => item.id === projectId));
      }
    }
  }
}
