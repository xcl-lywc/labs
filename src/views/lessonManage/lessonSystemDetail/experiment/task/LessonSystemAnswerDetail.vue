<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/system/' }">课程资源</el-breadcrumb-item>
        <el-breadcrumb-item v-if="paramsCId" :to="{ path: `/lesson/system/coursedetail/${paramsCId}` }">课程详情</el-breadcrumb-item>
        <el-breadcrumb-item v-if="paramsEId&&paramsCId" :to="{ path: `/lesson/system/experimentdetail/${paramsCId}/${paramsEId}` }">实验详情</el-breadcrumb-item>
        <el-breadcrumb-item>任务详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg" v-loading="loading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div v-if="common.checkAuthority('Lesson-Data-AnswerDetail-Query', true)">
          <!-- 基本信息 -->
          <el-card>
            <div slot="header">
              <span class="card-title">基本信息</span>
              <el-switch
                 v-if="courseDetailData"
                class="fr"
                :title="courseDetailData.cur_status===1?'禁用':'启用'"
                @change="courseDetailData.cur_status===1?disabledTask(courseDetailData.id):noDisabledTask(courseDetailData.id)"
                v-model="courseDetailData.cur_status===1"
                :disabled="isDisabaledDelBtn()"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </div>
            <el-form label-width="100px" class="show-detail-form"  v-if="courseDetailData">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="名称：">{{courseDetailData.name}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="类型：">
                    <el-tag type="success" v-if="courseDetailData.type===1">答题任务</el-tag>
                    <el-tag type="primary" v-if="courseDetailData.type===2">报告任务（{{courseDetailData.genre?(courseDetailData.genre==1?'小组报告':'个人报告'):'暂未分类'}}）</el-tag>
                    <el-tag type="warning" v-if="courseDetailData.type===4">问卷任务（{{courseDetailData.paperGenre?(questionType[courseDetailData.paperGenre]):'暂未分类'}}）</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="占分得比：">{{(courseDetailData.value?courseDetailData.value:'0')+'%'}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="满分：">{{courseDetailData.score}}分</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="通过分数：">{{courseDetailData.adopt_score}}分</el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="要求："><p class="cursor-pointer_T">{{courseDetailData.description}}</p></el-form-item>
                </el-col>
                <el-col :span="24">
                  <p class="text-right">
                    <el-button 
                      :disabled="!common.checkAuthority('Lesson-Data-AnswerDetail-Edit', true)"
                      type="primary" @click="editCourseDialog = true;echo();">
                        编辑
                    </el-button>
                    <el-button 
                      :disabled="!common.checkAuthority('Lesson-Data-AnswerDetail-Delete', true)"
                      type="danger" @click="deleteCourse(courseDetailData.id)">
                        删除
                    </el-button>
                  </p>
                </el-col>
              </el-row>
            </el-form>
          </el-card> 
          <!-- 试卷详情 -->
          <el-card class="mart20">
            <div slot="header" class="overflow-hidden">
              <span class="card-title fl">试卷详情</span>
            </div>
            <div v-if="exercises">
              <!-- 基础信息 -->
              <el-card>
                <div slot="header" class="overflow-hidden">
                  <span class="card-title fl">基础信息</span>
                </div>
                <el-form label-width="100px" class="show-detail-form">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="试卷名称：">{{exercises.name}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="时长：">{{exercises.exam_time}}分钟</el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="总分：">{{exercises.score}}分</el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                      <el-form-item label="通过分数：">{{exercises.adopt_score}}分</el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                      <el-form-item label="答题要求："><p class="cursor-pointer_T">{{exercises.description}}</p></el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-card> 
              <!-- 习题 -->
              <el-card class="mart20">
                <div slot="header" class="overflow-hidden">
                  <span class="card-title fl">习题</span>
                  <el-button 
                    class="fr"
                    v-if="exercises.question_count>0"
                    size="small"
                    :disabled="isDisabaledNexBtn()"
                    type="primary" @click="exercisesIndex+=1;getQueryOPAnalysis(exercises.id,exercises.questions[exercisesIndex-1].id,exercises.questions[exercisesIndex-1].type)">
                      下一题
                  </el-button>
                  <div class="fr marr10 marl10 mart8 text-bold" v-if="exercises.question_count>0">{{exercises.question_count>0?exercisesIndex:'0'}}/{{exercises.question_count}}</div>
                  <el-button 
                    class="fr"
                    v-if="exercises.question_count>0"
                    size="small"
                    :disabled="isDisabaledPreBtn()"
                    type="primary"  @click="exercisesIndex-=1;getQueryOPAnalysis(exercises.id,exercises.questions[exercisesIndex-1].id,exercises.questions[exercisesIndex-1].type)">
                      上一题
                  </el-button>
                </div>
                <div v-if="exercises.question_count>0">
                  <div v-for="(item,index) in exercises.questions" v-if="index+1===exercisesIndex">
                    <el-form label-width="100px" class="show-detail-form">
                      <el-row :gutter="20">
                        <el-col :span="24">
                          <el-form-item :label="'第 '+(index+1<10?'0'+(index+1):(index+1))+' 题：'">
                            {{item.question}}（{{item.score?item.score:''}}分）&nbsp;&nbsp;&nbsp;
                            <el-tag type="success" v-if="item.type===1">单选题</el-tag>
                            <el-tag type="primary" v-if="item.type===2">多选题</el-tag>
                            <el-tag type="danger" v-if="item.type===3">判断题</el-tag>
                            <el-tag type="warning" v-if="item.type===4">评语</el-tag>
                            <div v-if="item.type===1||item.type===2">
                              <el-form label-width="15px" class="show-detail-form_s" v-if="item.options&&item.options.length>0">
                                <div v-for="(itemO,indexO) in item.options">
                                  <el-form-item :label="common.exerciseOptions(indexO+1)+'.'">{{itemO.name}}</el-form-item>
                                </div>
                              </el-form>
                              <div class="no-data" v-else>暂无选项</div>
                            </div>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="解析：">{{item.analyze}}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="选项统计：">
                            <options-analysis className="answer" :data="optionsAnalysis" v-if="optionsAnalysis.length>0"></options-analysis>
                            <div v-else style="color: #909399;font-weight: 400;font-size: 14px;">暂无数据</div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </div>
                <div class="no-data" v-else>暂无数据</div>
              </el-card> 
            </div>
            <div class="no-data" v-else>暂无数据</div>
          </el-card> 
          
          <!-- 教学分析 -->
          <el-card class="mart20">
            <div slot="header">
              <span class="card-title">教学分析</span>
            </div>
            <div>
              <div>答题任务被引用 {{teachingAnalysis.quote}} 次，共计学生 {{teachingAnalysis.members}} 人。</div>
              <teaching-analysis className="answer" :data="teachingAnalysis.data"></teaching-analysis>
            </div>
          </el-card>
        </div> 
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
    </div>
    <!-- 编辑基本信息 --> 
    <el-dialog 
      width="550px"
      title="编辑基本信息" 
      :visible.sync="editCourseDialog">
        <el-form ref="courseForm" :model="courseForm" label-width="100px" v-loading="dialogLoading">
          <el-form-item 
            label="名称：" 
            prop="name"
            :rules="[
              { required: true, message: '请输入名称', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
              ">
            <el-input v-model="courseForm.name" class="w220"></el-input>
          </el-form-item> 
          <el-form-item 
            label="得分占比：" 
            prop="value"
            :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
            <el-slider v-model="courseForm.value" :format-tooltip="formatTooltip" class="w220"></el-slider>
          </el-form-item> 
          <el-form-item 
            label="通过分数：" 
            prop="adopt_score"
            :rules="[{ required: true, message: '请输入通过分数', trigger: 'blur' },]"> 
            <el-input-number type="number" :min="0" :max="100" :step="10" v-model="courseForm.adopt_score"></el-input-number>
          </el-form-item>  
          <el-form-item 
            label="要求：" 
            prop="description"
            :rules="[
              { required: true, message: '请输入要求', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]
              ">
            <el-input type="textarea" :rows="6" v-model="courseForm.description"></el-input>
          </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCourseDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitCourse('courseForm')">保存</el-button>
        </div>
    </el-dialog> 
  </div>
</template>
<script>
  import TeachingAnalysis from "../../../EducationEcharts/TeachingAnalysis.vue"
  import OptionsAnalysis from "../../../EducationEcharts/OptionsAnalysis.vue"
  export default {
    data () {
      return { 
        dialogLoading:false,
        isExistTeacher:  false, // ture表示有老师角色，false则没有
        questionType:['','评价教学','互评','自评'],
        loading:false,
        paramsCId:          this.$route.params.course_id,
        paramsEId:          this.$route.params.experiment_id,
        paramsTId:          this.$route.params.task_id,
        
        //任务详情
        courseDetailData:  null,// 任务的基本信息 
        exercises:         null,// 任务的试卷习题
        exercisesIndex:    1,// 第几题

        // 编辑任务基本信息
        editCourseDialog:  false,
        courseForm:{
          name:           null,
          value:          0, //占比
          adopt_score:    null, 
          description:    null,
          // task_files:     null,
        },

        teachingAnalysis:{
          members: 0,
          quote: 0,
          data:[
            {value:0, name:'100分-90分'},
            {value:0, name:'90分-80分'},
            {value:0, name:'80分-70分'},
            {value:0, name:'70分-60分'},
            {value:0, name:'60分以下'}
          ],
        },

        optionsAnalysis:[
          {value:0, name:'A'},
          {value:0, name:'B'},
          {value:0, name:'C'},
          {value:0, name:'D'},
          {value:0, name:'E'}
        ],
      }
    },
    components: {
      TeachingAnalysis,
      OptionsAnalysis
    },
    mounted(){
      this.getQueryCourseDetail();
      this.getQueryAnalysis();
      this.loginAccountIsRole();
    },
    methods: {
      /*
       * 获取当前账号有没有自己想要的角色Id
       * @params {string} roleId 角色Id
       */
      loginAccountIsRole(){
        this.isExistTeacher = false;
        this.axios.get(`${this.common.basePath}/participant/type`,{params: {experiment_id: this.paramsEId}}).then((response) => { 
          if(response.data.data){ 
             response.data.data.forEach((item) => {
              // 1, "课程组长"  2, "任课教师" 3, "学生", 4, "助教"
              if(item == '2'){ 
                this.isExistTeacher = true;
              } 
            });
          }
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
      /*
        是否禁用 禁用按钮
       */
      isDisabaledDelBtn(){
        if(!this.common.checkAuthority('Lesson-Data-AnswerDetail-Disabled',true) === false){//有权限
          if(this.courseDetailData.cur_status==1||this.courseDetailData.cur_status==2){
            return false;
          }else{
            return true;
          }
        }else{//无权限
          return true;
        }
      },
      /**
       * 得分占比百分比 格式化
       * @author chuanlin.Xiao
       * @date   2019-11-19T13:57:14+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      formatTooltip(val) {
        return val+"%";
      }, 
      /**
       * 重置表单
       * @author chuanlin.Xiao
       * @date   2019-11-18T16:11:15+0800
       * @return {[type]}                 [description]
       */
      resetForm(formName){ 
        this.$refs[formName] ? this.$refs[formName].resetFields() : '';
      },
      /*
        是否禁用上一题、下一题按钮
       */
      isDisabaledPreBtn(){
        if(!this.common.checkAuthority('Lesson-Data-AnswerDetail-PreNext',true) === false){//有权限
          if(this.exercisesIndex<2){
            return true;
          }else{//未选中需要的
            return false;
          }
        }else{//无权限
          return true;
        }
      },
      isDisabaledNexBtn(){
        if(!this.common.checkAuthority('Lesson-Data-AnswerDetail-PreNext',true) === false){//有权限
          if(this.exercisesIndex>this.exercises.question_count-1){
            return true;
          }else{
            return false;
          }
        }else{//无权限
          return true;
        }
      },
      
      /*
       * 查询任务详情-基本信息
       */
      getQueryCourseDetail(){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/baseTask/${this.paramsTId}`,'').then((response) => {
          this.courseDetailData = response.data.data;
          response.data.data.associated_object?this.getQueryExercises(response.data.data.associated_object):this.loading = false;
        }).catch((error) => {
          this.$message.error(error);  
          this.loading = false;
        });
      },
      /**
       * 编辑回显
       * @author chuanlin.Xiao
       * @date   2019-11-29T09:55:29+0800
       * @return {[type]}                 [description]
       */
      echo(){
        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/baseTask/${this.paramsTId}`,'').then((response) => {
          this.courseForm = response.data.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);  
          this.dialogLoading = false;
        });
      },
      /*
       * 查询任务详情-试题
       */
      getQueryExercises(id){
        this.axios.get(`${this.common.basePath}/paper/detail/${id}`,'').then((response) => {
          this.exercises = response.data.data;
          response.data.data.questions&&response.data.data.question_count>0 ? this.getQueryOPAnalysis(response.data.data.id,response.data.data.questions[0].id,response.data.data.questions[0].type) : this.loading = false;
          this.loading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.loading = false;  
        });
      },
      /*
       * 查询任务详情-选项分析
       */
      getQueryOPAnalysis(paperId,questionId,type){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/question/answerTotal`,{params:{paperId:paperId,question:questionId}}).then((response) => {
          let arr = [];
          let that = this;
          if(response.data.data){
            if(response.data.data[0].optionsAnalysis){
              if(type===1||type===2){// 单选或多选
                response.data.data[0].optionsAnalysis.forEach( function(element, index) {
                  arr.push({name:that.common.exerciseOptions(index+1),value:element.value})
                });
              }else if(type===3){// 判断
                response.data.data[0].optionsAnalysis.forEach( function(element, index) {
                  arr.push({name:that.common.exerciseOptions(index+1),value:element.value})
                });
              }else if(type===4){// 简答
                response.data.data[0].optionsAnalysis.forEach( function(element, index) {
                  arr.push({name:element.name,value:element.value})
                });
              }
            }
          }else{
            arr = [];
          }
          this.optionsAnalysis=arr;
          this.loading = false;
        }).catch((error) => {
          this.$message.error(error); 
          this.loading = false; 
        });
      },
      /*
       * 查询任务详情-教学分析
       */
      getQueryAnalysis(){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/baseTask/analysis`,{params:{id:this.paramsTId,type:1}}).then((response) => {
          this.teachingAnalysis = response.data.data;
          this.loading = false;
        }).catch((error) => {
          this.$message.error(error); 
          this.loading = false; 
        });
      },
      /*
       * 编辑任务的基本信息
       */
      submitCourse(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.patch(`${this.common.basePath}/baseTask/${this.paramsTId}`,this.courseForm).then((response) => {
              this.getQueryCourseDetail();
              this.editCourseDialog = false;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.editCourseDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /*
       * 禁用任务
       */
      disabledTask(id){
        this.$confirm('  你在进行任务模板的操作！如果禁用以后将不能使用此模板创建任务！', '禁用', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.disabledTask_(id);
        }).catch(() => {});
      },
      disabledTask_(id){ 
        this.axios.patch(`${this.common.basePath}/baseTask/${id}`,{cur_status:2}).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getQueryCourseDetail();
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      /*
       * 解禁任务
       */
      noDisabledTask(id){
        this.$confirm('  你在进行任务模板的操作！是否解禁该任务！', '解禁', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.noDisabledTask_(id);
        }).catch(() => {});
      },
      noDisabledTask_(id){ 
        this.axios.patch(`${this.common.basePath}/baseTask/${id}`,{cur_status:1}).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getQueryCourseDetail();
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      /*
       * 删除任务
       */
      deleteCourse(id){
        this.$confirm('  您正在对实验的任务资料进行删除操作，如果任务资料删除成功将会导致该任务等资料永久消失！ 请谨慎操作！', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCourse_(id);
        }).catch(() => {});
      },
      deleteCourse_(id){ 
        this.axios.patch(`${this.common.basePath}/baseTask/delete/${id}`).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.$router.push({name: "LessonSystemExperimentDetail"});
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      
      
    },
  }
</script>
<style lang="less">
  
</style>