<template>
  <div class="app-container">
    <el-row :gutter="2">
        <!-- 串口连接 -->
        <el-col style="margin-bottom: 10px" :span="10">
          <el-card class="box-card" shadow="never">
             <div slot="header" class="clearfix">
                <span class="role-span" style="font-size:24px">串口连接</span>
                <el-button
                          :loading="genLoading"
                          icon="el-icon-check"
                          style="float: right; padding: 6px 9px"
                          type="primary"
                          @click="serialSave"
                  >保存</el-button>
            </div>
              <div  >
                <span style="color: #333;margin-left: 20px;"> 串  口:</span>
                <el-input v-model="form.serialPort" style="width: 40%;margin-left:10px;" />
              </div>
              <div style="margin-top:10px;">
                 <span style="color: #333;margin-left: 10px;">波特率:</span>
                 <el-input v-model="form.boudRate" style="width: 40%;margin-left:10px;" />
              </div>
              <div style="margin-top:10px;margin-left:10px">
                <el-button type="primary" v-bind:disabled="serialStatus" @click="connectSerial">连接</el-button>
                <el-button type="info" v-bind:disabled="!serialStatus" style="margin-left=30px;" @click="disconnectSerail">断开</el-button>
              </div>
          </el-card>
           <!-- helper 配置 -->
          <el-card class="box-card" shadow="never">
             <div slot="header" class="clearfix">
            <span class="role-span" style="font-size:24px">IOT管理</span>
              <el-button
                        style="float: right; padding: 6px 9px"
                        type="primary"
                        @click="clickTransmitChanelSelect"
                >发射通道选择</el-button>
          </div>
            <el-table
              :data="receiver.helperDevices"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="激励器"
                width="100">
              </el-table-column>
             <el-table-column align="center" label="天线" width="320px">
                <template slot-scope="scope">
                 <!-- <el-checkbox-group v-model="receiver.helperDevices[scope.$index].devices"> -->
                   <div v-for="(ant, index ) in receiver.helperDevices[scope.$index].devices "  :key="index" >

                        <el-checkbox v-model="ant.status==2?true:false" @change="checkboxChange(scope.$index,index)" style="float:left;margin-left:10px;">{{ant.name}}</el-checkbox>
                   </div>
                 
                <!-- </el-checkbox-group> -->
                </template>
              </el-table-column>
             <el-table-column align="center" label="操作" width="80px">
                <template slot-scope="scope">
                    <el-button type="primary" @click="setHelperAnt(scope.$index,scope.row)">设置</el-button>
                </template>
              </el-table-column>
             
            </el-table>
          </el-card>
             
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
             <div slot="header" class="clearfix">
              <span class="role-span" style="font-size:24px">参数配置</span>
           <el-button
              :loading="genLoading"
              icon="el-icon-check"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="blfParamsSave"
            >保存</el-button>
           </div>
              <div >
                <span style="color: #333;margin-left: 95px;"> Q 值:</span>
                <el-select v-model="form.q" filterable placeholder="请选择" style="margin-left:10px">
                  <el-option
                    v-for="item in dict.Q值"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
                <el-button type="primary" size="mini" style="margin-left:10px" @click="setQ">设置</el-button>
              </div>
              <div style="margin-top:5px" >
                <span style="color: #333;margin-left: 10px;"> QueryAdjust次数:</span>
                 <el-select v-model="form.queryAdjust" filterable placeholder="请选择" style="margin-left:8px">
                  <el-option
                    v-for="item in dict.QueryAdjust次数"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
                <el-button type="primary" size="mini" style="margin-left:10px" @click="setQueryAdjust">设置</el-button>
              </div>
              <div style="margin-top:10px" >
                <span style="color: #333;margin-left: 95px;"> M 值:</span>
                 <el-select v-model="form.m" filterable placeholder="请选择" style="margin-left:10px">
                  <el-option
                   v-for="item in dict.M值"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
                <el-button type="primary" size="mini" style="margin-left:10px" @click="setM">设置</el-button>
              </div>
              <div style="margin-top:10px" >
                <span style="color: #333;margin-left: 83px;"> BLF值:</span>
                 <el-select v-model="form.blf" filterable placeholder="请选择" style="margin-left:10px">
                  <el-option
                  v-for="item in dict.BLF值"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
                <el-button type="primary" size="mini" style="margin-left:10px" @click="setBLF" >设置</el-button>
              </div>
              <div style="margin-top:10px" >
                <span style="color: #333;margin-left: 93px;"> 功 率:</span>
                 <el-select v-model="form.power" filterable placeholder="请选择" style="margin-left:10px">
                  <el-option
                  v-for="item in dict.功率"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
                <el-button type="primary" size="mini" style="margin-left:10px" @click="setPower">设置</el-button>
              </div>
              <div style="margin-top:10px" >
                <span style="color: #333;margin-left: 65px;"> 发射模式:</span>
                 <el-select v-model="form.transmitModel" filterable placeholder="请选择" style="margin-left:10px">
                  <el-option
                   v-for="item in dict.发射模式"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
                <el-button type="primary" size="mini" style="margin-left:10px" @click="setTransmitModel">设置</el-button>
              </div>
              <div style="margin-top:10px" >
                <span style="color: #333;margin-left: 65px;">读卡模式:</span>
                 <el-select v-model="form.readRfidMode" filterable placeholder="请选择" style="margin-left:10px">
                  <el-option
                    v-for="item in dict.读卡模式"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
                <el-button type="primary" size="mini" style="margin-left:10px"  @click="setReadRfidModel" >设置</el-button>
              </div>
             
                <div style="margin-top:10px; margin-left: 85px;">
                      <div >
                        <span style="color: #333;"> 第一路:</span>
                        <el-select v-model="form.upLinkFrequencyOne" filterable placeholder="请选择" style="margin-left:8px">
                          <el-option
                            v-for="item in dict.上行频率"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value" />
                        </el-select>
                        <el-button type="primary" size="mini" style="margin-left:10px"  @click="setUplinkOne">设置</el-button>
                      </div>
                      <div style="margin-top:10px" >
                        <span style="color: #333;"> 第二路:</span>
                        <el-select v-model="form.upLinkFrequencyTwo" filterable placeholder="请选择" style="margin-left:8px">
                          <el-option
                            v-for="item in dict.上行频率"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value" />
                        </el-select>
                        <el-button type="primary" size="mini" style="margin-left:10px"  @click="setUplinkTwo">设置</el-button>
                      </div>
                      <div style="margin-top:10px" >
                        <span style="color: #333;"> 第三路:</span>
                        <el-select v-model="form.upLinkFrequencyThree" filterable placeholder="请选择" style="margin-left:8px">
                          <el-option
                            v-for="item in dict.上行频率"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value" />
                        </el-select>
                        <el-button type="primary" size="mini" style="margin-left:10px"  @click="setUplinkThree">设置</el-button>
                      </div>
                      <div style="margin-top:10px" >
                        <span style="color: #333;"> 第四路:</span>
                        <el-select v-model="form.upLinkFrequencyFour" filterable placeholder="请选择" style="margin-left:8px">
                          <el-option
                            v-for="item in dict.上行频率"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value" />
                        </el-select>
                        <el-button type="primary" size="mini" style="margin-left:10px"  @click="setUplinkFour ">设置</el-button>
                      </div>
                  </div>  
          </el-card>
        </el-col>
        <!-- <el-col :span="8" >
               <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span class="role-span" style="font-size:24px">上行频率选择 </span>
                    <el-button
                        :loading="genLoading"
                        icon="el-icon-check"
                        style="float: right; padding: 6px 9px"
                        type="primary"
                    >保存</el-button>
                  </div>
                  <div>
                      <div >
                        <span style="color: #333;"> 第一路:</span>
                        <el-select v-model="form.upLinkFrequencyOne" filterable placeholder="请选择" style="margin-left:8px">
                          <el-option
                            v-for="item in dict.上行频率"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value" />
                        </el-select>
                        <el-button type="primary" size="mini" style="margin-left:10px">设置</el-button>
                      </div>
                      <div style="margin-top:5px" >
                        <span style="color: #333;"> 第二路:</span>
                        <el-select v-model="form.upLinkFrequencyTwo" filterable placeholder="请选择" style="margin-left:8px">
                          <el-option
                            v-for="item in dict.上行频率"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value" />
                        </el-select>
                        <el-button type="primary" size="mini" style="margin-left:10px">设置</el-button>
                      </div>
                      <div style="margin-top:5px" >
                        <span style="color: #333;"> 第三路:</span>
                        <el-select v-model="form.upLinkFrequencyThree" filterable placeholder="请选择" style="margin-left:8px">
                          <el-option
                            v-for="item in dict.上行频率"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value" />
                        </el-select>
                        <el-button type="primary" size="mini" style="margin-left:10px">设置</el-button>
                      </div>
                      <div style="margin-top:5px" >
                        <span style="color: #333;"> 第四路:</span>
                        <el-select v-model="form.upLinkFrequencyFour" filterable placeholder="请选择" style="margin-left:8px">
                          <el-option
                            v-for="item in dict.上行频率"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value" />
                        </el-select>
                        <el-button type="primary" size="mini" style="margin-left:10px">设置</el-button>
                      </div>
                  </div>  
               </el-card>
        </el-col> -->

    </el-row>
   
  </div>
