// pages/routebook/routebook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btab:4,
    slideshow:false,
    barname:[,,,],
    searchdata:{
      title: '',
      placeid: '',
      daysid: '',
      themsid: '',
      money: '',
      noneroute:true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '路线定制'
    })
    var that = this;
    wx.request({
      url: "https://store.huiur.com/roadclass",
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      // data: { user_id: user_id },
      success: function (res) {
        console.log(res);
        var optionsarr = res.data;
        that.setData({
          optionsarr: optionsarr
        })
      }
    })
    wx.request({
      url: "https://store.huiur.com/road",
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      // data: { user_id: user_id },
      success: function (res) {
        console.log(res);
        var routearr = res.data;
        that.setData({
          routearr: routearr
        })
      }
    })
  },
  optiontap:function(e){ //筛选点击
    var that = this;
    var btab = e.currentTarget.dataset.btab;
    var flat = btab==0?true:false;
    var optionsarr = this.data.optionsarr;
    var option0 = optionsarr[btab].in;
    var arr0 = [];
    for (let i = 0; i < option0.length;i++){
      arr0.push({
        name: option0[i].name,
        id: option0[i].id,
        key: option0[i].key,
        val: option0[i].val,
        idx: btab,
      })
    }
    arr0.unshift({
      name: '不限',
      id: false,
      key: false,
      val: false,
      idx: btab,
    })
    console.log(arr0);
    
    if (btab==this.data.btab){
      this.setData({
        btab: 4,
        slideshow: false,
        
      })
    }else{
      this.setData({
        btab: btab,
        slideshow: true,
        flat: flat,
        slidearr: arr0,
      })
    }
    

  },
  slidetab:function(e){ //选择筛选条件
    var oid = parseInt(e.currentTarget.id);
    var okey = e.currentTarget.dataset.key;
    var oval = e.currentTarget.dataset.val;
    var idx = e.currentTarget.dataset.idx;
    var optionsarr = this.data.optionsarr;
    var oname = e.currentTarget.dataset.name;
    var sdata = this.data.searchdata;
    var that = this;
    console.log(okey);
    
    if (okey==null){ //拥有二级条件
     
        var earr = optionsarr[idx].in;
        var eidx = earr.findIndex(item => item.id === oid);
        console.log(eidx);
        var arr1 = [];
        for (let i = 0; i < earr[eidx].in.length; i++) {
          arr1.push({
            name: earr[eidx].in[i].name,
            id: earr[eidx].in[i].id,
            key: earr[eidx].in[i].key,
            val: earr[eidx].in[i].val,
            idx: idx,
          })
        }
        console.log(arr1);
        this.setData({
          slidearr2: arr1
        })
      
      
    }else{ //basic layer
      console.log('二层数据');
      switch (okey) {
        case 'placeid':
          sdata.placeid = oval;
          break;
        case 'daysid':
          sdata.daysid = oval;
          break;
        case 'themsid':
          sdata.themsid = oval;
          break;
        case 'money':
          sdata.money = oval;
          break;
        default:
          console.log('筛选条件异常')
      }
      console.log(sdata);
      
      
      var barname = this.data.barname;
      console.log(oname);
      console.log(idx);
      if(idx===false){ //不限，清除选择  
        barname[0] = '不限';
      }else{
        idx = parseInt(idx);
        barname[idx] = oname;
        console.log(barname);
        if(okey===false){
          switch (idx) {
            case 0:
              sdata.placeid = '';
              break;
            case 1:
              sdata.daysid = '';
              break;
            case 2:
              sdata.themsid = '';
              break;
            case 3:
              sdata.money = '';
              break;
            default:
              console.log('筛选条件异常')
          }
        }
        
      }
      that.setData({
        searchdata: sdata,
      })
      that.goSearch();
      this.setData({
        barname: barname,
        slideshow: false,
        btab: 4,
      })
    }
  },
  formSubmit:function(e){
    console.log(e);
    var keywords = e.detail.value.words;
    var sdata = this.data.searchdata;
    sdata.title = keywords;
    this.setData({
      searchdata:sdata,
    })
    this.goSearch();
  },
  goSearch:function(){
    var that = this;
    var sdata = that.data.searchdata;
    wx.request({
      url: "https://store.huiur.com/road",
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        title: sdata.title,
        placeid: sdata.placeid,
        daysid: sdata.daysid,
        themsid: sdata.themsid,
        money: sdata.money,
      },
      success: function (res) {
        console.log(res);
        var routearr = res.data;
        that.setData({
          routearr: routearr
        })
      }
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

  }
})