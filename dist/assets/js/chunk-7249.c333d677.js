(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7249"],{"1b64":function(t,e,s){"use strict";var i=s("a9a0"),a=s.n(i);a.a},"3dfd":function(t,e,s){"use strict";var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("el-row",{staticClass:"mard10"},[s("el-col",{staticClass:"mard10",attrs:{span:12}},[s("el-form-item",{attrs:{label:"问卷名称：",prop:"questionnaire.name",rules:[{required:!0,message:"请输入任务名称",trigger:"blur"},{validator:function(e,s,i){t.common.wordNumberValid(e,s,i,"single")},trigger:"blur"}]}},[t.isEdit?s("el-input",{model:{value:t.questionnaire.name,callback:function(e){t.$set(t.questionnaire,"name",e)},expression:"questionnaire.name"}}):s("span",[t._v(t._s(t.questionnaire.name))])],1)],1),0==t.type?s("el-col",{staticClass:"mard10",attrs:{span:12}},[s("el-form-item",{attrs:{label:"问卷类型：",prop:"type"}},[t.isEdit?s("el-select",{attrs:{placeholder:"请选择"},model:{value:t.questionnaire.type,callback:function(e){t.$set(t.questionnaire,"type",e)},expression:"questionnaire.type"}},t._l(t.optionsType,function(t){return s("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})})):s("span",[t._v(t._s(t.questionaireType(t.questionnaire.type)))])],1)],1):t._e(),s("el-col",{staticClass:"mart10",attrs:{span:24}},[s("el-form-item",{attrs:{label:"问卷要求：",prop:"questionnaire.description",rules:[{required:!0,message:"请输入任务名称",trigger:"blur"},{validator:function(e,s,i){t.common.wordNumberValid(e,s,i,"textarea")},trigger:"blur"}]}},[t.isEdit?s("el-input",{attrs:{type:"textarea",rows:6},model:{value:t.questionnaire.description,callback:function(e){t.$set(t.questionnaire,"description",e)},expression:"questionnaire.description"}}):s("span",[t._v(t._s(t.questionnaire.description))])],1)],1)],1),s("el-card",{attrs:{shadow:"never"}},[t._l(t.questionnaire.qItems,function(e,i){return s("div",{key:i,staticClass:"questions-box mart5"},[s("div",[t._v(t._s(i+1)+"、")]),s("el-card",{staticClass:"questions-content",attrs:{shadow:"never"}},[s("el-row",{staticClass:"mard10"},[s("el-col",{staticClass:"div-flex",attrs:{span:17}},[s("div",{staticClass:"label-2 label marr5"},[t._v("题干: ")]),t.isEdit?s("el-input",{model:{value:e.question,callback:function(s){t.$set(e,"question",s)},expression:"item.question"}}):s("div",[4!=e.type?s("span",[t._v(t._s(e.question))]):s("span",[t._v(t._s(e.question)+"（"+t._s(e.score)+"分）")])])],1),s("el-col",{staticClass:"text-right question-type",attrs:{offset:1,span:5}},[t._v("\n            "+t._s(t.numMatchingText(e.type))+"\n          ")]),s("el-col",{staticClass:"text-right ",attrs:{span:1}},[t.isEdit?s("el-button",{attrs:{type:"danger",size:"mini",icon:"el-icon-close",circle:""},on:{click:function(e){t.del("question",i)}}}):t._e()],1)],1),s("el-row",{staticClass:"mard10"},[s("el-col",{attrs:{span:22}},[1==e.type||2==e.type?s("div",{staticStyle:{"margin-left":"60px"}},[t._l(e.options,function(e,a){return s("div",{directives:[{name:"show",rawName:"v-show",value:!e.isDelete,expression:"!itemOption.isDelete"}],key:a,staticClass:"div-flex mart10 flex-align-items"},[s("div",{staticClass:"label-2 label marr5"},[t._v("选项"+t._s(a+1)+": ")]),s("div",[t.isEdit?s("el-input",{model:{value:e.answer,callback:function(s){t.$set(e,"answer",s)},expression:"itemOption.answer"}}):s("div",[t._v(t._s(e.answer))])],1),s("div",[t.isEdit?s("el-input",{staticClass:"input-with-pa",attrs:{placeholder:""},model:{value:e.score,callback:function(s){t.$set(e,"score",s)},expression:"itemOption.score"}},[s("span",{attrs:{slot:"prepend"},slot:"prepend"},[t._v("分数")]),s("span",{attrs:{slot:"append"},slot:"append"},[t._v("分")])]):s("div",[t._v("（"+t._s(e.score)+"分）")])],1),t.isEdit?s("el-button",{staticClass:"marl5",attrs:{type:"danger",size:"mini",icon:"el-icon-close",circle:""},on:{click:function(e){t.del("option",i,a)}}}):t._e()],1)}),2==e.type&&t.isEdit?s("div",{staticClass:"div-flex flex-align-items mart10"},[t._v("\n                最多能选择"),s("el-input-number",{staticClass:"marl5 marr5",attrs:{min:1,max:e.options.length},model:{value:e.max_option,callback:function(s){t.$set(e,"max_option",s)},expression:"item.max_option"}}),t._v("项\n              ")],1):t._e(),s("el-button",{directives:[{name:"show",rawName:"v-show",value:(1==e.type||2==e.type)&&t.isEdit,expression:" (item.type == 1 || item.type == 2) && isEdit"}],staticClass:"mart10",staticStyle:{"margin-left":"65px"},attrs:{type:"primary",size:"mini"},on:{click:function(e){t.addOption(i)}}},[t._v("添加选项")])],2):t._e(),4==e.type&&t.isEdit?s("div",{staticClass:"mart10",staticStyle:{"margin-left":"13px"}},[s("el-input",{staticClass:"input-with-pa",attrs:{placeholder:""},model:{value:e.score,callback:function(s){t.$set(e,"score",s)},expression:"item.score"}},[s("span",{attrs:{slot:"prepend"},slot:"prepend"},[t._v("分数")]),s("span",{attrs:{slot:"append"},slot:"append"},[t._v("分")])])],1):t._e(),s("div",{staticClass:"text-right"},[s("el-button",{directives:[{name:"show",rawName:"v-show",value:t.questionnaire.id&&t.isEdit,expression:" questionnaire.id && isEdit"}],staticClass:"mart10",attrs:{type:"primary",size:"small"},on:{click:function(s){t.saveAppointQuestion(e)}}},[t._v("保存")])],1)])],1)],1)],1)}),t.isEdit?s("div",{staticClass:"text-right mart10"},[s("el-button",{attrs:{type:"primary"},on:{click:function(e){t.addQution("radioQuestion")}}},[t._v("添加单选题")]),s("el-button",{attrs:{type:"primary"},on:{click:function(e){t.addQution("chekboxQuestion")}}},[t._v("添加多选题")]),s("el-button",{attrs:{type:"primary"},on:{click:function(e){t.addQution("shortAnswerQuestion")}}},[t._v("添加评语")])],1):t._e()],2)],1)},a=[],n=(s("ac6a"),{props:{questionnaire:{default:null},isEdit:!1,type:{default:0}},data:function(){return{checkbox:!1,optionsType:[{value:1,label:"评价教学"},{value:2,label:"互评"},{value:3,label:"自评"}],questionTemplate:{radioQuestion:{question:"我是第二道试题 ",type:1,options:[{answer:"我是第二试题的第一选项",score:1,isDelete:!1},{answer:"我是第2试题的第二选项",score:2,isDelete:!1},{answer:"我是第2试题的第二选项",score:3,isDelete:!1}]},chekboxQuestion:{question:"我是第二道试题 ",type:2,max_option:1,options:[{answer:"我是第二试题的第一选项",score:1,isDelete:!1},{answer:"我是第二试题的第二选项",score:2,isDelete:!1}]},shortAnswerQuestion:{question:"我是第二道试题",type:4,score:30,analyze:"这是我的习题解析"}},questionTypeText:null}},components:{},computed:{},mounted:function(){},methods:{questionaireType:function(t){switch(t){case 1:return"评价教学";case 2:return"自评";case 3:return"互评"}},numMatchingText:function(t){switch(t){case 1:return this.questionTypeText="单选题";case 2:return this.questionTypeText="多选题";case 3:return this.questionTypeText="判断题";case 4:return this.questionTypeText="评语"}},addQution:function(t){this.questionnaire.qItems.push(JSON.parse(JSON.stringify(this.questionTemplate[t])))},del:function(t,e,s){"question"==t?this._delQution(e):this._delOption(e,s)},_delQution:function(t){if(this.questionnaire.qItems.length<=1)return this.$message.warning("不能删除，必须存在一个题！！！"),!1;this.questionnaire.qItems[t].id?this._pseudoDelQution(t):this.questionnaire.qItems.splice(t,1)},_pseudoDelQution:function(t){var e=this;this.axios.patch("".concat(this.common.basePath,"/question/delete/").concat(this.questionnaire.qItems[t].id),"").then(function(s){e.questionnaire.qItems.splice(t,1)}).catch(function(t){e.$message.error(t)})},_delOption:function(t,e){if(this.questionnaire.qItems[t].options.length<=2)return this.$message.warning("不能删除，必须存在两个选项！！！"),!1;this.questionnaire.qItems[t].options[e].id?this.questionnaire.qItems[t].options[e].isDelete=!0:this.questionnaire.qItems[t].options.splice(e,1)},addOption:function(t){var e=JSON.parse(JSON.stringify(this.questionTemplate.radioQuestion.options[0]));this.questionnaire.qItems[t].options.push(e)},changeRadioRightKey:function(t,e){t.options.forEach(function(t,s){t.answer=s!=e?"false":"true"})},saveAppointQuestion:function(t){var e=this,s=null;s=t.id?"".concat(this.common.basePath,"/question/update"):"".concat(this.common.basePath,"/question/save"),t.paper_id=this.$route.params.id,this.axios.post(s,t).then(function(s){e.paperDetail=s.data.data,s.data.data&&(t.id=s.data.data)}).catch(function(t){e.$message.error(t)})},getQueryQuestionById:function(t){var e=this;this.axios.get("".concat(this.common.basePath,"question/simple/").concat(t.id),"").then(function(e){t=e.data.data}).catch(function(t){e.$message.error(t)})}}}),o=n,r=(s("da46"),s("2877")),l=Object(r["a"])(o,i,a,!1,null,null,null);l.options.__file="Questionnaire.vue";e["a"]=l.exports},a9a0:function(t,e,s){},d268:function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"content-wrap-box"},[s("el-card",{staticClass:"title-card"},[s("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[s("el-breadcrumb-item",{attrs:{to:{path:"/lesson/testlist"}}},[t._v("实验列表")]),s("el-breadcrumb-item",{attrs:{to:{name:"TestDetail",params:{id:t.$route.params.id}}}},[t._v("实验详情")]),s("el-breadcrumb-item",[t._v("添加评价要求")])],1)],1),s("div",{staticClass:"router-view-wrap"},[s("div",{staticClass:"router-view-content"},[s("el-form",{ref:"taskForm",attrs:{model:t.taskForm,"label-width":"120px"}},[s("el-row",[s("el-col",{attrs:{span:24}},[s("el-form-item",{attrs:{label:"任务名称：",prop:"name",rules:[{required:!0,message:"请输入任务名称",trigger:"blur"},{validator:function(e,s,i){t.common.wordNumberValid(e,s,i,"single")},trigger:"blur"}]}},[s("el-input",{model:{value:t.taskForm.name,callback:function(e){t.$set(t.taskForm,"name",e)},expression:"taskForm.name"}})],1)],1),s("el-col",{attrs:{span:24}},[s("el-form-item",{attrs:{label:"问卷内容："}},[s("el-card",[s("questionnaire-paper",{attrs:{questionnaire:t.taskForm.questionnaire,isEdit:"true"}})],1)],1)],1),s("el-col",{attrs:{span:24}},[s("el-form-item",{attrs:{label:""}},[s("el-button",{attrs:{disabled:!t.common.checkAuthority("CreateQuestionnaire_Save",!0),type:"primary"},on:{click:function(e){t.submitSave("taskForm")}}},[t._v("\n                "+t._s(t.common.checkAuthority("CreateQuestionnaire_Save")?t.common.checkAuthority("CreateQuestionnaire_Save").name:"")+"\n              ")])],1)],1)],1)],1)],1)])],1)},a=[],n=s("3dfd"),o={data:function(){return{taskForm:{experiment_id:this.$route.params.id,name:null,questionnaire:{name:null,type:1,description:null,qItems:[]}},paperCreatorAccount:null}},components:{"questionnaire-paper":n["a"]},computed:{},mounted:function(){},methods:{submitSave:function(t){var e=this;this.$refs[t].validate(function(t){if(!t)return!1;e.axios.post("".concat(e.common.basePath,"/task/save/questionnaire"),e.taskForm).then(function(t){e.$message("保存成功"),e.$router.go(-1)}).catch(function(t){e.$message.error(t)})})}}},r=o,l=(s("1b64"),s("2877")),u=Object(l["a"])(r,i,a,!1,null,null,null);u.options.__file="CreateQuestionnaire.vue";e["default"]=u.exports},da38:function(t,e,s){},da46:function(t,e,s){"use strict";var i=s("da38"),a=s.n(i);a.a}}]);
//# sourceMappingURL=chunk-7249.c333d677.js.map