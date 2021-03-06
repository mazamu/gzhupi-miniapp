const App = require('./utils/sdk/ald-stat.js').App;
var Config = require("/utils/config.js")
var startTime = Date.now(); //启动时间
require("/utils/wx.js")

App({

  globalData: {
    isAuthorized: false, //微信授权
    bindStatus: false //学号绑定
  },

  onLaunch: async function (options) {
    console.log("App启动：", options)
    let that = this

    wx.cloud.init()
    Config.init() //初始化配置文件
    wx.$update() //更新小程序
    this.initBaaS()

    this.getAuthStatus()

    wx.getNetworkType({
      success(res) {
        if (res.networkType == "none") {
          wx.showToast({
            title: '无网络',
            icon: 'none'
          })
          return
        }
        // 1077使用本地配置
        if (options.scene != 1077) {
          wx.$syncParam()
        }
        that.syncAuth()
      }
    })

  },

  onError: function (res) {
    wx.BaaS.ErrorTracker.track(res)
    this.aldstat.sendEvent('小程序启动错误', res)
  },

  onShow: async function (options) {
    this.aldstat.sendEvent('小程序启动时长', {
      time: Date.now() - startTime
    })
    if (wx.BaaS){
      wx.BaaS.reportTemplateMsgAnalytics(options)
    }
  },

  // 初始化知晓云
  initBaaS() {
    wx.BaaS = requirePlugin('sdkPlugin')
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)
    let ClientID = 'd5add948fe00fbdd6cdf'
    wx.BaaS.init(ClientID, {
      autoLogin: true
    })
    wx.BaaS.ErrorTracker.enable()
  },


  // 获取认证状态
  getAuthStatus() {
    let that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权微信", res)
          this.globalData.isAuthorized = true
          wx.checkSession({
            success() {
              // session_key 未过期，并且在本生命周期一直有效
            },
            fail() {
              // session_key 已经失效，需要重新执行登录流程
              wx.login() // 重新登录
            }
          })
        }
      },
      // 检测授权状态后 检测绑定状态
      complete(res) {
        wx.getStorage({
          key: 'account',
          success: function (res) {
            console.log("已绑定学号", res.data)
            that.globalData.bindStatus = true
            that.globalData.account = res.data
          },
          fail: function (res) {}
        })
      }
    })
  },

  // 三天同步一次认证信息
  syncAuth() {
    let last_sync_auth = wx.getStorageSync('last_sync_auth')
    if (!last_sync_auth || new Date().getTime() - last_sync_auth >= 1000 * 3600 * 72) {
      wx.$authSync()
      wx.setStorageSync('last_sync_auth', new Date().getTime())
    }
  },

})