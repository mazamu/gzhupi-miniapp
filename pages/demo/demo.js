// import formatTime from '../../utils/util.js'
var util = require('../../utils/util.js');
Page({

  data: {},

  onLoad: function(options) {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          info: res,
          capsule: res.statusBarHeight + 40
        })
      },
    })

    wx.setTabBarBadge({
      index: 0,
      text: '1',
    })
  },

  onPullDownRefresh: function() {
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 1500)
  },
  // 监听页面滑动
  onPageScroll: function(e) {
    let top = Math.round(e.scrollTop)

    // console.log(top - this.data.top)

    if (top <= 100) {
      this.setData({
        opacity: top * 0.02
      })
    } else if (top > 100 && top <= 200) {
      this.setData({
        opacity: 1
      })
    }

  },

  // start(e) {
  //   this.setData({
  //     pageY: e.changedTouches[0].pageY
  //   })
  // },
  // end(e) {
  //   let pageY = e.changedTouches[0].pageY
  //   if (this.data.pageY - pageY >= 0) {
  //     wx.hideTabBar({
  //       animation: true
  //     })
  //   } else {
  //     wx.showTabBar({
  //       animation: true
  //     })
  //   }
  //   console.log(pageY - this.data.pageY)
  // },
  // tap() {
  //   wx.hideTabBar({
  //     animation: true
  //   })
  //   setTimeout(function() {
  //     wx.showTabBar({
  //       animation: true
  //     })
  //   }, 2000)
  // },

  onReady: function() {
    console.log(util.formatTime(new Date()))
  },

  onShow: function() {},

  onHide: function() {},

  onUnload: function() {},

  onReachBottom: function() {},

  onShareAppMessage: function() {},


tap(){
  wx.navigateTo({
    url: '/pages/new',
  })
}
})