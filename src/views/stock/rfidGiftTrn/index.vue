<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.clientName"
          clearable
          size="small"
          placeholder="输入客户姓名搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.giftCod"
          clearable
          size="small"
          placeholder="输入礼品编号搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-select v-model="query.status" clearable placeholder="状态" class="filter-item" style="width: 130px">
          <el-option v-for="item in dict.order_status" :key="item.id" :label="item.label" :value="item.value" />
        </el-select> 
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
    
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="900px">
        <el-container style="width:800px;">
          <el-main>
            <div width="300px" style="display: block;">
              <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="礼品型号" prop="giftModel">
                      <!--  <el-input v-model="form.giftModel" style="width: 150px;" @change="giftModel"/> -->
                      <el-select v-model.number="form.giftModel" placeholder="请选择" style="width: 150px;" @change="giftModel">
                        <el-option v-for="item in showGift" :key="item.id" :label="item.giftModel" :value="item.giftModel" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="礼品编号" prop="giftCod">
                      <el-input v-model="form.giftCod" style="width: 150px;" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="礼品名称" prop="giftName">
                      <el-input v-model="form.giftName" style="width: 150px;" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="推荐货架" prop="toLocationCod">
                      <el-input v-model="form.toLocationCod" style="width: 150px;" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="状态" prop="status">
                      <el-select v-model="form.status" filterable placeholder="请选择" style="width: 150px;">
                        <el-option
                          v-for="item in dict.order_status"
                          :key="item.id"
                          :label="item.label"
                          :value="item.value"
                        /> 
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="客户姓名" prop="giftCod">
                      <!-- <el-input v-model="form.clientCod" style="width: 150px;" /> -->
                      <el-select v-model="form.clientCod" filterable placeholder="请选择" style="width: 150px;">
                        <el-option
                          v-for="item in showMember"
                          :key="item.id"
                          :label="item.clientName"
                          :value="item.clientCod"
                        /> 
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-main>
          <el-aside width="200px" style="align-items:center;" class="cll">
            <div style="margin:0 auto; display:flex;align-items:center; justify-content:center;height:100px;">
              <img v-if="form.imgUrl" :src="getImage(form.imgUrl)" style="width:111px;height:171px">
            </div>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('clientName')" prop="clientName" label="客户名称" width="80" />
        <el-table-column v-if="columns.visible('giftCod')" prop="giftCod" label="礼品编号" width="200" />
        <el-table-column v-if="columns.visible('toLocationCod')" prop="toLocationCod" label="库位编码" />
        <el-table-column v-if="columns.visible('giftCnt')" prop="giftCnt" label="数量" />
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.order_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('toLocationCod')" prop="toLocationCod" label="推荐货位编号" />
        <!-- <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建时间" /> -->
        <el-table-column v-if="columns.visible('createName')" prop="createName" label="创建人" />
        <!-- <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="修改时间" width="150" /> -->
        <el-table-column v-if="columns.visible('updateName')" prop="updateName" label="修改人" />
        <el-table-column v-permission="['admin','rfidGiftTrn:edit','rfidGiftTrn:del']" label="操作" width="150px" align="center">
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
import crudRfidGiftTrn from '@/api/stock/rfidGiftTrn'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import request from '@/utils/request'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '订单管理', url: 'api/rfidGiftTrn', sort: 'id,desc', crudMethod: { ...crudRfidGiftTrn }})
const defaultForm = { id: null, clientCod: null, giftCod: null, locationCod: null, giftCnt: null, status: '1', transCod: null, isDelete: null, toLocationCod: null, orderSn: null, createTime: null, createName: null, updateTime: null, updateName: null, giftModel: null, giftName: null, imgUrl: null }
export default {
  name: 'RfidGiftTrn',
  dicts: ['order_status'],
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'rfidGiftTrn:add'],
        edit: ['admin', 'rfidGiftTrn:edit'],
        del: ['admin', 'rfidGiftTrn:del']
      },
      rules: {
        giftName: [
          { required: true, message: '礼品名称不能为空', trigger: 'blur' }
        ],
        giftModel: [
          { required: true, message: '礼品型号不能为空', trigger: 'blur' }
        ],
        clientCod: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' }
        ],
        giftCod: [
          { required: true, message: '礼品编号不能为空', trigger: 'blur' }
        ],
        locationCod: [
          { required: true, message: '库位编码不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        toLocationCod: [
          { required: true, message: '推荐货位编号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'clientCod', display_name: '客户名称' },
        { key: 'giftCod', display_name: '礼品编号' },
        { key: 'locationCod', display_name: '库位编码' },
        { key: 'status', display_name: '状态' }
      ],
      showGift: [],
      showMember: [],
      imageWidth: '',
      imageHeight: ''
    }
  },
  created() {
    this.getGiftAll()
    this.getMember()
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
    },
    giftModel(data) {
      this.getGift(this.form.giftModel)
    },
    getGift(data) {
      const _this = this
      request({
        url: 'api/rfidGiftMst/getGift',
        method: 'get',
        params: { giftModel: data }
      }).then((result) => {
        _this.form.giftCod = result.giftCod
        _this.form.giftName = result.giftName
        _this.form.imgUrl = result.imgUrl
        _this.form.giftName = result.giftName
      })
    },
    getGiftAll() {
      const _this = this
      request({
        url: 'api/rfidGiftMst',
        method: 'get',
        params: { page: 0, size: 1000 }
      }).then((result) => {
        let giftList = result.content
        const res = new Map()
        // eslint-disable-next-line eqeqeq
        _this.showGift = giftList.filter((a) => (!res.has(a.giftModel) && res.set(a.giftModel, 1)) && a.isBind != 1)
      })
    },
    getMember() {
      const _this = this
      request({
        url: 'api/rfidVdrMst',
        method: 'get',
        params: { page: 0, size: 1000 }
      }).then((result) => {
        _this.showMember = result.content
      })
    },
    getImage(url) {
      this.imageWidth = '111px'
      this.imageWidth = '171px'
      return process.env.VUE_APP_BASE_API + url
    }
  }
}
</script>

<style scoped>
.cll {
  background:white
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-col-8 {
  width: 44.33333%;
}
</style>
