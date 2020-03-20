<!-- 我的设备 -->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>我的设备</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div v-if="common.checkAuthority('MyDevice_List', true)">
         <!-- 搜索表单 -->
          <el-form ref="searchForm" :model="searchForm" label-width="120px" @submit.native.prevent>
            <el-row>
              <!-- <el-col :span="8">
                <el-form-item label="教室：" prop="classId">
                  <el-select v-model="searchForm.classId" placeholder="请选择" class="fill-width" >
                    <el-option v-for="(item, index) in classList" :value="item.id" :label="item.identifier" :key="`${index}教室`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="耗材类型：" prop="materialType">
                  <el-cascader :options="typeTree" :props="typeTreeProps" v-model="searchForm.materialType" change-on-select class="fill-width" @change="(val) => {cascaderChanged(val, 'searchForm')}" filterable></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="耗材型号：" prop="materialModel">
                  <el-select v-model="searchForm.materialModel" class="fill-width" placeholder="请先选择类型后再选择型号" :disabled="searchForm.materialType.length <= 0" filterable>
                    <el-option v-for="(item, index) in modelList" :value="item.id" :label="item.materialModel" :key="`${index}型号`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label=" ">
                  <el-button type="primary" @click="getTableList('init')" :disabled="!common.checkAuthority('MyDevice_Query', true)">搜索</el-button>
                  <el-button type="default" @click="clearForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-table
            :data="tableData.rows">
            <el-table-column label="#" type="index" width="60"></el-table-column>
            <el-table-column label="设备编号" prop="identifier" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备序列号" prop="serialNum" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备耗材类型" prop="materialTypeName" width="" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备耗材型号" prop="materialModelName" width="" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备耗材数量" prop="amount" show-overflow-tooltip width="120"></el-table-column>
            <el-table-column label="借出时间" width="150px"><template slot-scope="scope">{{common._convertDate(scope.row.modifyTime, "yyyy年MM月dd日")}}</template></el-table-column>
            <!-- <el-table-column label="借用人" prop="lend_user" width="120px"></el-table-column> -->
            <!-- <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" :disabled="!common.checkAuthority('Rent-return', true) || scope.row.cur_status > 1" @click="returnDevice(scope.row)">入库</el-button>
                <el-button type="danger" size="mini" :disabled="!common.checkAuthority('Rent-scrap', true) || scope.row.cur_status > 1" @click="scrapDevice(scope.row, '3')">报废</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      
      <!-- 页面底部 -->
      <div v-if="common.checkAuthority('MyDevice_List', true)" class="router-view-bottom">
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
        classList:[],
        typeTree: [],// 类型树
        typeTreeProps: {
          label: 'materialType',
          value: 'id',
          children: 'childrens'
        },
        modelList:[],
        searchForm: {
          materialType: [], //类型数组
          materialModel: null,
          // classId: null,
          modifiedBy:Number(sessionStorage.getItem('Access-Key')),
          curStatus:2
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
      let config = {method: "post",url: `${this.common.basePath}/material_type/tree`,data: {}};
      let self = this;
      this.axios(config).then((response) => {this.typeTree = response.data.data}).catch((errorMsg) => {this.$message.error(errorMsg)});
      // console.log(this.$store.state.authority)
    },
    mounted () {
      if(this.common.checkAuthority('MyDevice_List', true)) {
        this.getClassList();
        this.getTableList();
      }
    },
    methods: {
      /**
       * 点击类型树 将最终选择的类型进行型号查询
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      cascaderChanged(val, formName) {
        let target = null
        if (formName == "searchForm") {
          this[formName].materialModel = null
          target = "modelList"
        } else if (formName == "deviceForm") {
          this[formName].materialModel = null
          target = "dialogModelList"
        }
        this.getModelList(val[val.length - 1], target)
      },
      /**
       * 根据类型Id获取型号列表
       * @return {[type]} [description]
       */
      getModelList(id, target) {
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_model/list`,
          data: {
            materialType: id,
          }
        }
        this.axios(config).then((response) => {
          this[target] = response.data.data.rows
          if(this.$refs.deviceForm) {
            this.$refs.deviceForm.resetFields()
          }
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 查询教室列表
       * @return {[type]} [description]
       */
      getClassList() {
        let config = {
          method: "get",
          url: `${this.common.basePath}/class/list`,
          params: {
            pageNum: 1,
            pageSize: 9999
          }
        }
        this.axios(config).then((response) => {
          this.classList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },

      /**
       * 根据搜索条件查询列表
       * @return {[type]} [description]
       */
      getTableList(init) {
        this.tableLoading = true

        let data = this.searchForm
        if(init == "init") { // 需要初始化查询
          this.pageNum = 1
          this.pageSize = 10
        }
        data.pageNum  = this.pageNum
        data.pageSize = this.pageSize

        let config = {
          method: "post",
          url: `${this.common.basePath}/storehouse/list`,
          data: JSON.parse(JSON.stringify(data))
        }

        if(this.searchForm.materialType && this.searchForm.materialType.length > 0) {
          config.data.materialType = this.searchForm.materialType[this.searchForm.materialType.length - 1]
        }
        delete config.data.materialType
        
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
          materialType: [], //类型数组
          materialModel: null,
          classId: null,
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
    }
  }
</script>
<style lang="less">
  
</style>