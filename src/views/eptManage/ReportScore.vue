<!-- 实验管理-报告评分 -->
<template>
  <div class="content-wrap-box" ref="contentWrap">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>报告评分列表</el-breadcrumb-item> 
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
          <el-form-item label="状态：" prop="reportStatus" style="display: none;">
            <el-select v-model="searchForm.reportStatus" placeholder="请选择">
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
              :disabled="!common.checkAuthority('ReportScore_QueryList', true)"
              type="primary" @click="getQueryList(true)">
              {{common.checkAuthority('ReportScore_QueryList') ? common.checkAuthority('ReportScore_QueryList').name : ''}}
            </el-button>
            <el-button type="primary" @click="resetSearchForm">置空</el-button>
          </el-form-item>
        </el-form> 
        <!-- 卡片 -->
        <el-row class="padding-row">
          <el-col v-if="listData.rows.length" :span="8" v-for="(item, index) in listData.rows" :key="index">
            <el-card class="card-wrap" style="height: 327px;">
              <div class="card-content cursor-pointer" @click="goToDetail(item)" >
                <p class="card-">报告任务 {{reportStatus(item.cur_status)}} 得分占比：{{item.value}}%</p>
                <p class="card-">名字：{{item.name}}</p> 
                <p class="card-">报告类型：{{item.type == 2 ? '个人报告' : '小组报告'}}</p>
                <p class="card-">报告模板：{{item.task_files ? JSON.parse(item.task_files).name : '无'}}</p>
                <p class="card-">要求：{{item.description}}</p>
              </div>

              <div class="card-bottom cursor-pointer" @click="goToDetail(item)">
                <p class="card- text-right">{{common._convertDate(item.end_time, 'yyyy年MM月dd日')}} 
                </p>
              </div>
            </el-card>
          </el-col> 
          <el-col v-if="!listData.rows.length" :span="8">
            <el-card class="card-wrap" style="height: 327px;"> 
              <div class="text-center">
                暂无数据
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div> 
    </div>
  </div>
</template>
<script>
  export default { 
    data () {
      return {
        scrollLoadSw: true, //滚动加载开关 
        searchForm:  { 
          course_id:     null, 
          experiment_id: null,
          reportStatus:  2,
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
          teacher_id: sessionStorage.getItem('Access-Key'),
        }, 
        statusOptions: [
          {label: '未做', value: 1},
          {label: '已答题/未打分', value: 2},
          {label: '已打分', value: 3}, 
        ],
        listData:         {total: 0, rows: []},
        courseListData:   {total: 0, rows: []},
        experimentListData: {total: 0, rows: []}, 
        activeCourseId:   null,
      }
    },
    watch:{   
    },
    mounted(){ 
      // ------ 滚动加载更多 -------
      // 通过$refs获取dom元素
      let box = this.$refs.contentWrap;
      // 监听这个dom的scroll事件
      box.addEventListener('scroll', () => {
      // 滑动到底部50的时候操作数据
      if(box.clientHeight + 50 >= box.scrollHeight - box.scrollTop ) {
        // ------ 值为true表示可以再次请求
        if(this.scrollLoadSw){
          this.scrollLoadSw = false;
          if(this.searchForm.pageNum < this.listData.total / this.searchForm.pageSize){
            this.getQueryList(false);
          } 
        }
         
        }  
      }, false)   

      //----- 初始化 ------- 
      this.getQueryList(true);
      this.getQueryCourseList();
    },
    methods: {
      reportStatus(cur_status){  
        if(cur_status){
          switch(cur_status){
            case 1: 
              return '未做';
              break;
            case 2: 
              return '已答题/未打分';
              break;
            case 3: 
              return '已打分';
              break; 
          }
        }
       
      }, 
      /*
       * 查询课程列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getQueryList(isRefresh){  
        this.axios.get(`${this.common.basePath}/task/student/report`,{params: this._queryParams(isRefresh)}).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.listData.rows = this.listData.rows.concat(response.data.data.rows);

            this.listData.total = response.data.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.listData = response.data.data;
          }
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
        }).catch((error) => {
          this.$message.error(error); 
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
        });
      },
      _queryParams(isRefresh){
        isRefresh ? this.searchForm.pageNum = 1 : this.searchForm.pageNum ++; 
        return this.searchForm;
      },
      /*
       * 查询课程列表，
       */
      getQueryCourseList(){  
        this.axios.get(`${this.common.basePath}/course`,'').then((response) => {
           this.courseListData = response.data.data;  
        }).catch((error) => {
          this.$message.error(error);  
        });
      },  
      goToDetail(item) {
        this.$router.push({name: "ReportScoreDetail", params: {id: item.id, experiment_id: item.experiment_id}})
      },
      resetSearchForm(){ 
        this.$refs.searchForm ? this.$refs.searchForm.resetFields() : ''; 
      },
      /*
       *  实验数据
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
    }
  }
</script>
<style lang="less">
  
</style>