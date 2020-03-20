<template> 
  <div>    
    <el-row class="mard10" >
      <el-col :span="24">
        <el-form-item
          v-if="isEdit" 
          label="试卷名称：" 
          prop="paperItem.name"
          :rules="[
            { required: true, message: '请输入试卷名称', trigger: 'blur' },
            { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
            ">
          <el-input  v-model="paperItem.name"></el-input>
        </el-form-item> 
        <div v-else class="marl20">试卷名称：{{paperItem.name}}</div>
      </el-col> 
      <el-col :span="12" class="mart20"> 
        <el-form-item 
          v-if="isEdit" 
          label="考试时间：" 
          prop="paperItem.exam_time"
          :rules="[
            { required: true, message: '请输入考试时间', trigger: 'blur' },]
          "> 
          <el-input type="number" v-model="paperItem.exam_time">
            <template slot="append">分钟</template>
          </el-input>  
        </el-form-item>
        <div v-else class="marl20">考试时间：{{paperItem.exam_time}}分钟</div>
      </el-col> 
      <el-col :span="12" class="mart20"> 
        <el-form-item v-if="isEdit"  label="总分：">  
        	{{totalScore}}分
        </el-form-item> 
        <div v-else class="marl20">总分：{{totalScore}}</div>
      </el-col> 
      <el-col v-if="paperItem.id && isEdit" :span="24" class="mart10 marb20 text-right"> 
        <el-button @click="savePaperName" type="primary" size="small">保存</el-button>
      </el-col> 
    </el-row>   
    <el-card shadow="never">
    	<div 
    		class="questions-box mart5" 
    		v-for="(item, index) in paperItem.questions" 
    		:key="index">
  			<div>{{index + 1}}、</div>
  			<el-card class="questions-content" shadow="never">
  				<el-row class="mard10">
  					<el-col class="div-flex" :span="6">
  						<div class="label-2 label marr5">分数: </div> 

  						<el-input v-if="isEdit" type="number" v-model.number="item.score" auto-complete="off" ></el-input>
              <div v-else>{{item.score}}</div>

  						<div class="label-1 label marl5"> 分</div>
  					</el-col>
  					<el-col :offset="13" :span="4" class="text-right question-type">
  						{{numMatchingText(item.type)}}
  					</el-col> 
  					<el-col :span="1" class="text-right ">
  						<el-button v-if="isEdit" @click="del('question',index)" type="danger" size="mini" icon="el-icon-close" circle></el-button>
  					</el-col> 
  				</el-row>
  				<el-row class="mard10">
  					<el-col class="div-flex" :span="18">
  						<div class="label-2 label marr5">题干: </div> 
  						<el-input v-if="isEdit" v-model="item.question"></el-input>
              <div v-else>{{item.question}}</div>
  					</el-col>
  					<el-col :span="22" style="margin-left: 60px;">
  						<div 
  							v-for="(itemOption, indexOption) in item.options" 
                v-show="!itemOption.isDelete"
  							:key="indexOption" 
  							class="div-flex mart10 flex-align-items">
  							<div class="label-2 label marr5">选项{{indexOption + 1}}: </div> 
                <el-input v-if="isEdit" v-model="itemOption.name"></el-input>
                <div v-else>{{itemOption.name}}</div> 
  							<!-- 单选 -->
  							<el-radio 
  								v-show="(item.type == 1 || item.type == 3) && isEdit" 
  								class="marl5" 
  								@change="changeRadioRightKey(item, indexOption)" 
  								v-model="itemOption.answer" 
  								label="true">正确</el-radio>
  							<!-- 多选 -->
  							<el-checkbox 
  								v-show="item.type == 2 && isEdit" 
  								class="marl5"  
  								v-model="itemOption.answer" 
  								true-label="true" 
  								false-label="false">正确</el-checkbox>  
  							
  							<el-button v-if="isEdit" @click="del('option', index, indexOption)" class="marl5" type="danger" size="mini" icon="el-icon-close" circle></el-button> 
  						</div>
  						<el-button
  							v-show=" (item.type == 1 || item.type == 2) && isEdit"
  							style="margin-left: 65px;" 
  							@click=" addOption(index) " 
  							type="primary" 
  							size="mini" 
  							class="mart10">添加选项</el-button>
                <div class="text-right">
                  <!-- 有卷子Id并且是可编辑的情况 -->
                  <el-button
                  v-show=" paperItem.id && isEdit" 
                  @click=" saveAppointQuestion(item) " 
                  type="primary" 
                  size="small" 
                  class="mart10">保存</el-button>
                </div>
  					</el-col>
            <!-- 正确答案 -->
            <el-col :span="22" class="mart20"> 
              <div v-if="!isEdit" style="color: #62b549;">
                正确答案：{{item.type == 4 ? '无标准答案' : item.optionAnswer}}
              </div>
            </el-col>
  				</el-row>
  			</el-card>
  		</div>
  		<!-- 添加题型按钮 --> 
  		<div class="text-right mart10" v-if="isEdit">
  			<el-button type="primary" @click="addQution('radioQuestion')">添加单选题</el-button>
  			<el-button type="primary" @click="addQution('chekboxQuestion')">添加多选题</el-button>
  			<el-button type="primary" @click="addQution('judgeQuestion')">添加判断题</el-button>
  			<el-button type="primary" @click="addQution('shortAnswerQuestion')">添加简答题</el-button>

  		</div>
    </el-card>
  </div> 
