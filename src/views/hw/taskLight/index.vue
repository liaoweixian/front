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
          <el-form-item label="子灯ID">
            <el-input v-model="form.ledid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="显示的颜色">
            <el-input v-model="form.color" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所属任务详情">
            <el-select v-model="form.taskCar.id" filterable placeholder="请选择">
              <el-option
                v-for="item in taskCars"
                :key="item.id"
                :label="item.crenelNo"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('ledid')" prop="ledid" label="子灯ID" />
        <el-table-column v-if="columns.visible('color')" prop="color" label="显示的颜色 " />
        <el-table-column v-if="columns.visible('taskCar')" prop="taskId" label="所属任务详情">
          <template slot-scope="scope">
            {{ scope.row.taskCar.crenelNo }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />
        <el-table-column v-permission="['admin','HwTaskLightInfo:edit','HwTaskLightInfo:del']" label="操作" width="150px" align="center">
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
import crudHwTaskLightInfo from '@/api/hw/HwTaskLightInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
// 获取任务详情信息
import { getTaskCars } from '@/api/hw/HwTaskCar'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '南方仓灯接口', url: 'api/HwTaskLightInfo', sort: 'id,desc', crudMethod: { ...crudHwTaskLightInfo }})
const defaultForm = { id: null, ledid: null, color: null, taskCar: { id: ' ', crenelNo: ' ' }, remark: null, delFlag: null, attr1: null, attr2: null, attr3: null, attr4: null, crtTime: null, updTime: null }
export default {
  name: 'HwTaskLightInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      taskCars: [],
      permission: {
        add: ['admin', 'HwTaskLightInfo:add'],
        edit: ['admin', 'HwTaskLightInfo:edit'],
        del: ['admin', 'HwTaskLightInfo:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'ledid', display_name: '子灯ID' },
        { key: 'color', display_name: '显示的颜色' }
      ]
    }
  },
  beforeDestroy: function() {
    // 目标页面销毁，清除查询条件
    this.crud.resetQuery(true)
  },
  methods: {
    [CRUD.HOOK.beforeToCU]() {
      // 获取弹窗内任务详情数据
      getTaskCars({ enabled: true }).then(res => {
        // console.info(JSON.stringify(res.content))
        this.taskCars = res.content
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
