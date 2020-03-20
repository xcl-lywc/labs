<template>
  <div class="content-wrap-box" ref="contentWrap">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lab/classroomlist' }">教室列表</el-breadcrumb-item>
        <el-breadcrumb-item>教室详情</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg" v-loading="loading">
      <!-- 页面主要内容 -->
      <div class="router-view-content" v-if="detailInfo">
        <!-- <h2 class="top-title"><span>{{'教室名称：'+detailInfo.identifier}}</span></h2> -->
        <el-form label-width="110px" class="detail-info" :inline="true">
          <el-card>
            <div slot="header"><span class="card-title">教室详情</span></div>
            <!-- <p class="detail-info-title">教室详情</p> -->
            <el-row v-if="detailInfo">
              <el-form-item label="教室编号：">{{detailInfo.identifier}}</el-form-item>
              <el-form-item label="地址：">{{detailInfo.address}}</el-form-item>
              <el-form-item label="坐标：">{{detailInfo.coordinates}}</el-form-item>
              <el-form-item label="教室使用须知：">{{detailInfo.instructions}}</el-form-item>
            </el-row>
          </el-card> 
        </el-form>
        <el-form label-width="110px" class="detail-info">  
          <el-card class="mart20">
            <div slot="header"><span class="card-title">实验室容量表</span></div>
            <!-- <p class="detail-info-title">实验室容量表</p> -->
            <el-row class="padding-row">
              <div v-if="capacityInfo">
                <el-col v-for="(item, index) in capacityInfo" :span="6" :key="index">
                  <el-card>
                    <el-form-item label="容量：">
                      <span>{{item.capacity}}</span>
                      &nbsp;&nbsp;&nbsp;<i class="el-icon-edit" @click="editCap(item.id)" v-if="common.checkAuthority('ClassroomDetail_EditCapacity',true)"></i>
                    </el-form-item>
                    <el-form-item label="实验室名称：">{{item.labName}}</el-form-item>
                    <!-- <el-form-item label="地址：">{{item.address}}</el-form-item> -->
                  </el-card>
                </el-col>
              </div>
              <div class="padding-row text-center" v-else>暂无数据</div>
              <el-col :span="6">
                <i class="el-icon-circle-plus-outline add-icon" @click="getLabList(); addCapacityDialog = true ; $refs.addForm ? $refs.addForm.resetFields() : '' "  v-if="common.checkAuthority('ClassroomDetail_AddCapacity',true)"></i>
              </el-col>
            </el-row>
          </el-card> 
          
          <el-card class="mart20">
            <div slot="header"><span class="card-title">教室设备清单</span></div>
            <!-- <p class="detail-info-title">实验室设备清单</p> -->
            <el-row class="padding-row" v-if="equipmentInfo">
              <el-col v-for="(item, index) in equipmentInfo" :span="6" :key="index">
                <el-card>
                  <el-form-item label="名称：">{{item.address}}</el-form-item>
                  <el-form-item label="数量：">{{item.amount}}</el-form-item>
                  <el-form-item label="型号：">{{item.materialModelName}}（{{item.materialTypeName}}）</el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row class="padding-row text-center" v-else>暂无数据</el-row>
          </el-card> 
          
          <el-card class="mart20">
            <div slot="header"><span class="card-title">教室排课查询</span></div>
            <!-- show-overflow-tooltip -->
            <el-table
              v-if = 'scheduleInfo'
              id="class_table"
              :data="scheduleInfo"
              stripe
              border
              :span-method="arraySpanMethod"
              style="width: 100%">
              <el-table-column type="index" width="180" label="星期/节次" fixed align="center" :index="indexMethod">
                <template slot-scope="scope">
                  {{indexMethod(new Date(scope.row.date).getDay())}}
                  <div>{{common._convertDate(scope.row.date, 'yyyy/MM/dd')}}</div>
                </template> 
              </el-table-column>
              <el-table-column label="上午" align="center">
                <el-table-column
                  prop=""
                  label="第一节"
                  align="center"
                  width="">
                  <template slot-scope="scope">
                    <!-- {{scope.row}} -->
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,1)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,1)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,1)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  align="center"
                  label="第二节">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,2)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,2)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,2)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  align="center"
                  label="第三节">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,3)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,3)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,3)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  align="center"
                  label="第四节">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,4)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,4)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,4)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="下午" align="center">
                <el-table-column
                  prop=""
                  align="center"
                  label="第五节">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,5)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,5)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,5)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  align="center"
                  label="第六节">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,6)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,6)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,6)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  align="center"
                  label="第七节">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,7)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,7)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,7)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  align="center"
                  label="第八节"
                  width="">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,8)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,8)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,8)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="晚上" align="center">·
                
                <el-table-column
                  prop=""
                  align="center"
                  label="第九节">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,9)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,9)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,9)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  align="center"
                  label="第十节">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,10)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,10)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,10)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  align="center"
                  label="第十一节"
                  width="">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,11)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,11)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,11)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  fixed="right"
                  align="center"
                  label="第十二节">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,12)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,12)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,12)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="中午" align="center">
                <el-table-column
                  prop=""
                  align="center"
                  label="第十三节"
                  width="">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,13)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,13)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,13)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  fixed="right"
                  align="center"
                  label="第十四节">
                  <template slot-scope="scope">
                    <span class="class-name-css cursor-pointer" v-for="(item,index) in scope.row.rows" @dblclick.stop="cellDblClick(scope.row,14)">
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                          <h3>{{timetableName(item,14)}}</h3>
                          <p>联系人：{{item.operator}}</p>
                          <p>联系电话：{{item.phoneNumber}}</p>
                        </div>
                        <span>{{timetableName(item,14)}}</span>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-row class="padding-row text-center" v-else>暂无数据</el-row>
            <div class="mart10">
              <span class="text-info">备注：中午为13、14节次，不可连续预约，预约时需单独预约！</span>
            </div>
            <div class="text-right mart10">

              <el-button type="primary" size="mini" @click="preOneWeek" :disabled="!common.checkAuthority('ClassroomDetail_QuerySchoolTimetable',true)">上一周</el-button>

              <el-date-picker
                v-model="currentWeek"
                class="week-input"
                :clearable="false"
                type="week"
                format="yyyy/MM/dd  第WW周"
                size="mini"
                @change="changeCurrentWeek"
                :disabled="!common.checkAuthority('ClassroomDetail_QuerySchoolTimetable',true)"
                placeholder="选择日期">
              </el-date-picker>

              <el-button type="primary" size="mini" @click="nextOneWeek" :disabled="!common.checkAuthority('ClassroomDetail_QuerySchoolTimetable',true)">下一周</el-button>
            </div>
            <div class="text-left overflow-hidden">
              <el-button type="primary" size="mini" @click="clearData();scheduleDialogType = 1;scheduleDialog = true;$refs.scheduleForm ? $refs.scheduleForm.resetFields() : '' " :disabled="!common.checkAuthority('ClassroomDetail_AddSchedule',true)" class="fl">增加排课</el-button>
              <!-- 
                  :headers="myHeaders"
               -->
              <el-upload
                class="upload-demo fl marl20"
                :action="`${common.basePath}/class/import`"
                :headers="myHeaders"
                :limit="100"
                name="file"
                :disabled="!common.checkAuthority('ClassroomDetail_ImportSchoolTimetable',true)"
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeUpload"
                :http-request="uploadFile">
                <el-button type="primary" size="mini" :disabled="!common.checkAuthority('ClassroomDetail_ImportSchoolTimetable',true)">导入课程实验安排表</el-button>
                <span slot="tip" class="el-upload__tip marl10">只能上传Excel表格文件</span>
              </el-upload>
              <div class="file-position">
                <a :style="!common.checkAuthority('ClassroomDetail_ImportSchoolTimetable',true) ? 'pointer-events: none' : ''" :href="`${common.publicBasePath}/public/user/9/xcl/1553065537766.xlsx`" download="课表模版.xlsx">下载课表模版</a>
                <!-- <el-button type="primary" @click="downloadFile('/public/user/9/xcl/1553065537766.xlsx')">download</el-button> -->
              </div>
              
            </div>
          </el-card>
        </el-form>
      </div>
      <div class="router-view-content text-center" v-else>
        暂无数据
      </div>

      <!-- 添加实验室容量 -->
      <el-dialog 
        width="550px"
        title="添加实验室容量" 
        :visible.sync="addCapacityDialog">
          <el-form ref="addForm" :model="addForm" label-width="110px" >
            <el-form-item 
              label="容量：" 
              prop="capacity"
              :rules="[{ required: true, message: '请输入实验室容量', trigger: 'blur' },{ type: 'number', message: '实验室容量必须为数字'},]">
              <el-input v-model.number="addForm.capacity"></el-input>
            </el-form-item>
            <el-form-item 
              label="实验室名称：" 
              prop="lab_id"
              :rules="[{ required: true, message: '请选择实验教室', trigger: 'blur' },]">
              <el-select v-model="addForm.lab_id">
                <el-option v-for="(item, index) in labListData" :key="index" :value="item.id" :label="item.name">
                  {{item.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addCapacityDialog = false">取 消</el-button>
            <el-button type="primary" @click="addLabCapacity('addForm')">保 存</el-button>
          </div>
      </el-dialog>

      <!-- 添加排课和修改排课 -->
      <el-dialog 
        width="550px"
        :title="scheduleDialogType==1?'添加排课':'修改排课信息'" 
        :visible.sync="scheduleDialog">
          <el-form ref="scheduleForm" :model="scheduleForm" label-width="110px" >
            <el-form-item 
              label="日期：" 
              prop="scheduleDate"
              :rules="[{ required: true, message: '请选择开始/结束日期', trigger: 'blur' },]">
              <el-date-picker
                v-model="scheduleForm.scheduleDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
            <el-form-item 
              label="开始节次：" 
              prop="begin_index"
              :rules="[{ required: true, message: '请输入开始节次', trigger: 'blur' },]">
              <el-input-number v-model="scheduleForm.begin_index" @change="" :min="1" :max="14"></el-input-number>
            </el-form-item>
            <el-form-item 
              label="结束节次：" 
              prop="end_index"
              :rules="[{ required: true, message: '请输入结束节次', trigger: 'blur' },]">
              <el-input-number v-model="scheduleForm.end_index" @change="" :min="scheduleForm.begin_index" :max="14"></el-input-number>
            </el-form-item>
            <el-form-item 
              label="占用原因：" 
              prop="reason"
              :rules="[{ required: true, message: '请输入实验占用原因', trigger: 'blur' },{ validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input type='' v-model="scheduleForm.reason"  placeholder="（简明描述实验占用原因）"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="scheduleDialog = false">取 消</el-button>
            <el-button v-if="scheduleDialogType === 1" type="primary" @click="addSchedule('scheduleForm')">保 存</el-button>
            <el-button v-if="scheduleDialogType === 2" type="primary" @click="updateSchedule('scheduleForm')">保 存</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        myHeaders:{Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('Access-Token'))},
        loading:false,//是否加载
        paramsId:this.$route.params.id,
        detailInfo:    null,//教室详情
        capacityInfo:  null,//实验室容量表
        equipmentInfo: null,//实验室设备清单
        scheduleInfo:  null,//实验室排课信息
        labListData:   null,//实验室列表
        addCapacityDialog:false,//添加实验室容量弹框
        addForm:{               //添加实验室容量
          capacity:       null,
          lab_id:         null,
          class_room_id:this.$route.params.id,
        },
        searchForm: {},
        scheduleParms:{
          classId:this.$route.params.id,
          date:this.common._convertDate(new Date().getTime(), 'yyyy/MM/dd 00:00:00'),
        },
        currentWeek:new Date(),      
        scheduleDialog:false,//排课弹框
        scheduleDialogType:null,
        scheduleForm:{
          begin_index: 1,
          end_index: 1,
          reason:null,
          scheduleDate:[new Date(), new Date()],
        },
        testList:{total:0,rows:[]},//实验室列表
        userId:sessionStorage.getItem('Access-Key') ? sessionStorage.getItem('Access-Key'):null,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        editScheduleId:null,//编辑排课id
      };
    },
    mounted(){
      this.getClassDetailInfo();
      this.getLaboratoryCapacityMeter();
      this.getLabEquipment();
      this.getLabSchedule();
    },
    created() {
      // console.log(this.$store.state.authority);
    },
    methods: {

      //===============================================================================实验室容量表
      /**
       * 根据id查询教室详情
       */
      getClassDetailInfo(){  
        this.axios.get(`${this.common.basePath}/class/${this.paramsId}`,{params:{}}).then((response) => {
          this.detailInfo = response.data.data?response.data.data:null;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },

      //===============================================================================实验室容量表
      /**
       * 根据id查询实验室容量表
       */
      getLaboratoryCapacityMeter(){  
        this.axios.get(`${this.common.basePath}/class/size`,{params:{classId:this.paramsId}}).then((response) => {
          this.capacityInfo = response.data.data.length===0?null:response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 添加实验室容量
       */
      addLabCapacity(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/class/add/size`,this.addForm).then((response) => {
              this.getLaboratoryCapacityMeter();
              this.$message.success('成功!'); 
              this.addCapacityDialog = false;
            }).catch((error) => {
              this.$message.error(error); 
              this.addCapacityDialog = false; 
            });
          } else { 
            return false;
          }
        });
      },
      /**
       * 查询实验室列表
       */
      getLabList(){  
        this.axios.get(`${this.common.basePath}/lab/list`,{params:{pageNum:1,pageSize:10,}}).then((response) => {
          this.axios.get(`${this.common.basePath}/lab/list`,{params:{pageNum:1,pageSize:response.data.data.total,}}).then((response) => {
             this.labListData = response.data.data.rows;
          }).catch((error) => {
            this.$message.error(error);  
          });
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
        编辑实验室容量
       */
      editCap(id){
        this.$prompt('请输入容量', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]*$/,
          inputErrorMessage: '容量必须为大于或等于0的阿拉伯数字'
        }).then(({ value }) => {
          let form = { 
            capacity:       value,
            lab_id:         id,
            class_room_id:this.paramsId,
          };
          this.axios.post(`${this.common.basePath}/class/update/size`,form).then((response) => {
            this.$message.success('成功!'); 
            this.getLaboratoryCapacityMeter();
          }).catch((error) => {
            this.$message.error(error); 
          });
        }).catch(() => {});
      },
      
      //===============================================================================实验室设备清单
      /**
       * 根据id查询实验室设备清单
       */
      getLabEquipment(){  
        this.axios.post(`${this.common.basePath}/storehouse/list`,{classId:this.paramsId}).then((response) => {
          this.equipmentInfo = response.data.data.total===0?null:response.data.data.rows;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },

      //===============================================================================实验室排课查询
      /**
       * 实验室排课查询
       */
      getLabSchedule(){
        this.axios.get(`${this.common.basePath}/class/occupy`,{params:this.scheduleParms}).then((response) => {
          this.scheduleInfo = response.data.data.length===0?null:response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
        上一周与下一周
       */
      preOneWeek(){
        var time = null;
        time += (Date.parse(new Date(this.scheduleParms.date))-604800000);
        this.currentWeek = new Date(time)
        this.scheduleParms.date = this.common._convertDate(time, 'yyyy/MM/dd hh:mm:ss') ; 
        this.getLabSchedule();
      },
      nextOneWeek(){
        var time = null;
        time += (Date.parse(new Date(this.scheduleParms.date))+604800000);
        this.currentWeek = new Date(time)
        this.scheduleParms.date = this.common._convertDate(time, 'yyyy/MM/dd hh:mm:ss') ; 
        this.getLabSchedule();
      },
      /*
        改变当前周
       */
      changeCurrentWeek(){
        if(this.currentWeek){
          var time = Date.parse(new Date(this.currentWeek));
          this.scheduleParms.date = this.common._convertDate(time, 'yyyy/MM/dd hh:mm:ss') ; 
          this.getLabSchedule();
        }
        
      },
      /* 
       星期几
       */
      indexMethod(index) {
        switch (index) {
          case 1:
            return '星期一';
            break;
          case 2:
            return '星期二';
            break;
          case 3:
            return '星期三';
            break;
          case 4:
            return '星期四';
            break;
          case 5:
            return '星期五';
            break;
          case 6:
            return '星期六';
            break;
          case 0:
            return '星期日';
            break;
          default:
            return false;
            break;
        }
      },
      /*
        显示排课表实验室名称
       */
      timetableName(item,num){
        return item.begin_index===num?(item.laboratoryName?item.laboratoryName:(item.reason?item.reason:'暂无')):'';
      },
      /**
       *排课单元格 列合并
       */
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        // 遍历得出colspan
        let colspan = [];
        if(row.rows.length>0){

          for(var i = 0;i<row.rows.length;i++){
            
            if(columnIndex>0){
              //return [1, colspan[0]]
              if(row.rows[i].begin_index===columnIndex){
                colspan.push( (row.rows[i].end_index-row.rows[i].begin_index)+1 );
              }else{
                //return [0, 0]
                if(columnIndex<=row.rows[i].end_index&&row.rows[i].begin_index<columnIndex){
                  colspan.push(0);
                }
                //return [1, 1]
                if(row.rows[i].end_index!=columnIndex&&row.rows[i].begin_index!=columnIndex){
                  colspan.push();
                }
              }
            }else{
              return;
            }

          }

        }else{
          return;
        }
        // console.log(colspan,rowIndex,columnIndex)
        if(columnIndex===0){
          return [1, 1]
        }else{
          if(colspan.length!=0){
            if(colspan[0]===0){
              return [0, 0]
            }else{
              return [1, colspan[0]]
            }
          }else if(colspan.length==0){
            return [1, 1]
          }
        }
      },
      /**
       * 实验室排课的增加
       */
      addSchedule(formName){ 
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var scheduleForm = {
              begin_index: this.scheduleForm.begin_index,
              end_index: this.scheduleForm.end_index,
              reason:this.scheduleForm.reason,
              class_room_id: this.$route.params.id,

              begin_time: this.scheduleForm.scheduleDate?new Date(this.common._convertDate(this.scheduleForm.scheduleDate[0].getTime(), 'yyyy-MM-dd 00:00:00')):null,
              end_time: this.scheduleForm.scheduleDate?new Date(this.common._convertDate(this.scheduleForm.scheduleDate[1].getTime(), 'yyyy-MM-dd 00:00:00')):null,
              owner_id: this.userId,
            };
            if(scheduleForm.end_index<scheduleForm.begin_index){
              this.$message.error('结束节次应大于或等于开始节次!');  
              return;
            }
            this.axios.post(`${this.common.basePath}/class/add/curriculum`,scheduleForm).then((response) => {
              this.getLabSchedule();
              this.$message.success('成功!'); 
              this.scheduleDialog = false;
            }).catch((error) => {
              this.$message.error(error);  
            });
          } else { 
            return false;
          }
        }); 
      },
      /*
        获取实验列表
       */
      getTestList(){
        this.axios.get(`${this.common.basePath}/experiment`,{params:{}}).then((response) => {
          this.testList = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
        排课的单元格双击事件
       */
      cellDblClick(row,col){
        if(this.common.checkAuthority('ClassroomDetail_EditSchedule',true)){
          this.editScheduleId = null;
          this.scheduleDialogType = 2
          // this.getTestList();
          this.scheduleDialog = true;
          this.$refs.scheduleForm ? this.$refs.scheduleForm.resetFields() : '' 
          // 遍历出begin_index
          let b_arr = [];
          if(row.rows.length>0){
            for(var i = 0;i<row.rows.length;i++){
              b_arr.push(row.rows[i].begin_index);
            }
          }
          if(b_arr.indexOf(col)!=-1){
            var data = row.rows[b_arr.indexOf(col)];
            //回显信息
            var begin_time = data.begin_time;
            var begin = new Date(begin_time);

            var end_time = data.end_time;
            var end = new Date(end_time);
            this.scheduleForm = data;
            this.scheduleForm.scheduleDate = [new Date(begin.getFullYear(),begin.getMonth(),begin.getDate()), new Date(end.getFullYear(),end.getMonth(),end.getDate())],
            //编辑id
            this.editScheduleId = data.id;
          }
          this.getLabSchedule();
        }else{
          this.$message.warning('你没有编辑权限！！！',1000); 
        }
      },
      /*
        清空数据
       */
      clearData(){
        this.scheduleForm.begin_index=1
        this.scheduleForm.end_index=1
        this.scheduleForm.reason=null
        this.scheduleForm.scheduleDate=[new Date(), new Date()]
      },
      /**
       * 实验室排课的修改
       */
      updateSchedule(formName){ 
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var scheduleForm = {
              begin_index: this.scheduleForm.begin_index,
              end_index: this.scheduleForm.end_index,
              reason:this.scheduleForm.reason,
              class_room_id: this.$route.params.id,
              begin_time: this.scheduleForm.scheduleDate?new Date(this.common._convertDate(this.scheduleForm.scheduleDate[0].getTime(), 'yyyy-MM-dd 00:00:00')):null,
              end_time: this.scheduleForm.scheduleDate?new Date(this.common._convertDate(this.scheduleForm.scheduleDate[1].getTime(), 'yyyy-MM-dd 00:00:00')):null,
              owner_id: this.userId,
              id:this.editScheduleId,
            };
            if(scheduleForm.end_index<scheduleForm.begin_index){
              this.$message.error('结束节次应大于或等于开始节次!');  
              return;
            }
            this.axios.post(`${this.common.basePath}/class/update`,scheduleForm).then((response) => {
              this.getLabSchedule();
              this.$message.success('成功!'); 
              this.scheduleDialog = false;
            }).catch((error) => {
              this.$message.error(error);  
            });
          } else { 
            return false;
          }
        });  
      },
      /**
       * 导入课程实验安排表
       */
      //文件上传成功时的钩子
      handleSuccess(res,file,fileList) {
        console.log(res,file,fileList)
      },
      //文件上传失败时的钩子
      handleError(err, file, fileList){
        this.$message.error('文件上传失败!!', 20);
      },
      //限制用户上传的图片格式和大小
      beforeUpload(file) {
        const isXLS = file.type === 'application/vnd.ms-excel';
        const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        if (!isXLS && !isXLSX) {
          this.$message.error('上传的文件类型只能是 Excel表格 !');
        }
        return isXLS || isXLSX;
      },
      //自定义文件上传
      uploadFile(param){
        // this.$message("没有api", 20);
        // return;
        console.log(param)
        var fileObj = param.file;
        // FormData 对象
        var form = new FormData();
        // 文件对象
        form.append("file", fileObj);
        this.axios.post(`${this.common.basePath}/class/import`,form,{ headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
          this.$message.success("课表导入成功！！", 20);
          this.getLabSchedule();
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      //自定义文件下载
      downloadFile(path){
        var form = {
          path:path,
        }
        this.axios.post(`${this.common.basePath}/file/uplode`,form).then((response) => {
          this.$message.success("成功！！", 20);
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      
    },
  }
</script>

<style lang="less">
  @dark: #999;
  #class_table.el-table th.is-leaf, .el-table td{
    border-bottom:1px solid @dark !important;
  }
  #class_table.el-table--border th, .el-table--border td{
    border-right: 1px solid @dark !important;
  }
  #class_table.el-table--border{
    border-top: 2px solid @dark !important;
    border-bottom: 2px solid @dark !important;
    border-left: 2px solid @dark !important;
    border-right: 1px solid @dark !important;
  }
  #class_table.el-table--border th{
    border-bottom: 1px solid @dark !important;
  }

  .week-input.el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 186px;
    margin: 0 12px;
    border: 1px solid #409eff;
    border-radius: 5px;
  }
  .week-input.el-date-editor.el-input, .el-input__prefix{
    color: #409eff;
  }
</style>

<style lang="less" scoped>
  .detail-info .el-form-item{
    margin-bottom:0;
  }
  .detail-info .detail-info-title{
    font-weight:900;
    color:#333;
  }
  .add-icon{
    font-size: 36px;color: #b8babd;line-height:120px;
  }
  .class-name-css{
    width: 100%;
    overflow: hidden;/*超出部分隐藏*/
    white-space: nowrap;/*不换行*/
    text-overflow:ellipsis;/*超出部分文字以...显示*/
  }
</style>

