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
      <crudOperation :permission="permission" >
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
        
          <el-form-item label="货运单号">
            <el-input v-model="form.shipmentNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="form.orderKey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="发货标签">
            <el-input v-model="form.shippingLabel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="容器类型">
            <el-input v-model="form.containerType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="箱序号">
            <el-input v-model="form.boxNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="包装类型">
            <el-input v-model="form.packType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="车牌信息">
            <el-input v-model="form.licensePlateNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="LPN">
            <el-input v-model="form.lpn" style="width: 370px;" />
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
        <el-table-column type="selection" width="55" align="enter" />
        
        <el-table-column v-if="columns.visible('shipmentNumber')" prop="shipmentNumber" align="enter" label="货运单号" />
        <el-table-column v-if="columns.visible('orderKey')" prop="orderKey" align="enter" label="订单号" />
        <el-table-column v-if="columns.visible('shippingLabel')" prop="shippingLabel" align="enter" label="发货标签" />
        <el-table-column v-if="columns.visible('containerType')" prop="containerType" align="enter" label="容器类型" />
        <el-table-column v-if="columns.visible('boxNo')" prop="boxNo" align="enter" label="箱序号" />
        <el-table-column v-if="columns.visible('packType')" prop="packType" align="enter" label="包装类型" />
        <el-table-column v-if="columns.visible('licensePlateNo')" prop="licensePlateNo" align="enter" label="车牌信息" />
        <el-table-column v-if="columns.visible('lpn')" prop="lpn" align="enter" label="LPN" />
        <el-table-column v-if="columns.visible('status')" prop="status" align="enter" label="状态" />
        <el-table-column v-if="columns.visible('taskCar')" prop="taskCar.crenelNo" align="enter" label="垛台">
          <template slot-scope="scope">
            {{ scope.row.taskCar.crenelNo }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('crtTime')" prop="crtTime" align="enter" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','taskDetail:edit','taskDetail:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <div>
             <el-button v-show="helperNum"   size="mini" type="primary" style="" icon="el-icon-setting" @click="doConfig(scope.row)" />
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudHwTaskDetail from '@/api/hw/HwTaskDetail'
import {artificial,getShipmentLable} from '@/api/hw/HwTaskDetail'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
// 获取任务详情信息
import { getTaskCars } from '@/api/hw/HwTaskCar'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '华为任务详情', url: 'api/HwTaskDetail', sort: 'id,desc', crudMethod: { ...crudHwTaskDetail }})
const defaultForm = { id: null, taskCar: { id: ' ', crenelNo: ' ' }, status: null, shipmentNumber: null, orderKey: null, shippingLabel: null, containerType: null, boxNo: null, packType: null, licensePlateNo: null, lpn: null, remark: null, delFlag: null, attr1: null, attr2: null, attr3: null, attr4: null, crtTime: null, updTime: null }
export default {
  name: 'HwTaskDetail',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      orderKey: null,
      shipmentNumber: null,
      helperNum: null,
      taskCars: [],
      permission: {
        add: ['admin', 'taskDetail:add'],
        edit: ['admin', 'taskDetail:edit'],
        del: ['admin', 'taskDetail:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'orderKey', display_name: '订单号' }
      ]
    }
  },
  created() {
       this.shipmentNumber = this.$route.params.shipmentNumber
    // console.log(this.shipmentNumber)
       this.orderKey = this.$route.params.orderKey
    // console.log(this.orderKey)
       this.helperNum = this.$route.params.helperNum
       console.log(this.helperNum)
  },
  mounted(){
   if(this.orderKey != null){
  // this.$set(this.crud.params,'shipmentNumber',shipmentNumber)
      this.crud.params['shipmentNumber'] = this.shipmentNumber
      // this.$set(this.crud.params,'orderKey',orderKey)
      this.crud.params['orderKey'] = this.orderKey
      this.crud.params['status'] = "0"
      this.crud.toQuery()
   }
   
  },

  beforeDestroy() {
    // 目标页面销毁，清除查询条件
    this.crud.resetQuery(true)
  },
  methods: {
    //人工处理没有读到的数据
    doConfig(value) {
      //  console.log("333"+JSON.stringify(value))
        const data = {
          tag: value.shippingLabel,
          helperNum: this.helperNum
        }
        artificial(data).then(res=>{
           if(res.success){
            this.$notify({
              title: "标签处理成功",
              type: 'success',
              duration: 2500
            })
            // this.serialStatus =true
              this.crud.toQuery()
          }else{
              this.$notify({
              title: "标签处理失败",
              type: 'error',
              duration: 2500
            })
          }
        })
    },
    upload(){
      /*excel 导入  */
      this.$router.replace('/taskDetail/shipmentsUpload')
    },
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
