<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>安全日志</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <!-- 搜索表单 -->
        <div v-if="common.checkAuthority('Security-list', true)">
          <el-form ref="searchForm" :model="searchForm" label-width="120px">
            <el-row>
              <!-- <el-col :span="8">
                <el-form-item label="操作人：" prop="user">
                  <el-select v-model="searchForm.user" class="fill-width" placeholder="请选择操作人">
                    <el-option v-for="(item, index) in userList" :value="item.id" :label="item.user_name" :key="`${index}用户列表`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="关键字：" prop="keyWords">
                  <el-input class="fill-width" v-model="searchForm.keyWords"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="操作时间：" prop="timeRange">
                  <el-date-picker :clearable="false" type="daterange" value-format="timestamp" class="fill-width" v-model="searchForm.timeRange"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                &nbsp;&nbsp;<el-button type="primary" @click="getLogList(true)">搜 索</el-button><el-button type="default" @click="clearForm">重 置</el-button>
              </el-col>
            </el-row>
          </el-form>

          <el-table
            v-loading="tableLoading"
            :data="tableData.list">
            <el-table-column type="index" label="序号" width="55">
            </el-table-column>
            <el-table-column label="登录人" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="时间" width="200" fixed="right"><template slot-scope="scope">{{common._convertDate(scope.row.create_time, "yyyy年MM月dd日 hh:mm:ss")}}</template></el-table-column>
          </el-table>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div v-if="common.checkAuthority('Security-list', true)" class="router-view-bottom">
        <div></div>
        <!-- 分页 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="tableData.total"
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange">
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
        userList: null,
        searchForm: {
          user: null,
          keyWords: null,
          timeRange: [],
        },

        tableLoading: false,
        tableData: {
          list: [],
          total: 0
        },
        pageNum: 1,
        pageSize: 10,
      }
    },
    mounted() {
      if (this.common.checkAuthority('Security-list', true)) {
        this.getUserList()
        this.getLogList(true)
      }
    },
    methods: {
      /**
       * 根据搜索条件查询用户列表
       * @return {[type]} [description]
       */
      getUserList() {
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/list`,
          data: {
            pageNum: 1,
            pageSize: 999
          }
        }
        this.axios(config).then((response) => {
          this.userList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 根据搜索条件查询列表
       * @return {[type]} [description]
       */
      getLogList(init) {
        this.tableLoading = true

        let form = JSON.parse(JSON.stringify(this.searchForm))
        init ? this.pageNum  = 1 : null
        form.pageNum  = this.pageNum
        form.pageSize = this.pageSize
        form.stime    = form.timeRange[0] || null
        form.etime    = form.timeRange[1] || null

        delete form.timeRange
        let config = {
          method: "get",
          url: `${this.common.basePath}/log_system/searchSystem`,
          params: form
        }

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
        this.getLogList(true)
      },
      pageCurrentChange(val) {
        this.pageNum = val
        this.getLogList(true)
      },
      clearForm () {
        this.$refs.searchForm.resetFields()
      }
    }
  }
</script>
<style lang="less">
  
</style>