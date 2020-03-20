/*********  习题详情  ********************/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TestDetail', params: {id: $route.params.experiment_id} }">实验详情</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ExercisesTaskDetail', params: {experiment_id: $route.params.experiment_id,task_id: $route.params.task_id} }">习题任务详情</el-breadcrumb-item>
        <el-breadcrumb-item>习题详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">  
      <!-- 页面主要内容 -->
      <div class="router-view-content">   
        <el-card class="questions-content" shadow="never"> 
          <div 
            class="questions-box mart5" 
            v-for="(item, index) in questionListData" 
            :key="index">
            <div>{{index + 1}}、</div>
            <el-card class="questions-content" shadow="never">
              <el-row class="mard10">
                <el-col class="div-flex" :span="18">
                  得分:{{item.answer.score ? item.answer.score : 0}}分（总分:{{item.score ? item.score : 0}}分）
                </el-col>
                <el-col :offset="2" :span="4" class="text-right question-type">
                  {{numMatchingText(item.type)}}
                </el-col>  
              </el-row>
              <el-row class="mard10">
                <el-col class="div-flex" :span="18"> 
                  <div>{{item.question}}</div>
                </el-col>
                <el-col :span="22">
                  <!-- 单选，多选，判断题 -->
                  <div 
                    v-if="item.type == 1 || item.type == 2 || item.type == 3"
                    style="margin-left: 10px;"
                    v-for="(itemOption, indexOption) in item.options" 
                    v-show="!itemOption.isDelete"
                    :key="indexOption" 
                    class="div-flex mart10 flex-align-items">
                    <!-- 单选 -->
                    <el-radio 
                      disabled
                      v-show="item.type == 1 || item.type == 3" 
                      class="marl5"  
                      v-model="itemOption.answer" 
                      label="true">选项{{indexOption + 1}}： </el-radio>
                      
                    <!-- 多选 -->
                    <el-checkbox 
                      disabled
                      v-show="item.type == 2" 
                      class="marl5"  
                      v-model="itemOption.answer" 
                      true-label="true" 
                      false-label="false">选项{{indexOption + 1}}：</el-checkbox>  
                      {{itemOption.name}} 
                  </div>
                  <div v-if="item.type == 4" class="mart10">
                    <el-card shadow="never">
                      {{item.textAnswer}}
                    </el-card>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-card>  
      </div>
    </div>
  </div> 
</template>
<script> 
  export default {  
    data () {
      return {
        paramsSolutionId: this.$route.params.solution_id,
        paramsIsScore:    this.$route.params.isscore, //true为需要做评分功能，false反之
        questionListData: [], //试卷 
      }
    },
    mounted(){  
      this.getQueryQuestionList();  
    },
    methods: {  
      /*
       * 查询实验任务列表
       */
      getQueryQuestionList(){ 
        this.axios.get(`${this.common.basePath}/question/list/teacher/${this.paramsSolutionId}`,'').then((response) => { 
          this._convertAnswer(response.data.data);   
        }).catch((error) => {
          this.$message.error(error);  
        });
      }, 
      /*
       * 组装学生答案,然后复制给questionListData
       */
      _convertAnswer(dataList){ 
        dataList.forEach((item) => {
          if(item.type == 4){ // 简答题的答案做一次处理
            item.answer ? item.textAnswer = item.answer.answer : ''; 
          }else{ 
            // -------------- 是学生的情况下就只查看学生的答案
            if(this.$route.params.type == 'student'){
              let studentAnswerAry = [];
              if(item.answer){
                studentAnswerAry = item.answer.answer ? item.answer.answer.split(',') : [];
              } 
              item.options.forEach((itemOpt) => { 
                // ------------- 没有正确答案就将所有的答案设置为false ---------- 
                if(!studentAnswerAry.length) {
                  itemOpt.answer = 'false';
                  return false;
                }
                
                studentAnswerAry.forEach((itemStu) => {
                  if(itemOpt.id == itemStu){
                    itemOpt.answer = 'true';
                  }else{
                    itemOpt.answer = 'false';
                  }
                }) 
              })
            }
            
          }
        }); 
        this.questionListData = dataList;
      },
      /*
       * 根据数字匹配中文
       */
      numMatchingText(num){ 
        switch(num){
          case 1:
            return this.questionTypeText = '单选题';
            break; 
          case 2:
            return this.questionTypeText = '多选题';
            break; 
          case 3:
            return this.questionTypeText = '判断题';
            break; 
          case 4:
            return this.questionTypeText = '简答题';
            break;  
        }
      },
       
    }
  }
</script>
<style lang="less">
  .question-btn{
    width: 80px!important;
  }
</style>