</template>
<script> 
  export default {
  	props:{ 
  		paperItem: {
  			default: null,
  		},
      isEdit: { //true为能修改，false只能看
        default:  true,
        required: false,
      },  
  	},
    data () {
      return {
      	checkbox: false, 
		  	questionTemplate:{
		  		radioQuestion: {
	          question:"我是第二道试题（单选题）",
	          type:1, //1:单选，2多选，3判断题，4简答题
	          score:30,
	          analyze:"这是我的习题解析",
	          options:[
              {
                name:"我是第二试题的第一选项",
              	answer:"true",
                isDelete: false,
              },
              {
                name:"我是第2试题的第二选项",
                answer:"false",
                isDelete: false,
              },
              {
                name:"我是第2试题的第二选项",
                answer:"false",
                isDelete: false,
              }
            ]
	        },
	        chekboxQuestion: {
	          question:"我是第二道试题（多选题）",
	          type:2, //1:单选，2多选，3判断题，4简答题
	          score:30,
	          analyze:"这是我的习题解析",
	          options:[
	              {
	                name:"我是第二试题的第一选项",
	              	answer:'true',
                  isDelete: false,
	                
	              }, 
	              {
	                name:"我是第二试题的第二选项",
	              	answer:'true',
                  isDelete: false,
	                
	              }, 
	            ]
	        },
	        judgeQuestion: {
	          question:"我是第二道试题（判断题）",
	          type:3, //1:单选，2多选，3判断题，4简答题
	          score:30,
	          analyze:"这是我的习题解析",
	          options:[
	              {
	                name:"我是第二试题的第一选项",
	              	answer:"true",
                  isDelete: false,
	                
	              },
	              {
	                name:"我是第2试题的第二选项",
	                answer:"false",
                  isDelete: false,
	              },
	            ]
	        },
	        shortAnswerQuestion: {
	          question:"我是第二道试题（简答选题）",
	          type:4, //1:单选，2多选，3判断题，4简答题
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
    	totalScore(){ 
    		let score = 0;
    		this.paperItem.questions.forEach((item) => {
    			score += item.score; 
    		});	
    		return score;
    	},
    },
    created(){
      this.convertPaperItem();
    },
    mounted(){  
      
    },
    methods: {  
      convertPaperItem(){
        let questions = this.paperItem.questions;
        if(questions){
          questions.forEach( (item) => {
            item.optionAnswer = [];
            if(item.type != 4){
              item.options.forEach( (itemOption, indexOption) => {
                if(itemOption.answer == 'true'){
                  item.optionAnswer.push(`选项${indexOption + 1}`);
                }
              })
            } 
            item.optionAnswer = item.optionAnswer.join('、');  
          })
        }  
        Object.assign({}, this.paperItem.questions, questions);
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
    	 * 添题
    	 */
    	addQution(questionType){
    		this.paperItem.questions.push(JSON.parse(JSON.stringify(this.questionTemplate[questionType])));
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
        if(this.paperItem.questions.length <=1){ this.$message.warning('不能删除，必须存在一个题！！！'); return false;}

        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          // --------------------  有id表示已经保存在数据库中的数据，需要做一个伪删除 ------------/
          if(this.paperItem.questions[questionIndex].id){
            this._pseudoDelQution(questionIndex);
          }else{
            this.paperItem.questions.splice(questionIndex,1);
          }
          this.$message.success('删除成功，请点击保存');
        }).catch(() => {   

        });  
    	},
      _pseudoDelQution(questionIndex){ 
        this.axios.patch(`${this.common.basePath}/question/delete/${this.paperItem.questions[questionIndex].id}`,'').
        then((response) => { 
          this.paperItem.questions.splice(questionIndex,1);
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
    	_delOption(questionIndex, optionIndex){

        if(this.paperItem.questions[questionIndex].type == 1){ //单选必须存在一个正确答案
          if(this.paperItem.questions[questionIndex].options[optionIndex].answer == 'true') 
          {
            this.$message.warning('不能删除，单选题必须有一个正确答案！！！'); return false;
          }
        }else if(this.paperItem.questions[questionIndex].type == 2){ // 多选题必须有两个正确答案
          if(this.paperItem.questions[questionIndex].options[optionIndex].answer == 'true') 
          {
            let count = 0; //用来计算有几个被选中的值
            this.paperItem.questions[questionIndex].options.forEach((item) => {
              item.answer == 'true' ? count++ : '';
            })
            if(count <= 2){this.$message.warning('不能删除，多选题必须有两个正确答案！！！'); return false; }
          }
        }
        //-------------  必须存在两个选项 -------------------
    		if(this.paperItem.questions[questionIndex].options.length <=2){ this.$message.warning('不能删除，必须存在两个选项！！！'); return false;} 


        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          // --------------------  有id表示已经保存在数据库中的数据，需要做一个伪删除 ------------/
          if(this.paperItem.questions[questionIndex].options[optionIndex].id){
            this.paperItem.questions[questionIndex].options[optionIndex].isDelete = true;
          }else{
            this.paperItem.questions[questionIndex].options.splice(optionIndex,1);
          }
          this.$message.success('删除成功，请点击保存');
        }).catch(() => {   

        });   
    	},
    	/*
    	 * 添加选项
    	 */
    	addOption(questionIndex){ 
    		let option = JSON.parse(JSON.stringify(this.questionTemplate.radioQuestion.options[0]));
    		option.answer = false;
    		this.paperItem.questions[questionIndex].options.push(option);
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
        itemQuestion.paper_id = this.$route.params.associated_object; //试卷Id
        this.axios.post(url,itemQuestion).then((response) => { 
          this.$message.success(response.data.meta.message);
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
      /*
       * 保存试卷名称
       */
      savePaperName(){ 
        // ------------- 必须要有名字跟时间才能保存 --------------
        if(this.paperItem.name && this.paperItem.exam_time){
          this.axios.patch(`${this.common.basePath}/paper/${this.$route.params.associated_object}`, this.paperItem).then((response) => {
            this.$message.success(response.data.meta.message);  
          }).catch((error) => {
            this.$message.error(error); 
          }); 
        }
        
      }
    }
  }
</script>
<style lang="less">
  
</style>