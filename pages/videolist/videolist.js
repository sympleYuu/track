// pages/videolist/videolist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isplay: false,
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = options.title;
    this.setData({
      pagetitle: title,
    })
    wx.setNavigationBarTitle({
      title: title,
    })
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      piazzaid: options.id,
    })
    wx.request({ //
      url: "https://track.huiur.com/api/piazzades",
      data: {
        piazzaid: options.id,
        pages: 1,
        limit: 3,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var datas = res.data;
        if (datas) {
          if (datas[0].video == '1') {
            for (let i = 0; i < datas.length; i++) {
              datas[i].isplay = false;
            }
            that.setData({
              videolist: datas,
              photoshow: false,
            })
          } else {

            that.setData({
              photolist: datas,
              photoshow: true,
            })
          }
        }


      }
    })
  },
  playvedtap: function (e) { //点击播放视频
    console.log(e);
    var vid = parseInt(e.currentTarget.id);
    var videolist = this.data.videolist;
    let currentIndex = videolist.findIndex(item => item.id === vid);
    var nowid = this.data.isplayid;
    let currentIndex2 = videolist.findIndex(item => item.id === nowid);
    console.log(nowid);
    if (nowid) {
      this.setData({
        ['videolist[' + currentIndex + '].isplay']: true,
        ['videolist[' + currentIndex2 + '].isplay']: false,
        isplayid: vid,
      })
    } else {
      this.setData({
        ['videolist[' + currentIndex + '].isplay']: true,
        isplayid: vid,
      })
    }

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
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/count",
      data: {
        pages: '看视频',
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
    var that = this;
    var token = wx.getStorageSync('token');
    var page = that.data.page + 1;
    if (that.data.photoshow == false) {
      wx.request({ //
        url: "https://track.huiur.com/api/piazzades",
        data: {
          piazzaid: that.data.piazzaid,
          pages: page,
          limit: 3,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          var datas = res.data;
          for (let i = 0; i < datas.length; i++) {
            datas[i].isplay = false;
          }
          var newarr = that.data.videolist.concat(datas);
          that.setData({
            videolist: newarr,
            page: page
          })

        }
      })
    }

  }
})