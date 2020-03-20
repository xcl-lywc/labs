/*********** 管理实验的学生名册 ************/
<template>
  <div class="content-wrap-box" v-loading="isLoad">  
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <div class="breadcrumb-div" style="width: calc(100% - 281px)">
          <el-breadcrumb-item class="mart10" :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item> 
          <el-breadcrumb-item class="mart10" :to="{ name: 'TestDetail', params: {id: $route.params.id} }">实验详情</el-breadcrumb-item> 
          <el-breadcrumb-item style="width: calc(100% - 164px)"> 
            <div class="fl text-left-div mart10">管理实验的学生名册</div> 
            <div class="text-right ">
              <el-button type="primary" 
                :disabled="!common.checkAuthority('TestGroupStudentResister_CreateGroup', true)"
                @click=" groupDialogTitle = '创建小组'; addGroupDialog = true ; $refs.submitGroupForm ? $refs.submitGroupForm.resetFields() : '' ">
                {{common.checkAuthority('TestGroupStudentResister_CreateGroup') ? common.checkAuthority('TestGroupStudentResister_CreateGroup').name : ''}}
              </el-button>
              <el-button type="primary" 
                :disabled="!common.checkAuthority('TestGroupStudentResister_AutoGroup', true)"
                @click=" autoGroup ">
                {{common.checkAuthority('TestGroupStudentResister_AutoGroup') ? common.checkAuthority('TestGroupStudentResister_AutoGroup').name : ''}}
              </el-button>   
            </div>
          </el-breadcrumb-item>
        </div>
      </el-breadcrumb>
    </el-card>
    <!-- 搜索条件 -->
    <el-card class="operation-router-view-wrap mar15" :body-style="{ 'padding-bottom': '0px' }">
      <el-form ref="searchForm" :inline="true" :model="searchForm" label-width="100px" > 
        <el-form-item 
          label="学号：" 
          prop="account" >
          <el-input v-model="searchForm.account"></el-input>
        </el-form-item>  
        <el-form-item 
          label="院系：" 
          prop="faculty" > 
          <el-cascader
            v-model="searchForm.faculty"
            filterable
            :options="facultyOptions"
            :props="facultyProps" 
            :change-on-select="true" 
            :show-all-levels="false"
           > 
          </el-cascader> 
        </el-form-item>   
        <el-form-item 
          label="姓名：" 
          prop="user_name" >
          <el-input v-model="searchForm.user_name"></el-input>
        </el-form-item>  
        <el-form-item> 
          <el-button 
            :disabled="!common.checkAuthority('TestGroupStudentResister_search', true)"
            type="primary" @click="getQueryStudent">
            {{common.checkAuthority('TestGroupStudentResister_search') ? common.checkAuthority('TestGroupStudentResister_search').name : ''}}
          </el-button>
          <el-button type="primary" @click="$refs.searchForm ? $refs.searchForm.resetFields() : '';">置空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="router-view-wrap mart0">
      <!-- tab切换 -->
      <el-tabs v-model="activeTabId" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="全部" name="全部"></el-tab-pane>
        <el-tab-pane v-for="(item, index) in teamList" :key="index" :label="item.teamName" :name="item.id.toString()"></el-tab-pane>
      </el-tabs>
      <hr/>
      <!-- 班级按钮 -->
      <div class="mar20" v-if="activeTabId == '全部'"> 
        <div class=" text-left-div mart10">班级花名册</div>
        <div class="text-right ">
          <el-button type="primary" 
            :disabled="!common.checkAuthority('TestGroupStudentResister_AddMemberToGroup', true)"
            @click="showMemberAddToGroupDialog(0)">
            {{common.checkAuthority('TestGroupStudentResister_AddMemberToGroup') ? common.checkAuthority('TestGroupStudentResister_AddMemberToGroup').name : ''}}
          </el-button>
          <el-button type="primary" 
            :disabled="!common.checkAuthority('TestGroupStudentResister_AddStudent', true)"
            @click=" showMemberDialog ">
            {{common.checkAuthority('TestGroupStudentResister_AddStudent') ? common.checkAuthority('TestGroupStudentResister_AddStudent').name : ''}}
          </el-button>   
          <!-- 导入学生花名册 --> 
          <upload 
            style="display: inline-block;"
            class="marl10"
            :url="`/participant/import/${$route.params.id}`"
            :isDisabled="!common.checkAuthority('TestGroupStudentResister_Import', true)"
            :fileTypes="['xls','xlsx']"
            size="middle"
            :buttonText="common.checkAuthority('TestGroupStudentResister_Import') ? common.checkAuthority('TestGroupStudentResister_Import').name : ''" 
            @uploadSuccess="importSheet">
          </upload> 
        </div>
      </div>
      <!-- 小组按钮 -->
      <div class="mar20" v-else> 
        <div class=" text-left-div mart10">
          {{activeTabName}}花名册
        </div>
        <div class="text-right ">
          <el-button type="primary" 
            :disabled="!common.checkAuthority('TestGroupStudentResister_EditGroup', true)"
            @click="showEditGroupDialog">
            {{common.checkAuthority('TestGroupStudentResister_EditGroup') ? common.checkAuthority('TestGroupStudentResister_EditGroup').name : ''}}
          </el-button> 
          <el-button type="primary" 
            :disabled="!common.checkAuthority('TestGroupStudentResister_ChooseMember', true)"
            @click=" showMemberDialog ">
            {{common.checkAuthority('TestGroupStudentResister_ChooseMember') ? common.checkAuthority('TestGroupStudentResister_ChooseMember').name : ''}}
          </el-button> 
          <el-button type="primary" 
            :disabled="!common.checkAuthority('TestGroupStudentResister_DeleteGroup', true)"
            @click="deleteGroup">
            {{common.checkAuthority('TestGroupStudentResister_DeleteGroup') ? common.checkAuthority('TestGroupStudentResister_DeleteGroup').name : ''}}
          </el-button> 
        </div>
      </div>
      <hr/>
      <!-- 页面主要内容 -->
      <div class="router-view-content mart20">  
        <el-table 
          :row-key="getTableRowKeys"
          ref="multipleTable"
          :data="studentList.rows"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleMemberSelectionChange">
          <el-table-column
            :reserve-selection="true"
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            align="center"
            label="序号"  > 
          </el-table-column>
          <el-table-column
            align="center"
            label="学号" 
            prop="account"> 
          </el-table-column>
          <el-table-column 
            align="center"
            prop="user_name"
            label="姓名" >
          </el-table-column>
          <el-table-column
            width="200px"
            align="center"
            prop="facultyName"
            label="院系" >
          </el-table-column>
          <el-table-column
            width="50"
            align="center"
            prop="sex_str"
            label="性别" >
            <template slot-scope="scope">
              {{scope.row.sex == 1 ? '男' : '女'}}
            </template>
          </el-table-column> 
          <el-table-column
            v-if="activeTabId == '全部'"
            width="100"
            align="center"
            prop="group_name"
            label="所属小组" > 
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            prop="group_type"
            label="小组长" >
            <template slot-scope="scope">
              {{scope.row.group_type == 1 ? '是' : '否'}}
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            align="center"
            prop="phone_num"
            label="手机" >
          </el-table-column>
          <el-table-column
            align="center"
            prop="mail"
            label="邮箱" >
          </el-table-column> 
          <el-table-column 
            fixed="right"
            align="center" 
            label="操作"
            :width="activeTabId == '全部' ? '200px' : '290px' "
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button 
                :disabled="!common.checkAuthority('TestGroupStudentResister_ChangeGroup', true)"
                type="primary" size="mini" 
                @click=" showMemberAddToGroupDialog(1, scope.row.id) ">
                  {{common.checkAuthority('TestGroupStudentResister_ChangeGroup') ? common.checkAuthority('TestGroupStudentResister_ChangeGroup').name : ''}}
                </el-button> 
              <!-- 当前显示的成员不是全部成员才显示这个按钮 -->
              <el-button v-if=" activeTabId != '全部' " type="primary" size="mini"
                :disabled="!common.checkAuthority('TestGroupStudentResister_DesTeamLeader', true)"
                @click=" setLeader(scope.row.id) ">
                {{common.checkAuthority('TestGroupStudentResister_DesTeamLeader') ? common.checkAuthority('TestGroupStudentResister_DesTeamLeader').name : ''}}
                </el-button>
              <el-button 
                :disabled="!common.checkAuthority('TestGroupStudentResister_Delete', true)"
                type="danger" size="mini" @click=" deleteMember(scope.row.id)">
                  {{common.checkAuthority('TestGroupStudentResister_Delete') ? common.checkAuthority('TestGroupStudentResister_Delete').name : ''}}
                </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 页面底部 -->
        <div class="router-view-bottom mart10"> 
          <div></div>
          <!-- 分页 -->
          <el-pagination   
             class="fr "
             background
             @size-change="handleSizeChange($event, 'studentList')"
             @current-change="handleCurrentChange($event, 'studentList')"
             :current-page="common.elementPagination.pageNum"
             :page-sizes="common.elementPagination.pageSizes"
             :page-size="common.elementPagination.pageSizeDefault"
             layout="total, sizes, prev, pager, next"
             :total="studentList.total">
          </el-pagination> 
        </div>
      </div> 
    </div> 
    <!-- 添加成员 -->
    <el-dialog 
      width="70vw"
      title="添加成员" 
      :visible.sync="addMemberDialog">
        <el-form ref="memberSearchForm" :inline="true" :model="memberSearchForm" label-width="60px" >
          <el-form-item 
            label="姓名：" 
            prop="name" >
            <el-input v-model="memberSearchForm.user_name"></el-input>
          </el-form-item>  
          <el-form-item 
            label="工号：" 
            prop="account" >
            <el-input v-model="memberSearchForm.account"></el-input>
          </el-form-item>  
          <el-form-item>
            <el-button type="primary" @click="getQueryMemberListByCourseId()">搜索</el-button>
            <el-button type="primary" @click="$refs.memberSearchForm ? $refs.memberSearchForm.resetFields() : '' ">置空</el-button>
          </el-form-item>
        </el-form>
        <el-table
          border 
          :row-key="getTableRowKeys"
          ref="memberTable"
          :data="memberListData.rows"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            :reserve-selection="true"
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="工号" 
            prop="account"> 
          </el-table-column>
          <el-table-column
            align="center"
            prop="user_name"
            label="姓名" >
          </el-table-column>
          <el-table-column
            align="center"
            prop="facultyName"
            label="系别"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="phone_num"
            label="手机"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <!-- 页面底部 -->
        <div class="pad10"> 
          <!-- 分页 --> 
          <el-pagination  
             class="fr "
             background
             @size-change="handleSizeChange($event, 'memberList')"
             @current-change="handleCurrentChange($event, 'memberList')"
             :current-page="common.elementPagination.pageNum"
             :page-sizes="common.elementPagination.pageSizes"
             :page-size="common.elementPagination.pageSizeDefault"
             layout="total, sizes, prev, pager, next"
             :total="memberListData.total">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addMemberDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitBatch('memberBatchForm')">保存</el-button>
        </div>
    </el-dialog>
    <!-- 创建/编辑小組 -->
    <el-dialog 
      width="400px"
      :title="groupDialogTitle" 
      :visible.sync="addGroupDialog"> 
        <el-form ref="submitGroupForm" :model="submitGroupForm" label-width="100px" >
          <el-form-item 
            label="小组名称：" 
            prop="teamName"
            :rules="[{ required: true, message: '请选择课程', trigger: 'blur' },]">
            <el-input v-model="submitGroupForm.teamName"></el-input>
          </el-form-item>
        </el-form> 
        <div slot="footer" class="dialog-footer">
          <el-button @click="addGroupDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitGroup('submitGroupForm')">保存</el-button>
        </div>
    </el-dialog>
    <!-- 添加成员到指定小组 -->
    <el-dialog 
      width="400px"
      title="选择小组" 
      :visible.sync="memberAddToGroupDialog"> 
        <el-form ref="memberAddToGroupForm" :model="memberAddToGroupForm" label-width="100px" >
          <el-form-item 
            label="小组：" 
            prop="groupId"
            :rules="[{ required: true, message: '请选择小组', trigger: 'blur' },]">
            <el-select v-model="memberAddToGroupForm.groupId" placeholder="请选择">
              <el-option v-for="(item, index) in teamList" :value="item.id" :label="item.teamName" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form> 
        <div slot="footer" class="dialog-footer">
          <el-button @click="memberAddToGroupDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitMemberAddToGroup('memberAddToGroupForm')">保存</el-button>
        </div>
    </el-dialog> 
  </div>
