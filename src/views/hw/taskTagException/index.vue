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
          <el-form-item label="标签" prop="tag">
            <el-input v-model="form.tag" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="异常原因">
            <el-input v-model="form.msg" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="异常类型">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.exception_status"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="处理结果">
            <el-input v-model="form.result" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="南方仓关联车辆信息">
            <el-input v-model="form.carId" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('tag')" prop="tag" label="标签" />
        <el-table-column v-if="columns.visible('msg')" prop="msg" label="异常原因" />
        <el-table-column v-if="columns.visible('type')" prop="type" label="异常类型" />
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.exception_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('result')" prop="result" label="处理结果" />
        <el-table-column v-if="columns.visible('carId')" prop="carId" label="南方仓关联车辆信息" />
        <el-table-column v-if="columns.visible('crtTime')" prop="crtTime" label="crtTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updTime')" prop="updTime" label="updTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','TagException:edit','TagException:del']" label="操作" width="150px" align="center">
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
import crudTagException from '@/api/hw/TagException'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '任务标签异常', url: 'api/TagException', sort: 'id,desc', crudMethod: { ...crudTagException }})
const defaultForm = { id: null, tag: null, msg: null, type: null, status: null, result: null, carId: null, remark: null, delFlag: null, attr1: null, attr2: null, attr3: null, attr4: null, crtTime: null, updTime: null }
export default {
  name: 'TagException',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['exception_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'TagException:add'],
        edit: ['admin', 'TagException:edit'],
        del: ['admin', 'TagException:del']
      },
      rules: {
        tag: [
          { required: true, message: '标签不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'tag', display_name: '标签' },
        { key: 'status', display_name: '状态' },
        { key: 'carId', display_name: '南方仓关联车辆信息' }
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
