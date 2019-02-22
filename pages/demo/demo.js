var test = 123

var app = getApp()
var util = require('../../utils/utils.js');
Page({

  data: {
    dataSet: [
      {
        id: '5b61575a4256350d332d03a1',
        title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit,',
        content:
          'Lorem ipsum dolor sit amet, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        time: 1533106010,
        user: {
          avatar: 'https://cdn.ifanr.cn/ifanr/default_avatar.png',
          userId: 123123123,
          username: 'Lorem ipsum dolor sit am'
        },
        likedCount: 122,
        liked: true,
        images: [
          'https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg',
          'https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg'
        ]
      },
      {
        id: '123123123',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        time: 1533106010,
        user: { avatar: 'https://cdn.ifanr.cn/ifanr/default_avatar.png', userId: 123123123, username: '知晓妹' },
        likedCount: 0,
        liked: true
      },
      {
        id: '5b61575a4256weqwe350d332d03a1',
        content:
          'Lorem ipsum dolor sit amet,  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        time: 1533106010,
        user: { avatar: 'https://cdn.ifanr.cn/ifanr/default_avatar.png', userId: 123123123, username: '知晓妹' },
        backgroundColor: '#AF7AC5',
        likedCount: 0
      },
      {
        id: '5b61575a42dasda56350d332d03a1',
        content: '爱范儿，让未来触手可及。',
        time: 1533106010,
        user: { avatar: 'https://cdn.ifanr.cn/ifanr/default_avatar.png', userId: 123123123, username: '知晓妹' },
        backgroundColor: '#AF7AC5',
        likedCount: 0
      },
      {
        id: '5b61575weweqa4256350d332d03a1',
        content: '爱范儿，让未来触手可及。',
        time: 1533106010,
        user: { avatar: 'https://cdn.ifanr.cn/ifanr/default_avatar.png', userId: 123123123, username: '知晓妹' },
        backgroundColor: '#AF7AC5',
        likedCount: 0,
        images: ['https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg']
      }
    ],
  },

  onLoad: function(options) {
   
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

  userInfoHandler() {
    wx.getUserInfo({
      success: res => {
        console.log(res)
      }
    })
  },
  nav0() {
    wx.navigateTo({
      url: '/pages/Campus/grade/grade',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onReady: function() {
    console.log(util.formatTime(new Date()))
  },

  nav() {

    wx.reLaunch({
      url: '/pages/demo/demo',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onShow(){
    console.log(test)
    test++
  }
})