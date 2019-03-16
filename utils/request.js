
/*
 * 统一代账户POST数据请求
 * 
 * @username: 用户名
 * @password: 密码
 * @type: 请求API类型
 * @account_key: 存储的账户类型
 * 
 * return 回调函数，返回请求结果
 */
var url = "https://1171058535813521.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/GZHU-API/Spider/"
function sync(username, password, type, account_key="account") {
  wx.showLoading({
    title: '加载中...',
  })
  let account = {
    "username": username,
    "password": password
  }
  return new Promise(function(callback) {
    wx.request({
      url: url + type,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: account,

      success: function(res) {
        if (res.statusCode != 200) {
          wx.showToast({
            title: "请求超时",
            icon: "none"
          })
          return
        }
        if (res.data.statusCode != 200) {
          wx.showToast({
            title: "账号或密码错误",
            icon: "none"
          })
          return
        }
        // 缓存账户信息
        wx.setStorage({
          key: account_key,
          data: account,
        })
        // 缓存结果数据
        wx.setStorage({
          key: type,
          data: res.data.data,
        })
      },

      fail: function(err) {
        wx.showToast({
          title: "服务器响应错误",
          icon: "none"
        })
      },

      complete: function(res) {
        wx.hideLoading()
        callback(res)
      }
    })
  });
}





module.exports = {
  sync: sync
}