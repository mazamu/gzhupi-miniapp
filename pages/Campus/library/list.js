Page({

  data: {
    noCover: "cloud://gzhu-pi-f63be3.677a-gzhu-pi-f63be3/images/icon/book.svg",
    page: 1,
    pages: 1,
    books: []
  },

  onLoad: function(options) {
    this.getBooks(options.query)
    this.setData({
      query: options.query
    })
  },

  formSubmit(e) {
    let query = e.detail.value.query
    if (query == "") {
      wx.showToast({
        title: '请输入书名',
        icon: "none"
      })
      return
    }
    this.setData({
      query: query,
      books: [],
      page: 1
    })
    this.getBooks(query)
  },


  navToDetail(e) {
    let index = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/Campus/library/detail?index=' + index,
    })
  },

  loadMore() {
    let page = this.data.page + 1
    if (page > this.data.pages) {
      wx.showToast({
        title: '没有更多啦！',
        icon: "none"
      })
      return
    }
    this.getBooks(this.data.query, page)
  },

  // 发送GET请求
  getBooks(query, page = 1) {
    let that = this
    wx.showLoading({
      title: '...',
    })

    let url = "https://1171058535813521.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/GZHU-API/Spider/"
    wx.request({
      url: url + 'library/search?query=' + query + "&page=" + page,
      method: "get",
      success: function(res) {
        console.log(res.data.data)
        if (res.data.data.total == 0) {
          wx.showToast({
            title: '无结果',
            icon: "none"
          })
          return
        }
        that.setData({
          books: that.data.books.concat(res.data.data.books),
          pages: res.data.data.pages == 0 ? 1 : res.data.data.pages,
          page: page
        })
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },

})