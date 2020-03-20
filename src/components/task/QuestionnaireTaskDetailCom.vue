/*********   问卷任务详情 ********************/
<template> 
  <!-- 页面主要内容 -->
  <div class="router-view-content task-detail" v-if="taskDetail"> 
    <el-card> 
      <el-row>
        <el-col :span="12" class="marb5">
          任务名称：{{taskDetail.name}}
          <!-- 1为未发布，2为已发布 -->
          <el-button 
            :disabled="!common.checkAuthority('QuestionnaireTaskDetail_Release', true)"
            v-if="taskDetail.cur_status == 1" type="primary" size="mini" @click="releaseTask" >
            {{common.checkAuthority('QuestionnaireTaskDetail_Release') ? common.checkAuthority('QuestionnaireTaskDetail_Release').name : ''}}
          </el-button>
          <!-- 将任务设置为模板， 必须之前不是模板任务才能修改， 并且实验模板不为null，也就是当前任务属于的实验必须是模板创建的 -->
          <el-button 
            v-if="!taskDetail.template && taskDetail.experimentTemplate"
            :disabled="!common.checkAuthority('QuestionnaireTaskDetail_Base', true)"
            type="primary" size="mini" @click=" upGradeBase ">
            {{common.checkAuthority('QuestionnaireTaskDetail_Base') ? common.checkAuthority('QuestionnaireTaskDetail_Base').name : ''}}
          </el-button>
        </el-col> 
      </el-row>
    </el-card>

    <!-- 问卷基本信息 -->
    <el-card class="mart20" v-if="paperDetail"> 
      <div slot="header">
        <span class="card-title">问卷基本信息</span>
      </div>
      <el-row>
        <el-col :span="12" class="marb5">问卷名称：{{paperDetail.name}}</el-col> 
        <el-col :span="12" class="marb5">问卷类型：{{questionaireType(paperDetail.type)}}</el-col>
        <el-col :span="24" class="marb5">问卷要求：{{paperDetail.description}}</el-col>
        <el-col :span="12" class="mart5">
          共（{{paperDetail.questionCount}}）题
          <!-- 填写 -->
          <el-button 
            v-if="answerMemberListData ? answerMemberListData.length : false"
            :disabled="!common.checkAuthority('QuestionnaireTaskDetail_GoToAnswer', true)"
            type="primary" size="mini" class="marl10" 
            @click=" $router.push({name: 'QuestionnaireScore', params: {experiment_id: taskDetail.experiment_id,questionnaire_id: paperDetail.id,task_id: $route.params.id} })">
            {{common.checkAuthority('QuestionnaireTaskDetail_GoToAnswer') ? common.checkAuthority('QuestionnaireTaskDetail_GoToAnswer').name : ''}}
          </el-button>
          <!-- 查看问卷详情 -->
          <el-button 
            :disabled="!common.checkAuthority('QuestionnaireTaskDetail_CheckQuestionDetail', true)"
            type="primary" size="mini" @click="goToQuestionPage">
            {{common.checkAuthority('QuestionnaireTaskDetail_CheckQuestionDetail') ? common.checkAuthority('QuestionnaireTaskDetail_CheckQuestionDetail').name : ''}}
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <div class="mart10">
      <!-- 被评价人列表 -->
      <div class="marb10">
        <el-radio-group v-model="participantId">
          <el-radio-button v-for="(item, index) in answerMemberListData" :label="item.id">{{item.user_name}}</el-radio-button>  
        </el-radio-group>
      </div>
      <el-card class="mart5" > 
        <el-tabs v-model="questionActiveName">
          <el-tab-pane label="统计图（待开发）" name="1"> 
             
          </el-tab-pane>
          <el-tab-pane label="分布图（待开发）" name="2">
             
          </el-tab-pane>
          <el-tab-pane label="明细表（待开发）" name="3">
             
          </el-tab-pane> 
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>   
  export default { 
    data () {
      return {
        paperDialog:          false,
        taskDetail:           null,
        paperDetail:          null,
        isLoad:               true,
        questionActiveName:   '1',
        answerMemberListData: [],
        loginUserAccount:     sessionStorage.getItem('Access-Account'),
        isPaperDialogShowClose: true,
        participantId:          'default',
      }
    }, 
    computed:{
    }, 
    mounted(){  
      this.getQueryTaskDetail(); 
      this.getQueryAnswerMember(); 
    },
    methods: { 
      /**
       * 将当前实验升级为模板,必须课程也是创建的模板，才能升级实验
       * @return {[type]} [description]
       */
      upGradeBase(){
        this.axios.get(`${this.common.basePath}/baseTask/upgrade`, {params: { taskID: this.$route.params.id} }).then((response) => {
          this.$message.success(response.data.meta.message);
          this.getQueryTaskDetail();
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      }, 
      /*
       * 问卷类型由数字转文字 
       */
      questionaireType(type){ 
        switch(type){
          case 1:
            return '评价教学';
            break;
          case 2:
            return '互评';
            break;
          case 3:
            return '自评';
            break;
            
        }
      },
      /*
       * 查询任务基本信息
       */
      getQueryTaskDetail(){
        this.axios.get(`${this.common.basePath}/task/${this.$route.params.id}`,'').then((response) => { 
          this.taskDetail = response.data.data;
          this.isLoad = false;
          this.getQueryPaperDetail(response.data.data.associated_object)
        }).catch((error) => {
          this.$message.error(error);
          this.isLoad = false;  
        });
      },
      /*
       * 查询问卷基本信息
       */
      getQueryPaperDetail(associated_object){
        this.axios.get(`${this.common.basePath}/questionnaire/${associated_object}`,'').then((response) => { 
          this.paperDetail = response.data.data; 
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 跳转卷子详情页
       */
      goToQuestionPage(){ 
        this.$router.push({name: 'QuestionnaireCheck', params: {experiment_id: this.taskDetail.experiment_id, questionnaire_id: this.paperDetail.id,task_id: this.$route.params.id}});
       },
      /*
       * 关闭考卷弹框
       */
      closePaperDialogFun(){
        this.paperDialog = false;
       },
      isPaperDialogShowCloseFun(val){ 
        this.isPaperDialogShowClose = val;
       },
      /*
       * 查询被打分的人员数组
       */
      getQueryAnswerMember(){
        this.axios.get(`${this.common.basePath}/qanswer/member/${this.$route.params.id}`,'').then((response) => { 
          this.answerMemberListData = response.data.data;
          // --------- 当前没有被选中的数据，就给一个默认值
          if(this.participantId == 'default') { 
            this.participantId = response.data.data ? response.data.data[0].id : '';
          }
        }).catch((error) => {
          this.$message.error(error); 
        });
      },  
      /*
       * 发布任务
       */
      releaseTask(){
        this.axios.get(`${this.common.basePath}/task/release/${this.$route.params.id}`, '').then((response) => { 
          this.$message.success(response.data.meta.message);
          this.getQueryTaskDetail();
        }).catch((error) => {
          this.$message.error(error); 
        });
      } 
    }
  }
</script>
<style lang="less">
  .answer-member-box{ 
    /*display: flex;*/
  }
</style>