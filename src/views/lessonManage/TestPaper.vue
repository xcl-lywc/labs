/*****************  试卷  ********************/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path: '/lesson/testlist'}">实验列表</el-breadcrumb-item> 
        <el-breadcrumb-item 
          :to="{name: 'TestDetail', params:{ id: $route.params.experiment_id}}">实验详情</el-breadcrumb-item>  
        <el-breadcrumb-item 
          :to="{name: 'ExercisesTaskDetail', params:{ id: $route.params.task_id}}">习题任务详情</el-breadcrumb-item> 
        <el-breadcrumb-item>试卷详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content" v-if="taskData.paperItem"> 
        <el-form ref="paperItem" :model="taskData" label-width="120px">
          <test-parper :paperItem="taskData.paperItem" :isEdit="isEditC"></test-parper>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script> 
  import testPaper from '../../components/TestPaperC.vue'
  export default { 
    data () {
      return {
        taskData:{ //为了验证信息所以在外层多包一层
          paperItem: null,
        },
        paperCreatorId: null,
        taskDetail:     null,
      }
    },
    components:{ 
      'test-parper': testPaper,
    },
    computed:{
      isEditC(){   
        if(this.taskDetail){
          // 已经发布了的任务就不能再编辑试卷
          if(this.taskDetail.cur_status == 2){
            return false;
          } else{
            // 试卷创建人 是当前登录人，那么就能编辑试卷，否则只能查看
            return this.paperCreatorId == sessionStorage.getItem('Access-Key') ? true : false;
          }
        }  
      }
    },
    mounted(){  
      this.getQueryTaskDetail();
      this.getQueryPaperDetail();
    },
    methods: {  
      /*
       * 查询试卷详情
       */
      getQueryPaperDetail(){
        this.axios.get(`${this.common.basePath}/paper/detail/${this.$route.params.associated_object}`,'').then((response) => { 
          this.taskData.paperItem = response.data.data;
          this.paperCreatorId = response.data.data.creator;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 查询任务详情
       */
      getQueryTaskDetail(){
        this.axios.get(`${this.common.basePath}/task/${this.$route.params.task_id}`,'').then((response) => { 
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