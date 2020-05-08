<template>
      <el-container  class="dashboard-container">
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

              <!--表单组件-->
              <el-dialog  title="人工处理未读到的标签" width="800px"
              :visible.sync="dialogVisible">
                <el-table :data="tagList">
                  <el-table-column  prop="shipmentNumber" align="enter" label="货运单号" />
                    <el-table-column  prop="orderKey" align="enter" label="订单号" />
                    <el-table-column  prop="shippingLabel" align="enter" label="发货标签" />
                    <el-table-column  prop="licensePlateNo" align="enter" label="车牌信息" />
                    <el-table-column  prop="status" align="enter" label="状态" />
                    <el-table-column  label="操作" width="150px" align="center">
                      <template slot-scope="scope">
                        <div>
                        <el-button   size="mini" type="primary" style="" icon="el-icon-setting" @click="doConfig(scope.row)" />
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
              </el-dialog>

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
                          <!-- <el-col :span="8" class="f-f1 f main-col">  车辆标签总数：<div  class="prime-text">{{carPortInData.carTagCount}}</div> </el-col> -->
                          <!-- <el-col :span="8" class="f-f1 f main-col">  车辆已完成标签数：<div  class="prime-text">{{carPortInData.carReadTagCount}}</div> </el-col> -->
                          <el-col :span="8" class="f-f1 f main-col">  车辆已完成订单数：<div  class="prime-text">{{carPortInData.carReadOrderCount}}</div> </el-col>
                       </el-row> 
                        <div class="f-ajc" style="margin-left:10px;margin-top:2px;">
                            <span class="main-col">进度:</span> 
                            <div class="f-f1" style="margin-left:10px;"> 
                            <el-progress :text-inside="true" :stroke-width="36" :percentage="carPortInData.carOrderParent" color="#E6A23C"></el-progress>
                         </div>
                        </div>

                          <!-- 订单进度 -->
                         <el-row class="f-ajc main-title-el"  style="margin-top:20px;">
                          <!-- <el-col :span="8" class=" f-f1  f main-col-1">进行中的订单：<div class="prime-text">{{carPortInData.currentOrder}}</div> </el-col>
                          <el-col :span="8" class="f-f1 f main-col">  订单标签数：<div  class="prime-text">{{carPortInData.currentOrderTagCount}}</div> </el-col>
                          <el-col :span="8" class="f-f1 f main-col"> 订单已完成标签数：<div  class="prime-text">{{carPortInData.currentReadOrderCount}}</div> </el-col> -->
                          <el-col :span="8" class="f-f1 f main-col">  车辆标签总数：<div  class="prime-text">{{carPortInData.carTagCount}}</div> </el-col>
                          <el-col :span="8" class="f-f1 f main-col">  车辆已完成标签数：<div  class="prime-text">{{carPortInData.carReadTagCount}}</div> </el-col>
                       </el-row> 
                        <div class="f-ajc" style="margin-left:10px;margin-top:2px;">
                            <span class="main-col">进度:</span> 
                            <div class="f-f1" style="margin-left:10px;"> 
                              <el-progress :text-inside="true" :stroke-width="36" :percentage="carPortInData.carTagPercent" color="#E6A23C"></el-progress>
                         </div>
                        </div>
                    </div>
                  </el-col>
                  <!-- 右边 -->
                  <el-col :span="6">
                    <div>
                        <!-- <el-row >
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
                        </el-row> -->
                      <el-row class="f-ajc main-title-el">
                          <el-col  class="f-f1 f main-col"> 离台时间：<div  class="prime-text">{{carPortInData.portOutTm}}</div> </el-col>
                       </el-row> 
                      <el-row class="f-ajc main-title-el">
                          <el-col  class="f-f1 f main-col"> 装车时间：<div  class="prime-text">{{carPortInData.shipmentsTime}}min</div> </el-col>
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
                 <el-row>
                    <el-col span="12">
                          <div class="echarts-box">
                            <div class="echarts-title f-ajc">已完成订单</div>
                            <div class="echarts-content">
                              <div class="warning-box" :class="{warning_animate: animate}">
                                <div v-for="(item, index) in finishOrder" :key="index" class="warning-items f-ajc">
                                 订单: {{ item.orderKey }} 已完成装车
                                </div>
                              </div>
                            </div>
                          </div>
                    </el-col>
                    <el-col span="12">
                        <div class="echarts-box">
                            <div class="echarts-title-running f-ajc">未完成订单</div>
                            <div class="echarts-content">
                              <div class="warning-box" :class="{warning_animate: animateRunning}">
                                <div v-for="(item, index) in runningOrder" :key="index" class="warning-items-running f-ajc">
                                  <div @click="clickRunningOrder(item,index)">订单: {{ item.orderKey }}  进度：{{item.attr1}}
                                      <span v-show="item.attr2-item.attr3==1?true:false">未读标签：{{item.shippingLabel}}</span>
                                    </div> 
                                </div>
                              </div>
                            </div>
                          </div>
                    </el-col>
                 </el-row>  
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

// 人工处理未读标签
import {artificial,getShipmentLable} from '@/api/hw/HwTaskDetail'