</template>

<script>
import {getAll, add, edit, del} from '@/api/poc/DeviceConfig'
import store from '@/store'
// 改变天线设备数据状态
import {antStautsChange}  from '@/api/poc/Device'
// 改变读写器设备的配置字段信息
import {editConfig}  from '@/api/poc/TagDevice'
// JNA 串口连接 
import {findSerials,connectSerial,disconnectSerial,upLinkFrequencySelct,helperTransmitPowerModify,
        Qmodify,QueryAdjust,Mmodify,BLFmodify,transmitChannelSelect,helperAndAntSelcet,
        receiverTransmitModelSelect,stopTagAction,startTagAction }  from '@/api/poc/JNAApi'

export default {
  name: 'DeviceConfig',
  components: {  },

  dicts: ['Q值', 'QueryAdjust次数', 'M值', 'BLF值', '功率', '发射模式', '读卡模式', '上行频率', '上行频率', '上行频率', '上行频率'],
  data() {
    return {
      //串口连接状态标识，1.为已连接 2. 已断开
      serialStatus:true, 
      checkList: ['选中且禁用','复选框 A'],
      receiver:{},
      genLoading: false,
      form:{ 
          id: null, 
          deviceId: null, 
          serialPort: null, 
          boudRate: null, 
          tagMatch: null, 
          q: null, 
          queryAdjust: null, 
          m: null, 
          blf: null, 
          power: null, 
          transmitModel: null, 
          readRfidMode: null, 
          upLinkFrequencyFour: null, 
          upLinkFrequencyThree: null, 
          upLinkFrequencyTwo: null, 
          upLinkFrequencyOne: null, 
          remark: null, 
          delFlag: null, 
          attr1: null, 
          attr2: null, 
          attr3: null, 
          attr4: null, 
          crtTime: null, 
          crtUser: null, 
          crtName: null, 
          crtHost: null, 
          updTime: null, 
          updUser: null, 
          updName: null, 
          updHost: null 
        },
    }
  },
  created(){
    //1.获取receiver 或者读写器的数据(带配置信息)
    // this.receiverId = this.$route.params.receiverId,
     this.receiver = store.getters.receiver
    // console.log(JSON.stringify(this.receiver))
    if(null == this.receiver.deviceConfig){

      //2. 获取配置数据 根据设备id
      let params = {}
      params["deviceId"] = this.receiver.id
      getAll(params).then(res=>{
        this.form= res
        // if(null ==this.receiver.deviceConfig ){
        //     this.receiver.deviceConfig=this.form
        // }
      })
    }else{
      if("111222"!=this.receiver.deviceConfig.id){
          this.form=this.receiver.deviceConfig
      }
      
    }

  },
  methods: {
      //发射通道使能选择
      clickTransmitChanelSelect(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
        }
        console.log(data)
        transmitChannelSelect(data).then(res=>{
          if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })
        
      },
      //设置helper 和 天线
      setHelperAnt(index,row){
        console.log(index,row)
        let data ={
          receiverId:this.receiver.id,
          helperId: row.id
        }
        console.log(data)
        helperAndAntSelcet(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })
      },
      //设置上行频率4
      setUplinkFour(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
          channel:"03",
          value:this.form.upLinkFrequencyFour
        }
        console.log(this.form.upLinkFrequencyOne)
        upLinkFrequencySelct(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })
      },
      //设置上行频率3
      setUplinkThree(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
          channel:"02",
          value:this.form.upLinkFrequencyThree
        }
        console.log(this.form.upLinkFrequencyOne)
        upLinkFrequencySelct(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })
      },
      //设置上行频率2
      setUplinkTwo(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
          channel:"01",
          value:this.form.upLinkFrequencyTwo
        }
        console.log(this.form.upLinkFrequencyOne)
        upLinkFrequencySelct(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })
      },
      //设置上行频率1
      setUplinkOne(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
          channel:"00",
          value:this.form.upLinkFrequencyOne
        }
        console.log(this.form.upLinkFrequencyOne)
        upLinkFrequencySelct(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })
      },
      //设置发射模式
      setTransmitModel(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
          value:this.form.receiverTransmitModelSelect
        }
        receiverTransmitModelSelect(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })
      },
      //设置发送功率值
      setPower(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
          value:this.form.power
        }
        helperTransmitPowerModify(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })
      },
      //设置blf值
      setBLF(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
          value:this.form.blf
        }
        BLFmodify(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })
      },
      //设置M值
      setM(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
          value:this.form.m
        }
        Mmodify(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })

      },
      //设置queryAdjust值
      setQueryAdjust(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
          value:this.form.queryAdjust
        }
        QueryAdjust(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })

      },
      //设置q值
      setQ(){
        let data ={
          receiverId:this.receiver.id,
          deviceConfigId: this.form.id,
          value:this.form.q
        }
        Qmodify(data).then(res=>{
             if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
        })

      },
    //q,m,blf等参数保存
      blfParamsSave(){
        let data={
          id:this.form.id,
          q : this.form.q,
          queryAdjust : this.form.queryAdjust,
          blf  : this.form.blf,
          power  : this.form.power,
          transmitModel  : this.form.transmitModel,
          readRfidMode  : this.form.readRfidMode,
          upLinkFrequencyOne  : this.form.upLinkFrequencyOne,
          upLinkFrequencyTwo  : this.form.upLinkFrequencyTwo,
          upLinkFrequencyThree  : this.form.upLinkFrequencyThree,
          upLinkFrequencyFour  : this.form.upLinkFrequencyFour
        }
        this.editConfig(data)
      },

      // 串口连接接口
      connectSerial(){
        let data={
          receiverId : this.receiver.id,
          serialPort : this.form.serialPort,
          baudrate  : this.form.boudRate
        
        }
        connectSerial(data).then(res=>{
          console.log(res)
          if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            this.serialStatus =true
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
         
        })
      },
      // 断开串口连接接口
      disconnectSerail(){
        let data={
          receiverId : this.receiver.id,
          serialPort : this.form.serialPort,
        }
        disconnectSerial(data).then(res=>{
          // console.log(res)
          if(res.data.success){
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2500
            })
            
          }else{
              this.$notify({
              title: res.data.message,
              type: 'error',
              duration: 2500
            })
          }
          this.serialStatus =false
        })
      },
      // 更改读写器的关联的配置字段
      updateTagDeviceCofig(){
        // console.log(JSON.stringify(this.receiver.deviceConfig))
          // this.receiver.deviceConfig = this.form;
          editConfig(this.receiver)(res=>{
            console.log('succes')
          })
      },

      saveConfig(data){
          this.$set(data,'deviceId',this.receiver.id)
          add(data).then(res=>{
            this.receiver.deviceConfig=res
            this.form = res;
            // console.log(JSON.stringify(res))
            this.updateTagDeviceCofig()
            this.$notify({
              title: '保存成功',
              type: 'success',
              duration: 2500
            })
          }).catch(err=>{
              console.log(JSON.stringify(err))
          })
      },
      editConfig(data){
          edit(data).then(res=>{
            this.$notify({
              title: '保存成功',
              type: 'success',
              duration: 2500
            })
          }).catch(err=>{
              console.log(err.response.data.message)
          })
      },


      serialSave(){
        console.log(this.form.serialPort)
          

        let data={
          serialPort : this.form.serialPort,
          boudRate  : this.form.boudRate,
          id: this.form.id
        }
        console.log(JSON.stringify(data))
        if(this.form.id==null){
         this.saveConfig(data)   
        }else{
           this.editConfig(data) 
        }
      },

    // getHelper(){
    //      let params={}
    //      params["parent_id"]=this.receiverId
    //      getHelperDevices(params).then(res=>{
    //         this.tableData=res.content
    //     })
    // },
    checkboxChange(helperIndex,antIndex){
      let status= this.receiver.helperDevices[helperIndex].devices[antIndex].status;
      console.log(status)
      if(status==2){
        this.receiver.helperDevices[helperIndex].devices[antIndex].status=1;
        
      }else{
        this.receiver.helperDevices[helperIndex].devices[antIndex].status=2;
      }
     
      
      antStautsChange(this.receiver.helperDevices[helperIndex].devices[antIndex] ).then(res=>{
           this.notify('保存成功', 'success')
      }).catch(err => {
          console.log(err.response.data.message)
        })
    }
  }
}
</script>

<style scoped>

</style>
