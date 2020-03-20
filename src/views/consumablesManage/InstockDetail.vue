<!-- 入库详情 -->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/consumables/record' }">入库</el-breadcrumb-item>
        <el-breadcrumb-item>入库详情</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg" v-loading="pageLoading">

      <div class="router-view-content">
        <el-row v-if="common.checkAuthority('InstockDetail-info', true)">
          <!-- 基本信息 -->
          <el-card shadow="">
            <div slot="header" class="clearfix">
              <span>基本信息</span>
              <div class="fr" v-if="detailData">
                <el-button type="success" size="mini" :disabled="detailData.curStatus===2" @click.stop="confirmInstockApply(detailData)" v-if="common.checkAuthority('Record-detail-put', true)">入库</el-button>
                <el-button type="primary" size="mini" :disabled="detailData.curStatus===2" @click.stop='$router.push({name: "InstockDetailedForm", params: {type: 2, id: detailData.id}});' v-if="common.checkAuthority('Record-detail-edit', true)">编辑</el-button>
                <el-button type="danger" size="mini"  :disabled="detailData.curStatus===2" v-if="common.checkAuthority('Record-detail-delete', true)"  @click.stop="deleteInstockApply(detailData)">删除</el-button>
              </div>
            </div>
            <el-form :model="detailData" label-width="120px" label-position="left" v-if="detailData">
              <el-row :gutter="20">
                <el-col :span='24'>
                  <el-form-item label="入库人：">
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
                          <!-- <el-col :span="12">
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
                         <!--  <el-col :span="12">
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
                          <!-- <el-col :span="24">
                            <el-form-item label="简介：" prop="sim_desc"><el-input disabled type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="consumerBaseInfo.sim_desc"></el-input></el-form-item>
                          </el-col> -->
                        </el-row>
                      </el-form>
                    </el-card>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label="操作人：">
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
                          </el-col> -->
                          <!-- <el-col :span="12">
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
                  <el-form-item label="操作时间："><span>{{common._convertDate(detailData.createTime, "yyyy/MM/dd")}}</span></el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item label="入库类型：">
                    <el-tag v-if='detailData.inStockType===1' type="success">入库</el-tag>
                    <el-tag  v-if='detailData.inStockType===2' type="danger">借出归还</el-tag>
                    <el-tag  v-if='detailData.inStockType===3' type="warning">维修入库</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item label="状态：">
                    <el-tag v-if='detailData.curStatus===2' type="success">已入库</el-tag>
                    <el-tag  v-if='detailData.curStatus===1' type="warning">未入库</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label="原因：">
                    <div class="desc_info_box">
                      {{detailData.reason}}
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label="入库清单：">
                    <el-card shadow="">
                      <el-table
                        stripe
                        :data="detailData.materialInStockInfos"
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
  export default {
    data() {
      return {
        paramsId:          this.$route.params.id,

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
      if(this.common.checkAuthority('InstockDetail-info', true)) {
        this.getInstockDetailedInfo();
      }
    },
    methods: {

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
       * 获取入库信息
       */
      getInstockDetailedInfo() {
        this.pageLoading = true;
        let config = {
          method: "get",
          url: `${this.common.basePath}/material_instock/select_detail`,
          params: {
            id:this.paramsId
          }
        }
        this.axios(config).then((response) => {
          this.detailData = response.data.data;
          response.data.data.consumer?this.getUserBaseInfo01(response.data.data.consumer):'';
          response.data.data.creator?this.getUserBaseInfo02(response.data.data.creator):'';
          this.pageLoading = false;
        }).catch((errorMsg) => {
          this.pageLoading = false;
          this.$message.error(errorMsg)
        })
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
            this.$router.push({name: "Record"});
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
</style>