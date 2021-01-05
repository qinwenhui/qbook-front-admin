<!-- 用户列表 -->
<template>
  <div>
      <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="请输入编号" v-model="params.id" clearable ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入用户名" v-model="params.username" clearable></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="params.status" placeholder="请选择状态">
            <el-option
            v-for="item in stateSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="loadUserList" type="warning">查询</el-button>
        </el-col>
      </el-row>
      
      <el-table
        v-loading="loading"
        :data="userList"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="50">
        </el-table-column>
        <el-table-column
          label="头像"
          width="100">
          <template slot-scope="scope">
            <el-avatar shape="square" size="medium" :src="scope.row.headimage">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
              {{scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            角色授权
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block pageNav">
        <el-pagination
          @current-change="changePage"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </div>

      <!-- 弹出框 -->
      <!-- 编辑用户角色 -->
    <el-dialog :visible.sync="dialogVisible" title="编辑用户角色" >
      <el-table
        ref="multipleTable"
        :data="allRole"
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
          prop="description"
          label="描述"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </div>
    </el-dialog>

    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getUserList } from '@/api/user';
import { getRoles, getRoleByUser } from '@/api/system';
const defaultUser = {
    id: '',
    username: ''
}
export default {
  name: 'UserList',
  data () {
    return {
        loading: false,
        dialogVisible: false,
        params: {
            pageNo: 1,
            pageSize: 10,
            id: '',
            username: '',
            status: ''
        },
        stateSelect: [{value: '',label: '全部'},{value: 1,label: '正常'},{value: 0,label: '冻结'}],
        userList: [],
        allRole: [],
        user: defaultUser,
        total: 0,
        selectedRoleIds: ''
    };
  },

  components: {},

  computed: {},

  methods: {
    //加载用户列表
    loadUserList(){
        this.loading = true
        getUserList(this.params).then((res)=>{
            if(res.code=='0'){
                this.userList = res.data.list
                this.total = res.data.total
            }
            this.loading = false
        })
    },
    //获取所有角色列表
    getAllRole(){
        getRoles({pageNo: 1, pageSize: 1000}).then(res=>{
            if(res.code=='0'){
                this.allRole = res.data.list
            }
        })
    },
    //分页
    changePage(pageNo) {
      this.params.pageNo = pageNo
      //加载下一页数据
      this.loadUserList();
    },
    handleEdit(scope){
        this.dialogVisible = true
        this.user = deepClone(scope.row);
        //默认选中已经有的角色
        this.generateRoles()
    },
    handleDelete(scope){

    },
    //点击一行
    toggleSelection(row) {
      //点击行选中
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    //选中时
    handleSelectionChange(val) {
      let ids = '';
      for(let role of val){
        ids += role.id + ','
      }
      this.selectedRoleIds = ids.substring(0, ids.length-1)
    },
    //编辑用户角色确认
    confirm() {
        console.log(this.selectedRoleIds)
    },
    generateRoles() {
      //先获取该角色已经拥有的接口列表
      getRoleByUser({userId: this.user.id}).then((res=>{
        if(res.code == '0'){
          this.$refs.multipleTable.clearSelection();
          const list = res.data
          //勾选已经拥有的角色
          for(let role of this.allRole){
            for(let selectedRole of list){
              if(selectedRole.id == role.id){
                //勾选
                this.$refs.multipleTable.toggleRowSelection(role);
                break;
              }
            }
          }
        }
      }))
    },
  },
  created: function(){
    this.loadUserList();
    this.getAllRole();
  }
}

</script>
<style scoped>
.pageNav{
  margin-top: 50px;
  float: right;
}
</style>