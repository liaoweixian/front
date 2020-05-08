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
          <el-form-item label="应用ID">
            <el-input v-model="form.appId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="请求ID">
            <el-input v-model="form.requestId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="模板">
            <el-input v-model="form.thingTemplate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="动作类型">
            <el-input v-model="form.action" style="width: 370px;" />
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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column v-if="columns.visible('appId')" prop="appId" align="center" label="应用ID" />
        <el-table-column v-if="columns.visible('requestId')" prop="requestId" align="center" label="请求ID" />
        <el-table-column v-if="columns.visible('thingTemplate')" prop="thingTemplate" align="center" label="模板" />
        <el-table-column v-if="columns.visible('action')" prop="action" align="center" label="动作类型" />
        <el-table-column v-if="columns.visible('remark')" prop="remark" align="center" label="备注" />
        <el-table-column v-if="columns.visible('crtTime')" prop="crtTime" align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updTime')" prop="updTime" align="center" label="修改时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','HwAppInfo:edit','HwAppInfo:del']" label="操作" width="150px" align="center">
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
import crudHwAppInfo from '@/api/hw/HwAppInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '华为应用信息', url: 'api/HwAppInfo', sort: 'id,desc', crudMethod: { ...crudHwAppInfo }})
const defaultForm = { id: null, appId: null, requestId: null, thingTemplate: null, action: null, remark: null, delFlag: null, attr1: null, attr2: null, attr3: null, attr4: null, crtTime: null, updTime: null }
export default {
  name: 'HwAppInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'application:add'],
        edit: ['admin', 'application:edit'],
        del: ['admin', 'application:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'appId', display_name: '应用ID' }
      ]
    }
  },
  beforeDestroy: function() {
    // 目标页面销毁，清除查询条件
    this.crud.resetQuery(true)
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
