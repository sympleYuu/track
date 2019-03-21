// pages/footshow/footshow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    capnum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    thumped:false,
    pagetitle:'懒游星球'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    
    var fid = options.id;
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      footid:fid,
      
    })
    if(token){
      wx.request({ //
        url: "https://track.huiur.com/api/points",
        data: {
          trackid: fid
        },
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          var footarr = res.data;
          var like = footarr[0].like;
          var thumped = false;
          if(like=='1'){
            thumped = true;
          }else{
            thumped = false;
          }
          wx.setNavigationBarTitle({
            title: footarr[0].track.title,
          })
          that.setData({
            footarr: footarr,
            title: footarr[0].track.title,
            cover: footarr[0].track.banner,
            thumped: thumped,
            pagetitle: footarr[0].track.title,
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '../login/login?link=2' + '&fid=' + fid,
      })
    }
    
  },
  jumpindex: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  thumptap:function(){ //点赞
    var that = this;
    var token = wx.getStorageSync('token');
    var fid = this.data.footid;
    var thumped = this.data.thumped;
    if (thumped==true){
      wx.request({ //
        url: "https://track.huiur.com/api/like/" + fid,
        data: {
          status: 0
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          if (res.statusCode == 200) {
            that.setData({
              thumped: false,
            })
          }
        }
      })
    }else{
      wx.request({ //
        url: "https://track.huiur.com/api/like/" + fid,
        data: {
          status: 1
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          if (res.statusCode == 200) {
            that.setData({
              thumped: true,
            })
          }
        }
      })
    }
    
  },
  previewimgs:function(e){
    var now = 'https://track.huiur.com' + e.currentTarget.dataset.img;
    var arr = e.currentTarget.dataset.arr;
    var newarr = [];
    for(let i = 0;i<arr.length;i++){
      newarr.push(
        'https://track.huiur.com' + arr[i]
      )
    }
    wx.previewImage({
      current: now, // 当前显示图片的http链接
      urls: newarr // 需要预览的图片http链接列表
    })
  },
  jumpposter:function(){ //跳转到海报页
    wx.navigateTo({
      url: '../poster/poster?id='+this.data.footid,
    })
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
  onShareAppMessage: function (res) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //
      url: "https://track.huiur.com/api/share",
      data: {
        trackid: that.data.footid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
      }
    })
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.title,
      imageUrl: 'https://track.huiur.com/'+that.data.cover,
      path: '/pages/footshow/footshow?id='+that.data.footid,
    }
  }
})