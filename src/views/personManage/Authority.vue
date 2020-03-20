<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>权限管理</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" v-loading="pageLoading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-row class="padding-row" v-if="common.checkAuthority('Authority-tree', true)">
          <el-col :span="24">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable></el-input>
          </el-col>
          <el-col :span="24">
            <div><el-button type="primary" size="mini" @click="addTree(null, 1)" :disabled="!!filterText || !common.checkAuthority('Authority-add', true)">添加顶级</el-button></div>
            <el-tree
              v-if="treeData"
              ref="authorityTree"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              @node-click="handleNodeClick"
              :default-expand-all="false"
              :expand-on-click-node="true"
              :filter-node-method="filterNode">
              <span class="fill-width" slot-scope="{ node, data }">
                <!-- <el-tooltip :enterable="false" :content="node.label" placement="right-start"> -->
                  <div @mouseenter="tempId = data.id" @mouseleave="tempId = null">
                  <!-- :class="{'text-primary' : activeNode == data.id }"  -->
                    <span>
                      <i class="fa fa-desktop text-primary" v-if="data.type == 1"></i>
                      <i class="fa fa-mouse-pointer text-info" v-if="data.type == 2"></i>
                      <i class="fa fa-sitemap text-warning" v-if="data.type == 3"></i>
                      {{ node.label }}&nbsp;&nbsp;
                      <span v-if="tempId == data.id">
                        <!-- <el-button type="text" v-if="data.type == 1" @click.stop="addTree(data, 1)">添加次级</el-button> -->
                        <el-button v-if="data.type == 1 && common.checkAuthority('Authority-add', true)" type="text" @click.stop="addTree(data, 2)" :disabled="!common.checkAuthority('Authority-add', true)">添加权限</el-button>
                        <el-button type="text" @click.stop="editTree(data)" v-if="common.checkAuthority('Authority-edit', true)">编辑</el-button>
                        <el-button type="text" v-if="!(data.childrens && data.childrens.length > 0) && common.checkAuthority('Authority-delete', true)" class="text-danger"  @click.stop="deleteTree(data)">删除</el-button>
                      </span>
                    </span>
                  </div>
                 <!-- </el-tooltip> -->
               </span>
            </el-tree>
          </el-col>
        </el-row>
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom"></div>
    </div>
    <el-dialog title="权限" :visible.sync="dialogAuthorityVisible" width="50vw">
      <el-form ref="authorityForm"  :model="authorityForm" label-width="100px" :rules="rules">
        <el-form-item label="权限名称：" prop="name"><el-input v-model="authorityForm.name"></el-input></el-form-item>
        <el-form-item label="权限编码：" prop="code"><el-input v-model="authorityForm.code"></el-input></el-form-item>
        <el-form-item label="是否必要：" v-if="authorityForm.type != 1" prop="isRoot"><el-switch v-model="authorityForm.isRoot"></el-switch></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthorityVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('authorityForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pageLoading: false,

        filterText:  "",
        activeNode:  null,
        tempId:      null, //鼠标浮动对应的节点id
        treeData:    [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        tableData: {
          rows: [],
          total: 0
        },

        dialogAuthorityVisible: false,
        operateType: "new",
        authorityForm: {
          name: null,
          code: null,
          isRoot: false,
        },
        rules: {
          name: [{required: true, message: "请输入权限名称", trigger: "blur"}],
          code: [{required: true, message: "请输入权限编码", trigger: "blur"}],
        }
      };
    },
    watch: {
      filterText(val) {
        this.$refs.authorityTree.filter(val);
      }
    },
    mounted () {
      this.initAuthorityTree()
    },
    methods: {
      /**
       * 获取权限树
       * @return {[type]} [description]
       */
      initAuthorityTree() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/resource/tree`
        }
        this.axios(config).then((response) => {
          this.treeData   = response.data.data
          this.activeNode = response.data.data[0].id
          // this.getAuthorityList(response.data.data[0].id)
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
        this.operateType = "new"
        this.dialogAuthorityVisible = true
        this.authorityForm = {
          name: null,
          code: null,
          isRoot: false,
          type: type
        } 
        data ? this.authorityForm.parent_id = data.id : null //传入data 表示添加当前的子集
        this.clearForm()
      },
      /**
       * 点击编辑分类
       * @param {[type]} parentId [description]
       */
      editTree(data) {
        this.operateType = "edit"
        if(data.type == 3) {
          data.isRoot = true
        } else {
          data.isRoot = false
        }
        this.authorityForm = JSON.parse(JSON.stringify(data))
        this.dialogAuthorityVisible = true
        this.clearForm()
      },
      clearForm() {
        this.$nextTick(_ => {
          this.$refs.authorityForm.clearValidate()
        })
      },
      /**
       * 根据表单名 和 请求方法 提交表单
       * @param  {[type]} formName 表单名称
       * @return {[type]}          [description]
       */
      submitForm(formName) {
        if(this[formName].isRoot) { // 勾选必要是设置type = 3
          this[formName].type = 3
        } else {
          this[formName].type = 2
        }
        let config = {
          method: this.operateType == "edit" ? "patch" : "post",
          url: `${this.common.basePath}${this.operateType == "edit" ? "/resource/update" : "/resource/add/notes"}`,
          data: this[formName]
        }

        this.$refs[formName].validate(valid => {
          if(valid) {
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              this.dialogAuthorityVisible = false
              this.initAuthorityTree()
            }).catch((errorMsg) => {
              this.dialogAuthorityVisible = false
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请输入必填项")
          }
        })
      },
      
      /**
       * 删除权限
       * @param {[type]} parentId [description]
       */
      deleteTree(data) {
        this.authorityForm = JSON.parse(JSON.stringify(data))

        this.$confirm("删除后需要重新添加", "确认删除?", {
          confirmButt才去onText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "delete",
            url: `${this.common.basePath}/resource/delete/true/${this.authorityForm.id}`,
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.dialogAuthorityVisible = false
            this.initAuthorityTree()
          }).catch((errorMsg) => {
            this.dialogAuthorityVisible = false
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
        this.activeNode = node.id
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      }
    }
  };
</script>