<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>院系管理</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" v-loading="pageLoading">
    <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-row class="padding-row" v-if="common.checkAuthority('Faculty-tree', true)">
          <el-col :span="24">
            <div><el-button type="primary" size="mini" :disabled="!common.checkAuthority('Faculty-add', true)" @click="addTree(null)">添加顶级</el-button></div>
            <el-tree v-if="facultyTreeData" :data="facultyTreeData" :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="true">
              <span class="fill-width" slot-scope="{ node, data }">
                <el-tooltip :enterable="false" :content="node.label" placement="right-start">
                  <div @mouseenter="tempId = data.id" @mouseleave="tempId = null">
                    <span><!-- :class="{'text-primary' : activeNode == data.id }" -->
                      <!-- <i class="el-icon-circle-check" v-if="activeNode == data.id"></i> -->
                      {{ node.label }}
                      <span v-if="tempId == data.id">
                        &nbsp;&nbsp;
                        <el-button type="text" v-if="!data.parent_id &&  common.checkAuthority('Faculty-add', true)" @click.stop="addTree(data)">添加次级</el-button>
                        <el-button type="text" v-if="common.checkAuthority('Faculty-edit', true)" @click.stop="editTree(data)">编辑</el-button>
                        <el-button type="text" v-if="!(data.childrens && data.childrens.length > 0) && common.checkAuthority('Faculty-delete', true)" class="text-danger" @click.stop="deleteTree(data)">删除</el-button>
                      </span>
                    </span>
                  </div>
                 </el-tooltip effect="dark" content="Right Center 提示文字" placement="right">
               </span>
            </el-tree>
          </el-col>
        </el-row>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom"></div>
    </div>
    <el-dialog title="院系" :visible.sync="dialogTypeVisible" width="50vw">
      <el-form  ref="facultyForm" :model="facultyForm" label-width="100px" :rules="rules">
        <el-form-item label="院系名称：" prop="faculty"><el-input v-model="facultyForm.faculty"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTypeVisible = false">取消</el-button>
        <el-button type="primary" @click="addTreeSubmit(null)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pageLoading: false,
        facultyTreeData:    [],
        activeNode:  null,
        tempId:      null, //鼠标浮动对应的节点id
        defaultProps: {
          children: 'childrens',
          label: 'faculty'
        },
        tableData: {
          rows: [],
          total: 0
        },

        dialogTypeVisible: false,
        operateType: "new",
        facultyForm: {
          faculty: null
        },
        rules: {
          faculty: [
            {required: true, message: "请输入院系名", trigger: "blur"}
          ]
        }
      };
    },
    mounted () {
      if(this.common.checkAuthority('Faculty-tree', true)) {
        this.initFacultyTree()
      }
    },
    methods: {
      /**
       * 获取院系树
       * @return {[type]} [description]
       */
      initFacultyTree() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/faculty/tree`
        }
        this.axios(config).then((response) => {
          this.facultyTreeData   = response.data.data
          this.activeNode = response.data.data[0].id
          // this.getFacultyList(response.data.data[0].id)
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
      addTree(data) {
        this.operateType = "new"
        this.dialogTypeVisible = true
        this.facultyForm = {
          faculty: null
        }
        data ? this.facultyForm.parent_id = data.id : null //传入data 表示添加当前的子集
      },
      /**
       * 点击编辑分类
       * @param {[type]} parentId [description]
       */
      editTree(data) {
        this.operateType = "edit"
        this.dialogTypeVisible = true
        this.facultyForm = JSON.parse(JSON.stringify(data))
      },
      /**
       * 提交编辑/添加分类
       * @param {[type]} parentId [description]
       */
      addTreeSubmit(data) {
        let config = {
          method: this.operateType == "new" ? "post" : "patch",
          url: this.operateType == "new" ? `${this.common.basePath}/faculty/add` : `${this.common.basePath}/faculty/update` ,
          data: this.facultyForm
        }
        
        if(this.operateType == "new") {
          this.facultyForm.cur_status = 1
        } else {
          delete config.data.childrens
        }

        this.$refs.facultyForm.validate(valid => {
          if(valid) {
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              this.dialogTypeVisible = false
              this.initFacultyTree()
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
       * 删除分类
       * @param {[type]} parentId [description]
       */
      deleteTree(data) {
        this.facultyForm = JSON.parse(JSON.stringify(data))

        this.$confirm("删除后需要重新添加", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "delete",
            url: `${this.common.basePath}/faculty/delete/${this.facultyForm.id}`,
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.dialogTypeVisible = false
            this.initFacultyTree()
          }).catch((errorMsg) => {
            this.dialogTypeVisible = false
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

    }
  };
</script>