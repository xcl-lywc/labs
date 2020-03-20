/*********   课程问卷详情 ********************/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/list' }">课程列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'LessonListDetail', params: {id: courseId} }">课程详情</el-breadcrumb-item>
        <el-breadcrumb-item>课程问卷详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content task-detail">  
        <!-- 问卷基本信息 -->
        <el-card class="mart20" v-if="paperDetail"> 
          <div slot="header">
            <span class="card-title">问卷基本信息</span>
          </div>
          <el-row>
            <el-col :span="12" class="marb5">问卷名称：{{paperDetail.name}}</el-col>  
            <el-col :span="24" class="marb5">问卷要求：{{paperDetail.description}}</el-col>
            <el-col :span="12" class="mart5">
              共（{{paperDetail.questionCount ? paperDetail.questionCount : 0}}）题
              <!-- 填写 -->
              <!-- memberId有值，能答题，并且sheetId没有值的情况下才能答题。 --> 
              <el-button 
                v-if="answerSituation.memberId && !answerSituation.sheetId"
                :disabled="!common.checkAuthority('LessonQuestionnaireDetail_GoToAnswer', true)"
                type="primary" size="mini" class="marl10" 
                @click=" $router.push({name: 'LessonQuestionnaireScore', params: {course_id: courseId, cquestionnaire_id: cQuestionnaireId, questionnaire_id: questionnaireId} })">
                {{common.checkAuthority('LessonQuestionnaireDetail_GoToAnswer') ? common.checkAuthority('LessonQuestionnaireDetail_GoToAnswer').name : ''}}
              </el-button>
              <!-- 查看问卷详情 -->
              <el-button 
                :disabled="!common.checkAuthority('LessonQuestionnaireDetail_CheckQuestionDetail', true)"
                type="primary" size="mini" @click="goToQuestionPage">
                {{common.checkAuthority('LessonQuestionnaireDetail_CheckQuestionDetail') ? common.checkAuthority('LessonQuestionnaireDetail_CheckQuestionDetail').name : ''}}
              </el-button>
            </el-col>
            <el-col :span="12" class="text-right">
              <!-- 将问卷设置为模板， 必须之前不是模板才能修改， 并且课程模板不为null，也就是当前问卷属于的课程必须是模板创建的 -->
              <el-button 
                v-if="!paperDetail.template && paperDetail.courseTemplate"
                :disabled="!common.checkAuthority('LessonQuestionnaireDetail_Base', true)"
                type="primary" @click=" upGradeBase ">
                {{common.checkAuthority('LessonQuestionnaireDetail_Base') ? common.checkAuthority('LessonQuestionnaireDetail_Base').name : ''}}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
        <div class="mart10">
          <!-- 完成任务 -->
          <el-card class="mart20"> 
            <div slot="header">
              <span class="card-title">答题情况</span>
            </div>
            <el-tabs v-model="questionActiveName">
              <el-tab-pane label="已答" name="1"> 
                <div v-if="answerList.length" class="person-group-item_w" v-for="(item,index) in answerList">
                  <el-dropdown :hide-on-click="false" placement="bottom-start">
                    <div class="img-photo-fix wh50">
                      <img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" width="50px" height="50px" />
                    </div>  
                    <!-- <p class="person-name" style="text-align: left;margin-left: 18px;">{{item.user_name}}</p>  -->
                    <el-dropdown-menu slot="dropdown" > 
                      <el-row class="mar5 member-info-fix">
                        <el-col :span="9">
                          <p><img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" width="100px" height="100px" /></p>
                        </el-col>
                        <el-col :span="15"> 
                          <p>姓名：{{item.user_name ? item.user_name : '无'}}</p>
                          <p>工/学号：{{item.account ? item.account : '无'}}</p>
                          <p>手机：{{item.phone_num ? item.phone_num : '无'}}</p>
                          <p>院系：{{item.facultyName ? item.facultyName : '无'}}</p>
                          <p>邮箱：{{item.mail ? item.mail : '无'}}</p>
                        </el-col>
                      </el-row> 
                    </el-dropdown-menu>
                  </el-dropdown> 
                </div>
                <div v-if="!answerList.length" class="mar10">暂无数据</div>   
              </el-tab-pane>
              <el-tab-pane label="未答" name="2">
                <div v-if="noAnswerList.length" class="person-group-item_w" v-for="(item,index) in noAnswerList">
                  <el-dropdown :hide-on-click="false" placement="bottom-start">
                    <div class="img-photo-fix wh50">
                      <img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" width="50px" height="50px" />
                    </div>  
                    <!-- <p class="person-name" style="text-align: left;margin-left: 18px;">{{item.user_name}}</p>  -->
                    <el-dropdown-menu slot="dropdown" > 
                      <el-row class="mar5 member-info-fix">
                        <el-col :span="9">
                          <p><img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" width="100px" height="100px" /></p>
                        </el-col>
                        <el-col :span="15"> 
                          <p>姓名：{{item.user_name ? item.user_name : '无'}}</p>
                          <p>工/学号：{{item.account ? item.account : '无'}}</p>
                          <p>手机：{{item.phone_num ? item.phone_num : '无'}}</p>
                          <p>院系：{{item.facultyName ? item.facultyName : '无'}}</p>
                          <p>邮箱：{{item.mail ? item.mail : '无'}}</p>
                        </el-col>
                      </el-row> 
                    </el-dropdown-menu>
                  </el-dropdown> 
                </div>
                <div v-if="!noAnswerList.length" class="mar10">暂无数据</div>    
              </el-tab-pane> 
            </el-tabs>
          </el-card>
        </div>
      </div>
    </div> 
  </div>
