<template>
      <el-container class="dashboard-container">
            <!-- 顶部 -->
            <el-header >
              <el-row :gutter="5" >
                <el-button  type="primary" @click="homeClick"> 配置 </el-button>
                <!-- <el-button  type="info" @click="importExcel">Excel导入</el-button> -->
              </el-row>
              <el-row class="f-f1 ">
                <el-col  class="col-title f-ajc">{{title}}</el-col>
              </el-row>
              <el-row >
                <div  style="font-size: 24px;font-weight: bold;"> {{taskTime}} </div>
              </el-row>
            </el-header>
            <el-main>
                <!-- 开头部分 -->
                <el-row>
                  <!-- 左边 -->
                  <el-col :span="18">
                    <div>
                       <el-row class="f-ajc main-title-el">
                          <el-col :span="8" class=" f-f1  f main-col-1"> 库门号：<div class="prime-text">{{doors[0].name}}</div> </el-col>
                          <el-col :span="8" class="f-f1 f main-col"> 车牌号：<div  class="prime-text">{{carPortInData.licensePlateNo}}</div> </el-col>
                          <el-col :span="8" class="f-f1 f main-col"> 靠台时间：<div  class="prime-text">{{carPortInData.portInTm}}</div> </el-col>
                       </el-row> 
                       <!-- 任务进度 -->
                       <el-row class="f-ajc main-title-el"  style="margin-top:10px;">
                          <el-col :span="8" class=" f-f1  f main-col-1">车辆订单总数：<div class="prime-text">{{carPortInData.carOrderCount}}</div> </el-col>
                          <el-col :span="8" class="f-f1 f main-col">  车辆标签总数：<div  class="prime-text">{{carPortInData.carTagCount}}</div> </el-col>
                          <el-col :span="8" class="f-f1 f main-col">  车辆已完成标签数：<div  class="prime-text">{{carPortInData.carReadTagCount}}</div> </el-col>
                       </el-row> 
                        <div class="f-ajc" style="margin-left:10px;margin-top:2px;">
                            <span class="main-col">进度:</span> 
                            <div class="f-f1" style="margin-left:10px;"> 
                            <el-progress :text-inside="true" :stroke-width="36" :percentage="carPortInData.carTagPercent" color="#E6A23C"></el-progress>
                         </div>
                        </div>

                          <!-- 订单进度 -->
                         <el-row class="f-ajc main-title-el"  style="margin-top:20px;">
                          <el-col :span="8" class=" f-f1  f main-col-1">进行中的订单：<div class="prime-text">{{carPortInData.currentOrder}}</div> </el-col>
                          <el-col :span="8" class="f-f1 f main-col">  订单标签数：<div  class="prime-text">{{carPortInData.currentOrderTagCount}}</div> </el-col>
                          <el-col :span="8" class="f-f1 f main-col"> 订单已完成标签数：<div  class="prime-text">{{carPortInData.currentReadOrderCount}}</div> </el-col>
                       </el-row> 
                        <div class="f-ajc" style="margin-left:10px;margin-top:2px;">
                            <span class="main-col">进度:</span> 
                            <div class="f-f1" style="margin-left:10px;"> 
                              <el-progress :text-inside="true" :stroke-width="36" :percentage="carPortInData.currentOrderTagPersent" color="#E6A23C"></el-progress>
                         </div>
                        </div>
                    </div>
                  </el-col>
                  <!-- 右边 -->
                  <el-col :span="6">
                    <div>
                        <el-row >
                          <div class="f-ajc" style="margin-left:0px;">
                             <div class="upload-text">   装车灯 </div>  
                              <div class="upload-light"></div>
                          </div>
                        </el-row>
                        <el-row style="margin-top:5px;">
                          <div class="f-ajc">
                             <div class="upload-text">指示灯 </div>  
                              <div class="upload-light"></div>
                          </div>
                        </el-row>
                        <!-- receiver -->
                        <el-row style="margin-top:8px; margin-left:50px;">
                           <div class="f zzsx" > 
                              <div v-for="(item,index) in tagDevices" :key="index" class="f-f1 f">
                                    <el-button :type ="item.status==2? 'success':'danger'"   circle class=" zzsx-d" @click="receiverClick(item,index)"></el-button>
                              </div> 
                          </div>
                        </el-row>
                        <!-- helper -->
                        <el-row style="margin-top:0px; margin-left:50px;">
                            <div class="f zzsx"> 
                              <div v-for="(item,index) in helperDevices" :key="index" class="f-f1 f">
                                    <el-button :type ="item.status==2? 'success':'danger'"   circle class=" zzsx-d" ></el-button>
                              </div> 
                           </div>
                        </el-row>
                    </div>
                  </el-col>
                </el-row>
                <!-- 下面部分 -->
                     <!-- 列表 -->
                    <el-table 
                       class="table-home"
                      :data="carPortInData.hwTaskDetailList" 
                      :row-style="tableRowClassName" 
                      :header-cell-style="tableHeaderColor"
                      :cell-style="tableCellColor"
                      max-height="250" 
                      style="margin-top:10px; width:100%;">
                      <el-table-column type="index" width="100">
                      </el-table-column>
                      <el-table-column prop="shipmentNumber" label="货运单号"  >
                      </el-table-column>
                        <el-table-column prop="orderKey" label="订单号" sortable>
                      </el-table-column>
                      <el-table-column prop="shippingLabel" label="发运RFID标签" >
                      </el-table-column>
                      <el-table-column prop="attr1" label="进度" sortable>
                      </el-table-column>
                       <el-table-column label="操作"  width="200">
                          <template slot-scope="scope">
                            <el-button  size="mini">
                               <router-link :to="{name:'taskDetail',params:{shipmentNumber:scope.row.shipmentNumber,orderKey:scope.row.orderKey}}">
                                  编辑
                               </router-link>  
                            </el-button>
                          </template> 
                        </el-table-column>
                  </el-table>
            </el-main>
      </el-container>
