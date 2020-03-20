/*********** 管理实验的学生名册 ************/
<template>
  <div class="content-wrap-box">  
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <div class="breadcrumb-div" style="width: calc(100% - 281px)">
          <el-breadcrumb-item class="mart10" :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item> 
          <el-breadcrumb-item class="mart10" :to="{ name: 'TestDetail', params: {id: $route.params.id} }">实验详情</el-breadcrumb-item> 
          <el-breadcrumb-item style="width: calc(100% - 164px)"> 
            <div class="fl text-left-div mart10">管理实验的学生名册</div>
            <div class="text-right fr">
              <el-button type="primary" 
                :disabled="!common.checkAuthority('TestPersonalStudentResister_AddStudent', true)"
                @click=" showMemberDialog ">
                {{common.checkAuthority('TestPersonalStudentResister_AddStudent') ? common.checkAuthority('TestPersonalStudentResister_AddStudent').name : ''}}
              </el-button>  
              <!-- 导入学生花名册 --> 
              <upload 
                style="display: inline-block;"
                class="marl10"
                :url="`/participant/import/${$route.params.id}`"
                :isDisabled="!common.checkAuthority('TestPersonalStudentResister_Import', true)"
                :fileTypes="['xls','xlsx']"
                size="middle"
                :buttonText="common.checkAuthority('TestPersonalStudentResister_Import') ? common.checkAuthority('TestPersonalStudentResister_Import').name : ''" 
                @uploadSuccess="importSheet">
              </upload>  
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
            :disabled="!common.checkAuthority('TestPersonalStudentResister_Search', true)"
            type="primary" @click="getQueryStudent">
            {{common.checkAuthority('TestPersonalStudentResister_Search') ? common.checkAuthority('TestPersonalStudentResister_Search').name : ''}}
          </el-button>
          <el-button type="primary" @click="$refs.searchForm ? $refs.searchForm.resetFields() : '';">置空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="router-view-wrap mart0"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content">  
        <el-table 
          ref="multipleTable"
          :data="studentList.rows"
          tooltip-effect="dark"
          style="width: 100%" > 
          <el-table-column
            type="index"
            align="center"
            label="序号" 
            prop="faculty"> 
          </el-table-column>
          <el-table-column
            align="center"
            label="工/学号" 
            prop="account"> 
          </el-table-column>
          <el-table-column 
            align="center"
            prop="user_name"
            label="姓名" >
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            prop="group_type"
            label="是否组长"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.group_type == 1 ? '是' : '否'}}
            </template>
          </el-table-column>
          <el-table-column
            width="50"
            align="center"
            prop="sex_str"
            label="性别"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.sex == 1 ? '男' : '女'}}
            </template>
          </el-table-column> 
          <el-table-column
            width="200px"
            align="center"
            prop="facultyName"
            label="院系"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            width="120"
            align="center"
            prop="phone_num"
            label="手机"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="mail"
            label="邮箱"
            show-overflow-tooltip>
          </el-table-column> 
          <el-table-column 
            align="center" 
            label="操作"
            width="200px"
            show-overflow-tooltip>
            <template slot-scope="scope"> 
              <el-button 
                :disabled="!common.checkAuthority('TestPersonalStudentResister_Delete', true)"
                type="danger" size="mini" @click=" deleteMember(scope.row.id) ">
                  {{common.checkAuthority('TestPersonalStudentResister_Delete') ? common.checkAuthority('TestPersonalStudentResister_Delete').name : ''}}
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
             @size-change="handleSizeChange($event,'membersList')"
             @current-change="handleCurrentChange($event, 'membersList')"
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
        experimentId:     this.$route.params.id,
        courseId:         this.$route.params.courseId,
        addMemberDialog:  false, 
        studentList:      {total: 0, rows: []}, 
        facultyOptions:   [], //院系树 
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
        memberSearchForm: {  //新增人员的搜索人员表单
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
      }
    },
    mounted(){ 
      this.getQueryStudent();
      this.getQueryMemberListByCourseId();
      this.getQueryFacultyTree();
    },
    methods: {  
      /*
       * 查询学生数据
       */
      getQueryStudent(){  
        let faculty = this.searchForm.faculty ? this.searchForm.faculty[this.searchForm.faculty.length -1] : null;
        let params = `experiment_id=${this.searchForm.experiment_id}&account=${this.searchForm.account}&type=3&faculty=${faculty}&user_name=${this.searchForm.user_name}&pageNum=${this.searchForm.pageNum}&pageSize=${this.searchForm.pageSize}`;
        this.axios.get(`${this.common.basePath}/participant?${params}`,{}).then((response) => { 
          this.studentList = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      }, 
      /*
       * 根据指定Id删除成员
       */
      deleteMember(studentId){
        this.axios.patch(`${this.common.basePath}/participant/delete/${studentId}`, '').then((response) => {
          this.getQueryStudent();
        }).catch((error) => {
          this.$message.error(error);  
        }); 
      }, 
      /*
       * 根据课程Id查询人员列表
       * @params {string/number} type 1、课程组长；2、任课教师；3、学生；4、助教
       */
      getQueryMemberListByCourseId(){  
        this.axios.get(`${this.common.basePath}/member`,this._memberListByCourseIdParams(3)).then((response) => {
          this.memberListData = this.memeberCourseStudentListData = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      _memberListByCourseIdParams(type){
        let params = JSON.parse(JSON.stringify(this.memberSearchForm));
        params.type = type;
        params.course_id = this.courseId;
        return {
          params: params
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
        this.memberBatchForm.type = 3;
        this.$refs.memberSearchForm ? this.$refs.memberSearchForm.resetFields() : '';
        this.getQueryMemberListByCourseId();
        this.$refs.memberTable ? this.$refs.memberTable.clearSelection() : '';
      },
      /*
       * 保存新增成员
       */
      submitBatch(){
        if(!this.memberBatchForm.member_id.length) {this.$message.error('请选择成员'); return false;}
        this.axios.post(`${this.common.basePath}/participant/add/batch`,this.memberBatchForm).then((response) => {
          this.getQueryStudent();
          this.getQueryMemberListByCourseId();
          this.addMemberDialog = false;
          this.$message.success(response.data.meta.message);
        }).catch((error) => {
          this.$message.error(error);  
          this.addMemberDialog = false;
        });
      }, 
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