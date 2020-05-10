const websockets = {
  state: {
    websocketStompClient: undefined, // websocket实例
    websocketData: {
      MEMBER: ''
    }
  },
  actions: {
    SendWebsocketData({ commit }, message) {
      // 拆分参数
      let cmd = message.cmd
      let errMsg = message.errMsg
      let data = message.data
      console.log('---cmd===' + cmd)
      switch (cmd) {
        // receiver 数据
        case 'member':
          commit('MEMBER', { cmd: 'member', data })
          break
        default:
          console.log('Unrecognized commands')
          break
      }
    }
  },
  mutations: {
    // 客户信息存储到store
    MEMBER: (state, websocketData) => {
      state.websocketData.MEMBER = websocketData.data
    }
  }
}

export default websockets
