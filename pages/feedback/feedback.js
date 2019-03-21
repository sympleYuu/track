// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagetitle:'建议反馈'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '建议反馈',
    })
  },
  formsubmit:function(e){
    console.log(e);
    var content = e.detail.value.content;
    var tell = e.detail.value.tell;
    if(content!=""){
      var token = wx.getStorageSync('token');
      var that = this;
      wx.request({ //
        url: "https://track.huiur.com/api/advice",
        data: {
          phone: tell,
          text: content
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        success: function (res) {
          console.log(res);
          if (res.statusCode==200){

            wx.showToast({
              title: '提交成功！',
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },1000)
            
          }

        }
      })
    }else{
      wx.showToast({
        title: '请输入内容',
        icon:'none'
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