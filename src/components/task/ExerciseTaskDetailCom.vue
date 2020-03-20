/*********   习题任务详情 ********************/
<template> 
  <!-- 页面主要内容 -->
  <div v-if="taskDetail"> 
    <!-- 习题任务基本信息 -->
    <el-card> 
      <div slot="header">
        <span class="card-title">习题任务基本信息</span>
      </div>
      <el-row>
        <el-col :span="12" class="marb5">
          习题名称：{{taskDetail.name}}
          <!-- 1为未发布，2为已发布 -->
          <el-button 
            :disabled="!common.checkAuthority(`${$route.name}_Release`, true)"
            v-if="taskDetail.cur_status == 1" type="primary" size="mini" @click="releaseTask" >
            {{common.checkAuthority(`${$route.name}_Release`) ? common.checkAuthority(`${$route.name}_Release`).name : ''}}
          </el-button>
        </el-col>
        <el-col :span="12" class="marb5">通过分数：{{taskDetail.adopt_score}}</el-col>
        <el-col :span="12" class="marb5">得分占比：{{taskDetail.value}}</el-col>
        <el-col :span="12" class="marb5">
          截止时间：{{common._convertDate(taskDetail.end_time, 'yyyy年MM月dd日')}} 
          <el-button 
            :disabled="!common.checkAuthority(`${$route.name}_Delay`, true)"
            type="primary" size="mini" 
            @click=" delayDialog = true; $refs.delayForm ? $refs.delayForm.resetFields() : '' ">
            {{common.checkAuthority(`${$route.name}_Delay`) ? common.checkAuthority(`${$route.name}_Delay`).name : ''}}
          </el-button>
        </el-col>
        <el-col :span="24" class="text-right">
          <!-- 将任务设置为模板， 必须之前不是模板任务才能修改， 并且实验模板不为null，也就是当前任务属于的实验必须是模板创建的 -->
          <el-button 
            v-if="!taskDetail.template && taskDetail.experimentTemplate"
            :disabled="!common.checkAuthority(`${$route.name}_Base`, true)"
            type="primary" @click=" upGradeBase ">
            {{common.checkAuthority(`${$route.name}_Base`) ? common.checkAuthority(`${$route.name}_Base`).name : ''}}
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 试卷基本信息 -->
    <el-card class="mart20" v-if="paperDetail"> 
      <div slot="header">
        <span class="card-title">试卷基本信息</span>
      </div>
      <el-row>
        <el-col :span="12" class="marb5">试卷名称：{{paperDetail.name}}</el-col>
        <el-col :span="12" class="marb5">总分：{{paperDetail.score}}分</el-col>
        <el-col :span="24" class="marb5">答题要求：{{paperDetail.description}}</el-col>
        <el-col :span="12" class="mart5">
          共（{{paperDetail.question_count}}）题
          <!-- 答题 -->
          <!--  存在学生角色，并且学生没有答过题的情况下  -->
          <el-button 
            :disabled="!common.checkAuthority(`${$route.name}_GoToAnswer`, true)"
            v-show="isExistStudent && !paperDetail.solution_id" type="primary" size="mini" class="marl10" 
            @click="paperDialog = true">
            {{common.checkAuthority(`${$route.name}_GoToAnswer`) ? common.checkAuthority(`${$route.name}_GoToAnswer`).name : ''}}
          </el-button>
          <!-- 查看详情任务跟卷子详情(不是学生的情况下) -->
          <el-button 
            v-if="!isExistStudent"
            :disabled="!common.checkAuthority(`${$route.name}_CheckQuestionDetail`, true)"
            type="primary" size="mini" @click="goToQuestionPage">
            {{common.checkAuthority(`${$route.name}_CheckQuestionDetail`) ? common.checkAuthority(`${$route.name}_CheckQuestionDetail`).name : ''}}
          </el-button>
          <!-- 查看卷子详情(是学生的情况，并且已经答过题的) -->
          <el-button 
            v-if="isExistStudent && paperDetail.solution_id"
            :disabled="!common.checkAuthority(`${$route.name}_CheckQuestionDetail`, true)"
            type="primary" size="mini" 
            @click="$router.push({name: 'ExerciseQuestionDetail', params: {experiment_id: taskDetail.experiment_id, task_id: $route.params.task_id, solution_id: paperDetail.solution_id, type:'student'}})">
              {{common.checkAuthority(`${$route.name}_CheckQuestionDetail`) ? common.checkAuthority(`${$route.name}_CheckQuestionDetail`).name : ''}}
          </el-button> 
        </el-col>
      </el-row>
    </el-card>
    <!-- 只要不是学生，其他的都能查看 -->
    <div v-if="isExistOther">
      <!-- 答题情况 -->
      <el-card class="mart20" > 
        <div slot="header">
          <span class="card-title">答题情况</span>
        </div>
        <el-tabs v-model="questionActiveName" class="member-box">
          <el-tab-pane label="未交" name="1"> 
            <div v-if="answerMemberListData.length" class="person-group-item_w" v-for="(item,index) in answerMemberListData">
              <el-dropdown :hide-on-click="false" placement="bottom-start">
                  <div class="img-photo-fix wh50">
                    <img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" width="50px" height="50px" />
                  </div>  
                  <!-- <p class="person-name" style="text-align: left;margin-left: 18px;">{{item.user_name}}</p>  -->
                  <el-dropdown-menu slot="dropdown" > 
                    <div class="mar20">
                      <p><img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" width="40px" height="40px" /></p>
                      <p>姓名：{{item.user_name ? item.user_name : '无'}}</p>
                      <p>工/学号：{{item.account ? item.account : '无'}}</p>
                      <p>手机：{{item.phone_num ? item.phone_num : '无'}}</p>
                      <p>院系：{{item.facultyName ? item.facultyName : '无'}}</p>
                      <p>邮箱：{{item.mail ? item.mail : '无'}}</p>
                    </div>
                  </el-dropdown-menu>
                </el-dropdown> 
            </div>
            <div v-if="!answerMemberListData.length" class="mar10">暂无数据</div>   
          </el-tab-pane>
          <el-tab-pane label="已提交" name="2">
            <div v-if="answerMemberListData.length"> 
              <el-row class="mart20" :gutter="20">
                <el-col class="answer-member-box" :span="6" v-for="(item,index) in answerMemberListData" :key="index">
                  <el-card>
                    <p>姓名：{{item.user_name}}</p>
                    <p>答题时间：{{item.answer_time}}分钟</p>
                    <p>{{item.score}}分 
                      <el-button 
                        @click="$router.push({name: 'ExerciseQuestionDetail', params: {experiment_id: taskDetail.experiment_id, task_id: $route.params.task_id, solution_id: item.solution_id, type: 'student'}})" 
                        class="marl10" type="primary" size="mini">查看卷子详情</el-button>
                      <!-- 状态为3表示已打分 ，才能修改分数 -->
                      <el-button v-show="item.cur_status == 3" @click="$router.push({name: 'MarkingScore', params: {experiment_id: $route.params.experiment_id, task_id: $route.params.task_id, solution_id: item.solution_id}})" class="marl10" type="primary" size="mini">修改评分</el-button>
                    </p>
                  </el-card>
                </el-col>
              </el-row>
            </div> 
            <div v-else class="mar10">暂无数据</div>  
          </el-tab-pane>
          <el-tab-pane label="未打分" name="3">
            <div v-if="answerMemberListData.length">
              <el-row>
                <!-- 下载打分表格 -->
                <el-button 
                  class="fl marr10"
                  size="mini"
                  type="primary"
                  :disabled="!common.checkAuthority(`${$route.name}_ExportSheet`, true)" 
                  @click=" exportSheet ">
                  {{common.checkAuthority(`${$route.name}_ExportSheet`) ? common.checkAuthority(`${$route.name}_ExportSheet`).name : ''}}
                </el-button>

                <!-- 上传打分表格 -->
                <upload 
                  class="fl marr10"
                  :url="`/answer/import/score/${$route.params.task_id}`"
                  :isDisabled="!common.checkAuthority(`${$route.name}_ImportSheet`, true)"
                  :fileTypes="['xls','xlsx']"
                  :buttonText="common.checkAuthority(`${$route.name}_ImportSheet`) ? common.checkAuthority(`${$route.name}_ImportSheet`).name : ''" 
                  @uploadSuccess="importSheet"></upload>
                <!-- 批量打分 -->
                <el-button 
                  class="fl marr10"
                  size="mini"
                  type="primary"
                  :disabled="!common.checkAuthority(`${$route.name}_BatchScore`, true)" 
                  @click=" batchScore ">
                  {{common.checkAuthority(`${$route.name}_BatchScore`) ? common.checkAuthority(`${$route.name}_BatchScore`).name : ''}}
                </el-button>
              </el-row> 
              <el-row  class="mart20" :gutter="20">
                <el-col class="answer-member-box" :span="6" v-for="(item,index) in answerMemberListData" :key="index">
                  <el-card>
                    <p><el-checkbox @change="changeCheckbox($event, item)">姓名：{{item.user_name}}</el-checkbox></p>
                    <p>答题时间：{{item.answer_time}}分钟</p>
                    <p>{{item.score}}分 
                      <el-button @click="$router.push({name: 'MarkingScore', params: {experiment_id: $route.params.experiment_id, task_id: $route.params.task_id, solution_id: item.solution_id}})" class="marl10" type="primary" size="mini">评分</el-button>
                    </p>
                  </el-card>
                </el-col>
              </el-row>
            </div> 
            <div v-else class="mar10">暂无数据</div>
          </el-tab-pane>
          <el-tab-pane label="答题结果" name="4">
            <el-card v-if="answerResult ? answerResult.length : false" shadow="never">
              <div 
                class="questions-box mart5" 
                v-for="(item, index) in answerResult" 
                :key="index">
                <div>{{index + 1}}、</div>
                <el-card class="questions-content" shadow="never"> 
                  <el-row class="mard10"> 
                    <el-col class="div-flex" :span="18">
                      <div class="label-2 label marr5">题干:{{item.question}}</div>  
                    </el-col> 
                    <el-col :span="18">
                      <div 
                        v-for="(itemOption, indexOption) in item.optionList" 
                        :key="indexOption" 
                        class="div-flex mart10 flex-align-items">
                        <div class="label-2 label marr5">
                          <!-- 单选 -->
                          <el-radio 
                            disabled
                            v-show="item.type == 1 || item.type == 3" 
                            class="marl5"   
                            label="true">选项{{indexOption + 1}}：{{itemOption.name}}</el-radio>
                          <!-- 多选 -->
                          <el-checkbox 
                            disabled
                            v-show="item.type == 2" 
                            class="marl5"   
                            true-label="true" 
                            false-label="false">选项{{indexOption + 1}}：{{itemOption.name}}</el-checkbox>    
                      </div>  
                      </div> 
                    </el-col>
                    <el-col :span="6">
                      <div ref="myChart" :id="`myChart${index}`" :style="{width: '300px', height: '200px'}"></div>
                    </el-col>  
                  </el-row> 
                </el-card>
              </div> 
            </el-card>
            <div v-else class="mar10">暂无数据</div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 答题 -->
    <el-dialog 
      width="70vw"
      title="开始答题" 
      :closeOnClickModal="false"
      :showClose="isPaperDialogShowClose"
      :visible.sync="paperDialog">
        <exercises-respondence @isPaperDialogShowClose="isPaperDialogShowCloseFun" @closePaperDialog="closePaperDialogFun" v-if="paperDetail" :paperId="paperDetail.id" :taskId="$route.params.task_id"></exercises-respondence>
        <div slot="footer" class="dialog-footer">
          <el-button @click="paperDialog = false">取 消</el-button> 
        </div>
    </el-dialog>
    <!-- 延期 -->
    <el-dialog 
      width="500px"
      title="延期" 
      :closeOnClickModal="false" 
      :visible.sync="delayDialog">
        <div v-if="taskDetail">
          <el-form ref="delayForm" :model="delayForm" label-width="80px">
            <el-form-item
              prop="end_time"
              label="时间"
              :rules="[{ required: true, message: '请选择日期', trigger: 'blur' }]"
              >
                <el-date-picker
                  v-model="delayForm.end_time"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitDelayTask('delayForm')">提交</el-button> 
          <el-button @click="delayDialog = false">取 消</el-button> 
        </div>
    </el-dialog>
  </div>
