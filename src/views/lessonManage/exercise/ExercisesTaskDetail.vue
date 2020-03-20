/*********   习题任务详情 ********************/
<template> 
  <div class="content-wrap-box"> 
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TestDetail', params: {id: $route.params.experiment_id} }">实验详情</el-breadcrumb-item>
        <el-breadcrumb-item>习题任务详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content task-detail">
        <exercise-taskdetailcom></exercise-taskdetailcom>
      </div>
    </div> 
  </div>
</template>
<script>   
  import ExerciseTaskDetailCom from '../../../components/task/ExerciseTaskDetailCom.vue';
  export default { 
    data () {
      return {
        taskDetail: null,
      }
    },
    components:{  
      'exercise-taskdetailcom': ExerciseTaskDetailCom,
    },
    computed:{
    },
    watch:{
    },
    mounted(){  
      // this.getQueryTaskDetail();
    },
    methods: {  
      /*
       * 查询任务基本信息
       */
      getQueryTaskDetail(){
        this.axios.get(`${this.common.basePath}/task/${this.$route.params.id}`,'').then((response) => { 
          this.taskDetail = response.data.data;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
    }
  }
</script>
<style lang="less">
</style>