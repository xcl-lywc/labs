<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>教室占用</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div v-if="common.checkAuthority('OccupyTable', true)&&tableData.rows">
          <!-- 搜索 -->
          <el-form ref="searchForm" :model="searchForm" label-width="120px" :inline="true">
            <el-form-item label-width="50px" class="fr">
              <el-button type="primary" :disabled="!common.checkAuthority('OccupyTable', true)" @click="date = date - 3600 * 1000 * 24 * 7;searchForm.time=[getDates(new Date(date),'monday'), getDates(new Date(date),'sunday')];getUserList('init')">上一周</el-button>
              <el-button type="primary" :disabled="!common.checkAuthority('OccupyTable', true)" @click="date = new Date() - 0;searchForm.time=[getDates(new Date(date),'monday'), getDates(new Date(date),'sunday')];getUserList('init')">本周</el-button>
              <el-button type="primary" :disabled="!common.checkAuthority('OccupyTable', true)" @click="date = date + 3600 * 1000 * 24 * 7;searchForm.time=[getDates(new Date(date),'monday'), getDates(new Date(date),'sunday')];getUserList('init')">下一周</el-button>
              <el-button type="primary" :disabled="!common.checkAuthority('ClassOccupy_Export', true)" @click=" exportTable " class="marl40">
                {{common.checkAuthority('ClassOccupy_Export') ? common.checkAuthority('ClassOccupy_Export').name : ''}}
              </el-button>
            </el-form-item>
          </el-form>
          <div class="class-occupy-table" v-if="tableData.rows&&tableData.rows.length>0">
            <div class="head-table">
               <div class="hand-table-row">
                  <span class="tabel-col tabel-col-height-100 tabel-col-line-height-100">教室/星期</span>
                  <span v-for="(item,index) in tableData.rows[0].classOccupyVoList" class="tabel-col tabel-col-height-100 tabel-col-line-height-100">
                    {{ common._convertDate(item.date, 'yyyy/MM/dd') +'（星期'+item.week+'）' }}
                  </span>
                </div> 
            </div>
            <div class="body-table" v-loading="tableLoading">
              <div v-for="(item,index) in tableData.rows" class="body-table-row overflow-hidden">
                <span class="fl tabel-col tabel-col-line-height-150">{{item.identifier}}</span>
                <div class="fl overflow-hidden tabel-col" v-for="itemChild in item.classOccupyVoList" style="">
                  <div v-for="itemChild_ in itemChild.classOccupyContentList" class="fl">
                    <!-- {{itemChild_.userName}} -->
                    <el-popover
                        popper-class="occupy-popover"
                        placement="bottom-end"
                        width="480"
                        title="占用详情"
                        trigger="hover">
                        <el-form label-width="110px" class="detail-info" :inline="false">
                          <el-card class="box-card" shadow="never">
                            <el-row :gutter="20">
                              <el-col :span="12">
                                <el-form-item label="占用者：">{{ itemChild_.userName }}</el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="联系电话：">{{ itemChild_.phoneNum }}</el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="占用节次：">{{ '第'+itemChild_.b_index+'节'+"~"+'第'+itemChild_.e_index+'节' }}</el-form-item>
                              </el-col>
                              <el-col :span="24">
                                <el-form-item label="占用原因：">
                                  <span v-if="!itemChild_.experiment_id">{{ itemChild_.reason }}</span>
                                  <div v-else>
                                    <el-tag type="success">{{ itemChild_.experimentName }}</el-tag>&nbsp;&nbsp;正在进行中...
                                  </div>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-card>
                        </el-form>

                        <el-button style="padding: 2px 0 3px 0px" slot="reference" type="text" class="marr5"><el-tag>{{ '第'+itemChild_.b_index+'节'+"~"+'第'+itemChild_.e_index+'节' }}</el-tag></el-button>
                      </el-popover>
                  </div>
                </div>
              </div>
            </div>
              
          </div>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
        <!-- <el-table
          v-if="tableData.rows&&tableData.rows.length>0"
          :data="tableData.rows"
          cell-class-name="occuptyTable-cell"
          id="occuptyTable"
          style="width: 100%">
          <el-table-column
            fixed
            align="center"
            prop="identifier"
            label="教室/星期"
            header-align="center"
            width="100">
          </el-table-column>
          <div v-for="(item,index) in tableData.rows[0].classOccupyVoList">
            <el-table-column :label="'星期'+item.week" prop="" header-align="center">
              <el-table-column label="上午" header-align="center">
                <el-table-column
                  prop=""
                  label="01"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="02"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="03"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="04"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="中午" header-align="center">
                <el-table-column
                  prop="name"
                  label="05"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="06"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="下午" header-align="center">
                <el-table-column
                  prop="name"
                  label="07"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="08"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="09"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="10"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="晚上" header-align="center">
                <el-table-column
                  prop="name"
                  label="11"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="12"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="13"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="14"
                  width="40">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}——{{scope.column.label}}</span>
                    <div v-for="(item_,index_) in scope.row.classOccupyVoList[index].classOccupyContentList">
                      <i :style="{'background':scope.$index%2===0?bgColor_even[item_.b_index-1]:bgColor_odd[item_.b_index-1]}" 
                         class="" v-if="item_.b_index<=Number(scope.column.label)&&item_.e_index>=Number(scope.column.label)">&nbsp;</i>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </div>
        </el-table> -->
      </div>
      <!-- 页面底部 -->
      <div v-if="common.checkAuthority('OccupyTable', true)" class="router-view-bottom">    
        <!-- 分页 -->
        <!-- <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="tableData.total"
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange">
        </el-pagination> -->
      </div>
      <div v-else class="router-view-bottom"></div>
    </div>
    
  </div>
