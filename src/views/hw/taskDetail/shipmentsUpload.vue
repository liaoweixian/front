<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { addAllShipments } from '@/api/hw/HwTaskDetail'
export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      shipmentstData: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      // console.log(JSON.stringify(header));
      // console.log(JSON.stringify(results));
      results.forEach(r => {
        var values = Object.values(r)
        // console.log(values)
        var o = {taskCar:{id:''}}
        for (let i = 0; i < values.length; i++) {
          // console.log(values[i])
          switch (i) {
            case 0:
              o.shipmentNumber = values[i]
              break
            case 1:
              o.orderKey = values[i]
              break
            case 2:
              o.shippingLabel = values[i]
              break
            case 3:
              o.boxNo = values[i]
              break
            case 4:
              o.packType = values[i]
              break
            case 5:
              o.lpn = values[i]
              break
            case 6:
              o.licensePlateNo = values[i]
              break
            case 7:
              o.taskCar.id = values[i]
              break
          }
        }
        this.shipmentstData.push(o)
      // eslint-disable-next-line no-sequences
      }),
      console.log(JSON.stringify(this.shipmentstData))
      //  提交数据
      this.addAllData()
    },
    addAllData() {
      addAllShipments(this.shipmentstData).then(res => {
        this.$notify({
          title: '导入成功',
          type: 'success',
          duration: 2500
        })
        console.log('保存成功')
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        //  this.tableHeader =[],
        //  this.tableData=[],
         
        //  console.log(err.response.data.message)
        this.$notify({
          title: '格式错误，请检查后再试',
          type: 'error',
          duration: 2000
        })
      })
      this.assetData = []
    }
    
  }
}  
</script>
