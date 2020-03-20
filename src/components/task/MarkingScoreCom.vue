/*********  评分  ********************/
<template>  
  <div >   
    <el-card v-if="questionItem" class="questions-content" shadow="never"> 
      <el-row class="mard10">
        <el-col class="div-flex" :span="18"> 
          <div>{{questionIndex + 1}}、{{questionItem.question}}
            （{{questionItem.answer.score != null ? `得分：${questionItem.answer.score}分，` : '' }}
            总分{{questionItem.score}}分）
          </div>
        </el-col>
        <el-col :span="4" class="text-right question-type">
          {{numMatchingText(questionItem.type)}}
        </el-col> 
        <el-col :span="24">
          <div 
            v-if="questionItem.type == 1 || questionItem.type == 2 || questionItem.type == 3"
            style="margin-left: 10px;"
            v-for="(itemOption, indexOption) in questionItem.options" 
            v-show="!itemOption.isDelete"
            :key="indexOption" 
            class="div-flex mart10 flex-align-items">
            <!-- 单选 -->
            <el-radio 
              disabled
              v-show="questionItem.type == 1 || questionItem.type == 3" 
              class="marl5" 
              @change="changeRadioRightKey(questionItem, indexOption)" 
              v-model="itemOption.answer" 
              label="true">选项{{indexOption + 1}}：{{itemOption.name}}</el-radio>
            <!-- 多选 -->
            <el-checkbox 
              disabled
              v-show="questionItem.type == 2" 
              class="marl5"  
              v-model="itemOption.answer" 
              true-label="true" 
              false-label="false">选项{{indexOption + 1}}：{{itemOption.name}}</el-checkbox>   
          </div> 
          <!-- 简单题 -->
          <div v-if="questionItem.type == 4" class="mart10 marb10" style="margin-left: 10px;">
            {{questionItem.textAnswer}}
          </div>
        </el-col>
      </el-row>
      <div class="text-right mart10">
        <el-button v-show="questionIndex > 0" type="primary" @click="questionIndex--; getQueryQuestionDetail(questionIndex)">上一题</el-button>
        <el-button v-if="questionItem.type == 4" type="primary" @click="scoreQuestion">评分</el-button>
        <el-button 
          v-show=" (questionIndex + 1) < questionIdList.length " 
          type="primary" @click=" questionIndex++; getQueryQuestionDetail(questionIndex)">下一题</el-button> 
      </div>
    </el-card>  
    <el-card>
      <p class="mar10">
        <i class="color-box green"></i>为已打分题，
        <i class="color-box orange"></i>为未打分题，
        <i class="color-box gray"></i>为学生没有做答的题
      </p>
      <p class="marr10" style="display: inline-block;" v-for="(item, index) in questionIdList" :key="index">
        <el-button  
          class="question-btn" 
          :type=" item.answer_id ? item.score != null ? 'success' : 'warning' : 'info'" 
          :disabled="questionIdList[questionIndex].question_id == item.question_id"
          @click="questionIndex = index; getQueryQuestionDetail(questionIndex)">第{{index+1}}题</el-button>
      </p>
    </el-card>
    <p class="text-right"><el-button type="primary" @click="endScore">结束评分</el-button></p>

    <!-- 简答题评分 -->
    <el-dialog 
      width="500px"
      title="评分" 
      :closeOnClickModal="false" 
      :visible.sync="scoreDialog">
        <div v-if="questionItem" class="">
          <el-form ref="scoreForm" :model="scoreForm" label-width="80px">
            <el-form-item
              prop="score"
              label="得分"
              :rules="[{ required: true, message: '请打分', trigger: 'blur' }]"
              >
              <el-input-number v-model="scoreForm.score" :min="0" :max="questionItem.score" ></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitScore('scoreForm')">打 分</el-button> 
          <el-button @click="scoreDialog = false">取 消</el-button> 
        </div>
    </el-dialog>
  </div>  
