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
                v-for="item in dict.device_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.helper_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属仓库" prop="store.id">
            <el-select v-model="form.store.id" filterable placeholder="请选择">
              <el-option
                v-for="item in stores"
                :key="item.id"
                :label="item.name"
                :value="item.id"
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
          <el-form-item label="所属库门" prop="door">
            <el-select v-model="form.door.id" filterable placeholder="请选择">
              <el-option
                v-for="item in doors"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item style="margin-bottom: 20px;" label="天线" prop="devices">
            <el-select
              v-model="form.devices"
              style="width: 100%"
              multiple
              placeholder="请选择"
              @remove-tag="deleteTag"
              @change="changeDevice"
            >
              <el-option
                v-for="item in devices"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="供应商" prop="vendor">
            <el-input v-model="form.vendor" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="短码">
            <el-input v-model="form.shortCode" style="width: 370px;" />
          </el-form-item>
          <!-- <el-form-item label="设备归属" prop="tagDevice">
            <el-select   v-model="form.tagDevice.id" filterable placeholder="请选择" >
              <el-option
                v-for="item in tagDevices"
                :key="item.id"
                :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item> -->
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
        <el-table-column v-if="columns.visible('name')" prop="name" label="名称" />
        <el-table-column v-if="columns.visible('address')" prop="address" label="地址" />
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.device_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('type')" prop="type" label="类型">
          <template slot-scope="scope">
            {{ dict.label.helper_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('store')" prop="store" label="所属仓库">
          <template slot-scope="scope">
            {{ scope.row.store.name }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('dept')" prop="dept" label="所属公司">
          <template slot-scope="scope">
            <div>{{ scope.row.deptSuperiorName ? scope.row.deptSuperiorName + ' / ' : '' }}{{ scope.row.dept.name }}</div>
          </template>
        </el-table-column>

        <el-table-column v-if="columns.visible('door')" prop="door" label="所属库门区域">
          <template slot-scope="scope">
            {{ scope.row.door.name }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('tagDevice') " prop="tagDevice" label="归属接收器">
          <template slot-scope="scope">
            <span v-if="scope.row.tagDevice"> {{ scope.row.tagDevice.name }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('vendor')" prop="vendor" label="供应商" />
        <el-table-column v-if="columns.visible('shortCode')" prop="shortCode" label="短码" />
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />
        <el-table-column v-if="columns.visible('crtTime')" prop="crtTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','HelperDevice:edit','HelperDevice:del']" label="操作" width="150px" align="center">
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
import crudHelperDevice from '@/api/poc/HelperDevice'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
// 获取device信息
import { getDevices } from '@/api/poc/Device'
// 获取库门信息
import { getDoors } from '@/api/poc/Door'
// 获取仓库信息
import { getStores } from '@/api/poc/Store'
// 获取部门信息
import { getDepts } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

let receiverHelps = []
// crud交由presenter持有
const defaultCrud = CRUD({ title: '激励器管理', url: 'api/HelperDevice', sort: 'id,desc', crudMethod: { ...crudHelperDevice }})
const defaultForm = { id: null, name: null, address: null, status: null, type: null, store: { id: null }, dept: { id: null }, door: { id: null }, devices: [], vendor: null, shortCode: null, tagDevice: { id: ' ' }, remark: null, delFlag: null, attr1: null, attr2: null, attr3: null, attr4: null, crtTime: null, crtUser: null, crtName: null, crtHost: null, updTime: null, updUser: null, updName: null, updHost: null }
export default {
  name: 'HelperDevice',
  components: { pagination, crudOperation, udOperation, Treeselect },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['device_status', 'helper_type'],
  data() {
    return {
      depts: [],
      doors: [],
      stores: [],
     
      permission: {
        add: ['admin', 'HelperDevice:add'],
        edit: ['admin', 'HelperDevice:edit'],
        del: ['admin', 'HelperDevice:del']
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
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        storeId: [
          { required: true, message: '仓库不能为空', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '公司不能为空', trigger: 'blur' }
        ],
        doorId: [
          { required: true, message: '库门不能为空', trigger: 'blur' }
        ],
        vendor: [
          { required: true, message: '供应商不能为空', trigger: 'blur' }
        ],
        'dept.id': [
          { required: true, message: '所属公司不能为空', trigger: 'blur' }
        ]
      }    
    }
  },
  methods: {
    changeDevice(value) {
      receiverHelps = []
      value.forEach((data, index) => {
        const helper = { id: data }
        console.log('===', JSON.stringify(helper))
        receiverHelps.push(helper)
        console.log(JSON.stringify(receiverHelps))
      })
    },
    deleteTag(value) {
      receiverHelps.forEach((data, index) => {
        if (data.id === value) {
          receiverHelps.splice(index, value)
        }
      })
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      console.log('---', JSON.stringify(receiverHelps))
      crud.form.devices = receiverHelps
      return true
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      receiverHelps = []
      const helpers = []
      form.devices.forEach(function(helper, index) {
        helpers.push(helper.id)
        // 初始化编辑时候的helper
        const help = { id: helper.id }
        receiverHelps.push(help)
      })
      form.devices = helpers
    },
    [CRUD.HOOK.beforeToCU]() {
      // 获取弹窗内天线数据
      getDevices({ enabled: true }).then(res => {
        console.info(JSON.stringify(res.content))
        this.devices = res.content
      // eslint-disable-next-line no-sequences
      }),
      // 获取弹窗内部门数据
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      }),
      // 获取弹窗内仓库数据
      getStores({ enabled: true }).then(res => {
        this.stores = res.content
      }),
      // 获取弹窗内库门数据
      getDoors({ enabled: true }).then(res => {
        this.doors = res.content
      })
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
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
