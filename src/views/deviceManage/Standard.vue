<!-- 设备规格 -->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>设备规格</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" v-loading="pageLoading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-row class="padding-row" v-if="common.checkAuthority('Standard-list', true)">
          <el-col :span="7">
            <div><el-button type="primary" class="fill-width" size="mini" @click="addTree(null)" :disabled="!common.checkAuthority('Standard-add', true)">添加顶级</el-button></div>
            <el-tree v-if="treeData" :data="treeData" :props="defaultProps" node-key="id" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false">
              <span class="fill-width" slot-scope="{ node, data }">
                <el-tooltip :enterable="false" :content="node.label" placement="right-start">
                  <div @mouseenter="tempId = data.id" @mouseleave="tempId = null">
                    <span :class="{'text-primary' : activeId == data.id }" >
                      <!-- <i class="el-icon-circle-check" v-if="activeId == data.id"></i> -->
                      {{ node.label }}
                      <span v-if="tempId == data.id">
                        <el-button type="text" v-if="!data.parent_id && common.checkAuthority('Standard-add', true)" @click.stop="addTree(data)">添加次级</el-button>
                        <el-button type="text" @click.stop="editTree(data)" v-if="common.checkAuthority('Standard-edit', true)">编辑</el-button>
                        <el-button type="text" v-if="!(data.childrens && data.childrens.length > 0) && common.checkAuthority('Standard-delete', true)" class="text-danger" @click.stop="deleteTree(data)">删除</el-button>
                      </span>
                    </span>
                  </div>
                 </el-tooltip effect="dark" content="Right Center 提示文字" placement="right">
               </span>
            </el-tree>
          </el-col>
          <el-col :span="17" v-if="common.checkAuthority('Standard-listType', true)">
            <el-table
              :data="tableData.rows"
              :show-header="true">
              <el-table-column
                prop="model_name"
                label="型号名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="instructions"
                label="介绍"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                width="250">
                <template slot-scope="scope">
                  <el-button type="default" size="mini" @click="showDetailDialog(scope.row.id)" :disabled="!common.checkAuthority('Standard-detailType', true)">查 看</el-button>
                  <el-button type="primary" size="mini" @click="showModelDialog('edit', scope.row)" :disabled="!common.checkAuthority('Standard-editType', true)">编 辑</el-button>
                  <el-button type="danger" size="mini" @click="deleteModel(scope.row)" :disabled="!common.checkAuthority('Standard-deleteType', true)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col v-else :span="17" class="text-center text-info"> 你无权查看此内容 </el-col>
        </el-row>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom" v-if="common.checkAuthority('Standard-list', true) && common.checkAuthority('Standard-listType', true)">
        <!-- 操作按钮组 -->
        <div>
          <el-button type="primary" size="mini" @click="showModelDialog('new')" :disabled="!common.checkAuthority('Standard-addType', true)">新增型号</el-button>
        </div>
        <!-- 分页 -->
        <el-pagination
          class="fill-width"
          background
          @size-change="handleSizeChanged"
          @current-change="handlePageChanged"
          layout="total, sizes, prev, pager, next"
          :total="tableData.total">
        </el-pagination>
      </div>
      <div v-else class="router-view-bottom"><div></div></div>
      
      <el-dialog title="设备规格" :visible.sync="dialogTypeVisible" width="50vw">
        <el-form ref="typeForm" :model="typeForm" label-width="100px" :rules="typeRules">
          <el-form-item label="规格名称：" prop="d_name"><el-input v-model="typeForm.d_name"></el-input></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTypeVisible = false">取消</el-button>
          <el-button type="primary" @click="addTreeSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="设备型号" :visible.sync="dialogModelVisible" width="50vw">
        <el-form ref="modelForm" :model="modelForm" label-width="100px" :rules="modelRules">
          <el-form-item label="名称：" prop="model_name"><el-input v-model="modelForm.model_name"></el-input></el-form-item>
          <el-form-item label="用途：" prop="instructions"><el-input type="textarea" v-model="modelForm.instructions"></el-input></el-form-item>
          <el-form-item label="注意事项：" prop="attention"><el-input type="textarea" v-model="modelForm.attention"></el-input></el-form-item>
          <el-form-item v-if="operateType == 'edit'" label="附件：" >
            <file-show :fileList="modelForm.modelData" :closable="true" @handleClose="handleClose"></file-show>
            <upload buttonText="点击上传" @uploadSuccess="(response) => {uploadFileSuccess(response, 4)}"/>
          </el-form-item>
          <el-form-item v-if="operateType == 'edit'" label="图片附件：" >
            <file-show :fileList="modelForm.imgData" :closable="true" @handleClose="handleClose"></file-show>
            <upload buttonText="点击上传" @uploadSuccess="(response) => {uploadFileSuccess(response, 7)}"/>
          </el-form-item>
          <el-form-item v-if="operateType == 'edit'" label="视频附件：" >
            <file-show :fileList="modelForm.videoData" :closable="true" @handleClose="handleClose"></file-show>
            <upload buttonText="点击上传" @uploadSuccess="(response) => {uploadFileSuccess(response, 6)}"/>
          </el-form-item>
          <span class="text-info" v-if="operateType == 'edit'">附件操作为实时操作, 只操作附件无需点击 "确定" 按钮</span>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogModelVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitModel">确 定</el-button>
        </div>
      </el-dialog>
      
      <el-dialog title="设备详情" :visible.sync="dialogDetailVisible" width="50vw">
        <el-form :model="detailData" label-width="90px" label-position="left">
          <el-form-item label="名称："><span>{{detailData.model_name}}</span></el-form-item>
          <el-form-item label="用途："><span>{{detailData.instructions}}</span></el-form-item>
          <el-form-item label="注意事项："><span>{{detailData.attention}}</span></el-form-item>
          <el-form-item label="附件：">
            <file-show :fileList="detailData.modelData"></file-show>
          </el-form-item>
          <el-form-item label="图片附件：">
            <file-show :fileList="detailData.imgData"></file-show>
          </el-form-item>
          <el-form-item label="视频附件：">
            <file-show :fileList="detailData.videoData"></file-show>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogDetailVisible = false">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import upload from "../../components/Upload.vue"
  import FileShow from "../../components/FileShow.vue"
  export default {
    data() {
      return {
        pageLoading: false,
        treeData:    [],
        activeId:    null, //当前选中的Id
        tempId:      null, //鼠标浮动对应的节点id
        defaultProps: {
          children: 'children',
          label: 'd_name'
        },

        tableData: {
          rows: [],
          total: 0
        },
        pageNum: 1,
        pageSize: 10,

        operateType: "new",

        //规格分类
        dialogTypeVisible: false,
        typeForm: {
          d_name: null
        },

        //型号
        dialogModelVisible: false,
        modelForm: {  //型号表单 编辑&详情都以此为基础, 编辑时深拷贝此对象
          model_name: null,
          instructions: null,
        },

        typeRules: {
          d_name: [
            {required: true, message: "请输入名称", trigger: "blur"}
          ]
        },
        modelRules: {
          model_name: [
            {required: true, message: "请输入名称", trigger: "blur"}
          ]
        },
        dialogDetailVisible: false,
        tempDetailId: null,
        detailData: {}
      };
    },
    components: {
      upload,
      FileShow
    },
    created () {
    },
    mounted () {
      if(this.common.checkAuthority('Standard-list', true)) {
        this.getTypeTree()
      }
    },
    methods: {
      /**
       * 获取规格分类树, 并在初始化时查询一次第一个规格分类下的设备
       * @return {[type]} [description]
       */
      getTypeTree() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/spec/tree`
        }
        let self = this

        this.axios(config).then((response) => {
          this.treeData   = response.data.data
          !this.activeId ? this.activeId = response.data.data[0].id : null
          if (this.common.checkAuthority('Standard-listType', true)) {
            this.getModelList(response.data.data[0].id)
          }
          sessionStorage.setItem('typeTree', JSON.stringify(response.data.data)) // 更新保存至session的数据
          this.pageLoading = false
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 点击添加规格分类
       * @param {[type]} parentId [description]
       */
      addTree(data) {
        this.operateType = "new"
        this.dialogTypeVisible = true
        this.typeForm   = {
          d_name: null
        }
        data ? this.typeForm.parent_id = data.id : null //传入data 表示添加当前的子集
      },
      /**
       * 点击编辑规格分类
       * @param {[type]} parentId [description]
       */
      editTree(data) {
        this.operateType = "edit"
        this.dialogTypeVisible = true
        this.typeForm = JSON.parse(JSON.stringify(data))
      },
      /**
       * 提交编辑/添加规格分类
       * @param {[type]} parentId [description]
       */
      addTreeSubmit(data) {
        let config = {
          method: this.operateType == "new" ? "post" : "patch",
          url: this.operateType == "new" ? `${this.common.basePath}/spec/add/type` : `${this.common.basePath}/spec/update/type` ,
          data: this.typeForm
        }
        // 编辑 ${this.typeForm.id}
        this.operateType == "new" ? config.data.type = this.typeForm.parent_id : null
        this.$refs.typeForm.validate(valid => {
          if(valid) {
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              this.dialogTypeVisible = false
              this.getTypeTree()
            }).catch((errorMsg) => {
              this.dialogTypeVisible = false
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
          }
        })
      },
      /**
       * 删除规格分类
       * @param {[type]} parentId [description]
       */
      deleteTree(data) {
        this.typeForm = JSON.parse(JSON.stringify(data))

        this.$confirm("当前删除的内容将无法找回", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "get",
            url: `${this.common.basePath}/spec/delete/type`,
            params: {
              id: this.typeForm.id
            }
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.dialogTypeVisible = false
            
            if(this.activeId == this.typeForm.id) { //当删除的是当前激活的树节点时 重置activeId 然后重新查询树
              this.activeId = null
            }
            this.getTypeTree()
          }).catch((errorMsg) => {
            this.dialogTypeVisible = false
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
      /**
       * 点击某一项规格分类 查询对应的规格分类下的文章列表
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      handleNodeClick(node, data) {
        this.activeId = node.id
        this.getModelList(this.activeId);
      },
      /**
       * 根据规格分类Id获取型号列表
       * @return {[type]} [description]
       */
      getModelList(id) {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/spec/select/model`,
          params: {
            id: id,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }
        this.axios(config).then((response) => {
          this.tableData = response.data.data
          this.pageLoading = false
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 获取型号详情
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      getModelDetail(target, id, type) {

        let p = new Promise((resolve, reject) => {
          let config = {
            method: "get",
            url: `${this.common.basePath}/spec/detail/${id}`,
          }
          this.axios(config).then((response) => {
            if(type == "all") {
              this[target] = response.data.data
            } else if (type = "file") {
              this[target].modelData = response.data.data.modelData
              this[target].imgData   = response.data.data.imgData
              this[target].videoData = response.data.data.videoData
            }
            resolve("成功")
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
            reject(errorMsg)
          })
        })
        
        return p
      },
      /**
       * 显示详情
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      showDetailDialog(id) {
        this.tempDetailId = id
        this.getModelDetail("detailData", id, "all").then(_ => {
          this.dialogDetailVisible = true
        }).catch(e => {})
      },
      /**
       * 点击新增型号, 初始化编辑器
       * @return {[type]} [description]
       */
      showModelDialog(typeName, row) {
        this.operateType = typeName
        this.dialogModelVisible = true
        
        if(typeName == "edit") {
          this.getModelDetail("modelForm", row.id, "all")
        } else {
          this.modelForm = {
            model_name: null,
            instructions: null,
          }
        }
        this.$nextTick(_ => {
          this.$refs.modelForm.clearValidate()
        })
      },
      /**
       * 新增型号, 保存成功后清空编辑器的内容
       * @return {[type]} [description]
       */
      submitModel() {
        let config = {
          method: this.operateType == "new" ? "post" : "patch",
          url: this.operateType == "new" ? `${this.common.basePath}/spec/add/model` : `${this.common.basePath}/spec/update/model` ,
          data: JSON.parse(JSON.stringify(this.modelForm))
        }
        config.data.d_type_id = this.activeId

        this.$refs.modelForm.validate(valid => {
          if(valid) {
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              this.dialogModelVisible = false
              this.getModelList(this.activeId)
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
          }
        })
      },
      /**
       * 删除型号
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      deleteModel(row) {
        this.$confirm("当前删除的内容将无法找回", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {

          let config = {
            method: "get",
            url: `${this.common.basePath}/spec/delete/model`,
            params: {
              id: row.id
            }
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.getModelList(this.activeId)
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
      handleSizeChanged(val) {
        this.pageSize = val
        this.getModelList(this.activeId)
      },
      handlePageChanged(val) {
        this.pageNum = val
        this.getModelList(this.activeId)
      },
      /**
       * 文件上传成功
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      uploadFileSuccess(response, type) {
        let params = {
          name: response.name,
          path: response.path,
          associated_object: this.modelForm.id,
          ao_type: type
        }
        let config = {
          url: `${this.common.basePath}/c_literature`,
          method: "post",
          data: params
        }

        this.axios(config).then(response => {
          this.getModelDetail("modelForm", this.modelForm.id, "file") // 上传成功后 重新查询详情更新页面显示(只更新附件的部分)
        }).catch(errorMsg => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 点击删除附件
       * @param  {[type]} tag [description]
       * @return {[type]}     [description]
       */
      handleClose(tag) {
        let config = {
          url: `${this.common.basePath}/c_literature/${tag.id}`,
          method: "delete",
        }
        this.$confirm("删除后需要重新上传", "删除附件", {
          comfirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          this.axios(config).then(response => {
            this.getModelDetail("modelForm", this.modelForm.id, "file") // 上传成功后 重新查询详情更新页面显示
          }).catch(errorMsg => {
            this.$message.error(errorMsg)
          })
        }).catch(err => {})
        
      }
    }
  };
</script>