</template>
<script> 
  export default {  
    data () {
      return {
        questionItem:       null,
        paramsSolutionId:   this.$route.params.solution_id, 
        questionIdList:     [],  //试卷Id数组
        questionIndex:      0,   //默认为0
        scoreDialog:        false, 
        scoreForm:{
          score:        null, //分数 
          question_id:  null, //题Id
          solution_id:  this.$route.params.solution_id,
        }
      }
    },
    mounted(){  
      this.getQueryQuestionIdListData();  
    },
    methods: {  
      /*
       * 根据题id，查询题目详情
       */
      getQueryQuestionDetail(index){   
        this.axios.get(`${this.common.basePath}/question/detail/teacher/${this.paramsSolutionId}`,{params: {questionId: this.questionIdList[index].question_id}}).then((response) => { 
          this._convertAnswer(response.data.data); 
        }).catch((error) => {
          this.$message.error(error);  
        });
      },  
      /*
       * 组装学生答案,然后复制给itemData
       */
      _convertAnswer(itemData){ 
        if(itemData.type == 4){ // 简答题的答案做一次处理
          itemData.answer ? itemData.textAnswer = itemData.answer.answer : itemData.textAnswer =''; 
        }else{
          let studentAnswerAry = itemData.answer.answer ? itemData.answer.answer.split(',') : [];
          itemData.options.forEach((itemOpt) => { 
            studentAnswerAry.forEach((itemStu) => {
              if(itemOpt.id == itemStu){
                itemOpt.answer = 'true';
              }
            }) 
          })
        } 
      this.questionItem = itemData;
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
            return this.questionTypeText = '简答题';
            break;  
        }
      },
      /*
       * 显示打分弹框
       */
      scoreQuestion(itemData){
        this.scoreDialog = true; 
        this.scoreForm.question_id = this.questionItem.id;
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
        this.axios.patch(`${this.common.basePath}/answer/score`,this.scoreForm).then((response) => { 
          this.getQueryQuestionIdListData(); 
          this.scoreDialog = false;  
        }).catch((error) => {
          this.scoreDialog = false;
          this.$message.error(error);  
        });
      },
      /*
       * 根据试卷Id，查询题库Id数组
       */
      getQueryQuestionIdListData(){ 
        this.axios.get(`${this.common.basePath}/question/score/${this.paramsSolutionId}`,'').then((response) => { 
           this.questionIdList = response.data.data; 
           this.getQueryQuestionDetail(this.questionIndex);
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 结束评分
       */
      endScore(){  
        window.xyy = this.$router
        this.axios.get(`${this.common.basePath}//answer/score/end/${this.paramsSolutionId}`,'').then((response) => { 
          this.$message({
            type:     "success",
            showClose: true,
            message: '评分结束，将跳转到上一个页面',
            duration: 1000,
          }); 
          setTimeout( ()=> {  
            // ------------ 当前是冲习题评分跳转过来 --------
            if(this.$router.history.current.name == 'EPTMarkingScore'){
              this.$router.push({ path: '/eptmanage/exercisescore' });
            }else if(this.$router.history.current.name == 'MarkingScore'){
              this.$router.push({ name: 'ExercisesTaskDetail', params: {experiment_id: this.$route.params.experiment_id,task_id: this.$route.params.task_id} });
            } 
          }, 1210);
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 改变单选时，需要改变每个选项的值，由于每个选项都是独立的字段，固只能每个选项都改变一次
       */
      changeRadioRightKey(itemQuestion, optionIndex){ 
        itemQuestion.options.forEach((item,index) => {
          if(index != optionIndex){
            item.answer = "false";
          }else{
            item.answer = "true";
          }
        }); 
      },
    }
  }
</script>
<style lang="less">
  .question-btn{
    width: 80px!important;
  }
  .color-box{
    display: inline-block;
    width: 24px;
    height: 14px;
    margin-right: 5px;
  }
  .color-box.green{
    background: #67C23A;
  }
  .color-box.orange{
    background: #E6A23C;
  }
  .color-box.gray{
    background: #909399;
  }
</style>