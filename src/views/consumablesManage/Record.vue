<!-- 入库 （入库申请、入库清单）-->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>入库</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" v-loading="pageLoading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-row class="padding-row" v-if="common.checkAuthority('Record-list', true)">
          <!-- 入库搜索条件 -->
          <el-form ref="searchForm" :model="searchForm" label-width="120px" @submit.native.prevent>
            <el-row>
              <el-col :span="8">
                <el-form-item label="入库人：" prop="consumer">
                  <el-select v-model="searchForm.consumer" placeholder="请选择" class="fill-width" filterable>
                    <el-option v-for="(item, index) in userList" :value="item.id" :label="item.user_name" :key="`${index}入库人`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="操作人：" prop="creator">
                  <el-select v-model="searchForm.creator" placeholder="请选择" class="fill-width" filterable>
                    <el-option v-for="(item, index) in userList_" :value="item.id" :label="item.user_name" :key="`${index}创建者`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label=" ">
                  <el-button type="primary" @click="getInstockApplyList('init')" :disabled="!common.checkAuthority('Record-query', true)">搜索</el-button>
                  <el-button type="default" @click="clearForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 入库 -->
          <el-col :span="14">
            <el-card shadow="">
              <div slot="header" class="clearfix">
                <span>入库列表</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <el-table
                @row-click="handleNodeClick"
                class="el-table-instock"
                :row-class-name="tableRowClassName"
                :data="instockApplyList.rows"
                :show-header="true">
                <el-table-column
                  prop="consumerName"
                  label="入库人"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="creatorName"
                  label="操作人"
                  width="">
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
                    <el-tag v-if='scope.row.curStatus===2' type="success">已入库</el-tag>
                    <el-tag  v-if='scope.row.curStatus===1' type="warning">未入库</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="inStockType"
                  show-overflow-tooltip
                  label="类型"
                  width="">
                  <template slot-scope="scope">
                    <el-tag v-if='scope.row.inStockType===1' type="success">入库</el-tag>
                    <el-tag  v-if='scope.row.inStockType===2' type="danger">借出归还</el-tag>
                    <el-tag  v-if='scope.row.inStockType===3' type="warning">维修入库</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  fixed="right"
                  width="300">
                  <template slot-scope="scope">
                    <el-button type="" size="mini"  @click.stop='$router.push({name: "InstockDetail", params: { id: scope.row.id}});' v-if="common.checkAuthority('Record-detail', true)">查看</el-button>
                    <el-button type="success" size="mini" :disabled="scope.row.curStatus===2" @click.stop="confirmInstockApply(scope.row)" v-if="common.checkAuthority('Record-put', true)">入库</el-button>
                    <!-- type为1时创建入库单，为2时编辑入库单 -->
                    <el-button type="primary" size="mini" :disabled="scope.row.curStatus===2" @click.stop='$router.push({name: "InstockDetailedForm", params: {type: 2, id: scope.row.id}});' v-if="common.checkAuthority('Record-edit', true)">编辑</el-button>
                    <el-button type="danger" size="mini"  :disabled="scope.row.curStatus===2" v-if="common.checkAuthority('Record-delete', true)"  @click.stop="deleteInstockApply(scope.row)">删除</el-button>
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
                <span>入库清单</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <el-table
                stripe
                v-loading="tableLoading"
                :data="instockDetailedList.rows"
                :show-header="true">
                <el-table-column type="expand" label="仓库">
                  <template slot-scope="props">
                    <el-table
                      :data="props.row.materialInStockInfoHasStorehouses"
                      border
                      :show-header="true">
                      <el-table-column
                        prop="address"
                        align='center'
                        label="教室"
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
                  prop="identifier"
                  label="设备编号"
                  show-overflow-tooltip
                  width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.identifier">{{scope.row.identifier}}</span>
                    <i class="el-icon-close" v-else style="font-size: 16px"></i>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="serialNum"
                  label="设备序列号"
                  show-overflow-tooltip
                  width="">
                  
                  <template slot-scope="scope">
                    <span v-if="scope.row.serialNum">{{scope.row.serialNum}}</span>
                    <i class="el-icon-close" v-else style="font-size: 16px"></i>
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
        <div class="overflow-hidden fill-width" v-if="common.checkAuthority('Record-list', true)">
          <!-- type为1时创建入库单，为2时编辑入库单 -->
          <el-button type="primary" size="" class="fr" @click='$router.push({name: "InstockDetailedForm", params: {type: 1, id: 1 }});' :disabled="!common.checkAuthority('Record-create', true)">创建入库单</el-button>
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
          consumer: null,
          creator: null,
        },

        //入库申请
        instockApplyList:{rows:[],total:0},// 列表
        activeId:    null, //当前选中的Id
        tempId:      null, //鼠标浮动对应的节点id
        pageNum_: 1,
        pageSize_: 10,

        //入库清单
        instockDetailedList:{rows:[],total:0},// 入库清单
        pageNum: 1,
        pageSize: 10,
      };
    },
    created () {
     
    },
    mounted () {
      if(this.common.checkAuthority('Record-list', true)) {
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
       * 激活入库申请列表时，带上状态
       */
      tableRowClassName({row, rowIndex}) {
        if(row.id === this.activeId ){
          return 'active-row';
        }
        return '';
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
       * 查询入库申请列表
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

        let config = {
          method: "post",
          url: `${this.common.basePath}/material_instock/select_apply`,
          data: JSON.parse(JSON.stringify(data))
        }
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
       *查询入库申请列表的分页
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
       * 点击某一项入库申请 查询对应申请的入库清单
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      handleNodeClick(row, column) {
        this.pageNum = 1
        this.activeId = row.id
        this.getInstockDetailedList(this.activeId);
      },

      /*
       * 获取对应申请的入库清单
       */
      getInstockDetailedList(instockId){
        this.tableLoading = true;
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_info/select`,
          data: {
            instockId:instockId,
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
       *获取对应申请的入库清单的分页
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
       * 删除入库
       * @param {[type]} parentId [description]
       */
      deleteInstockApply(data) {

        this.$confirm("当前删除的内容将无法找回", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "get",
            url: `${this.common.basePath}/material_instock/delete`,
            params: {
              id: data.id
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
       * 确认入库
       * @param {[type]} parentId [description]
       */
      confirmInstockApply(data) {

        this.$confirm("确认入库？", "入库", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "post",
            url: `${this.common.basePath}/storehouse/in-stock/confirm`,
            params: {
              id: data.id
            }
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
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
</style>