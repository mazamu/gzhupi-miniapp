// pages/Life/oldthings/add.js
const request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    imgUrls: [], //上传后的图片地址
    labels: ['']
  },
  add: function () {

  },
  labelAdd: function () {

  },
  formSubmit: function (e) {
    var that = this
    for (var i in e.detail.value) {
      if (e.detail.value[i].length < 1) {
        wx.showToast({
          title: '信息不完整',
        })
      }
    }
    wx.showModal({
      title: '提示',
      content: '请检查后提交',
      success(res) {
        if (res.confirm) {
          that.uploadImg()
          let userinfo = {
            name: e.detail.value.name,
            phone: e.detail.value.phone,
            wechat: e.detail.value.wechat
          }
          let apple = {
            title: e.detail.value.title,
            content: e.detail.value.content,
            price: e.detail.value.price,
            info: userinfo,
            label: e.detail.value.label,
            image: that.data.imgUrls
          }
          console.log(apple)
          let table ='flea_market'
          let Product = new wx.BaaS.TableObject(table)
          let product = Product.create()
          product.set(apple).save().then(res => {
            // success
            wx.showToast({
              title: '发布成功',
            })
          }, err => {
            //err 为 HError 对象
          })
          wx.showToast({
            title: '发布成功',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  uploadImg: function () {
    var that = this
    for (var i in this.data.imgList) {
      console.log(this.data.imgList)
      that.uploadFile('flea_market', that.data.imgList[i]).then(res => {
        console.log(res)
        that.data.imgUrls.push(res.path)
      })
    }
  },
  uploadFile: function (categoryName, filePath) {
    // 上传文件
    let MyFile = new wx.BaaS.File()
    let metaData = {
      categoryName: categoryName
    }
    //返回上传文件后的信息
    return new Promise(function (callback) {
      let fileParams = {
        filePath: filePath
      }
      MyFile.upload(fileParams, metaData).then(res => {
        // console.log('上传成功', res)
        callback(res.data) //用callback返回数据
      }, err => {
        // HError 对象
      })
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });

  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张照片吗？',
      cancelText: '留着',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
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