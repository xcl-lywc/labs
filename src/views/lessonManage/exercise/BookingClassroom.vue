<template>
  <div class="content-wrap-box"> 
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TestDetail', params: {id: $route.params.experiment_id} }">实验详情</el-breadcrumb-item>
        <el-breadcrumb-item>预约教室</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content"> 
        <el-card>
          <div slot="header" class="clearfix">
            <span class="card-title">预约教室</span> 
          </div> 
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="按教室预约" name="calss">
              <!-- 教室查询 --> 
              <el-card v-if="common.checkAuthority('BookingClassroom_QueryClassroomMoudle', true)" class="box-card">
                <!-- 搜索表单 -->
                <!-- 教室查询条件 -->
                <el-form ref="classOccupyForm" :model="classOccupyForm" label-width="120px">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="教室：" prop="classId">
                        <el-select v-model="classOccupyForm.classId" @change="selectChangeClass">
                          <el-option v-for="(item, index) in classList.rows" :key="index" :value="item.id" :label="item.identifier"></el-option>
                        </el-select>
                        <el-button type="text" class=" marl20" @click="searchOccupyClassDialog = true">占用查询</el-button>
                      </el-form-item> 
                    </el-col>
                  </el-row>  
                </el-form>
                <!-- 预约教室的查询条件 -->
                <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="130px"> 
                  <el-form-item 
                    label="预约节次：" 
                    prop="sTime"
                    :rules="[{ required: true, message: '请选择第一个时间', trigger: 'blur' },
                      {validator: (rule, value, callback) => { dateValid(rule, value, callback, 'sTime') } ,trigger:'blur'},
                    ]">
                    <el-date-picker
                      v-model="searchForm.sTime"
                      type="date" >
                    </el-date-picker> 
                  </el-form-item> 
                  <el-form-item
                    prop="b_index"
                    :rules="[{ required: true, message: '请选择第一个时间的节次', trigger: 'blur' },
                      {validator: (rule, value, callback) => { indexValid(rule, value, callback, 'b_index') } ,trigger:'blur'},
                    ]">
                    <el-input-number type="number" :min="1" v-model="searchForm.b_index"> </el-input-number>
                  </el-form-item>
                  <el-form-item>
                    ~
                  </el-form-item> 
                  <el-form-item  
                    prop="eTime"
                    :rules="[{ required: true, message: '请选择第二个时间', trigger: 'blur' }, 
                    ]">
                    <el-date-picker
                      v-model="searchForm.eTime"
                      type="date" >
                    </el-date-picker> 
                  </el-form-item>
                  <el-form-item
                    prop="e_index"
                    :rules="[{ required: true, message: '请选择第二个时间的节次', trigger: 'blur' },
                      {validator: (rule, value, callback) => { indexValid(rule, value, callback, 'e_index') } ,trigger:'blur'},
                    ]">
                    <el-input-number type="number" :min="1" v-model="searchForm.e_index"> </el-input-number>
                  </el-form-item>
                  
                  <el-form-item>
                    <el-button 
                      :disabled="!common.checkAuthority('BookingClassroom_QueryReserveClass', true)"
                      type="primary" @click="getQuerySelectClass_('searchForm')">
                      {{common.checkAuthority('BookingClassroom_QueryReserveClass') ? common.checkAuthority('BookingClassroom_QueryReserveClass').name : ''}}
                    </el-button>
                  </el-form-item>
                </el-form> 
                <!-- 教室查询结果 -->
                <el-row class="padding-row">
                  <div v-if="selectClassData_.length>0">
                    <el-col :span="8" v-for="(item, index) in selectClassData_[0].timeTableRecords" :key="index">
                      <el-card class="card-class_"> 
                        <el-form label-width="100px" class="show-detail-form">
                          <div>
                            <el-form-item label="占用人：">{{item.user_name}}</el-form-item>
                            <el-form-item label="实验：">{{item.experiment_name}}</el-form-item>
                            <el-form-item label="院系：">{{item.faculty_name}}</el-form-item>
                            <el-form-item label="联系电话：">{{item.phone_num}}</el-form-item>
                            <!-- <el-form-item label="原因：">
                              <p class="cursor-pointer_T">{{item.reason}}</p>
                            </el-form-item> -->
                          </div> 
                        </el-form>
                      </el-card>
                    </el-col>
                  </div>
                </el-row>
                <div class="text-right mart10"> 
                  <el-button 
                    :disabled="!common.checkAuthority('BookingClassroom_ReserveClassroom', true)"
                    type="primary" @click=" reserveClass_ ">
                    {{common.checkAuthority('BookingClassroom_ReserveClassroom') ? common.checkAuthority('BookingClassroom_ReserveClassroom').name : ''}}
                  </el-button>
                </div>
              </el-card>
              <!-- 预约教室 -->
              <!-- <div class="text-right">
                <el-button type="primary" class=" mart20" @click="searchClassDialog = true">余量查询</el-button>
              </div> -->
            </el-tab-pane>
            <el-tab-pane label="按实验室预约" name="lab">
              <!-- 教室查询 --> 
              <el-card v-if="common.checkAuthority('BookingClassroom_QueryClassroomMoudle', true)" class="box-card">
                <!-- 搜索表单 -->
                <!-- 教室查询条件 -->
                <el-form ref="labOccupyForm" :model="labOccupyForm" label-width="120px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="实验室：" prop="id">
                        <el-select v-model="labOccupyForm.id" @change="selectChangeLab">
                          <el-option v-for="(item, index) in labList.rows" :key="index" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                      </el-form-item> 
                    </el-col>
                    <el-col :span="12"> 
                      <el-form-item label="上课人数：" prop="size"> 
                        <el-input-number :min="1" @change="inputChangeLab" type="number" v-model="labOccupyForm.size"> </el-input-number>
                        <el-button type="text" class=" marl20" @click="searchClassDialog = true">余量查询</el-button>
                      </el-form-item> 
                    </el-col>      
                  </el-row>  
                </el-form>
                 <!-- 预约教室的查询条件 -->
                <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="130px"> 
                  <el-form-item 
                    label="预约节次：" 
                    prop="sTime"
                    :rules="[{ required: true, message: '请选择第一个时间', trigger: 'blur' },
                      {validator: (rule, value, callback) => { dateValid(rule, value, callback, 'sTime') } ,trigger:'blur'},
                    ]">
                    <el-date-picker
                      v-model="searchForm.sTime"
                      type="date" >
                    </el-date-picker> 
                  </el-form-item> 
                  <el-form-item
                    prop="b_index"
                    :rules="[{ required: true, message: '请选择第一个时间的节次', trigger: 'blur' },
                      {validator: (rule, value, callback) => { indexValid(rule, value, callback, 'b_index') } ,trigger:'blur'},
                    ]">
                    <el-input-number type="number" :min="1" v-model="searchForm.b_index"> </el-input-number>
                  </el-form-item>
                  <el-form-item>
                    ~
                  </el-form-item> 
                  <el-form-item  
                    prop="eTime"
                    :rules="[{ required: true, message: '请选择第二个时间', trigger: 'blur' }, 
                    ]">
                    <el-date-picker
                      v-model="searchForm.eTime"
                      type="date" >
                    </el-date-picker> 
                  </el-form-item>
                  <el-form-item
                    prop="e_index"
                    :rules="[{ required: true, message: '请选择第二个时间的节次', trigger: 'blur' },
                      {validator: (rule, value, callback) => { indexValid(rule, value, callback, 'e_index') } ,trigger:'blur'},
                    ]">
                    <el-input-number type="number" :min="1" v-model="searchForm.e_index"> </el-input-number>
                  </el-form-item>
                  
                  <el-form-item>
                    <el-button 
                      :disabled="!common.checkAuthority('BookingClassroom_QueryReserveClass', true)"
                      type="primary" @click="getQuerySelectClass('searchForm')">
                      {{common.checkAuthority('BookingClassroom_QueryReserveClass') ? common.checkAuthority('BookingClassroom_QueryReserveClass').name : ''}}
                    </el-button>
                  </el-form-item>
                </el-form> 
                <!-- 教室查询结果 -->
                <el-row class="padding-row">
                  <el-col :span="8" v-for="(item, index) in selectClassData" :key="index">
                    <el-card class="card-class"> 
                      <p>
                        <el-checkbox 
                          :disabled="item.timeTableRecord ? !item.timeTableRecord.l_bespeak_id : false" 
                          class="fl marr10"  v-model="item.isChecked"> 
                        </el-checkbox>
                        <span class="fl marl10">容量：{{item.size}} </span>
                      </p>
                      <br/>
                      <p>教室地址：{{item.address}}</p> 

                      <div style="color: #c7a53d" v-if="item.timeTableRecord ? !item.timeTableRecord.l_bespeak_id : false"> 
                        已被实验室占用，不能再强行预约
                      </div>
                      <div v-if="item.timeTableRecord ? item.timeTableRecord.l_bespeak_id : false">
                        <p class=""><el-tag type="info">{{item.timeTableRecord.faculty_name}}</el-tag> 的 <el-tag type="info">{{item.timeTableRecord.user_name}}</el-tag> 在 <el-tag type="info">{{item.timeTableRecord.experiment_name}}</el-tag> 下占用了该教室。</p>
                        <p>占用人联系电话：{{item.timeTableRecord.phone_num}}</p>
                      </div> 
                    </el-card>
                  </el-col>
                </el-row>
                <div class="text-right mart10"> 
                  <el-button 
                    :disabled="!common.checkAuthority('BookingClassroom_ReserveClassroom', true)"
                    type="primary" @click=" reserveClass ">
                    {{common.checkAuthority('BookingClassroom_ReserveClassroom') ? common.checkAuthority('BookingClassroom_ReserveClassroom').name : ''}}
                  </el-button>
                </div>
              </el-card>
              <!-- 预约教室 -->
              <!-- <div class="text-right">
                <el-button type="primary" class=" mart20" @click="searchClassDialog = true">余量查询</el-button>
              </div> -->
            </el-tab-pane> 
          </el-tabs>
        </el-card>
        
        <!-- 余量查询（按实验室预约） -->
        <el-dialog 
          width="70vw"
          title="余量查询" 
          :visible.sync="searchClassDialog"> 
          <!-- 搜索表单 -->
          <el-form ref="labOccupyForm" :model="labOccupyForm" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="实验室：" prop="id">
                  <el-select v-model="labOccupyForm.id" @change="selectChangeLab">
                    <el-option v-for="(item, index) in labList.rows" :key="index" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item> 
              </el-col>
              <el-col :span="12"> 
                <el-form-item label="上课人数：" prop="size"> 
                  <el-input-number :min="1" @change="inputChangeLab" type="number" v-model="labOccupyForm.size"> </el-input-number>
                </el-form-item> 
              </el-col>       
            </el-row>  
          </el-form>
          <div v-if="common.checkAuthority('BookingClassroom_QueryReserveClassroomMoudle', true) && classTableData.length" class="box-card mart20">  
            <!-- 实验查询 -->
            <p class="mar20">
              <i class="color-box green"></i>容量充足，
              <i class="color-box red"></i>容量不足
            </p> 
            <div class="hand-table-div" v-if="classTableData.length">
              <div class="thead">
                <div class="tab-index-class"><span>时&nbsp;&nbsp;段</span></div>
                <div class="tab-index-class shangwu shijianduan"><span>上午</span></div>
                <div class="tab-index-class xiawu shijianduan"><span>下午</span></div>
                <div class="tab-index-class wanshang shijianduan"><span>晚上</span></div>
                <div class="tab-index-class zhongwu shijianduan"><span>中午</span></div>
              </div>
              <div class="thead">  
                <div class="tab-index-class"><span>节&nbsp;&nbsp;次</span></div>
                <div class="tab-content-class" v-for="(itemVal, indexVal) in classTableData[0].result" :key="indexVal">
                  <span>
                    {{indexVal + 1}}
                  </span>
                </div> 
              </div> 
              <div class="tbody" v-if="classTableData.length" v-for="(item, index) in classTableData">
                <div class="tab-index-class">
                  <span>
                    <strong>{{common.getWeek(item.date)}}</strong><br/>
                    {{common._convertDate(item.date, 'yyyy/MM/dd')}}
                  </span>
                </div>
                <div class="tab-content-class" 
                  v-for="(itemVal, indexVal) in item.result" 
                  :key="indexVal" :class="itemVal ? 'green' : 'red' ">
                    <span><!-- {{itemVal}} -->&nbsp;<br/>&nbsp;</span>
                </div>
              </div> 
            </div>  
            <div class="text-right mart10">
              <!-- 上一周 -->
              <el-button 
                :disabled="!common.checkAuthority('BookingClassroom_QueryLastWeek', true)"
                type="primary" @click="getQueryLabOccupy('last')">
                {{common.checkAuthority('BookingClassroom_QueryLastWeek') ? common.checkAuthority('BookingClassroom_QueryLastWeek').name : ''}}
              </el-button>
              <!-- 本周 -->
              <el-button 
                :disabled="!common.checkAuthority('BookingClassroom_QueryThisWeek', true)"
                type="primary" @click="getQueryLabOccupy('this')">
                {{common.checkAuthority('BookingClassroom_QueryThisWeek') ? common.checkAuthority('BookingClassroom_QueryThisWeek').name : ''}}
              </el-button>
              <!-- 下一周 -->
              <el-button 
                :disabled="!common.checkAuthority('BookingClassroom_QueryNextWeek', true)"
                type="primary" @click="getQueryLabOccupy('next')">
                {{common.checkAuthority('BookingClassroom_QueryNextWeek') ? common.checkAuthority('BookingClassroom_QueryNextWeek').name : ''}}
              </el-button>
            </div>
          </div>
        </el-dialog>

        <!-- 占用查询（按教室预约） -->
        <el-dialog 
          width="70vw"
          title="占用查询" 
          :visible.sync="searchOccupyClassDialog"> 
          <!-- 搜索表单 -->
          <el-form ref="classOccupyForm" :model="classOccupyForm" label-width="120px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="实验室：" prop="classId">
                  <el-select v-model="classOccupyForm.classId" @change="selectChangeClass">
                    <el-option v-for="(item, index) in classList.rows" :key="index" :value="item.id" :label="item.identifier"></el-option>
                  </el-select>
                </el-form-item> 
              </el-col>      
            </el-row>  
          </el-form>
          <div v-if="common.checkAuthority('BookingClassroom_QueryReserveClassroomMoudle', true) && classOccupyTableData.length" class="box-card mart20">  
            <!-- 实验查询 -->
            <p class="mar20">
              <i class="color-box green"></i>未占用，
              <i class="color-box red"></i>占用
            </p> 
            <div class="hand-table-div" v-if="classTableData.length">
              <div class="thead">
                <div class="tab-index-class"><span>时&nbsp;&nbsp;段</span></div>
                <div class="tab-index-class shangwu shijianduan"><span>上午</span></div>
                <div class="tab-index-class xiawu shijianduan"><span>下午</span></div>
                <div class="tab-index-class wanshang shijianduan"><span>晚上</span></div>
                <div class="tab-index-class zhongwu shijianduan"><span>中午</span></div>
              </div>
              <div class="thead">  
                <div class="tab-index-class"><span>节&nbsp;&nbsp;次</span></div>
                <div class="tab-content-class" v-for="(itemVal, indexVal) in classTableData[0].result" :key="indexVal">
                  <span>
                    {{indexVal + 1}}
                  </span>
                </div> 
              </div> 
              <div class="tbody" v-if="classTableData.length" v-for="(item, index) in classTableData">
                <div class="tab-index-class">
                  <span>
                    <strong>{{common.getWeek(item.date)}}</strong><br/>
                    {{common._convertDate(item.date, 'yyyy/MM/dd')}}
                  </span>
                </div>
                <div class="tab-content-class" 
                  v-for="(itemVal, indexVal) in item.result" 
                  :key="indexVal" :class="itemVal ? 'green' : 'red' ">
                    <span><!-- {{itemVal}} -->&nbsp;<br/>&nbsp;</span>
                </div>
              </div> 
            </div>  
            <div class="text-right mart10">
              <!-- 上一周 -->
              <el-button 
                :disabled="!common.checkAuthority('BookingClassroom_QueryLastWeek', true)"
                type="primary" @click="getQueryLabOccupyClass('last')">
                {{common.checkAuthority('BookingClassroom_QueryLastWeek') ? common.checkAuthority('BookingClassroom_QueryLastWeek').name : ''}}
              </el-button>
              <!-- 本周 -->
              <el-button 
                :disabled="!common.checkAuthority('BookingClassroom_QueryThisWeek', true)"
                type="primary" @click="getQueryLabOccupyClass('this')">
                {{common.checkAuthority('BookingClassroom_QueryThisWeek') ? common.checkAuthority('BookingClassroom_QueryThisWeek').name : ''}}
              </el-button>
              <!-- 下一周 -->
              <el-button 
                :disabled="!common.checkAuthority('BookingClassroom_QueryNextWeek', true)"
                type="primary" @click="getQueryLabOccupyClass('next')">
                {{common.checkAuthority('BookingClassroom_QueryNextWeek') ? common.checkAuthority('BookingClassroom_QueryNextWeek').name : ''}}
              </el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div> 
  </div>
