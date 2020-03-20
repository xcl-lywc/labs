(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1923"],{"2d78":function(t,e,o){},"94e6":function(t,e,o){"use strict";o.r(e);var i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"content-wrap-box",on:{scroll:t.handleScroll}},[o("el-card",{staticClass:"title-card"},[o("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[o("el-breadcrumb-item",[t._v("角色管理")])],1)],1),o("div",{staticClass:"router-view-wrap"},[o("div",{directives:[{name:"loading",rawName:"v-loading",value:t.pageLoading,expression:"pageLoading"}],staticClass:"router-view-content"},[t.common.checkAuthority("RoleList-listRole",!0)?o("el-row",{staticClass:"padding-row"},[o("el-col",{attrs:{span:7}},[o("div",[o("el-button",{staticClass:"fill-width",attrs:{type:"primary",size:"mini",disabled:!t.common.checkAuthority("RoleList-addRole",!0)},on:{click:t.addRoleButtonClicked}},[t._v("添加角色")])],1),o("ul",{staticClass:"left-ul"},t._l(t.roleListData,function(e,i){return o("el-popover",{key:i+"角色",attrs:{placement:"right",width:"100",title:e.role_name,trigger:"hover"}},[o("div",[o("el-button",{attrs:{type:"primary",size:"mini",disabled:!t.common.checkAuthority("RoleList-editRole",!0)},on:{click:function(o){o.stopPropagation(),t.editRoleButtonClicked(e)}}},[t._v("编辑")]),o("el-button",{attrs:{type:"danger",size:"mini",disabled:!t.common.checkAuthority("RoleList-deleteRole",!0)},on:{click:function(o){o.stopPropagation(),t.deleteRoleButtonClicked(e)}}},[t._v("删除")])],1),o("li",{class:{"active-li":t.activeRole==e.id},attrs:{slot:"reference"},on:{click:function(o){t.roleListClicked(e)}},slot:"reference"},[o("span",{class:{"text-primary":t.activeRole==e.id}},[t._v(t._s(e.role_name))])])])}))]),t.common.checkAuthority("RoleList-tree",!0)?o("el-col",{attrs:{span:17}},[o("el-button",{staticClass:"fr",class:{showFixed:t.overScroll},attrs:{type:"primary",size:"mini",disabled:!t.common.checkAuthority("RoleList-treeEdit",!0)},on:{click:t.saveAuthority}},[t._v("保存权限")]),o("h3",{staticClass:"mart0"},[t._v("角色权限树"),o("small",{staticClass:"text-info marl10"},[t._v("未勾选必要权限"),o("i",{staticClass:"fa fa-sitemap text-warning marl10 marr10"}),t._v("时将不显示其整个功能模块")])]),o("el-tree",{ref:"Authoritytree",attrs:{data:t.authorityTreeData,props:t.defaultProps,"node-key":"id","show-checkbox":""},on:{check:t.treeSelectChanged},scopedSlots:t._u([{key:"default",fn:function(e){e.node;var i=e.data;return o("span",{},[t._v(t._s(i.name)),3==i.type?o("i",{staticClass:"fa fa-sitemap text-warning marl10"}):t._e()])}}])})],1):o("el-col",{staticClass:"text-center text-info",attrs:{span:17}},[t._v("你无权查看此内容")])],1):o("div",{staticClass:"text-center text-info"},[t._v(" 你无权查看此内容 ")])],1),o("div",{staticClass:"router-view-bottom"},[t.common.checkAuthority("RoleList-listRole",!0)?t._e():o("div")]),o("el-dialog",{attrs:{title:"角色",visible:t.dialogRoleVisible,width:"50vw"},on:{"update:visible":function(e){t.dialogRoleVisible=e}}},[o("el-form",{ref:"roleForm",attrs:{model:t.roleForm,"label-width":"100px",rules:t.rules}},[o("el-form-item",{attrs:{label:"角色名称：",prop:"role_name"}},[o("el-input",{model:{value:t.roleForm.role_name,callback:function(e){t.$set(t.roleForm,"role_name",e)},expression:"roleForm.role_name"}})],1)],1),o("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(e){t.dialogRoleVisible=!1}}},[t._v("取消")]),o("el-button",{attrs:{type:"primary"},on:{click:t.submitRoleForm}},[t._v("确 定")])],1)],1)],1),t._v("\n  "+t._s(t.defaultProps)+"\n")],1)},a=[],s=(o("6b54"),o("4328")),r=o.n(s),n={data:function(){return{pageLoading:!1,roleListData:[],authorityTreeData:[],defaultProps:{children:"children",label:"name"},activeRole:null,tempId:null,dialogRoleVisible:!1,roleForm:{role_name:null},rules:{role_name:[{required:!0,message:"请输入角色名称",trigger:"blur"}]},overScroll:!1}},watch:{activeRole:{handler:function(t,e){t&&this.getAuthorityList(t)},deep:!0}},mounted:function(){this.common.checkAuthority("RoleList-listRole",!0)&&(this.initRoleList(),this.common.checkAuthority("RoleList-tree",!0)&&this.getAuthorityTree())},methods:{initRoleList:function(){var t=this;this.pageLoading=!0;var e={method:"get",url:"".concat(this.common.basePath,"/roles/list")};this.axios(e).then(function(e){t.roleListData=e.data.data,t.activeRole=e.data.data[0].id,t.common.checkAuthority("RoleList-tree",!0)&&t.getAuthorityList(e.data.data[0].id),t.pageLoading=!1}).catch(function(e){t.pageLoading=!1,t.$message.error(e)})},roleListClicked:function(t){this.activeRole=t.id},addRoleButtonClicked:function(){this.operateType="new",this.roleForm={code:parseInt(1e4*Math.random()),role_name:null},this.dialogRoleVisible=!0,this.clearForm()},editRoleButtonClicked:function(t){this.operateType="edit";var e=JSON.parse(JSON.stringify(t));this.roleForm={code:parseInt(1e4*Math.random()),role_name:e.role_name,id:e.id},this.dialogRoleVisible=!0,this.clearForm()},clearForm:function(){var t=this;this.$nextTick(function(e){t.$refs.roleForm.clearValidate()})},deleteRoleButtonClicked:function(t){var e=this;this.$confirm("删除后需要重新添加","确认删除?",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(o){var i={method:"delete",url:"".concat(e.common.basePath,"/roles/delete"),params:{id:t.id}};e.axios(i).then(function(t){e.$message.success(t.data.meta.message),e.initRoleList()}).catch(function(t){e.$message.error(t)})}).catch(function(t){})},submitRoleForm:function(){var t=this,e={method:"new"==this.operateType?"post":"patch",url:"new"==this.operateType?"".concat(this.common.basePath,"/roles/add"):"".concat(this.common.basePath,"/roles/update"),data:this.roleForm};this.$refs.roleForm.validate(function(o){o?t.axios(e).then(function(e){t.$message.success(e.data.meta.message),t.dialogRoleVisible=!1,t.initRoleList()}).catch(function(e){t.dialogRoleVisible=!1,t.$message.error(e)}):t.$message.error("请检查表单填写是否正确")})},deleteTree:function(t){var e=this;this.AuthorityForm=JSON.parse(JSON.stringify(t)),this.$confirm("删除后需要重新添加","确认删除?",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(t){var o={method:"patch",url:"".concat(e.common.basePath,"/article_type/delete/").concat(e.AuthorityForm.id)};e.axios(o).then(function(t){e.$message.success(t.data.meta.message),e.dialogRoleVisible=!1}).catch(function(t){e.dialogRoleVisible=!1,e.$message.error(t)})}).catch(function(t){})},handleNodeClick:function(t,e){this.activeRole=t.id,this.getAuthorityList(t.id)},getAuthorityList:function(t){var e=this,o={method:"get",url:"".concat(this.common.basePath,"/resource/select"),params:{roles_id:t}};this.common.checkAuthority("RoleList-tree",!0)&&(this.pageLoading=!0,this.axios(o).then(function(t){e.$nextTick(function(){e.$refs.Authoritytree.setCheckedKeys(t.data.data)}),e.pageLoading=!1}).catch(function(t){e.pageLoading=!1,e.$message.error(t)}))},getAuthorityTree:function(){var t=this;this.pageLoading=!0;var e={method:"get",url:"".concat(this.common.basePath,"/resource/tree")};this.axios(e).then(function(e){t.authorityTreeData=e.data.data,t.pageLoading=!1}).catch(function(e){t.pageLoading=!1,t.$message.error(e)})},treeSelectChanged:function(t,e){},saveAuthority:function(){var t=this;this.pageLoading=!0;var e={method:"patch",url:"".concat(this.common.basePath,"/resource/add"),data:r.a.stringify({role_id:this.activeRole,resources:this.$refs.Authoritytree.getCheckedKeys().toString()})};this.axios(e).then(function(e){t.$message.success(e.data.meta.message),t.pageLoading=!1,t.getAuthorityList(t.activeRole)}).catch(function(e){t.pageLoading=!1,t.$message.error(e)})},handleScroll:function(t){t.target.scrollTop>65?this.overScroll=!0:this.overScroll=!1}}},l=n,c=(o("af85"),o("2877")),d=Object(c["a"])(l,i,a,!1,null,null,null);d.options.__file="RoleList.vue";e["default"]=d.exports},af85:function(t,e,o){"use strict";var i=o("2d78"),a=o.n(i);a.a}}]);
//# sourceMappingURL=chunk-1923.bdf0fd27.js.map