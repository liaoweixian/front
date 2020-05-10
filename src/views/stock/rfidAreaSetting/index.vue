<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="区域名" prop="areaName">
            <el-input v-model="form.areaName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="ip地址" prop="ip">
            <el-input v-model="form.ip" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户名">
            <!-- <el-input v-model="form.userId" style="width: 370px;" /> -->
            <el-select v-model="form.userId" clearable placeholder="用户名" class="filter-item" style="width: 370px">
              <el-option v-for="item in userList" :key="item.id" :label="item.username" :value="item.id" />
            </el-select> 
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="id" />
        <el-table-column v-if="columns.visible('areaName')" prop="areaName" label="区域名" />
        <el-table-column v-if="columns.visible('ip')" prop="ip" label="ip地址" />
        <el-table-column v-if="columns.visible('userName')" prop="userName" label="绑定用户" />
        <el-table-column v-if="columns.visible('createdTime')" prop="createdTime" label="创建时间" />
        <el-table-column v-permission="['admin','rfidAreaSetting:edit','rfidAreaSetting:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudRfidAreaSetting from '@/api/stock/rfidAreaSetting'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import request from '@/utils/request'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '区域配置', url: 'api/rfidAreaSetting', sort: 'id,desc', crudMethod: { ...crudRfidAreaSetting }})
const defaultForm = { id: null, areaName: null, ip: null, userId: null, createdTime: null, userName: null }
export default {
  name: 'RfidAreaSetting',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'rfidAreaSetting:add'],
        edit: ['admin', 'rfidAreaSetting:edit'],
        del: ['admin', 'rfidAreaSetting:del']
      },
      rules: {
        areaName: [
          { required: true, message: '区域名不能为空', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: 'ip地址不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '用户id不能为空', trigger: 'blur' }
        ]
      },
      userList: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 获取所有用户信息
    getUserList() {
      let _this = this
      request({
        url: 'api/users/list',
        method: 'get'
      }).then(function(result) {
        _this.userList = result
      })
    }
  }
}
</script>

<style scoped>

</style>
