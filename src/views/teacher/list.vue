<template>
  <div class="app-container">
    <el-card shadow="hover" style="margin-bottom: 5px">
      <div slot="header">
        <span style="color: blue">讲师查询</span>
      </div>
      <div class="text item" align="center">
        <!-- 查询表单 -->
        <el-form :inline="true">
          <el-form-item>
            <el-autocomplete
              v-model="searchObj.name"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              class="inline-input"
              placeholder="请输入讲师姓名"
              value-key="name" />
          </el-form-item>

          <el-form-item>
            <el-select v-model="searchObj.level" clearable placeholder="讲师级别">
              <el-option value="1" label="高级讲师"/>
              <el-option value="2" label="首席讲师"/>
            </el-select>
          </el-form-item>

          <el-form-item label="入驻时间">
            <el-date-picker v-model="searchObj.joinDateBegin" value-format="yyyy-MM-dd" placeholder="开始时间"/> -
            <el-date-picker v-model="searchObj.joinDateEnd" value-format="yyyy-MM-dd" placeholder="开始时间"/>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" icon="el-icon-search" plain @click="fetchData()">查询</el-button>
            <el-button type="info" icon="el-icon-circle-close" plain @click="resetData()">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 工具条 -->
    <div style="margin-bottom: 5px">
      <el-button size="mini" type="danger" icon="el-icon-delete" plain @click="batchRemove()">批量删除</el-button>
      <router-link :to="'/teacher/create'">
        <el-button size="mini" type="success" icon="el-icon-circle-plus" plain >添加</el-button>
      </router-link>
    </div>

    <!-- 表格 -->
    <el-table :data="list" border height="500" style="margin-bottom: 5px" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35"/>
      <el-table-column prop="id" label="讲师编号" width="200" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="avatar" label="讲师头像" width="120" align="center"/> -->
      <el-table-column prop="name" label="讲师姓名" width="120" align="center"/>
      <el-table-column prop="level" label="讲师级别" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 2" type="success">首席讲师</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="intro" label="讲师简介" align="center"/>
      <el-table-column prop="career" label="讲师资历" align="center"/> -->
      <el-table-column prop="joinDate" label="入驻时间" align="center"/>
      <el-table-column prop="sort" label="排序" align="center"/>
      <el-table-column prop="gmtCreate" label="创建时间" align="center"/>
      <el-table-column prop="gmtModified" label="更新时间" align="center"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button size="mini" type="primary" icon="el-icon-edit" plain>修改</el-button>
          </router-link>
          <el-button size="mini" type="danger" icon="el-icon-delete" plain @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-card shadow="hover">
      <!-- 分页组件 -->
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        style= "padding: 30px 0; text-align: center"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </el-card>

  </div>
</template>

<script>
import teacherApi from '@/api/teacher'
export default {

  // 定义数据模型
  data() {
    return {
      list: [], // 讲师列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单
      multipleSelection: [] // 批量选中的记录列表

    }
  },

  // 页面渲染成功后获取数据
  created() {
    this.fetchData()
  },

  // 定义方法
  methods: {

    // 输入建议
    querySearch(queryString, callback) {
      teacherApi.selectNameListByKey(queryString).then(response => {
        callback(response.data.nameList)
      })
    },

    // 调用api模块，加载讲师列表
    fetchData() {
      teacherApi.pageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },

    // 改变页码
    handleCurrentChange(page) {
      this.page = page
      this.fetchData()
    },

    // 改变每页记录数
    handleSizeChange(size) {
      this.limit = size
      this.fetchData()
    },

    // 重置表单数据
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },

    // 删除记录
    handleDelete(id) {
      // 询问是否删除
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return teacherApi.removeById(id)
      }).then(response => {
        // 刷新页面
        this.fetchData()
        // 弹出成功提示
        this.$message({
          message: response.message,
          type: 'success'
        })
      }).catch((err) => {
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },

    // 当表格中多选项发生变化时触发
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },

    // 批量删除记录
    batchRemove() {
      // 判断是否选择数据
      if (this.multipleSelection.length === 0) {
        // 弹出成功提示
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
        return
      }
      // 询问是否删除
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 拿到选中的数据
        const idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        return teacherApi.batchRemove(idList)
      }).then(response => {
        // 刷新页面
        this.fetchData()
        // 弹出成功提示
        this.$message({
          message: response.message,
          type: 'success'
        })
      }).catch((err) => {
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    }

  }
}
</script>

