/********* 创建问卷 *********/
<template> 
  <div>  
    <!-- <el-form ref="questionnaire" :model="questionnaire" label-width="120px"> -->
    <el-row class="mard10" >
      <el-col :span="12" class="mard10">
        <el-form-item 
          label="问卷名称：" 
          prop="questionnaire.name"
          :rules="[
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
          ">
          <el-input v-if="isEdit" v-model="questionnaire.name"></el-input> 
          <span v-else>{{questionnaire.name}}</span>
        </el-form-item> 
      </el-col> 
      <el-col :span="12" class="mard10" v-if="type == 0"> 
      <!-- {{noType}} -->
        <el-form-item 
          label="问卷类型：" 
          prop="type">
          <el-select v-if="isEdit" v-model="questionnaire.type" placeholder="请选择">
            <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span v-else>{{questionaireType(questionnaire.type)}}</span>
        </el-form-item>
      </el-col> 
      <el-col :span="24" class="mart10"> 
        <el-form-item 
          label="问卷要求：" 
          prop="questionnaire.description"
          :rules="[
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]
          ">
          <el-input v-if="isEdit" type="textarea" :rows="6" v-model="questionnaire.description"> 
          </el-input>  
          <span v-else>{{questionnaire.description}}</span>
        </el-form-item>
      </el-col> 
    </el-row>  
    <!-- </el-form> -->
    <el-card shadow="never">
      <div 
        class="questions-box mart5" 
        v-for="(item, index) in questionnaire.qItems" 
        :key="index">
        <div>{{index + 1}}、</div>
        <el-card class="questions-content" shadow="never">
          <el-row class="mard10"> 
            <el-col class="div-flex" :span="17">
              <div class="label-2 label marr5">题干: </div> 
              <el-input v-if="isEdit" v-model="item.question"></el-input>
              <div v-else>
                <span v-if="item.type != 4">{{item.question}}</span>
                <span v-else>{{item.question}}（{{item.score}}分）</span>
              </div>
            </el-col>
            <el-col :offset="1" :span="5" class="text-right question-type">
              {{numMatchingText(item.type)}}
            </el-col> 
            <el-col :span="1" class="text-right ">
              <el-button v-if="isEdit" @click="del('question',index)" type="danger" size="mini" icon="el-icon-close" circle></el-button>
            </el-col> 
          </el-row>
          <el-row class="mard10"> 
            <el-col :span="22">
              <div v-if="item.type == 1 || item.type == 2 " style="margin-left: 60px;">
                <div 
                  v-for="(itemOption, indexOption) in item.options" 
                  v-show="!itemOption.isDelete"
                  :key="indexOption" 
                  class="div-flex mart10 flex-align-items">
                  <div class="label-2 label marr5">选项{{indexOption + 1}}: </div> 
                  <div>
                    <el-input v-if="isEdit" v-model="itemOption.answer"></el-input>
                    <div v-else>{{itemOption.answer}}</div>
                  </div>
                  <div>
                    <el-input v-if="isEdit" placeholder="" v-model="itemOption.score" class="input-with-pa">
                      <span slot="prepend">分数</span>
                      <span slot="append">分</span>
                    </el-input>
                    <div v-else>（{{itemOption.score}}分）</div>
                  </div> 
                  <!-- 删除数据按钮 -->
                  <el-button v-if="isEdit" @click="del('option', index, indexOption)" class="marl5" type="danger" size="mini" icon="el-icon-close" circle></el-button>
                </div>
                <!-- 多选需要设置一个最大能选择几项, 类型为多选并且能编辑 -->
                <div v-if="item.type == 2 && isEdit" class="div-flex flex-align-items mart10">
                  最多能选择<el-input-number class="marl5 marr5" v-model="item.max_option" :min="1" :max="item.options.length"></el-input-number>项
                </div>
                <el-button
                  v-show=" (item.type == 1 || item.type == 2) && isEdit"
                  style="margin-left: 65px;" 
                  @click=" addOption(index) " 
                  type="primary" 
                  size="mini" 
                  class="mart10">添加选项</el-button>
              </div>
              <!-- 类型为评语并且能编辑 -->
              <div v-if="item.type == 4 && isEdit" style="margin-left: 13px;" class="mart10">
                <el-input placeholder="" v-model="item.score" class="input-with-pa">
                  <span slot="prepend">分数</span>
                  <span slot="append">分</span>
                </el-input>
              </div>
              <div class="text-right">
                <!-- 有卷子Id并且是可编辑的情况 -->
                <el-button
                v-show=" questionnaire.id && isEdit" 
                @click=" saveAppointQuestion(item) " 
                type="primary" 
                size="small" 
                class="mart10">保存</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <!-- 添加题型按钮 --> 
      <div class="text-right mart10" v-if="isEdit">
        <el-button type="primary" @click="addQution('radioQuestion')">添加单选题</el-button>
        <el-button type="primary" @click="addQution('chekboxQuestion')">添加多选题</el-button> 
        <el-button type="primary" @click="addQution('shortAnswerQuestion')">添加评语</el-button>

      </div>
    </el-card> 
  </div>
