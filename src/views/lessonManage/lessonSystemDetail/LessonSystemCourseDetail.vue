<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/system/' }">课程资源</el-breadcrumb-item>
        <el-breadcrumb-item>课程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg" v-loading="loading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div v-if="common.checkAuthority('Lesson-Data-CourseDetail-Query', true)">
          <!-- 基本信息 -->
          <el-card>
            <div slot="header">
              <span class="card-title">基本信息</span>
              <el-switch
                v-if="courseDetailData"
                class="fr"
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
                  <el-form-item label="编号：">{{courseDetailData.c_code}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="教师：">{{courseDetailData.c_teacher}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性质：">{{courseDetailData.c_nature}}</el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="简介：">
                    <p class="cursor-pointer_T">{{courseDetailData.description}}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="课程大纲：">
                    <div> 
                      <upload 
                        :isDisabled="!common.checkAuthority('Lesson-Data-CourseDetail-UploadSyllabus', true)"
                        :buttonText="'点击上传'" 
                        @uploadSuccess="(response) => {uploadSuccess('syllabus', response)}"></upload>
                    </div>
                    <div v-if="courseDetailData.syllabus&&courseDetailData.syllabus.length>0">
                      <file-show 
                        :fileList="courseDetailData.syllabus" 
                        :closable="common.checkAuthority('Lesson-Data-CourseDetail-UploadSyllabus', true)"
                        :isDownload="common.checkAuthority('Lesson-Data-CourseDetail-UploadSyllabus', true)"
                        @handleClose="handleTagClose">
                      </file-show>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="课程资料：">
                    <div> 
                      <upload 
                        :isDisabled="!common.checkAuthority('Lesson-Data-CourseDetail-UploadData', true)"
                        :buttonText="'点击上传'" 
                        @uploadSuccess="(response) => {uploadSuccess('courseData', response)}"></upload>
                    </div>
                    <div v-if="courseDetailData.courseData&&courseDetailData.courseData.length>0">
                      <file-show 
                        :fileList="courseDetailData.courseData" 
                        :closable="common.checkAuthority('Lesson-Data-CourseDetail-UploadData', true)"
                        :isDownload="common.checkAuthority('Lesson-Data-CourseDetail-UploadData', true)"
                        @handleClose="handleTagClose">
                      </file-show>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <p class="text-right">
                    <el-button 
                      :disabled="isDisabaledBeginBtn()"
                      type="success" @click="beginCourseDialog = true;resetForm('beginForm');">
                        开课
                    </el-button>
                    <el-button 
                      :disabled="!common.checkAuthority('Lesson-Data-CourseDetail-Edit', true)"
                      type="primary" @click="editCourseDialog = true;echo();">
                        编辑
                    </el-button>
                    <el-button 
                      :disabled="!common.checkAuthority('Lesson-Data-CourseDetail-Delete', true)"
                      type="danger" @click="deleteCourse(courseDetailData.id)">
                        删除
                    </el-button>
                  </p>
                </el-col>
              </el-row>
            </el-form>
          </el-card> 
          <!-- 实验列表 -->
          <el-card class="mart20">
            <div slot="header" class="overflow-hidden">
              <span class="card-title fl">实验列表</span>
              <el-button 
                class="fr"
                size="small"
                :disabled="!common.checkAuthority('Lesson-Data-CourseDetail-AddExperiment', true)"
                type="primary" @click="courseOperaDialog = true;resetForm('submitTestForm');">
                  添加实验
              </el-button>
            </div>
            
            <el-row :gutter="20" v-if="experimentList.length>0">
              <el-col :span="12" v-for="(item,index) in experimentList" >
                <el-card shadow="" :key="index" class="marb10">
                  <div slot="header" class="overflow-hidden">
                    <div class="card-title fl mart5">
                      <span style="margin-left: 0px;" class="card-title cursor-pointer" @click="goToDetail(item.id)">{{item.name+'（'+(item.defaultValue?item.defaultValue:'0')+'%）'}}</span>
                    </div>
                    <el-tag type="success" v-if="item.eType===1" class="cursor-pointer fr" @click="goToDetail(item.id)">个人实验</el-tag>
                    <el-tag type="primary" v-if="item.eType===2" class="cursor-pointer fr" @click="goToDetail(item.id)">小组实验</el-tag>
                  </div>
                  <div>
                    <div class="cursor-pointer desc_info_box" @click="goToDetail(item.id)">简介：{{item.description?item.description:'暂无简介'}}</div>
                    <div class="text-bold mart5">报告任务{{item.presentationTask?item.presentationTask:'0'}}个，习题任务{{item.exercisesTask?item.exercisesTask:'0'}}个，问卷调查{{item.questionnaireTask?item.questionnaireTask:'0'}}个。</div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <div class="no-data" v-if="experimentList.length==0">暂无数据</div>
          </el-card>
           <!-- 问卷列表 -->
          <el-card class="mart20">
            <div slot="header" class="overflow-hidden">
              <span class="card-title fl">问卷列表</span>
              <el-button 
                class="fr"
                size="small"
                :disabled="!common.checkAuthority('Lesson-Data-CourseDetail-AddQuestionnaire', true)"
                type="primary" @click="questionTaskDialog = true;resetForm('questionTaskForm');">
                  添加问卷
              </el-button>
            </div>
            
            <el-row :gutter="20" v-if="questionnaireList.total>0">
              <el-col :span="12" v-for="(item,index) in questionnaireList.rows" >
                <el-card shadow="" :key="index" class="marb10">
                  <div slot="header" class="overflow-hidden">
                    <div class="card-title fl mart5">
                      <span style="margin-left: 0px;" class="card-title cursor-pointer" @click="goToDetail_(item.baseCQuestionnaireId)">{{item.name}}</span>
                    </div>
                    <!-- <el-tag type="success" v-if="item.eType===1" class="cursor-pointer fr" @click="goToDetail_(item.id)">个人实验</el-tag> -->
                    <!-- <el-tag type="primary" v-if="item.eType===2" class="cursor-pointer fr" @click="goToDetail_(item.id)">小组实验</el-tag> -->
                  </div>
                  <div>
                    <div class="cursor-pointer desc_info_box" @click="goToDetail_(item.baseCQuestionnaireId)">简介：{{item.description?item.description:'暂无简介'}}</div>
                    <!-- <div class="text-bold mart5">报告任务{{item.presentationTask?item.presentationTask:'0'}}个，习题任务{{item.exercisesTask?item.exercisesTask:'0'}}个，问卷调查{{item.questionnaireTask?item.questionnaireTask:'0'}}个。</div> -->
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <!-- 分页 -->
            <el-pagination
              background
              v-if="questionnaireList.total>0"
              class="text-right"
              layout="total, sizes, prev, pager, next"
              :current-page="pageNum"
              :page-size="pageSize"
              :page-sizes="[4, 8, 12]"
              :total="questionnaireList.total"
              @size-change="pageSizeChange('getQueryQuestionnaireList',$event)"
              @current-change="pageCurrentChange('getQueryQuestionnaireList',$event)">
            </el-pagination>
            <div class="no-data" v-if="questionnaireList.total==0">暂无数据</div>
          </el-card> 
          <!-- 教学分析 -->
          <el-card class="mart20">
            <div slot="header">
              <span class="card-title">教学分析</span>
            </div>
            <div>
              <div>课程开设 {{teachingAnalysis.quote}} 次，共计学生 {{teachingAnalysis.members}} 人。</div>
              <teaching-analysis className="course" :data="teachingAnalysis.data"></teaching-analysis>
            </div>
          </el-card>
        </div> 
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
    </div>
    <!-- 编辑课程基本信息 --> 
    <el-dialog 
      width="550px"
      title="编辑基本信息" 
      :visible.sync="editCourseDialog">
        <el-form ref="courseForm" :model="courseForm" label-width="100px" v-loading="dialogLoading">
          <el-form-item 
            label="名称：" 
            prop="name"
            :rules="[
              { required: true, message: '请输入课程名称', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
            <el-input v-model="courseForm.name"></el-input>
          </el-form-item> 
          <el-form-item 
            label="编号：" 
            prop="c_code"
            :rules="[
              { required: true, message: '请输入课程编号', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
            <el-input v-model="courseForm.c_code"></el-input>
          </el-form-item> 
          <el-form-item 
            label="教师：" 
            prop="c_teacher"
            :rules="[
              { required: true, message: '请输入课程教师', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
            <el-input v-model="courseForm.c_teacher"></el-input>
          </el-form-item> 
          <el-form-item 
            label="性质：" 
            prop="c_nature"
            :rules="[
              { required: true, message: '请输入课程性质', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
            <el-input v-model="courseForm.c_nature"></el-input>
          </el-form-item> 
          <el-form-item 
            label="简介：" 
            prop="description"
            :rules="[
              { required: true, message: '请输入课程简介', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]">
            <el-input type="textarea" :rows="6" v-model="courseForm.description"></el-input>
          </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCourseDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitCourse('courseForm')">保存</el-button>
        </div>
    </el-dialog> 
    <!-- 开课 --> 
    <el-dialog 
      width="550px"
      title="开课" 
      :visible.sync="beginCourseDialog">
        <el-form ref="beginForm" :model="beginForm" label-width="100px" >
          <el-form-item 
            label="学年：" 
            prop="cYear"
            :rules="[{ required: true, message: '请选择学年', trigger: 'blur' }]">
            <el-date-picker
              v-model="beginForm.cYear"
              type="year"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item> 
          <el-form-item 
            label="学期：" 
            prop="cStage"
            :rules="[{ required: true, message: '请选择学期', trigger: 'blur' }]">
            <el-select v-model="beginForm.cStage" placeholder="请选择">
              <el-option
                v-for="item in semesterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="beginCourseDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitBeginCourse('beginForm')">保存</el-button>
        </div>
    </el-dialog> 
    <!-- 创建实验 -->
    <el-dialog 
      width="550px"
      title="添加实验" 
      :visible.sync="courseOperaDialog">
        <el-form ref="submitTestForm" :model="submitTestForm" label-width="100px" > 
          <el-form-item 
            label="名称：" 
            prop="name"
            :rules="[{ required: true, message: '请输入实验名称', trigger: 'blur' },]">
            <el-input v-model="submitTestForm.name" class="w220"></el-input>
          </el-form-item> 
          <el-form-item 
            label="得分占比：" 
            prop="value"
            :rules="[
              { required: true, message: '请输入实验得分占比', trigger: 'blur' }]">
            <el-slider v-model="submitTestForm.value" :format-tooltip="formatTooltip" class="w220"></el-slider>
          </el-form-item>
          <el-form-item 
            label="满分：" 
            prop="score"
            :rules="[{ required: true, message: '请输入满分', trigger: 'blur' },]"> 
            <el-input-number type="number" :min="0" :max="100" :step="10" v-model="submitTestForm.score"></el-input-number>
          </el-form-item> 
          <el-form-item 
            label="类型：" 
            prop="etype"
            :rules="[{ required: true, message: '请选择实验类型', trigger: 'blur' },]">
            <el-radio-group v-model="submitTestForm.etype">
              <el-radio :label="1">个人实验</el-radio>
              <el-radio :label="2">小组实验</el-radio> 
            </el-radio-group>
          </el-form-item> 
          <el-form-item 
            label="简介：" 
            prop="description"
            :rules="[{ required: true, message: '请输入实验简介', trigger: 'blur' },]">
            <el-input type="textarea" v-model="submitTestForm.description"></el-input>
          </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="courseOperaDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitTest('submitTestForm')">保存</el-button>
        </div>
    </el-dialog> 
    <!-- 添加课程问卷 -->
    <el-dialog 
      width="900px"
      title="添加问卷" 
      :visible.sync="questionTaskDialog">
        <el-form ref="questionTaskForm" :model="questionTaskForm" label-width="120px">
          <questionnaire-paper :questionnaire="questionTaskForm.questionnaire" isEdit="true" :type="1"></questionnaire-paper> 
        </el-form> 
        <div slot="footer" class="dialog-footer">
          <el-button @click="questionTaskDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitQuestion('questionTaskForm')">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
  import upload from "../../../components/Upload.vue"
  import FileShow from "../../../components/FileShow.vue"
  import TeachingAnalysis from "../EducationEcharts/TeachingAnalysis.vue"
  import QuestionnairePaper from '../../../components/Questionnaire.vue'
  export default {
    data () {
      return { 
        dialogLoading:false,
        loading:false,
        paramsCId:          this.$route.params.course_id,

        //分页
        pageNum:1,
        pageSize:4,

        //课程详情
        courseDetailData:  null,// 课程的基本信息
        experimentList:    [],// 课程的实验列表
        questionnaireList: {rows:[],total:0},// 课程的问卷列表

        // 编辑课程基本信息
        editCourseDialog:  false,
        courseForm:{
          "name":           null,
          "description":    null, 
          "c_code":         null,
          "c_teacher":      null,
          "c_nature":       null,
        },

        // 开课
        beginCourseDialog:  false,
        beginForm:{
          "cYear":           null,
          "cStage":    null, 
        },
        semesterOptions: [
          {
            value: 1,
            label: '春季'
          }, {
            value: 2,
            label: '秋季'
          }, {
            value: 3,
            label: '夏季'
          }, {
            value: 4,
            label: '冬季'
          }
        ],

        // 添加实验
        courseOperaDialog: false,
        submitTestForm: {
          "name":           null,
          "description":    null, 
          "etype":          null,
          "course_id":      this.$route.params.course_id,
          "value":          0,
          "score":          100,
        },

        // 添加问卷
        questionTaskDialog:false,
        questionTaskForm: {
          questionnaire:{
            name:         null,
            description:  null,
            qItems:       [],
          }
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
        
      }
    },
    components: {
      upload,
      FileShow,
      QuestionnairePaper,
      TeachingAnalysis
    },
    mounted(){
      this.getQueryAnalysis();
      this.getQueryCourseDetail();
      this.getQueryExperimentList();
      this.getQueryQuestionnaireList();
    },
    methods: { 
      /*
        是否禁用 禁用按钮
       */
      isDisabaledDelBtn(){
        if(!this.common.checkAuthority('Lesson-Data-CourseDetail-Disabled',true) === false){//有权限
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
       * 前往该实验的详情
       */
      goToDetail(idA){
        if(this.common.checkAuthority('Lesson-Data-CourseDetail-QueryExperimentDetail', true)){
          this.$router.push({name: "LessonSystemExperimentDetail", params: {experiment_id: idA}});
        }else{
          this.$message('无权限,不能查看详情');
        }
      },
      /*
       * 前往该问卷的详情
       */
      goToDetail_(idA){
        if(this.common.checkAuthority('Lesson-Data-CourseDetail-QueryQuestionnaireDetail', true)){
          this.$router.push({name: "LessonSystemQuestionnaireDetail", params: {questionnaire_id: idA}});
        }else{
          this.$message('无权限,不能查看详情');
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
       * 课程详情-上传附件的回调
       */
      uploadSuccess(keyName, response){ 
        // 1为课程资料(courseData); 2 为课程大纲(syllabus)，
        let ao_type = keyName == 'courseData' ? 1 : 2; 
        let params = {
          name:               response.name,
          path:               response.path,
          associated_object:  this.$route.params.course_id,
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
       * 课程详情-删除指定Id的资料文件
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
        是否禁用开课按钮
       */
      isDisabaledBeginBtn(){
        if(!this.common.checkAuthority('Lesson-Data-CourseDetail-UploadStartClass',true) === false){//有权限
          if(this.courseDetailData.cur_status==2){
            return true;
          }else{
            return false;
          }
        }else{//无权限
          return true;
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
        if(type=="getQueryQuestionnaireList"){
          this.getQueryQuestionnaireList()
        }
      },
      pageCurrentChange(type,val) {
        this.pageNum = val
        if(type=="getQueryQuestionnaireList"){
          this.getQueryQuestionnaireList()
        }
      },
      
      
      /*
       * 查询课程详情-基本信息
       */
      getQueryCourseDetail(){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/baseCourse/${this.paramsCId}`,'').then((response) => {
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
        this.axios.get(`${this.common.basePath}/baseCourse/${this.paramsCId}`,'').then((response) => {
          this.courseForm= response.data.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);  
          this.dialogLoading = false;
        });
      },
      /*
       * 查询课程详情-该课程的实验列表
       */
      getQueryExperimentList(){
        this.loading = true;
        this.axios.post(`${this.common.basePath}/baseExperiment/item`,{courseID:this.paramsCId,ids:[]}).then((response) => {
          this.experimentList = response.data.data;
          this.loading = false;
        }).catch((error) => {
          this.$message.error(error); 
          this.loading = false; 
        });
      },
       /*
       * 查询课程详情-该课程的问卷列表
       */
      getQueryQuestionnaireList(){
        this.loading = true;
        this.axios.post(`${this.common.basePath}/base-questionnaire/list`,{courseId:this.paramsCId,pageNum:this.pageNum,pageSize:this.pageSize}).then((response) => {
          this.questionnaireList = response.data.data;
          this.loading = false;
        }).catch((error) => {
          this.$message.error(error); 
          this.loading = false; 
        });
      },
      /*
       * 查询课程详情-教学分析
       */
      getQueryAnalysis(){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/baseCourse/analysis`,{params:{courseID:this.paramsCId}}).then((response) => {
          this.teachingAnalysis = response.data.data;
          this.loading = false;
        }).catch((error) => {
          this.$message.error(error); 
          this.loading = false; 
        });
      },
      /*
       * 开课
       */
      submitBeginCourse(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = {
              "baseCourseID":this.paramsCId,
              "cStage": this.beginForm.cStage,
              "cYear": this.beginForm.cYear.getFullYear(),
            }
            this.axios.post(`${this.common.basePath}/baseCourse/build`,form).then((response) => {
              this.beginCourseDialog = false;
              this.$message.success('开课'+response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.beginCourseDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /*
       * 编辑课程的基本信息
       */
      submitCourse(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.patch(`${this.common.basePath}/baseCourse/${this.paramsCId}`,this.courseForm).then((response) => {
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
       * 禁用课程
       */
      disabledCourse(id){
        this.$confirm('  你在进行课程模板的操作！如果禁用以后将不能使用此模板创建课程！', '禁用', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.disabledCourse_(id);
        }).catch(() => {this.getQueryCourseDetail();});
      },
      disabledCourse_(id){ 
        this.axios.patch(`${this.common.basePath}/baseCourse/${id}`,{cur_status:2}).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getQueryCourseDetail();
        }).catch((error) => {
          this.getQueryCourseDetail();
          this.$message.error(error); 
        });
      }, 
      /*
       * 解禁课程
       */
      noDisabledCourse(id){
        this.$confirm('  你在进行课程模板的操作！是否解禁该课程！', '解禁', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.noDisabledCourse_(id);
        }).catch(() => {this.getQueryCourseDetail();});
      },
      noDisabledCourse_(id){ 
        this.axios.patch(`${this.common.basePath}/baseCourse/${id}`,{cur_status:1}).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getQueryCourseDetail();
        }).catch((error) => {
          this.getQueryCourseDetail();
          this.$message.error(error); 
        });
      }, 
      /*
       * 删除课程
       */
      deleteCourse(id){
        this.$confirm('  您正在进行对课程资料的删除操作，如果课程资料删除成功将会导致该课程的实验、任务、大纲等资料永久消失！ 请谨慎操作！', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCourse_(id);
        }).catch(() => {});
      },
      deleteCourse_(id){ 
        this.axios.patch(`${this.common.basePath}/baseCourse/delete/${id}`).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.$router.push({name: "LessonSystem"});
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      /*
       * 添加实验
       */
      submitTest(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/baseExperiment`,this.submitTestForm).then((response) => {
              this.getQueryExperimentList();
              this.courseOperaDialog = false;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.courseOperaDialog = false;
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
            let form = this.questionTaskForm.questionnaire
            form.courseId = this.$route.params.course_id;
            this.axios.post(`${this.common.basePath}/base-questionnaire`,form).then((response) => {
              this.getQueryQuestionnaireList();
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