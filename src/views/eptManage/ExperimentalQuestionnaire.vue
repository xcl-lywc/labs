<!-- 实验管理-问卷调查 -->
<template>
  <div class="content-wrap-box" ref="contentWrap">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>问卷调查</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" ref="contentWrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <!-- 搜索表单 -->
        <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
          <el-form-item label="实验课程：" prop="course_id">
            <el-select v-model="searchForm.course_id" @change="courseChange">
              <el-option v-for="(item, index) in courseListData.rows" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验名称：" prop="experiment_id">
            <el-select v-model="searchForm.experiment_id">
              <el-option v-for="(item, index) in experimentListData.rows" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="问卷类型：" prop="questionnaireType">
            <el-select v-model="searchForm.questionnaireType" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> 
          <el-form-item>
            <el-button 
              :disabled="!common.checkAuthority('ExperimentalQuestionnaire_QueryList', true)"
              type="primary" @click="getQueryList()">
              {{common.checkAuthority('ExperimentalQuestionnaire_QueryList') ? common.checkAuthority('ExperimentalQuestionnaire_QueryList').name : ''}}
            </el-button>
            <el-button type="primary" @click="resetSearchForm">置空</el-button>
          </el-form-item>
        </el-form> 
        <!-- 内容 -->
        <el-table  
          :data="listData.rows"
          tooltip-effect="dark" > 
          <el-table-column 
            label="实验名称" 
            prop="experimentName"
            show-overflow-tooltip> 
            <template slot-scope="scope">
              <span>{{scope.row.experimentName}}</span>
            </template>
          </el-table-column>
          <el-table-column 
            label="课程名称" 
            prop="courseName"
            show-overflow-tooltip> 
            <template slot-scope="scope">
              <span>{{scope.row.courseName}}</span>
            </template>
          </el-table-column>
          <el-table-column 
            label="任务名称" 
            prop="name"
            show-overflow-tooltip> 
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column 
            label="问卷名称" 
            prop="questionnaireName"
            show-overflow-tooltip> 
            <template slot-scope="scope">
              <span>{{scope.row.questionnaireName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="150px" 
            prop="questionnaireType"
            label="问卷类型"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{questionnaireType(scope.row.questionnaireType)}}
            </template>
          </el-table-column>
          <el-table-column
            width="150px" 
            prop="end_time"
            label="截止时间" >
            <template slot-scope="scope">
              {{common._convertDate(scope.row.end_time, 'yyyy年MM月dd日')}}
            </template>
          </el-table-column>
          <el-table-column   
            label="操作"
            width="80px"
            show-overflow-tooltip>
            <template slot-scope="scope"> 
              <div> 
                <el-button 
                  :disabled="!common.checkAuthority('ExperimentalQuestionnaire_Write', true)"
                  type="primary" size="mini"
                  @click="showPaper(scope.row)">
                  {{common.checkAuthority('ExperimentalQuestionnaire_Write') ? common.checkAuthority('ExperimentalQuestionnaire_Write').name : ''}}
                </el-button> 
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 页面底部 -->
        <div class="router-view-bottom mart10"> 
          <div></div>
          <!-- 分页 -->
          <el-pagination  
             :disabled="!common.checkAuthority('ExperimentalQuestionnaire_QueryList', true)"
             class="fr "
             background
             @size-change="handleSizeChange($event)"
             @current-change="handleCurrentChange($event)"
             :current-page="common.elementPagination.pageNum"
             :page-sizes="common.elementPagination.pageSizes"
             :page-size="common.elementPagination.pageSizeDefault"
             layout="total, sizes, prev, pager, next"
             :total="listData.total">
          </el-pagination> 
        </div>
      </div> 
    </div>

    <!-- 问卷调查填写表 -->
    <el-dialog 
      width="70vw"
      title="问卷调查填写表" 
      :closeOnClickModal="false"
      :showClose="isPaperDialogShowClose"
      :visible.sync="paperDialog" >
        <experimental-qestionnaire-write
          @isPaperDialogShowClose="isPaperDialogShowCloseFun" 
          @closePaperDialog="closePaperDialogFun" 
          v-if="activeAnswerItem" 
          :questionnaireData="activeAnswerItem"></experimental-qestionnaire-write>
        <div slot="footer" class="dialog-footer">
          <el-button @click="paperDialog = false">取 消</el-button> 
        </div>
    </el-dialog>
  </div>
</template>
<script>
  // 答题
  import ExperimentalQuestionnaireWrite from '../../components/ExperimentalQuestionnaireWrite.vue';
  export default { 
    data () {
      return {
        paperDialog:  false, //问卷调查填写表弹框
        isPaperDialogShowClose: true, //控制问卷调查填写表弹框的关闭按钮

        searchForm:  {
          experiment_id: null,
          questionnaireType:  null,
          pageNum:       this.common.elementPagination.pageNumDefault,
          pageSize:      this.common.elementPagination.pageSizeDefault,
        }, 
        statusOptions: [
          {label: '评价教学', value: 1},
          {label: '小组互评', value: 2},
          {label: '自评', value: 3}, 
        ],

        listData:         {total: 0, rows: []},
        courseListData:   {total: 0, rows: []},
        experimentListData: {total: 0, rows: []}, 

        activeAnswerItem: null, //选中问卷调查填写表的数据
      }
    },
    watch:{   
    },
    created() { 
    },
    components:{  
      'experimental-qestionnaire-write': ExperimentalQuestionnaireWrite,
    },
    mounted(){   
      this.getQueryList();
      this.getQueryCourseList(); 
    },
    methods: {
      /**
       * 问卷类型
       * @author chuanlin.Xiao
       * @date   2019-11-25T14:52:26+0800
       * @param  {[type]}                 type [description]
       * @return {[type]}                      [description]
       */
      questionnaireType(type){  
        if(type){
          switch(type){
            case 1: 
              return '评价教学';
              break;
            case 2: 
              return '小组互评';
              break;
            case 3: 
              return '自评';
              break; 
          }
        }
      }, 
      /**
       * 重置搜索表单
       * @author chuanlin.Xiao
       * @date   2019-11-25T14:53:43+0800
       * @return {[type]}                 [description]
       */
      resetSearchForm(){ 
        this.$refs.searchForm ? this.$refs.searchForm.resetFields() : ''; 
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       */
      handleCurrentChange(val){ 
        this.searchForm.pageNum = val;
        this.getQueryList();
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val){  
        this.searchForm.pageSize = val;
        this.getQueryList();
       },

      /**
       * 查询问卷调查列表
       * @author chuanlin.Xiao
       * @date   2019-11-25T14:52:51+0800
       * @return {[type]}                 [description]
       */
      getQueryList(){  
        this.axios.get(`${this.common.basePath}/questionnaire/student/task`,{params: this.searchForm}).then((response) => {
          this.listData = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 查询实验课程列表
       * @author chuanlin.Xiao
       * @date   2019-11-25T14:54:06+0800
       * @return {[type]}                 [description]
       */
      getQueryCourseList(){  
        this.axios.get(`${this.common.basePath}/course`,'').then((response) => {
           this.courseListData = response.data.data;  
        }).catch((error) => {
          this.$message.error(error);  
        });
      },  
      /**
       * 查询实验列表
       * @author chuanlin.Xiao
       * @date   2019-11-25T14:54:27+0800
       * @param  {[type]}                 courseId [description]
       * @return {[type]}                          [description]
       */
      getQueryExperimentList(courseId){  
        this.axios.get(`${this.common.basePath}/experiment`,{params: {course_id: courseId}}).then((response) => {
          this.experimentListData = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 课程改变实验跟着改变
       */
      courseChange(val){  
        // ------ 清空之前被选中的实验Id ----- 
        this.searchForm.experiment_id = null;

        this.getQueryExperimentList(val);
      },
      
      /*
       * 关闭 问卷调查填写表弹框
       */
      closePaperDialogFun(){
        this.paperDialog = false;
        this.getQueryList();
       },
      isPaperDialogShowCloseFun(val){ 
        console.log(val)
        this.isPaperDialogShowClose = val;
        this.getQueryList();
       }, 
      /*
       * 显示 问卷调查填写表
       */
      showPaper(item){
        this.activeAnswerItem = item; 
        this.paperDialog = true;
      },
      /**
       * 详情
       * @author chuanlin.Xiao
       * @date   2019-11-25T14:55:37+0800
       * @param  {[type]}                 item [description]
       * @return {[type]}                      [description]
       */
      goToDetail(item) {
        this.$message('查看详情，待开发')
      },
    }
  }
</script>
<style lang="less">
  
</style>