<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!-- <crudOperation :permission="permission" /> -->
      <crudOperation :permission="permission">
        <el-button
          slot="right"
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-download"
          @click="exportTemplate"
        >模板下载</el-button>
        <el-button
          slot="right"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-upload2"
          @click="upload"
        >excel导入任务</el-button>
      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="出库任务单">
            <el-input v-model="form.taskList" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="出库开始时间">
            <el-input v-model="form.startTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库名称">
            <el-input v-model="form.wherehouseName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="库门">
            <el-input v-model="form.doorName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品编码">
            <el-input v-model="form.goodsNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="库存状态">
            <el-input v-model="form.storeStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="form.quantity" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="账号" prop="userName">
            <el-input v-model="form.userName" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('taskList')" prop="taskList" label="出库任务单" />
        <el-table-column v-if="columns.visible('startTime')" prop="startTime" label="出库开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('wherehouseName')" prop="wherehouseName" label="仓库名称" />
        <el-table-column v-if="columns.visible('doorName')" prop="doorName" label="库门" />
        <el-table-column v-if="columns.visible('goodsNo')" prop="goodsNo" label="商品编码" />
        <el-table-column v-if="columns.visible('storeStatus')" prop="storeStatus" label="库存状态" />
        <el-table-column v-if="columns.visible('quantity')" prop="quantity" label="数量" />
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态" />
        <el-table-column v-if="columns.visible('userName')" prop="userName" label="账号" />
        <el-table-column v-if="columns.visible('crtTime')" prop="crtTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('uptTime')" prop="uptTime" label="修改时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.uptTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','TaskImport:edit','TaskImport:del']" label="操作" width="150px" align="center">
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
import crudTaskImport from '@/api/poc/TaskImport'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '任务导入', url: 'api/TaskImport', sort: 'id,desc', crudMethod: { ...crudTaskImport }})
const defaultForm = { id: null, taskList: null, startTime: null, wherehouseName: null, doorName: null, goodsNo: null, storeStatus: null, quantity: null, status: null, userName: null, crtTime: null, uptTime: null }
export default {
  name: 'TaskImport',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['asset_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'TaskImport:add'],
        edit: ['admin', 'TaskImport:edit'],
        del: ['admin', 'TaskImport:del']
      },
      rules: {
        userId: [
          { required: true, message: '负责人id不能为空', trigger: 'blur' }
        ]
      }    
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    upload() {
      this.$router.replace('/taskImport/taskUpload')
    },
    // 生成模板导出
    exportTemplate() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['任务单号', '出库开始时间', '仓库名称', '库门', '商品编码', '状态:1.未完成 2. 进行中 3. 已完成', '数量']
        const filterVal = ['taskList', 'startTime', 'wherehouseName', 'doorName', 'goodsNo', 'storeStatus', 'quantity']
        const data = this.formatJson(filterVal, [
          { taskList: '200203007001', startTime: '2020-03-08 23:54:02', wherehouseName: '华为深圳天安云谷店', doorName: '出库门#1', goodsNo: '55031454', storeStatus: '在库', quantity: '1' }
        ])
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '客户任务'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>

<style scoped>

</style>
