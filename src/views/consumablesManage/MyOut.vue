<!-- 出库 （出库申请、出库清单）-->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>我的申请</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" v-loading="pageLoading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-row class="padding-row" v-if="common.checkAuthority('MyOut-list', true)">
          <!-- 入库搜索条件 -->
          <el-form ref="searchForm" :model="searchForm" label-width="120px" @submit.native.prevent>
            <el-row>
              <el-col :span="8">
                <el-form-item label="审批人：" prop="approver">
                  <el-select v-model="searchForm.approver" placeholder="请选择" class="fill-width" filterable>
                    <el-option v-for="(item, index) in userList_" :value="item.id" :label="item.user_name" :key="`${index}出库人`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出库类型：" prop="applyType">
                  <el-select v-model="searchForm.applyType" placeholder="请选择" class="fill-width" >
                    <el-option v-for="(item, index) in applyTypeList" :value="item.id" :label="item.name" :key="`${index}出库类型`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="申请人：" prop="creator">
                  <el-select v-model="searchForm.creator" placeholder="请选择" class="fill-width" >
                    <el-option v-for="(item, index) in userList" :value="item.id" :label="item.user_name" :key="`${index}创建者`"></el-option>
                  </el-select>
                </el-form-item>`
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="日期：" prop="date">
                  <el-date-picker
                    v-model="searchForm.date"
                    type="daterange"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>`
              </el-col>
              <el-col :span="8">
                <el-form-item label=" ">
                  <el-button type="primary" @click="getInstockApplyList('init')" :disabled="!common.checkAuthority('MyOut-query', true)">搜索</el-button>
                  <el-button type="default" @click="clearForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 出库 -->
          <el-col :span="14">
            <el-card shadow="">
              <div slot="header" class="clearfix">
                <span>出库列表</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <el-table
                @row-click="handleNodeClick"
                class="el-table-instock"
                :row-class-name="tableRowClassName"
                :data="instockApplyList.rows"
                :show-header="true">
                <el-table-column
                  prop="creatorName"
                  label="申请人"
                  width="">
                </el-table-column>
                <!-- <el-table-column
                  prop="approverName"
                  label="审批人"
                  width="">
                </el-table-column> -->
                <el-table-column
                  prop="applyType"
                  label="出库类型"
                  show-overflow-tooltip
                  width="">
                  <template slot-scope="scope">
                    <el-tag  v-if='scope.row.applyType===3' type="danger">报废</el-tag>
                    <el-tag v-if='scope.row.applyType===2' type="warning">维修申请</el-tag>
                    <el-tag  v-if='scope.row.applyType===1' type="success">借出申请</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  show-overflow-tooltip
                  label="时间"
                  width="">
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.createTime, "yyyy/MM/dd")}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="curStatus"
                  label="状态"
                  width="">
                  <template slot-scope="scope">
                    <el-tag v-if='scope.row.curStatus===1' type="warning">未审批</el-tag>
                    <el-tag  v-if='scope.row.curStatus===2' type="success">已审批</el-tag>
                    <el-tag v-if='scope.row.curStatus===3' type="danger">被驳回</el-tag>
                    <el-tag  v-if='scope.row.curStatus===5' type="info">已撤回</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  fixed="right"
                  width="400">
                  <template slot-scope="scope">
                  	<el-button type="" size="mini"  @click.stop='$router.push({name: "OutstockDetail", params: { type: 2, id: scope.row.id}});' v-if="common.checkAuthority('MyOut-detail', true)">查看</el-button>
                    <!-- <el-button type="success" size="mini" :disabled="scope.row.curStatus===2||scope.row.curStatus===3||scope.row.curStatus===5" @click.stop='$router.push({name: "OutstockDetailedForm", params: {type: 3, id: scope.row.id, page:2}});' v-if="common.checkAuthority('MyOut-approval', true)">审批</el-button> -->
                    <el-button type="primary" size="mini" :disabled="scope.row.curStatus===2||scope.row.curStatus===3||scope.row.curStatus===1" @click.stop='$router.push({name: "OutstockDetailedForm", params: {type: 2, id: scope.row.id, page:2}});' v-if="common.checkAuthority('MyOut-edit', true)">编辑</el-button>
                    <el-button type="info" size="mini"  :disabled="scope.row.curStatus===2||scope.row.curStatus===3||scope.row.curStatus===5" v-if="common.checkAuthority('MyOut-recall', true)"  @click.stop="recallInstockApply(scope.row)">撤回</el-button>
                    
                    <el-button type="warning" size="mini" :disabled="scope.row.curStatus===2||scope.row.curStatus===3||scope.row.curStatus===1" @click.stop='replayInstockApply(scope.row);' v-if="common.checkAuthority('MyOut-replay', true)">重申</el-button>
                    <el-button type="danger" size="mini" :disabled="scope.row.curStatus===2||scope.row.curStatus===3||scope.row.curStatus===1" @click.stop='deleteInstockApply(scope.row);' v-if="common.checkAuthority('MyOut-delete', true)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <el-pagination
                v-if="instockApplyList.total>0"
                class="text-right mart10"
                background
                small
                @size-change="handleSizeChanged_"
                @current-change="handlePageChanged_"
                layout="prev, pager, next"
                :total="instockApplyList.total">
              </el-pagination>
            </el-card>
          </el-col>
          <el-col :span="10">
            <el-card shadow="">
              <div slot="header" class="clearfix">
                <span>出库清单</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <el-table
                stripe
                v-loading="tableLoading"
                :data="instockDetailedList.rows"
                :row-class-name="setClassName"
                :show-header="true">
                <el-table-column type="expand" label="设备">
                  <template slot-scope="props">
                    <el-table
                      :data="props.row.outStockInfoHasStorehouseList"
                      border
                      :show-header="true">
                      <el-table-column
                        prop="address"
                        align='center'
                        label="教室"
                        width="">
                      </el-table-column>
                      <el-table-column
                        prop="identifier"
                        align='center'
                        label="编号"
                        width="">
                      </el-table-column>
                      <el-table-column
                        prop="serialNum"
                        align='center'
                        label="序列号"
                        width="">
                      </el-table-column>
                      <el-table-column
                        prop="amount"
                        align='center'
                        label="数量"
                        width="">
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="materialTypeName"
                  label="耗材类型"
                  show-overflow-tooltip
                  width="">
                </el-table-column>
                <el-table-column
                  prop="materialModelName"
                  label="耗材型号"
                  show-overflow-tooltip
                  width="">
                </el-table-column>
                <el-table-column
                  prop="modelType"
                  label="型号类型"
                  width="">
                  <template slot-scope="scope">
                    <el-tag v-if='scope.row.modelType===1'>耗材</el-tag>
                    <el-tag  v-if='scope.row.modelType===2' type="success">设备</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="amount"
                  label="数量"
                  width="">
                </el-table-column>
              </el-table>
              <el-pagination
                class="text-right mart10 fr marb10"
                background
                @size-change="handleSizeChanged"
                @current-change="handlePageChanged"
                layout="total, sizes, prev, pager, next"
                :total="instockDetailedList.total">
              </el-pagination>
            </el-card>
          </el-col>
        </el-row>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>    
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom_">
        <div class="overflow-hidden fill-width" v-if="common.checkAuthority('MyOut-list', true)">
          <el-button type="primary" size="" class="fr" @click='$router.push({name: "OutstockDetailedForm", params: {type: 1, id: 1, page:2 }});' :disabled="!common.checkAuthority('MyOut-create', true)">创建出库单</el-button>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>

    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pageLoading: false,
        tableLoading:false,
        userList:[],
        userList_:[],

        // 搜索
        searchForm: {
          approver: null,
          applyType:null,
          creator: Number(sessionStorage.getItem('Access-Key')),
          date:null,
        },
        applyTypeList:[{id:1,name:'借出申请'},{id:2,name:'维修申请'},{id:3,name:'报废'}],
        
        //出库申请
        instockApplyList:{rows:[],total:0},// 列表
        activeId:    null, //当前选中的Id
        tempId:      null, //鼠标浮动对应的节点id
        pageNum_: 1,
        pageSize_: 10,

        //出库清单
        instockDetailedList:{rows:[],total:0},// 出库清单
        pageNum: 1,
        pageSize: 10,

      };
    },
    created () {
      
    },
    mounted () {
    	console.log(this.common.checkAuthority('MyOut-recall', true))
      if(this.common.checkAuthority('MyOut-list', true)) {
        this.getUserList();
        this.getUserList_();
        this.getInstockApplyList('init');
      }
    },
    methods: {

      /**
       * 清空 还原搜索表单
       * @return {[type]} [description]
       */
      clearForm(formName) {
        this.$nextTick(() => {
          this.$refs[formName].resetFields()
        })
      },
      /**
       * 激活出库申请列表时，带上状态
       */
      tableRowClassName({row, rowIndex}) {
        if(row.id === this.activeId ){
          return 'active-row';
        }
        return '';
      },
      /**
       * 解决Vue的表格中，expand只有某些行需要展开的问题。
       */
      setClassName({row, index}){
          // 通过自己的逻辑返回一个class或者空
          return row.modelType==1 ? 'custom-expand' : '';
      },

      /**
       * 查询用户列表
       * @return {[type]} [description]
       */
      getUserList() {
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/list`,
          data: {
            pageNum: 1,
            pageSize: 9999
          }
        }
        this.axios(config).then((response) => {
          this.userList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 查询用户列表 设备管理员
       * @return {[type]} [description]
       */
      getUserList_() {
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/list`,
          data: {
            pageNum: 1,
            pageSize: 9999,
            roles: 6
          }
        }
        this.axios(config).then((response) => {
          this.userList_ = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      
      /**
       * 查询出库申请列表
       * @return {[type]} [description]
       */
      getInstockApplyList(init) {
        this.pageLoading = true

        let data = this.searchForm
        if(init == "init") { // 需要初始化查询
          this.pageNum_ = 1
          this.pageSize_ = 10
        }
        data.pageNum  = this.pageNum_
        data.pageSize = this.pageSize_

        data.startTime = this.searchForm.date ? this.searchForm.date[0] : null;
        data.endTime = this.searchForm.date ? this.searchForm.date[1] : null;

        let config = {
          method: "post",
          url: `${this.common.basePath}/materialApply/list`,
          data: JSON.parse(JSON.stringify(data))
        }
        delete config.data.date

        this.axios(config).then((response) => {
          this.instockApplyList = response.data.data
          if(response.data.data&&response.data.data.total>0){
            this.activeId = response.data.data.rows[0].id
            this.getInstockDetailedList(response.data.data.rows[0].id)
          }else{
            this.activeId = null
            this.instockDetailedList = {rows:[],total:0}
          }
          this.pageLoading = false
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       *查询出库申请列表的分页
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      handleSizeChanged_(val) {
        this.pageSize_ = val
        this.getInstockApplyList()
      },
      handlePageChanged_(val) {
        this.pageNum_ = val
        this.getInstockApplyList()
      },

      /**
       * 点击某一项出库申请 查询对应申请的出库清单
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      handleNodeClick(row, column) {
        this.pageNum = 1
        this.activeId = row.id
        this.getInstockDetailedList(this.activeId);
      },

      /*
       * 获取对应申请的出库清单
       */
      getInstockDetailedList(applyId){
        this.tableLoading = true;
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_outstock/select`,
          data: {
            applyId:applyId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }
        this.axios(config).then((response) => {
          this.instockDetailedList = response.data.data
          this.tableLoading = false;
        }).catch((errorMsg) => {
          this.tableLoading = false;
          this.$message.error(errorMsg)
        })
      },
      /**
       *获取对应申请的出库清单的分页
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      handleSizeChanged(val) {
        this.pageSize = val
        this.getInstockDetailedList(this.activeId)
      },
      handlePageChanged(val) {
        this.pageNum = val
        this.getInstockDetailedList(this.activeId)
      },

      /**
       * 撤回出库
       * @param {[type]} parentId [description]
       */
      recallInstockApply(data) {

        this.$confirm("撤回当前出库审批", "确认撤回?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "post",
            url: `${this.common.basePath}/materialApply/recall`,
            params: {
              applyID: data.id
            }
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            // if(this.activeId == data.id) { //当删除的是当前激活的出库申请节点时 重置activeId 然后重新查询出库申请
            //   this.activeId = null
            // }
            this.getInstockApplyList()
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
      /**
       * 删除出库
       * @param {[type]} parentId [description]
       */
      deleteInstockApply(data) {

        this.$confirm("当前删除的内容将无法找回", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "post",
            url: `${this.common.basePath}/materialApply/delete`,
            params: {
              applyID: data.id
            }
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            if(this.activeId == data.id) { //当删除的是当前激活的入库申请节点时 重置activeId 然后重新查询入库申请
              this.activeId = null
            }
            this.getInstockApplyList()
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
      /**
       * 重新申请出库
       * @param {[type]} parentId [description]
       */
      replayInstockApply(data) {

        this.$confirm("重新申请当前出库记录", "确认重新申请?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "post",
            url: `${this.common.basePath}/materialApply/reapply`,
            params: {
              applyID: data.id
            }
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            // if(this.activeId == data.id) { //当删除的是当前激活的入库申请节点时 重置activeId 然后重新查询入库申请
            //   this.activeId = null
            // }
            this.getInstockApplyList()
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
      
    }
  };
</script>

<style>
  .el-table.el-table-instock .warning-row {
    background: oldlace;
  }

  .el-table.el-table-instock .success-row {
    background: #f0f9eb;
  }

  .el-table.el-table-instock .active-row {
    background: #bddeff;
  }

  .custom-expand .el-table__expand-column .cell {
    display: none;
  }
</style>