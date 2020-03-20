/*********  评分  ********************/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/eptmanage/exercisescore' }">习题评分</el-breadcrumb-item> 
        <el-breadcrumb-item>评分</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">  
      <!-- 页面主要内容 -->
      <div class="router-view-content">   
        <marking-score-com></marking-score-com>
      </div>
      
    </div> 
  </div> 
</template>
<script> 
  import MarkingScoreCom from '../../components/task/MarkingScoreCom.vue'
  export default { 
    components: {
      'marking-score-com': MarkingScoreCom,
    }, 
    data () {
      return { 
      }
    },
    mounted(){    
    },
    methods: { 
    }
  }
</script>
<style lang="less">
  .question-btn{
    width: 80px!important;
  }
  .color-box{
    display: inline-block;
    width: 24px;
    height: 14px;
    margin-right: 5px;
  }
  .color-box.green{
    background: #67C23A;
  }
  .color-box.orange{
    background: #E6A23C;
  }
  .color-box.gray{
    background: #909399;
  }
</style>