<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="礼品编号">
            <el-input v-model="form.giftCod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="库位编码">
            <el-input v-model="form.locationCod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="事务数量">
            <el-input v-model="form.transCnt" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="事务类型（入库/出库）">
            <el-input v-model="form.transType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="事务时间">
            <el-input v-model="form.transDat" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态（未上架/已上架/已下架/已出库/已返库）">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否删除">
            <el-input v-model="form.isdelete" style="width: 370px;" />
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="giftCod" label="礼品编号" />
        <el-table-column prop="locationCod" label="库位编码" />
        <el-table-column prop="transCnt" label="事务数量" />
        <el-table-column prop="transType" label="事务类型（入库/出库）" />
        <el-table-column prop="transDat" label="事务时间" />
        <el-table-column prop="status" label="状态（未上架/已上架/已下架/已出库/已返库）" />
        <el-table-column prop="isdelete" label="是否删除" />
        <el-table-column v-permission="['admin','rfidInvTrn:edit','rfidInvTrn:del']" label="操作" width="150px" align="center">
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
import crudRfidInvTrn from '@/api/stock/rfidInvTrn'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
// import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, giftCod: null, locationCod: null, transCnt: null, transType: null, transDat: null, status: null, isdelete: null }
export default {
  name: 'RfidInvTrn',
  components: { pagination, crudOperation, udOperation }, // rrOperation
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'stock', url: 'api/rfidInvTrn', sort: 'id,desc', crudMethod: { ...crudRfidInvTrn }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'rfidInvTrn:add'],
        edit: ['admin', 'rfidInvTrn:edit'],
        del: ['admin', 'rfidInvTrn:del']
      },
      rules: {
        id: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ] }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
