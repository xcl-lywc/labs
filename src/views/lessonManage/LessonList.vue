<!-- 课程 -->
<template>
  <div class="content-wrap-box" ref="contentWrap">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="text-bold">
          <div class="breadcrumb-div">
            <div class="fl text-left-div">课程列表</div>
            <div class="text-right fr">
              <el-button 
                :disabled="!common.checkAuthority('LessonList_Add', true)"
                type="primary" 
                @click=" courseOperaDialog = true ; 
                $refs.courseForm ? $refs.courseForm.resetFields() : '' ">
                {{common.checkAuthority('LessonList_Add') ? common.checkAuthority('LessonList_Add').name : ''}}
              </el-button>
              <el-button 
                :disabled="!common.checkAuthority('LessonList_UseBaseAdd', true)" 
                type="primary" 
                @click=" baseCourseOperaDialog = true ">
                {{common.checkAuthority('LessonList_UseBaseAdd') ? common.checkAuthority('LessonList_UseBaseAdd').name : ''}}
              </el-button> 
              <el-button 
                :disabled="isDisabaledDelBtn()" 
                type="danger" 
                @click="deleteCourse">
                {{common.checkAuthority('LessonList_Delete') ? common.checkAuthority('LessonList_Delete').name : ''}}
              </el-button> 
            </div>
          </div>
        </el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <!-- 搜索表单 -->
    <el-card class="operation-router-view-wrap mar15" :body-style="{ 'padding-bottom': '0px' }">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
        <el-form-item label="课程名称：" prop="name">
          <el-input v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="时间：">
          <el-date-picker
            v-model="dateTE"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item> 
        <el-form-item label="课程状态：" prop="condition">
          <el-select v-model="searchForm.condition">
            <el-option value="1" label="我参与"></el-option>
            <el-option value="2" label="没老师"></el-option>
            <el-option value="3" label="没学生"></el-option>
            <el-option value="4" label="没实验"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学年：" prop="c_year"> 
          <el-select v-model="searchForm.c_year" @change="(val) => {yearChange(val, 'search')}">
            <el-option v-for="(item, index) in yearList.rows" :key="index" :value="item.id" :label="item.name"></el-option> 
          </el-select>
        </el-form-item>
        <el-form-item label="学期：" prop="c_stage" >
          <el-select v-model="searchForm.c_stage">
            <el-option v-for="(item, index) in schoolList.rows" :key="index" :value="item.id" :label="item.name"></el-option> 
          </el-select>
        </el-form-item> 
        <el-form-item> 
          <el-button 
            :disabled="!common.checkAuthority('LessonList_QueryList', true)" 
            type="primary" 
            @click="getQueryList(true)">
              {{common.checkAuthority('LessonList_QueryList') ? common.checkAuthority('LessonList_QueryList').name : ''}}
            </el-button>
          <el-button type="primary" @click="resetSearchForm">置空</el-button>
        </el-form-item>
      </el-form> 
    </el-card>
    <div class="router-view-wrap mart0" ref="contentWrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <!-- 卡片 -->
        <el-checkbox-group v-model="ids" size="small">
          <el-row class="padding-row">
            <el-col v-if="listData.rows.length" :span="8" v-for="(item, index) in listData.rows" :key="index">
              <el-card class="card-wrap card-wrap_s">
                <el-tag class="width-percentage">
                  <h3 class="card-title">
                    <el-checkbox :label="item.id" :disabled="!common.checkAuthority('TestList_Delete',true)">&nbsp;</el-checkbox> 
                    <span style="margin-left: -5px;" @click="goToDetail(item.id)" class="card-title cursor-pointer">{{item.name}}</span>
                  </h3> 
                </el-tag>
                <div class="card-content cursor-pointer" style="height: 210px;">
                  <p class="marl25 marb0 mart5" @click="goToDetail(item.id)">课程代码：{{item.c_code}}</p> 
                  <p class="marl25 marb0 mart5" @click="goToDetail(item.id)">学年学期：{{item.c_year ? `${item.c_year}学年${item.cStageName}` : '无'}}</p> 
                  <p class="marl25 marb0 mart5" @click="goToDetail(item.id)">课程教师：{{item.c_teacher}}</p>
                  <div class="marl25 marb0 mart5 display-flex" @click="goToDetail(item.id)">
                    <p class="mar0 inline-block">课程简介：</p>
                    <p class="mar0 inline-block cursor-pointer_T">{{item.description}}</p>
                  </div>
                </div>
                <div class="cursor-pointer marl25">
                  <div v-if="item.experiments.length" style="display: flex;">
                    <p class="inline-block marb0 mart0">实验列表：</p>
                    <div class="inline-block marb0">
                      <p v-for="(itemEx,indexEx) in item.experiments" class="mar0 marb5">
                        <el-button @click="goToExersice(itemEx.id)"  :disabled="!common.checkAuthority('LessonList_QueryExersiceDetail', true)" class=" pad0" type="text" size="mini">{{itemEx.name}}</el-button> 
                      </p>
                    </div>
                  </div>
                  <p v-if="!item.experiments.length" @click="goToDetail(item.id)">
                    实验列表：暂无实验
                  </p> 
                </div>
              </el-card>
            </el-col> 
            <el-col class="padding-row text-center text-info" v-if="!listData.rows.length" :span="24">暂无数据</el-col>
          </el-row>
        </el-checkbox-group>
      </div>
      <!-- 添加课程 -->
      <el-dialog 
        width="550px"
        title="添加课程" 
        :visible.sync="courseOperaDialog">
          <el-form ref="courseForm" :model="courseForm" label-width="100px" >
            <el-form-item 
              label="课程名称：" 
              prop="name"
              :rules="[
                { required: true, message: '请输入课程名称', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="courseForm.name"></el-input>
            </el-form-item> 
            <el-form-item 
              label="课程代码：" 
              prop="c_code"
              :rules="[
                { required: true, message: '请输入课程代码', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="courseForm.c_code"></el-input>
            </el-form-item> 
            <el-form-item 
              label="课程教师：" 
              prop="c_teacher"
              :rules="[
                { required: true, message: '请输入课程教师', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="courseForm.c_teacher"></el-input>
            </el-form-item>
            <el-form-item 
              label="学年：" 
              prop="c_year"
              :rules="[
                { required: true, message: '请输入学年', trigger: 'blur' }]">
              <el-select v-model="courseForm.c_year" @change="(val) => {yearChange(val, 'add')}">
                <el-option v-for="(item, index) in yearList.rows" :key="index" :value="item.id" :label="item.name"></el-option> 
              </el-select>
            </el-form-item>
            <el-form-item 
              label="学期：" 
              prop="c_stage"
              :rules="[
                { required: true, message: '请选择学期', trigger: 'blur' },
                 ]">
              <el-select v-model="courseForm.c_stage">
                <el-option v-for="(item, index) in schoolList.rows" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item> 
            <el-form-item 
              label="课程性质：" 
              prop="c_nature"
              :rules="[
                { required: true, message: '请输入课程性质', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="courseForm.c_nature"></el-input>
            </el-form-item> 
            <el-form-item 
              label="课程简介：" 
              prop="description"
              :rules="[
                { required: true, message: '请输入课程简介', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]">
              <el-input type="textarea" :rows="6" v-model="courseForm.description"></el-input>
            </el-form-item> 
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="courseOperaDialog = false">取 消</el-button>
            <el-button type="primary" @click="submitCourse('courseForm')">保存</el-button>
          </div>
      </el-dialog>
      <!-- 根据模板添加课程 -->
      <el-dialog 
        width="550px"
        title="创建模板课程" 
        :visible.sync="baseCourseOperaDialog">
          <el-form ref="baseCourseForm" :model="baseCourseForm" label-width="100px" >
            <el-form-item 
              label="模板：" 
              prop="baseCourseID"
              :rules="[
                { required: true, message: '请选择模板', trigger: 'blur' }]">
              <el-select v-model="baseCourseForm.baseCourseID" filterable placeholder="请选择" >
                <el-option v-for="(item, index) in baseCourseList.rows" :value="item.id" :label="item.name"></el-option> 
              </el-select>
            </el-form-item>    
            <el-form-item 
              label="学年：" 
              prop="cYear"
              :rules="[
                { required: true, message: '请输入学年', trigger: 'blur' },]"> 
              <el-select v-model="baseCourseForm.cYear" @change="(val) => {yearChange(val, 'add')}">
                <el-option v-for="(item, index) in yearList.rows" :key="index" :value="item.id" :label="item.name"></el-option> 
              </el-select>
            </el-form-item>
            <el-form-item 
              label="学期：" 
              prop="cStage"
              :rules="[
                { required: true, message: '请输入学期', trigger: 'blur' },]">
              <el-select v-model="baseCourseForm.cStage">
                <el-option v-for="(item, index) in schoolList.rows" :key="index" :value="item.id" :label="item.name"></el-option> 
              </el-select>
            </el-form-item>    
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="baseCourseOperaDialog = false">取 消</el-button>
            <el-button type="primary" @click="submitBaseCourse('baseCourseForm')">保存</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default { 
    data () {
      return {
        ids:          [],  //id数组
        scrollLoadSw: true, //滚动加载开关
        courseOperaDialog: false,
        baseCourseOperaDialog: false,
        dateTE:     null,
        searchForm:  {
          name: null,
          cur_status: null,
          begin_time: null,
          end_time:   null, 
          condition:  null,
          c_year:     null,
          c_stage:    null,
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
        }, 
        baseCourseList: {total: 0, rows: []}, //课时模板列表
        yearList:       {total: 0, rows: []},
        schoolList:     {total: 0, rows: []},
        listData:   {total: 0, rows: []},
        courseForm:{
          "name":           null,
          "description":    null, 
          "c_code":         null,
          "c_teacher":      null,
          "c_nature":       null,
          c_year:           null,
          c_stage:          null,
        },
        baseCourseForm: {
          cYear:            null,
          cStage:           null,
          baseCourseID:     null,
        }
      } 
    },
    watch:{  
      courseOperaDialog(newVal, oldVal){
        this.$refs.courseForm ? this.$refs.courseForm.resetFields() : '';
        // --------- 当弹框为关闭状态时，将学期学期重查一遍
        if(!newVal){
          this.getSchoolList(this.searchForm.c_year);
        }
      }, 
      baseCourseOperaDialog(newVal, oldVal){ 
        this.$refs.baseCourseForm ? this.$refs.baseCourseForm.resetFields() : '';
        // --------- 当弹框为关闭状态时，将学期学期重查一遍
        if(!newVal){
          this.getSchoolList(this.searchForm.c_year);
        }
      }, 
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
      this.getQueryBaseCourse();
      this.getYearList();
      this.getDefaultYearSchool();
     },
    methods: {
      /**
       * 查询默认的学年学期
       * @return {[type]} [description]
       */
      getDefaultYearSchool(){
        this.axios.get(`${this.common.basePath}/configSemester/now`, {}).then((response) => {
          if(response.data.data){ 
            for(let i in response.data.data){
              if(i == '学年'){
                this.searchForm.c_year = response.data.data[i];
                this.getSchoolList(this.searchForm.c_year);
              }else if(i == '学期'){
                this.searchForm.c_stage = response.data.data[i];
              }
            } 
          } 
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /**
       * 查询默认的学年列表
       * @return {[type]} [description]
       */
      getYearList(){
        this.axios.get(`${this.common.basePath}/configSemester?type_id=1`, {}).then((response) => {
          this.yearList = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /**
       * 查询默认的学期列表
       * @return {[type]} [description]
       */
      getSchoolList(parentId){
        this.axios.get(`${this.common.basePath}/configSemester?type_id=2&parent_id=${parentId}`, {}).then((response) => {
          this.schoolList = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      convertState(stage){
        switch (stage){
          case 1:
            return '春季';
            break; 
          case 2:
            return '秋季';
            break; 
          case 3:
            return '夏季';
            break; 
          case 4: 
            return '冬季';
            break; 
        }
      },
      /**
       * 模板列表数据
       * @return {[type]} [description]
       */
      getQueryBaseCourse(){
        this.axios.get(`${this.common.basePath}/baseCourse`, {params: {cur_status: 1}}).then((response) => {
          this.baseCourseList = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        }); 
       }, 
      /*
        是否禁用删除按钮
       */
      isDisabaledDelBtn(){
        if(!this.common.checkAuthority('LessonList_Delete',true) === false){//有权限
          if(this.ids.length!=0){//选中需要删除的课程
            return false;
          }else{//未选中需要删除的课程
            return true;
          }
        }else{//无权限
          return true;
        }
      },

      /*
       * 查询课程列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getQueryList(isRefresh){  
        this.axios.get(`${this.common.basePath}/course`,{params: this._queryParams(isRefresh)}).then((response) => {
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

        this.searchForm.begin_time = this.dateTE ? this.dateTE[0].getTime() : null;
        this.searchForm.end_time = this.dateTE ? this.dateTE[1].getTime() : null;
        return this.searchForm;
      },
      /*
       * 在列表中添加一个是否选中数据的键
       */
      _listAddkey(){

      },
      /*
       * 新建课程
       */
      submitCourse(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/course`,this.courseForm).then((response) => {
              this.courseOperaDialog = false;
              this.$router.push({name: "LessonListDetail", params: {id: response.data.data}});
            }).catch((error) => {
              this.$message.error(error);
              // this.courseOperaDialog = false;
            }); 
          } else { 
            return false;
          } 
        }); 
      },
      /**
       * 创建模板课程
       * @return {[type]} [description]
       */
      submitBaseCourse(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/baseCourse/build`,this.baseCourseForm).then((response) => {
              this.baseCourseOperaDialog = false;
              this.$router.push({name: "LessonListDetail", params: {id: response.data.data}});
            }).catch((error) => {
              this.$message.error(error);
              // this.baseCourseOperaDialog = false;
            }); 
          } else { 
            return false;
          } 
        }); 
      },
      goToDetail (idA) {  
        if(this.common.checkAuthority('LessonList_QueryDetail', true)){
          this.$router.push({name: "LessonListDetail", params: {id: idA}});
        }else{
          this.$message('无权限,不能查看详情');
        }
      },
      goToExersice(idA){
        if(this.common.checkAuthority('LessonList_QueryExersiceDetail', true)){
          this.$router.push({name: "TestDetail", params: {id: idA}});
        }else{
          this.$message('无权限,不能查看详情');
        }
      },
      resetSearchForm(){ 
        this.$refs.searchForm ? this.$refs.searchForm.resetFields() : '';
        this.dateTE = null;
      }, 
      /*
       * 删除实验
       */
      deleteCourse(){
        this.$confirm('是否删除所选课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCourse_();
        }).catch(() => {});
      },
      deleteCourse_(){ 
        this.axios.post(`${this.common.basePath}/course/delete/batch`,this.ids).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getQueryList(true);
          this.ids = [];
        }).catch((error) => {
          this.$message.error(error); 
          this.ids = []; 
        });
      },  
      /**
       * 改变学年时，同时根据学年Id查询学期的数据
       * @param  {[type]} val      [学年Id]
       * @param  {[type]} opeaType [操作类型]
       * @return {[type]}          [description]
       */
      yearChange(val, opeaType){ 
        if(opeaType == 'search'){
          this.searchForm.c_stage = null;
        }
        this.getSchoolList(val);
      }
    }
  }
</script>
<style lang="less">
  
</style>