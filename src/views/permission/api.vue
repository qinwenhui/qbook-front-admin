<!-- 接口管理页面 -->
<template>
  <div class="main">
    <div class="app-container">
      <el-button type="primary" @click="handleAddRole">
        新增接口
      </el-button>
      <el-table
        :data="tableData"
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
          prop="icon"
          label="图标">
        </el-table-column>
        <el-table-column
          prop="url"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
    };
  },

  components: {},

  computed: {},

  mounted: {},

  methods: {},

  created: {

  }
}

</script>
<style lang=‘scss‘ scoped>
</style>