<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>文章设置</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" v-loading="pageLoading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-row class="padding-row" v-if="common.checkAuthority('ArticleSetting-tree', true)">
          <el-col :span="7" v-loading="pageLoading">
            <div><el-button type="primary" class="fill-width" size="mini" :disabled="!common.checkAuthority('ArticleSetting-add', true)" @click="addTree(null)">添加顶级</el-button></div>
            <el-tree
              v-if="treeData"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              @node-click="handleNodeClick"
              default-expand-all
              :expand-on-click-node="false"
              draggable
              @node-drag-end="handleDragEnd"
              :allow-drop="allowDrop"
              >
              <span class="fill-width" slot-scope="{ node, data }">
                <div @mouseenter="tempId = data.id" @mouseleave="tempId = null">
                  <span :class="{'text-primary' : activeId == data.id }" >
                    <!-- <i class="el-icon-circle-check" v-if="activeId == data.id"></i> -->
                    {{ node.label }}
                    <span v-if="tempId == data.id">
                      <el-button type="text" v-if="!data.parent_id && common.checkAuthority('ArticleSetting-add', true)"  @click.stop="addTree(data)"><i class="fa fa-plus text-primary" title="添加次级"></i></el-button>
                      
                      <el-button v-if="common.checkAuthority('ArticleSetting-add', true)" type="text" @click.stop="addTree(data, 'prev')"><i class="fa fa-arrow-up text-primary" title="添加至前方"></i></el-button>
                      
                      <el-button v-if="common.checkAuthority('ArticleSetting-add', true)" type="text" @click.stop="addTree(data, 'next')"><i class="fa fa-arrow-down text-primary" title="添加至后方"></i></el-button>                      
                      
                      <el-button type="text" v-if="common.checkAuthority('ArticleSetting-edit', true)" @click.stop="editTree(data)"><i class="fa fa-pencil-square-o text-primary" title="编辑"></i></el-button>
                      
                      <el-button type="text" v-if="!(data.childrens && data.childrens.length > 0) && common.checkAuthority('ArticleSetting-delete', true)" @click.stop="deleteTree(data)"><i class="fa fa-trash-o text-danger" title="删除"></i></el-button>
                    </span>
                  </span>
                </div>
               </span>
            </el-tree>
          </el-col>
          <el-col v-if="common.checkAuthority('ArticleSetting-listArticle', true)" :span="17">
            <div v-if="activeNode.parent_id">
              <el-table
                :data="tableData.rows"
                :show-header="true">
                <el-table-column
                  prop="article_name"
                  label="文章标题">
                </el-table-column>
                <el-table-column
                  prop="authorName"
                  label="作者"
                  width="180">
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="180"
                  fixed="right">
                  <template slot-scope="scope">
                    <el-button type="default" size="mini" :disabled="!common.checkAuthority('ArticleSetting-detailArticle', true)" @click="getArticleDetail(scope.row, 'detail')">详 情</el-button>
                    <el-button type="danger" size="mini" :disabled="!common.checkAuthority('ArticleSetting-deleteArticle', true)" @click="deleteArticle(scope.row)">删 除</el-button>
                    <!-- <el-button type="primary" size="mini" @click="getArticleDetail(scope.row, 'edit')">编 辑</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else class="text-center text-info"> 管理文章请选择次级分类 </div>
          </el-col>
          <el-col v-else :span="17" class="text-center text-info"> 你无权查看此内容 </el-col>
        </el-row>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom" v-if="common.checkAuthority('ArticleSetting-listArticle', true)">
        <!-- 操作按钮组 -->
        <div>
          <el-button type="primary" size="mini" :disabled="!common.checkAuthority('ArticleSetting-addArticle', true) || !this.activeNode.parent_id" @click="showEditDialog(false)">新增文章</el-button>
        </div>
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

    <el-dialog title="文章分类" :visible.sync="dialogTypeVisible" width="30vw">
      <el-form ref="typeForm" :model="typeForm" :rules="typeFormRules" label-width="100px">
        <el-form-item label="名称：" prop="name"><el-input v-model="typeForm.name"></el-input></el-form-item>
        <el-form-item label="类型：" prop="type">
          <el-select v-model="typeForm.type" class="fill-width">
            <el-option :value="1" label="文章列表"></el-option>
            <el-option :value="2" label="单个文章"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTreeSubmit" :loading="pageLoading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="`${activeNode.name} - 文章`" :visible.sync="dialogArticleEditVisible" width="80vw">
      <el-form :model="editorForm" label-width="100px">
        <el-form-item label="标题："><el-input v-model="editorForm.article_name"></el-input></el-form-item>
        <el-form-item label="内容："><div ref="editor"></div></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogArticleEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitArticle" :loading="pageLoading">确 定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="文章详情" :visible.sync="dialogArticleDetailVisible" width="80vw">
      <el-form :model="editorForm" label-width="100px">
        <el-form-item label="标题："><div>{{editorForm.article_name}}</div></el-form-item>
        <el-form-item label="内容："><div v-html="editorForm.article_content"></div></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogArticleDetailVisible = false" :loading="pageLoading">确 定</el-button>
        <el-button type="primary" :disabled="!common.checkAuthority('ArticleSetting-editArticle', true)" @click="changeToEdit">编 辑</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import E from "wangeditor"
  export default {
    data() {
      return {
        pageLoading: false,
        treeData:    [],
        activeId:  null, // 当前选中的节点id
        activeCode:  null, // 当前选中的节点code
        tempId:    null, //鼠标浮动对应的节点id
        defaultProps: {
          children: 'childrens',
          label: 'name'
        },

        tableData: {
          rows: [],
          total: 0
        },
        pageSize: 10,
        pageNum: 1,


        dialogTypeVisible: false,
        typeForm: {
          name: null,
          type: 1, //1为文章列表 2为单独文章
        },
        typeFormRules: {
          name: [{required: true, message: "请输入名称", trigger: "blur"}],
          type: [{required: true, message: "请选择类型", trigger: "change"}],
        },
        insertMode: false, // 添加模式 添加至前后

        dialogArticleEditVisible: false,
        editorForm: {  //文章表单 编辑&详情都以此为基础, 编辑时深拷贝此对象
          article_name:    "",
          article_content: ""
        },
        operateType: "new", //操作模式 new 新增 edit 编辑
        dialogArticleDetailVisible: false,

        activeNode: {},
        notSecond: true, // true 表示当前节点非二级节点 禁用添加功能
      };
    },
    mounted () {
      if(this.common.checkAuthority('ArticleSetting-tree', true)){
        this.initArticleTree()
      }
    },
    watch: {
      activeNode: {
        handler (newV,oldV) {
          console.log(newV)
          if(newV && !!newV.parent_id) {
            this.notSecond = false
          } else {
            this.notSecond = true
          }
        },
        deep: true
      }
    },
    methods: {
      /**
       * 获取文章分类树, 并在初始化时查询一次第一个分类下的文章
       * @return {[type]} [description]
       */
      initArticleTree() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/article_type/tree`
        }
        this.axios(config).then((response) => {
          this.treeData   = response.data.data
          this.activeId   = response.data.data[0].id
          this.activeNode = response.data.data[0]

          if(this.common.checkAuthority('ArticleSetting-listArticle', true)){
            this.getArticleList(response.data.data[0].code)
          }

          this.pageLoading = false
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 点击添加分类
       * @param {[type]} parentId [description]
       */
      addTree(data, type) {
        this.insertMode = false
        this.operateType           = "new"
        this.dialogTypeVisible     = true
        this.typeForm = {
          name: null,
        }
        data ? this.typeForm.parent_id = data.id : this.typeForm.parent_id = null //传入data 表示添加当前的子集

        if(type) {
          this.insertMode = true
          this.typeForm.parent_id = data.parent_id
          if(type == "prev") {
            this.typeForm.array_number = data.array_number
          } else {
            this.typeForm.array_number = data.array_number + 1
          }
        }
        this.$nextTick(_ => {
          this.$refs.typeForm.clearValidate()
        })
      },
      /**
       * 点击添加分类(在前或在后方添加, 非添加子集)
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      // addTree(data) {
      //   this.operateType = "new"
      //   this.dialogTypeVisible = true
      //   this.typeForm.name     = null
      // },
      /**
       * 点击编辑分类
       * @param {[type]} parentId [description]
       */
      editTree(data) {
        this.operateType = "edit"
        this.dialogTypeVisible = true
        this.typeForm = JSON.parse(JSON.stringify(data))
        this.$nextTick(_ => {
          this.$refs.typeForm.clearValidate()
        })
      },
      /**
       * 提交编辑/添加分类
       * @param {[type]} parentId [description]
       */
      addTreeSubmit() {
        
        let url = ""
        if(this.insertMode) {
          url = `${this.common.basePath}/article_type/tree/add`
        } else {
          url = `${this.common.basePath}/article_type`
        }
        let config = {
          method: this.operateType == "new" ? "post" : "put",
          url: this.operateType == "new" ? url : `${this.common.basePath}/article_type/${this.typeForm.id}` ,
          data: this.typeForm
        }
        // data ? config.parent_id = data.parent_id : null
        this.$refs.typeForm.validate(valid => {
          if(valid) {
            this.pageLoading = true
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              this.dialogTypeVisible = false
              this.pageLoading = false
              this.initArticleTree()
            }).catch((errorMsg) => {
              this.dialogTypeVisible = false
              this.pageLoading = false
              this.$message.error(errorMsg)
            })
          }
        })
        
      },
      
      /**
       * 删除分类
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
            method: "patch",
            url: `${this.common.basePath}/article_type/delete/${this.typeForm.id}` ,
          }
          this.pageLoading = true
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.dialogTypeVisible = false
            this.pageLoading = false
            this.initArticleTree()
          }).catch((errorMsg) => {
            this.dialogTypeVisible = false
            this.pageLoading = false
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
      /**
       * 点击某一项分类 查询对应的分类下的文章列表
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      handleNodeClick(node, data) {
        this.activeId   = node.id
        this.activeCode = node.code
        this.activeNode = node
        if(this.common.checkAuthority('ArticleSetting-listArticle', true)) {
          this.getArticleList(this.activeCode);
        }
      },
      /**
       * 根据分类code获取文章列表
       * @return {[type]} [description]
       */
      getArticleList(code) {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/article`,
          params: {
            type:     this.activeId,
            pageNum:  this.pageNum,
            pageSize: this.pageSize,
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
       * 点击新增文章, 初始化编辑器
       * @return {[type]} [description]
       */
      showEditDialog(editBoolean) {
        if(!!this.activeNode.parent_id) {
          this.dialogArticleEditVisible   = true
          editBoolean ? this.operateType = "edit" : this.operateType = "new"

          this.$nextTick(_ => {
            this.initEditor()
          })
        } else {
          this.$message.error("您必须选择二级目录进行文章添加")
        }
      },
      initEditor () {
        this.editor = new E(this.$refs.editor)
        //配置编辑器
        this.editor.customConfig.debug = true
        this.editor.customConfig.uploadImgServer = `${this.common.basePath}/file/public/upload`
        this.editor.customConfig.showLinkImg = false
        this.editor.customConfig.uploadImgHeaders = this.common.returnConfig()
        this.$refs.editor ? this.editor.create() : null // 仅在首次创建 无须重复创建
        if(this.operateType == "edit") {
          this.editor.txt.html(this.editorForm.article_content)
        } else if (this.operateType == "new"){
          this.editor.txt.html("")
          this.editorForm.article_name = ""
        }
      },
      /**
       * 提交文章, 保存成功后清空编辑器的内容
       * @return {[type]} [description]
       */
      submitArticle() {
        let config = {
          method: this.operateType == "new" ? "post" : "patch",
          url: this.operateType == "new" ? `${this.common.basePath}/article/save` : `${this.common.basePath}/article/${this.editorForm.id}`,
          data: {
            article_name:    this.editorForm.article_name,
            article_content: this.editor.txt.html(), //调用编辑器方法读取
            types:           [this.activeId],
            author:          JSON.parse(sessionStorage.getItem("Access-Key"))
          }
        }
        this.pageLoading = true
        this.axios(config).then((response) => {
          this.$message.success(response.data.meta.message)
          this.dialogArticleEditVisible = false
          this.pageLoading = false
          this.getArticleList(this.activeCode)
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 查看文章详情
       * @param  {object} row 表格中row对象
       * @return {[type]}     [description]
       */
      getArticleDetail(row) {
        let config = {
          method: "get",
          url: `${this.common.basePath}/article/${row.id}`,
        }
        this.axios(config).then((response) => {
          this.editorForm = response.data.data
          this.dialogArticleDetailVisible = true
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 在查看详情时 变为编辑模式 编辑模式中的form为深拷贝的数据
       * @return {[type]} [description]
       */
      changeToEdit() {
        this.dialogArticleDetailVisible = false
        this.showEditDialog(true)
        let newForm = JSON.parse(JSON.stringify(this.editorForm))
        this.editorForm = newForm
      },
      /**
       * 删除文章
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      deleteArticle(row) {
        this.$confirm("当前删除的内容将无法找回", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "patch",
            url: `${this.common.basePath}/article/delete/${row.id}`,
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.getArticleList(this.activeCode)
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }).catch(error => {})
      },
      pageSizeChange(val) {
        this.pageSize = val
        this.getArticleList(this.activeCode)
      },
      pageCurrentChange(val) {
        this.pageNum = val
        this.getArticleList(this.activeCode)
      },
      //////树拖拽
      // TODO 拖拽后 节点级别改变(次级 > 顶级) 需要对应做出处理
      /**
       * 判断拖拽的目标是否允许落下
       * @param  {Object} draggingNode 正在拖拽的节点
       * @param  {Object} dropNode     正在落下的节点
       * @param  {String} type         放置的类型 'prev'、'inner' 和 'next'
       * @return {[type]}              [description]
       */
      allowDrop(draggingNode, dropNode, type) {
        let self = this
        if(!dropNode.data.parent_id) {//落下的目标为顶级分类
          switch(type) {
            case "prev":
              return true;
              break;
            case "next":
              return true;
              break;
            case "inner":
              if(!!draggingNode.data.childrens && draggingNode.data.childrens.length > 0) { //拖动中的节点带有子节点, 不允许拖拽
                return false
              } else {
                return true
              }
              break;
          }
        } else { //落下的目标为次级分类
          switch(type) {
            case "prev":
              if(!!draggingNode.data.childrens && draggingNode.data.childrens.length > 0) { //拖动中的节点带有子节点, 不允许拖拽
                return false
              } else {
                return true
              }
              break;
            case "next":
              if(!!draggingNode.data.childrens && draggingNode.data.childrens.length > 0) { //拖动中的节点带有子节点, 不允许拖拽
                return false
              } else {
                return true
              }
              break;
            case "inner": //次级目标无法以inner方式落下
              return false
          }
        }
      },
      /**
       * 拖拽结束后 重新查询树 无论拖拽是否成功
       * @param  {[type]} draggingNode [description]
       * @param  {[type]} dropNode     [description]
       * @param  {[type]} dropType     [description]
       * @param  {[type]} ev           [description]
       * @return {[type]}              [description]
       */
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        let config = {
          method: "post",
          url: `${this.common.basePath}/article_type/tree/reset`,
          data: this.treeData
        }
        this.pageLoading = true
        this.axios(config).then((response) => {
          this.initArticleTree()
        }).catch((errorMsg) => {
          this.initArticleTree()
          this.$message.error(errorMsg)
        })
        
      },
    }
  };
</script>