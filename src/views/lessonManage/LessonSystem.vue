<!-- 课程 -->
<template>
  <div class="content-wrap-box" ref="contentWrap">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="text-bold">
          <div class="breadcrumb-div">
            <div class="fl text-left-div">课程资源</div>
            <div class="text-right fr">
              <el-button 
                :disabled="!common.checkAuthority('Lesson-Data-Add', true)"
                type="primary" 
                @click="courseOperaDialog = true ; 
                $refs.courseForm ? $refs.courseForm.resetFields() : '' ">
                {{common.checkAuthority('Lesson-Data-Add') ? common.checkAuthority('Lesson-Data-Add').name : ''}}
              </el-button>
              <el-button 
                :disabled="isDisabaledDelBtn()" 
                type="danger" 
                @click="deleteCourse">
                {{common.checkAuthority('Lesson-Data-Disabled') ? common.checkAuthority('Lesson-Data-Disabled').name : ''}}
              </el-button> 
            </div>
          </div>
        </el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <!-- 搜索表单 -->
    <el-card class="operation-router-view-wrap mar15">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
        <el-form-item label="课程名称：" prop="name">
          <el-input v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="课程编号：" prop="c_code">
          <el-input v-model="searchForm.c_code"></el-input>
        </el-form-item>
        <el-form-item> 
          <el-button 
            :disabled="!common.checkAuthority('Lesson-Data-List', true)" 
            type="primary" 
            @click="getQueryList(true)">
              {{common.checkAuthority('Lesson-Data-List') ? common.checkAuthority('Lesson-Data-List').name : ''}}
            </el-button>
          <el-button type="primary" @click="resetSearchForm">置空</el-button>
        </el-form-item>
      </el-form> 
    </el-card>
    <div class="router-view-wrap mart0" ref="contentWrap" v-loading="loading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <!-- 卡片 -->
        <el-checkbox-group v-model="ids" size="small" v-if="listData.total>0">
          <el-row class="padding-row">
            <el-col v-if="listData.total>0" :span="8" v-for="(item, index) in listData.rows" :key="index">
              <el-card class="card-wrap card-wrap_ss">
                <el-tag class="width-percentage">
                  <h3 class="card-title">
                    <el-checkbox :label="item.id" :disabled="isDisabaledChangeBtn(item)">&nbsp;</el-checkbox> 
                    <span style="margin-left: -5px;" class="card-title cursor-pointer" @click="goToDetail(item.id)">{{item.name}}</span>
                  </h3> 
                </el-tag>
                <div class="card-content cursor-pointer" @click="goToDetail(item.id)">
                  <p class="marl25 marb0 mart5">编号：{{item.c_code}}</p> 
                  <p class="marl25 marb0 mart5">性质：{{item.c_nature}}</p>
                  <div class="marl25 marb0 mart5 display-flex">
                    <p class="mar0 inline-block">简介：</p>
                    <p class="mar0 inline-block cursor-pointer_T">{{item.description}}</p>
                  </div>
                </div>
                <div class="marl25">
                </div>
              </el-card>
            </el-col> 
          </el-row>
        </el-checkbox-group>
        <el-row class="padding-row text-center text-info" v-if="listData.total===0">暂无数据</el-row>
      </div>
      <!-- 添加课程 -->
      <el-dialog 
        width="550px"
        title="添加课程" 
        :visible.sync="courseOperaDialog">
          <el-form ref="courseForm" :model="courseForm" label-width="100px" >
            <el-form-item 
              label="名称：" 
              prop="name"
              :rules="[
                { required: true, message: '请输入课程名称', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="courseForm.name"></el-input>
            </el-form-item> 
            <el-form-item 
              label="编号：" 
              prop="c_code"
              :rules="[
                { required: true, message: '请输入课程编号', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="courseForm.c_code"></el-input>
            </el-form-item> 
            <el-form-item 
              label="教师：" 
              prop="c_teacher"
              :rules="[
                { required: true, message: '请输入课程教师', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="courseForm.c_teacher"></el-input>
            </el-form-item> 
            <el-form-item 
              label="性质：" 
              prop="c_nature"
              :rules="[
                { required: true, message: '请输入课程性质', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="courseForm.c_nature"></el-input>
            </el-form-item> 
            <el-form-item 
              label="简介：" 
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
    </div>
  </div>
</template>
<script>
  export default { 
    data () {
      return {
        loading:false,
        ids:          [],  //id数组
        scrollLoadSw: true, //滚动加载开关
        searchForm:  {
          name: null,
          c_code:null,
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
        }, 
        listData:   {total: 0, rows: []},
        courseOperaDialog: false,
        courseForm:{
          "name":           null,
          "description":    null, 
          "c_code":         null,
          "c_teacher":      null,
          "c_nature":       null,
        }
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
     },
    methods: {

      /*
        是否禁用 禁用按钮
       */
      isDisabaledDelBtn(){
        if(!this.common.checkAuthority('Lesson-Data-Disabled',true) === false){//有权限
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
        是否禁用选择按钮
       */
      isDisabaledChangeBtn(item){
        if(!this.common.checkAuthority('Lesson-Data-Disabled',true) === false){//有权限
          if(item.cur_status!=2){
            return false;
          }else{
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
        this.axios.get(`${this.common.basePath}/baseCourse`,{params: this._queryParams(isRefresh)}).then((response) => {
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
       * 新建/编辑课程
       */
      submitCourse(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/baseCourse`,this.courseForm).then((response) => {
              this.getQueryList(true);
              this.courseOperaDialog = false;
              this.$message.success(response.data.meta.message);
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
       * 前往详情
       */
      goToDetail (idA) {  
        if(this.common.checkAuthority('Lesson-Data-Detail', true)){
          this.$router.push({name: "LessonSystemCourseDetail", params: {course_id: idA}});
        }else{
          this.$message('无权限,不能查看详情');
        }
      },
      /*
       * 重置
       */
      resetSearchForm(){ 
        this.$refs.searchForm ? this.$refs.searchForm.resetFields() : '';
      }, 
      /*
       * 禁用课程
       */
      deleteCourse(){
        this.$confirm('  你在进行课程模板的操作！如果禁用以后将不能使用此模板创建课程！', '禁用', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCourse_();
        }).catch(() => {});
      },
      deleteCourse_(){ 
        this.axios.post(`${this.common.basePath}/baseCourse/prohibit`,this.ids).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getQueryList(true);
          this.ids = [];
        }).catch((error) => {
          this.$message.error(error); 
          this.ids = []; 
        });
      }, 
    }
  }
</script>
<style lang="less">
  
</style>