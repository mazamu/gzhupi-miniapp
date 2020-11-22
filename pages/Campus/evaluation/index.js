const Page = require('../../../utils/sdk/ald-stat.js').Page;
var utils = require("../../../utils/date.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    pageSize: 20, //每页数量
    page: 1, //页数
    loadDone: false, //加载完毕,控制底部木有更多
    queryStr: "", //搜索的字符串
    dataSet: [],
    defaultType: "$in.通识类选修课程,专业选修课程" //默认显示的课程类型
  },
  todetail(e){
    var index=e.currentTarget.dataset.index;
    console.log(index)
    var course_id=this.data.dataSet[index].course_id
    var teacher_id=this.data.dataSet[index].teacher_id
    if(course_id&&teacher_id)
    {
      wx.navigateTo({
        url: '/pages/Campus/evaluation/detail?course_id='+course_id+'&teacher_id='+teacher_id+'&from='+'from_index',
      })
    }
  },
  search() {
    if (this.data.queryStr == "") {
      wx.showToast({
        title: '请输入关键字！',
        icon: 'none'
      })
    } else {
      this.setData({
        page: 1, //恢复页数
        loadDone: true, //加载完毕
        dataSet: [],
        loading: true
      })
    }
    this.getTopics()
  },

  // 读取搜索内容
  searchInput: function (e) {
    this.data.queryStr = e.detail.value
  },
  fake() {
    let mode = wx.$param["mode"]
    this.setData({
      mode: mode
    })
    if (mode == "prod") {
      return false
    } else return true
  },
  // 获取列表
  getTopics(loadMore = false) {

    let query = {
      _page: this.data.page,
      _page_size: this.data.pageSize,
      // _order: "-order_time",
      course_type: this.data.defaultType
    }
    query = wx.$objectToQuery(query)

    let url = wx.$param.server["prest"] + wx.$param.server["scheme"] + "/v_teach_evaluation" + query

    if (this.data.queryStr != "") {
      url = wx.$param.server["prest"] + "/_QUERIES/teach_evaluation/v_teach_evaluation_search?match=" + this.data.queryStr
    }

    wx.$ajax({
        url: url,
        method: "get",
      })
      .then(res => {
        console.log("主题列表", res)
        // 格式化时间
        for (let i = 0; i < res.data.length; i++) {
          let time = new Date(res.data[i].updated_at)
          res.data[i].updated_at = utils.relativeTime(time.getTime() / 1000)
        }
        if (loadMore) {
          this.data.dataSet = this.data.dataSet.concat(res.data)
        } else {
          this.data.dataSet = res.data
        }
        this.setData({
          dataSet: this.data.dataSet,
          loading: false,
          loadDone: res.data.length < this.data.pageSize ? true : false //加载完毕
        })

      }).catch(err => {
        console.log(err)
        this.setData({
          loading: false
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    setTimeout(() => {
      that.setData({
        loading: false
      })
    }, 1000);
    if (this.fake()) return
    this.getTopics()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1, //恢复页数
      loadDone: false, //加载完毕
      queryStr: ""
    })
    this.getTopics()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 3000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loadDone) return
    console.log('加载更多')
    this.data.page = this.data.page + 1
    this.getTopics(true)
  }
})