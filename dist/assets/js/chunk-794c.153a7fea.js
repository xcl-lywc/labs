(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-794c"],{1044:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content-wrap-box"},[a("el-card",{staticClass:"title-card"},[a("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[e._v("用户管理")])],1)],1),a("div",{staticClass:"router-view-wrap"},[a("div",{staticClass:"router-view-content"},[e.common.checkAuthority("UserList-list",!0)?a("div",[a("el-form",{ref:"searchForm",attrs:{model:e.searchForm,"label-width":"120px"}},[a("el-row",[e.common.checkAuthorityTree("Faculty-tree")?a("el-col",{attrs:{span:8}},[e.facultyTreeData?a("el-form-item",{attrs:{label:"系别："}},[a("el-cascader",{staticClass:"fill-width",attrs:{options:e.facultyTreeData,props:e.facultyProps,"change-on-select":"",placeholder:"请选择系别"},model:{value:e.facultyChoosed,callback:function(t){e.facultyChoosed=t},expression:"facultyChoosed"}})],1):e._e()],1):e._e(),e.common.checkAuthorityTree("RoleList-listRole")?a("el-col",{attrs:{span:8}},[a("el-form-item",{attrs:{label:"角色："}},[a("el-select",{staticClass:"fill-width",attrs:{placeholder:"请选择角色"},model:{value:e.searchForm.roles,callback:function(t){e.$set(e.searchForm,"roles",t)},expression:"searchForm.roles"}},e._l(e.roleListData,function(e,t){return a("el-option",{key:"角色"+t,attrs:{value:e.id,label:e.role_name}})}))],1)],1):e._e(),a("el-col",{attrs:{span:8}},[a("el-form-item",{attrs:{label:"工号/学号："}},[a("el-input",{staticClass:"fill-width",attrs:{placeholder:"请输入学号"},model:{value:e.searchForm.account,callback:function(t){e.$set(e.searchForm,"account",t)},expression:"searchForm.account"}})],1)],1),a("el-col",{attrs:{span:8}},[a("el-form-item",{attrs:{label:"姓名："}},[a("el-input",{staticClass:"fill-width",attrs:{placeholder:"请输入姓名"},model:{value:e.searchForm.name,callback:function(t){e.$set(e.searchForm,"name",t)},expression:"searchForm.name"}})],1)],1),a("el-col",{attrs:{span:8}},[a("el-form-item",{attrs:{label:"入校时间："}},[a("el-date-picker",{staticClass:"fill-width",attrs:{"value-format":"timestamp",placeholder:"请选择入校时间"},model:{value:e.searchForm.admission_time,callback:function(t){e.$set(e.searchForm,"admission_time",t)},expression:"searchForm.admission_time"}})],1)],1),a("el-col",{attrs:{span:8}},[a("el-form-item",{attrs:{label:"年级：",prop:"grade_num"}},[a("el-input",{attrs:{type:"number"},model:{value:e.searchForm.grade_num,callback:function(t){e.$set(e.searchForm,"grade_num",t)},expression:"searchForm.grade_num"}},[a("template",{slot:"append"},[e._v("届")])],2)],1)],1),a("el-col",{attrs:{span:8}},[a("el-form-item",{attrs:{label:" "}},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.getUserList("init")}}},[e._v("搜索")]),a("el-button",{attrs:{type:"default"},on:{click:e.clearSearchForm}},[e._v("重置")])],1)],1)],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.tableLoading,expression:"tableLoading"}],ref:"personMultipleTable",attrs:{data:e.tableData.rows,"row-key":e.getRowKeys},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55","reserve-selection":!0}}),a("el-table-column",{attrs:{label:"姓名",prop:"user_name",width:"120","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"性别",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.common.transferGender(t.row.sex)))]}}])}),a("el-table-column",{attrs:{label:"工号/学号",prop:"account",width:"150"}}),a("el-table-column",{attrs:{label:"院系",prop:"faculties_name",width:"150"}}),a("el-table-column",{attrs:{label:"年级",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.grade_num?t.row.grade_num+"届":""))]}}])}),a("el-table-column",{attrs:{label:"班级",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.class_num?t.row.class_num+"班":""))]}}])}),a("el-table-column",{attrs:{label:"手机",prop:"phone_num",width:"120","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"邮箱",prop:"mail",width:"250","show-overflow-tooltip":""}}),e._v("transferPersonStatus\n          "),a("el-table-column",{attrs:{label:"状态",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.common.transferPersonStatus(t.row.cur_status)))]}}])}),a("el-table-column",{attrs:{label:"操作",width:"320",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"default",size:"mini",disabled:!e.common.checkAuthority("UserList-detail",!0)},on:{click:function(a){e.showUserDetail(t.row)}}},[e._v("查看")]),a("el-button",{attrs:{type:"primary",size:"mini",disabled:!e.common.checkAuthority("UserList-edit",!0)},on:{click:function(a){e.showPersonDialog("edit",t.row)}}},[e._v("编辑")]),a("el-button",{attrs:{type:"warning",size:"mini",disabled:!e.common.checkAuthority("UserList-reset",!0)},on:{click:function(a){e.validateUser(t.row)}}},[e._v("重置密码")]),a("el-button",{attrs:{type:"danger",size:"mini",disabled:!e.common.checkAuthority("UserList-delete",!0)},on:{click:function(a){e.deleteUser(t.row)}}},[e._v("删除")])]}}])})],1)],1):a("div",{staticClass:"text-center text-info"},[e._v(" 你无权查看此内容 ")])]),e.common.checkAuthority("UserList-list",!0)?a("div",{staticClass:"router-view-bottom"},[a("div",[a("el-button",{attrs:{disabled:e.multipleSelection.length<=0||!e.common.checkAuthority("UserList-editStatus",!0),type:"primary",size:"mini"},on:{click:function(t){e.multiUpdateClicked("cur_status")}}},[e._v("编辑状态")]),a("el-button",{attrs:{disabled:e.multipleSelection.length<=0||!e.common.checkAuthority("UserList-transe",!0)||!e.common.checkAuthorityTree("Faculty-tree"),type:"primary",size:"mini"},on:{click:function(t){e.multiUpdateClicked("faculty")}}},[e._v("转院系")]),a("el-button",{attrs:{disabled:e.multipleSelection.length<=0||!e.common.checkAuthority("UserList-setTime",!0),type:"primary",size:"mini"},on:{click:function(t){e.multiUpdateClicked("admissionTime")}}},[e._v("设定入学时间")]),a("el-button",{attrs:{type:"success",size:"mini",disabled:!e.common.checkAuthority("UserList-import",!0)},on:{click:function(t){e.pageNum=1,e.importType("judge")}}},[e._v("导入人员")]),a("el-button",{attrs:{type:"success",size:"mini",disabled:!e.common.checkAuthority("UserList-add",!0)},on:{click:function(t){e.showPersonDialog("add")}}},[e._v("添加人员")])],1),a("el-pagination",{attrs:{background:"",layout:"total, sizes, prev, pager, next","current-page":e.pageNum,"page-size":e.pageSize,total:e.tableData.total},on:{"size-change":e.pageSizeChange,"current-change":e.pageCurrentChange}})],1):a("div",{staticClass:"router-view-bottom"}),a("el-dialog",{attrs:{visible:e.dialogDetailVisible,title:"用户信息"},on:{"update:visible":function(t){e.dialogDetailVisible=t}}},[a("el-form",[e.personForm.head_img?a("el-form-item",{attrs:{label:"头像："}},[a("img",{attrs:{height:"100",src:e.common.filePath+e.personForm.head_img}})]):e._e(),a("el-form-item",{attrs:{label:"姓名："}},[e._v(e._s(e.tempUserDetail.user_name))]),a("el-form-item",{attrs:{label:"性别："}},[e._v(e._s(e.common.transferGender(e.tempUserDetail.sex)))]),a("el-form-item",{attrs:{label:"年级："}},[e._v(e._s(e.tempUserDetail.grade_num)+"届")]),a("el-form-item",{attrs:{label:"班级："}},[e._v(e._s(e.tempUserDetail.class_name)+"班")]),a("el-form-item",{attrs:{label:"入校时间："}},[e._v(e._s(e.common._convertDate(e.tempUserDetail.admission_time,"yyyy年MM月dd日")))]),a("el-form-item",{attrs:{label:"账号："}},[e._v(e._s(e.tempUserDetail.account))]),a("el-form-item",{attrs:{label:"院系："}},[e._v(e._s(e.tempUserDetail.faculties_name))]),a("el-form-item",{attrs:{label:"手机："}},[e._v(e._s(e.tempUserDetail.phone_num))]),a("el-form-item",{attrs:{label:"邮箱："}},[e._v(e._s(e.tempUserDetail.mail))])],1)],1),a("el-dialog",{attrs:{visible:e.dialogEditVisible,title:e.title[e.tempType]},on:{"update:visible":function(t){e.dialogEditVisible=t}}},[a("el-form",{ref:"editForm",attrs:{model:e.editForm,"label-width":"100px"}},["cur_status"==e.tempType?a("el-form-item",{attrs:{label:"状态："}},[a("el-select",{staticClass:"fill-width",attrs:{placeholder:"请选择状态"},model:{value:e.editForm.cur_status,callback:function(t){e.$set(e.editForm,"cur_status",t)},expression:"editForm.cur_status"}},e._l(e.common.personStatus,function(e,t){return a("el-option",{key:"人员状态"+t,attrs:{value:e.value,label:e.label}})}))],1):e._e(),"faculty"==e.tempType?a("el-form-item",{attrs:{label:"院系："}},[a("el-cascader",{staticClass:"fill-width",attrs:{options:e.facultyTreeData,props:e.facultyProps,"change-on-select":""},model:{value:e.editForm.faculties_ids,callback:function(t){e.$set(e.editForm,"faculties_ids",t)},expression:"editForm.faculties_ids"}})],1):e._e(),"admissionTime"==e.tempType?a("el-form-item",{attrs:{label:"入学时间："}},[a("el-date-picker",{staticClass:"fill-width",attrs:{"value-format":"timestamp",placeholder:"请选择入学时间"},model:{value:e.editForm.admissionTime,callback:function(t){e.$set(e.editForm,"admissionTime",t)},expression:"editForm.admissionTime"}})],1):e._e()],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogEditVisible=!1}}},[e._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.submitForm("editForm")}}},[e._v("确 定")])],1)],1),a("el-dialog",{attrs:{visible:e.dialogImportVisible,title:"导入人员"},on:{"update:visible":function(t){e.dialogImportVisible=t}}},[a("el-form",{ref:"importForm",attrs:{model:e.importForm,"label-width":"90px",rules:e.importRules}},[a("el-form-item",{attrs:{label:"角色：",prop:"role_id"}},[a("el-select",{staticClass:"fill-width",attrs:{placeholder:"请先选择角色后再上传文件"},model:{value:e.importForm.role_id,callback:function(t){e.$set(e.importForm,"role_id",t)},expression:"importForm.role_id"}},e._l(e.roleListData,function(e,t){return a("el-option",{key:"角色导入"+t,attrs:{value:e.id,label:e.role_name}})}))],1),a("el-form-item",{attrs:{label:"文件：",prop:"file"}},[e.importForm.file?a("el-tag",[a("a",{attrs:{href:""+e.common.publicBasePath+e.tag.path,target:"_blank"}},[e._v(e._s(e.importForm.file.name))])]):e._e(),a("upload",{attrs:{isDisabled:!e.importForm.role_id,url:"/user/import/user",data:{role_id:e.importForm.role_id},buttonText:"上传人员表格并提交",fileTypes:["xls","xlsx"],showSuccessNotice:!0},on:{uploadSuccess:e.uploadSuccess}}),a("el-button",{attrs:{type:"text",icon:"el-icon-download"},on:{click:e.downloadTemplate}},[e._v("下载模版")])],1)],1)],1),a("el-dialog",{attrs:{visible:e.dialogTabVisible,title:"处理用户数据",width:"1250px","close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.dialogTabVisible=t},close:e.delcache}},[a("el-tabs",{on:{"tab-click":e.handleTabClick},model:{value:e.activeTabName,callback:function(t){e.activeTabName=t},expression:"activeTabName"}},[a("el-tab-pane",{attrs:{label:"错误导入",name:"3"}},[a("span",[e._v("系统获取表格信息检测到数据缺失、数据格式错误或者无法处理的异常，请查证下面的信息，补全修改后保存。")]),a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.importTableData.rows,stripe:"","min-height":"500"}},[a("el-table-column",{attrs:{label:"姓名",prop:"user_name",width:"100","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"性别",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.common.transferGender(t.row.sex)))]}}])}),a("el-table-column",{attrs:{label:"工号/学号",prop:"account",width:"150"}}),a("el-table-column",{attrs:{label:"院系",prop:"faculties_name",width:"150"}}),a("el-table-column",{attrs:{label:"年级",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.grade_num?t.row.grade_num+"届":""))]}}])}),a("el-table-column",{attrs:{label:"班级",width:"90"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.class_num?t.row.class_num+"班":""))]}}])}),a("el-table-column",{attrs:{label:"手机",prop:"phone_num",width:"120","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"邮箱",prop:"mail",width:"100","show-overflow-tooltip":""}}),e._v("transferPersonStatus\n            "),a("el-table-column",{attrs:{label:"状态",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.common.transferPersonStatus(t.row.cur_status)))]}}])}),a("el-table-column",{attrs:{label:"信息",width:"150",prop:"message"}})],1)],1),a("el-tab-pane",{attrs:{label:"重复导入",name:"2"}},[a("span",[e._v("当前用户列表已有以下用户；请检查用户信息是否发生变化，如果变化，请替换；如果未发生变化，请保留；如果不确定，可以不处理，待与用户核对信息后，根据实际情况处理。")]),a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.importTableData.rows,stripe:""}},[a("el-table-column",{attrs:{type:"expand",label:"#"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("p",{staticClass:"conflicting-title"},[e._v(e._s(t.row.user_name)),a("span",[e._v("的冲突数据列表：")])]),a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.row.conflictingUsers,border:"","row-class-name":"warning-row"}},[a("el-table-column",{attrs:{label:"序号",type:"index",width:"55",fixed:""}}),a("el-table-column",{attrs:{label:"姓名",prop:"user_name",width:"100","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"性别",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.common.transferGender(t.row.sex)))]}}])}),a("el-table-column",{attrs:{label:"工号/学号",prop:"account",width:"100"}}),a("el-table-column",{attrs:{label:"院系",prop:"faculties_name",width:"150"}}),a("el-table-column",{attrs:{label:"年级",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.grade_num?t.row.grade_num+"届":""))]}}])}),a("el-table-column",{attrs:{label:"班级",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.class_num?t.row.class_num+"班":""))]}}])}),a("el-table-column",{attrs:{label:"手机",prop:"phone_num",width:"120","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"邮箱",prop:"mail",width:"100","show-overflow-tooltip":""}}),e._v("transferPersonStatus\n                  "),a("el-table-column",{attrs:{label:"状态",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.common.transferPersonStatus(t.row.cur_status)))]}}])}),a("el-table-column",{attrs:{label:"信息",width:"150",prop:"message"}}),a("el-table-column",{attrs:{label:"操作",width:"80",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(o){return[a("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(a){e.resolved(o.row,t.row.id)}}},[e._v("替 换")])]}}])})],1)]}}])}),a("el-table-column",{attrs:{label:"姓名",prop:"user_name",width:"100","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"性别",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.common.transferGender(t.row.sex)))]}}])}),a("el-table-column",{attrs:{label:"工号/学号",prop:"account",width:"100"}}),a("el-table-column",{attrs:{label:"院系",prop:"faculties_name",width:"150"}}),a("el-table-column",{attrs:{label:"年级",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.grade_num?t.row.grade_num+"届":""))]}}])}),a("el-table-column",{attrs:{label:"班级",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.class_num?t.row.class_num+"班":""))]}}])}),a("el-table-column",{attrs:{label:"手机",prop:"phone_num",width:"120","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"邮箱",prop:"mail",width:"100","show-overflow-tooltip":""}}),e._v("transferPersonStatus\n            "),a("el-table-column",{attrs:{label:"状态",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.common.transferPersonStatus(t.row.cur_status)))]}}])}),a("el-table-column",{attrs:{label:"信息",width:"150",prop:"message"}}),a("el-table-column",{attrs:{label:"操作",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(a){e.resolved(t.row,t.row.id)}}},[e._v("保 留")])]}}])})],1)],1),a("el-tab-pane",{attrs:{label:"待导入",name:"1"}},[a("span",[e._v("请注意检查学号、邮件等信息格式是否错误。")]),a("el-table",{ref:"personImportMultipleTable",staticStyle:{width:"100%"},attrs:{data:e.importTableData.rows,stripe:"","row-key":e.getRowImportKeys},on:{"selection-change":e.handleSelectionImportChange}},[a("el-table-column",{attrs:{type:"selection",width:"55",fixed:"","reserve-selection":!0}}),a("el-table-column",{attrs:{label:"姓名",prop:"user_name",width:"100","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"性别",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.common.transferGender(t.row.sex)))]}}])}),a("el-table-column",{attrs:{label:"工号/学号",prop:"account",width:"150"}}),a("el-table-column",{attrs:{label:"院系",prop:"faculties_name",width:"150"}}),a("el-table-column",{attrs:{label:"年级",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.grade_num?t.row.grade_num+"届":""))]}}])}),a("el-table-column",{attrs:{label:"班级",width:"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.class_num?t.row.class_num+"班":""))]}}])}),a("el-table-column",{attrs:{label:"手机",prop:"phone_num",width:"120","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"邮箱",prop:"mail",width:"100","show-overflow-tooltip":""}}),e._v("transferPersonStatus\n            "),a("el-table-column",{attrs:{label:"状态",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.common.transferPersonStatus(t.row.cur_status)))]}}])}),a("el-table-column",{attrs:{label:"信息",width:"150",prop:"message"}}),a("el-table-column",{attrs:{label:"操作",width:"100",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(a){e.showPersonDialog("correcting-edit",t.row)}}},[e._v("编辑")])]}}])})],1),a("el-button",{staticClass:"mart10",attrs:{type:"primary",size:"mini",disabled:0===this.adjustData.length},on:{click:e.keep}},[e._v("批量保存")])],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-pagination",{attrs:{background:"",layout:"total, sizes, prev, pager, next","current-page":e.pageNum,"page-size":e.pageSize,total:e.importTableData.total},on:{"size-change":e.pageSizeImportChange,"current-change":e.pageCurrentImportChange}})],1)],1),a("el-dialog",{attrs:{visible:e.dialogPersonVisible,title:"用户",width:"800px"},on:{"update:visible":function(t){e.dialogPersonVisible=t}}},[a("el-form",{ref:"personForm",attrs:{model:e.personForm,rules:e.rules,"label-width":"120px"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"姓名：",prop:"user_name"}},[a("el-input",{model:{value:e.personForm.user_name,callback:function(t){e.$set(e.personForm,"user_name",t)},expression:"personForm.user_name"}})],1),a("el-form-item",{attrs:{label:"工号/学号：",prop:"account"}},[a("el-input",{attrs:{disabled:"edit"==e.operateType},model:{value:e.personForm.account,callback:function(t){e.$set(e.personForm,"account",t)},expression:"personForm.account"}})],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"头像：",prop:"head_img"}},[a("crop-avatar",{attrs:{fileTypes:["png","jpg"],size:"mini",avatar:e.personForm.head_img},on:{uploadSuccess:e.uploadAvatarSuccess}})],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"年级：",prop:"grade_num"}},[a("el-input",{attrs:{type:"number"===typeof e.personForm.grade_num?"number":""},model:{value:e.personForm.grade_num,callback:function(t){e.$set(e.personForm,"grade_num",t)},expression:"personForm.grade_num"}},[a("template",{slot:"append"},[e._v("届")])],2)],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"班级：",prop:"class_num"}},[a("el-input",{attrs:{type:"number"===typeof e.personForm.class_num?"number":""},model:{value:e.personForm.class_num,callback:function(t){e.$set(e.personForm,"class_num",t)},expression:"personForm.class_num"}},[a("template",{slot:"append"},[e._v("班")])],2)],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"性别：",prop:"sex"}},[a("el-select",{staticClass:"fill-width",model:{value:e.personForm.sex,callback:function(t){e.$set(e.personForm,"sex",t)},expression:"personForm.sex"}},[a("el-option",{attrs:{value:1,label:"男"}}),a("el-option",{attrs:{value:2,label:"女"}})],1)],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"入校时间：",prop:"admission_time"}},[a("el-date-picker",{staticClass:"fill-width",attrs:{"value-format":"timestamp",placeholder:"请选择入学时间"},model:{value:e.personForm.admission_time,callback:function(t){e.$set(e.personForm,"admission_time",t)},expression:"personForm.admission_time"}})],1)],1),a("el-col",{attrs:{span:24}},[e.common.checkAuthorityTree("Faculty-tree")?a("el-form-item",{attrs:{label:"院系：",prop:"faculties_ids"}},[a("el-cascader",{staticClass:"fill-width",attrs:{options:e.facultyTreeData,props:e.facultyProps,"change-on-select":""},model:{value:e.personForm.faculties_ids,callback:function(t){e.$set(e.personForm,"faculties_ids",t)},expression:"personForm.faculties_ids"}})],1):e._e()],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"手机：",prop:"phone_num"}},[a("el-input-number",{staticClass:"fill-width text-left-penetrate",attrs:{min:0,controls:!1},model:{value:e.personForm.phone_num,callback:function(t){e.$set(e.personForm,"phone_num",t)},expression:"personForm.phone_num"}})],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"邮箱：",prop:"mail"}},[a("el-input",{attrs:{type:"email"},model:{value:e.personForm.mail,callback:function(t){e.$set(e.personForm,"mail",t)},expression:"personForm.mail"}})],1)],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"简介：",prop:"sim_desc"}},[a("el-input",{attrs:{type:"textarea",autosize:{minRows:2,maxRows:4}},model:{value:e.personForm.sim_desc,callback:function(t){e.$set(e.personForm,"sim_desc",t)},expression:"personForm.sim_desc"}})],1)],1)],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogPersonVisible=!1}}},[e._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.submitPersonForm}},[e._v("确 定")])],1)],1)],1)],1)},s=[],l=(a("7f7f"),a("d443")),r=a("9556"),i=a("ef95"),n={components:{upload:l["a"],UploadAvatar:r["a"],CropAvatar:i["a"]},data:function(){var e=this,t=function(e,t,a){t?/^1[34578]\d{9}$/.test(t)?a():a(new Error("请输入正确的手机号码")):a(new Error("请输入手机号码"))};return{getRowKeys:function(e){return e.id},getRowImportKeys:function(e){return e.num},roleListData:[],searchForm:{},facultyChoosed:[],pageNum:1,pageSize:10,tableLoading:!1,tableData:{rows:[],total:0},multipleSelection:[],dialogDetailVisible:!1,tempUserDetail:0,title:{cur_status:"编辑状态",faculty:"转院系",admissionTime:"设定入学时间"},tempType:"cur_status",dialogEditVisible:!1,editForm:{cur_status:null,faculties_ids:[],admissionTime:null},facultyTreeData:null,facultyProps:{children:"childrens",label:"faculty",value:"id"},dialogImportVisible:!1,importForm:{role_id:null,file:null},importRules:{role_id:[{required:!0,message:"请选择用户",trigger:"change"}],file:[{required:!0,message:"请上传文件",trigger:"change"}]},uploadUrl:"/user/import",fileList:[],dialogTabVisible:!1,activeTabName:"3",importUserType:3,importTableData:{rows:[],total:0},adjustData:[],operateType:"new",dialogPersonVisible:!1,personForm:{head_img:null,user_name:null,account:null,sex:null,admission_time:null,faculties_ids:[],phone_num:void 0,mail:null,grade_num:null,class_num:null,sim_desc:null},rules:{user_name:[{required:!0,message:"请输入用户名",trigger:"blur"}],account:[{required:!0,message:"请输入工号/学号",trigger:"blur"}],faculties_ids:[{required:!0,message:"请选择院系",trigger:"change"}],phone_num:[{required:!0,validator:t,trigger:"blur"}],mail:[{type:"email",message:"请输入正确的邮箱地址",trigger:"blur"}],sim_desc:[{validator:function(t,a,o){e.common.wordNumberValid(t,a,o,"textarea")},trigger:"blur"}]}}},mounted:function(){this.common.checkAuthority("UserList-list",!0)&&(this.initRoleList(),this.initFacultyTree(),this.getUserList("init"))},methods:{downloadTemplate:function(){var e=this;this.axios.get("".concat(this.common.basePath,"/home/import/template"),{responseType:"blob",params:{}}).then(function(t){e.common._fileBold(t),e.$message.success("下载成功")}).catch(function(t){e.$message.error(t)})},initRoleList:function(){var e=this;this.pageLoading=!0;var t={method:"get",url:"".concat(this.common.basePath,"/roles/list/public")};this.axios(t).then(function(t){e.roleListData=t.data.data,e.pageLoading=!1}).catch(function(t){e.pageLoading=!1,e.$message.error(t)})},initFacultyTree:function(){var e=this;this.pageLoading=!0;var t={method:"get",url:"".concat(this.common.basePath,"/faculty/tree")};this.axios(t).then(function(t){e.facultyTreeData=t.data.data,e.activeNode=t.data.data[0].id,e.pageLoading=!1}).catch(function(t){e.pageLoading=!1,e.$message.error(t)})},getUserList:function(e){var t=this;this.tableLoading=!0,"init"==e&&(this.$refs.personMultipleTable.clearSelection(),this.pageNum=1,this.pageSize=10);var a=this.searchForm;a.pageNum=this.pageNum,a.pageSize=this.pageSize,this.facultyChoosed.length>0&&(a.faculty=this.facultyChoosed[this.facultyChoosed.length-1]);var o={method:"post",url:"".concat(this.common.basePath,"/user/list"),data:a};""===o.data.grade_num&&delete o.data.grade_num,this.axios(o).then(function(e){t.tableData=e.data.data,t.$nextTick(function(e){t.tableLoading=!1})}).catch(function(e){t.tableLoading=!1,t.$message.error(e)})},clearSearchForm:function(){this.searchForm={},this.facultyChoosed=[]},showUserDetail:function(e){this.tempUserDetail=e,this.dialogDetailVisible=!0},deleteUser:function(e){var t=this,a={method:"delete",url:"".concat(this.common.basePath,"/user/delete"),data:{user_id:[e.id]}};this.$confirm("当前删除的内容将无法找回","确认删除?",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(e){t.tableLoading=!0,t.axios(a).then(function(e){t.$message.success(e.data.meta.message),t.getUserList("init"),t.$nextTick(function(e){t.tableLoading=!1})}).catch(function(e){t.tableLoading=!1,t.$message.error(e)})}).catch(function(e){})},validateUser:function(e){var t=this;this.$prompt('<span><i class="required-label"></i>请输入当前用户的密码</span>',"重置密码",{confirmButtonText:"确定",cancelButtonText:"取消",dangerouslyUseHTMLString:!0,inputValidator:function(e){return!!e||(t.$message.error("请检查表单填写是否正确"),!1)},inputErrorMessage:"请输入密码"}).then(function(a){var o=a.value,s={method:"get",url:"".concat(t.common.basePath,"/user/check"),params:{id:JSON.parse(sessionStorage.getItem("Access-Key"))||null,password:o}};t.axios(s).then(function(a){t.resetPassword(e)}).catch(function(e){t.$message.error(e)})}).catch(function(e){})},resetPassword:function(e){var t=this;this.tableLoading=!0;var a={method:"get",url:"".concat(this.common.basePath,"/user/reset/password"),params:{user_id:e.id}};this.axios(a).then(function(e){t.$message.success("重置成功"),t.getUserList("init"),t.$nextTick(function(e){t.tableLoading=!1})}).catch(function(e){t.tableLoading=!1,t.$message.error(e)})},handleNodeClick:function(e,t){this.activeNode=e.id},pageSizeChange:function(e){this.pageSize=e,this.getUserList()},pageCurrentChange:function(e){this.pageNum=e,this.getUserList()},handleSelectionChange:function(e){this.multipleSelection=e},multiUpdateClicked:function(e){this.dialogEditVisible=!0,this.tempType=e,this.editForm={cur_status:null,faculties_ids:[],admissionTime:null}},submitForm:function(e){var t=this,a={method:"patch",url:"".concat(this.common.basePath,"/user/update/status"),data:this[e]};a.data.user_id=this.multipleSelection.map(function(e){return e.id}),a.data.faculty=this[e].faculties_ids[this[e].faculties_ids.length-1],delete a.data.faculties_ids,this.tableLoading=!0,this.axios(a).then(function(e){t.dialogEditVisible=!1,t.$message.success(e.data.meta.message),t.getUserList("init"),t.$nextTick(function(e){t.tableLoading=!1})}).catch(function(e){t.dialogEditVisible=!1,t.tableLoading=!1,t.$message.error(e)})},importType:function(e){var t=this;"judge"==e?this.axios.get("".concat(this.common.basePath,"/user/import/cache"),{params:{pageNum:this.pageNum,pageSize:this.pageSize,type:this.importUserType}}).then(function(e){e.data.data.role_id?(t.dialogTabVisible=!0,t.$refs.personImportMultipleTable&&t.$refs.personImportMultipleTable.clearSelection(),t.importTableData.rows=e.data.data.rows,t.importTableData.total=e.data.data.total):t.showImport()}).catch(function(e){t.$message.error(e)}):"refresh"==e&&this.axios.get("".concat(this.common.basePath,"/user/import/cache"),{params:{pageNum:this.pageNum,pageSize:this.pageSize,type:this.importUserType}}).then(function(e){t.importTableData.rows=e.data.data.rows,t.importTableData.total=e.data.data.total}).catch(function(e){t.$message.error(e)})},openDataDialog:function(){},showImport:function(){var e=this;this.dialogImportVisible=!0,this.$nextTick(function(t){e.$refs.importForm.resetFields()})},uploadSuccess:function(e){this.getUserList(),this.dialogImportVisible=!1,this.importType("judge")},handleTabClick:function(e){console.log(e.name),"1"===e.name?(this.$refs.personImportMultipleTable.clearSelection(),this.pageNum=1,this.importUserType=1,this.importType("refresh")):"2"===e.name?(this.pageNum=1,this.importUserType=2,this.importType("refresh")):"3"===e.name&&(this.pageNum=1,this.importUserType=3,this.importType("refresh"))},pageSizeImportChange:function(e){this.pageSize=e,this.importType("refresh")},pageCurrentImportChange:function(e){this.pageNum=e,this.importType("refresh")},resolved:function(e,t){var a=this,o=[],s=e;s.conflictingUsers=null,s.id=t,o.push(s),this.axios.post("".concat(this.common.basePath,"/user/import/add"),o).then(function(e){a.$message.success("成功解决！"),a.importType("refresh")}).catch(function(e){a.$message.error(e)})},handleSelectionImportChange:function(e){console.log(e),this.adjustData=e},keep:function(){var e=this;this.axios.post("".concat(this.common.basePath,"/user/import/add"),this.adjustData).then(function(t){e.$message.success("校正成功！"),e.importType("refresh")}).catch(function(t){e.$message.error(t)})},delcache:function(){var e=this;this.$confirm("是否清除人员信息的高速缓存？","提示",{confirmButtonText:"清除",cancelButtonText:"暂不清除",type:"warning"}).then(function(){e.axios.get("".concat(e.common.basePath,"/user/import/delcache"),{params:{}}).then(function(t){e.getUserList(),e.$message({type:"success",message:"清除缓存成功!"})}).catch(function(t){e.$message.error(t)})}).catch(function(){e.getUserList()})},showPersonDialog:function(e,t){var a=this;this.dialogPersonVisible=!0,this.operateType=e,"add"==e?this.$nextTick(function(e){a.$refs.personForm&&a.$refs.personForm.resetFields()}):"correcting-edit"==e?(t.faculties_ids=[],this.personForm=JSON.parse(JSON.stringify(t))):this.getPersonDetail(t.id).then(function(e){a.$nextTick(function(e){a.$refs.personForm.clearValidate()})}).catch(function(e){})},getPersonDetail:function(e){var t=this,a={method:"get",url:"".concat(this.common.basePath,"/user/one/user"),params:{id:e}},o=new Promise(function(e,o){t.axios(a).then(function(a){t.personForm=a.data.data,!a.data.data.faculties_ids&&(t.personForm.faculties_ids=[]),e(a.data.meta.message)}).catch(function(e){o(e),t.$message.error(e)})});return o},uploadAvatarSuccess:function(e){this.personForm.head_img=e.path},submitPersonForm:function(){var e=this,t={method:"post",url:"".concat(this.common.basePath,"/user/add/student"),data:this.personForm};"edit"==this.operateType&&(t.url="".concat(this.common.basePath,"/user/one/up_user")),"correcting-edit"==this.operateType&&(t.url="".concat(this.common.basePath,"/user/cache/update")),this.$refs.personForm.validate(function(a){a?(t.data.faculty=e.personForm.faculties_ids[e.personForm.faculties_ids.length-1],delete t.data.faculties_ids,"correcting-edit"!=e.operateType&&(e.tableLoading=!0),e.axios(t).then(function(t){e.dialogPersonVisible=!1,e.$message.success(t.data.meta.message),"correcting-edit"!=e.operateType?e.getUserList("init"):e.importType("refresh"),e.$nextTick(function(t){"correcting-edit"!=e.operateType&&(e.tableLoading=!1)})}).catch(function(t){e.dialogPersonVisible=!1,"correcting-edit"!=e.operateType&&(e.tableLoading=!1),e.$message.error(t)})):e.$message.error("请检查表单填写是否正确")})},submitExcel:function(){var e=this,t={method:"post",url:"".concat(this.common.basePath,"/user/import/user"),data:this.importForm};this.$refs.importForm.validate(function(a){a?e.axios(t).then(function(e){}).catch(function(e){}):e.$message.error("请检查表单填写是否正确")})}}},c=n,u=(a("739b"),a("2877")),m=Object(u["a"])(c,o,s,!1,null,null,null);m.options.__file="UserList.vue";t["default"]=m.exports},"739b":function(e,t,a){"use strict";var o=a("f116"),s=a.n(o);s.a},f116:function(e,t,a){}}]);
//# sourceMappingURL=chunk-794c.153a7fea.js.map