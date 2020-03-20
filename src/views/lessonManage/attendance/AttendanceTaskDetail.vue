/*********   考勤任务详情 ********************/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TestDetail', params: {id: $route.params.experiment_id } }">实验详情</el-breadcrumb-item>
        <el-breadcrumb-item>考勤任务详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content task-detail"> 
        <attendance-taskdetail></attendance-taskdetail>
      </div>
    </div> 
  </div>
</template>
<script>   
  import AttendanceTaskDetail from '../../../components/task/AttendanceTaskDetailCom.vue'
  export default { 
    components: {
      'attendance-taskdetail': AttendanceTaskDetail
    },
    data () {
      return {  
      }
    }, 
    computed:{
    }, 
    mounted(){   
    },
    methods: {  
    }
  }
</script>