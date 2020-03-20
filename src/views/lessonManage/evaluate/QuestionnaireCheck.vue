/*****************  查看问卷，根据条件判断能否编辑  ********************/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TestDetail', params: {id: $route.params.experiment_id} }">实验详情</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'QuestionnaireTaskDetail', params: {id: $route.params.task_id} }">问卷任务详情</el-breadcrumb-item>
        <el-breadcrumb-item>答题</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content" v-if="paperItem">
        <div>  
          <!-- 被评价人列表 -->
          <div> 
            <el-radio-group v-model="participantId" >
              <el-radio-button v-for="(item, index) in answerMemberListData" :label="item.id">{{item.user_name}}</el-radio-button>  
            </el-radio-group>
          </div>
          <hr/>
          <el-form ref="paperItem" :model="paperItem" label-width="120px">
            <el-row class="mard10" >
              <el-col :span="12" class="mard10">
                 <span>{{paperItem.name}}</span>
              </el-col> 
              <el-col :span="12" class="mard10"> 
                <span>{{questionaireType(paperItem.type)}}</span>
              </el-col> 
              <el-col :span="24" class="mart10"> 
                <span>{{paperItem.description}}</span>
              </el-col> 
            </el-row>  
          </el-form>
          <el-card shadow="never">
            <div 
              class="questions-box mart5" 
              v-for="(item, index) in qItems" 
              :key="index">
              <div>{{index + 1}}、</div>
              <el-card class="questions-content" shadow="never">
                <el-row class="mard10"> 
                  <el-col class="div-flex" :span="17">
                    <div class="label-2 label marr5">题干: </div>  
                    <div>
                      <span v-if="item.type == 1">{{item.question}}</span>
                      <span v-if="item.type == 2">{{item.question}} （最多能选择{{item.max_option}}项）</span>
                      <span v-if="item.type == 4">{{item.question}}（最大分数：{{item.score}}分）</span>
                    </div>
                  </el-col>
                  <el-col :offset="1" :span="5" class="text-right question-type">
                    {{numMatchingText(item.type)}}
                  </el-col>  
                </el-row>
                <el-row class="mard10"> 
                  <el-col :span="22">
                    <div style="margin-left: 60px;">
                      <!-- 单选 --> 
                      <el-radio-group v-model="item.answer" v-if="item.type == 1" >
                        <div 
                          v-for="(itemOption, indexOption) in item.options"  
                          :key="indexOption" 
                          class="div-flex mart10 flex-align-items">
                          <el-radio  
                            class="marl5"   
                            disabled
                            :label="itemOption.id">
                            选项{{indexOption + 1}}：（{{itemOption.score}}分）{{itemOption.answer}}
                          </el-radio>   
                        </div>
                      </el-radio-group> 
                      <!-- 多选 -->
                      <el-checkbox-group v-model="item.answer" v-if="item.type == 2" :max="item.max_option">
                        <div 
                          v-for="(itemOption, indexOption) in item.options" 
                          :key="indexOption" 
                          class="div-flex mart10 flex-align-items"> 
                          <el-checkbox   
                            class="marl5"
                            disabled
                            :label="itemOption.id"> 
                            选项{{indexOption + 1}}：（{{itemOption.score}}分）{{itemOption.answer}}
                          </el-checkbox >    
                        </div> 
                      </el-checkbox-group> 
                      <!-- 评语 --> 
                      <div v-if="item.type == 4">
                        <el-input disabled type="textarea" rows="5" v-model="item.answer"></el-input>
                        <div class="div-flex mart10">
                          *得分：<el-input-number disabled :max="item.score" v-model="item.scoreA"></el-input-number>&nbsp;分
                        </div>
                      </div>
                    </div>  
                  </el-col>
                </el-row>
              </el-card>
            </div> 
          </el-card> 
        </div>
      </div>
    </div>
  </div>
</template>
<script> 
  // this.$route.params.id 为问卷Id
  import qustionnaire from '../../../components/Questionnaire.vue'
  export default { 
    data () {
      return {
        questionTypeText:     null, //题型
        paperItem:            null,
        qItems:               [],
        answerMemberListData: [],
        participantId:        'default',
        sheet_id:             null, //用来判断某个人是否已经打分,
      }
    },
    watch:{
      participantId(val,oldVal){
        // ------- 避免刚进入页面，就调用此方法
        if(oldVal != 'default'){
          this._isHasSheetId();
          this.getQueryQuestionnaireList();
        }
        
      }
    },
    mounted(){  
      this.getQueryPaperDetail();
      this.getQueryAnswerMember();
    },
    methods: {  
      /*
       * 查询被打分的人员数组
       */
      getQueryAnswerMember(){
        this.axios.get(`${this.common.basePath}/qanswer/member/${this.$route.params.task_id}`,'').then((response) => { 
          this.answerMemberListData = response.data.data; 
          // --------- 当前没有被选中的数据，就给一个默认值
          if(this.participantId == 'default') { 
            this.participantId = response.data.data ? response.data.data.length ? response.data.data[0].id : '' : '';
          }
          this._isHasSheetId(); 
          this.getQueryQuestionnaireList();
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 问卷类型由数字转文字 
       */
      questionaireType(type){ 
        switch(type){
          case 1:
            return '评价教学';
            break;
          case 2:
            return '互评';
            break;
          case 3:
            return '自评';
            break;
            
        }
      },
      /*
       * 根据数字匹配中文
       */
      numMatchingText(num){ 
        switch(num){
          case 1:
            return this.questionTypeText = '单选题';
            break; 
          case 2:
            return this.questionTypeText = '多选题';
            break; 
          case 3:
            return this.questionTypeText = '判断题';
            break; 
          case 4:
            return this.questionTypeText = '评语';
            break;  
        }
      },
      /*
       * 查询问卷基本信息
       */
      getQueryPaperDetail(){
        this.axios.get(`${this.common.basePath}/questionnaire/${this.$route.params.questionnaire_id}`,'').then((response) => { 
          this.paperItem = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 查问卷题
       */
      getQueryQuestionnaireList(){ 
        this.axios.get(`${this.common.basePath}/qitem`,{params: {questionnaire_id: this.$route.params.questionnaire_id, sheet_id: this.sheet_id}}).then((response) => {  
          this.qItems = this._convertQItems(response.data.data.rows) 
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 将多选类型，answer改为数组
       */
      _convertQItems(itemData){
        itemData.forEach( (item) => { 
          if(item.type == 1) {
            item.answer = item.answer ? parseInt(item.answer.answer) : null;
          }else if(item.type == 2) { 
            item.answer = item.answer ? item.answer.answer.split(',').map(Number) : [];
          }else if(item.type == 4){
            item.scoreA = item.answer ? item.answer.score : null; //添加一个字段，用来绑定打分情况
            item.answer = item.answer ? item.answer.answer : null;
          }
        })   
        return itemData;
      }, 
      /*
       * 遍历所有人员数据给被选中的人员赋值sheet_id
       */
      _isHasSheetId(){
        if(this.answerMemberListData){
          this.answerMemberListData.forEach( (item) => {
            if(item.id == this.participantId){
              this.sheet_id = item.sheet_id;
            }
          })
        }
      }
    }
  }
</script>
<style lang="less">
</style>