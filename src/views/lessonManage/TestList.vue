<!-- 课程 -->
<template>
  <div class="content-wrap-box" ref="contentWrap">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="text-bold">
            <div class="breadcrumb-div">
              <div class="fl text-left-div">实验列表</div>
              <div class="text-right fr">
                <el-button type="primary" 
                  :disabled="!common.checkAuthority('TestList_Add', true)"
                  @click=" courseOperaDialog = true ; $refs.submitForm ? $refs.submitForm.resetFields() : '' ">
                  {{common.checkAuthority('TestList_Add') ? common.checkAuthority('TestList_Add').name : ''}}
                </el-button>
                <el-button 
                  :disabled="isDisabaledDelBtn()"
                  type="danger" @click="deleteExperiment">
                  {{common.checkAuthority('TestList_Delete') ? common.checkAuthority('TestList_Delete').name : ''}}
                </el-button>  
              </div>
            </div>
          </el-breadcrumb-item> 
        </el-breadcrumb>
      </el-breadcrumb>
    </el-card>
    <!-- 搜索表单 -->
    <el-card class="operation-router-view-wrap mar15"  :body-style="{ 'padding-bottom': '0px' }">
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
        <el-form-item label="实验课程：" prop="course_id">
          <el-select v-model="searchForm.course_id">
            <el-option v-for="(item, index) in courseListData.rows" :key="index" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验名称：" prop="name">
          <el-input v-model="searchForm.name"></el-input>
        </el-form-item> 
        <el-form-item label="创建时间：">
          <el-date-picker
            v-model="dateTE"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实验状态：" prop="condition">
          <el-select v-model="searchForm.condition">
            <el-option value="1" label="我参与"></el-option>
            <el-option value="2" label="没老师"></el-option>
            <el-option value="3" label="没学生"></el-option>
            <el-option value="4" label="没任务"></el-option>
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
            :disabled="!common.checkAuthority('TestList_QueryList', true)"
            type="primary" @click="getQueryList(true)">
              {{common.checkAuthority('TestList_QueryList') ? common.checkAuthority('TestList_QueryList').name : ''}}
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
              <el-card class="card-wrap card-wrap_s" style="height: 343px!important;">
                <el-tag class="width-percentage">
                  <h3 class="card-title">
                    <el-checkbox :label="item.id" :disabled="!common.checkAuthority('TestList_Delete',true)">&nbsp;</el-checkbox> 
                    <span style="margin-left: -5px;" @click="goToDetail(item.id)" class="card-title cursor-pointer">{{item.name}}</span>
                  </h3>
                </el-tag>
                <div class="mar10">
                  <p class=" card-content cursor-pointer_T mart5" @click="goToDetail(item.id)" style="height: 158px;-webkit-line-clamp: 11;">
                    描述：{{item.description}}
                  </p>
                  <div class="card-bottom cursor-pointer" @click="goToDetail(item.id)"> 
                    <div v-if="item.bespeakRecords.length" class="mart10" style="line-height: 19px; height: 75px;">
                      <span>实验安排：</span>
                      <p class="mar0 mart5" v-for="(itemK, indexK) in item.bespeakRecords" style="line-height: 19px;"> 
                        <span>{{common._convertDate(itemK.begin_time, 'yyyy.MM.dd')}}：</span>
                        <span>{{itemK.begin_index}} ~ </span>
                        <span>{{common._convertDate(itemK.begin_time, 'yyyy.MM.dd')}}：</span>
                        <span>{{itemK.end_index}}</span>
                        教室：<span v-for="(itemC, indexC) in itemK.classRooms" :key="indexC">{{itemC.name}}{{indexC < itemK.classRooms.length -1 ? '、' : ''}}</span>
                      </p>
                    </div>
                    <div class="mar0 " v-if="!item.bespeakRecords.length" style="height: 75px;"><p class="mar0" >实验安排：暂无安排</p></div> 
                    <!-- <span class="creator"></span>
                    <span class="time">{{item.creatorName}}创建于{{common._convertDate(item.create_time, 'yyyy年MM月dd日')}} 
                    </span> -->
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col class="padding-row text-center text-info" v-if="!listData.rows.length" :span="24">暂无数据</el-col>
          </el-row>
        </el-checkbox-group>
      </div>
      <!-- 创建实验 -->
      <el-dialog 
        width="550px"
        title="创建实验" 
        :visible.sync="courseOperaDialog">
          <el-form ref="submitForm" :model="submitForm" label-width="100px" >
            <el-form-item 
              label="所属课程：" 
              prop="course_id"
              :rules="[{ required: true, message: '请选择课程', trigger: 'blur' },]">
              <el-select v-model="submitForm.course_id">
                <el-option v-for="(item, index) in courseListData.rows" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item 
              label="实验名称：" 
              prop="name"
              :rules="[
                { required: true, message: '请输入课程名称', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="submitForm.name"></el-input>
            </el-form-item> 
            <el-form-item 
              label="实验类型：" 
              prop="etype"
              :rules="[{ required: true, message: '请选择实验类型', trigger: 'blur' },]">
              <el-radio-group v-model="submitForm.etype">
                <el-radio :label="1">个人实验</el-radio>
                <el-radio :label="2">小组实验</el-radio> 
              </el-radio-group>
            </el-form-item> 
            <el-form-item 
              label="实验简介：" 
              prop="description"
              :rules="[
                { required: true, message: '请输入实验简介', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]">
              <el-input type="textarea" :rows="6" v-model="submitForm.description"></el-input>
            </el-form-item> 
            <el-form-item 
              label="得分占比：" 
              prop="value"
              :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
              <el-input-number type="number" :min="1" :max="100" v-model="submitForm.value"></el-input-number> %
            </el-form-item> 
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="courseOperaDialog = false">取 消</el-button>
            <el-button type="primary" @click="submit('submitForm')">保存</el-button>
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
        dateTE:       null,
        searchForm:  {
          name: null,
          course_id: null,
          begin_time: null,
          end_time:   null,
          condition:  null,
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
          c_year:           null,
          c_stage:          null,
        }, 
        listData:         {total: 0, rows: []},
        courseListData:   {total: 0, rows: []},
        yearList:         {total: 0, rows: []},
        schoolList:       {total: 0, rows: []},
        courseOperaDialog: false,
        submitForm:{
          "name":           null,
          "description":    null, 
          "etype":          null,
          "course_id":      null,
          "value":          null,
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
      this.getQueryCourseList();
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
       * 查询学年列表
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
       * 查询学期列表
       * @return {[type]} [description]
       */
      getSchoolList(parentId){
        this.axios.get(`${this.common.basePath}/configSemester?type_id=2&parent_id=${parentId}`, {}).then((response) => {
          this.schoolList = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      },

      /*
        是否禁用删除按钮
       */
      isDisabaledDelBtn(){
        if(!this.common.checkAuthority('TestList_Delete',true) === false){//有权限
          if(this.ids.length!=0){//选中需要删除的实验
            return false;
          }else{//未选中需要删除的实验
            return true;
          }
        }else{//无权限
          return true;
        }
      },

      /*
       * 查询实验列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getQueryList(isRefresh){  
        this.axios.get(`${this.common.basePath}/experiment`,{params: this._queryParams(isRefresh)}).then((response) => {
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
        this.searchForm.orderId = 1;
        this.searchForm.begin_time = this.dateTE ? this.dateTE[0].getTime() : null;
        this.searchForm.end_time = this.dateTE ? this.dateTE[1].getTime() : null;
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
      /*
       * 新建实验
       */
      submit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/experiment`,this.submitForm).then((response) => {
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
      goToDetail (idA) {
        if(this.common.checkAuthority('TestList_QueryDetail', true)){
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
      deleteExperiment(){
        this.$confirm('是否删除所选实验?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteExperiment_();
        }).catch(() => {});
      },
      deleteExperiment_(){  
        this.axios.post(`${this.common.basePath}/experiment/delete/batch`,this.ids).then((response) => {
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
  /*.cursor-pointer_T{
    height: 214px;
    -webkit-line-clamp: 11;
    background: rgba(153, 204, 193, 0.1); 
    border-radius: 6px;
    padding: 5px;
    box-sizing: border-box;
  }*/
</style>