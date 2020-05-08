<template>
  <el-container class="dashboard-container">
    <!-- 顶部 -->
    <el-header>
      <el-row :gutter="5">
        <el-button type="primary" @click="configClick"> 设置 </el-button>
        <el-button type="info" @click="importExcel">Excel导入</el-button>
      </el-row>
      <el-row class="f-f1 ">
        <el-col class="col-title f-ajc">{{ title }}</el-col>
      </el-row>
    </el-header>
    <el-main>
      <!-- 开头部分 -->
      <el-row class="f-ajc main-title-el">
        <el-col span="6" class=" f-f1  f-ajc main-col"> 库门号：{{ doors[0].name }} </el-col>
        <el-col span="6" class="f-f1 f-ajc main-col">  车牌号：{{ licensePlate }} </el-col>
        <el-col span="6" class="f-f1 f-ajc main-col">  出库任务单号：{{ taskNumber }} </el-col>
        <el-col span="6" class="f-f1 f-ajc main-col">  时间：{{ taskTime }} </el-col>
      </el-row> 
      <!-- 中间 -->
      <el-row :gutter="30" c>
        <!-- 左边 -->
        <el-col :span="6">
          <div class="grid-content bg-purple ">
            <!-- 上面 -->
            <div class="f-ajc zzs-d"> <span>Receiver</span></div>
            <!-- 下面 -->
            <div class="f-ajc zzsx"> 
              <div v-for="(item,index) in tagDevices" :key="index" class="f-f1 f-ajc">
                <el-button :type="item.status==2? 'success':'danger'" circle class=" zzsx-d" @click="receiverClick(item,index)" />
              </div> 
              <!-- <div class="f-f1 f-ajc"> <div class=" zzsx-d"></div></div>
              <div class="f-f1 f-ajc"> <div class=" zzsx-d"></div></div>-->
              <!-- <div class="f-f1 f-ajc"> <el-button type="danger"  circle class=" zzsx-d"></el-button></div>  -->
            </div>
          </div>
        </el-col>
        <!-- 中间 -->
        <el-col :span="10">
          <div class=" f-ajc zzz-d"> 
            <el-button type="primary" class="f-f1 zzz-but " @click="tagClear">清除</el-button>
            <el-button type="primary" class="f-f1 zzz-but" @click="tagStart">开始</el-button>
            <el-button type="primary" class="f-f1 zzz-but" @click="tagPause">暂停</el-button>
            <el-button type="primary" class="f-f1 zzz-but" @click="tagEnd">结束</el-button>
          </div>
        </el-col>
        <!-- 右边 -->
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 上面 -->
            <div class="f-ajc zzs-d">
              <span>Helper</span>
            </div>
            <!-- 下面 -->
            <div class="f-ajc zzsx"> 
              <div v-for="(item,index) in helperDevices" :key="index" class="f-f1 f-ajc">
                <el-button :type="item.status==2? 'success':'danger'" circle class=" zzsx-d" />
              </div> 
              <!-- <div class="f-f1 f-ajc"> <div class=" zzsx-d"></div></div>
              <div class="f-f1 f-ajc"> <div class=" zzsx-d"></div></div>
              <div class="f-f1 f-ajc"> <div class=" zzsx-d"></div></div>
              <div class="f-f1 f-ajc"> <div class=" zzsx-d"></div></div> -->
            </div>
          </div>
        </el-col>
        <!-- <el-col :span="3"> -->
        <!-- <div class="f-ajc zzs-d"> <span >进度</span></div> -->
        <!-- <el-progress :text-inside="true" :stroke-width="36" :percentage="70" style="margin-top:8px;"></el-progress> -->
        <!-- <el-progress type="dashboard" :stroke-width="16" :percentage="percentage" :color="colors"></el-progress> -->
        <!-- </el-col> -->
      </el-row>
      <!-- 下面部分 -->
      <el-row class="bottom-row ">
        <!-- 左边 -->
        <el-col :span="12">
          <div class="bottom-row-left">
            <!-- 上面 -->
            <div class="f-ajc">
              <!-- 左边 -->
              <div class="f-f1 bottom-row-left-left">
                <div class="f-ajc"><span>本次出库总数</span></div>
                <div class="f-ajc"><span>{{ totalQuantity }}</span></div>
              </div>
              <!-- 右边 -->
              <div class="f-f1 bottom-row-left-left">
                <div class="f-ajc"><span>本次出库总盈亏</span></div>
                <div class="f-ajc bottom-row-left-left-right"><span>{{ totalResult }}</span></div>
              </div>
            </div>
            <!-- 列表 -->
            <el-table :data="tableData" :row-class-name="tableRowClassName">
              <el-table-column type="index" width="50" />
              <el-table-column prop="epcId" label="EPC" width="200" />
              <el-table-column prop="helperNum" label="helper号" sortable />
              <el-table-column prop="antNum" label="天线号" sortable />
              <el-table-column prop="count" label="次数" sortable />
            </el-table>
          </div>
        </el-col>
        <!-- 右边 -->
        <el-col :span="12">
          <div class="bottom-row-left">
            <!-- 上面 -->
            <div class="f-ajc">
              <!-- 左边 -->
              <div class="f-f1 bottom-row-left-left">
                <div class="f-ajc"><span>第N次操作数量</span></div>
                <div class="f-ajc"><span>{{ eachQuantity }}</span></div>
              </div>
              <!-- 右边 -->
              <div class="f-f1 bottom-row-left-left">
                <div class="f-ajc"><span>本次操作盈亏</span></div>
                <div class="f-ajc bottom-row-left-left-right"><span>{{ eachResult }}</span></div>
              </div>
            </div>
            <!-- 列表 -->
            <el-table :data="tableData" :row-class-name="tableRowClassName">
              <el-table-column type="index" width="50" />
              <el-table-column prop="epcId" label="EPC" width="200" />
              <el-table-column prop="helperNum" label="helper号" sortable />
              <el-table-column prop="antNum" label="天线号" sortable />
              <el-table-column prop="count" label="次数" sortable />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index'
