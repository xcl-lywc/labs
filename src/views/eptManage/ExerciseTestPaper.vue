/*****************  试卷  ********************/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right"> 
        <el-breadcrumb-item :to="{path: '/eptmanage/exercisescore'}">习题评分</el-breadcrumb-item> 
        <el-breadcrumb-item :to="{name: 'ExerciseScoreDetail', 
        params:{ id: $route.params.report_id, 
                 experiment_id: $route.params.experiment_id,  }}">习题详情</el-breadcrumb-item>  
        <el-breadcrumb-item>试卷详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content" v-if="paperItem"> 
        <test-parper :paperItem="paperItem" :isEdit="isEditC"></test-parper>
      </div>
    </div>
  </div>
</template>
<script> 
  import testPaper from '../../components/TestPaperC.vue'
  export default { 
    data () {
      return {
        paperItem: null,
        paperCreatorId: null,
      }
    },
    components:{ 
      'test-parper': testPaper,
    },
    computed:{
      isEditC(){  
        // 试卷创建人 是当前登录人，那么就能编辑试卷，否则只能查看
        return this.paperCreatorId == sessionStorage.getItem('Access-Account') ? true : false;
      }
    },
    mounted(){  
      this.getQueryTaskDetail();
    },
    methods: {  
      /*
       * 查询实验任务列表
       */
      getQueryTaskDetail(){
        this.axios.get(`${this.common.basePath}/paper/detail/${this.$route.params.associated_object}`,'').then((response) => { 
          this.paperItem = response.data.data;
          this.paperCreatorId = response.data.data.creator;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
    }
  }
</script>
<style lang="less">
</style>