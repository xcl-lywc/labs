/*****************  问卷-答题  ********************/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/list' }">课程列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'LessonListDetail', params: {id: courseId} }">课程详情</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'LessonQuestionnaireDetail', params: {'course_id': courseId, 'cquestionnaire_id': cQuestionnaireId, 'questionnaire_id': questionnaireId} }">问卷任务详情</el-breadcrumb-item>
        <el-breadcrumb-item>答题</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div>    
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
                            :label="itemOption.id"> 
                            选项{{indexOption + 1}}：（{{itemOption.score}}分）{{itemOption.answer}}
                          </el-checkbox >    
                        </div> 
                      </el-checkbox-group> 
                      <!-- 评语 --> 
                      <div v-if="item.type == 4">
                        <el-input type="textarea" rows="5" v-model="item.answer"></el-input>
                        <div class="div-flex mart10">
                          *得分：<el-input-number :max="item.score" v-model="item.scoreA"></el-input-number>&nbsp;分
                        </div>
                      </div>
                    </div>  
                  </el-col>
                </el-row>
              </el-card>
            </div> 
          </el-card> 
        </div>
        <div class="text-right mart10">
          <!-- sheet_id 没有值时，才能提交评分 -->
          <el-button type="primary" @click="submit()">提交</el-button> 
        </div>
      </div>
    </div>
  </div>
</template>
<script>  
  export default { 
    data () {
      return {
        courseId:          this.$route.params.course_id, //课程Id
        cQuestionnaireId:  this.$route.params.cquestionnaire_id, //卷子基本信息Id
        questionnaireId:   this.$route.params.questionnaire_id, //卷子题库Id 
        qItems:               [],
        answerMemberListData: [],
        participantId:        'default',
        sheet_id:             null, //用来判断某个人是否已经打分,
      }
    },
    watch:{ 
    },
    mounted(){  
      this.getQueryQuestionnaireList(); 
    },
    methods: {    
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
       * 查问卷题
       */
      getQueryQuestionnaireList(){ 
        this.axios.get(`${this.common.basePath}/qitem`,{params: {questionnaire_id: this.questionnaireId}}).then((response) => {  
          this.qItems = this._convertQItems(response.data.data.rows) 
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 将多选类型，answer改为数组
       */
      _convertQItems(itemData){
        if(!itemData) return false; 
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
      submit(){
        this.axios.post(`${this.common.basePath}/course-answer/answer/${this.cQuestionnaireId}`,this._convertAnswer()).then((response) => {
          this.$message.success(response.data.meta.message);
          this.$router.push({name: 'LessonQuestionnaireDetail', params: {'course_id': this.courseId, 'cquestionnaire_id': this.cQuestionnaireId, 'questionnaire_id': this.questionnaireId} })
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 组装打分情况
       */
      _convertAnswer(){
        let answerAry = [];
        this.qItems.forEach( (item) => { 
          if(item.type == 2){ 
            answerAry.push({item_id: item.id, answer: item.answer.join(',')})
          }else if(item.type == 4){
            answerAry.push({item_id: item.id, answer: item.answer, score: item.scoreA});
          }else {
            answerAry.push({item_id: item.id, answer: item.answer})
          }
        });

        return answerAry;
      },
    }
  }
</script>
<style lang="less">
</style>