<!-- 设备报废 -->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>设备报废</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <!-- 搜索表单 -->
        <div v-if="common.checkAuthority('Scrap-list', true)">
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
              <!-- <el-col :span="8">
                <el-form-item label="设备状态：">
                  <el-select v-model="searchForm.lesson" class="fill-width">
                    <el-option value="1" label="选项1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
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
            <el-table-column label="申报人" prop="declare_user" width="150px"></el-table-column>
            <el-table-column label="理由" prop="reason" show-overflow-tooltip width="250px"></el-table-column>
            <el-table-column label="申报时间" width="150px"><template slot-scope="scope">{{common._convertDate(scope.row.declare_time, "yyyy年MM月dd日")}}</template></el-table-column>
          </el-table>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div v-if="common.checkAuthority('Scrap-list', true)" class="router-view-bottom">
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
    mounted() {
      if(this.common.checkAuthority('Scrap-list', true)) {
        this.searchForm.cur_status = this.common.curStatus[0].id // 初始查询全部状态 即第一个状态
        this.getTableList()
      }
    },
    methods: {
      /**
       * 根据搜索条件查询用户列表
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
          url: `${this.common.basePath}/scrap/list`,
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
      pageSizeChange(val) {
        this.pageSize = val
        this.getTableList()
      },
      pageCurrentChange(val) {
        this.pageNum = val
        this.getTableList()
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
          url: `${this.common.basePath}/spec/select/model`,
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