/*********   考勤任务详情 ********************/
<template>  
  <div v-loading="isLoad"> 
    <!-- 页面主要内容 -->
    <div class="router-view-content task-detail" v-if="taskDetail"> 
      <el-card> 
        <el-row>
          <el-col :span="12" class="marb5">
            实验名称：{{taskDetail.lab_name}}  
          </el-col> 
          <el-col :span="12" class="marb5">
            状态：{{typeNum(taskDetail.status)}} 
            <!-- 1为未开启，2为进行中，3为已结束 -->
            <!-- 开启 -->
            <el-button 
              :disabled="!common.checkAuthority('AttendanceTaskDetail_ReleaseTask', true)"
              v-if="taskDetail.status == 1" type="primary" size="mini" @click="taskChangeType(2)" >
              {{common.checkAuthority('AttendanceTaskDetail_ReleaseTask') ? common.checkAuthority('AttendanceTaskDetail_ReleaseTask').name : ''}}
            </el-button>
            <!-- 暂停 -->
            <el-button 
              :disabled="!common.checkAuthority('AttendanceTaskDetail_EndTask', true)"
              v-if=" taskDetail.status == 2 " type="primary" size="mini" @click="taskPauseType" >
              {{common.checkAuthority('AttendanceTaskDetail_EndTask') ? common.checkAuthority('AttendanceTaskDetail_EndTask').name : ''}}
            </el-button> 
            <!-- 开启 -->
            <el-button 
              :disabled="!common.checkAuthority('AttendanceTaskDetail_StartTask', true)"
              v-if=" taskDetail.status == 3 " type="primary" size="mini" @click="taskPauseType" >
              {{common.checkAuthority('AttendanceTaskDetail_StartTask') ? common.checkAuthority('AttendanceTaskDetail_StartTask').name : ''}}
            </el-button>

          </el-col> 
          <el-col :span="24" class="marb5">
            打卡日期：{{taskDetail.eTime ? common._convertDate(taskDetail.eTime, 'yyyy年MM月dd日') : '还未打卡'}} 
          </el-col> 
          <el-col :span="24" class="marb5">
            二维码： <span style=" color: #71706f;">（点击鼠标右键可保存图片到本地）</span>
            <qrcode class="qrcode-canvas-wrap mart5" :value="taskDetail.qr_code"></qrcode>
          </el-col>
          <el-col :span="24" class="marb5">
            开启人姓名：{{taskDetail.creator}}
          </el-col> 
          <el-col :span="24" class="marb5">
            得分占比：{{taskDetail.value}}% 
          </el-col>
          <el-col :span="24" class="marb5">
            <div class="fl">
              考勤结果：{{taskDetail.finish}}/{{taskDetail.stay}}
            </div>
            <!-- 下载考勤模板 -->
            <el-button 
              @click="downloadSheetModule"
              :disabled="!common.checkAuthority('AttendanceTaskDetail_exportSheet', true)"
              class="fl marl10" type="primary" size="small">
              {{common.checkAuthority('AttendanceTaskDetail_exportSheet') ? common.checkAuthority('AttendanceTaskDetail_exportSheet').name : ''}}
            </el-button>

            <!-- 导入考勤结果 --> 
            <upload 
              size="small"
              class="fl marl10"
              :url="`/work/import`"
              :isDisabled="!common.checkAuthority('AttendanceTaskDetail_ImportResult', true)"
              :fileTypes="['xls','xlsx']"
              :buttonText="common.checkAuthority('AttendanceTaskDetail_ImportResult') ? common.checkAuthority('AttendanceTaskDetail_ImportResult').name : ''" 
              @uploadSuccess="importSheet"></upload> 
          </el-col> 
        </el-row>
      </el-card>

      <!-- 1为已打卡，2 为未打卡 -->
      <el-card class="mart5 person-group-item">  
        <el-tabs v-model="typeActiveName">
          <el-tab-pane label="已打卡" name="1"> 
            <div 
              v-if="yiCheckUserList ? yiCheckUserList.length : false" 
              class="person-group-item_w marb20" 
              v-for="(item,index) in yiCheckUserList"
              >
              <el-dropdown :hide-on-click="false" placement="bottom-start">
                  <div class="img-photo-fix wh50">
                    <img :src="item.headImg ? item.headImg : '默认图' " :onerror="defaultImg(item.sex)" width="50px" height="50px" />
                  </div>  
                  <!-- <p class="person-name" style="text-align: left;margin-left: 18px;">{{item.name}}</p>  -->
                  <el-dropdown-menu slot="dropdown" > 
                    <el-row class="mar5 member-info-fix">
                      <el-col :span="9">
                        <p><img :src="item.headImg ? item.headImg : '默认图' " :onerror="defaultImg(item.sex)" width="100px" height="100px" /></p>
                      </el-col>
                      <el-col :span="15"> 
                        <p>姓名：{{item.name ? item.name : '无'}}</p>
                        <p>工/学号：{{item.account ? item.account : '无'}}</p>
                        <p>手机：{{item.phoneNumber ? item.phoneNumber : '无'}}</p>
                        <p>院系：{{item.faculty ? item.faculty : '无'}}</p>
                        <p>邮箱：{{item.mail ? item.mail : '无'}}</p>
                      </el-col>
                    </el-row> 
                  </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div v-if="!yiCheckUserList.length" class="mar10">暂无</div>  
          </el-tab-pane>
          <el-tab-pane label="未打卡" name="2">
             <div 
                v-if="weiCheckUserList ? weiCheckUserList.length : false" 
                class="person-group-item_w marb20" 
                v-for="(item,index) in weiCheckUserList"
              >
                <el-dropdown :hide-on-click="false" placement="bottom-start">
                  <div class="img-photo-fix wh50">
                    <img :src="item.headImg ? item.headImg : '默认图' " :onerror="defaultImg(item.sex)" width="50px" height="50px" />
                  </div>  
                  <!-- <p class="person-name" style="text-align: left;margin-left: 18px;">{{item.name}}</p>  -->
                  <el-dropdown-menu slot="dropdown" > 
                    <el-row class="mar5 member-info-fix">
                      <el-col :span="9">
                        <p><img :src="item.headImg ? item.headImg : '默认图' " :onerror="defaultImg(item.sex)" width="100px" height="100px" /></p>
                      </el-col>
                      <el-col :span="15"> 
                        <p>姓名：{{item.name ? item.name : '无'}}</p>
                        <p>工/学号：{{item.account ? item.account : '无'}}</p>
                        <p>手机：{{item.phoneNumber ? item.phoneNumber : '无'}}</p>
                        <p>院系：{{item.faculty ? item.faculty : '无'}}</p>
                        <p>邮箱：{{item.mail ? item.mail : '无'}}</p>
                      </el-col>
                    </el-row> 
                  </el-dropdown-menu>
                </el-dropdown> 
              </div>
              <div v-if="!weiCheckUserList.length" class="mar10">暂无</div>  
          </el-tab-pane> 
        </el-tabs>
      </el-card>
    </div>
  </div>  
