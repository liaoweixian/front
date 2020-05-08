import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
//获取库门信息
import { getDoors } from "@/api/poc/Door"
//获取receiver信息
import { getTagDevices } from "@/api/poc/TagDevice"

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false,

    receiver:{},

    // helperDevices:[],
    tagDevices:[],
    doors:[],
    //看板数据
    dashboard:{}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    },

    set_receiver:(state,receiver)=>{
      state.receiver = receiver
    },

    SET_DOORS: (state, doors) => {
      state.doors = doors
    },
    SET_TAGDEVICES: (state, tagDevices) => {
      state.tagDevices = tagDevices
    },
    SET_DASHBOARD: (state, dashboard) => {
      state.dashboard = dashboard
    }
  },

  actions: {
    // 获取接收器数据
    getTagDevices({ commit },doors){
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
          commit('SET_TAGDEVICES', res.content)
        })
    },
    // getTagDevices({ commit },doors){
    //   return new Promise((resolve, reject) => {
    //     var doorIds=''
    //     for(var i=0;i<this.doors.length;i++){
    //       if(i != this.doors.length-1){
    //         doorIds += this.doors[i].id+","
    //       }else{
    //          doorIds += this.doors[i].id
    //       }
    //     }
    //     // console.info("++++"+doorIds)
    //     let data ={
    //       doorIds:doorIds
    //     }
    //     getTagDevices(data).then(res => {
    //       commit('SET_TAGDEVICES', res.content)
    //     })
    // })
    // },
    // 获取库门数据
    getDoorByUser({ commit },userID){
      return new Promise((resolve, reject) => {
        let data ={
          userId:userID
        }
        getDoors(data).then(res => {
          commit('SET_DOORS', res.content)
          console.info(JSON.stringify(res.content))
            //获取接收器数据
            // getTagDevices(commit ,res.content)
        })
    })
    },


    // 登录
    Login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
          setToken(res.token, rememberMe)
          commit('SET_TOKEN', res.token)
          setUserInfo(res.user, commit)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          logOut(commit)
          resolve()
        }).catch(error => {
          logOut(commit)
          reject(error)
        })
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
  removeToken()
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res)
}


export default user
