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
        <div v-if="common.checkAuthority('Lesson-Data-ReportDetail-Query', true)">
          <!-- 基本信息 -->
          <el-card>
            <div slot="header">
              <span class="card-title">基本信息</span>
              <el-switch
                class="fr"
                 v-if="courseDetailData"
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
                <el-col :span="24">
                  <el-form-item label="要求："><p class="cursor-pointer_T">{{courseDetailData.description}}</p></el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="报告模板：">
                    <div> 
                      <upload 
                        :isDisabled="!common.checkAuthority('Lesson-Data-ReportDetail-Upload', true) "
                        :buttonText="!courseDetailData.task_files||courseDetailData.task_files===''?'点击上传':'重新上传'" 
                        @uploadSuccess="(response) => {uploadSuccess('report', response)}"></upload>
                    </div>
                    <div v-if="courseDetailData.task_files">  
                      <file-show :fileList="[JSON.parse(courseDetailData.task_files)]" :closable="common.checkAuthority('Lesson-Data-ReportDetail-Upload', true)" @handleClose="handleClose"></file-show>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <p class="text-right">
                    <el-button 
                      :disabled="!common.checkAuthority('Lesson-Data-ReportDetail-Edit', true) "
                      type="primary" @click="editCourseDialog = true;echo();">
                        编辑
                    </el-button>
                    <el-button 
                      :disabled="!common.checkAuthority('Lesson-Data-ReportDetail-Delete', true)"
                      type="danger" @click="deleteCourse(courseDetailData.id)">
                        删除
                    </el-button>
                  </p>
                </el-col>
              </el-row>
            </el-form>
          </el-card> 
          <!-- 教学分析 -->
          <el-card class="mart20">
            <div slot="header">
              <span class="card-title">教学分析</span>
            </div>
            <div>
              <div>报告任务被引用 {{teachingAnalysis.quote}} 次，共计学生 {{teachingAnalysis.members}} 人。</div>
              <teaching-analysis className="report" :data="teachingAnalysis.data"></teaching-analysis>
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
            <el-input v-model="courseForm.name"  class="w220"></el-input>
          </el-form-item> 
          <el-form-item 
            label="得分占比：" 
            prop="value"
            :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
            <el-slider v-model="courseForm.value" :format-tooltip="formatTooltip" class="w220"></el-slider>
          </el-form-item> 
          <el-form-item 
            label="满分：" 
            prop="score"
            :rules="[{ required: true, message: '请输入满分', trigger: 'blur' },]"> 
            <el-input-number type="number" :min="0" :max="100" :step="10" v-model="courseForm.score"></el-input-number>
          </el-form-item> 
          <el-form-item 
            label="类型：" 
            prop="genre"
            :rules="[{ required: true, message: '请选择类型', trigger: 'blur' },]">
            <el-radio-group v-model="courseForm.genre">
              <el-radio :label="1">小组报告</el-radio> 
              <el-radio :label="2">个人报告</el-radio>
            </el-radio-group>
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
  import upload from "../../../../../components/Upload.vue"
  import FileShow from "../../../../../components/FileShow.vue"
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

        // 编辑任务基本信息
        editCourseDialog:  false,
        courseForm:{
          name:           null,
          value:          0, //占比
          score:          null, 
          description:    null,
          genre:          null, //报告类型
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
      }
    },
    components: {
      upload,
      FileShow,
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
        if(!this.common.checkAuthority('Lesson-Data-ReportDetail-Disabled',true) === false){//有权限
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
       * 任务详情-上传附件的回调
       */
      uploadSuccess(keyName, response){ 
        if(keyName==='report'){
          this.axios.patch(`${this.common.basePath}/baseTask/${this.paramsTId}`,{task_files:JSON.stringify(response),id:this.courseDetailData.id}).then((response) => {
            this.getQueryCourseDetail();
            this.$message.success(response.data.meta.message);
          }).catch((error) => {
            this.$message.error(error);
          });  
        }
      },
      /**
       *  任务详情-点击删除附件
       * @param  {[type]} tag [description]
       * @return {[type]}     [description]
       */
      handleClose(tag) {
        this.$confirm("是否确认删除该附件？", "删除", {
          comfirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          this.axios.patch(`${this.common.basePath}/baseTask/${this.paramsTId}`,{task_files:'',id:this.courseDetailData.id}).then((response) => {
            this.getQueryCourseDetail();
            this.$message.success(response.data.meta.message);
          }).catch((error) => {
            this.$message.error(error);
          });  
        }).catch(err => {})
        
      },
      
      /*
       * 查询任务详情-基本信息
       */
      getQueryCourseDetail(){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/baseTask/${this.paramsTId}`,'').then((response) => {
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
        this.axios.get(`${this.common.basePath}/baseTask/${this.paramsTId}`,'').then((response) => {
          this.courseForm= response.data.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);  
          this.dialogLoading = false;
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
       * 查询任务详情-教学分析
       */
      getQueryAnalysis(){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/baseTask/analysis`,{params:{id:this.paramsTId,type:2}}).then((response) => {
          this.teachingAnalysis = response.data.data;
          this.loading = false;
        }).catch((error) => {
          this.$message.error(error); 
          this.loading = false; 
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