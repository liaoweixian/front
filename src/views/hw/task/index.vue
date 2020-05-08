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
          <el-form-item label="任务编号">
            <el-input v-model="form.taskNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务类型">
            <el-input v-model="form.taskType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货主ID">
            <el-input v-model="form.cargoOwner" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="LPN">
            <el-input v-model="form.lpn" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="容器类型">
            <el-input v-model="form.containerType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="容器编码">
            <el-input v-model="form.containerCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="发货标签">
            <el-input v-model="form.shippingLabel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="起点货位">
            <el-input v-model="form.fromLocation" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="终点货位">
            <el-input v-model="form.toLocation" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务优先级">
            <el-input v-model="form.taskPriority" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="波次号">
            <el-input v-model="form.waveKey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="反馈任务节点">
            <el-input v-model="form.feedbackSteps" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务创建时间">
            <el-date-picker v-model="form.taskCreateTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所属应用" prop="application.id">
            <el-select v-model="form.application.id" filterable placeholder="请选择">
              <el-option
                v-for="item in applications"
                :key="item.id"
                :label="item.appId"
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
        <el-table-column type="selection" width="55" align="enter" />
        <el-table-column v-if="columns.visible('taskNo')" prop="taskNo" align="enter" label="任务编号" />
        <el-table-column v-if="columns.visible('taskType')" prop="taskType" align="enter" label="任务类型" />
        <el-table-column v-if="columns.visible('cargoOwner')" prop="cargoOwner" align="enter" label="货主ID" />
        <el-table-column v-if="columns.visible('lpn')" prop="lpn" label="LPN" />
        <el-table-column v-if="columns.visible('containerType')" prop="containerType" align="enter" label="容器类型" />
        <el-table-column v-if="columns.visible('containerCode')" prop="containerCode" align="enter" label="容器编码" />
        <el-table-column v-if="columns.visible('shippingLabel')" prop="shippingLabel" align="enter" label="发货标签" />
        <el-table-column v-if="columns.visible('fromLocation')" prop="fromLocation" align="enter" label="起点货位" />
        <el-table-column v-if="columns.visible('toLocation')" prop="toLocation" align="enter" label="终点货位" />
        <el-table-column v-if="columns.visible('taskPriority')" prop="taskPriority" align="enter" label="任务优先级" />
        <el-table-column v-if="columns.visible('waveKey')" prop="waveKey" align="enter" label="波次号" />
        <el-table-column v-if="columns.visible('feedbackSteps')" prop="feedbackSteps" align="enter" label="反馈任务节点" />
        <el-table-column v-if="columns.visible('taskCreateTime')" prop="taskCreateTime" align="enter" label="任务创建时间" />
        <el-table-column v-if="columns.visible('application')" prop="application" align="enter" label="所属应用">
          <template slot-scope="scope">
            {{ scope.row.application.appId }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('remark')" prop="remark" align="enter" label="备注" />
        <el-table-column v-if="columns.visible('crtTime')" prop="crtTime" align="enter" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','HwTask:edit','HwTask:del']" label="操作" width="150px" align="center">
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
import crudHwTask from '@/api/hw/HwTask'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
// 获取应用信息
import { getApplicatons } from '@/api/hw/HwAppInfo'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '华为任务', url: 'api/HwTask', sort: 'id,desc', crudMethod: { ...crudHwTask }})
const defaultForm = { id: null, taskNo: null, taskType: null, cargoOwner: null, lpn: null, containerType: null, containerCode: null, shippingLabel: null, fromLocation: null, toLocation: null, taskPriority: null, waveKey: null, feedbackSteps: null, taskCreateTime: null, application: { id: ' ', appId: ' ' }, remark: null, delFlag: null, attr1: null, attr2: null, attr3: null, attr4: null, crtTime: null, updTime: null }
export default {
  name: 'HwTask',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      applications: [],
      permission: {
        add: ['admin', 'nfTask:add'],
        edit: ['admin', 'nfTask:edit'],
        del: ['admin', 'nfTask:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'taskNo', display_name: '任务编号' }
      ]
    }
  },
  beforeDestroy: function() {
    // 目标页面销毁，清除查询条件
    this.crud.resetQuery(true)
  },
  methods: {
    [CRUD.HOOK.beforeToCU]() {
    // 获取弹窗内应用数据
      getApplicatons({ enabled: true }).then(res => {
        // console.info(JSON.stringify(res.content))
        this.applications = res.content
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
