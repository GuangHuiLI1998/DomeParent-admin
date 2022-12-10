<template>
  <div class="app-container">

    <!-- 输入表单 -->
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" placeholder="请输入讲师姓名" style= "width: 220px" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <el-upload
          :show-file-list="false"
          :on-error="handleAvatarError"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          action="http://localhost:8120/admin/oss/file/upload?module=avatar">
          <img v-if="teacher.avatar" :src="teacher.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker v-model="teacher.joinDate" value-format="yyyy-MM-dd" placeholder="选择日期" />
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" style= "width: 220px" />
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" style= "width: 220px">
          <!--数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number-->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" placeholder="简单介绍一下讲师..." />
      </el-form-item>

      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" :rows="10" type="textarea" placeholder="描述一下讲师资历..." />
      </el-form-item>

      <el-form-item align= "center">
        <el-button :disabled="saveBtnDisabled" type="success" icon="el-icon-circle-check" plain @click="saveOrUpdate()">保存</el-button>
        <el-button type="info" icon="el-icon-circle-close" plain @click="resetData()">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import teacherApi from '@/api/teacher'
export default {

  data() {
    return {

      // 初始化讲师默认数据
      teacher: {
        sort: 0,
        level: 1
      },

      // 非空校验
      // rules: {
      //   name: [
      //     { required: true, message: '请输入讲师名称', trigger: 'blur' },
      //     { min: 2, max: 5, message: '长度在 2 到 6 个字符', trigger: 'blur' }
      //   ],
      //   date: [
      //     { type: 'yyyy-MM-dd', required: true, message: '请选择入驻时间', trigger: 'change' }
      //   ],
      //   intro: [
      //     { required: true, message: '请输入讲师简介', trigger: 'blur' },
      //     { min: 5, max: 30, message: '长度在 5 到 25 个字符', trigger: 'blur' }
      //   ]
      // },

      // 默认按钮可用
      saveBtnDisabled: false
    }
  },

  // 渲染数据
  created() {
    if (this.$route.params.id) {
      this.fetchDatatById(this.$route.params.id)
    }
  },

  // 方法
  methods: {

    // 点击保存提交
    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (!this.teacher.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    // 重置表单数据
    resetData() {
      this.teacher = { sort: 0, level: 1 }
      this.saveBtnDisabled = false
    },

    // 数据保存
    saveData() {
      teacherApi.save(this.teacher).then(response => {
        // 弹出成功提示
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.$router.push({ path: '/teacher/list' })
      })
    },

    // 根据id获取讲师信息
    fetchDatatById(id) {
      teacherApi.getById(id).then(response => {
        this.teacher = response.data.item
      })
    },

    // 修改讲师信息
    updateData() {
      teacherApi.updateById(this.teacher).then(response => {
        // 弹出成功提示
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.$router.push({ path: '/teacher/list' })
      })
    },

    // 文件上传成功
    handleAvatarSuccess(response) {
      if (response.success) {
        this.teacher.avatar = response.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        // 文件上传失败（非20000）
        this.$message.error('上传失败！')
      }
    },

    // 文件上传失败（http）
    handleAvatarError() {
      this.$message.error('上传失败！')
    },

    // 文件上传前的校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }

}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 220px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 220px;
    height: 178px;
    display: block;
  }
</style>

