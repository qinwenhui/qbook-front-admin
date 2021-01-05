<!--  -->
<template>
<div class='main'>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      新增角色
    </el-button>
    <el-button icon="el-icon-refresh" circle @click="getRoles"></el-button>
    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="编号" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="简介">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            菜单权限
          </el-button>
          <el-button type="warning" size="small" @click="handleApi(scope)">
            接口权限
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmRole">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色权限 -->
    <el-dialog :visible.sync="apiDialogVisible" title="编辑接口权限" >
      <el-table
        ref="multipleTable"
        :data="allPermission"
        v-loading="loading"
        tooltip-effect="dark"
        style="width: 100%"
        height="500"
        @row-click="toggleSelection"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="url"
          label="地址"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div style="text-align:right;">
        <el-button type="danger" @click="apiDialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmApi">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import path from 'path'
import { deepClone } from '@/utils'
import { generateRoutes, getIdByMenuPath } from '@/utils/menu'
import { getAllMenu, getRoles, addRoleAndMenu, deleteRoleAndMenu, updateRoleAndMenu, getMenuByRole, updateRoleAndPermission, getPermission, getPermissionByRole } from '@/api/system'
import store from '@/store'

const defaultRole = {
  id: '',
  name: '',
  description: ''
}

export default {
  //组件名字
  name: 'Role',
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      allMenus: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      apiDialogVisible: false,
      allPermission: [],
      selectedPermissionIds: '',
      loading: false
    };
  },
  //接收参数
  props:{},
  //监听属性 类似于data概念
  computed: {
    routesData() {
      return this.routes
    }
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    async getRoutes() {
      const res = await getAllMenu()
      const menus = res.data
      this.allMenus = generateRoutes(menus)
      this.routes = this.generateRoutes(this.allMenus)
    },
    async getRoles() {
      const res = await getRoles({pageNo:1, pageSize: 10})
      this.rolesList = res.data.list
    },
    //获取接口列表
    async getPermission() {
      const res = await getPermission({pageNo: 1, pageSize: 1000})
      this.allPermission = res.data.list
    },
    //弹出添加角色框
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      //获取该角色的菜单
      const roleId = this.role.id
      this.$nextTick(() => {
        getMenuByRole(roleId).then(async (res)=>{
          const menus = generateRoutes(res.data)
          const routes = this.generateRoutes(menus)
          this.$refs.tree.setCheckedNodes(this.generateArr(routes))
          this.checkStrictly = false
        })
      })
    },
    handleApi (scope){
      console.log('编辑角色权限')
      this.apiDialogVisible = true
      this.role = deepClone(scope.row)
      this.generateApis()
      
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除该角色?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRoleAndMenu(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    //勾选已经拥有的接口
    generateApis() {
      //先获取该角色已经拥有的接口列表
      getPermissionByRole(this.role.id).then((res=>{
        if(res.code == '0'){
          this.$refs.multipleTable.clearSelection();
          const list = res.data
          //勾选已经拥有的接口权限
          for(let permission of this.allPermission){
            for(let selectedPermission of list){
              if(selectedPermission.id == permission.id){
                //勾选
                this.$refs.multipleTable.toggleRowSelection(permission);
                break;
              }
            }
          }
        }
      }))
    },
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
          id: route.id
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        //因为生成的菜单会多出一个空的，所以这里先去掉
        if(typeof(data.title)!='undefined'){
          res.push(data)
        }
        
      }

      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },
    //编辑角色接口权限确认
    confirmApi () {
      console.log('----确认编辑角色接口权限----')
      this.loading = true
      const params = {
        roleId: this.role.id,
        permissionIds: this.selectedPermissionIds
      }
      console.log(params)
      updateRoleAndPermission(params).then((res)=>{
        this.loading = false
        if(res.code == '0'){
          this.apiDialogVisible = false
          this.$message({
            type: 'success',
            message: 'Edit succed!'
          })
        }else{
          this.$message({
            type: 'error',
            message: 'Edit Error!'
          })
        }
      })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      // console.log(this.role)
      // console.log(checkedKeys)
      // console.log(this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys))
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      let menuIds = '';
      for(let node of checkedNodes){
        menuIds += node.id + ","
      }
      //去掉末尾,
      menuIds = menuIds.substring(0, menuIds.length-1)
      const params = {
        ...this.role,
        menuIds: menuIds
      }
      if (isEdit) {
        console.log('编辑')
        await updateRoleAndMenu(params)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].id === this.role.id) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        console.log('添加')
        const { data } = await addRoleAndMenu(params)
        this.role.id = data.id
        this.rolesList.push(this.role)
      }

      const { description, id, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${id}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    //选择接口权限
    toggleSelection(row) {
      //点击行选中
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    //选中时
    handleSelectionChange(val) {
      let ids = '';
      for(let permission of val){
        ids += permission.id + ','
      }
      this.selectedPermissionIds = ids.substring(0, ids.length-1)
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getRoles()
    this.getRoutes()
    this.getPermission()
  },
}
</script>
<style scoped>
.main{

}
</style>