</template>

<script>
import store from '@/store'
import {mapGetters} from 'vuex'
import { parseTime } from "@/utils/index"
//获取库门信息
import { getDoors } from "@/api/poc/Door"
//获取receiver信息
import { getTagDevices } from "@/api/poc/TagDevice"

// JNA 串口连接 
import {findSerials,connectSerial,disconnectSerial,upLinkFrequencySelct,helperTransmitPowerModify,
        Qmodify,QueryAdjust,Mmodify,BLFmodify,transmitChannelSelect,helperAndAntSelcet,
        receiverTransmitModelSelect,stopTagAction,startTagAction }  from '@/api/poc/JNAApi'
export default {
  name: 'Dashboard',
  components: {
  
  },
  data() {
     
      return {
        //车辆靠站信息
        carPortInData:{},
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
        doorNumber: 1
       
      }
    },
    computed: {
      ...mapGetters([
        'websocketData'
      ])
    },
     watch: {
       //监测车辆靠台数据
        'websocketData.carPortIn' (val) {
          // console.log("1111"+JSON.stringify(val));
          // carPortIn数据
           this.carPortInData = val;   
           //缓存看板数据
           store.commit('SET_DASHBOARD',this.carPortInData);

        },
       //监测RFID错误信息
        'websocketData.warningRFID' (val) {
          // console.log("1111"+JSON.stringify(val));
          // 弹出错误数据
          

        }
     },
    created(){
      //1.根据用户账号获取账号下的所有 库门信息和库门对应的receiver 和hleper 信息
      //1.1 获取vuex中的用户信息
      this.user = store.getters.user;
      //1.2 根据用户账号获取账号下的所有 库门信息
      this.getDoorByUser();
      this.taskTime = parseTime(new Date());
      // console.log("----"+JSON.stringify(this.doors))
      //获取缓存的看板数据
      this.carPortInData = store.getters.dashboard;
  },
  methods:{
  
      //设置表头行的样式
      // tableHeaderColor({row,column,rowIndex,columnIndex}){
      tableHeaderColor(row,column,rowIndex,columnIndex){
          return 'color:#333;font-wight:500;font-size:20px;'
          // return 'background-color:lightblue;color:#fff;font-wight:500;font-size:20px;text-align:center'

      },
      //设置表头行的样式
      tableCellColor(row,column,rowIndex,columnIndex){
          return 'color:#666;font-wight:700;font-size:18px;'
          // return 'background-color:lightblue;color:#fff;font-wight:500;font-size:20px;text-align:center'

      },
      //table row 背景色
      tableRowClassName(row, rowIndex) {
        console.log(rowIndex)
        //   if (rowIndex == 1) {
        //     return 'warning-row';
        //   } else  {
        //     return 'success-row';
        //   }
           return 'background-color: #57df0e'
      },

      //配置
      homeClick(){
        // store.commit('set_receiver',this.receiver)
             // var arr=JSON.stringify(value)
        this.$router.replace('/sense/poc/homeConfig/index')
      },
      // //excel导入
      // importExcel(){

      //   // store.commit('set_receiver',thie.receiver)
      //   //      // var arr=JSON.stringify(value)
      //   this.$router.replace('/sense/poc/assetImport/index')
      // },
      //receiver 切换
      receiverClick(item,index){
        this.helperDevices=item.helperDevices
        this.receiver=item
      },
      // 获取接收器数据
      getReceiverByDoorId(){
        var doorIds=''
        for(var i=0;i<this.doors.length;i++){
          if(i != this.doors.length-1){
            doorIds += this.doors[i].id+","
          }else{
             doorIds += this.doors[i].id
          }
        }
        // console.info("++++"+doorIds)
        let data ={
          doorIds:doorIds
        }
        getTagDevices(data).then(res => {
          // console.info(JSON.stringify(res.content))
           store.commit('SET_TAGDEVICES',this.tagDevices)
          this.tagDevices = res.content
          this.receiver=this.tagDevices[0]
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
       getDoorByUser(){
         let data ={
          userId:this.user.id
        }
        getDoors(data).then(res => {
            this.doors = res.content
            //  console.info("111===="+JSON.stringify(this.doors))
             store.commit('SET_DOORS',this.doors)
              //  console.info("222===="+JSON.stringify(store.getters.doors))
              //1.2 根据库门信息获取receiver 信息
            this.getReceiverByDoorId()
        })
       }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

    .table-home .warning-row {
      background: rgb(231, 153, 6);
    }

    .table-home .success-row {
      background: #57df0e;
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
    font-size: 28px;
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
   .upload-light{
     
     width: 50px;
     height: 50px;
     background: blue;
     border-radius: 100%;
     margin-left: 20px;
   }
   .upload-text{
     font-size: 28px;
     font-weight: bold;
   }
   .prime-text{
     font-size: 28px;
     color: blue;
   }
   .lable-col{
     font-size: 24px;
     font-weight: bold;
   }
</style>