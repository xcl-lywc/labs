<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/system/' }">课程资源</el-breadcrumb-item>
        <el-breadcrumb-item v-if="paramsCId" :to="{ path: `/lesson/system/coursedetail/${paramsCId}` }">课程详情</el-breadcrumb-item>
        <el-breadcrumb-item>问卷详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg" v-loading="loading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div v-if="common.checkAuthority('Lesson-Data-QuestionnaireDetail-Query', true)">
          <!-- 基本信息 -->
          <el-card>
            <div slot="header">
              <span class="card-title">问卷信息</span>
              <el-switch
                v-if="courseDetailData"
                class="fr"
                :title="courseDetailData.cur_status===1?'禁用':'启用'"
                @change="courseDetailData.cur_status===1?disabledTask(courseDetailData.baseCQuestionnaireId):noDisabledTask(courseDetailData.baseCQuestionnaireId)"
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
                    <el-tag type="success">课程问卷调查</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="要求："><p class="cursor-pointer_T">{{courseDetailData.description}}</p></el-form-item>
                </el-col>
                <el-col :span="24">
                  <p class="text-right">
                    <el-button 
                      :disabled="isUseTemplete()"
                      type="primary" @click="questionTaskDialog = true;echo();">
                        编辑
                    </el-button>
                    <el-button 
                      :disabled="!common.checkAuthority('Lesson-Data-QuestionnaireDetail-Delete', true)"
                      type="danger" @click="deleteCourse(courseDetailData.baseCQuestionnaireId)">
                        删除
                    </el-button>
                  </p>
                </el-col>
              </el-row>
            </el-form>
            <!-- 问卷内容 -->
            <el-card class="mart20">
              <div slot="header" class="overflow-hidden">
                <span class="card-title fl">问卷内容</span>
                <el-button 
                  class="fr"
                  v-if="questionnaire.total>0"
                  size="small"
                  :disabled="isDisabaledNexBtn()"
                  type="primary" @click="exercisesIndex+=1;">
                    下一题
                </el-button>
                <div class="fr marr10 marl10 mart8 text-bold" v-if="questionnaire.total>0">{{questionnaire.total>0?exercisesIndex:'0'}}/{{questionnaire.total}}</div>
                <el-button 
                  class="fr"
                  v-if="questionnaire.total>0"
                  size="small"
                  :disabled="isDisabaledPreBtn()"
                  type="primary"  @click="exercisesIndex-=1;">
                    上一题
                </el-button>
              </div>
              <div v-if="questionnaire.total>0">
                <div v-for="(item,index) in questionnaire.rows" v-if="index+1===exercisesIndex">
                  <el-form label-width="100px" class="show-detail-form">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item :label="'第 '+(index+1<10?'0'+(index+1):(index+1))+' 题：'">
                          {{item.question}}<span v-if="item.type===4"> （{{item.score?item.score:'0'}}分）</span>&nbsp;&nbsp;&nbsp;
                          <el-tag type="success" v-if="item.type===1">单选题</el-tag>
                          <el-tag type="primary" v-if="item.type===2">多选题</el-tag>
                          <el-tag type="danger" v-if="item.type===3">判断题</el-tag>
                          <el-tag type="warning" v-if="item.type===4">评语</el-tag>
                          <div v-if="item.type===1||item.type===2">
                            <el-form label-width="15px" class="show-detail-form_s" v-if="item.options&&item.options.length>0">
                              <div v-for="(itemO,indexO) in item.options">
                                <el-form-item :label="common.exerciseOptions(indexO+1)+'.'">{{itemO.answer}}（{{itemO.score?itemO.score:'0'}}分）</el-form-item>
                              </div>
                            </el-form>
                            <div class="no-data" v-else>暂无选项</div>
                          </div>
                        </el-form-item>
                      </el-col>
                      <!-- <el-col :span="24">
                        <el-form-item label="选项统计：">
                          <options-analysis className="question" :data="optionsAnalysis" v-if="optionsAnalysis.length>0"></options-analysis>
                          <div v-else style="color: #909399;font-weight: 400;font-size: 14px;">暂无数据</div>
                        </el-form-item>
                      </el-col> -->
                    </el-row>
                  </el-form>
                </div>
              </div>
              <div class="no-data" v-else>暂无数据</div>
            </el-card> 
          </el-card> 
            
          <!-- 教学分析 -->
          <!-- <el-card class="mart20">
            <div slot="header">
              <span class="card-title">教学分析</span>
            </div>
            <div>
              <div>问卷任务被引用 {{teachingAnalysis.quote}} 次，共计学生 {{teachingAnalysis.members}} 人。</div>
              <teaching-analysis className="question" :data="teachingAnalysis.data"></teaching-analysis>
            </div>
          </el-card> -->
        </div> 
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
    </div>
    <!-- 编辑课程问卷 -->
    <el-dialog 
      width="900px"
      title="编辑问卷" 
      :visible.sync="questionTaskDialog">
        <el-form ref="questionTaskForm" :model="questionTaskForm" label-width="120px" v-loading="dialogLoading">
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
  import TeachingAnalysis from "../../EducationEcharts/TeachingAnalysis.vue"
  import OptionsAnalysis from "../../EducationEcharts/OptionsAnalysis.vue"
  import QuestionnairePaper from '../../../../components/Questionnaire.vue'
  export default {
    data () {
      return { 
        loading:false,
        dialogLoading:false,
        paramsCId:          this.$route.params.course_id,
        paramsQId:          this.$route.params.questionnaire_id,
        
        //问卷详情
        courseDetailData:  null,// 问卷的基本信息 
        questionnaire:     {rows:[],total:0},// 问卷列表
        exercisesIndex:    1,// 第几题

        // 编辑问卷
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
      OptionsAnalysis,
      QuestionnairePaper
    },
    mounted(){
      this.getQueryCourseDetail(true);
      // this.getQueryAnalysis();
    },
    methods: {
      /*
       * 是否禁用编辑按钮
       */
      isUseTemplete(){
        if(!this.common.checkAuthority('Lesson-Data-QuestionnaireDetail-Edit',true) === false){//有权限
          this.axios.get(`${this.common.basePath}/base-questionnaire/used`,{params: {id:this.paramsQId}}).then((response) => { 
            if(response.data.data===true){
              return false;
            }else{
              return true;
            }
          }).catch((error) => {
            return true;
            this.$message.error(error); 
          }); 
        }else{//无权限
          return true;
        }
      },
      /*
        是否禁用 禁用按钮
       */
      isDisabaledDelBtn(){
        if(!this.common.checkAuthority('Lesson-Data-QuestionnaireDetail-Disabled',true) === false){//有权限
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
        if(!this.common.checkAuthority('Lesson-Data-QuestionnaireDetail-PreNext',true) === false){//有权限
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
        if(!this.common.checkAuthority('Lesson-Data-QuestionnaireDetail-PreNext',true) === false){//有权限
          if(this.exercisesIndex>this.questionnaire.total-1){
            return true;
          }else{
            return false;
          }
        }else{//无权限
          return true;
        }
      },
      
      /**
       * 查询问卷详情-基本信息
       * @author chuanlin.Xiao
       * @date   2019-11-29T09:53:00+0800
       * @param  {Boolean}                isRefresh 是否刷新问卷内容
       * @return {[type]}                           [description]
       */
      getQueryCourseDetail(isRefresh){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/base-questionnaire/detail`,{params:{baseCQuestionnaireId:this.paramsQId}}).then((response) => {
          this.courseDetailData = response.data.data;
          (response.data.data&&isRefresh)?this.getQueryQuestionnaire(response.data.data.id):this.loading = false;;
        }).catch((error) => {
          this.$message.error(error);  
          this.loading = false;
        });
      },
      /*
       * 查询问卷详情-问卷
       */
      getQueryQuestionnaire(questionnaire_id){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/qitem`,{params: {questionnaire_id: questionnaire_id}}).then((response) => {  
          this.questionnaire = response.data.data;
          // response.data.data.rows&&response.data.data.total>0 ? this.getQueryOPAnalysis(id,response.data.data.rows[0].id,response.data.data.rows[0].type) : this.loading = false;
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
        this.axios.get(`${this.common.basePath}/base-questionnaire/detail`,{params:{baseCQuestionnaireId:this.paramsQId}}).then((response) => {
          this.questionTaskForm.questionnaire = response.data.data;
          this.axios.get(`${this.common.basePath}/qitem`,{params: {questionnaire_id: response.data.data.id}}).then((response_) => {  
            this.questionTaskForm.questionnaire.qItems = response_.data.data?response_.data.data.rows:[];
            this.dialogLoading = false;
          }).catch((error) => {
            this.$message.error(error); 
            this.dialogLoading = false;
          });
        }).catch((error) => {
          this.$message.error(error);  
          this.dialogLoading = false;
        });
      },
      /*
       * 查询问卷详情-选项分析
       */
      getQueryOPAnalysis(questionnaireId,itemId,type){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/questionnaire/answerTotal`,{params:{questionnaireId:questionnaireId,itemId:itemId}}).then((response) => {
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
       * 查询问卷详情-教学分析
       */
      getQueryAnalysis(){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/baseTask/analysis`,{params:{id:this.paramsQId,type:1}}).then((response) => {
          this.teachingAnalysis = response.data.data;
          this.loading = false;
        }).catch((error) => {
          this.$message.error(error); 
          this.loading = false; 
        });
      },
      /*
       * 编辑问卷
       */
      submitQuestion(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = {
              name:         this.questionTaskForm.questionnaire.name,
              description:  this.questionTaskForm.questionnaire.description,
              qItems:       this.questionTaskForm.questionnaire.qItems,
              baseCQuestionnaireId:           this.courseDetailData.baseCQuestionnaireId,
            }
            this.axios.post(`${this.common.basePath}/base-questionnaire/update`,form).then((response) => {
              this.getQueryCourseDetail(true);
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
      /*
       * 禁用问卷
       */
      disabledTask(id){
        this.$confirm('  你在进行课程问卷模板的操作！如果禁用以后将不能使用此模板创建任务！', '禁用', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.disabledTask_(id);
        }).catch(() => {});
      },
      disabledTask_(id){ 
        this.axios.get(`${this.common.basePath}/base-questionnaire/begin-end`,{params:{id:id}}).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getQueryCourseDetail(false);
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      /*
       * 解禁问卷
       */
      noDisabledTask(id){
        this.$confirm('  你在进行课程问卷模板的操作！是否解禁该任务！', '解禁', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.noDisabledTask_(id);
        }).catch(() => {});
      },
      noDisabledTask_(id){ 
        this.axios.get(`${this.common.basePath}/base-questionnaire/begin-end`,{params:{id:id}}).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getQueryCourseDetail(false);
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      /*
       * 删除问卷
       */
      deleteCourse(id){
        this.$confirm('  您正在对课程的问卷资料进行删除操作，如果问卷资料删除成功将会导致该问卷等资料永久消失！ 请谨慎操作！', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCourse_(id);
        }).catch(() => {});
      },
      deleteCourse_(id){ 
        this.axios.get(`${this.common.basePath}/base-questionnaire/delete`,{params:{id:id}}).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.$router.push({name: "LessonSystemCourseDetail"});
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      
      
    },
  }
</script>
<style lang="less">
  
</style>