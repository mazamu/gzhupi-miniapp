var utils = require("../../../../../utils/utils.js")
Component({

  properties: {
    show: {
      type: Boolean,
      value: false
    },
  },

  data: {
    hideTimeLine: true,
    showDetail: false,
    current: 1,
    dis: "none",
    today: new Date().getDate(), //日期
    week: utils.getSchoolWeek(), //周数
    schoolWeek: utils.getSchoolWeek(), //校历周
    weekDate: utils.setWeekDate(), //一周日期

    weekDays: ['一', '二', '三', '四', '五', '六', '日'],
    timeLine: ["08:30-09:15", "09:20-10:05", "10:25-11:10", "11:15-12:00", "13:50-14:35", "14:40-15:25", "15:45-16:30", "16:35-17:20", "18:20-19:05", "19:10-19:55", "20:00-20:45"],
    colors: ["#86b0fe", "#71eb55", "#f7c156", "#76e9eb", "#ff9dd8", "#80f8e6", "#eaa5f7", "#86b3a5", "#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#29ab97", "#61BC69", "#12AEF3", "#E29AAD", "#AFD7A4", "#F1BBB9", "#A0A8AE", "#AD918C"],
    kbList: [{
        "color": 0,
        "weekday": 1,
        "start": 1,
        "last": 3,
        "weeks": "1-16周",
        "course_name": "↖点击左上方周数回到校历本周"
      },
      {
        "color": 8,
        "weekday": 1,
        "start": 1,
        "last": 3,
        "weeks": "1-16周",
        "course_name": "↖点击左上方周数回到校历本周"
      },
      {
        "color": 11,
        "weekday": 1,
        "start": 5,
        "last": 3,
        "weeks": "1-16周",
        "course_name": "←点击侧边栏查看课程时间轴←"
      },
      {
        "color": 2,
        "weekday": 3,
        "start": 1,
        "last": 2,
        "weeks": "1-16周",
        "course_name": "↑点击星期栏添加课程↑"
      },
      {
        "color": 7,
        "weekday": 4,
        "start": 4,
        "last": 3,
        "weeks": "1-16周",
        "course_name": "有问题记得联系开发者！",
      },
      {
        "color": 9,
        "weekday": 6,
        "start": 3,
        "last": 2,
        "weeks": "1-16周",
        "course_name": "点击图标查看更多",
      },
      {
        "color": 10,
        "weekday": 3,
        "start": 8,
        "last": 4,
        "weeks": "1-16周",
        "course_name": "觉得好用的话，请分享喔！",
        "class_place": "点击小飞机图标"
      },
      {
        "color": 3,
        "weekday": 2,
        "start": 3,
        "last": 3,
        "weeks": "1-16周",
        "course_name": "←左右滑动切换周数 →",
        "class_place": ""
      },
      {
        "color": 4,
        "weekday": 5,
        "start": 5,
        "last": 3,
        "weeks": "1-16周",
        "course_name": "点击图标切换模式",
        "class_place": ""
      },
    ],
  },

  methods: {
    // 恢复校历周
    resetWeek() {
      let week = utils.getSchoolWeek()
      this.setData({
        week: week
      })
      wx.showToast({
        title: "校历 " + String(week) + " 周",
        icon: "none",
        duration: 1000
      })
    },
    // 左右滑动切换周数
    switchWeek(e) {
      let value = e.detail.current - this.data.current
      let week
      if (value == 1 || value == -2) {
        // 下一周
        if (this.data.week + 1 > 20) {
          week = 0
        } else if (this.data.week < 0) {
          week = 1
        } else {
          week = this.data.week + 1
        }
      } else {
        // 上一周
        if (this.data.week - 1 < 0) {
          week = 20
        } else {
          week = this.data.week - 1
        }
      }
      this.setData({
        weekDate: utils.setWeekDate(week - this.data.schoolWeek),
        week: week,
        current: e.detail.current,
      })
      wx.showToast({
        title: "第 " + String(week) + " 周",
        icon: "none",
        duration: 1000
      })
    },
    // 展开时间轴
    tapSlideBar() {
      this.setData({
        hideTimeLine: !this.data.hideTimeLine,
      })
    },

    // 课程详情弹窗
    showDetail(e) {
      let id = Number(e.currentTarget.id)
      this.data.openTarget = id
      let day = this.data.kbList[id].weekday
      let start = this.data.kbList[id].start
      let detail = []
      // 遍历课表，找出星期和开始节相同的课程
      this.data.kbList.forEach(function(item) {
        if (item.weekday == day && item.start == start) {
          detail.push(item)
        }
      })
      this.setData({
        detail: detail,
        showDetail: true,
        currentIndex: 0 //恢复滑动视图索引
      })
    },

    // 关闭课程详情弹窗
    cancelModal() {
      this.setData({
        showDetail: false,
      })
    },

    // 编辑课表
    navTo(e) {
      switch (e.currentTarget.id) {
        case "0": //编辑
          wx.navigateTo({
            url: '/pages/Campus/home/addCourse/addCourse',
          })
          break
        case "1": //添加
          wx.navigateTo({
            url: '/pages/Campus/home/addCourse/addCourse',
          })
          break
        case "2": //删除
          this.deleteCourse()
          break
      }
    },

    // 删除课程
    deleteCourse() {
      let that = this
      let id = this.data.openTarget
      let obj = wx.getStorageSync('course')
      obj.course_list.splice(id, 1)
      wx.showModal({
        title: '提醒',
        content: '是否删除当前课程?',
        success: function(e) {
          if (e.confirm) {
            wx.setStorage({
              key: 'course',
              data: obj,
              success: function() {
                that.setData({
                  kbList: obj.course_list,
                  showDetail: false,
                })
              }
            })
          }
        }
      })
    },
  },

  lifetimes: {
    created: function() {},

    attached: function() {
      if (wx.getStorageSync('course') != "") {
        this.setData({
          kbList: wx.getStorageSync('course').course_list,
          sjkList: wx.getStorageSync('course').sjk_course_list
        })
      }
    },

    ready: function() {

    }
  },


})