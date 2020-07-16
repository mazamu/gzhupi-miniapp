const Page = require('../../../utils/sdk/ald-stat.js').Page;
let interstitialAd = null

Page({

  data: {
    current: 0,
    rankType: "rate" // abs绝对排名，rate百分百相对排名
  },
  onLoad: function (options) {

    this.initAD()

    let account = wx.getStorageSync("account")
    if (account != "") {
      this.setData({
        account: account
      })
    }
    // let agree = wx.getStorageSync("agree")
    let agree = true
    if (agree != true) {
      wx.showModal({
        title: '未经授权',
        content: '请打开成绩查询页面授权用户协议',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/Campus/grade/grade',
            })
          } else if (res.cancel) {
            wx.reLaunch({
              url: '/pages/Campus/grade/grade',
            })
          }
        }
      })
    } else {
      this.setData({
        showAgree: true
      })
      this.syncData()
      // this.setData({
      //   rank: wx.getStorageSync("rank")
      // })
    }
  },

  initAD() {
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-237e68290f5143a2'
      })
      interstitialAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      interstitialAd.onError((err) => {
        console.log('onError event emit', err)
      })
      interstitialAd.onClose((res) => {
        console.log('onClose event emit', res)
      })
    }
  },

  insertAD() {
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  onShareAppMessage: function () {
    return {
      title: '成绩排名统计',
      desc: '',
      // path: '路径',
      imageUrl: "https://cos.ifeel.vip/gzhu-pi/images/pic/rank.png",
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: "none"
        });
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          icon: "none"
        })
      }
    }
  },

  onShow: function () {
    if (wx.getStorageSync("account") == "") {
      wx.showToast({
        title: '请绑定学号',
        icon: "none",
        duration: 1500
      })
      wx.reLaunch({
        url: '/pages/Setting/login/bindStudent',
      })
    }

    let that = this
    setTimeout(function () {
      that.insertAD()
    }, 1500)
    
  },

  switch (e) {
    this.setData({
      current: Number(e.target.id),
      rankType: Number(e.target.id) == 0 ? "rate" : "abs"
    })
  },

  syncData() {
    if (!wx.getStorageSync("account")) return
    wx.$ajax({
        url: wx.$param.server["prest"] + "/jwxt/rank",
        method: "get",
        data: this.data.account,
        loading: "更新排名..."
      })
      .then(res => {
        this.setData({
          rank: res.data,
        })
      })
  }

})