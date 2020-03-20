<template>
  <div class="content-wrap-box" @scroll="handleScroll">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>角色管理</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
    <!-- 页面主要内容 -->
      <div class="router-view-content" v-loading="pageLoading">
        <el-row class="padding-row" v-if="common.checkAuthority('RoleList-listRole', true)">
          <el-col :span="7">
            <div><el-button type="primary" class="fill-width" size="mini" :disabled="!common.checkAuthority('RoleList-addRole', true)" @click="addRoleButtonClicked">添加角色</el-button></div>
            <ul class="left-ul">
              <el-popover
                v-for="(item, index) in roleListData"
                :key="`${index}角色`"
                placement="right"
                width="100"
                :title="item.role_name"
                trigger="hover">
                <div>
                  <el-button type="primary" size="mini" :disabled="!common.checkAuthority('RoleList-editRole', true)" @click.stop="editRoleButtonClicked(item)">编辑</el-button>
                  <el-button type="danger" size="mini" :disabled="!common.checkAuthority('RoleList-deleteRole', true)" @click.stop="deleteRoleButtonClicked(item)">删除</el-button>
                </div>
                <li slot="reference" @click="roleListClicked(item)" :class="{'active-li': activeRole == item.id}">
                  <span :class="{'text-primary': activeRole == item.id}">{{ item.role_name }}</span>
                </li>
              </el-popover>
            </ul>
          </el-col>
          <el-col v-if="common.checkAuthority('RoleList-tree', true)" :span="17">
            <el-button type="primary" class="fr" :class="{'showFixed': overScroll}" @click="saveAuthority" size="mini" :disabled="!common.checkAuthority('RoleList-treeEdit', true)" >保存权限</el-button>
            <h3 class="mart0">角色权限树<small class="text-info marl10">未勾选必要权限<i class="fa fa-sitemap text-warning marl10 marr10"></i>时将不显示其整个功能模块</small></h3>
            <el-tree
              ref="Authoritytree"
              :data="authorityTreeData"
              :props="defaultProps"
              node-key="id"
              show-checkbox
              @check="treeSelectChanged">
              <span slot-scope="{ node, data }">{{ data.name }}<i class="fa fa-sitemap text-warning marl10" v-if="data.type == 3"></i></span>
            </el-tree>
          </el-col>
          <el-col v-else :span="17" class="text-center text-info">你无权查看此内容</el-col>
        </el-row>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom"><div v-if="!common.checkAuthority('RoleList-listRole', true)"></div></div>

      <el-dialog title="角色" :visible.sync="dialogRoleVisible" width="50vw">
        <el-form ref="roleForm" :model="roleForm" label-width="100px" :rules="rules">
          <el-form-item label="角色名称：" prop="role_name"><el-input v-model="roleForm.role_name"></el-input></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRoleVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRoleForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    {{defaultProps}}
  </div>
