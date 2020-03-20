<!-- 设备借还 -->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>设备借还</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div v-if="common.checkAuthority('Rent-list', true)">
        <!-- 搜索表单 -->
          <el-form ref="searchForm" :model="searchForm" label-width="120px">
            <el-row>
              <el-col :span="8" v-if="common.checkAuthorityTree('Standard-list') && typeTree">
                <el-form-item label="设备规格：" prop="types">
                  <el-cascader :options="typeTree" :props="typeTreeProps" v-model="searchForm.types" change-on-select class="fill-width" @change="cascaderChanged"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="common.checkAuthorityTree('Standard-listType')">
                <el-form-item label="设备型号：" prop="model_id">
                  <el-select v-model="searchForm.model_id" class="fill-width" placeholder="请先选择规格后再选择型号" :disabled="searchForm.types.length <= 0">
                    <el-option v-for="(item, index) in modelList" :value="item.id" :label="item.model_name" :key="`${index}型号`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="编号：" prop="code">
                  <el-input class="fill-width" v-model="searchForm.code"></el-input>
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
                  <el-button type="primary" @click="getTableList('init')">搜索</el-button>
                  <el-button type="default" @click="clearForm">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-table
            :data="tableData.rows">
            <el-table-column label="编号" prop="code" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="序列号" prop="serial_num" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格" prop="d_type" show-overflow-tooltip></el-table-column>
            <el-table-column label="名称" prop="d_name" show-overflow-tooltip></el-table-column>
            <el-table-column label="借出人学号" prop="borrow_user_account" width="100"></el-table-column>
            <el-table-column label="借出人" prop="borrow_user"></el-table-column>
            <el-table-column label="借出时间" width="150px"><template slot-scope="scope">{{common._convertDate(scope.row.borrow_time, "yyyy年MM月dd日")}}</template></el-table-column>
            <el-table-column label="借用人" prop="lend_user"></el-table-column>
            <el-table-column label="入库人" prop="return_user"></el-table-column>
            <el-table-column label="入库时间" width="150px"><template slot-scope="scope">{{common._convertDate(scope.row.return_time, "yyyy年MM月dd日")}}</template></el-table-column>
            <el-table-column label="状态" prop="cur_status"><template slot-scope="scope">{{common.transferBorrowStatus(scope.row.cur_status)}}</template></el-table-column>
            <!-- <el-table-column
              label="名称"
              width="180">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" :disabled="!common.checkAuthority('Rent-return', true) || scope.row.cur_status > 1" @click="returnDevice(scope.row)">入库</el-button>
                <el-button type="danger" size="mini" :disabled="!common.checkAuthority('Rent-scrap', true) || scope.row.cur_status > 1" @click="scrapDevice(scope.row, '3')">报废</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      
      <!-- 页面底部 -->
      <div v-if="common.checkAuthority('Rent-list', true)" class="router-view-bottom">
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
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        typeTree: JSON.parse(sessionStorage.getItem("typeTree")) || [],
        typeTreeProps: {
          label: 'd_name',
          value: 'id',
          children: 'children'
        },
        modelList: null, //型号列表 在选择规格树后查询
        searchForm: {
          types: [],
          model_id: null,
          cur_status: null
        },
        
        tableData: {
          rows: [],
          total: 0,
        },
        pageNum:  1,
        pageSize: 10,
      }
    },
    created () {
      // console.log(this.$store.state.authority)
    },
    mounted () {
      if(this.common.checkAuthority('Rent-list', true)) {
        this.getTableList()
      }
    },
    methods: {
      /**
       * 根据搜索条件查询列表
       * @return {[type]} [description]
       */
      getTableList(init) {
        this.tableLoading = true
        let data      = this.searchForm
        if(init) {
          this.pageNum  = 1
          this.pageSize = 10
        }
        data.pageNum  = this.pageNum
        data.pageSize = this.pageSize
        let config = {
          method: "post",
          url: `${this.common.basePath}/br/list`,
          data: JSON.parse(JSON.stringify(data))
        }

        if(this.searchForm.types && this.searchForm.types.length > 0) {
          config.data.type = this.searchForm.types[this.searchForm.types.length - 1]
        }
        delete config.data.types
        
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
          types: [],
          model_id: null,
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
      /**
       * 入库设备
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      returnDevice(row) {
        this.common.returnDevice(row, '/br/recovery').then( _ => {
          this.getTableList()
        }).catch(_ => {})
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
        this.searchForm.model_id = null
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
    }
  }
</script>
<style lang="less">
  
</style>