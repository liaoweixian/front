<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="设备id">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="串口">
            <el-input v-model="form.serialPort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="波特率">
            <el-input v-model="form.boudRate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="标签匹配">
            <el-input v-model="form.tagMatch" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Q值">
            <el-select v-model="form.q" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.Q值"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="QueryAdjust次数">
            <el-select v-model="form.queryAdjust" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.QueryAdjust次数"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="M值">
            <el-select v-model="form.m" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.M值"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="BLF值">
            <el-select v-model="form.blf" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.BLF值"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="功率值">
            <el-select v-model="form.power" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.功率"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="发射模式选择">
            <el-select v-model="form.transmitModel" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.发射模式"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="读卡模式 ">
            <el-select v-model="form.readRfidMode" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.读卡模式"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="激励器 第四路">
            <el-select v-model="form.upLinkFrequencyFour" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.上行频率"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="激励器 第三路">
            <el-select v-model="form.upLinkFrequencyThree" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.上行频率"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="激励器 第二路">
            <el-select v-model="form.upLinkFrequencyTwo" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.上行频率"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="激励器 第一路">
            <el-select v-model="form.upLinkFrequencyOne" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.上行频率"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input :rows="3" v-model="form.remark" type="textarea" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('deviceId')" prop="deviceId" label="设备id" />
        <el-table-column v-if="columns.visible('serialPort')" prop="serialPort" label="串口" />
        <el-table-column v-if="columns.visible('boudRate')" prop="boudRate" label="波特率" />
        <el-table-column v-if="columns.visible('tagMatch')" prop="tagMatch" label="标签匹配" />
        <el-table-column v-if="columns.visible('q')" prop="q" label="Q值">
          <template slot-scope="scope">
            {{ dict.label.Q值[scope.row.q] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('queryAdjust')" prop="queryAdjust" label="QueryAdjust次数">
          <template slot-scope="scope">
            {{ dict.label.QueryAdjust次数[scope.row.queryAdjust] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('m')" prop="m" label="M值">
          <template slot-scope="scope">
            {{ dict.label.M值[scope.row.m] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('blf')" prop="blf" label="BLF值">
          <template slot-scope="scope">
            {{ dict.label.BLF值[scope.row.blf] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('power')" prop="power" label="功率值">
          <template slot-scope="scope">
            {{ dict.label.功率[scope.row.power] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('transmitModel')" prop="transmitModel" label="发射模式选择">
          <template slot-scope="scope">
            {{ dict.label.发射模式[scope.row.transmitModel] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('readRfidMode')" prop="readRfidMode" label="读卡模式 ">
          <template slot-scope="scope">
            {{ dict.label.读卡模式[scope.row.readRfidMode] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('upLinkFrequencyFour')" prop="upLinkFrequencyFour" label="激励器 第四路">
          <template slot-scope="scope">
            {{ dict.label.上行频率[scope.row.upLinkFrequencyFour] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('upLinkFrequencyThree')" prop="upLinkFrequencyThree" label="激励器 第三路">
          <template slot-scope="scope">
            {{ dict.label.上行频率[scope.row.upLinkFrequencyThree] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('upLinkFrequencyTwo')" prop="upLinkFrequencyTwo" label="激励器 第二路">
          <template slot-scope="scope">
            {{ dict.label.上行频率[scope.row.upLinkFrequencyTwo] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('upLinkFrequencyOne')" prop="upLinkFrequencyOne" label="激励器 第一路">
          <template slot-scope="scope">
            {{ dict.label.上行频率[scope.row.upLinkFrequencyOne] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />
        <el-table-column v-if="columns.visible('crtTime')" prop="crtTime" label="crtTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','DeviceConfig:edit','DeviceConfig:del']" label="操作" width="150px" align="center">
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
import crudDeviceConfig from '@/api/poc/DeviceConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '设备配置', url: 'api/DeviceConfig', sort: 'id,desc', crudMethod: { ...crudDeviceConfig }})
const defaultForm = { id: null, deviceId: null, serialPort: null, boudRate: null, tagMatch: null, q: null, queryAdjust: null, m: null, blf: null, power: null, transmitModel: null, readRfidMode: null, upLinkFrequencyFour: null, upLinkFrequencyThree: null, upLinkFrequencyTwo: null, upLinkFrequencyOne: null, remark: null, delFlag: null, attr1: null, attr2: null, attr3: null, attr4: null, crtTime: null, crtUser: null, crtName: null, crtHost: null, updTime: null, updUser: null, updName: null, updHost: null }
export default {
  name: 'DeviceConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['Q值', 'QueryAdjust次数', 'M值', 'BLF值', '功率', '发射模式', '读卡模式', '上行频率', '上行频率', '上行频率', '上行频率'],
  data() {
    return {
      permission: {
        add: ['admin', 'DeviceConfig:add'],
        edit: ['admin', 'DeviceConfig:edit'],
        del: ['admin', 'DeviceConfig:del']
      },
      rules: {
      }    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