</template>
<script>
  import upload from "../../components/Upload.vue" 
  export default {
    components:{   
      'upload':   upload, 
    },
    data () {
      return {
        isLoad:             true,
        experimentId:       this.$route.params.id,
        courseId:           this.$route.params.courseId,
        addMemberDialog:    false,
        addGroupDialog:     false, 
        memberAddToGroupDialog: false,
        groupDialogTitle:  '创建小组', //编辑小组弹框的标题
        selectStudentIdList: [], //页面学生列表中，被选中的学生Id数组
        studentList:      {total: 0, rows: []},
        teamList:         [],
        activeStudentId:  null, //当前被指定的学员Id
        changeGroupType:  '0',  //0为添加到组，1为换组
        facultyOptions:   [], //院系树 
        activeTabId:      '全部', //被选中tab值
        activeTabName:    '全部', //被选中的tabName
        searchForm:       {   //搜索名册成员列表条件
          experiment_id:  this.$route.params.id,
          account:        null,
          type:           3,
          faculty:        null, 
          user_name:      null, 
          pageNum:        this.common.elementPagination.pageNumDefault,
          pageSize:       this.common.elementPagination.pageSizeDefault,
        },
        facultyProps:     {
          value:    'id',
          label:    'faculty', 
          children: 'childrens',
        },
        memberSearchForm: { 
          experiment_id:  this.$route.params.id,
          user_name:      null,
          account:        null,
          pageNum:        this.common.elementPagination.pageNumDefault,
          pageSize:       this.common.elementPagination.pageSizeDefault,
        },
        memberListData:  {total: 0, rows: []}, //所有成员数据
        memberBatchForm: {  //新增成员表单
          "experiment_id": this.$route.params.id,
          "type":          3, //1、课程组长；2、任课教师；3、学生；4、助教
          "member_id":     [],
        },
        submitGroupForm: {  //添加小組表单
          experimentId: this.$route.params.id,
          teamName:      null, 
        },
        memberAddToGroupForm: { //添加到组表单
          groupId:       null,
        }
      }
    },
    mounted(){
      this.getQueryTeamList();
      this.getQueryMemberListByCourseId();
      this.getQueryFacultyTree();
    },
    methods: { 
      /*
       * 查询系别树
       */
      getQueryFacultyTree(){  
        this.axios.get(`${this.common.basePath}/faculty/tree`,'').then((response) => {
          // ------ 重组系别树，将最后一层没有数据的children去掉, 然后再给变量赋值 ----- 
          this._recombineFacultyTree(response.data.data); 

          this.facultyOptions = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      }, 
      _recombineFacultyTree(facultyData){
        facultyData.forEach((item) => {
          if(!item.childrens){
           delete item.childrens;
          }else{
            this._recombineFacultyTree(item.childrens);
          }
        })  
      },
      /*
       * 查询小组列表
       */
      getQueryTeamList() { 
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/team/list`,{experiment_id: this.$route.params.id}).then((response) => {
          this.teamList= response.data.data.rows;
          this.getQueryStudent();
          this.isLoad = false;
        }).catch((error) => {
          this.$message.error(error);  
          this.isLoad = false;
        });
      },
      /*
       * 查询学生数据
       */
      getQueryStudent() { 
        this.isLoad = true;
        let faculty = this.searchForm.faculty ? this.searchForm.faculty[this.searchForm.faculty.length -1] : null;
        let params = this.activeTabId == '全部' ? 
               `experiment_id=${this.searchForm.experiment_id}&account=${this.searchForm.account}&type=3&faculty=${faculty}&user_name=${this.searchForm.user_name}&pageNum=${this.searchForm.pageNum}&pageSize=${this.searchForm.pageSize}` 
               : `experiment_id=${this.searchForm.experiment_id}&account=${this.searchForm.account}&type=3&faculty=${faculty}&user_name=${this.searchForm.user_name}&pageNum=${this.searchForm.pageNum}&pageSize=${this.searchForm.pageSize}&group_num=${this.activeTabId}`;

        this.axios.get(`${this.common.basePath}/participant?${params}`,{}).then((response) => { 
          this.studentList = response.data.data;
          this.isLoad = false;
        }).catch((error) => {
          this.isLoad = false;
          this.$message.error(error);  
        });
      },
      /**
       * 切换tab小组，查询不同的学生信息
       * @param  {[type]} val [切换值]
       * @return {[type]}     [description]
       */
      handleTabClick(val) {
        this.activeTabName = val.label;
        this.searchForm.pageNum = this.common.elementPagination.pageNumDefault;
        this.searchForm.pageSize = this.common.elementPagination.pageSizeDefault
        this.getQueryStudent();
       },
      /*
       * 根据指定Id删除成员
       */
      deleteMember(studentId) {
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let mothed = this.activeTabId == '全部' ? 'patch' : 'get';
          let url = this.activeTabId == '全部' ? `${this.common.basePath}/participant/delete/${studentId}` : `${this.common.basePath}/participant/delete/group?id=${studentId}`;
          this.axios[mothed](url, '').then((response) => {
            this.getQueryStudent();
            this.$message.success(response.data.meta.message);
          }).catch((error) => {
            this.$message.error(error);  
          }); 
        }).catch(() => {});
        
      },
      /**
       * 根据指定Id设为组长
       * @param {[type]} studentId 学生Id
       */
      setLeader(studentId){
        this.axios.post(`${this.common.basePath}/participant/group/leader`, {id: studentId}).then((response) => {
          this.getQueryStudent();
          this.$message.success(response.data.meta.message);
        }).catch((error) => {
          this.$message.error(error);  
        }); 
      },
      /*
       * 根据课程Id查询人员列表
       * @params {string/number} type 1、课程组长；2、任课教师；3、学生；4、助教
       */
      getQueryMemberListByCourseId(){  
        let url = this.activeTabId == '全部' ? `${this.common.basePath}/member` : `${this.common.basePath}/participant/nogroup`
        let mothed = this.activeTabId == '全部' ? 'get' : 'post';
        this.axios[mothed](url,this._memberListByCourseIdParams(3)).then((response) => {
          this.memberListData = this.memeberCourseStudentListData = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      _memberListByCourseIdParams(type){
        let params = JSON.parse(JSON.stringify(this.memberSearchForm));
        params.type = type;
        params.course_id = this.courseId;
        if(this.activeTabId == '全部'){
          return { params: params }
        }else{
          return params;
        }
      },
      /**
       * 指定表单选中的值为id
       * @return {[type]} [description]
       */
      getTableRowKeys(item){ 
        return  item.id;
      },
      /**
       * 选择新增学员赋值
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val){
        this.memberBatchForm.member_id = [];
        val.forEach((item) => {
          this.memberBatchForm.member_id.push(item.id)
        })
      },
      /*
       * 显示新增学生弹框
       * @params {string} groupNum 分组识别
       */
      showMemberDialog(){
        this.memberListData = this.memeberCourseStudentListData;
        this.addMemberDialog = true;
        this.memberBatchForm.group_num = this.activeTabId == '全部' ? '' : this.activeTabId;
        this.memberBatchForm.type = 3;
        this.$refs.memberSearchForm ? this.$refs.memberSearchForm.resetFields() : '';
        this.getQueryMemberListByCourseId();
        this.$refs.memberTable ? this.$refs.memberTable.clearSelection() : '';
      },
      /*
       * 保存新增成员
       */
      submitBatch(){ 
        let url = this.activeTabId == '全部' ? `${this.common.basePath}/participant/add/batch` : `${this.common.basePath}/participant/add/group/batch`
        if(this.activeTabId != '全部'){
          this.memberBatchForm.ids = this.memberBatchForm.member_id;
        }
        this.isLoad = true;
        if(!this.memberBatchForm.member_id.length) {this.$message.error('请选择成员'); return false;}
        this.axios.post(url,this.memberBatchForm).then((response) => {
          this.getQueryStudent();
          this.getQueryMemberListByCourseId();
          this.addMemberDialog = false;
          this.isLoad = false;
          this.$message.success(response.data.meta.message);
        }).catch((error) => {
          this.isLoad = false;
          this.$message.error(error);  
          this.addMemberDialog = false;
        });
      },
      /**
       * 显示编辑小组弹框
       * @return {[type]} [description]
       */
      showEditGroupDialog(){
        this.submitGroupForm.teamName = this.activeTabName;
        this.submitGroupForm.id = this.activeTabId;
        this.groupDialogTitle = '编辑小组'; 
        this.addGroupDialog = true ; 
        this.$refs.submitGroupForm ? this.$refs.submitGroupForm.resetFields() : '' 
      },
      /**
       * 添加/编辑小组
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitGroup(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            let url = this.groupDialogTitle == '创建小组' ? `${this.common.basePath}/team/add` : `${this.common.basePath}/team/update`
            this.axios.post(url,this.submitGroupForm).then((response) => {
              this.getQueryTeamList();
              this.$message.success(response.data.meta.message);
              this.addGroupDialog = false;
            }).catch((error) => {
              this.$message.error(error);
              this.courseOperaDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       * @param {string} type studentList为学生列表类型，memberList为所有成员列表 
       */
      handleCurrentChange(val, type){  
        if(type == 'studentList'){ 
          this.searchForm.pageNum = val;
          this.getQueryStudent();
        }else{ 
          this.memberSearchForm.pageNum = val;
          this.getQueryMemberListByCourseId();
        } 
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){ 
        if(type == 'studentList'){ 
          this.searchForm.pageSize = val;
          this.getQueryStudent();
        }else{ 
          this.memberSearchForm.pageSize = val;
          this.getQueryMemberListByCourseId();
        } 
       },
      /**
       * 页面人员多选框
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      handleMemberSelectionChange(val){
        this.selectStudentIdList = [];
        val.forEach( (item) => {
          this.selectStudentIdList.push(item.id);
        })
      },
      /**
       * 显示，将学员添加到组的弹框
       * @param  {[type]} type      0为添加到组，1为换组
       * @param  {[type]} studentId 学生Id
       * @return {[type]}           [description]
       */
      showMemberAddToGroupDialog(type, studentId){
        this.changeGroupType = type;
        if(!this.selectStudentIdList.length && this.changeGroupType == 0)
          return this.$message.info('没有选择好人员数据，请选择人员数据！');
        
        this.memberAddToGroupDialog = true;
        this.activeStudentId = studentId;
      },
      /**
       * 保存指定学员数组添加到指定一个小组
       * @param  {[type]} formName [表单名字]
       * @return {[type]}          [description]
       */
      submitMemberAddToGroup(formName){
        let  params = {}, url = '';
        if(this.changeGroupType == 0){
          params = {
            experiment_id: this.experimentId,
            group_num:     this.memberAddToGroupForm.groupId,
            ids:           this.selectStudentIdList,
            type:          3 
          } 
          url = `${this.common.basePath}/participant/add/group/batch`;
        }else {
          params = {
            group_num:     this.memberAddToGroupForm.groupId,
            id:            this.activeStudentId
          } 
          url = `${this.common.basePath}/participant/convert/group`;
        }     

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(url, params).then((response) => {
              this.getQueryStudent();
              this.$message.success(response.data.meta.message);
              this.memberAddToGroupDialog = false;
              this.$refs.multipleTable.clearSelection();
              this.$refs[formName].resetFields();
            }).catch((error) => {
              this.$message.error(error);
              this.memberAddToGroupDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /**
       * 删除小组
       * @return {[type]} [description]
       */
      deleteGroup(){
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.axios.post(`${this.common.basePath}/team/delete?id=${this.activeTabId}`,{}).then((response) => {
              this.activeTabId = this.activeTabName = '全部';
              this.getQueryTeamList();
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
            }); 
        }).catch(() => {});
      },
      /**
       * 自动分组
       * @return {[type]} [description]
       */
      autoGroup(){ 
        this.$confirm('确定要自动分组吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
           this.axios.post(`${this.common.basePath}/participant/members/auto?exprimentId=${this.experimentId}`,{}).then((response) => {
              this.activeTabId = this.activeTabName = '全部';
              this.getQueryTeamList();
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
            }); 
        }).catch(() => {});
      },
      /*
       * 导入学生花名册（上传附件的回调）
       */
      importSheet(response){ 
        this.$message.success('上传成功');
        this.getQueryStudent();  
      }, 
    }, 
  }
</script>
<style lang="less">
  
</style>