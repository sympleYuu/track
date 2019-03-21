// pages/intform/intform.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '北京',
    gotime01: '最早出发时间',
    gotime02: '最晚出发时间',
    starttime02: '',
    num: 1,
    tips: '请选择出发时间',
    pagetitle: '意向单'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '意向单',
    })
    var date = new Date();
    var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);

    var today = date.getFullYear() + '-' + month + '-' + date.getDate();
    console.log(today);
    this.setData({
      today: today,
      starttime02: today,
    })
  },
  suretap: function () {
    this.setData({
      tipsshow: false,
    })
  },
  bindPickerChange: function (e) {
    console.log(e);
    var city = e.detail.value[0] + " " + e.detail.value[1];
    console.log(city);
    this.setData({
      city: city
    })
  },
  timechange01: function (e) { // 最早出发时间
    console.log(e);
    var time01 = e.detail.value;
    this.setData({
      gotime01: time01,
      starttime02: time01
    })
  },
  timechange02: function (e) { //最晚出发时间
    console.log(e);
    var time02 = e.detail.value;
    this.setData({
      gotime02: time02,
      starttime02: time02
    })
  },
  formsubmit: function (e) {
    console.log(e);
    var money = e.detail.value.money;
    var people = e.detail.value.people;
    var tell = e.detail.value.tell;
    var destination = e.detail.value.destination;
    var des = e.detail.value.des ? e.detail.value.des:'';
    var time01 = this.data.gotime01;
    var time02 = this.data.gotime02;
    var timeall = time01+','+time02;
    if (time01 != '最早出发时间' && time02 != '最晚出发时间') {
      if (money == '') {
        console.log('未填写预算')
        this.setData({
          tips: '请填写预算',
          tipsshow: true
        })
      } else if (people == '') {
        console.log('未填写联系人')
        this.setData({
          tips: '请填写联系人',
          tipsshow: true
        })
      } else if (tell == '') {
        console.log('未填写联系方式')
        this.setData({
          tips: '请填写联系方式',
          tipsshow: true
        })
      } else if (destination == '') {
        console.log('未填写目的地')
        this.setData({
          tips: '请填写目的地',
          tipsshow: true
        })
      }else {
        console.log('填写完毕')
        var city = this.data.city;
        var num = this.data.num;
        var that = this;
        var token = wx.getStorageSync('token');
        wx.request({ //
          url: "https://track.huiur.com/api/wish",
          data: {
            start: city,
            starttime: timeall,
            nums: num,
            price:money,
            name: people,
            phone:tell,
            des:des,
            destination: destination
          },
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          success: function (res) {
            console.log(res);
            if (res.statusCode == 200) {
              wx.showToast({
                title: '提交成功!',
              })
              setTimeout(
                function aa() {
                  // wx.navigateBack({
                  //   delta: 1,
                  // })
                  wx.showModal({
                    title: '我们已收到您的意向',
                    content: '将尽快与您联系',
                    success(res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1,
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }, 1000
              )
            }
          }
        })
      }
    } else {
      this.setData({
        tips: '请选择出发时间',
        tipsshow: true
      })

    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  addnum: function () { //人数加一
    var num = this.data.num;
    num += 1;
    this.setData({
      num: num
    })
  },
  minusnum: function () {
    var num = this.data.num;
    num -= 1;
    this.setData({
      num: num
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/count",
      data: {
        pages: '定制意向',
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {

      }
    })
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

  }
})