</template>
<script>   
  export default { 
    data () {
      return {
        courseId:         this.$route.params.course_id, //课程Id
        cQuestionnaireId:  this.$route.params.cquestionnaire_id, //卷子基本信息Id
        questionnaireId:  this.$route.params.questionnaire_id, //卷子题库Id
        isLoad:           true,
        paperDialog:      false, 
        paperDetail:      null,
        questionActiveName:   '1',
        answerSituation:  {memberId: null, sheetId: null},
        noAnswerList:     [], //未答人员信息
        answerList:       [], //已答人员信息
        loginUserAccount:     sessionStorage.getItem('Access-Account'),
        isPaperDialogShowClose: true,
        participantId:          'default',
      }
    }, 
    computed:{
    }, 
    mounted(){   
      this.getQueryPaperDetail();
      this.getQueryAnswerMember(); 
      this.getQueryNoAnswerMember();
      this.getQueryCourseAnswerMember();
    },
    methods: { 
      /**
       * 将当前实验升级为模板,必须课程也是创建的模板，才能升级实验
       * @return {[type]} [description]
       */
      upGradeBase(){
        this.axios.get(`${this.common.basePath}/course-questionnaire/upgrade`, {params: { id: this.cQuestionnaireId} }).then((response) => {
          this.$message.success(response.data.meta.message);
          this.getQueryPaperDetail();
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },   
      /*
       * 查询问卷基本信息
       */
      getQueryPaperDetail(associated_object){
        this.axios.get(`${this.common.basePath}/course-questionnaire`,{params: {id: this.cQuestionnaireId}}).then((response) => { 
          this.paperDetail = response.data.data; 
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 跳转卷子详情页
       */
      goToQuestionPage(){ 
        this.$router.push({name: 'LessonQuestionnaireCheck', params: {course_id: this.courseId, cquestionnaire_id: this.cQuestionnaireId, questionnaire_id: this.questionnaireId}});
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
       * 已答题人员信息
       */
      getQueryAnswerMember(){
        this.axios.get(`${this.common.basePath}/course-answer/answered/${this.cQuestionnaireId}`,'').then((response) => { 
          this.answerList = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      },  
      /*
       * 未答题人员信息
       */
      getQueryNoAnswerMember(){
        this.axios.get(`${this.common.basePath}/course-answer/no-answer/${this.cQuestionnaireId}`,'').then((response) => { 
          this.noAnswerList = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      /*
       * 获取课程问卷人员答题情况的信息
       */
      getQueryCourseAnswerMember(){  
        this.axios.get(`${this.common.basePath}/course-answer/member`, {params: {userId: JSON.parse(sessionStorage.getItem('Access-Key')), cQuestionnaireId: this.cQuestionnaireId } }).then((response) => { 
          this.answerSituation = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      /**
       * 根据性别使用不同的头像
       * @param  {[type]} sex [description]
       * @return {[type]}     [description]
       */
      defaultImg(sex){ 
        return sex == 1 ? 
                'this.src="' + require('../../../assets/img/male.png') + '"' : 
                'this.src="' + require('../../../assets/img/female.png') + '"';
      }, 
    }
  }
</script>