</template>
<script>   
  import upload from "../Upload.vue"
  import qrcode from "qrcode.vue"
  export default { 
    components:{   
      'upload':                upload,
      qrcode
    },
    data () {
      return { 
        taskDetail:           null, 
        checkUserList:        [], // 用户的打卡情况
        yiCheckUserList:      [], //已打卡数据
        weiCheckUserList:     [], //未打卡数据
        isLoad:               true,
        typeActiveName:       '1', 
      }
    }, 
    computed:{
    }, 
    mounted(){  
      this.getQueryTaskDetail();  
      this.getQueryCheckUserList();
    },
    methods: {  
      /**
       * 根据性别使用不同的头像
       * @param  {[type]} sex [description]
       * @return {[type]}     [description]
       */
      defaultImg(sex){ 
        return sex == 1 ? 
                'this.src="' + require('../../assets/img/male.png') + '"' : 
                'this.src="' + require('../../assets/img/female.png') + '"';
      },
      /*
       * 问卷类型由数字转文字 
       */
      typeNum(type){ 
        switch(type){
          case 1:
            return '未开启';
            break;
          case 2:
            return '进行中';
            break;
          case 3:
            return '已结束';
            break; 
        }
      },
      /*
       * 查询任务基本信息
       */
      getQueryTaskDetail(){
        this.axios.get(`${this.common.basePath}/work/info/`,{params: {task_id: this.$route.params.task_id}}).then((response) => { 
          this.taskDetail = response.data.data;
          this.isLoad = false; 
        }).catch((error) => {
          this.$message.error(error);
          this.isLoad = false;  
        });
      }, 
      /*
       * 查询任务基本信息
       */
      getQueryCheckUserList(){
        this.axios.get(`${this.common.basePath}/work/check/taskId`,{params: {id: this.$route.params.task_id}}).then((response) => { 
          this._checkUserList(response.data.data);
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      _checkUserList(data){
        this.yiCheckUserList = [];
        this.weiCheckUserList = [];
        data.forEach((item) => {
          if(item.status == 1){
            this.yiCheckUserList.push(item);
          }else if(item.status == 2){
            this.weiCheckUserList.push(item);
          }
        })
      },
      /*
       * 改变任务状态
       */
      taskChangeType(status_num){
        this.axios.patch(`${this.common.basePath}/task/${this.$route.params.task_id}`,{cur_status: status_num}).then((response) => { 
          this.getQueryTaskDetail();
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 改变任务状态 (开始/暂停)
       */
      taskPauseType(){
        this.axios.get(`${this.common.basePath}/task/pause`,{params: {id: this.$route.params.task_id}}).then((response) => { 
          this.getQueryTaskDetail();
        }).catch((error) => {
          this.$message.error(error); 
        });
      },  
      /*
       * 导入表格成功
       */ 
      importSheet(){
        this.getQueryTaskDetail();
      },
      /*
       * 下载表格模板
       */
      downloadSheetModule(){
        this.axios.get(`${this.common.basePath}/work/export`,
          {params: {task_id: this.$route.params.task_id},responseType: "blob"}).then((response) => {
          this.common._fileBold(response);
          this.$message.success('下载成功'); 
        }).catch((error) => {
          this.$message.error(error);  
        });
      }
    }
  }
</script>
<style lang="less">
  .person-group-item{
    .person-group-item_w{
      display: inline-block;
    }
  }
  .qrcode-canvas-wrap{
    margin-left: 80px;
  }
  .qrcode-canvas-wrap>canvas {
    width: 150px!important;
    height: 150px!important;
  }
</style> 