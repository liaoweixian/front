<template> 
</template>

<script>

export default {
  name: 'Dashboard',
  components: {
  
  },
  data() {
    return {
    }
  },
  computed: {
  
  },
  watch: {
  },
  methods: {
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