<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.store_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属公司" prop="dept.id">
            <treeselect
              v-model="form.dept.id"
              :options="depts"
              :normalizer="normalizer"
              style="width: 185px"
              placeholder="选择公司或者部门"
            />
          </el-form-item>
          <el-form-item label="负责人" prop="user.id">
            <el-select v-model="form.user.id" filterable placeholder="请选择">
              <el-option
                v-for="item in users"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('name')" prop="name" label="名称" />
        <el-table-column v-if="columns.visible('address')" prop="address" label="地址" />
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.store_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('dept')" prop="dept" label="所属公司">
          <template slot-scope="scope">
            <div>{{ scope.row.deptSuperiorName ? scope.row.deptSuperiorName + ' / ' : '' }}{{ scope.row.dept.name }}</div>
          </template>
        </el-table-column>

        <el-table-column v-if="columns.visible('user')" prop="user" label="负责人">
          <template slot-scope="scope">
            {{ scope.row.user.username }}
          </template>
        
        </el-table-column>

        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />
        <el-table-column v-permission="['admin','Store:edit','Store:del']" label="操作" width="150px" align="center">
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
import crudStore from '@/api/poc/Store'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
// 获取用户信息
import { getUsers } from '@/api/system/user'
// 获取部分信息
import { getDepts } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '仓库管理', url: 'api/Store', sort: 'id,desc', crudMethod: { ...crudStore }})
const defaultForm = { id: null, name: null, address: null, status: null, type: null, dept: { id: null }, user: { id: null }, remark: null, delFlag: null, attr1: null, attr2: null, attr3: null, attr4: null, crtTime: null, crtUser: null, crtName: null, crtHost: null, updTime: null, updUser: null, updName: null, updHost: null }
export default {
  name: 'Store',
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination, crudOperation, rrOperation, udOperation, Treeselect },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['store_status'],
  data() {
    return {
      depts: [],
      users: [],
      permission: {
        add: ['admin', 'Store:add'],
        edit: ['admin', 'Store:edit'],
        del: ['admin', 'Store:del']
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '所属公司不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '负责人不能为空', trigger: 'blur' }
        ]
      }}
  },
  watch: {
    // 跟踪部门id 变化
    'form.dept.id': 'deptChange'
  },
  // created:{
  //    // 获取部门数据
  //   this:getDepts()
  // },
  methods: {
    // // 获取数据前设置好接口地址
    // [CRUD.HOOK.beforeRefresh]() {
    //   return true
    // },

    [CRUD.HOOK.beforeToCU]() {
      // 获取弹窗内部门数据
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    // getDepts(){

    //   getDepts({ enabled: true }).then(res => {
    //      this.depts = res.content
    //    })
    // },
    deptChange(companyId) {
      console.log('this dept=' + companyId)
      if (companyId) {
        this.getUsers(companyId)
      }
    },
    // 根据公司或者部门获取用户数据
    getUsers(companyId) {
      console.log(companyId)
      // const sort = 'id,desc'
      // const params = { sort: sort }
      const params = {}
      params['deptId'] = companyId
      getUsers(params).then(res => {
        this.users = res.content
        console.log(JSON.stringify(res))
      })
    },
    // treeSelect key--value 字段转换
    normalizer(node) {
      return {
        id: node.id,
        label: node.label,
        children: node.subOptions
      }
    }
  }
}
</script>

<style scoped>

</style>
