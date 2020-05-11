<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input
          v-model="query.giftCod"
          clearable
          size="small"
          placeholder="输入礼品编号搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.giftModel"
          clearable
          size="small"
          placeholder="输入型号搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.giftName"
          clearable
          size="small"
          placeholder="输入礼品名称搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <template slot="right">
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-video-play"
            :disabled="crud.selections.length === 0"
            @click="rowCopy"
          >复制</el-button>
        </template>
      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <!--  <el-form-item label="礼品编号" prop="giftCod">
            <el-input v-model="form.giftCod" style="width: 370px;" />
          </el-form-item> -->
          <el-form-item label="礼品名称" prop="giftName">
            <el-input v-model="form.giftName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="礼品类型" prop="giftType">
            <el-input v-model="form.giftType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="型号" prop="giftModel">
            <el-input v-model="form.giftModel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="推荐货位" prop="toLocationCod">
            <el-input v-model="form.toLocationCod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="RFID编码">
            <el-input v-model="form.rfidCod" style="width: 370px;" />
          </el-form-item>
          <!--   <el-form-item label="停用标志">
            <el-radio v-model="form.isUse" label="0">启用</el-radio>
            <el-radio v-model="form.isUse" label="1">停用</el-radio>
          </el-form-item> -->
          <el-form-item label="图片上传">
            <el-upload
              class="avatar-uploader"
              :action="url"
              :headers="{'Authorization': token}"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.imgUrl" :src="getImage(form.imgUrl)" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
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
        <el-table-column v-if="columns.visible('giftCod')" prop="giftCod" label="礼品编号" width="100" />
        <el-table-column v-if="columns.visible('giftName')" prop="giftName" label="礼品名称" width="100" />
        <el-table-column v-if="columns.visible('giftType')" prop="giftType" label="礼品类型" width="100" />
        <el-table-column v-if="columns.visible('giftModel')" prop="giftModel" label="型号" width="100" />
        <el-table-column v-if="columns.visible('toLocationCod')" prop="toLocationCod" label="推荐货位" />
        <el-table-column v-if="columns.visible('inventoryCnt')" prop="inventoryCnt" label="数量" />
        <!-- <el-table-column v-if="columns.visible('isUse')" prop="isUse" label="停用标志">
          <template slot-scope="scope">
            <div>{{ dict.label.is_discontinue[scope.row.isUse] }}</div>
          </template>
        </el-table-column> -->
        <el-table-column v-if="columns.visible('rfidCod')" prop="rfidCod" label="RFID编码" />
        <el-table-column prop="imgUrl" label="礼品图">
          <!-- 图片的显示 -->
          <template slot-scope="scope">            
            <img :src="getImage(scope.row.imgUrl)" min-width="70" height="70">
          </template>         
        </el-table-column>
        <el-table-column v-if="columns.visible('registerDat')" prop="registerDat" label="登记时间" />
        <el-table-column v-permission="['admin','rfidGiftMst:edit','rfidGiftMst:del']" label="操作" width="150px" align="center">
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
import crudGiftMst from '@/api/stock/rfidGiftMst'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '礼品管理', url: 'api/rfidGiftMst', sort: 'id,desc', crudMethod: { ...crudGiftMst }})
const defaultForm = { id: null, giftCod: null, giftName: null, giftType: null, giftModel: null, toLocationCod: null, isUse: null, rfidCod: null, registerDat: null, visitSta: null, isDelete: null, imgUrl: null }
export default {
  name: 'RfidGiftMst',
  dicts: ['is_discontinue', 'is_delete', 'visit_status'],
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'rfidGiftMst:add'],
        edit: ['admin', 'rfidGiftMst:edit'],
        del: ['admin', 'rfidGiftMst:del']
      },
      rules: {
        giftName: [
          { required: true, message: '礼品名称不能为空', trigger: 'blur' }
        ],
        giftType: [
          { required: true, message: '礼品类型不能为空', trigger: 'blur' }
        ],
        toLocationCod: [
          { required: true, message: '推荐货位不能为空', trigger: 'blur' }
        ],
        giftModel: [
          { required: true, message: '型号不能为空', trigger: 'blur' }
        ]
      },
      imageUrl: '',
      token: getToken(),
      url: this.$store.state.api.baseApi + '/api/rfidGiftMst/put-file'
    }
  },
  created() {
   
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 停用
    discontinue() {
      const sel = []
      const _this = this
      if (this.crud.selections.length > 1) {
        this.$message('请选择单个礼品进行操作！')
        return false
      }
      const element = this.crud.selections[0]
      if (element.inventoryCnt > 0) {
        this.$message('库存不为0，不能操作！')
        return false
      }
      sel.push(element.id)
      // 批量处理礼品停用
      request({
        url: 'api/rfidGiftMst/batch_discontinue',
        method: 'post',
        data: sel
      }).then(function(result) {
        _this.$message('操作成功！')
        _this.crud.toQuery()
      })
    },
    rowCopy() {
      let _this = this
      if (this.crud.selections.length > 1) {
        this.$message('请选择单个礼品进行操作！')
        return false
      }
      const element = this.crud.selections[0]
      request({
        url: 'api/rfidGiftMst/copy?id=' + element.id,
        method: 'get'
      }).then(function(result) {
        _this.crud.toQuery()
      })
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = process.env.VUE_APP_BASE_API + file.response
      this.form.imgUrl = file.response
    },
    beforeAvatarUpload(file) {
      console.log(file.type)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    getImage(url) {
      return process.env.VUE_APP_BASE_API + url
    }
  }
}

</script> 

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
