<!-- 接口管理页面 -->
<template>
  <div class="main">
    <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="handleAddPermission">
            新增接口
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入名称" v-model="keyword.name" clearable ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入地址" v-model="keyword.url" clearable></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入描述" v-model="keyword.description" clearable></el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="loadPermission">查询</el-button>
        </el-col>
      </el-row>
      
      <el-table
        v-loading="loading"
        :data="permissionList"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            编辑
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
      <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑接口':'新增接口'">
      <el-form :model="permission" label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="permission.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="permission.url" placeholder="地址" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="permission.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
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

    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getPermission, addPermission, updatePermission, deletePermission } from '@/api/system';
const defaultPermission = {
  id: '',
  name: '',
  url: '',
  description: '',
  status: 0
}
export default {
  data () {
    return {
      permissionList: [],
      permission: defaultPermission,
      dialogVisible: false,
      dialogType: 'new',
      total: 0,
      pageNo: 1,
      pageSize: 10,
      loading: false,
      keyword: {
        name: '',
        url: '',
        description: ''
      }
    };
  },

  components: {},

  computed: {},

  methods: {
    //加载权限列表
    loadPermission() {
      //先显示加载中图标
      this.loading = true;
      const params = {
        ...this.keyword,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }
      getPermission(params).then((res)=>{
        console.log(res)
        if(res.code == '0'){
          this.permissionList = res.data.list,
          this.total = res.data.total
        }
        //加载完成，把加载中提示去掉
        this.loading = false;
      })
    },
    //分页
    changePage(pageNo) {
      this.pageNo = pageNo
      //加载下一页数据
      this.loadPermission();
    },
    //添加
    handleAddPermission (){
      console.log('添加接口权限')
      this.dialogType = 'add'
      this.dialogVisible = true;
      this.permission = deepClone(defaultPermission);
    },
    //编辑
    handleEdit(scope) {
      console.log('打开编辑窗口')
      this.dialogType = 'edit'
      this.dialogVisible = true;
      this.permission = deepClone(scope.row);
    },
    //删除
    handleDelete({ $index, row }) {
      console.log('删除接口')
      this.$confirm('确认删除该接口?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deletePermission(row.id)
          this.permissionList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    //点击确认
    async confirmRole () {
      //构造参数
      const params = {
        name: this.permission.name,
        url: this.permission.url,
        description: this.permission.description
      }
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        console.log('编辑')
        await updatePermission(this.permission)
        for (let index = 0; index < this.permissionList.length; index++) {
          if (this.permissionList[index].id === this.permission.id) {
            this.permissionList.splice(index, 1, Object.assign({}, this.permission))
            break
          }
        }
      } else {
        console.log('添加')
        const { data } = await addPermission(params)
        this.permission.id = data.id
        this.permissionList.push(this.permission)
      }

      const { description, id, name } = this.permission
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Permission Key: ${id}</div>
            <div>Permission Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    }
  },

  created: function(){
    this.loadPermission();
  }
}

</script>
<style scoped>
.pageNav{
  margin-top: 50px;
  float: right;
}
</style>