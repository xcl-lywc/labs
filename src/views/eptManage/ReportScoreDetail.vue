/*********   实验管理-学生报告详情 ********************/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path: '/eptmanage/reportscore'}">报告评分列表</el-breadcrumb-item> 
        <el-breadcrumb-item>报告评分详情</el-breadcrumb-item> 
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
        <!-- 任务信息 --> 
        <report-taskdetailcom class="mart20"></report-taskdetailcom>
        <!-- 实验报告 -->   
        <el-card class="mart20" v-for="(item, index) in experimentReportList">
          <div slot="header">
            <span class="card-title">实验报告</span>
          </div>
          <el-row>
            <el-col :span="12" class="marb5">
              <el-tag v-if="item.path" class="marr10">
                <a :href="`${common.publicBasePath}${JSON.parse(item.path).path}`" target="_blank">
                  {{JSON.parse(item.path).name}}
                </a> 
              </el-tag>  
            </el-col> 
            <el-col :span="12" class="marb5">
              {{item.score ? `分数：${item.score}` : '未打分'}}  
            </el-col>
            <el-col :span="24" class="marb5">
              提交时间：{{common._convertDate(item.create_time, 'yyyy年MM月dd日')}}  
            </el-col>
            <el-col :span="24" class="marb5">
              评语：{{item.description}}
            </el-col>  
            <el-col :span="24" class="marb5 text-right"> 
              <el-button 
              :disabled="!common.checkAuthority('ReportScoreDetail_Score', true)"
              @click=" showScoreDialog(item) " type="primary" size="small">
                {{common.checkAuthority('ReportScoreDetail_Score') ? common.checkAuthority('ReportScoreDetail_Score').name : ''}}
              </el-button> 
            </el-col>
          </el-row>
        </el-card>  
      </div>
    </div>

    <!-- 打分 -->
    <el-dialog 
      width="500px"
      title="打分" 
      :closeOnClickModal="false" 
      :visible.sync="scoreDialog">
        <div v-if="taskDetail">
          <el-form ref="scoreForm" :model="scoreForm" label-width="80px">
            <el-form-item
              prop="score"
              label="得分"
              :rules="[{ required: true, message: '请打分', trigger: 'blur' }]"
              >
              <el-input-number v-model="scoreForm.score" :min="1" :max="taskDetail.score" ></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitScore('scoreForm')">打 分</el-button> 
          <el-button @click="scoreDialog = false">取 消</el-button> 
        </div>
    </el-dialog>
    <!-- 打分 -->
    <el-dialog 
      width="500px"
      title="报告" 
      :closeOnClickModal="false" 
      :visible.sync="addReportDialog">
        <div v-if="taskDetail">
          <el-form ref="addReportForm" :model="addReportForm" label-width="80px">
            <el-form-item
              prop="path"
              label="报告（还不能附件暂用文本框代替）"
              :rules="[{ required: true, message: '请上传附件', trigger: 'blur' }]"
              >
              <el-input type="textarea" v-model="addReportForm.path" :min="1" :max="addReportForm.path" ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitReport('addReportForm')">提 交</el-button> 
          <el-button @click="addReportDialog = false; $refs.addReportForm ? $refs.addReportForm.resetFields() : '';">取 消</el-button> 
        </div>
    </el-dialog>
    <!-- 编辑报告 -->
    <el-dialog 
      width="550px"
      title="编辑报告" 
      :visible.sync="reportTaskDialog">
        <el-form ref="reportTaskForm" :model="reportTaskForm" label-width="100px" > 
          <el-form-item 
            label="任务名称：" 
            prop="name"
            :rules="[{ required: true, message: '请输入任务名称', trigger: 'blur' },]">
            <el-input v-model="reportTaskForm.name"></el-input>
          </el-form-item> 
          <el-form-item 
            label="截止日期：" 
            prop="end_time"
            :rules="[{ required: true, message: '请选择截止日期', trigger: 'blur' },]">
            <el-date-picker
              v-model="reportTaskForm.end_time"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item> 
          <el-form-item 
            label="得分占比：" 
            prop="value"
            :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
            <el-input-number type="number" :min="1" :max="100" v-model="reportTaskForm.value"></el-input-number> %
          </el-form-item> 
          <el-form-item 
            label="总分：" 
            prop="name"
            :rules="[{ required: true, message: '请输入总分', trigger: 'blur' },]">
            <el-input type="number" v-model="reportTaskForm.score"></el-input>
          </el-form-item> 
          <el-form-item 
            label="报告类型：" 
            prop="genre"
            :rules="[{ required: true, message: '请选择报告类型', trigger: 'blur' },]">
            <el-radio-group v-model="reportTaskForm.genre">
              <el-radio :label="1">小组报告</el-radio> 
              <el-radio :label="2">个人报告</el-radio>
            </el-radio-group>
          </el-form-item> 
          <el-form-item 
            label="报告要求：" 
            prop="description"
            :rules="[{ required: true, message: '请输入报告要求', trigger: 'blur' },]">
            <el-input type="textarea" rows="5" v-model="reportTaskForm.description"></el-input>
          </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="reportTaskDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitEditReportTask('reportTaskForm')">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>  
  import ReportTaskDetailCom from '../../components/task/ReportTaskDetailCom.vue';
  export default { 
    components:{  
      'report-taskdetailcom': ReportTaskDetailCom,
    }, 
    data () {
      return {
        paperDialog:          false,
        scoreDialog:          false,
        addReportDialog:      false,
        reportTaskDialog:     false,
        taskDetail:           null, 
        courseDetail:         null,
        experimentDetail:     null,
        isLoad:               true,
        questionActiveName:   '1',
        answerMemberListData: [],
        experimentReportList: [],
        loginUserId:          sessionStorage.getItem('access_key'),
        isPaperDialogShowClose: true,
        scoreForm:{
          score:  null, //分数 
          id:     null,  
        },
        addReportForm:{
          path: null,
          participant_id: null,
          task_id: this.$route.params.id,
        },
        selectScoreItemData: null, //被选中打分的实验数据
        reportTaskForm:   { //报告任务表单
          experiment_id:  this.$route.params.id,
          name:           null,
          value:          null, //占比
          score:          null, //
          end_time:       null,
          description:    null,
          genre:          null, //报告类型
        },  
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
    mounted(){  
      this.getQueryTaskDetail();  
      this.getQueryCourseDetail();
      this.getQueryExperimentDetail();
      this.getQueryExperimentReportList();
    },
    methods: {
      /*
       * 查询课程基本信息
       */
      getQueryCourseDetail(){
        this.axios.get(`${this.common.basePath}/course/detail/${this.$route.params.id}`,'').then((response) => { 
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
        this.axios.get(`${this.common.basePath}/task/${this.$route.params.id}`,'').then((response) => { 
          this.taskDetail = response.data.data;
          this.isLoad = false; 
        }).catch((error) => {
          this.$message.error(error);
          this.isLoad = false;  
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
       * 学生实验报告列表
       */
      getQueryExperimentReportList(){
        this.axios.get(`${this.common.basePath}/report/list/${this.$route.params.id}`,'').then((response) => { 
          this.experimentReportList = response.data.data;
          this.isLoad = false; 
        }).catch((error) => {
          this.$message.error(error);
          this.isLoad = false;  
        });
      },    
      /*
       * 显示打分弹框
       */
      showScoreDialog(itemData){
        this.$refs.scoreForm ? this.$refs.scoreForm.resetFields() : '';
        this.scoreDialog = true; 
        this.scoreForm.id = itemData.id;
        this.selectScoreItemData = itemData;
      },
      /*
       * 打分
       */
      submitScore(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            this._submitScore();
          } else { 
            return false;
          }
        });
      }, 
      _submitScore(){
        this.axios.patch(`${this.common.basePath}/report/${this.scoreForm.id}`,this.scoreForm).then((response) => { 
          this.scoreDialog = false;  
          this.selectScoreItemData.score = this.scoreForm.score;
        }).catch((error) => {
          this.scoreDialog = false;
          this.$message.error(error);  
        });
      },
      /*
       * 提交报告
       */
      submitReport(formName){
        this.addReportForm.participant_id = this.experimentDetail.participant.id;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._submitReport();
          } else { 
            return false;
          }
        });
      },
      /*
       * 提交报告
       */
      _submitReport(){ 
        this.axios.post(`${this.common.basePath}/report`,this.addReportForm).then((response) => { 
          this.addReportDialog = false;  
          this.getQueryExperimentReportList();
        }).catch((error) => {
          this.addReportDialog = false;
          this.$message.error(error);  
        });
      },
      /*
       * 提交报告
       */
      submitEditReportTask(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.patch(`${this.common.basePath}/task/${this.$route.params.id}`,this.reportTaskForm).then((response) => {
              this.getQueryTaskDetail();
              this.reportTaskDialog = false;
            }).catch((error) => {
              this.$message.error(error);
              this.reportTaskDialog = false;
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
      } 
    }
  }
</script>
<style lang="less">
  .answer-member-box{ 
    /*display: flex;*/
  }
</style>