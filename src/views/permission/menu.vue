<!-- 菜单管理页面 -->
<template>
  <div>
      <div class="app-container">
      <el-button type="primary" @click="handleAddMenu">
        新增菜单
      </el-button>
      <el-table
        v-loading="loading"
        :data="menuList"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="50">
        </el-table-column>
        <el-table-column 
          label="图标" 
          width="80">
            <template slot-scope="scope">
                <i :class="scope.row.icon"></i>
            </template>
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
          prop="pid"
          label="父级菜单">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序">
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
      <el-form :model="menu" label-width="80px" label-position="left">
        <el-form-item label="图标">
          <e-icon-picker v-model="menu.icon" :options="options" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="menu.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="menu.url" placeholder="地址" />
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-input v-model="menu.pid" placeholder="父级菜单编号" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="menu.sort" placeholder="排序" />
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
import { getMenuList, updateMenu, addMenu, deleteMenu } from '@/api/system';
import { EIconPicker } from 'e-icon-picker'
import 'e-icon-picker/dist/index.css' // 基础样式
const defaultMenu = {
  id: '',
  name: '',
  url: '',
  pid: 0,
  icon: '',
  sort: 1
}
export default {
  name: 'Menu',
  data () {
    return {
      menuList: [],
      menu: defaultMenu,
      dialogVisible: false,
      dialogType: 'new',
      total: 0,
      pageNo: 1,
      pageSize: 10,
      loading: false,
      //图标选择器
      options: {
          FontAwesome: false,
          ElementUI: true,
          addIconList: ['fa fa-slack'],
          removeIconList: []
      }
    };
  },

  components: {
      [EIconPicker.name]: EIconPicker
  },

  computed: {},

  mounted: {},

  methods: {
      //加载权限列表
    loadMenu() {
      //先显示加载中图标
      this.loading = true;
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }
      getMenuList(params).then((res)=>{
        console.log(res)
        if(res.code == '0'){
          this.menuList = res.data.list,
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
      this.loadMenu();
    },
    //添加
    handleAddMenu (){
      console.log('添加接口权限')
      this.dialogType = 'add'
      this.dialogVisible = true;
      this.menu = deepClone(defaultMenu);
    },
    //编辑
    handleEdit(scope) {
      console.log('打开编辑窗口')
      this.dialogType = 'edit'
      this.dialogVisible = true;
      this.menu = deepClone(scope.row);
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
          await deleteMenu(row.id)
          this.menuList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    //点击确认
    async confirmRole () {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        console.log('编辑')
        await updateMenu(this.menu)
        for (let index = 0; index < this.menuList.length; index++) {
          if (this.menuList[index].id === this.menu.id) {
            this.menuList.splice(index, 1, Object.assign({}, this.menu))
            break
          }
        }
      } else {
        console.log('添加')
        const { data } = await addMenu(this.menu)
        this.menu.id = data.id
        this.menuList.push(this.menu)
      }

      const { pid, id, name } = this.menu
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Menu Key: ${id}</div>
            <div>Menu Name: ${name}</div>
            <div>Pid: ${pid}</div>
          `,
        type: 'success'
      })
    }
  },

  created: function(){
    this.loadMenu();
  }
}

</script>
<style scoped>
.pageNav{
  margin-top: 50px;
  float: right;
}
</style>