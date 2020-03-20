/*********  答题  ********************/
<template> 
  <div class="router-view-content" v-if="paperItem"> 
    <h3 class="text-center">{{paperItem.name}}</h3><hr/>
    <el-row class="mard10" > 
      <el-col :span="8"> 
        <div>答题时间：{{paperItem.exam_time}}分钟</div>
      </el-col> 
      <el-col :span="8"> 
        <div>总分：{{paperItem.score}}分</div>
      </el-col>
      <el-col :span="8"> 
        <div>剩余时间：{{countDownTime}}</div>
      </el-col> 
      <el-col :span="24" class="mart10 marb10" v-if="paperItem.description">
        <el-alert 
          :closable="false"
          :title="paperItem.description"
          type="info">
        </el-alert>
      </el-col>
      <el-col :span="24" class="text-right mart10"> 
        <el-button v-if="!isStartAnswerQuestion" type="primary" @click="startAnswer" size="mini">开始答题</el-button>
        <el-button v-if="isStartAnswerQuestion" type="primary" @click="advanceSubmit" size="mini">提前交卷</el-button>
      </el-col> 
    </el-row>   
    <el-card v-if="questionItem" class="questions-content" shadow="never"> 
      <el-row class="mard10">
        <el-col class="div-flex" :span="18"> 
          <div>{{questionIndex + 1}}、{{questionItem.question}}（{{questionItem.score}}分）</div>
        </el-col>
        <el-col :span="4" class="text-right question-type">
          {{numMatchingText(questionItem.type)}}
        </el-col> 
        <el-col :span="24">
          <div 
            style="margin-left: 10px;"
            v-for="(itemOption, indexOption) in questionItem.options" 
            v-show="!itemOption.isDelete"
            :key="indexOption" 
            class="div-flex mart10 flex-align-items">
            <!-- 单选 -->
            <el-radio 
              v-show="questionItem.type == 1 || questionItem.type == 3" 
              class="marl5" 
              @change="changeRadioRightKey(questionItem, indexOption)" 
              v-model="itemOption.answer" 
              label="true">选项{{indexOption + 1}}：{{itemOption.name}}</el-radio>
            <!-- 多选 -->
            <el-checkbox 
              v-show="questionItem.type == 2" 
              class="marl5"  
              v-model="itemOption.answer" 
              true-label="true" 
              false-label="false">选项{{indexOption + 1}}：{{itemOption.name}}</el-checkbox>   
          </div> 
          <!-- 简单题 -->
          <div class="mart10 marb10">
            <el-input :rows="10" v-if="questionItem.type == 4" type="textarea" v-model="questionItem.textAnswer"></el-input>
          </div>
        </el-col>
      </el-row>
      <div class="text-right mart10">
        <el-button v-show="questionIndex > 0" type="primary" @click="questionIndex--; getQueryQuestionDetail(questionIndex)">上一题</el-button>
        <el-button type="primary" @click="saveAnswer()">确定</el-button>
        <el-button 
          v-show=" (questionIndex + 1) < questionIdList.length " 
          type="primary" @click=" questionIndex++; getQueryQuestionDetail(questionIndex)">下一题</el-button> 
      </div>
    </el-card> 
    <el-card>
      <p class="mar10">
        <i class="color-box blue"></i>为未打题，
        <i class="color-box orange"></i>为已答题
      </p>
      <el-button 
        v-for="(item, index) in questionIdList" 
        :key="index"
        class="question-btn" 
        :type=" item.answer_id ? 'warning' : 'primary'" 
        :disabled="questionIdList[questionIndex].question_id == item.question_id"
        @click="questionIndex = index; getQueryQuestionDetail(questionIndex)">第{{index+1}}题</el-button>
    </el-card>
  </div>
