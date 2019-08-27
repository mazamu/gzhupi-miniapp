// pages/Life/oldthings/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: [{
      title: '物品名称',
      content: '在 D2 Crud 组件中传入 columns 和 data 对象数组，即可创建一个最基础的表格，columns 中的 key 需要与 data 中对象的key严格对照，可以在 columns 对象中传入 width 属性来控制列宽。当表格中的数据通过操作变化时，可以通过 this.$refs.d2Crud.d2CrudData 拿到变化后的表格数据。代码如下：',
      label: '标签',
      price: 14,
      icon: 'newsfill',
      image: 'https://image.weilanwl.com/img/square-1.jpg',
      info: {
        name: "tinsfox",
        wechat: "dfafa",
        phone: "214324r23"
      },
      updated_at: '2019-08-16',
      viewed:6,
      liked:3,
      comment:1,
    }],
    list:[],
    authorize: false
  },
  getData:function(){
    console.log("正在获取数据")
    let tableName = 'flea_market'
    let recordID = '5d55ac4f72d5f426018ed317'
    let Product = new wx.BaaS.TableObject(tableName)
    Product.get(recordID).then(res => {
      console.log(res.data)
      this.setData({
        list:res.data
      })
      // success
    }, err => {
      // err
    })
  },
  onTap(event) {
    this.setData({
      authorize: true
    })
    wx.showToast({
      title: '显示卖家信息',
    })
  },
  onIsOpen() {
    let isOpen = this.data.isOpen ? '' : 'ellipsis';
    this.setData({
      isOpen: isOpen,
    })
    if (isOpen) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    } else {
      wx.pageScrollTo({
        scrollTop: 300,
        duration: 300
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})