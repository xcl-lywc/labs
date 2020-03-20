<!-- 出库详情 -->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-if="paramsType=='1'" :to="{ path: '/consumables/out' }">出库</el-breadcrumb-item>
        <el-breadcrumb-item v-if="paramsType=='2'" :to="{ path: '/consumables/myout' }">我的申请</el-breadcrumb-item>
        <el-breadcrumb-item v-if="paramsType=='1'">出库详情</el-breadcrumb-item> 
        <el-breadcrumb-item v-if="paramsType=='2'">我的申请详情</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg" v-loading="pageLoading">
      
      <div class="router-view-content">
        <el-row v-if="common.checkAuthority('OutstockDetail-info', true)">
          <!-- 基本信息 -->
          <el-card shadow="">
            <div slot="header" class="clearfix">
              <span>基本信息</span>
              <div class="fr" v-if="detailData&&paramsType=='1'">
                <el-button type="success" size="mini" :disabled="detailData.curStatus===2||detailData.curStatus===3||detailData.curStatus===5||detailData.creator==me" @click.stop='$router.push({name: "OutstockDetailedForm", params: {type: 3, id: detailData.id, page:1}});' v-if="common.checkAuthority('Out-detail-approval', true)">审批</el-button>
              </div>
              <div class="fr" v-if="detailData&&paramsType=='2'">
                <el-button type="primary" size="mini" :disabled="detailData.curStatus===2||detailData.curStatus===3||detailData.curStatus===1" @click.stop='$router.push({name: "OutstockDetailedForm", params: {type: 2, id: detailData.id, page:2}});' v-if="common.checkAuthority('MyOut-detail-edit', true)">编辑</el-button>
                <el-button type="info" size="mini"  :disabled="detailData.curStatus===2||detailData.curStatus===3||detailData.curStatus===5" v-if="common.checkAuthority('MyOut-detail-recall', true)"  @click.stop="recallInstockApply(detailData)">撤回</el-button>
                <el-button type="warning" size="mini" :disabled="detailData.curStatus===2||detailData.curStatus===3||detailData.curStatus===1" @click.stop='replayInstockApply(detailData);' v-if="common.checkAuthority('MyOut-detail-replay', true)">重申</el-button>
                <el-button type="danger" size="mini" :disabled="detailData.curStatus===2||detailData.curStatus===3||detailData.curStatus===1" @click.stop='deleteInstockApply(detailData);' v-if="common.checkAuthority('MyOut-detail-delete', true)">删除</el-button>
              </div>
            </div>
            <el-form :model="detailData" label-width="120px" label-position="left" v-if="detailData">
              <el-row :gutter="20">
                <el-col :span='24'>
                  <el-form-item label="审批人：">
                    <el-card shadow="never">
                      <el-form label-width="100px" class="show-detail-form" v-if="consumerBaseInfo">
                        <el-row :gutter="5">
                          <el-col :span="24">
                            <el-col :span="12">
                              <el-form-item label="工号/学号：" prop="account"><span>{{ consumerBaseInfo.account }}</span></el-form-item>
                              <el-form-item label="姓名：" prop="user_name"><span>{{ consumerBaseInfo.user_name }}</span></el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="头像：" prop="head_img">
                                <el-avatar v-if="consumerBaseInfo.head_img||consumerBaseInfo.head_img===''" shape="square" :size="50" :src="common.filePath + consumerBaseInfo.head_img">
                                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                                </el-avatar>
                                <span v-else>未上传头像</span>
                              </el-form-item>
                            </el-col>
                          </el-col>
                         <!--  <el-col :span="12">
                            <el-form-item label="年级：" prop="grade_num"><span>{{ consumerBaseInfo.grade_num?consumerBaseInfo.grade_num+'届':'' }}</span></el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="班级：" prop="class_num"><span>{{ consumerBaseInfo.class_num?consumerBaseInfo.class_num+'班':'' }}</span></el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="性别：" prop="sex">
                              <i class="el-icon-male" v-if="consumerBaseInfo.sex===1"></i>
                              <i class="el-icon-female" v-if="consumerBaseInfo.sex===2"></i>
                            </el-form-item>
                          </el-col> -->
                          <!-- <el-col :span="12">
                            <el-form-item label="入校时间：" prop="admission_time">
                              <span>{{ common._convertDate(consumerBaseInfo.admission_time, "yyyy年MM月dd日") }}</span>
                            </el-form-item>
                          </el-col> -->
                          <el-col :span="24">
                            <el-form-item v-if="facultyTreeData" label="院系：" prop="faculties_ids">
                              <el-cascader disabled :options="facultyTreeData" :props="facultyProps" v-model="consumerBaseInfo.faculties_ids" change-on-select class="fill-width text-info"></el-cascader>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="手机：" prop="phone_num"><span>{{ consumerBaseInfo.phone_num }}</span></el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="邮箱：" prop="mail"><span>{{ consumerBaseInfo.mail }}</span></el-form-item>
                          </el-col>
                         <!--  <el-col :span="24">
                            <el-form-item label="简介：" prop="sim_desc"><el-input disabled type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="consumerBaseInfo.sim_desc"></el-input></el-form-item>
                          </el-col> -->
                        </el-row>
                      </el-form>
                    </el-card>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label="申请人：">
                    <el-card shadow="never">
                      <el-form label-width="100px" class="show-detail-form" v-if="creatorBaseInfo">
                        <el-row :gutter="5">
                          <el-col :span="24">
                            <el-col :span="12">
                              <el-form-item label="工号/学号：" prop="account"><span>{{ creatorBaseInfo.account }}</span></el-form-item>
                              <el-form-item label="姓名：" prop="user_name"><span>{{ creatorBaseInfo.user_name }}</span></el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="头像：" prop="head_img">
                                <el-avatar v-if="creatorBaseInfo.head_img||creatorBaseInfo.head_img===''" shape="square" :size="50" :src="common.filePath + creatorBaseInfo.head_img">
                                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                                </el-avatar>
                                <span v-else>未上传头像</span>
                              </el-form-item>
                            </el-col>
                          </el-col>
                          <!-- <el-col :span="12">
                            <el-form-item label="年级：" prop="grade_num"><span>{{ creatorBaseInfo.grade_num?creatorBaseInfo.grade_num+'届':'' }}</span></el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="班级：" prop="class_num"><span>{{ creatorBaseInfo.class_num?creatorBaseInfo.class_num+'班':'' }}</span></el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="性别：" prop="sex">
                              <i class="el-icon-male" v-if="creatorBaseInfo.sex===1"></i>
                              <i class="el-icon-female" v-if="creatorBaseInfo.sex===2"></i>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="入校时间：" prop="admission_time">
                              <span>{{ common._convertDate(creatorBaseInfo.admission_time, "yyyy年MM月dd日") }}</span>
                            </el-form-item>
                          </el-col> -->
                          <el-col :span="24">
                            <el-form-item v-if="facultyTreeData" label="院系：" prop="faculties_ids">
                              <el-cascader disabled :options="facultyTreeData" :props="facultyProps" v-model="creatorBaseInfo.faculties_ids" change-on-select class="fill-width text-info"></el-cascader>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="手机：" prop="phone_num"><span>{{ creatorBaseInfo.phone_num }}</span></el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="邮箱：" prop="mail"><span>{{ creatorBaseInfo.mail }}</span></el-form-item>
                          </el-col>
                          <!-- <el-col :span="24">
                            <el-form-item label="简介：" prop="sim_desc"><el-input disabled type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="creatorBaseInfo.sim_desc"></el-input></el-form-item>
                          </el-col> -->
                        </el-row>
                      </el-form>
                    </el-card>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item label="申请时间："><span>{{common._convertDate(detailData.createTime, "yyyy/MM/dd")}}</span></el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item label="出库类型：">
                    <el-tag v-if='detailData.applyType===1' type="success">借出申请</el-tag>
                    <el-tag  v-if='detailData.applyType===2' type="warning">维修申请</el-tag>
                    <el-tag  v-if='detailData.applyType===3' type="danger">报废</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item label="联系电话："><span>{{detailData.applyPhone}}</span></el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item label="状态：">
                    <el-tag v-if='detailData.curStatus===1' type="warning">未审批</el-tag>
                    <el-tag  v-if='detailData.curStatus===2' type="success">已审批</el-tag>
                    <el-tag v-if='detailData.curStatus===3' type="danger">被驳回</el-tag>
                    <el-tag  v-if='detailData.curStatus===5' type="info">已撤回</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label="备注：">
                    <div class="desc_info_box">
                      {{detailData.description}}
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label="图片：">
                    <file-show :fileList="detailData.approverFiles?[JSON.parse(detailData.approverFiles)]:[]" :closable="false"></file-show>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label="同意/拒绝原因：">
                    <div class="desc_info_box">
                      {{detailData.reason}}
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label="出库清单：">
                    <el-card shadow="">
                      <el-table
                        stripe
                        :data="detailData.articles"
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
                    </el-card>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div v-else class="text-center text-info"> 暂无数据 </div>    
          </el-card>
        </el-row>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>    
      </div>

    </div>
  </div>