export default {
  name: 'Dashboard',
  components: {
  
  },
  data() {
      return {
         tagList:[],// 未读到的发运标签
         dialogVisible: false, //dialog显示控制
         animate: false,        // 列表滚动动画
         animateRunning: false,        // 列表滚动动画
         timeFinishId: null,// 订单完成定时器id
         timeRunningId: null,// 订单未完成定时器id

        //车辆靠站信息
        carPortInData:{},
         //已完成订单数据
         finishOrder:[],
         //未完成订单数据
         runningOrder:[], 
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
           //已完成数据
           this.finishOrder = this.listFilter(val.hwTaskDetailList,'1');
           //未完成数据
           this.runningOrder = this.listFilter(val.hwTaskDetailList,'0')
            //helper 状态数据
            for(let i =0;i<this.helperDevices.length;i++){
                  if(this.helperDevices[i].shortCode==val.helperNum){
                    this.helperDevices[i].status =  2;
                    //  console.log("111"+JSON.stringify(this.helperDevices[i]));
                  }
              }
           //缓存看板数据
           store.commit('SET_DASHBOARD',this.carPortInData);
           if(this.timeRunningId == null){
              this.showMarqueeRunning()
           }
           if(this.timeFinishId == null){
              this.showMarquee()
           }
        },
       //监测RFID错误信息
        'websocketData.warningRFID' (val) {
          console.log("2222"+JSON.stringify(val));
          // 弹出错误数据
          this.tipTag(val)
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
       //已完成数据
      this.finishOrder = this.listFilter(this.carPortInData.hwTaskDetailList,'1');
      //未完成数据
      this.runningOrder = this.listFilter(this.carPortInData.hwTaskDetailList,'0')
  },
  mounted(){
   
  },
  methods:{
    //标签误读提示
    tipTag(val){
      this.$notify({
          title: '错误标签',
          message: val.msg,
          type: 'error',
          offset: 30,
          duration: 0
        });
    },
      //人工处理没有读到的标签数据
    doConfig(value) {
      //  console.log("333"+JSON.stringify(value))
        const data = {
          tag: value.shippingLabel,
          helperNum: this.carPortInData.helperNum
        }
        artificial(data).then(res=>{
           if(res.success){
            this.$notify({
              title: "标签处理成功",
              type: 'success',
              duration: 2500
            })
           this.dialogVisible = false;
          }else{
              this.$notify({
              title: "标签处理失败",
              type: 'error',
              duration: 2500
            })
          }
        })
    },
    //未完成订单点击事件
    clickRunningOrder(item,index){
      // 跳转到发货详情界面
      // this.$router.push({
      //   name:'taskDetail',
      //   params:{
      //       shipmentNumber: item.shipmentNumber,
      //       orderKey: item.orderKey,
      //       helperNum: this.carPortInData.helperNum
      //     }
      // })

      //获取未读取标签数据
      this.getRunningTag(item);
      
    },
  //获取未读取标签数据
     getRunningTag(item) {
      const data = {
        shipmentNumber: item.shipmentNumber,
        orderKey: item.orderKey,
        status: '0'
      }
      getShipmentLable(data).then(res => {
        this.tagList = res.content
        //弹出dialog
        this.dialogVisible = true;
      })
    },

     listFilter(val,status){
        return val.filter(hwTask=>{
          return hwTask.status==status
        })
     },
     showMarquee () {
       if(this.finishOrder.length<=6){
         return;
       }
      this.timeFinishId = setTimeout(() =>{
        this.animate = true;
        setTimeout(()=>{ // 延迟0.5秒是为动画腾出时间
          let completeList = this.finishOrder
          completeList.push(completeList[0])
          completeList.shift();
          this.finishOrder = completeList
          this.animate = false;
        },500)
        this.showMarquee()
      },2000)
    },
   showMarqueeRunning () {
       if(this.runningOrder.length<6){
         return;
       }
      this.timeRunningId =  setTimeout(() =>{
        this.animateRunning = true;
        setTimeout(()=>{ // 延迟0.5秒是为动画腾出时间
          let completeList = this.runningOrder
          completeList.push(completeList[0])
          completeList.shift();
          this.runningOrder = completeList
          this.animateRunning = false;
        },500)
        this.showMarqueeRunning()
      },2000)
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
  },
  beforeDestroy(){
    clearTimeout(this.timeFinishId)
    clearTimeout(this.timeRunningId)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
      .dashboard-container{
       height: calc(100vh - 60px);
      }

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
   .echarts-box{
        width: 100%;
        // flex: 1;
        height: 342px;
        margin-bottom: 10px;
        box-sizing: border-box;
        // border: 1px solid #21476b;
        // background-image: url('./image/border-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        
       
      }
       .echarts-content{
          margin: 1px;
          width: calc(100% - 2px);
          flex: 1;
          color: #fff;
          overflow: hidden;
          
         
        }
      .warning-box{
            width: 100%;
            height: 120%;
            margin: 0;
            overflow: hidden;
           
          }
       .warning-items{
              position: relative;
              margin-top: 1px;
              width: 100%;
              height: 40px;
              padding-left: 30px;
              padding-right: 10px;
              font-size: 20px;
              line-height: 20px;
              background: #57df0e;
              color: black;
              overflow: auto;
             
            }
       .warning_animate{
            transition: all 0.5s;
	          margin-top: -41px
          }
      .echarts-title{
          margin: 1px;
          width: calc(100% - 2px);
          height: 50px;
          // background-color: #021e45;
          color: green;
          font-size: 26px;
          font-weight: bold;
         
        }
      .echarts-title-running{
          margin: 1px;
          width: calc(100% - 2px);
          height: 50px;
          // background-color: #021e45;
          color: red;
          font-size: 26px;
          font-weight: bold;
         
        }
        .warning-items-running{
              position: relative;
              margin-top: 1px;
              width: 100%;
              height: 40px;
              padding-left: 30px;
              padding-right: 10px;
              font-size: 20px;
              line-height: 20px;
              background: yellow;
              color: black;
              overflow: auto;
             
            } 
</style>