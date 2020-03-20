<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/system/' }">课程资源</el-breadcrumb-item>
        <el-breadcrumb-item v-if="paramsCId" :to="{ path: `/lesson/system/coursedetail/${paramsCId}` }">课程详情</el-breadcrumb-item>
        <el-breadcrumb-item>实验详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg" v-loading="loading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div v-if="common.checkAuthority('Lesson-Data-ExperimentDetail-Query', true)">
          <!-- 基本信息 -->
          <el-card>
            <div slot="header">
              <span class="card-title">基本信息</span>
              <el-switch
                class="fr"
                 v-if="courseDetailData"
                :title="courseDetailData.cur_status===1?'禁用':'启用'"
                @change="courseDetailData.cur_status===1?disabledCourse(courseDetailData.id):noDisabledCourse(courseDetailData.id)"
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
                  <el-form-item label="所属课程："><el-link type="primary" @click='$router.push({name: "LessonSystemCourseDetail", params: {course_id: courseDetailData.course_id}})' :underline="false">{{courseDetailData.courseName}}</el-link></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="满分：">{{courseDetailData.score}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="占分得比：">{{(courseDetailData.value?courseDetailData.value:'0')+'%'}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="类型：">
                    <el-tag type="success" v-if="courseDetailData.etype===1" >个人实验</el-tag>
                    <el-tag type="primary" v-if="courseDetailData.etype===2" >小组实验</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="简介：">
                    <p class="cursor-pointer_T">{{courseDetailData.description}}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="实验资料：">
                    <div> 
                      <upload 
                        :isDisabled="!common.checkAuthority('Lesson-Data-ExperimentDetail-UploadExperimentData', true)"
                        :buttonText="'点击上传'" 
                        @uploadSuccess="(response) => {uploadSuccess('epData', response)}"></upload>
                    </div>
                    <div v-if="courseDetailData.baseExperimentsData&&courseDetailData.baseExperimentsData.length>0">
                      <file-show 
                        :fileList="courseDetailData.baseExperimentsData" 
                        :closable="common.checkAuthority('Lesson-Data-ExperimentDetail-UploadExperimentData', true)"
                        @handleClose="handleTagClose">
                      </file-show>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <p class="text-right">
                    <el-button 
                      :disabled="!common.checkAuthority('Lesson-Data-ExperimentDetail-Edit', true)"
                      type="primary" @click="editCourseDialog = true;echo();">
                        编辑
                    </el-button>
                    <el-button 
                      :disabled="!common.checkAuthority('Lesson-Data-ExperimentDetail-Delete', true)"
                      type="danger" @click="deleteCourse(courseDetailData.id)">
                        删除
                    </el-button>
                  </p>
                </el-col>
              </el-row>
            </el-form>
          </el-card> 
          <!-- 任务列表 -->
          <el-card class="mart20">
            <div slot="header" class="overflow-hidden">
              <span class="card-title fl">任务列表</span>
              <el-button 
                class="fr"
                size="small"
                :disabled="!common.checkAuthority('Lesson-Data-ExperimentDetail-AddQuestionTask', true) "
                type="primary" @click="questionTaskDialog = true;resetForm('questionTaskForm');">
                  添加问卷任务
              </el-button>
              <el-button 
                class="fr marr10"
                size="small"
                :disabled="!common.checkAuthority('Lesson-Data-ExperimentDetail-AddAnswerTask', true) "
                type="primary" @click="answerTaskDialog = true;resetForm('answerTaskForm');">
                  添加答题任务
              </el-button>
              <el-button 
                class="fr"
                size="small"
                :disabled="!common.checkAuthority('Lesson-Data-ExperimentDetail-AddReportTask', true) "
                type="primary" @click="reportTaskDialog = true;resetForm('reportTaskForm');">
                  添加报告任务
              </el-button>
            </div>
            
            <el-row :gutter="20" v-if="experimentList.total>0">
              <el-col :span="12" v-for="(item,index) in experimentList.rows" >
                <el-card shadow="" :key="index" class="marb10">
                  <div slot="header" class="overflow-hidden">
                    <el-checkbox-group v-model="ids" size="small">
                    <div class="card-title fl mart5">
                      <!-- <el-checkbox :label="item" :disabled="true">&nbsp;</el-checkbox>  -->
                      <span style="margin-left: 0px;" class="card-title cursor-pointer" @click="goToDetail(item)">{{item.name}}</span>
                    </div> 
                    </el-checkbox-group>
                    <el-tag type="success" v-if="item.type===1" class="cursor-pointer fr" @click="goToDetail(item)">答题任务</el-tag>
                    <el-tag type="primary" v-if="item.type===2" class="cursor-pointer fr" @click="goToDetail(item)">报告任务</el-tag>
                    <el-tag type="warning" v-if="item.type===4" class="cursor-pointer fr" @click="goToDetail(item)">问卷任务</el-tag>
                  </div>
                  <div  @click="goToDetail(item)" style="min-height: 230px">
                    <el-form label-width="100px" class="show-detail-form cursor-pointer">
                      <el-row :gutter="20">
                        <el-col :span="12" v-if="item.type===1||item.type===2">
                          <el-form-item label="得分占比：">{{(item.value?item.value:'0')+'%'}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="item.type===1||item.type===2">
                          <el-form-item label="满分：">{{item.score}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="item.type==2">
                          <el-form-item label="类型：">
                            <el-tag type="success" v-if="item.genre===1" >小组报告</el-tag>
                           <el-tag type="primary" v-if="item.genre===2" >个人报告</el-tag>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12"  v-if="item.type==1">
                          <el-form-item label="通过分数：">{{item.adopt_score}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="item.type==4">
                          <el-form-item label="类型：">
                            <el-tag type="success" v-if="item.paperGenre===1" >评价教学</el-tag>
                            <el-tag type="primary" v-if="item.paperGenre===2" >互评</el-tag>
                            <el-tag type="warning" v-if="item.paperGenre===3" >自评</el-tag>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24" v-if="item.type==1||item.type==2">
                          <el-form-item label="要求：">
                            <div class="desc_info_box">{{item.description?item.description:'暂无数据'}}</div>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24" v-if="item.type==4">
                          <el-form-item label="要求：">
                            <div class="desc_info_box">{{item.paperDescription?item.paperDescription:'暂无数据'}}</div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <!-- 分页 -->
            <el-pagination
              background
              v-if="experimentList.total>0"
              class="text-right"
              layout="total, sizes, prev, pager, next"
              :current-page="pageNum"
              :page-size="pageSize"
              :page-sizes="[4, 8, 12]"
              :total="experimentList.total"
              @size-change="pageSizeChange('getQueryExperimentList',$event)"
              @current-change="pageCurrentChange('getQueryExperimentList',$event)">
            </el-pagination>
            <div class="no-data" v-if="experimentList.total==0">暂无数据</div>
          </el-card> 
          <!-- 教学分析 -->
          <el-card class="mart20">
            <div slot="header">
              <span class="card-title">教学分析</span>
            </div>
            <div>
              <div>实验开设 {{teachingAnalysis.quote}} 次，共计学生 {{teachingAnalysis.members}} 人。</div>
              <teaching-analysis className="course" :data="teachingAnalysis.data"></teaching-analysis>
            </div>
          </el-card>
        </div> 
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
    </div>

    <!-- 编辑实验基本信息 --> 
    <el-dialog 
      width="550px"
      title="编辑基本信息" 
      :visible.sync="editCourseDialog">
        <el-form ref="courseForm" :model="courseForm" label-width="100px" v-loading="dialogLoading">
          <el-form-item 
            label="名称：" 
            prop="name"
            :rules="[
              { required: true, message: '请输入实验名称', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
              ">
            <el-input v-model="courseForm.name" class="w220"></el-input>
          </el-form-item>
          <el-form-item 
            label="满分：" 
            prop="score"
            :rules="[{ required: true, message: '请输入满分', trigger: 'blur' },]"> 
            <el-input-number type="number" :min="0" :max="100" :step="10" v-model="courseForm.score"></el-input-number>
          </el-form-item> 
          <el-form-item 
            label="得分占比：" 
            prop="value"
            :rules="[
              { required: true, message: '请输入实验得分占比', trigger: 'blur' }]">
            <el-slider v-model="courseForm.value" :format-tooltip="formatTooltip" class="w220"></el-slider>
          </el-form-item>
          <el-form-item 
            label="类型：" 
            prop="etype"
            :rules="[{ required: true, message: '请选择实验类型', trigger: 'blur' },]">
            <el-radio-group v-model="courseForm.etype">
              <el-radio :label="1">个人实验</el-radio>
              <el-radio :label="2">小组实验</el-radio> 
            </el-radio-group>
          </el-form-item> 
          <el-form-item 
            label="简介：" 
            prop="description"
            :rules="[
              { required: true, message: '请输入实验简介', trigger: 'blur' },
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

    <!-- 添加报告任务 -->
    <el-dialog 
      width="550px"
      title="添加报告任务" 
      :visible.sync="reportTaskDialog">
        <el-form ref="reportTaskForm" :model="reportTaskForm" label-width="100px" > 
          <el-form-item 
            label="名称：" 
            prop="name"
            :rules="[
              { required: true, message: '请输入名称', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
              ">
            <el-input v-model="reportTaskForm.name" class="w220"></el-input>
          </el-form-item> 
          <el-form-item 
            label="得分占比：" 
            prop="value"
            :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
            <el-slider v-model="reportTaskForm.value" :format-tooltip="formatTooltip" class="w220"></el-slider>
          </el-form-item> 
          <el-form-item 
            label="满分：" 
            prop="score"
            :rules="[{ required: true, message: '请输入满分', trigger: 'blur' },]"> 
            <el-input-number type="number" :min="0" :max="100" :step="10" v-model="reportTaskForm.score"></el-input-number>
          </el-form-item> 
          <el-form-item 
            label="类型：" 
            prop="genre"
            :rules="[{ required: true, message: '请选择类型', trigger: 'blur' },]">
            <el-radio-group v-model="reportTaskForm.genre">
              <el-radio :label="1">小组报告</el-radio> 
              <el-radio :label="2">个人报告</el-radio>
            </el-radio-group>
          </el-form-item> 
          <el-form-item 
            label="模板：" 
            prop="task_files"
            :rules="[{ required: false, message: '请选择报告模板', trigger: 'blur' },]">
            <upload 
              :buttonText="!reportTaskForm.task_files||reportTaskForm.task_files===''?'点击上传':'重新上传'"
              @uploadSuccess=" uploadReportSuccess "></upload>
            <div v-if="reportTaskForm.task_files">  
              <file-show :fileList="[JSON.parse(reportTaskForm.task_files)]" :closable="true" @handleClose="handleClose"></file-show>
            </div>
          </el-form-item> 
          <el-form-item 
            label="要求：" 
            prop="description"
            :rules="[
              { required: true, message: '请输入要求', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]
              ">
            <el-input type="textarea" :rows="6" v-model="reportTaskForm.description"></el-input>
          </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="reportTaskDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitReport('reportTaskForm')">保存</el-button>
        </div>
    </el-dialog>
    
    <!-- 添加答题任务 -->
    <el-dialog 
      width="900px"
      title="添加答题任务" 
      :visible.sync="answerTaskDialog">
        <el-form ref="answerTaskForm" :model="answerTaskForm" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item 
                label="名称：" 
                prop="name"
                :rules="[
                  { required: true, message: '请输入名称', trigger: 'blur' },
                  { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
                ">
                <el-input v-model="answerTaskForm.name" class="w220"></el-input>
              </el-form-item> 
            </el-col>
            <el-col :span="12"> 
              <el-form-item 
                label="得分占比：" 
                prop="value"
                :rules="[
                  { required: true, message: '请输入得分占比', trigger: 'blur' },]
                ">
                <el-slider v-model="answerTaskForm.value" :format-tooltip="formatTooltip" class=""></el-slider>
              </el-form-item> 
            </el-col>
            <el-col :span="12">
              <el-form-item 
                label="通过分数："
                prop="adopt_score"
                :rules="[
                  { required: true, message: '请输入通过分数', trigger: 'blur' },]
                "> 
                <el-input-number type="number" :min="0" :max="100" :step="10" v-model="answerTaskForm.adopt_score"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24"> 
              <el-form-item label="试题内容：">  
                <el-card>
                  <test-paper :paperItem="answerTaskForm.paperItem" :isEdit="true"></test-paper>
                </el-card>
              </el-form-item> 
            </el-col>
          </el-row>  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="answerTaskDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitAnswer('answerTaskForm')">保存</el-button>
        </div>
    </el-dialog>

    <!-- 添加问卷任务 -->
    <el-dialog 
      width="900px"
      title="添加问卷任务" 
      :visible.sync="questionTaskDialog">
        <el-form ref="questionTaskForm" :model="questionTaskForm" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item 
                label="名称："  
                prop="name"
                :rules="[
                  { required: true, message: '请输入名称', trigger: 'blur' },
                  { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
                ">
                <el-input v-model="questionTaskForm.name"  class="w220"></el-input>
              </el-form-item> 
            </el-col> 
            <el-col :span="24"> 
              <el-form-item label="问卷内容："> 
                <el-card>
                  <questionnaire-paper :questionnaire="questionTaskForm.questionnaire" isEdit="true"></questionnaire-paper>
                </el-card>
              </el-form-item> 
            </el-col>
          </el-row>  
        </el-form> 
        <div slot="footer" class="dialog-footer">
          <el-button @click="questionTaskDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitQuestion('questionTaskForm')">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
  import upload from "../../../../components/Upload.vue"
  import FileShow from "../../../../components/FileShow.vue"
  import TeachingAnalysis from "../../EducationEcharts/TeachingAnalysis.vue"
  import TestPaper from '../../../../components/TestPaperC.vue'
  import QuestionnairePaper from '../../../../components/Questionnaire.vue'
  export default {
    data () {
      return { 
        dialogLoading:false,
        isExistTeacher:  false, // ture表示有老师角色，false则没有
        loading:false,
        paramsCId:          this.$route.params.course_id,
        paramsEId:          this.$route.params.experiment_id,

        //分页
        pageNum:1,
        pageSize:4,

        //实验详情
        courseDetailData:  null,// 实验的基本信息
        experimentList:    {rows:[],total:0},// 实验的任务列表
        ids:               [],// 实验的任务列表所选择的数组  

        // 编辑实验基本信息
        editCourseDialog:  false,
        courseForm:{
          "name":           null,
          "description":    null, 
          "etype":          null,   
          "value":          0,
          "score":          100
        },

        // 添加报告任务
        reportTaskDialog: false,
        reportTaskForm:   { //报告任务表单
          type:           2,// 1答题任务  2报告任务 4问卷任务
          experiment_id:  this.$route.params.experiment_id,
          name:           null,
          value:          0, //占比
          score:          null, 
          description:    null,
          genre:          null, //报告类型
          task_files:     null,
        },

        // 添加答题任务
        answerTaskDialog:false,
        answerTaskForm: {
          type:           1,// 1答题任务  2报告任务 4问卷任务
          "experiment_id": this.$route.params.experiment_id,
          "name":          null,
          "value":         0,
          "adopt_score":   null,
          "paperItem": {
            name:      null,
            exam_time: null,
            questions: [],
          },
        },

        // 添加问卷任务
        questionTaskDialog:false,
        questionTaskForm: {
          type:           4,// 1答题任务  2报告任务 4问卷任务
          experiment_id: this.$route.params.experiment_id,
          name:          null,
          questionnaire: {
            name:         null,
            type:         1, //问卷类型：1评价教学2互评3自评
            description:  null,
            qItems:       [],
          },
        },
        paperCreatorAccount: null,

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
      }
    },
    components: {
      upload,
      FileShow,
      TeachingAnalysis,
      TestPaper,
      QuestionnairePaper
    },
    mounted(){
      this.getQueryCourseDetail();
      this.getQueryExperimentList();
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
        if(!this.common.checkAuthority('Lesson-Data-ExperimentDetail-Disabled',true) === false){//有权限
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
      /*
       * 前往该任务的详情
       */
      goToDetail(item){
        if(this.common.checkAuthority('Lesson-Data-ExperimentDetail-QueryTaskDetail', true)){
          if(item.type===1){
            this.$router.push({name: "LessonSystemAnswerDetail", params: {task_id: item.id}});
          }else if(item.type===2){
            this.$router.push({name: "LessonSystemReportDetail", params: {task_id: item.id}});
          }else if(item.type===4){
            this.$router.push({name: "LessonSystemQuestionDetail", params: {task_id: item.id}});
          }
        }else{
          this.$message('无权限,不能查看详情');
        }
      },
      /**
       * 分页
       * @author chuanlin.Xiao
       * @date   2019-11-12T14:17:22+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      pageSizeChange(type,val) {
        this.pageSize = val
        if(type=="getQueryExperimentList"){
          this.getQueryExperimentList()
        }
      },
      pageCurrentChange(type,val) {
        this.pageNum = val
        if(type=="getQueryExperimentList"){
          this.getQueryExperimentList()
        }
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
       * 实验详情-上传附件的回调
       */
      uploadSuccess(keyName, response){ 
        // 1为课程资料(courseData); 2 为课程大纲(syllabus)，3为实验资料(epData)
        let ao_type = keyName == 'epData' ? 3 : ''; 
        let params = {
          name:               response.name,
          path:               response.path,
          associated_object:  this.$route.params.experiment_id,
          ao_type:            ao_type,
          is_template:0,
        }
        this.axios.post(`${this.common.basePath}/c_literature`,params).then((response) => {
          this.getQueryCourseDetail(); 
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
      /*
       * 实验详情-删除指定Id的资料文件
       */
      handleTagClose(item){ 
        this.$confirm('是否确认删除该附件？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`${this.common.basePath}/c_literature/${item.id}`, '').then((response) => {
            this.getQueryCourseDetail();
            this.$message.success(response.data.meta.message);
          }).catch((error) => {
            this.$message.error(error);  
          }); 
        }).catch(() => {
                   
        }); 
      },
      /*
       * 添加报告-上传附件的回调
       */
      uploadReportSuccess(response){
        this.reportTaskForm.task_files = JSON.stringify(response);
      },
      /*
       * 添加报告-删除已上传附件
       */
      handleClose(tag) {
        this.$confirm("是否确认删除该附件？", "删除", {
          comfirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          this.reportTaskForm.task_files = null; 
        }).catch(err => {})
      },
      
      /*
       * 查询实验详情-基本信息
       */
      getQueryCourseDetail(){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/baseExperiment/${this.paramsEId}`,'').then((response) => {
          this.courseDetailData = response.data.data;
          this.loading = false;
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
        this.axios.get(`${this.common.basePath}/baseExperiment/${this.paramsEId}`,'').then((response) => {
          this.courseForm= response.data.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);  
          this.dialogLoading = false;
        });
      },
      /*
       * 查询实验详情-该实验的任务列表
       */
      getQueryExperimentList(){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/baseTask/findList`,{params:{pageNum:this.pageNum,pageSize:this.pageSize,experiment_id:this.paramsEId}}).then((response) => {
          this.experimentList = response.data.data;
          this.loading = false;
        }).catch((error) => {
          this.$message.error(error);  
          this.loading = false;
        });
      },
      /*
       * 查询实验详情-教学分析
       */
      getQueryAnalysis(){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/baseExperiment/analysis`,{params:{experimentID:this.paramsEId}}).then((response) => {
          this.teachingAnalysis = response.data.data;
          this.loading = false;
        }).catch((error) => {
          this.$message.error(error); 
          this.loading = false; 
        });
      },
      /*
       * 编辑实验的基本信息
       */
      submitCourse(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.patch(`${this.common.basePath}/baseExperiment/${this.paramsEId}`,this.courseForm).then((response) => {
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
       * 禁用实验
       */
      disabledCourse(id){
        this.$confirm('  你在进行实验模板的操作！如果禁用以后将不能使用此模板创建实验！', '禁用', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.disabledCourse_(id);
        }).catch(() => {this.getQueryCourseDetail();});
      },
      disabledCourse_(id){ 
        this.axios.patch(`${this.common.basePath}/baseExperiment/${id}`,{cur_status:2}).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getQueryCourseDetail();
        }).catch((error) => {
          this.getQueryCourseDetail();
          this.$message.error(error); 
        });
      }, 
      /*
       * 解禁实验
       */
      noDisabledCourse(id){
        this.$confirm('  你在进行实验模板的操作！是否解禁该实验！', '解禁', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.noDisabledCourse_(id);
        }).catch(() => {this.getQueryCourseDetail();});
      },
      noDisabledCourse_(id){ 
        this.axios.patch(`${this.common.basePath}/baseExperiment/${id}`,{cur_status:1}).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getQueryCourseDetail();
        }).catch((error) => {
          this.getQueryCourseDetail();
          this.$message.error(error); 
        });
      }, 
      /*
       * 删除实验
       */
      deleteCourse(id){
        this.$confirm('  您正在对课程的实验资料进行删除操作，如果实验资料删除成功将会导致该实验的任务、大纲等资料永久消失！ 请谨慎操作！', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCourse_(id);
        }).catch(() => {});
      },
      deleteCourse_(id){ 
        this.axios.patch(`${this.common.basePath}/baseExperiment/delete/${id}`).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.$router.push({name: "LessonSystemCourseDetail"});
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      /*
       * 添加任务
       */
      submitReport(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/baseTask`,this.reportTaskForm).then((response) => {
              this.getQueryExperimentList();
              this.reportTaskDialog = false;
              this.$message.success(response.data.meta.message);
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
       * 添加答题
       */
      submitAnswer(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/baseTask/save`,this.answerTaskForm).then((response) => {
              this.getQueryExperimentList();
              this.answerTaskDialog = false;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.answerTaskDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /*
       * 添加问卷
       */
      submitQuestion(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/baseTask/save/questionnaire`,this.questionTaskForm).then((response) => {
              this.getQueryExperimentList();
              this.questionTaskDialog = false;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.questionTaskDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      
      
    },
  }
</script>
<style lang="less">
  
</style>