</template>
<script>
  import testPaper from '../../../components/TestPaperC.vue'
  export default {
    data () {
      return {
        activeName:'lab',

        labList:          {rows: [], total: 0}, //实验室列表
        classList:        {rows: [], total: 0}, //教室列表

        labOccupyForm:    { //教室的查询条件（按实验室预约）
          size:  30,
          date:  null,
          id:    null,
        },
        classOccupyForm:   { //教室的查询条件（按教室预约）
          date:  null,
          classId:    null,
        },  
        searchForm:       { //预约教室的查询条件
          sTime:    new Date(),
          eTime:    new Date(),
          b_index:  1,
          e_index:  2,
          id:       null,
          size:     30, 
        },

        searchClassDialog:      false,// 余量查询弹框（按实验室预约）
        classTableData:         [], // 余量的table（按实验室预约）

        searchOccupyClassDialog:false,// 占用查询弹框（按教室预约）
        classOccupyTableData:   [], // 占用的table（按教室预约）
        
        selectClassData:   [], //预约教室（按实验室预约）
        selectClassData_:  [], //预约教室（按教室预约）
        
        ids:              [], //存储被选中的教室Id  
         
      }
    },
    components:{
      'test-parper': testPaper,
    },
    mounted(){  
      this.getQuerylabList();
    },
    methods: { 
      /**
       * tab切换
       */
      handleClick(tab, event) {
        this.activeName = tab.name;
        this.resetForm('searchForm');
        if(tab.name==='lab'){
          this.getQuerylabList();
        }else{
          this.getQueryclassList();
        }
      },
      /**
       * 重置表单
       */
      resetForm(formName){ 
        this.$refs[formName] ? this.$refs[formName].resetFields() : '';
      },

      /*
       * 时间验证
       */
      dateValid(rule, value, callback, keyName){ 
        if(this.common._convertDate(this.searchForm.sTime, 'yyyyMMdd') > this.common._convertDate(this.searchForm.eTime, 'yyyyMMdd')){
          callback(new Error('第一个时间不能大于第二个时间'));
        }else{
          callback();
        }
      },
      /*
       * 节次验证
       */
      indexValid(rule, value, callback, keyName){  
        if(value > this.classTableData[0].result.length) callback(new Error(`最大节不能大于${this.classTableData[0].result.length}`));
        if(this.searchForm.b_index > this.searchForm.e_index){
          callback(new Error('第一个节次不能大于第二个节次'));
        }else{
          callback();
        }
      },

      /*
       * 查询实验室列表
       */
      getQuerylabList(){ 
        this.axios.get(`${this.common.basePath}/lab/list`,'').then((response) => {
          this.labList = response.data.data; 
          this.labOccupyForm.id = this.searchForm.id = this.labList.rows ? this.labList.rows.length ? this.labList.rows[0].id : null : null;
          this.getQueryLabOccupy();
          this.getQuerySelectClass();
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      }, 
      /*
       * 查询教室列表
       */
      getQueryclassList(){ 
        this.axios.get(`${this.common.basePath}/class/list`,{params:{pageNum:1,pageSize:999999999}}).then((response) => {
          this.classList = response.data.data; 
          this.classOccupyForm.classId = this.searchForm.id = this.classList.rows ? this.classList.rows.length ? this.classList.rows[0].id : null : null;
          this.getQueryLabOccupyClass();
          this.getQuerySelectClass_();
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      }, 

      /*
       * 余量查询
       */
      getQueryLabOccupy(symbol){  
        // ------------ 改变时间,如果没有值就默认当前时间 -------------
        this.labOccupyForm.date =  !this.labOccupyForm.date ? 
                this.common._convertDate(new Date(), 'yyyy/MM/dd') : this.addDays(this.labOccupyForm.date,7,symbol); 

        this.axios.get(`${this.common.basePath}/lab/occupy`, {params: this.labOccupyForm}).then((response) => {
          let lastData = null, convertData = [];
          // --------------- 将星期天移动到第一位 ----------- 
          // if(response.data.data){
          //   if(response.data.data.length){ 
          //     lastData = response.data.data[response.data.data.length-1];
          //     response.data.data.splice(response.data.data.length-1,1);
          //     response.data.data.splice(0,0,lastData);
          //   }
          // }  
          this.classTableData = response.data.data; 
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      }, 
      /*
       * 占用查询
       */
      getQueryLabOccupyClass(symbol){  
        // ------------ 改变时间,如果没有值就默认当前时间 -------------
        this.classOccupyForm.date =  !this.classOccupyForm.date ? 
                this.common._convertDate(new Date(), 'yyyy/MM/dd') : this.addDays(this.classOccupyForm.date,7,symbol); 

        this.axios.get(`${this.common.basePath}/lab/occupy/class`, {params: this.classOccupyForm}).then((response) => {
          let lastData = null, convertData = [];
          // --------------- 将星期天移动到第一位 ----------- 
          // if(response.data.data){
          //   if(response.data.data.length){ 
          //     lastData = response.data.data[response.data.data.length-1];
          //     response.data.data.splice(response.data.data.length-1,1);
          //     response.data.data.splice(0,0,lastData);
          //   }
          // }  
          this.classOccupyTableData = response.data.data; 
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      }, 

      /*
       * 添加时间并将时间转为年月日
       * @params {string} date // 当前时间
       * @params {string} days // 添加天数
       * @params {string} symbol // 符号 last(-) 或者 next(+) 或者 this(本周) 为空的情况下，表示默认查询之前被查询过的时间
       */
      addDays(date, days, symbol){  
        let nd = new Date(date);
            nd = nd.valueOf();
        switch(symbol){ 
          case 'last':
            nd = nd - days * 24 * 60 * 60 * 1000;
            break;
          case 'next':
            nd = nd + days * 24 * 60 * 60 * 1000;
            break;
          case 'this':
            nd = new Date();
            break; 
        }
        nd = this.common._convertDate(nd, 'yyyy/MM/dd')
            // nd = symbol == 'last' ? nd - days * 24 * 60 * 60 * 1000 : nd + days * 24 * 60 * 60 * 1000;
            // nd = symbol == 'this' ? this.common._convertDate(new Date(), 'yyyy/MM/dd') : this.common._convertDate(new Date(nd), 'yyyy/MM/dd');
            return nd;
      },

      /*
       * 查询预约教室（按实验室预约）
       */
      getQuerySelectClass(formName){   
        if(!formName){
          this._selectClassAxios();
        }else{
          this.$refs[formName].validate((valid) => {
            if (valid) { 
              this._selectClassAxios();
            } else { 
              return false;
            }
          }); 
        } 
      }, 
      _selectClassAxios(){   
        this.axios.post(`${this.common.basePath}/lab/select/class`, this._selectClassParams()).then((response) => {
          this.selectClassData = this._selectClassDataAddKey(response.data.data); 
        }).catch((error) => {
          this.$message.error(error); 
        });   
      }, 
      _selectClassParams(){ 
        return { //预约教室的查询条件 
          sTime:    this.searchForm.sTime ? this.searchForm.sTime.getTime() : null,
          eTime:    this.searchForm.eTime ? this.searchForm.eTime.getTime() : null,
          b_index:  this.searchForm.b_index,
          e_index:  this.searchForm.e_index,
          id:       this.searchForm.id,
          size:     this.searchForm.size,  
        }
      },
      /*
       * 查询预约教室（按教室预约）
       */
      getQuerySelectClass_(formName){   
        if(!formName){
          this._selectClassAxios_();
        }else{
          this.$refs[formName].validate((valid) => {
            if (valid) { 
              this._selectClassAxios_();
            } else { 
              return false;
            }
          }); 
        } 
      }, 
      _selectClassAxios_(){   
        this.axios.post(`${this.common.basePath}/lab/select/all-class`, this._selectClassParams_()).then((response) => {
          this.selectClassData_ = this._selectClassDataAddKey(response.data.data); 
        }).catch((error) => {
          this.$message.error(error); 
        });   
      }, 
      _selectClassParams_(){ 
        return { //预约教室的查询条件 
          sTime:    this.searchForm.sTime ? this.searchForm.sTime.getTime() : null,
          eTime:    this.searchForm.eTime ? this.searchForm.eTime.getTime() : null,
          b_index:  this.searchForm.b_index,
          e_index:  this.searchForm.e_index,
          classId:  this.searchForm.id, 
        }
      },
      /*
       * 给课程添加一个key
       */
      _selectClassDataAddKey(data){
        data.forEach((item) => {
          item.isChecked = false;
        });
        return data;
      },

      /*
       * 预约教室 （按实验室预约）
       */
      reserveClass(){ 
        // -------------- 组装Id ----------------
        this.ids = []; 
        this.selectClassData.forEach((item) => {
          if(item.isChecked) this.ids.push(item.id);
        });
        if(!this.ids.length) { this.$message.warning('请选择要预约的教室'); return false;}
        let reserveForm = {
          ids:      this.ids,
          sTime:    this.searchForm.sTime,
          eTime:    this.searchForm.eTime,
          b_index:  this.searchForm.b_index,
          e_index:  this.searchForm.e_index, 
          reason:   '无',
          experiment_id: this.$route.params.experiment_id,
          owner_id:      sessionStorage.getItem('Access-Key'),
        }
        this.axios.post(`${this.common.basePath}/lab/reserve/class`, reserveForm).then((response) => {
          this.$message.success(response.data.meta.message); 
          this.activeName=='lab'?this.getQuerySelectClass('searchForm'):this.getQuerySelectClass_('searchForm');
          this.getQueryLabOccupy();
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
      /*
       * 预约教室 （按教室预约）
       */
      reserveClass_(){ 

        this.$prompt('请输入备注', '备注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/\S/,
          inputErrorMessage: '未输入备注',
          inputType:'textarea'
        }).then(({ value }) => {
          let reserveForm = {
            ids:  [this.searchForm.id],
            sTime:    this.searchForm.sTime,
            eTime:    this.searchForm.eTime,
            b_index:  this.searchForm.b_index,
            e_index:  this.searchForm.e_index, 
            reason:   value,
            experiment_id: this.$route.params.experiment_id,
            owner_id:      sessionStorage.getItem('Access-Key'),
          }
          this.axios.post(`${this.common.basePath}/lab/reserve/class`, reserveForm).then((response) => {
            this.$message.success(response.data.meta.message); 
            this.activeName=='lab'?this.getQuerySelectClass('searchForm'):this.getQuerySelectClass_('searchForm');
            this.getQueryLabOccupy();
          }).catch((error) => {
            this.$message.error(error); 
          });
        }).catch(() => {});
      },
      
      /*
       * 改变实验室，就重查
       */
      selectChangeLab(val){ 
        this.labOccupyForm.id = this.searchForm.id = val;
        this.labOccupyForm.date = null;
        this.getQueryLabOccupy();
      },
      inputChangeLab(){
        this.searchForm.size = this.labOccupyForm.size;
        this.labOccupyForm.date = null;
        this.getQueryLabOccupy();
      },
      /*
       * 改变教室，就重查
       */
      selectChangeClass(val){ 
        this.classOccupyForm.classId = this.searchForm.id = val;
        this.labOccupyForm.date = null;
        this.getQueryLabOccupyClass();
      },

      /**
       * 选择需要预约的教室
       */
      selectRoom(val,item){ 
        val === true ? this.ids.push(item.id) : this.deleteId(item.id, 'ids');      
      },
      deleteId(item, keyName){
        for(var i = 0;i<this[keyName].length;i++){this[keyName][i] === item ? this[keyName].splice(i,1) : this[keyName];};
      },  
    }
  }
</script>
<style lang="less">
  .card-class{
    height: 220px;
    overflow:auto;
  }
  .card-class_{
    height: 220px;
    overflow:auto;
  }
  .hand-table-div{
    border-right: 1px solid #e5e1e1;
    border-bottom: 1px solid #e5e1e1;
    .thead{ 
      .tab-index-class{
        /*border: 1px solid #e5e1e1;
        border-right: none;*/
      }
      .tab-content-class{
        /*border: 1px solid #e5e1e1;
        border-right: none;*/
      }
    }
    .tab-index-class{
        width: 100px;
        display: inline-block;
        >span{
          display: inline-block;
          width: 100%;
        }
      }
      .tab-content-class{
        width: calc((100% - 100px) / 14);
        display: inline-block;
        >span{
          display: inline-block;
          width: 100%;
        }
      }

    .tbody{ 
      text-align: center; 
      display: flex;
    }
    span{
      border: 1px solid #e5e1e1;
      padding: 4px 0px;
      color: #909399;
      border-bottom: none;
      text-align: center;
      box-sizing: content-box;
      border-right: none;
    }
  }
  .shijianduan{
    /*height: 172px;*/
    /*border: 1px solid #e5e1e1;*/
    border-bottom: none;
    border-right: none;
    justify-content: space-evenly;
    align-items: center;
    display: flex;
    font-weight: 700;
    color: #909399;
  }
  .shangwu{
    width: calc((100% - 100px) / 14 * 4)!important;
  }
  .zhongwu{
    width: calc((100% - 100px) / 14 * 2)!important;
  }
  .xiawu{
    width: calc((100% - 100px) / 14 * 4)!important;
  }
  .wanshang{
    width: calc((100% - 100px) / 14 * 4)!important;
  }
</style>