</template>
<script>
  export default {
    data () {
      
      return {
        date:new Date() - 0,//当前日期
        searchForm: {time:[this.getDates(new Date(),'monday'), this.getDates(new Date(),'sunday')]},
        pickerOptions: { // 时间段选择的快捷配置
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
        tableLoading: false,
        tableData: {// 表格数据
          rows: [],
          total: 0
        },

        pageNum:1,
        pageSize:10,

        bgColor_even:['#BA55D3','#7FFF00','#EE82EE','#FF8C00','#F08080','#6495ED','#40E0D0','#228B22','#008080','#FF00FF','#2F4F4F','#00FF7F','#B22222','#D8BFD8'],
        bgColor_odd:['#FF1493','#800080','#708090','#87CEFA','#FFDEAD','#FFA500','#0000FF','#90EE90','#7B68EE','#A52A2A','#4169E1','#20B2AA','#FFC0CB','#DB7093'],
      }
    },
    computed(){
      // cBgColor(rowIndex,item_){
      //   let result = rowIndex%2===0?this.bgColor_even[item_.b_index-1]:this.bgColor_odd[item_.b_index-1];
      //   return result;
      // }
    },
    mounted() {
      if (this.common.checkAuthority('OccupyTable', true)) {
        this.getUserList();

        //上周的开始时间
        // this.getDates(new Date(new Date() - 3600 * 1000 * 24 * 7))
        // this.getDates(new Date(new Date() - 0))
        // this.getDates(new Date(new Date() + 3600 * 1000 * 24 * 7))
        console.log(this.getDates(new Date(new Date() - 0),'monday'));
      }
    },
    methods: {
      getDates(date,type) {
        // 按周日为一周的最后一天计算
        var date = date;
     
        // 今天是这周的第几天
        var today = date.getDay();
     
        //上周日距离今天的天数（负数表示）
        var stepSunDay = -today + 1;
     
        // 如果今天是周日
        if (today == 0) {
            stepSunDay = -7;
        };
     
        // 周一距离今天的天数（负数表示）
        var stepMonday = 7 - today;
     
        var time = date.getTime();
     
        var monday = new Date(time + stepSunDay * 24 * 3600 * 1000).getTime();
     
        var sunday = new Date(time + stepMonday * 24 * 3600 * 1000).getTime();

        if(type==='monday'){
          return monday;
        }else if(type==='sunday'){
          return sunday;
        }
      },
      /**
       * 分页
       * @author chuanlin.Xiao
       * @date   2019-11-14T17:22:27+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      pageSizeChange(val) {
        this.pageSize = val
        this.getUserList()
      },
      pageCurrentChange(val) {
        this.pageNum = val
        this.getUserList()
      },
     
      /**
       * 根据搜索条件查询表格数据
       * @author chuanlin.Xiao
       * @date   2019-11-14T17:23:32+0800
       * @return {[type]}                      [description]
       */
      getUserList() {
        this.tableLoading = true
        let config = {
          method: "post",
          url: `${this.common.basePath}/class/all/occupy`,
          data: {
            beginTime:this.searchForm.time[0],
            endTime:this.searchForm.time[1],
          }
        }
        this.axios(config).then((response) => {
          this.tableData.rows = response.data.data;
          this.$nextTick(_ => {
            this.tableLoading = false
          })
        }).catch((errorMsg) => {
          this.tableLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 到处表格
       * @return {[type]} [description]
       */
      exportTable(){
        this.axios.post(`${this.common.basePath}/class/all/occupy/download`, {
            beginTime:this.searchForm.time[0],
            endTime:this.searchForm.time[1],
          },{responseType: "blob"}).then((response) => {
          this.common._fileBold(response);
          this.$message.success('导出成功')
        }).catch((errorMsg) => {
          this.tableLoading = false
          this.$message.error(errorMsg)
        })
      }
    }
  }
</script>

<style lang="less">
  @dark: #999;
  #occuptyTable.el-table th.is-leaf, .el-table td{
    border-bottom:1px solid @dark !important;
  }
  #occuptyTable.el-table--border th, .el-table--border td{
    border-right: 1px solid @dark !important;
  }
  #occuptyTable.el-table--border{
    border-top: 2px solid @dark !important;
    border-bottom: 2px solid @dark !important;
    border-left: 2px solid @dark !important;
    border-right: 1px solid @dark !important;
  }
  #occuptyTable.el-table--border th{
    border-bottom: 1px solid @dark !important;
  }

  .occupy-popover{
    
  }

  .occuptyTable-cell{
    padding:0 !important;
    .cell{
      padding:0 !important;
      height:41px;
      i{
        line-height: 2 !important;
        width: 100%;
        height: 40px;
        display: inline-block;
      }
    }
  }
  
  .class-occupy-table{
    width:100%;
    overflow:hidden;
    border-top:2px solid @dark;
    border-left:2px solid @dark;
    border-bottom:1px solid @dark;
    border-right:1px solid @dark;
    border-radius:10px;
    .tabel-col{
      display:inline-block;
      width:12.5%;
      height:150px;
      border-bottom:1px solid @dark;
      border-right:1px solid @dark;
      text-align:center;
      overflow:auto;
      box-sizing:border-box;
    }
    .tabel-col-height-100{
      height:100px;
    }
    .tabel-col-line-height-100{
      line-height:98px;
    }
    .tabel-col-line-height-150{
      line-height:148px;
    }
    .head-table{
      overflow:hidden;
      .head-table-row{
        overflow:hidden;
      }
    }
    .body-table{
      overflow:hidden;
      .body-table-row{
        overflow:hidden;
      }
    }
  }
  

  /* 修改滚动条样式 */
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/ 
  ::-webkit-scrollbar 
  { 
    width: 3px; 
    height: 3px; 
    background-color: #F5F5F5; 
  }  
  /*定义滚动条轨道 内阴影+圆角*/ 
  ::-webkit-scrollbar-track 
  { 
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    // border-radius: 10px; 
    background-color: #F5F5F5; 
  }   
  /*定义滑块 内阴影+圆角*/ 
  ::-webkit-scrollbar-thumb 
  { 
    border-radius: 10px; 
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); 
    background-color: #9E9E9E; 
} 
</style>