import request from '@/utils/request'

export default{

  // 讲师列表Api
  list() {
    return request({
      url: '/admin/edu/teacher/list',
      method: 'get'
    })
  },

  // 讲师分页列表Api
  pageList(page, limit, searchObj) {
    return request({
      url: `/admin/edu/teacher/list/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  // 添加讲师信息Api
  save(teacher) {
    return request({
      url: '/admin/edu/teacher/save',
      method: 'post',
      data: teacher
    })
  },

  // 删除讲师信息Api
  removeById(id) {
    return request({
      url: `/admin/edu/teacher/remove/${id}`,
      method: 'delete'
    })
  },

  // 根据idhuoqu1讲师信息Api
  getById(id) {
    return request({
      url: `/admin/edu/teacher/get/${id}`,
      method: 'get'
    })
  },

  // 修改讲师信息Api
  updateById(teacher) {
    return request({
      url: '/admin/edu/teacher/update',
      method: 'put',
      data: teacher
    })
  },

  // 批量删除讲师信息Api
  batchRemove(idList) {
    return request({
      url: '/admin/edu/teacher/batch-remove',
      method: 'delete',
      data: idList
    })
  },

  // 根据关键字查询讲师名列表Api
  selectNameListByKey(key) {
    return request({
      url: `/admin/edu/teacher/list/name/${key}`,
      method: 'get'
    })
  }

}
