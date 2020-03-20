/*********   实验管理-学生报告详情 ********************/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path: '/eptmanage/exercisescore'}">习题评分</el-breadcrumb-item> 
        <el-breadcrumb-item>习题详情</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg" v-loading="isLoad"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content task-detail"> 
        <!-- 课程信息 -->
        <el-card> 
          <div slot="header">
            <span class="card-title">课程信息</span>
          </div>
          <el-row v-if="courseDetail">
            <el-col :span="24" class="marb5">
              课程名称：{{courseDetail.name}} 
            </el-col>
            <el-col :span="24" class="marb5">
              课程代码： {{courseDetail.c_code}}
            </el-col>
            <el-col :span="24" class="marb5">
              课程教师： {{courseDetail.c_teacher}}
            </el-col>
            <el-col :span="24" class="marb5">
              课程性质： {{courseDetail.c_nature}}
            </el-col>
            <el-col :span="24" class="marb5">
              简介：{{courseDetail.description}} 
            </el-col>
            <el-col :span="24" class="marb5">
              课程组长：<span v-for="(item, index) in courseDetail.courseLeader " :key="index">{{item.user_name}}，</span>
            </el-col> 
            <el-col :span="12" class="marb5">
              创建时间：{{common._convertDate(courseDetail.create_time, 'yyyy年MM月dd日')}}  
            </el-col>
          </el-row>
        </el-card> 
        <!-- 实验信息 -->
        <el-card class="mart20"> 
          <div slot="header">
            <span class="card-title">实验信息</span>
          </div>
          <el-row v-if="experimentDetail">
            <el-col :span="24" class="marb5">
              实验名称：{{experimentDetail.name}}  
            </el-col>
            <el-col :span="24" class="marb5">
              简介：{{experimentDetail.description}} 
            </el-col>
            <el-col :span="24" class="marb5">
              任课教师：<span v-for="(item, index) in experimentDetail.teacher" :key="index">{{item.user_name}}，</span>
            </el-col>                                   
            <el-col :span="12" class="marb5">
              创建时间：{{common._convertDate(experimentDetail.create_time, 'yyyy年MM月dd日')}}  
            </el-col>
          </el-row>
        </el-card>  
        <!-- 习题详情 -->
        <exercise-taskdetailcom class="mart20"></exercise-taskdetailcom>
      </div>
    </div>   
  </div>
</template>
<script>  
  import ExerciseTaskDetailCom from '../../components/task/ExerciseTaskDetailCom.vue';
  export default { 
    data () {
      return { 
        paperDialog:              false,
        delayDialog:              false,
        isPaperDialogShowClose:   true,
        taskDetail:           null, 
        courseDetail:         null,
        experimentDetail:     null,
        isLoad:               true,
        delayForm: {
          end_time: null,
        },
        questionActiveName:   '1',
        answerMemberListData: [],
        experimentReportList: [],
        loginUserId:          sessionStorage.getItem('access_key'), 
        paperDetail:      null, //试卷详情  
      }
    }, 
    computed:{
      reportStatus(){  
        if(this.taskDetail){
          switch(this.taskDetail.cur_status){
            case 1: 
              return '未发布';
              break;
            case 2: 
              return '进行中';
              break;
            case 3: 
              return '已截止';
              break;
            case 4: 
              return '已结束';
              break;
          }
        }
       
      }
    },
    components:{   
      'exercise-taskdetailcom': ExerciseTaskDetailCom
    }, 
    mounted(){  
      this.getQueryTaskDetail();  
      this.getQueryCourseDetail();
      this.getQueryExperimentDetail(); 
    },
    methods: {
      /*
       * 查询课程基本信息
       */
      getQueryCourseDetail(){
        this.axios.get(`${this.common.basePath}/course/detail/${this.$route.params.task_id}`,'').then((response) => { 
          this.courseDetail = response.data.data; 
          this.isLoad = false; 
        }).catch((error) => {
          this.$message.error(error);
          this.isLoad = false;  
        });
      },      
      /*
       * 查询任务基本信息
       */
      getQueryTaskDetail(){
        this.axios.get(`${this.common.basePath}/task/${this.$route.params.task_id}`,'').then((response) => { 
          this.taskDetail = response.data.data;
          this.getQueryPaperDetail(response.data.data.associated_object);
          this.isLoad = false; 
        }).catch((error) => {
          this.$message.error(error);
          this.isLoad = false;  
        });
      },  
      /*
       * 查询试卷基本信息
       */
      getQueryPaperDetail(associated_object){
        this.axios.get(`${this.common.basePath}/paper/simple/${associated_object}`,'').then((response) => { 
          this.paperDetail = response.data.data; 
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 查询实验基本信息
       */
      getQueryExperimentDetail(){
        this.axios.get(`${this.common.basePath}/experiment/${this.$route.params.experiment_id}`,'').then((response) => { 
          this.experimentDetail = response.data.data;
          this.isLoad = false; 
        }).catch((error) => {
          this.$message.error(error);
          this.isLoad = false;  
        });
      },     
      /*
       * 跳转卷子详情页
       */
      goToQuestionPage(){ 
        this.$router.push({name: 'ExerciseTestPaper', 
          params: {report_id: this.taskDetail.id, 
                   experiment_id: this.taskDetail.experiment_id, 
                   associated_object: this.taskDetail.associated_object}});
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
       * 延期任务
       */
      submitDelayTask(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.patch(`${this.common.basePath}/task/${this.$route.params.id}`, this.delayForm).then((response) => { 
              this.getQueryTaskDetail();
              this.delayDialog = false;
            }).catch((error) => {
              this.delayDialog = false;
              this.$message.error(error); 
            });
          } else { 
            return false;
          }
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
      },
    }
  }
</script>
<style lang="less">
  .answer-member-box{ 
    /*display: flex;*/
  }
</style>