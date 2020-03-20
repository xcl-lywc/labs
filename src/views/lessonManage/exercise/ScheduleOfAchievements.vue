/*********** 成绩明细表 ************/
<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TestDetail', params: {id: $route.params.experiment_id} }">实验详情</el-breadcrumb-item>
        <el-breadcrumb-item>成绩明细表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content"> 
        <div style=" overflow-x: auto; ">
          <div class="text-center" v-if="!scoreSsheet.length">
            暂无成绩
          </div> 
          <table v-if="scoreSsheet.length" class="hand-table">
            <thead border="1">
              <tr>  
                <td>#</td> 
                <td>姓 名</td> 
                <td  
                  v-for="(item, index) in scoreSsheet[0].scoreList">
                  {{item.taskName}}   
                </td>  
              </tr>
            </thead>
            <tbody> 
              <tr v-for="(itemTit, indexTit) in scoreSsheet" :key="indexTit"> 
                <td>{{indexTit + 1}}</td>
                <td class="tab-index-class">{{itemTit.userName}}</td> 
                <td 
                  class="tab-content-class" 
                  v-for="(itemVal, indexVal) in itemTit.scoreList" 
                  :key="indexVal">
                  {{itemVal.score}}
                </td> 
              </tr> 
            </tbody>
          </table>   
        </div> 
      </div> 
    </div> 
  </div>
</template>
<script>
  export default {
    data () {
      return {  
        scoreSsheet: [],  
      }
    },
    mounted(){
      this.getQueryList(); 
    }, 
    methods: {  
      /*
       * 成绩明细表 
       */
      getQueryList(){  
        this.axios.get(`${this.common.basePath}/participant/score/${this.$route.params.experiment_id}`, '').then((response) => {
          this.scoreSsheet = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },  
    }
  }
</script>
<style lang="less">
  
</style>