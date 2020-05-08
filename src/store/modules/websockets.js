const websockets = {
  state: {
    websocketStompClient: undefined, // websocket实例
    websocketData: {
      RECEIVER: '' ,// rfid 推送数据
      carPortIn: '', // 车辆靠台 数据
      warningRFID: '' // Rfid 数据错误警告 数据
    }
  },
  actions: {
    SaveWebsocketObject({commit}, info) {
      commit('SET_WEBSOCKETOBJECT', info);
    },
    SendWebsocketData({commit}, message) {
      // 拆分参数
      let cmd = message.cmd;
      let errMsg = message.errMsg;
      let data = message;
      console.log("---cmd==="+cmd);
      switch (cmd) {
        // receiver 数据
        case 'receiver':
          commit('SET_WEBSOCKETDATA', {cmd: 'receiver', data});
          break
        // 车辆靠台 数据
        case 'carPortIn':
          commit('SET_WEBSOCKETDATA', {cmd: 'carPortIn', data});
          break
        // Rfid 数据错误警告 数据
        case 'warningRFID':
          commit('SET_WEBSOCKETDATA', {cmd: 'warningRFID', data});
          break
     
        default:
          console.log('Unrecognized commands');
          break;
      }
    }
  },
  mutations: {
    SET_WEBSOCKETOBJECT: (state, websocketObject) => {
      state.websocketStompClient = websocketObject;
    },
    SET_WEBSOCKETDATA: (state, websocketData) => {
      switch (websocketData.cmd) {
        case 'receiver':
          state.websocketData.RECEIVER = websocketData.data
          break
        case 'carPortIn':
          state.websocketData.carPortIn = websocketData.data
          break
        case 'warningRFID':
          state.websocketData.warningRFID = websocketData.data
          break
       
        default:
          console.log('Unrecognized commands');
          break;
      }
    }
  }
}

export default websockets