</template>
<script> 
  export default { 
    props: ["paperId","taskId"],
    data () {
      return { 
        paperItem:              null, //试卷基本详情
        questionItem:           null, //根据Id查询出来的题
        solutionId:             null,
        questionIdList:         [],
        countDownTime:          0,
        questionIndex:          0, //当前被操作的题的Id下标 默认为第一个
        isStartAnswerQuestion:  false, //true已经在答题，取消开始答题按钮
        setIntervalTemp:        null, //用来接收时间循环器
      }
    },
    mounted(){  
      this.getQueryTaskDetail(); 
      // this.getQueryQuestionIdListData();
    },
    methods: {  
      /*
       * 查询实验任务列表
       */
      getQueryTaskDetail(){ 
        this.axios.get(`${this.common.basePath}/paper/simple/${this.paperId}?taskId=${this.taskId}`,'').then((response) => { 
          this.paperItem = response.data.data;  
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
       * 调用开始答题接口，获取到solutionId
       */
      startAnswer() {   
        this.$confirm('确认开始答题？', '提示', {
          confirmButtonText: '答题',
          cancelButtonText: '不答题',
          type: 'warning'
        }).then(() => { 
          this._startAnswer();
        }).catch(() => {
                   
        }); 
      },
      _startAnswer(){ 
        this.axios.get(`${this.common.basePath}/answer/start/${this.taskId}`,'').then((response) => { 
          this.$emit('isPaperDialogShowClose', false)
          this.solutionId = response.data.data; 
          this.getQueryQuestionIdListData();
          this._countDownTime();
          // ------- 已经在答题 ----------
          this.isStartAnswerQuestion = true;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 根据试卷Id，查询题库Id数组
       */
      getQueryQuestionIdListData(){ 
        this.axios.get(`${this.common.basePath}/question/paper/${this.paperId}/${this.solutionId}`,'').then((response) => { 
           this.questionIdList = response.data.data; 
           this.getQueryQuestionDetail(this.questionIndex);
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 根据题id，查询题目详情
       */
      getQueryQuestionDetail(index){   
        this.axios.get(`${this.common.basePath}/question/detail/${this.solutionId}`,{params: {questionId: this.questionIdList[index].question_id}}).then((response) => { 
          this._convertAnswer(response.data.data); 
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 组装学生答案
       */
      _convertAnswer(item){ 
        if(item.type == 4){ // 简答题的答案做一次处理
          item.answer ? item.textAnswer = item.answer.answer : ''; 
        }else{
          let studentAnswerAry = [];
          if(item.answer){
            if(item.answer.answer){
              studentAnswerAry =  item.answer.answer.split(',');
            }
          } 
          item.options.forEach((itemOpt) => { 
            studentAnswerAry.forEach((itemStu) => {
              if(itemOpt.id == itemStu){
                itemOpt.answer = 'true';
              }
            }) 
          })
        }
        
        this.questionItem = item;
      },
      /*
       * 倒计时
       */ 
      _countDownTime(){
        // ---------- 先清空，避免重复计时 ----------
        if(this.setIntervalTemp){
          clearInterval(this.setIntervalTemp);
        } 
        let timeSecond  = parseInt(this.paperItem.exam_time)*60;
        this.countDownTime = `${parseInt(timeSecond/60)}分` ;
        
        this.setIntervalTemp = setInterval(() => {
          timeSecond--;
          this.countDownTime = `${parseInt(timeSecond/60)}分${timeSecond- (parseInt(timeSecond/60)*60)}秒` ;
          if(timeSecond <= 0){
            clearInterval(this.setIntervalTemp);
            this.$alert('考试时间结束，点击确认按钮，退出此页面！！！！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this._submitPaper();
                this.$emit('closePaperDialog');
              }
            });
          }
        },1000) 
      },
      /*
       * 保存答案
       */
      saveAnswer(){
        this.axios.post(`${this.common.basePath}/answer`,this._saveAnswerParams()).then((response) => {  
          // ---- 答题正确就是获取下一题的下标,再查, 并且保证当前不是最后一个题 -------
          if(this.questionIndex + 1 < this.questionIdList.length){
            this.questionIndex++;
          }else{ 
            this.$message('已答完最后一题！！！')
          }
          this.getQueryQuestionIdListData();
         
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      _saveAnswerParams(){ 
        let answer = '';
        if(this.questionItem.type == 4) { //简单题
          answer = this.questionItem.textAnswer;
        }else{
          this.questionItem.options.forEach((item) => {
            if(item.answer == 'true') answer += item.id + ',';
          });
          answer = answer.substring(0,answer.length-1);
        } 
        return {
          solution_id:  this.solutionId,
          question_id:   this.questionItem.id,
          answer:       answer,
          id:           this.questionItem.answer ? this.questionItem.answer.id : null,
        }
      },
      /*
       * 提前交卷
       */
      advanceSubmit(isAdvaneSubmit){
        // --------- 清空倒计时 ----------
        clearInterval(this.setIntervalTemp); 
        if(isAdvaneSubmit){
          this.$confirm('提前交卷，将不能再答题，确定吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this._submitPaper();
          }).catch(() => {
                     
          }); 
        } 
      },
      /*
       * 交卷
       */
      _submitPaper(){
        this.axios.get(`${this.common.basePath}/answer/complete/${this.solutionId}`,'').then((response) => { 
          this.$emit('closePaperDialog')
        }).catch((error) => {
          this.$message.error(error);  
        });
      }
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
  .color-box.blue{
    background: #409EFF;
  }
  .color-box.orange{
    background: #E6A23C;
  } 
</style>