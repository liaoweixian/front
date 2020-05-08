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
        >excel导入</el-button>
      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="公司名称">
            <el-input v-model="form.companyName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库名称">
            <el-input v-model="form.storeName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="form.goodsName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品编号">
            <el-input v-model="form.goodsNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="规格型号">
            <el-input v-model="form.model" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品分组">
            <el-input v-model="form.goodsGroup" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品品牌">
            <el-input v-model="form.brand" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单位">
            <el-input v-model="form.unit" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="库存状态">
            <el-input v-model="form.storageState" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="form.quantity" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.price" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="电子标签">
            <el-input v-model="form.epcId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.asset_status"
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
        <el-table-column v-if="columns.visible('companyName')" prop="companyName" label="公司名称" />
        <el-table-column v-if="columns.visible('storeName')" prop="storeName" label="仓库名称" />
        <el-table-column v-if="columns.visible('goodsName')" prop="goodsName" label="商品名称" />
        <el-table-column v-if="columns.visible('goodsNo')" prop="goodsNo" label="商品编号" />
        <el-table-column v-if="columns.visible('model')" prop="model" label="规格型号" />
        <el-table-column v-if="columns.visible('goodsGroup')" prop="goodsGroup" label="商品分组" />
        <el-table-column v-if="columns.visible('brand')" prop="brand" label="商品品牌" />
        <el-table-column v-if="columns.visible('unit')" prop="unit" label="单位" />
        <el-table-column v-if="columns.visible('storageState')" prop="storageState" label="库存状态" />
        <el-table-column v-if="columns.visible('quantity')" prop="quantity" label="数量" />
        <el-table-column v-if="columns.visible('price')" prop="price" label="商品价格" />
        <el-table-column v-if="columns.visible('epcId')" prop="epcId" label="电子标签" />
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.asset_status[scope.row.status] }}
          </template>
        </el-table-column>

        <el-table-column v-if="columns.visible('crtTime')" prop="crtTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','ClientAsset:edit','ClientAsset:del']" label="操作" width="150px" align="center">
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
import crudClientAsset from '@/api/poc/ClientAsset'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '客户资产导入', url: 'api/ClientAsset', sort: 'id,desc', crudMethod: { ...crudClientAsset }})
const defaultForm = { id: null, companyName: null, storeName: null, goodsName: null, goodsNo: null, model: null, goodsGroup: null, brand: null, unit: null, storageState: null, quantity: null, price: null, epcId: null, crtTime: null, status: null }
export default {
  name: 'ClientAsset',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['asset_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'ClientAsset:add'],
        edit: ['admin', 'ClientAsset:edit'],
        del: ['admin', 'ClientAsset:del']
      },
      rules: {
        // crtTime: [
        //   { required: true, message: '创建时间不能为空', trigger: 'blur' }
        // ]
      }    
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    upload() {
      this.$router.replace('/assetImport/assetUpload')
    },
    // 生成模板导出
    exportTemplate() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['公司名称', '仓库名称', '商品名称', '商品编号', '规格型号', '商品分组', '商品品牌', '单位', '库存状态', '数量', '商品价格', '电子标签']
        const filterVal = ['companyName', 'storeName', 'goodsName', 'goodsNo', 'model', 'goodsGroup', 'brand', 'unit', 'storageState', 'quantity', 'price', 'epcId']
        const data = this.formatJson(filterVal, [
          { companyName: '华为', storeName: 'NF仓', goodsName: '手机P48', goodsNo: '55031454', model: 'P40', goodsGroup: '电子产品', brand: '华为', unit: 'Pcs', storageState: '可用', quantity: '1', price: '10000', epcId: 'E2004080940E00701100AA7A' }
        ])
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '客户资产'
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
