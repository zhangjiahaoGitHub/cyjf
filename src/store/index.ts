import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userCheck: true,
    show: true,
    version: 'CYJF-W-1.0.1', // 版本号
    agentNo: '2800001', // 代理机构号
    active: 0,
    token: [],
    password: '',
    imgArray: [],
    level: {},
    upgrade: {
      1: '升级银卡',
      2: '升级金卡'
    },
    userList: [],
    moneyLimit: {},
    openId: '',
    phone: false,
    real: 0,
    allSb: {},
    planItem: [],
    newem: 0,
    moAll: {}
  },
  mutations: {
    SET_USERCHECK (state, code) {
      state.userCheck = code
    },
    SET_AGENT (state, code) {
      state.agentNo = code
    },
    SET_TOKEN (state, token) {
      state.token = token
    },
    SET_IMG (state, imgArray) {
      state.imgArray = imgArray
    },
    Change_Password (state, code) {
      state.password = code
    },
    Change_Limit (state, code) {
      state.moneyLimit = code
    },
    SET_OPENID (state, code) {
      state.openId = code
    },
    IS_PHONE (state, code) {
      state.phone = code
    },
    SET_REAL (state, code) {
      state.real = code
    },
    SET_VERS (state, code) {
      state.version = code
    },
    SET_SB (state, code) {
      state.allSb = code
    },
    SET_PLAN (state, code) {
      state.planItem = code
    },
    SET_NEWEM (state, code) {
      state.newem = code
    },
    SET_MOALL (state, code) {
      state.moAll = code
    },
    SET_VIP (state, code) {
      state.level = code
    }
  },
  actions: {
    SetUserCheck ({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_USERCHECK', code)
      })
    },
    Set_Vip ({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_VIP', code)
      })
    },
    SetAgent ({ // 存token
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_AGENT', code)
      })
    },
    SetToken ({ // 存token
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', code)
      })
    },
    SetReal ({ // 存token
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_REAL', code)
      })
    },
    SetPassword ({ // 存密码
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('Change_Password', code)
      })
    },
    setMoney ({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('Change_Limit', code)
      })
    },
    setOpenid ({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_OPENID', code)
      })
    },
    setPhone ({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('IS_PHONE', code)
      })
    },
    setVers ({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_VERS', code)
      })
    },
    SetNewem ({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_NEWEM', code)
      })
    },
    SetMoall ({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_MOALL', code)
      })
    }
  },
  plugins: [createPersistedState({
    storage: window.localStorage
  })]

})