</template>
<script>  
  import upload from "../../components/Upload.vue"
  // 答题
  import exercisesRespondence from '../../views/lessonManage/exercise/ExercisesRespondence.vue';
  export default { 
    data () {
      return {
        isExistStudent:       false, //true为登录账号有学生角色
        isExistOther:         false, //true有其他角色
        paperDialog:          false,
        delayDialog:          false,
        ids:                  [],
        taskDetail:           null,
        paperDetail:          null,
        isLoad:               true,
        questionActiveName:   '1',
        answerMemberListData: [],
        loginUserId:          sessionStorage.getItem('access_key'),
        isPaperDialogShowClose: true,
        delayForm: {
          end_time: null,
        },
        answerResult:         null,
      }
    },
    components:{  
      'exercises-respondence': exercisesRespondence,
      'upload':                upload,
    },
    computed:{
    },
    watch:{
      questionActiveName(val){
        if(val != 4){
          this.getQueryAnswerMember(val);
        }else{
          this.$nextTick( () => {
            this.answerResult.forEach( (item, index) => {
              // -------- 组装选项数据 ----------
              let optionData = [];
              item.optionList.forEach( (itemOption) => {
                optionData.push({value: itemOption.total, name: itemOption.name})
              });
              this.pieChart(`myChart${index}`, optionData);
            })
          });
        }
      }
    },
    mounted(){   
      this.getQueryTaskDetail(); 
      this.getQueryAnswerMember(this.questionActiveName);
      this.loginAccountIsRole();
    },
    methods: {
      /**
       * 将当前实验升级为模板,必须课程也是创建的模板，才能升级实验
       * @return {[type]} [description]
       */
      upGradeBase(){
        this.axios.get(`${this.common.basePath}/baseTask/upgrade`, {params: { taskID: this.$route.params.task_id} }).then((response) => {
          this.$message.success(response.data.meta.message);
          this.getQueryTaskDetail();
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
                'this.src="' + require('../../assets/img/male.png') + '"' : 
                'this.src="' + require('../../assets/img/female.png') + '"';
      },  
      /*
       * 查询任务基本信息
       */
      getQueryTaskDetail(){
        this.axios.get(`${this.common.basePath}/task/${this.$route.params.task_id}`,'').then((response) => { 
          this.taskDetail = response.data.data;
          this.isLoad = false;
          this.getQueryPaperDetail(response.data.data.associated_object);
          this.getQueryAnswerResult(response.data.data.associated_object)
        }).catch((error) => {
          this.$message.error(error);
          this.isLoad = false;  
        });
      },
      /*
       * 查询试卷基本信息
       */
      getQueryPaperDetail(associated_object){
        this.axios.get(`${this.common.basePath}/paper/simple/${associated_object}?taskId=${this.$route.params.task_id}`,'').then((response) => { 
          this.paperDetail = response.data.data; 
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 查询答题结果
       */
      getQueryAnswerResult(associated_object){
        this.axios.get(`${this.common.basePath}/question/total`, {params: {paperId: associated_object, taskId: this.$route.params.task_id}}).then((response) => {  
          this.answerResult = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 跳转卷子详情页
       */
      goToQuestionPage(){ 
        this.$router.push({name: 'TestPaper', params: {experiment_id: this.taskDetail.experiment_id, task_id:this.$route.params.task_id ,associated_object: this.taskDetail.associated_object}});
       },
      /*
       * 关闭考卷弹框
       */
      closePaperDialogFun(){
        this.paperDialog = false;
        this.getQueryPaperDetail(this.taskDetail.associated_object);
       },
      /*
       * 显示或者隐藏弹框
       */
      isPaperDialogShowCloseFun(val){ 
        this.isPaperDialogShowClose = val; 
       },
      /*
       * 答题学员答题情况
       */
      getQueryAnswerMember(typeA){
        this.answerMemberListData = [];
        this.axios.get(`${this.common.basePath}/answer/member/${this.$route.params.task_id}`,{params: {type: typeA}}).then((response) => { 
          this.answerMemberListData = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      }, 
      /*
       * 发布任务
       */
      releaseTask(){
        this.axios.get(`${this.common.basePath}/task/release/${this.$route.params.task_id}`, '').then((response) => { 
          this.$message.success(response.data.meta.message);
          this.getQueryTaskDetail();
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 延期任务
       */
      submitDelayTask(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.patch(`${this.common.basePath}/task/${this.$route.params.task_id}`, this.delayForm).then((response) => { 
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
       * 每个题中选项投票的饼图
       * @params {string} idName 元素Id名
       * @params {object} optionData 选项数组
       */
      pieChart(idName, optionData){   
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.echarts.init(document.getElementById(idName))
        let option = {
          title : { 
              subtext: '纯属虚构',
              x:'center',
              show:false,
          },
          tooltip : {
              trigger: 'item',
              formatter: " 标题：{b}<br/> 选中数：{c}个 <br/> 占比：{d}%", 
          },
          legend: {
              orient: 'vertical',
              left: 'right', 
              show:false,
          },
          series : [
            {
                name: '详情：',
                type: 'pie',
                radius : '75%',
                center: ['40%', '45%'],
                data: optionData, 
                label: {
                  normal: {
                      show: false, // false为隐藏每个模块支出来标题,默认为true
                      position: 'inner'
                  },
                  emphasis: {
                      show: false, //为true时：浮动在模块上是显示标题
                      textStyle: {
                          fontSize: '12',
                          fontWeight: 'bold'
                      }
                  }
              }, 
            }
          ]
        };
        // 绘制图表
        myChart.setOption(option);
      },
      /*
       * 下载表格
       */
      exportSheet(){ 
        this.axios.get(`${this.common.basePath}/answer/export/score/${this.$route.params.task_id}`, {responseType: "blob"}).then((response) => {  
          this.common._fileBold(response);
          this.$message.success('下载成功'); 
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 上传表格（上传附件的回调）
       */
      importSheet(response){
        this.$message.success('上传成功');
        this.getQueryAnswerMember(this.questionActiveName);
      }, 
      /*
       * 获取当前账号有没有自己想要的角色Id
       * @params {string} roleId 角色Id
       */
      loginAccountIsRole(){
        this.axios.get(`${this.common.basePath}/participant/type`,{params: {experiment_id: this.$route.params.experiment_id}}).then((response) => { 
          if(response.data.data){ 
            response.data.data.forEach((item) => {
              // 1, "课程组长"  2, "任课教师" 3, "学生", 4, "助教"
              if(item == '3'){
                this.isExistStudent = true;
              }else{
                this.isExistOther = true;
              }
            });
          }
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
      /*
       * 选中数据
       */
      changeCheckbox(val,item){ 
        if(val) 
          this.ids.push(item.solution_id);
        else 
          this._deleteIds(item); 
      },
      _deleteIds(item){
        this.ids.forEach((id, index) => {
          if(id == item.solution_id){
            this.ids.splice(index, 1)
          }
        })
        
      },
      /*
       * 批量打分
       */
      batchScore(){
        if(!this.ids.length) { this.$message('你还没有勾选数据'); return false;}
        this.axios.post(`${this.common.basePath}/answer/batch/score/end`, this.ids).then((response) => {  
          this.getQueryAnswerMember(this.questionActiveName);
          this.$message.success(response.data.meta.message); 
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      
    }
  }
</script>
<style lang="less">
  .member-box .person-group-item_w{ 
    display: inline-block;
  }
</style>