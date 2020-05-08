<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          
          <el-form-item label="车牌信息">
            <el-input v-model="form.carNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="垛口号">
            <el-input v-model="form.crenelNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="靠台时间">
            <el-date-picker v-model="form.portinTm" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="离台时间">
            <el-date-picker v-model="form.portOutTm" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="箱序号">
            <el-input v-model="form.deviceId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所属任务">
            <el-select v-model="form.task.id" filterable placeholder="请选择">
              <el-option
                v-for="item in tasks"
                :key="item.id"
                :label="item.taskNo"
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
        
        <el-table-column v-if="columns.visible('carNo')" prop="carNo" label="车牌信息" />
        <el-table-column v-if="columns.visible('crenelNo')" prop="crenelNo" label="垛口号" />
        <el-table-column v-if="columns.visible('portinTm')" prop="portinTm" label="靠台时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.portinTm) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('portOutTm')" prop="portOutTm" label="离台时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.portOutTm) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('deviceId')" prop="deviceId" label="箱序号" />
        <el-table-column v-if="columns.visible('task.id')" prop="taskId" label="所属任务">
          <template slot-scope="scope">
            {{ scope.row.task.taskNo }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />
        <el-table-column v-permission="['admin','HwTaskCar:edit','HwTaskCar:del']" label="操作" width="150px" align="center">
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
import crudHwTaskCar from '@/api/hw/HwTaskCar'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
// 获取任务信息
import { getTasks } from '@/api/hw/HwTask'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '南方仓车辆靠台任务', url: 'api/HwTaskCar', sort: 'id,desc', crudMethod: { ...crudHwTaskCar }})
const defaultForm = { id: null, task: { id: ' ', taskNo: ' ' }, carNo: null, crenelNo: null, portinTm: null, portOutTm: null, deviceId: null, remark: null, delFlag: null, attr1: null, attr2: null, attr3: null, attr4: null, crtTime: null, updTime: null }
export default {
  name: 'HwTaskCar',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      tasks: [],
      permission: {
        add: ['admin', 'HwTaskCar:add'],
        edit: ['admin', 'HwTaskCar:edit'],
        del: ['admin', 'HwTaskCar:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'taskId', display_name: '华为任务id' },
        { key: 'carNo', display_name: '车牌信息' },
        { key: 'crenelNo', display_name: '垛口号' }
      ]
    }
  },

 beforeDestroy(){
   this.crud.resetQuery()
 },

  methods: {
    [CRUD.HOOK.beforeToCU]() {
      // 获取弹窗内任务数据
      getTasks({ enabled: true }).then(res => {
        // console.info(JSON.stringify(res.content))
        this.tasks = res.content
      })
    },

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