</template>
<script>
  import qs from "qs"
  export default {
    data() {
      return {
        pageLoading: false,
        roleListData: [],

        authorityTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'name' 
        },

        activeRole:  null,
        tempId:      null, //鼠标浮动对应的节点id

        dialogRoleVisible: false,
        roleForm: {
          role_name: null
        },
        rules: {
          role_name: [
            {required: true, message: "请输入角色名称", trigger: "blur"}
          ]
        },
        overScroll: false, // 页面是否滚动了一定长度 用于判断一些div的显示
      };
    },
    watch: {
      'activeRole': {
        handler(newV, oldV) {
          if(newV) {
            this.getAuthorityList(newV)
          }
        },
        deep: true
      }
    },
    mounted () {
      if(this.common.checkAuthority("RoleList-listRole", true)) {
        this.initRoleList()
        if(this.common.checkAuthority("RoleList-tree", true)) {
          this.getAuthorityTree()
        }
      }
    },
    methods: {
      /**
       * 获取角色列表, 并在初始化时查询一次第一个角色下的权限
       * @return {[type]} [description]
       */
      initRoleList() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/roles/list`
        }
        this.axios(config).then((response) => {
          this.roleListData = response.data.data
          this.activeRole   = response.data.data[0].id
          if(this.common.checkAuthority("RoleList-tree", true)) {
            this.getAuthorityList(response.data.data[0].id)
          }
          this.pageLoading = false
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 点击角色列表 修改当前激活的角色Id
       * @param  {[type]} item [description]
       * @return {[type]}      [description]
       */
      roleListClicked(item) {
        this.activeRole = item.id
      },
      /**
       * 点击添加角色
       * @param {[type]} parentId [description]
       */
      addRoleButtonClicked() {
        this.operateType = "new"
        this.roleForm = {
          code: parseInt(Math.random()*10000),
          role_name: null,
        }
        this.dialogRoleVisible  = true
        this.clearForm()
      },
      /**
       * 点击编辑角色
       * @param  {[type]} item [description]
       * @return {[type]}      [description]
       */
      editRoleButtonClicked(item) {
        this.operateType = "edit"
        
        let data = JSON.parse(JSON.stringify(item))
        this.roleForm = {
          code: parseInt(Math.random()*10000),
          role_name: data.role_name,
          id: data.id
        }
        this.dialogRoleVisible = true
        this.clearForm()
      },
      clearForm() {
        this.$nextTick(_ => {
          this.$refs.roleForm.clearValidate()
        })
      },
      /**
       * 删除角色
       * @param  {[type]} item [description]
       * @return {[type]}      [description]
       */
      deleteRoleButtonClicked(item) {
        this.$confirm("删除后需要重新添加", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "delete",
            url: `${this.common.basePath}/roles/delete`,
            params: {
              id: item.id
            }
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.initRoleList()
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})

      },
      /**
       * 提交编辑/添加 角色信息
       * @param {[type]} parentId [description]
       */
      submitRoleForm() {
        let config = {
          method: this.operateType == "new" ? "post" : "patch",
          url: this.operateType == "new" ? `${this.common.basePath}/roles/add` : `${this.common.basePath}/roles/update` ,
          data: this.roleForm
        }
        this.$refs.roleForm.validate(valid => {
          if(valid) {
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              this.dialogRoleVisible = false
              this.initRoleList()
            }).catch((errorMsg) => {
              this.dialogRoleVisible = false
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
          }
        })
      },
      
      /**
       * 删除角色
       * @param {[type]} parentId [description]
       */
      deleteTree(data) {
        this.AuthorityForm = JSON.parse(JSON.stringify(data))

        this.$confirm("删除后需要重新添加", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          let config = {
            method: "patch",
            url: `${this.common.basePath}/article_type/delete/${this.AuthorityForm.id}` ,
          }
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.dialogRoleVisible = false
          }).catch((errorMsg) => {
            this.dialogRoleVisible = false
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
      /**
       * 点击某一项角色 查询对应的数组list
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      handleNodeClick(node, data) {
        this.activeRole = node.id
        this.getAuthorityList(node.id);
      },
      /**
       * 获取权限数组list, 并设置选中
       * @return {[type]} [description]
       */
      getAuthorityList(id) {
        let config = {
          method: "get",
          url: `${this.common.basePath}/resource/select`,
          params: {
            roles_id: id
          }
        }
        if(this.common.checkAuthority("RoleList-tree", true)) {
          this.pageLoading = true
          this.axios(config).then((response) => {
            this.$nextTick(() => {
              this.$refs.Authoritytree.setCheckedKeys(response.data.data)
            })
            this.pageLoading = false
          }).catch((errorMsg) => {
            this.pageLoading = false
            this.$message.error(errorMsg)
          })
        }
      },
      /**
       * 查询权限树
       * @return {[type]} [description]
       */
      getAuthorityTree() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/resource/tree`,
        }
        this.axios(config).then((response) => {
          this.authorityTreeData = response.data.data
          this.pageLoading = false
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 点击树节点
       * @param  {[type]} node [description]
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      treeSelectChanged(node, data) {
        //console.log(node.id, data)
      },
      /**
       * 点击保存当前角色对应的权限
       * @return {[type]} [description]
       */
      saveAuthority() {
        this.pageLoading = true
        let config = {
          method: "patch",
          url: `${this.common.basePath}/resource/add`,
          data: qs.stringify({
            role_id: this.activeRole,
            resources: this.$refs.Authoritytree.getCheckedKeys().toString()
          })
        }
        
        this.axios(config).then((response) => {
          this.$message.success(response.data.meta.message)
          this.pageLoading = false
          this.getAuthorityList(this.activeRole)
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      handleScroll(event) {
        // var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if(event.target.scrollTop > 65) {
          this.overScroll = true
        } else {
          this.overScroll = false
        }
      }
    }
  };
</script>
<style>
  li.active-li:active {
    outline: none!important;
  }
  li.active-li * {
    font-weight: bold;
  }
  .showFixed {
    position: fixed;
    right: 50px;
    top: 73px;
    z-index: 99;
  }
</style>