</template>
<script>
  import FileShow from "../../components/FileShow.vue"
  export default {
    components: {
      FileShow
    },
    data() {
      return {
        me:sessionStorage.getItem('Access-Key'),
        paramsId:          this.$route.params.id,
        paramsType:          this.$route.params.type,

        pageLoading: false,


        detailData:null,
        consumerBaseInfo:null,
        creatorBaseInfo:null,


        facultyTreeData:null,
        facultyProps: {
          children: 'childrens',
          label: 'faculty',
          value: 'id'
        },
      };
    },
    created () {
      this.initFacultyTree();
    },
    mounted () {
      if(this.common.checkAuthority('OutstockDetail-info', true)) {
        this.getInstockDetailedInfo();
      }
    },
    methods: {

      /**
       * 解决Vue的表格中，expand只有某些行需要展开的问题。
       */
      setClassName({row, index}){
          // 通过自己的逻辑返回一个class或者空
          return row.modelType==1 ? 'custom-expand' : '';
      },

      getUserBaseInfo01(id){
        let config = {
          method: "get",
          url: `${this.common.basePath}/user/one/user`,
          params: {
            id: id
          },
        }
        this.axios(config).then((response) => {
          this.consumerBaseInfo = response.data.data; 
          
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })

      },
      getUserBaseInfo02(id){
        let config = {
          method: "get",
          url: `${this.common.basePath}/user/one/user`,
          params: {
            id: id
          },
        }
        this.axios(config).then((response) => {
          this.creatorBaseInfo = response.data.data; 
          
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })

      },

      /**
       * 获取院系树
       * @return {[type]} [description]
       */
      initFacultyTree() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/faculty/tree/public`
        }
        this.axios(config).then((response) => {
          this.facultyTreeData = response.data.data || []
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })        
      },

      /**
       * 获取出库信息
       */
      getInstockDetailedInfo() {
        this.pageLoading = true;
        let config = {
          method: "get",
          url: `${this.common.basePath}/materialApply/info`,
          params: {
            applyID:this.paramsId
          }
        }
        this.axios(config).then((response) => {
          this.detailData = response.data.data;
          response.data.data.approver?this.getUserBaseInfo01(response.data.data.approver):this.getUserBaseInfo01(sessionStorage.getItem("Access-Key"));
          response.data.data.creator?this.getUserBaseInfo02(response.data.data.creator):this.getUserBaseInfo02(sessionStorage.getItem("Access-Key"));
          this.pageLoading = false;
        }).catch((errorMsg) => {
          this.pageLoading = false;
          this.$message.error(errorMsg)
        })
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
            this.getInstockDetailedInfo()
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
            this.$router.push({name: "MyOut"});
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
            this.getInstockDetailedInfo()
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