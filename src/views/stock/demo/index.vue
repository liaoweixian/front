<template>
  <el-container class="dashboard-container">
    <!-- 顶部 -->
    <el-header>
      <el-row>
        <div>
          <img src="/huawei_logo.png" style="width: 119px; height: 49px;">
        </div>
      </el-row>
      <el-row class="f-f1 ">
        <el-col class="col-title f-ajc">仓库作业看板系统</el-col>
      </el-row>
      <el-row>
        <!--  <div style="font-size: 24px;font-weight: bold;">
          <el-button type="primary"> 配置 </el-button>  
        </div> -->
      </el-row>
    </el-header>
    <el-main>
      <!-- 列表 -->
      <el-row>
        <el-col>
          <div class="echarts-box">
            <div class="echarts-content">
              <div class="warning-box-1">
                <div class="f-ajc">
                  <div class=" div-table-title">客户姓名</div>
                  <div class=" div-table-title">礼品编号</div>
                  <div class=" div-table-title">状态</div>
                  <div class=" div-table-title">推荐货位</div>
                </div>
              </div>
              <div class="warning-box" :class="{warning_animate: orderAnimate}">
                <div v-for="(item, index) in order" :key="index" class=" f-ajc">
                  <div class="div-table-td">{{ item.clientName }}</div>
                  <div class="div-table-td">{{ item.giftCod }}</div>
                  <div class="div-table-td">{{ dict.label.order_status[item.status] }} </div>
                  <div class="div-table-td">{{ item.toLocationCod }}</div>
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
import request from '@/utils/request'

export default {
  name: 'Dashboard',
  dicts: ['order_status'],
  components: {
  
  },
  data() {
    return {
      animate: false, // 列表滚动动画
      orderAnimate: false,
     
      timeFinishId: null, // 订单完成定时器id
      // 已完成订单数据
      finishOrder: [],
      order: [],
      // 未完成订单数据
      runningOrder: [], 
      // 进度条
      percentage: 10,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      helperDevices: [],
      tagDevices: [],
      doors: [],
      user: {},
      receiver: {},
      title: '',
      doorNumber: 1
      
    }
  },
  computed: {

  },
  watch: {
    
  },
  created() {
    this.getOrder()
  },
  mounted() {
    
  },
  beforeDestroy() {
    clearTimeout(this.timeFinishId)
  },
  methods: {
    showOrder() {
      console.log(this.order)
      if (this.order.length <= 2) {
        return
      }
      this.timeFinishId = setTimeout(() => {
        this.orderAnimate = true

        setTimeout(() => { // 延迟0.5秒是为动画腾出时间
          const completeList = this.order
          completeList.push(completeList[0])
          completeList.shift()
          this.order = completeList
          this.orderAnimate = false
        }, 500)
        this.showOrder()
      }, 2000)
    },
    getOrder() {
      const _this = this
      request({
        url: 'api/rfidGiftTrn',
        method: 'get',
        params: { page: 0, size: 1000 }
      }).then((result) => {
        _this.order = result.content
        clearTimeout(_this.timeFinishId)
        this.showOrder()
      })
    }
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
            height: 100%;
            margin: 0;
            overflow: hidden;
           
          }
        .warning-box-1{
            width: 100%;
            margin-bottom: 31px;
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
        .div-table-title{
            // margin-right: 10%;
            position: relative;
            margin-top: 1px;
            width: 100%;
            height: 40px;
            padding-left: 30px;
            padding-right: 10px;
            font-size: 20px;
            line-height: 20px;
            // background: #57df0e;
            color: black;
            overflow: auto;
        }
         .div-table-td{
            // margin-right: 10%;
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

</style>