</template>
<script> 
  export default { 
    props:{
      questionnaire: {
        default: null,
      },
      isEdit:    false,
      type:    { //0表示需要Type字段,1则不要
        default: 0,
      }
    },
    data () {
      return {
        checkbox: false,  
        optionsType:  [ //1评价教学2互评3自评
          {value: 1, label: '评价教学'},
          {value: 2, label: '互评'},
          {value: 3, label: '自评'},
        ],
        questionTemplate:{
          radioQuestion: {
            question:"我是第二道试题 ",
            type:1, //1:单选，2多选，4评语 
            options:[
              {
                answer:"我是第二试题的第一选项",
                score: 1,
                isDelete: false,
              },
              {
                answer:"我是第2试题的第二选项",
                score: 2,
                isDelete: false,
              },
              {
                answer:"我是第2试题的第二选项",
                score: 3,
                isDelete: false,
              }
            ]
          },
          chekboxQuestion: {
            question:"我是第二道试题 ",
            type:2, //1:单选，2多选，4评语 
            max_option: 1, 
            options:[
                {
                  answer:"我是第二试题的第一选项",
                  score: 1,
                  isDelete: false,
                  
                }, 
                {
                  answer:"我是第二试题的第二选项",
                  score: 2,
                  isDelete: false,
                  
                }, 
              ]
          }, 
          shortAnswerQuestion: {
            question:"我是第二道试题",
            type:4, //1:单选，2多选，4评语
            score:30,
            analyze:"这是我的习题解析",
          },
        },
        questionTypeText: null, //题型
      }
    },
    components:{ 
    },
    computed:{ 
    },
    mounted(){  
     },
    methods: {  
      /*
       * 问卷类型由数字转文字 
       */
      questionaireType(type){ 
        switch(type){
          case 1:
            return '评价教学';
            break;
          case 2:
            return '自评';
            break;
          case 3:
            return '互评';
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
       * 添题
       */
      addQution(questionType){
        this.questionnaire.qItems.push(JSON.parse(JSON.stringify(this.questionTemplate[questionType])));
      },
      /*
       * 删除题或者题选项 
       * @params {string} type question为整个题， option为指定选项
       * @params {number/string} index 题下标
       * @params {number/string} optionIndex 选项下标
       */
      del(type, questionIndex, optionIndex){ 
        type == 'question' ? this._delQution(questionIndex) : this._delOption(questionIndex, optionIndex); 
      },
      _delQution(questionIndex){ 
        if(this.questionnaire.qItems.length <=1){ this.$message.warning('不能删除，必须存在一个题！！！'); return false;}
        
        // --------------------  有id表示已经保存在数据库中的数据，需要做一个伪删除 ------------/
        if(this.questionnaire.qItems[questionIndex].id){
          this._pseudoDelQution(questionIndex);
        }else{
          this.questionnaire.qItems.splice(questionIndex,1);
        }
      },
      _pseudoDelQution(questionIndex){ 
        this.axios.patch(`${this.common.basePath}/question/delete/${this.questionnaire.qItems[questionIndex].id}`,'').
        then((response) => { 
          this.questionnaire.qItems.splice(questionIndex,1);
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      _delOption(questionIndex, optionIndex){ 
        //-------------  必须存在两个选项 -------------------
        if(this.questionnaire.qItems[questionIndex].options.length <=2){ this.$message.warning('不能删除，必须存在两个选项！！！'); return false;} 


        // --------------------  有id表示已经保存在数据库中的数据，需要做一个伪删除 ------------/
        if(this.questionnaire.qItems[questionIndex].options[optionIndex].id){
          this.questionnaire.qItems[questionIndex].options[optionIndex].isDelete = true;
        }else{
          this.questionnaire.qItems[questionIndex].options.splice(optionIndex,1);
        }
        
      },
      /*
       * 添加选项
       */
      addOption(questionIndex){ 
        let option = JSON.parse(JSON.stringify(this.questionTemplate.radioQuestion.options[0]));
        this.questionnaire.qItems[questionIndex].options.push(option);
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
       * 保存具体的一个题
       * @params {object} itemQuestion 一个题的数据
       */ 
      saveAppointQuestion(itemQuestion){ 
        let url = null;
        // --------------- 有id就编辑，没有id就保存一个新的 -------------------------/
        url = itemQuestion.id ? `${this.common.basePath}/question/update` : `${this.common.basePath}/question/save`;
        itemQuestion.paper_id = this.$route.params.id;
        this.axios.post(url,itemQuestion).then((response) => { 
          this.paperDetail = response.data.data; 
          // ----------- 有值，表示新增题成功后，返回了一个Id -------
          if(response.data.data) itemQuestion.id = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      },  
      /*
       * 根据Id查题
       * @params {object} itemQuestion 被修改的题数据
       */
      getQueryQuestionById(itemQuestion){
        this.axios.get(`${this.common.basePath}question/simple/${itemQuestion.id}`,'').then((response) => { 
          itemQuestion = response.data.data; 
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
    }
  }
</script>
<style lang="less">
  .input-with-pa {
    width: 204px;
    margin-left: 50px;
    .el-input__inner{
      width: 80px;
    }

  }
  .input-with-pa_max{
     margin-left: 5px;
    .el-input__inner{
      width: 150px!important;
    }
  }
</style>