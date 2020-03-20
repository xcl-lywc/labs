/*********   报告任务详情 ********************/
<template>  
  <div v-if="taskDetail"> 
    <!-- 任务基本信息 -->
    <el-card> 
      <div slot="header">
        <span class="card-title">任务基本信息</span>
      </div>
      <el-row>
        <el-col :span="12" class="marb5">
          任务名称：{{taskDetail.name}}
          <!-- 1为未发布，2为已发布 -->
          <el-button 
            :disabled="!common.checkAuthority(`${$route.name}_Release`, true)"
            v-if="taskDetail.cur_status == 1" type="primary" size="mini" @click="releaseTask" >
            {{common.checkAuthority(`${$route.name}_Release`) ? common.checkAuthority(`${$route.name}_Release`).name : ''}}
          </el-button>
        </el-col>
        <el-col :span="12" class="marb5">
          截止时间：{{common._convertDate(taskDetail.end_time, 'yyyy年MM月dd日')}} 
          <el-button 
            :disabled="!common.checkAuthority(`${$route.name}_Delay`, true)"
            type="primary" size="mini" 
            @click=" delayDialog = true; $refs.delayForm ? $refs.delayForm.resetFields() : '' ">
            {{common.checkAuthority(`${$route.name}_Delay`) ? common.checkAuthority(`${$route.name}_Delay`).name : ''}}
          </el-button>
        </el-col> 
        <el-col :span="24" class="marb5">
          得分占比：{{taskDetail.value}}%&nbsp;&nbsp;&nbsp;&nbsp;
          报告状态：<span :style="{color: reportStatus().color}">{{reportStatus().name}}</span>
        </el-col>
        <el-col :span="24" class="marb5">
          报告类型：{{taskDetail.genre == 2 ? '个人报告' : '小组报告'}} 
        </el-col>
        <el-col :span="24" class="marb5">
          报告要求：{{taskDetail.description}}  
        </el-col>
        <el-col :span="24" class="marb5">
          附件列表：
          <el-tag v-if="taskDetail.task_files" class="marr10 mart10">
            <a :href="`${common.publicBasePath}${JSON.parse(taskDetail.task_files).path}`" target="_blank">
              {{JSON.parse(taskDetail.task_files).name}}
            </a> 
          </el-tag> 
          <span v-else>无</span>
          <!-- 状态为1 未发布的时候，才能编辑，上传附件 -->
          <upload 
            style="display: inline-block;"
            v-if="taskDetail.cur_status == 1"
            :disabled="!common.checkAuthority(`${$route.name}_EditFile`, true)"
            :buttonText="taskDetail.task_files ? '另传一个附件' : '上传附件'"
            @uploadSuccess=" uploadReportSuccess "></upload>
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
    <!-- 不是学生的其他的都能查看 -->
    <div>
      <!-- 完成任务 -->
      <el-card class="mart20"> 
        <div slot="header">
          <span class="card-title">完成任务</span>
        </div>
        <el-tabs v-model="questionActiveName">
          <el-tab-pane label="未交" name="1"> 
            <div v-if="answerMemberListData.length" class="person-group-item_w" v-for="(item,index) in answerMemberListData">
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
            <div v-if="!answerMemberListData.length" class="mar10">暂无数据</div>   
          </el-tab-pane>
          <el-tab-pane label="已提交" name="2">
            <div v-if="answerMemberListData.length"> 
              <el-row :gutter="20">
                <el-col class="answer-member-box" :span="6" v-for="(item,index) in answerMemberListData" :key="index">
                  <el-card>
                    <p>{{item.name}} </p>
                    <p>
                      <el-tag v-if="item.path" class="marr10">
                        <a :href="`${common.publicBasePath}${JSON.parse(item.path).path}`" target="_blank">
                          {{JSON.parse(item.path).name}}
                        </a> 
                      </el-tag> 
                    </p>
                    <p>{{item.user_name}} 于 {{common._convertDate(item.create_time, 'yyyy年MM月dd日')}} 上传</p>
                    <p>得分：{{item.score ? item.score : 0 }}分   
                      <el-button 
                        v-show="item.score"
                        :disabled="!common.checkAuthority(`${$route.name}_EditScore`, true)"
                        @click=" showScoreDialog(item) " class="marl10" type="primary" size="mini">
                        {{common.checkAuthority(`${$route.name}_EditScore`) ? common.checkAuthority(`${$route.name}_EditScore`).name : ''}}
                      </el-button>
                    </p>
                  </el-card>
                </el-col>
                <el-col :span="24" class="mart20">
                  <el-button 
                    :disabled="!common.checkAuthority(`${$route.name}_DownloadReport`, true)"
                    @click=" downLoadReeport " class="marl10" type="primary" size="mini">
                    {{common.checkAuthority(`${$route.name}_DownloadReport`) ? common.checkAuthority(`${$route.name}_DownloadReport`).name : ''}}
                  </el-button>
                </el-col>
              </el-row>
            </div> 
            <div v-else class="mar10">暂无数据</div>  
          </el-tab-pane>
          <el-tab-pane label="未打分" name="3">
            <div v-if="answerMemberListData.length"> 
              <el-row :gutter="20">
                <el-col class="answer-member-box" :span="6" v-for="(item,index) in answerMemberListData" :key="index">
                  <el-card>
                    <p>{{item.name}} </p>
                    <p>
                      <el-tag v-if="item.path" class="marr10">
                        <a :href="`${common.publicBasePath}${JSON.parse(item.path).path}`" target="_blank">
                          {{JSON.parse(item.path).name}}
                        </a> 
                      </el-tag> 
                    </p>
                    <p>{{item.user_name}} 于 {{common._convertDate(item.create_time, 'yyyy年MM月dd日')}} 上传</p>
                    <p>得分：{{item.score ? item.score : 0 }}分   
                      <el-button 
                        :disabled="!common.checkAuthority(`${$route.name}_Score`, true)"
                        @click=" showScoreDialog(item) " class="marl10" type="primary" size="mini">
                        {{common.checkAuthority(`${$route.name}_Score`) ? common.checkAuthority(`${$route.name}_Score`).name : ''}}
                      </el-button>
                    </p>
                  </el-card>
                </el-col>
                <el-col :span="24" class="mart20">
                  <!-- <el-button 
                    :disabled="!common.checkAuthority(`${$route.name}_ImportScore`, true)"
                    @click=" importScore " class="marl10" type="primary" size="mini">
                    {{common.checkAuthority(`${$route.name}_ImportScore`) ? common.checkAuthority(`${$route.name}_ImportScore`).name : ''}}
                  </el-button> --> 
                  <upload 
                    :url="`/report/upload?taskID=${$route.params.id}`"
                    :disabled="!common.checkAuthority(`${$route.name}_ImportScore`, true)"
                    :buttonText="common.checkAuthority(`${$route.name}_ImportScore`) ? common.checkAuthority(`${$route.name}_ImportScore`).name : ''"
                    @uploadSuccess=" importScore "></upload>
                </el-col>
              </el-row>
            </div> 
            <div v-else class="mar10">暂无数据</div>
          </el-tab-pane> 
        </el-tabs>
      </el-card>
    </div>
    <!-- 评分 -->
    <el-dialog 
      width="500px"
      title="评分" 
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
               {{`最大分数：${taskDetail.score}`}}分
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitScore('scoreForm')">打 分</el-button> 
          <el-button @click="scoreDialog = false">取 消</el-button> 
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
  export default { 
    components: { 
      upload,
    },
    data () {
      return {
        isLoad:               true,
        paperDialog:          false,
        delayDialog:          false,
        scoreDialog:          false,
        taskDetail:           null,
        editFileDialog:       false,       
        questionActiveName:   '1',
        answerMemberListData: [],
        loginUserId:          sessionStorage.getItem('access_key'),
        isPaperDialogShowClose: true,
        scoreForm:{
          score:  null, //分数 
          id:     null,  
        },
        delayForm: {
          end_time: null,
        },
        editFileForm: {
          task_files: null,
        }
      }
    }, 
    computed:{
      reportStatus(){  
        // 使用闭包才在计算属性中传参
        return function(){ 
          if(this.taskDetail){
            switch(this.taskDetail.cur_status){
              case 1: 
                return {name: '未发布', color: '#f5b800'};
                break;
              case 2: 
                return {name: '进行中', color: '#d298fd'};
                break;
              case 3: 
                return {name: '已截止', color: 'red'};
                break;
              case 4: 
                return {name: '已结束', color: '#3aff6e'};
                break;
            }
          }
        }  
      }
    },
    watch:{
      questionActiveName(val){
        this.getQueryReportMember();
      }
    },
    mounted(){  
      this.getQueryTaskDetail(); 
      this.getQueryReportMember();
    },
    methods: {  
      /**
       * 附件上传成功的回调
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      uploadReportSuccess(response){
        this.editFileForm.task_files = JSON.stringify(response);
        this.submitReportFile();
      },
      /**
       * 提交报告附件
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitReportFile(){
        this.axios.patch(`${this.common.basePath}/task/${this.$route.params.id}`, this.editFileForm).then((response) => {
          this.$message.success(response.data.meta.message);
          this.getQueryTaskDetail();
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
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
        this.axios.get(`${this.common.basePath}/task/${this.$route.params.id}`,'').then((response) => { 
          this.taskDetail = response.data.data;
          this.isLoad = false; 
        }).catch((error) => {
          this.$message.error(error);
          this.isLoad = false;  
        });
      },   
      /*
       * 人员列表
       */
      getQueryReportMember(){
        this.answerMemberListData = [];
        this.axios.get(`${this.common.basePath}/report/member/${this.$route.params.id}`,{params: {type: this.questionActiveName}}).then((response) => { 
          this.answerMemberListData = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      },  
      /*
       * 显示打分弹框
       */
      showScoreDialog(itemData){
        this.scoreDialog = true; 
        this.scoreForm.id = itemData.id;
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
          this.getQueryReportMember(); 
          this.scoreDialog = false;  
        }).catch((error) => {
          this.scoreDialog = false;
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
      /**
       * 下载表格
       * @return {[type]} [description]
       */
      downLoadReeport(){
        this.axios.get(`${this.common.basePath}/report/download?taskID=${this.$route.params.id}`,{responseType: "blob"}).then((response) => { 
          this.common._fileBold(response);
          this.$message.success('导出成功')
        }).catch((error) => { 
          this.$message.error(error); 
        });
      },
      /**
       * 上传老师打好分的表格
       * @return {[type]} [description]
       */
      importScore(file, response){
        this.$message.success('上传成功');
        this.getQueryReportMember();
        
      }
    }
  }
</script>
<style lang="less">
  .answer-member-box{ 
    /*display: flex;*/
  }
</style>