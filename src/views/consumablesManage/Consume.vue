<!-- 设备耗材 （耗材类型与型号）-->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>设备耗材</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" v-loading="pageLoading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-row class="padding-row" v-if="common.checkAuthority('Consume-list', true)">
          <el-col :span="7">
            <div><el-button type="primary" class="fill-width" size="mini" @click="addTree(null)" :disabled="!common.checkAuthority('Consume-add', true)">添加顶级</el-button></div>
            <el-tree v-if="treeData" :data="treeData" :props="defaultProps" node-key="id" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false">
              <span class="fill-width" slot-scope="{ node, data }">
                <el-tooltip :enterable="false" :content="node.label" placement="right-start">
                  <div @mouseover="tempId = data.id" @mouseout="tempId = null">
                    <span :class="{'text-primary' : activeId == data.id }" >
                      <!-- <i class="el-icon-circle-check" v-if="activeId == data.id"></i> -->
                      {{ node.label }}
                      <span v-if="tempId == data.id">
                        <el-button type="text" v-if="common.checkAuthority('Consume-add', true)" @click.stop="addTree(data)">添加次级</el-button>
                        <el-button type="text" @click.stop="editTree(data)" v-if="common.checkAuthority('Consume-edit', true)">编辑</el-button>
                        <el-button type="text" v-if="common.checkAuthority('Consume-delete', true)" class="text-danger" @click.stop="deleteTree(data)">删除</el-button>
                      </span>
                    </span>
                  </div>
                 </el-tooltip effect="dark" content="Right Center 提示文字" placement="right">
               </span>
            </el-tree>
          </el-col>
          <el-col :span="17" v-if="common.checkAuthority('Consume-listType', true)">
            <el-table
              v-loading="tableLoading"
              :data="tableData.rows"
              :show-header="true">
              <el-table-column
                prop="materialModel"
                label="名称"
                show-overflow-tooltip
                width="120">
              </el-table-column>
              <el-table-column
                prop="modelType"
                label="类型"
                width="100">
                <template slot-scope="scope">
                  <el-tag v-if='scope.row.modelType===1'>耗材</el-tag>
                  <el-tag  v-if='scope.row.modelType===2' type="success">设备</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="amount"
                label="库存"
                width="100">
              </el-table-column>
              <el-table-column
                prop="inStockAmount"
                label="余量"
                width="100">
              </el-table-column>
              <el-table-column
                prop="description"
                label="用途"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                width="250">
                <template slot-scope="scope">
                  <el-button type="default" size="mini" @click="showDetailDialog(scope.row)">查 看</el-button>
                  <el-button type="primary" size="mini" @click="showModelDialog('edit', scope.row)" :disabled="!common.checkAuthority('Consume-editType', true)">编 辑</el-button>
                  <el-button type="danger" size="mini" @click="deleteModel(scope.row)" :disabled="!common.checkAuthority('Consume-deleteType', true)">删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col v-else :span="17" class="text-center text-info"> 你无权查看此内容 </el-col>
        </el-row>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom" v-if="common.checkAuthority('Consume-list', true) && common.checkAuthority('Consume-listType', true)">
        <!-- 操作按钮组 -->
        <div>
          <el-button type="primary" size="mini" @click="showModelDialog('new')" :disabled="!common.checkAuthority('Consume-addType', true)">新增型号</el-button>
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
      
      <el-dialog title="耗材类型" :visible.sync="dialogTypeVisible" width="50vw">
        <el-form ref="typeForm" :model="typeForm" label-width="100px" :rules="typeRules">
          <el-form-item label="名称：" prop="materialType"><el-input v-model="typeForm.materialType"></el-input></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTypeVisible = false">取消</el-button>
          <el-button type="primary" @click="addTreeSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="耗材型号" :visible.sync="dialogModelVisible" width="50vw">
        <el-form ref="modelForm" :model="modelForm" label-width="100px" :rules="modelRules">
          <el-form-item label="名称：" prop="materialModel"><el-input v-model="modelForm.materialModel"></el-input></el-form-item>
          <el-form-item label="类型：" prop="modelType">
            <el-select v-model="modelForm.modelType" class="fill-width" placeholder="请选择类型">
              <el-option v-for="(item, index) in modelTypeList" :value="item.id" :label="item.name" :key="`${index}类型`"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用途：" prop="description"><el-input type="textarea" v-model="modelForm.description"></el-input></el-form-item>
          <el-form-item label="注意事项：" prop="attention"><el-input type="textarea" v-model="modelForm.attention"></el-input></el-form-item>
          <el-form-item v-if="operateType == 'edit'" label="附件：" >
            <file-show :fileList="modelForm.modelData" :closable="true" @handleClose="handleClose"></file-show>
            <upload buttonText="点击上传" @uploadSuccess="(response) => {uploadFileSuccess(response, 8)}"/>
          </el-form-item>
          <el-form-item v-if="operateType == 'edit'" label="图片附件：" >
            <file-show :fileList="modelForm.imgData" :closable="true" @handleClose="handleClose"></file-show>
            <upload :fileTypes="['png', 'jpg']" buttonText="点击上传" @uploadSuccess="(response) => {uploadFileSuccess(response, 10)}"/>
          </el-form-item>
          <el-form-item v-if="operateType == 'edit'" label="视频附件：" >
            <file-show :fileList="modelForm.videoData" :closable="true" @handleClose="handleClose"></file-show>
            <upload :fileTypes="['mp4', 'avi','mpeg']" buttonText="点击上传" @uploadSuccess="(response) => {uploadFileSuccess(response, 9)}"/>
          </el-form-item>
          <span class="text-info" v-if="operateType == 'edit'">附件操作为实时操作, 只操作附件无需点击 "确定" 按钮</span>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogModelVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitModel">确 定</el-button>
        </div>
      </el-dialog>
      
      <el-dialog title="耗材型号详情" :visible.sync="dialogDetailVisible" width="50vw">
        <el-form :model="detailData" label-width="90px" label-position="left">
          <el-form-item label="名称："><span>{{detailData.materialModel}}</span></el-form-item>
          <el-form-item label="类型：">
            <el-tag v-if='detailData.modelType===1'>耗材</el-tag>
            <el-tag  v-if='detailData.modelType===2' type="success">设备</el-tag>
          </el-form-item>
          <el-form-item label="库存："><span>{{detailData.amount}}</span></el-form-item>
          <el-form-item label="余量："><span>{{detailData.inStockAmount}}</span></el-form-item>
          <el-form-item label="用途："><span>{{detailData.description}}</span></el-form-item>
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
        tableLoading:false,
        //耗材类型
        treeData:    [],
        activeId:    null, //当前选中的Id
        tempId:      null, //鼠标浮动对应的节点id
        defaultProps: {
          children: 'childrens',
          label: 'materialType'
        },

        //耗材列表
        tableData: {
          rows: [],
          total: 0
        },
        pageNum: 1,
        pageSize: 10,

        operateType: "new",

        //耗材类型弹框
        dialogTypeVisible: false,
        typeForm: {
          materialType: null
        },
        typeRules: {
          materialType: [
            {required: true, message: "请输入名称", trigger: "blur"},
            { validator: (rule, value, callback) => {this.common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },
          ]
        },

        //耗材型号弹框
        dialogModelVisible: false,
        modelForm: {  //型号表单 编辑&详情都以此为基础, 编辑时深拷贝此对象
          materialModel: null,
          description: null,
          attention:null,
          modelType:1,//1耗材  2设备
        },
        modelRules: {
          materialModel: [
            {required: true, message: "请输入名称", trigger: "blur"},
            { validator: (rule, value, callback) => {this.common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },
          ],
          modelType: [
            {required: true, message: "请选择", trigger: "change"}
          ]
        },
        modelTypeList: [{name:'耗材',id:1},{name:'设备',id:2}], // 型号类型

        //耗材型号详情弹框
        dialogDetailVisible: false,
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
      if(this.common.checkAuthority('Consume-list', true)) {
        this.getTypeTree()
      }
    },
    methods: {

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
          this.$message({type:'success',message:'上传成功！'})
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
        
      },
      /**
       * 获取型号详情
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      getModelDetail(target, id, type) {

        let p = new Promise((resolve, reject) => {
          let config = {
            method: "post",
            url: `${this.common.basePath}/material_model/detail?id=${id}`,
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
       * 获取耗材类型树, 并在初始化时查询一次第一个耗材类型下的耗材型号
       * @return {[type]} [description]
       */
      getTypeTree() {
        this.pageLoading = true
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_type/tree`,
          data: {
            // id: 1,
            // pageNum: 1,
            // pageSize: 10,
            // parentId: "string"
          }
        }
        let self = this

        this.axios(config).then((response) => {
          this.treeData   = response.data.data
          !this.activeId ? this.activeId = response.data.data[0].id : null
          if (this.common.checkAuthority('Consume-listType', true)) {
            this.getModelList(response.data.data[0].id)
          }
          this.pageLoading = false
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 点击添加耗材类型
       * @param {[type]} parentId [description]
       */
      addTree(data) {
        this.operateType = "new"
        this.dialogTypeVisible = true
        this.typeForm   = {
          materialType: null
        }
        data ? this.typeForm.parent_id = data.id : null //传入data 表示添加当前的子集
      },
      /**
       * 点击编辑耗材类型
       * @param {[type]} parentId [description]
       */
      editTree(data) {
        this.operateType = "edit"
        this.dialogTypeVisible = true
        this.typeForm = JSON.parse(JSON.stringify({id:data.id,materialType:data.materialType}))
      },
      /**
       * 提交编辑/添加耗材类型
       * @param {[type]} parentId [description]
       */
      addTreeSubmit(data) {
        let config = {
          method: "post",
          url: this.operateType == "new" ? `${this.common.basePath}/material_type/add` : `${this.common.basePath}/material_type/update` ,
          data: this.typeForm
        }
        // 编辑 ${this.typeForm.id}
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
            this.$message.error("请检查表单填写是否正确！")
          }
        })
      },
      /**
       * 删除耗材类型
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
            method: "post",
            url: `${this.common.basePath}/material_type/delete`,
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
       * 点击某一项耗材类型 查询对应的耗材类型下的耗材型号
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      handleNodeClick(node, data) {
        this.activeId = node.id
        this.getModelList(this.activeId);
      },

      /**
       * 根据耗材类型Id获取耗材型号
       * @return {[type]} [description]
       */
      getModelList(id) {
        this.pageLoading = true
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_model/list`,
          data: {
            materialModel: null,
            materialType: id,
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
       * 点击新增或编辑耗材型号, 初始化编辑器
       * @return {[type]} [description]
       */
      showModelDialog(typeName, row) {
        this.operateType = typeName
        this.dialogModelVisible = true
        
        if(typeName == "edit") {
          this.getModelDetail("modelForm", row.id, "all")
          // this.modelForm = JSON.parse(JSON.stringify(row))
        } else {
          this.modelForm = {
            materialModel: null,
            description: null,
            attention:null,
            modelType:1,//1耗材  2设备
          }
        }
        this.$nextTick(_ => {
          this.$refs.modelForm.clearValidate()
        })
      },
      /**
       * 新增或编辑耗材型号, 保存成功后清空编辑器的内容
       * @return {[type]} [description]
       */
      submitModel() {
        let config = {
          method: "post",
          url: this.operateType == "new" ? `${this.common.basePath}/material_model/add` : `${this.common.basePath}/material_model/update` ,
          data: JSON.parse(JSON.stringify(this.modelForm))
        }
        config.data.materialType = this.activeId

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
       * 删除耗材型号
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
            method: "post",
            url: `${this.common.basePath}/material_model/delete`,
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
      /**
       * 耗材型号的分页
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      handleSizeChanged(val) {
        this.pageSize = val
        this.getModelList(this.activeId)
      },
      handlePageChanged(val) {
        this.pageNum = val
        this.getModelList(this.activeId)
      },

      /**
       * 显示详情
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      showDetailDialog(row) {
        this.getModelDetail("detailData", row.id, "all").then(_ => {
          this.dialogDetailVisible = true
        }).catch(e => {})
        // this.detailData = JSON.parse(JSON.stringify(row))
        // this.dialogDetailVisible = true;
      },
    }
  };
</script>