// 获取库门信息
import { getDoors } from '@/api/poc/Door'
// 获取receiver信息
import { getTagDevices } from '@/api/poc/TagDevice'

// JNA 串口连接 
// eslint-disable-next-line no-unused-vars
import { findSerials, connectSerial, disconnectSerial, upLinkFrequencySelct, helperTransmitPowerModify, Qmodify, QueryAdjust, Mmodify, BLFmodify, transmitChannelSelect, helperAndAntSelcet, receiverTransmitModelSelect, stopTagAction, startTagAction } from '@/api/poc/JNAApi'

export default {
  name: 'Dashboard',
  components: {
  
  },
  data() {
     
      return {
        //进度条
        percentage: 10,
        colors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ],
        helperDevices:[],
        tagDevices:[],
        doors:[],
        user:{},
        receiver:{},
        title:'SENSE-eR220 RFID自动识别系统 V1.0',
        doorNumber: 1,
        licensePlate:'粤B213345',
        taskNumber:'NF20345678',
        taskTime:'',
        totalQuantity:0,
        totalResult:0,
        eachQuantity: 0,
        eachResult:0,
        tableData:[]
      }
    },
    computed: {
      ...mapGetters([
        'websocketData'
      ])
    },
     watch: {
        'websocketData.RECEIVER' (val) {
          // console.log("1111"+JSON.stringify(val));
          // RECEIVER数据
              for(let i =0;i<this.tableData.length;i++){
                  if(this.tableData[i].epcId==val.epcId){
                    this.tableData[i].count =  this.tableData[i].count+1;
                    //  console.log("222"+JSON.stringify(this.tableData[i]));
                     return;
                  }
              }
          //helper 状态数据
            for(let i =0;i<this.helperDevices.length;i++){
                  if(this.helperDevices[i].shortCode==val.helperNum){
                    this.helperDevices[i].status =  2;
                    //  console.log("111"+JSON.stringify(this.helperDevices[i]));
                  }
              }
            this.tableData.push(val)
            this.totalQuantity = this.tableData.length
            this.eachQuantity = this.tableData.length
        }
  },
  created() {
    // 1.根据用户账号获取账号下的所有 库门信息和库门对应的receiver 和hleper 信息
    // 1.1 获取vuex中的用户信息
    this.user = store.getters.user
    // 1.2 根据用户账号获取账号下的所有 库门信息
    this.getDoorByUser()
    this.taskTime = parseTime(new Date())
    // console.log("----"+JSON.stringify(this.doors))

    // //2.获取receiver 或者读写器的数据(带配置信息)
    // // this.receiverId = this.$route.params.receiverId,
    //  this.receiver = store.getters.receiver
    // // console.log(JSON.stringify(this.receiver))
    // if(null == this.receiver.deviceConfig){

    //   this.$notify({
    //           title: "receiver 没有配置，请去配置",
    //           type: 'error',
    //           duration: 2500
    //         })
    // }else{
    //   if("111222"!=this.receiver.deviceConfig.id){
    //       this.form=this.receiver.deviceConfig
    //   }else{
    //     this.$notify({
    //           title: "receiver 没有配置，请去配置",
    //           type: 'error',
    //           duration: 2500
    //         })
    //   }
      
    // }
  },
  methods: {
    // table row 背景色
    tableRowClassName({ row, rowIndex }) {
      console.log(JSON.stringify(row))
      if (row.status === 2) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
      // eslint-disable-next-line no-unreachable
      return ''
    },
    // 配置
    configClick() {
      store.commit('set_receiver', this.receiver)
      // var arr=JSON.stringify(value)
      this.$router.replace('/sense/poc/deviceConfig/index')
    },
    // excel导入
    importExcel() {
      // store.commit('set_receiver',thie.receiver)
      //      // var arr=JSON.stringify(value)
      this.$router.replace('/sense/poc/assetImport/index')
    },
    // receiver 切换
    receiverClick(item, index) {
      this.helperDevices = item.helperDevices
      this.receiver = item
    },
    // 获取接收器数据
    getReceiverByDoorId() {
      var doorIds = ''
      for (var i = 0; i < this.doors.length; i++) {
        // eslint-disable-next-line eqeqeq
        if (i != this.doors.length - 1) {
          doorIds += this.doors[i].id + ','
        } else {
          doorIds += this.doors[i].id
        }
      }
      // console.info("++++"+doorIds)
      const data = {
        doorIds: doorIds
      }
      getTagDevices(data).then(res => {
        // console.info(JSON.stringify(res.content))
        store.commit('SET_TAGDEVICES', this.tagDevices)
        this.tagDevices = res.content
        this.receiver = this.tagDevices[0]
        // this.helperDevices = this.tagDevices[0].helperDevices
        //helper 更加shortCode排序
        this.sortBykey(this.tagDevices[0].helperDevices,'shortCode')
        this.helperDevices = this.tagDevices[0].helperDevices
      })
    },
    // 数组对象排序
    sortBykey(ary, key) {
      return ary.sort((a, b)=> {
        let x = a[key]
        let y = b[key]
        return ((x < y) ? -1 : (x > y) ? 1 : 0)
      })
    },
    // 获取库门数据
    getDoorByUser() {
      const data = {
        userId: this.user.id
      }
      getDoors(data).then(res => {
        this.doors = res.content
        //  console.info("111===="+JSON.stringify(this.doors))
        store.commit('SET_DOORS', this.doors)
        //  console.info("222===="+JSON.stringify(store.getters.doors))
        // 1.2 根据库门信息获取receiver 信息
        this.getReceiverByDoorId()
      })
    },
    // 清除
    tagClear() {
      this.tableData = []
      // this.tagStop();
    },
    // 清除
    tagEnd() {
      this.tagStop()
      setTimeout(() => {
        this.tableData = []
      }, 1000)
    },
    // 开始盘存
    tagStart() {
      const data = {
        receiverId: this.receiver.id,
        // eslint-disable-next-line comma-dangle
        type: this.receiver.deviceConfig.readRfidMode,
      }
      startTagAction(data).then(res => {
        if (res.data.success) {
          this.$notify({
            title: res.data.message,
            type: 'success',
            duration: 2500
          })
          // this.serialStatus =true
        } else {
          this.$notify({
            title: res.data.message,
            type: 'error',
            duration: 2500
          })
        }
      })
    },
    // 停止盘存
    tagStop() {
      const data = {
        // eslint-disable-next-line comma-dangle
        receiverId: this.receiver.id,
        
      }
      stopTagAction(data).then(res => {
        if (res.data.success) {
          this.$notify({
            title: res.data.message,
            type: 'success',
            duration: 2500
          })
          // this.serialStatus =true
        } else {
          this.$notify({
            title: res.data.message,
            type: 'error',
            duration: 2500
          })
        }
      })
    },
    // 暂停盘存
    tagPause() {
      this.tagStop()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

    .f,.f-ac,.f-ajc{
      display: flex;
    }
    .f-ac,.f-ajc{
      justify-content: center;
    }
    .f-ajc{
      align-items: center;
      
    }
    .f-jsb{
      justify-content: space-between;	
    }
    .f-f1{
      flex: 1;
    }
    .f-d-c{
      flex-direction: column;
    }
  
  .el-header {
    background-color: #F5F7FA;
    color: #333;
    line-height: 60px;
    display: flex;
  }

  .col-title{
      //  border: 1px solid yellow ;
       font-size: 32px;
       font-weight: bold;
    }
  .main-title-el{
    padding: 10px;
  }  
  .main-col{
    // border: 1px solid;
    font-size: 23px;
    font-weight: bold;
  }
  .main-col-1{
    // border: 1px solid;
    font-size: 28px;
    font-weight: bold;
    width: 150px;
  }

  .bg-purple {
    // background: #d3dce6;
     border-radius: 4px;
    min-height: 36px;
  }
  .bg-purpl {
    background: red;
     border-radius: 4px;
    min-height: 36px;
  }
   .grid-content {
   
  }
  .zzs-d{
    // border: 1px solid red;
    padding: 5px 0;

  }
  .zzs-d>span{
      font-size: 22px;
      font-weight: bold;
  }
  .zzsx{
    // border: 1px solid;
     padding: 8px;
  }
  .zzsx-d{
   
    // border: 1px solid;
    // background: red;
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }
  .zzz-d{
    //  border: 1px solid;
     height: 94px;

  }
   .zzz-but{
    //  height: 60px;
     margin: 0 10px;
     font-size: 28px;
   }
   .bottom-row{
      border: 1px solid green;
      // height: 600px;
   }
   .bottom-row-left{
    //  border: 1px solid yellow;
     height: 600px;
     
   }
   .bottom-row-left-left{
      // border: 1px solid;
      
   }
   .bottom-row-left-left>div{
      // border: 1px solid;
      
   }
   .bottom-row-left-left>div:first-child{
     padding: 5px;
      font-size: 22px;
      font-weight: bold;
   }
   .bottom-row-left-left>div:last-child{
      font-size: 60px;
      font-weight: bold;
      color: blue;
   }
   .bottom-row-left-left-right>span{
     color: red;
   }
</style>
