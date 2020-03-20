<!-- 教室工单(显示在实验室管理下) -->
<template>
  <div class="content-wrap-box" id="work-list">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>教室工单</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div v-if="common.checkAuthority('WorkList-list', true)">
        <!-- 搜索表单 -->
          <!-- <el-form ref="searchForm" :model="searchForm" label-width="120px">
            <el-row>
              <el-col :span="8" v-if="common.checkAuthorityTree('Standard-list')">
                <el-form-item label="设备规格：" prop="models">
                  <el-cascader :options="typeTree" :props="typeTreeProps" v-model="searchForm.models" change-on-select class="fill-width" @change="cascaderChanged"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="common.checkAuthorityTree('Standard-listType')">
                <el-form-item label="设备型号：" prop="type">
                  <el-select v-model="searchForm.type_id" class="fill-width" placeholder="请先选择规格后再选择型号" :disabled="searchForm.models.length <= 0">
                    <el-option v-for="(item, index) in modelList" :value="item.id" :label="item.model_name" :key="`${index}型号`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="编号：" prop="identifier">
                  <el-input class="fill-width" v-model="searchForm.identifier"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="借还状态：" prop="cur_status">
                  <el-select v-model="searchForm.cur_status" class="fill-width">
                    <el-option v-for="(item, index) in common.borrowStatus" :value="item.id" :label="item.label" :key="`借还状态${index}`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label=" ">
                  <el-button type="primary" @click="getTableList">搜索</el-button>
                  <el-button type="default" @click="clearForm">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form> -->

          <el-table
            :data="tableData.rows">
            <el-table-column label="申请人" prop="user_name" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="院系" prop="faculty_name" width="150px" show-overflow-tooltip></el-table-column>
            <el-table-column label="实验名" prop="experiment_name"></el-table-column>
            <el-table-column label="电话" prop="phone_num" width="120px"></el-table-column>
            <!-- <el-table-column label="借出时间" width="150px"><template slot-scope="scope">{{common._convertDate(scope.row.borrow_time, "yyyy年MM月dd日")}}</template></el-table-column> -->
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" :disabled="!common.checkAuthority('WorkList-detail', true)" @click="showDetail(scope.row)">查 看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      
      <!-- 页面底部 -->
      <div v-if="common.checkAuthority('WorkList-list', true)" class="router-view-bottom">
        <div></div>
        <!-- 分页 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="tableData.total"
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
          >
        </el-pagination>
      </div>
      <div v-else class="router-view-bottom"><div></div></div>
      
      <!-- 工单详情 -->
      <el-dialog :visible.sync="dialogDetailVisible" title="工单详情" id="work-list-dialog" :loading="dialogLoading">
        <h4 class="text-info">已预约教室</h4>
        <div v-if="detailData.classRooms">
          <el-card class="marb10" :body-style="{'padding': '0 20px'}">
            <p>
              <span><i class="fa fa-user"></i>预约人：{{detailData.user_name}}</span>
              <span class="marl10"><i class="fa fa-tag marl10"></i>实验名称：{{detailData.experiment_name}}</span>
              <span class="marl10 fr"><i class="fa fa-calendar marl10"></i>预约时间：{{common._convertDate(detailData.create_time, "yyyy年MM月dd日")}}</span>
            </p>
            <el-card v-for="(item, index) in detailData.classRooms" :key="`${index}已预约教室`" class="marb10" :body-style="{padding: '0 20px'} ">
              <p>
                <span><i class="fa fa-paperclip"></i>地址：{{item.address}}</span>
                <span class="marl10"><i class="fa fa-paperclip marl10"></i>编号：{{item.identifier}}</span>
              <p>
                <span>开始节次: {{item.timeTableRecord.begin_index}} &nbsp; 时间: {{common._convertDate(item.timeTableRecord.begin_time, "yyyy年MM月dd日")}}</span>
                <span class="fr">结束节次: {{item.timeTableRecord.end_index}} &nbsp; 时间: {{common._convertDate(item.timeTableRecord.end_time, "yyyy年MM月dd日")}}</span>
              </p>
            </el-card>
          </el-card>
        </div>

        <h4 class="text-info">冲突预约</h4>
        <div v-if="detailData.conflictRecordVo">
          <el-card v-for="(item, index) in detailData.conflictRecordVo" :key="`${index}已预约人`" class="marb10" :body-style="{'padding': '0 20px'}">
            <p>
              <span><i class="fa fa-user"></i>预约人：{{item.user_name}}</span>
              <span class="marl10"><i class="fa fa-tag marl10"></i>实验名称：{{item.experiment_name}}</span>
              <span class="marl10 fr"><i class="fa fa-calendar marl10"></i>预约时间：{{common._convertDate(item.create_time, "yyyy年MM月dd日")}}</span>
            </p>
            <div v-if="item.classRooms">
              <el-card v-for="(itemInner, indexInner) in item.classRooms" :key="`${indexInner}冲突教室`" class="marb10" :body-style="{'padding': '0 20px'}">
              <p class="text-danger"><i class="fa fa-home"></i><span>地址：{{itemInner.address}} </span> <span class="marl10"><i class="fa fa-paperclip marl10"></i>编号：{{itemInner.identifier}}</span></p>
              <p>
                <span>开始节次: {{itemInner.timeTableRecord.begin_index}} &nbsp; 时间: {{common._convertDate(itemInner.timeTableRecord.begin_time, "yyyy年MM月dd日")}}</span>
                <span class="fr">结束节次: {{itemInner.timeTableRecord.end_index}} &nbsp; 时间: {{common._convertDate(itemInner.timeTableRecord.end_time, "yyyy年MM月dd日")}}</span>
              </p>
            </el-card>
            </div>
          </el-card>
        </div>
        <span slot="footer">
          <el-button type="default" @click="dialogDetailVisible = false">取 消</el-button>
          <el-button type="warning" :disabled="!common.checkAuthority('WorkList-reject', true)" @click="rejectWorkList">拒 绝</el-button>
          <el-button type="primary" :disabled="!common.checkAuthority('WorkList-agree', true)" @click="confirmWorkList">同 意</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        typeTree: JSON.parse(sessionStorage.getItem("typeTree")),
        typeTreeProps: {
          label: 'd_name',
          value: 'id',
          children: 'children'
        },
        modelList: null, //型号列表 在选择规格树后查询
        searchForm: {
          models: [],
          type_id: null,
          cur_status: null
        },
        
        tableData: {
          rows: [],
          total: 0,
        },
        pageNum:  1,
        pageSize: 10,

        dialogLoading: false,
        dialogDetailVisible: false,
        tempId: null,
        detailData: {},
      }
    },
    created () {
      // console.log(this.$store.state.authority)
    },
    mounted () {
      if(this.common.checkAuthority("WorkList-list", true)) {
        this.getTableList()
      }
    },
    methods: {
      /**
       * 根据搜索条件查询列表
       * @return {[type]} [description]
       */
      getTableList() {
        this.tableLoading = true

        let data      = this.searchForm
        data.pageNum  = this.pageNum
        data.pageSize = this.pageSize
        data.cur_status = 2
        let config = {
          method: "post",
          url: `${this.common.basePath}/l_bespeak_record/list`,
          data: JSON.parse(JSON.stringify(data))
        }

        if(this.searchForm.models && this.searchForm.models.length > 0) {
          config.data.model_id = this.searchForm.models[this.searchForm.models.length - 1]
        }
        delete config.data.models
        
        this.axios(config).then((response) => {
          this.tableData = response.data.data
          this.$nextTick(_ => {
            this.tableLoading = false
          })
        }).catch((errorMsg) => {
          this.tableLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 清空 还原搜索表单
       * @return {[type]} [description]
       */
      clearForm() {
        this.searchForm = {
          models: [],
          type_id: null,
          cur_status: null
        }
      },
      pageSizeChange(val) {
        this.pageSize = val
        this.getTableList()
      },
      pageCurrentChange(val) {
        this.pageNum = val
        this.getTableList()
      },
      showDetail(row) {
        this.getWorkDetail(row.id)
      },
      getWorkDetail (id) {
        this.dialogLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/l_bespeak_record/detail/${id}`,
        }
        this.axios(config).then((response) => {
          this.tempId = id
          this.detailData = response.data.data
          this.dialogLoading = false
          this.dialogDetailVisible = true
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
          this.dialogDetailVisible = false
          this.dialogLoading = false
        })
      },
      /**
       * 报废设备
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      scrapDevice(row, type) {
        this.common.scrapDevice(row, type).then( _ => {
          this.getTableList()
        }).catch(_ => {})
      },
      /**
       * 点击规格树 将最终选择的规格进行型号查询
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      cascaderChanged(val) {
        this.searchForm.type_id = null
        this.getModelList(val[val.length - 1])
      },
      /**
       * 根据分类Id获取型号列表
       * @return {[type]} [description]
       */
      getModelList(id) {
        let config = {
          method: "get",
          url: `${this.common.basePath}/spec/select/model/public`,
          params: {
            id: id,
            pageNum: 1,
            pageSize: 999
          }
        }
        this.axios(config).then((response) => {
          this.modelList = response.data.data.rows
          if(this.$refs.deviceForm) {
            this.$refs.deviceForm.resetFields()
          }
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      confirmWorkList () {
        let config = {
          method: "get",
          url: `${this.common.basePath}/l_bespeak_record/agree/${this.tempId}`,
        }
        this.axios(config).then((response) => {
          this.getTableList()
          this.$message.success(response.data.meta.message)
          this.dialogDetailVisible = false
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      rejectWorkList () {
        let config = {
          method: "delete",
          url: `${this.common.basePath}/l_bespeak_record/reject/${this.tempId}`,
        }
        this.axios(config).then((response) => {
          this.getTableList()
          this.$message.success(response.data.meta.message)
          this.dialogDetailVisible = false
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      }
    }
  }
</script>
<style lang="less">
  #work-list-dialog {
    .el-dialog__body {
      padding-top: 0;
    }
    .el-card {
      border-color: #adadad;
    }
  }
</style>