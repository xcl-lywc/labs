(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-dfdc"],{"0788":function(e,t,s){},"566a":function(e,t,s){"use strict";var a=s("0788"),i=s.n(a);i.a},"5ec5":function(e,t,s){},e1bb:function(e,t,s){"use strict";var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("el-row",{staticClass:"mard10"},[s("el-col",{attrs:{span:24}},[e.isEdit?s("el-form-item",{attrs:{label:"试卷名称：",prop:"paperItem.name",rules:[{required:!0,message:"请输入试卷名称",trigger:"blur"},{validator:function(t,s,a){e.common.wordNumberValid(t,s,a,"single")},trigger:"blur"}]}},[s("el-input",{model:{value:e.paperItem.name,callback:function(t){e.$set(e.paperItem,"name",t)},expression:"paperItem.name"}})],1):s("div",{staticClass:"marl20"},[e._v("试卷名称："+e._s(e.paperItem.name))])],1),s("el-col",{staticClass:"mart20",attrs:{span:12}},[e.isEdit?s("el-form-item",{attrs:{label:"考试时间：",prop:"paperItem.exam_time",rules:[{required:!0,message:"请输入考试时间",trigger:"blur"}]}},[s("el-input",{attrs:{type:"number"},model:{value:e.paperItem.exam_time,callback:function(t){e.$set(e.paperItem,"exam_time",t)},expression:"paperItem.exam_time"}},[s("template",{slot:"append"},[e._v("分钟")])],2)],1):s("div",{staticClass:"marl20"},[e._v("考试时间："+e._s(e.paperItem.exam_time)+"分钟")])],1),s("el-col",{staticClass:"mart20",attrs:{span:12}},[e.isEdit?s("el-form-item",{attrs:{label:"总分："}},[e._v("  \n      \t"+e._s(e.totalScore)+"分\n      ")]):s("div",{staticClass:"marl20"},[e._v("总分："+e._s(e.totalScore))])],1),e.paperItem.id&&e.isEdit?s("el-col",{staticClass:"mart10 marb20 text-right",attrs:{span:24}},[s("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.savePaperName}},[e._v("保存")])],1):e._e()],1),s("el-card",{attrs:{shadow:"never"}},[e._l(e.paperItem.questions,function(t,a){return s("div",{key:a,staticClass:"questions-box mart5"},[s("div",[e._v(e._s(a+1)+"、")]),s("el-card",{staticClass:"questions-content",attrs:{shadow:"never"}},[s("el-row",{staticClass:"mard10"},[s("el-col",{staticClass:"div-flex",attrs:{span:6}},[s("div",{staticClass:"label-2 label marr5"},[e._v("分数: ")]),e.isEdit?s("el-input",{attrs:{type:"number","auto-complete":"off"},model:{value:t.score,callback:function(s){e.$set(t,"score",e._n(s))},expression:"item.score"}}):s("div",[e._v(e._s(t.score))]),s("div",{staticClass:"label-1 label marl5"},[e._v(" 分")])],1),s("el-col",{staticClass:"text-right question-type",attrs:{offset:13,span:4}},[e._v("\n\t\t\t\t\t\t"+e._s(e.numMatchingText(t.type))+"\n\t\t\t\t\t")]),s("el-col",{staticClass:"text-right ",attrs:{span:1}},[e.isEdit?s("el-button",{attrs:{type:"danger",size:"mini",icon:"el-icon-close",circle:""},on:{click:function(t){e.del("question",a)}}}):e._e()],1)],1),s("el-row",{staticClass:"mard10"},[s("el-col",{staticClass:"div-flex",attrs:{span:18}},[s("div",{staticClass:"label-2 label marr5"},[e._v("题干: ")]),e.isEdit?s("el-input",{model:{value:t.question,callback:function(s){e.$set(t,"question",s)},expression:"item.question"}}):s("div",[e._v(e._s(t.question))])],1),s("el-col",{staticStyle:{"margin-left":"60px"},attrs:{span:22}},[e._l(t.options,function(i,n){return s("div",{directives:[{name:"show",rawName:"v-show",value:!i.isDelete,expression:"!itemOption.isDelete"}],key:n,staticClass:"div-flex mart10 flex-align-items"},[s("div",{staticClass:"label-2 label marr5"},[e._v("选项"+e._s(n+1)+": ")]),e.isEdit?s("el-input",{model:{value:i.name,callback:function(t){e.$set(i,"name",t)},expression:"itemOption.name"}}):s("div",[e._v(e._s(i.name))]),s("el-radio",{directives:[{name:"show",rawName:"v-show",value:(1==t.type||3==t.type)&&e.isEdit,expression:"(item.type == 1 || item.type == 3) && isEdit"}],staticClass:"marl5",attrs:{label:"true"},on:{change:function(s){e.changeRadioRightKey(t,n)}},model:{value:i.answer,callback:function(t){e.$set(i,"answer",t)},expression:"itemOption.answer"}},[e._v("正确")]),s("el-checkbox",{directives:[{name:"show",rawName:"v-show",value:2==t.type&&e.isEdit,expression:"item.type == 2 && isEdit"}],staticClass:"marl5",attrs:{"true-label":"true","false-label":"false"},model:{value:i.answer,callback:function(t){e.$set(i,"answer",t)},expression:"itemOption.answer"}},[e._v("正确")]),e.isEdit?s("el-button",{staticClass:"marl5",attrs:{type:"danger",size:"mini",icon:"el-icon-close",circle:""},on:{click:function(t){e.del("option",a,n)}}}):e._e()],1)}),s("el-button",{directives:[{name:"show",rawName:"v-show",value:(1==t.type||2==t.type)&&e.isEdit,expression:" (item.type == 1 || item.type == 2) && isEdit"}],staticClass:"mart10",staticStyle:{"margin-left":"65px"},attrs:{type:"primary",size:"mini"},on:{click:function(t){e.addOption(a)}}},[e._v("添加选项")]),s("div",{staticClass:"text-right"},[s("el-button",{directives:[{name:"show",rawName:"v-show",value:e.paperItem.id&&e.isEdit,expression:" paperItem.id && isEdit"}],staticClass:"mart10",attrs:{type:"primary",size:"small"},on:{click:function(s){e.saveAppointQuestion(t)}}},[e._v("保存")])],1)],2),s("el-col",{staticClass:"mart20",attrs:{span:22}},[e.isEdit?e._e():s("div",{staticStyle:{color:"#62b549"}},[e._v("\n              正确答案："+e._s(4==t.type?"无标准答案":t.optionAnswer)+"\n            ")])])],1)],1)],1)}),e.isEdit?s("div",{staticClass:"text-right mart10"},[s("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addQution("radioQuestion")}}},[e._v("添加单选题")]),s("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addQution("chekboxQuestion")}}},[e._v("添加多选题")]),s("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addQution("judgeQuestion")}}},[e._v("添加判断题")]),s("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addQution("shortAnswerQuestion")}}},[e._v("添加简答题")])],1):e._e()],2)],1)},i=[],n=(s("7f7f"),s("f751"),s("ac6a"),{props:{paperItem:{default:null},isEdit:{default:!0,required:!1}},data:function(){return{checkbox:!1,questionTemplate:{radioQuestion:{question:"我是第二道试题（单选题）",type:1,score:30,analyze:"这是我的习题解析",options:[{name:"我是第二试题的第一选项",answer:"true",isDelete:!1},{name:"我是第2试题的第二选项",answer:"false",isDelete:!1},{name:"我是第2试题的第二选项",answer:"false",isDelete:!1}]},chekboxQuestion:{question:"我是第二道试题（多选题）",type:2,score:30,analyze:"这是我的习题解析",options:[{name:"我是第二试题的第一选项",answer:"true",isDelete:!1},{name:"我是第二试题的第二选项",answer:"true",isDelete:!1}]},judgeQuestion:{question:"我是第二道试题（判断题）",type:3,score:30,analyze:"这是我的习题解析",options:[{name:"我是第二试题的第一选项",answer:"true",isDelete:!1},{name:"我是第2试题的第二选项",answer:"false",isDelete:!1}]},shortAnswerQuestion:{question:"我是第二道试题（简答选题）",type:4,score:30,analyze:"这是我的习题解析"}},questionTypeText:null}},components:{},computed:{totalScore:function(){var e=0;return this.paperItem.questions.forEach(function(t){e+=t.score}),e}},created:function(){this.convertPaperItem()},mounted:function(){},methods:{convertPaperItem:function(){var e=this.paperItem.questions;e&&e.forEach(function(e){e.optionAnswer=[],4!=e.type&&e.options.forEach(function(t,s){"true"==t.answer&&e.optionAnswer.push("选项".concat(s+1))}),e.optionAnswer=e.optionAnswer.join("、")}),Object.assign({},this.paperItem.questions,e)},numMatchingText:function(e){switch(e){case 1:return this.questionTypeText="单选题";case 2:return this.questionTypeText="多选题";case 3:return this.questionTypeText="判断题";case 4:return this.questionTypeText="简答题"}},addQution:function(e){this.paperItem.questions.push(JSON.parse(JSON.stringify(this.questionTemplate[e])))},del:function(e,t,s){"question"==e?this._delQution(t):this._delOption(t,s)},_delQution:function(e){var t=this;if(this.paperItem.questions.length<=1)return this.$message.warning("不能删除，必须存在一个题！！！"),!1;this.$confirm("确认删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(function(s){s.value;t.paperItem.questions[e].id?t._pseudoDelQution(e):t.paperItem.questions.splice(e,1),t.$message.success("删除成功，请点击保存")}).catch(function(){})},_pseudoDelQution:function(e){var t=this;this.axios.patch("".concat(this.common.basePath,"/question/delete/").concat(this.paperItem.questions[e].id),"").then(function(s){t.paperItem.questions.splice(e,1)}).catch(function(e){t.$message.error(e)})},_delOption:function(e,t){var s=this;if(1==this.paperItem.questions[e].type){if("true"==this.paperItem.questions[e].options[t].answer)return this.$message.warning("不能删除，单选题必须有一个正确答案！！！"),!1}else if(2==this.paperItem.questions[e].type&&"true"==this.paperItem.questions[e].options[t].answer){var a=0;if(this.paperItem.questions[e].options.forEach(function(e){"true"==e.answer&&a++}),a<=2)return this.$message.warning("不能删除，多选题必须有两个正确答案！！！"),!1}if(this.paperItem.questions[e].options.length<=2)return this.$message.warning("不能删除，必须存在两个选项！！！"),!1;this.$confirm("确认删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(function(a){a.value;s.paperItem.questions[e].options[t].id?s.paperItem.questions[e].options[t].isDelete=!0:s.paperItem.questions[e].options.splice(t,1),s.$message.success("删除成功，请点击保存")}).catch(function(){})},addOption:function(e){var t=JSON.parse(JSON.stringify(this.questionTemplate.radioQuestion.options[0]));t.answer=!1,this.paperItem.questions[e].options.push(t)},changeRadioRightKey:function(e,t){e.options.forEach(function(e,s){e.answer=s!=t?"false":"true"})},saveAppointQuestion:function(e){var t=this,s=null;s=e.id?"".concat(this.common.basePath,"/question/update"):"".concat(this.common.basePath,"/question/save"),e.paper_id=this.$route.params.associated_object,this.axios.post(s,e).then(function(s){t.$message.success(s.data.meta.message),t.paperDetail=s.data.data,s.data.data&&(e.id=s.data.data)}).catch(function(e){t.$message.error(e)})},getQueryQuestionById:function(e){var t=this;this.axios.get("".concat(this.common.basePath,"question/simple/").concat(e.id),"").then(function(t){e=t.data.data}).catch(function(e){t.$message.error(e)})},savePaperName:function(){var e=this;this.paperItem.name&&this.paperItem.exam_time&&this.axios.patch("".concat(this.common.basePath,"/paper/").concat(this.$route.params.associated_object),this.paperItem).then(function(t){e.$message.success(t.data.meta.message)}).catch(function(t){e.$message.error(t)})}}}),r=n,o=(s("566a"),s("2877")),l=Object(o["a"])(r,a,i,!1,null,null,null);l.options.__file="TestPaperC.vue";t["a"]=l.exports},eb77:function(e,t,s){"use strict";var a=s("5ec5"),i=s.n(a);i.a},f402:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content-wrap-box"},[s("el-card",{staticClass:"title-card"},[s("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[s("el-breadcrumb-item",{attrs:{to:{path:"/lesson/testlist"}}},[e._v("实验列表")]),s("el-breadcrumb-item",{attrs:{to:{name:"TestDetail",params:{id:e.$route.params.id}}}},[e._v("实验详情")]),s("el-breadcrumb-item",[e._v("添加习题要求")])],1)],1),s("div",{staticClass:"router-view-wrap"},[s("div",{staticClass:"router-view-content"},[s("el-form",{ref:"taskForm",attrs:{model:e.taskForm,"label-width":"120px"}},[s("el-row",[s("el-col",{attrs:{span:12}},[s("el-form-item",{attrs:{label:"任务名称：",prop:"name",rules:[{required:!0,message:"请输入任务名称",trigger:"blur"},{validator:function(t,s,a){e.common.wordNumberValid(t,s,a,"single")},trigger:"blur"}]}},[s("el-input",{model:{value:e.taskForm.name,callback:function(t){e.$set(e.taskForm,"name",t)},expression:"taskForm.name"}})],1)],1),s("el-col",{attrs:{span:12}},[s("el-form-item",{attrs:{label:"得分占比：",prop:"value",rules:[{required:!0,message:"请输入得分占比",trigger:"blur"}]}},[s("el-input",{attrs:{type:"number"},model:{value:e.taskForm.value,callback:function(t){e.$set(e.taskForm,"value",t)},expression:"taskForm.value"}},[s("template",{slot:"append"},[e._v("%")])],2)],1)],1),s("el-col",{attrs:{span:12}},[s("el-form-item",{attrs:{label:"截止时间：",prop:"end_time",rules:[{required:!0,message:"请选择截止时间",trigger:"blur"}]}},[s("el-date-picker",{attrs:{"picker-options":e.pickerOptions0,type:"datetime",placeholder:"选择日期时间","default-time":"12:00:00"},model:{value:e.taskForm.end_time,callback:function(t){e.$set(e.taskForm,"end_time",t)},expression:"taskForm.end_time"}})],1)],1),s("el-col",{attrs:{span:12}},[s("el-form-item",{attrs:{label:"通过分数：",prop:"adopt_score",rules:[{required:!0,message:"请输入通过分数",trigger:"blur"}]}},[s("el-input",{attrs:{type:"number"},model:{value:e.taskForm.adopt_score,callback:function(t){e.$set(e.taskForm,"adopt_score",t)},expression:"taskForm.adopt_score"}})],1)],1),s("el-col",{attrs:{span:24}},[s("el-form-item",{attrs:{label:"试题内容："}},[s("el-card",[s("test-parper",{attrs:{paperItem:e.taskForm.paperItem,isEdit:!0}})],1)],1)],1),s("el-col",{attrs:{span:24}},[s("el-form-item",{attrs:{label:""}},[s("el-button",{attrs:{disabled:!e.common.checkAuthority("ExerciseRequest_Save",!0),type:"primary"},on:{click:function(t){e.submitSave("taskForm")}}},[e._v("\n                "+e._s(e.common.checkAuthority("ExerciseRequest_Save")?e.common.checkAuthority("ExerciseRequest_Save").name:"")+"\n              ")])],1)],1)],1)],1)],1)])],1)},i=[],n=s("e1bb"),r={data:function(){return{pickerOptions0:{disabledDate:function(e){return e.getTime()<Date.now()}},taskForm:{experiment_id:this.$route.params.id,name:null,end_time:null,value:null,adopt_score:null,is_block:1,paperItem:{name:null,exam_time:null,questions:[]}}}},components:{"test-parper":n["a"]},mounted:function(){},methods:{submitSave:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t.axios.post("".concat(t.common.basePath,"/task/save"),t.taskForm).then(function(e){t.$message("保存成功"),t.$router.push({name:"TestDetail",params:{id:t.$route.params.id}})}).catch(function(e){t.$message.error(e)})})},submitEdit:function(){}}},o=r,l=(s("eb77"),s("2877")),c=Object(l["a"])(o,a,i,!1,null,null,null);c.options.__file="ExerciseRequest.vue";t["default"]=c.exports}}]);
//# sourceMappingURL=chunk-dfdc.0f47e855.js.map