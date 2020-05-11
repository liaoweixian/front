<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.clientCod"
          clearable
          size="small"
          placeholder="输入客户编号搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.clientName"
          clearable
          size="small"
          placeholder="输入客户名称搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.companyName"
          clearable
          size="small"
          placeholder="输入公司名称搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
          <el-form-item label="客户编号" prop="clientCod">
            <el-input v-model="form.clientCod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="客户名称" prop="clientName">
            <el-input v-model="form.clientName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="公司名称">
            <el-input v-model="form.companyName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="职务">
            <el-input v-model="form.positionName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="RFID编码" prop="rfidCod">
            <el-input v-model="form.rfidCod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="访客状态" prop="visitStatus">
            <el-select v-model="form.visitStatus" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.visit_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              /> 
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
        <el-table-column v-if="columns.visible('clientCod')" prop="clientCod" label="客户编号" />
        <el-table-column v-if="columns.visible('clientName')" prop="clientName" label="客户名称" />
        <el-table-column v-if="columns.visible('companyName')" prop="companyName" label="公司名称" />
        <el-table-column v-if="columns.visible('positionName')" prop="positionName" label="职务" />
        <el-table-column v-if="columns.visible('rfidCod')" prop="rfidCod" label="RFID编码" />
        <el-table-column v-if="columns.visible('visitDat')" prop="visitDat" label="到访时间" />
        <el-table-column v-if="columns.visible('visitStatus')" prop="visitStatus" label="访客状态">
          <template slot-scope="scope">
            {{ dict.label.visit_status[scope.row.visitStatus] }}
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','rfidVdrMst:edit','rfidVdrMst:del']" label="操作" width="150px" align="center">
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
import crudRfidVdrMst from '@/api/stock/rfidVdrMst'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '客户管理', url: 'api/rfidVdrMst', sort: 'id,desc', crudMethod: { ...crudRfidVdrMst }})
const defaultForm = { id: null, clientCod: null, clientName: null, companyName: null, positionName: null, rfidCod: null, visitDat: null, visitStatus: null, clientPhotoCod: null, isDelete: null }
export default {
  name: 'RfidVdrMst',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['visit_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'rfidVdrMst:add'],
        edit: ['admin', 'rfidVdrMst:edit'],
        del: ['admin', 'rfidVdrMst:del']
      },
      rules: {
        clientCod: [
          { required: true, message: '客户编号不能为空', trigger: 'blur' }
        ],
        clientName: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' }
        ],
        rfidCod: [
          { required: true, message: 'RFID编码不能为空', trigger: 'blur' }
        ],
        visitStatus: [
          { required: true, message: '访客状态不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'clientCod', display_name: '客户编号' },
        { key: 'clientName', display_name: '客户名称' },
        { key: 'companyName', display_name: '公司名称' },
        { key: 'positionName', display_name: '职务' },
        { key: 'rfidCod', display_name: 'RFID编码' },
        { key: 'visitStatus', display_name: '访客状态' }
      ]
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
