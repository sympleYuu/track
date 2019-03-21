// pages/footexit/footexit.js
var app = getApp();
const qiniuUploader = require("../../utils/qiniuUploader");
function initQiniu1() {
  var options = {
    region: 'NCN', // 华北区
    uptokenURL: 'https://youyue.huiur.com/uptoken',
  };
  qiniuUploader.init(options);
}
function initQiniu2() {
  var options = {
    region: 'NCN', // 华北区
    uptokenURL: 'https://youyue.huiur.com/uptoken?type=1',
  };
  qiniuUploader.init(options);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeshow:true,
    winheight: '',
    listanimat:{},
    listhidden:false,
    myphoto:'',
    myname:'',
    coverarr:[],
    mainfocus:false,
    coverid:0,
    coverimg:'',
    pagetitle:'TA的足迹',
    footid:'',
    int:1,
    num:2,
    statithid:true,
    footarr:[],
    linkarr:[],
    linkhid:false,
    selectword:"",
    addexit:false,
    addtext:'点它开始添加你的足迹吧!',
    addwarn:false,
    picarr:[],
    positionwords:'',
    upinfor:[],
    titlebox:false,
    totalarr: [{
      dayid: 0,
      capnum: '一',
      staarr: [
        {
          staid: 0,
          capnum: '一',
          cutadd:0,
          spreadsta:0,
          striparr: [
            // {
            //   srpid: 0,
            //   c_pos: 1,
            // }
          ]
        }
      ]
    }],
    dayarr:[],
    stationarr:[],
    striparr:[],
    firstadd:true,
    thenadd:false,
    totallist:[[1,1],[1]],
    capnum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    surebtn1:true,
    fixbtn1:false,
    spreadsta:false,
    // srparea:true,
    contiques:false,
    cut_dayid: '',
    cut_staid: '',
    recall:false,
    areashow:true,
    headarr:{
      title:'',
      topimg_id:0
    },
    vedshow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    // wx.removeStorageSync('temid');
    wx.setNavigationBarTitle({
      title: '编辑你的足迹',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#0a0a0a',
    })
    // wx.removeStorageSync('date1');
    var temid = wx.getStorageSync('temid');
    console.log(temid);
    var date1 = wx.getStorageSync('date1');
    console.log(date1);
    if (date1){
      var date2 = new Date();
      console.log(date2);
      var date3 = date2.getTime() - date1;
      var days = date3 / (3600 * 1000);
      // var seconds = Math.round(date3 / 1000)
      console.log(days);
      if (days > 36) { //超过1.5天 不显示继续编辑弹窗
        wx.removeStorageSync('temid');
        wx.removeStorageSync('totalarr');
        wx.removeStorageSync('fixsrp');
        wx.removeStorageSync('headarr');
        wx.removeStorageSync('date1');

      }else{ //在1.5天以内
        console.log(temid);
        if (temid != "") {
          this.setData({
            contiques: true,
            areashow: false,
          })
        } else {
          console.log('重新编辑');
        }

      }
    }else{
      wx.removeStorageSync('temid');
      wx.removeStorageSync('totalarr');
      wx.removeStorageSync('fixsrp');
      wx.removeStorageSync('headarr');
    }
    
    
    wx.getSystemInfo({
      success: function (res) {
        var winWidth = res.windowWidth;
        var winHeight = res.windowHeight;
        that.setData({
          winheight: winHeight,
        })
      }
    });
    this.setData({
      mainfocus:true
    })
    wx.request({
      url: "https://youyue.huiur.com/updateimg", //加载头像、姓名、封面图
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        user_id: user_id
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        var topimgs = datas.top_img;
        // topimgs.pop();
        var name = app.limitwords(datas.user_nickname);
        that.setData({
          coverarr: topimgs,
          myphoto: datas.header,
          myname: name,
          coverimg: datas.top_img[0]
        })
      }
    })
    var totalarr = this.data.totalarr;
    var capnum = this.data.capnum;
    console.log(totalarr);
    // wx.setStorageSync('totalarr', totalarr);
  },
  fixsub:function(e){
    console.log(e);
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var srpid = e.currentTarget.dataset.srp - 1;
    var totalarr = this.data.totalarr;
    var thissrp = totalarr[dayid].staarr[staid].striparr[srpid];
    console.log(thissrp);
    wx.setStorageSync('fixsrp', thissrp);
    thissrp.keep = 0;
    thissrp.value = thissrp.title;
    this.setData({
      totalarr: totalarr
    })
    wx.setStorageSync('totalarr', totalarr);
  },
  textinput:function(e){ //textarea输入 占位文字符隐藏
    if(e.detail.value == ""){
      this.setData({
        placeshow:true,
        pagetitle:''
        // 喜欢并去贯彻，就是意义，一场我的旅行，在这里记录下来！
      })
    }else{
      this.setData({
        placeshow: false,
        pagetitle: e.detail.value,
      })
    }
  },
  positioninp:function(e){ //输入目的地---输入联想
    var value = e.detail.value;
    var that = this;
    var dayid = e.currentTarget.dataset.day; //当前第几天
    var staid = e.currentTarget.dataset.sta; //当前第几站
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var daylen = totalarr.length; //有几天
    console.log(dayid);
    var l_day = totalarr[dayid].staarr; //最后一天
    console.log(l_day);
    // var l_stalen = totalarr[daylen - 1].staarr.length;
    var l_sta = l_day[staid];
    console.log(l_sta);
    l_day[staid].linkhid = true;
    l_day[staid].position = value;
    console.log(totalarr);
    this.setData({
      totalarr: totalarr
    })
    if(value != ""){

      this.setData({
        addexit: true,
        addtext: '点它开始添加你的足迹吧!',
        addwarn: false
      })
    }else{
      this.setData({
        addexit: false,
        addtext: '请先填写地理位置',
        addwarn: true,
        listhidden:false,
        linkhid:false
      })
    }
    wx.setStorageSync('totalarr', totalarr);
    wx.request({
      url: "https://youyue.huiur.com/asscity", //输入联想
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        keywords: value
      },
      success: function (res) {
        var tips = res.data.tips;
        var i = 0;
        var arr = [];
        for(i=0;i<tips.length;i++){
          arr.push(tips[i].name);
        }
        that.setData({
          linkhid:true,
          linkarr:arr
        })
        console.log(tips.length);
        if(tips.length == 0){

          that.setData({
            linkhid: false,
          })
        }
      }
    })
  },
  
  positionblur:function(e){ //地址输入框失去焦点
    console.log(e);    
    if(e.detail.value != ""){
      this.setData({
        addexit:true,
        positionwords: e.detail.value
      })
    }else{
      this.setData({
        addexit: false
      })
    }
    var that = this;
    var title = this.data.pagetitle;
    var coverid = this.data.int;
    var user_id = wx.getStorageSync('user_id');
    that.setData({ //输入过 站名就不能撤回了
      recall:false
    })
    var tem = wx.getStorageSync('temid');
    console.log(tem);
    
    if (tem != "") { //已经获取过footid 修改
      console.log('3333');
    } else {
      console.log('请求接口')
      wx.request({
        url: "https://youyue.huiur.com/flayerfoottopcache", //提交tem、title
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          user_id: user_id,
          title: title,
          topimg_id: coverid-1,
        },
        success: function (res) {
          console.log(res);
          
          var temid = res.data.data.temfoot_id;
          wx.setStorageSync('temid', temid);
          var date1 = new Date();
          var dates = date1.getTime();
          console.log(dates);
          wx.setStorageSync('date1', dates);
          that.setData({
            footid: temid
          })
          console.log(wx.getStorageSync('date1'));
          //提交标题和模板之后成功获得footid后 再存入缓存 
          var headarr = that.data.headarr;
          headarr.title = title;
          headarr.topimg_id = coverid;
          console.log(headarr);
          wx.setStorageSync('headarr', headarr);
        }
      })
      
    }
  },
  fixtitle:function(e){
    console.log(e);
    var value = e.detail.value;
    var tem = wx.getStorageSync('temid');
    var headarr = wx.getStorageSync('headarr')
    if(tem != ""){ //获取过temid
      wx.request({
        url: "https://youyue.huiur.com/updateflayerfoottopcache", //修改封面图
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          temfoot_id: tem,
          title: value,
        },
        success: function (res) {
          console.log(res);
          headarr.title = value;
          wx.setStorageSync('headarr', headarr);
        }
      })
    }else{

    }
  },
  selectwords: function (e) { //选择输入联想的词语
    console.log(e);
    var words = e.currentTarget.dataset.name;
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var totalarr = this.data.totalarr;
    console.log(totalarr);    
    var daylen = totalarr.length; //有几天
    console.log(daylen);
    var l_day = totalarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var l_stalen = totalarr[daylen - 1].staarr.length;
    var l_sta = l_day[l_stalen - 1];
    console.log(l_sta);

    var t_sta = totalarr[dayid].staarr[staid];
    t_sta.linkhid = false;
    t_sta.position = words;
    
    this.setData({
      totalarr: totalarr,
      linkhid: false
    })
    console.log(totalarr);
    wx.setStorageSync('totalarr', totalarr);
  },
  linkmasktap:function(){ //点击蒙版 输入联想box关闭
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var daylen = totalarr.length; //有几天
    console.log(daylen);
    var l_day = totalarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var l_stalen = totalarr[daylen - 1].staarr.length;
    var l_sta = l_day[l_stalen - 1];
    console.log(l_sta);
    l_sta.linkhid = false;
    //关闭所有站的联想box蒙版
    var d = 0;
    for (d=0; d<daylen; d++){
      var s = 0;
      var slen = totalarr[d].staarr.length;
      for(s=0;s<slen;s++){
        totalarr[d].staarr[s].linkhid=false
      }
    }
    this.setData({
      totalarr: totalarr,
      linkhid: false
    })
    wx.setStorageSync('totalarr', totalarr);
  },
  addfoot:function(){ //添加足迹按钮
    
    // if (this.data.addexit){
    //   this.setData({
    //     listhidden: true,
    //     addtext:'点它开始添加你的足迹吧!',
    //     addwarn:false,
    //     vedshow:false,
    //   })
    //   var that = this;
    //   var temid = wx.getStorageSync('temid');
    //   var totalarr = this.data.totalarr;
    //   console.log(totalarr);
    //   var daylen = totalarr.length; //有几天
    //   console.log(daylen);
    //   var l_day = totalarr[daylen - 1].staarr; //最后一天
    //   console.log(l_day);
    //   var l_stalen = totalarr[daylen - 1].staarr.length;
    //   var l_sta = l_day[l_stalen - 1];
    //   console.log(l_sta);
    //   var position = l_sta.position;
    //   l_sta.disabled = true; //点击上传加号，不能修改站地址
    //   console.log(totalarr);
    //   that.setData({
    //     totalarr: totalarr
    //   })
    //   wx.setStorageSync('totalarr', totalarr);
    // }else{
    //   this.setData({
    //     addtext:'请先填写地理位置',
    //     addwarn:true
    //   })
    // }
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var daylen = totalarr.length; //有几天
    console.log(daylen);
    var l_day = totalarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var l_stalen = totalarr[daylen - 1].staarr.length;
    var l_sta = l_day[l_stalen - 1];
    console.log(l_sta);
    var that = this;
    if (l_sta.position){
      l_sta.disabled = true;
      that.setData({
        totalarr: totalarr
      })
      this.setData({
        listhidden: true,
        addtext:'点它开始添加你的足迹吧!',
        addwarn:false,
        vedshow:false,
      })
      
    }else{
      this.setData({
        addtext:'请先填写地理位置',
        addwarn:true
      })
    }
  },
  addfootcut:function(e){ //插入---点击添加我的足迹
    var that = this;
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var did = e.currentTarget.dataset.did;
    var aid = e.currentTarget.dataset.aid;
    var the_srp = totalarr[did].staarr[aid].striparr;
    var thesrp_l = the_srp.length
    var stalen = totalarr[did].staarr.length;
    
    
    var the_sta = totalarr[did].staarr[aid]
    console.log(the_sta);
    if (the_sta.position == "" || the_sta.position == undefined) { //没填写了站的地理位置
      the_sta.cutadd = 3
    } else {//填写了站的地理位置      
      the_sta.cutadd = 2
      totalarr[did].staarr[aid].listshow = true;
      totalarr[did].staarr[aid].disabled = true;
    }
    this.setData({
      totalarr: totalarr,
      vedshow:false
    })
    wx.setStorageSync('totalarr', totalarr);
  },
  addthenfoot:function(){ //继续添加足迹
    this.setData({
      spreadsta:true,
      // vedshow:false,
    })
  },
  continueadd:function(){ //继续本站
    var totalarr = this.data.totalarr; 
    var daylen = totalarr.length; //有几天
    var l_stalen = totalarr[daylen - 1].staarr.length; //最后一天有几站
    var l_sta = totalarr[daylen - 1].staarr[l_stalen-1]; //最后一站的内容
    console.log(l_sta);
    var l_srplen = l_sta.striparr.length;
    console.log(l_srplen); //最后一站有几项
    // l_sta.striparr.push(1); //在数组中加数据项
    console.log(totalarr);
    this.setData({
      listhidden:true,
      spreadsta:false,
    })
  },
  continuenextsta: function (e) { //继续下一站
    var that = this;
    var totalarr = this.data.totalarr;
    var did = e.currentTarget.dataset.did;
    var aid = e.currentTarget.dataset.aid;
    console.log(did);
    console.log(aid);
    var the_srp = totalarr[did].staarr[aid].striparr;
    var thesrp_l = the_srp.length
    var stalen = totalarr[did].staarr.length;
    console.log(totalarr);
    console.log(totalarr[did]);
    var capnum = this.data.capnum;
    totalarr[did].staarr[aid].spreadsta=0;
    var i = 0;
    for (i = 0; i < stalen;i++){
      totalarr[did].staarr[i].cutadd = 0;
    }
    totalarr[did].staarr.splice(aid+1,0,{
      capnum: capnum[aid + 1],
      staid: aid+1,
      spreadsta: 0,
      cutadd: 2,
      cutstait:1,
      striparr: [

      ]
    })
   
    console.log(totalarr);

    var capnum = that.data.capnum;
    var _daylen = totalarr.length;
    console.log(_daylen);
    var d = 0;
    for (d = 0; d < _daylen; d++) { //遍历day
      totalarr[d].dayid = d;
      totalarr[d].capnum = capnum[d];
      var _stalen = totalarr[d].staarr.length;
      console.log(_stalen);
      var s = 0;
      for (s = 0; s < _stalen; s++) { //遍历station
        var _srplen = totalarr[d].staarr[s].striparr.length;
        totalarr[d].staarr[s].staid = s;
        totalarr[d].staarr[s].capnum = capnum[s]
        var p = 0;
        for (p = 0; p < _srplen; p++) {
          var srp = totalarr[d].staarr[s].striparr[p];
          console.log('修改索引')
          srp.srpid = p;
          srp.c_pos = p + 1;
          console.log(srp);
        }
      }
    }
    console.log(totalarr);
    this.setData({
      totalarr: totalarr
    })
    wx.setStorageSync('totalarr', totalarr);
    this.setData({
      totalarr: totalarr,
      // thenadd: false,
      // spreadsta: false,
      // firstadd: true
    })
  },
  nextsta:function(){ //开始下一站
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var daylen = totalarr.length; //有几天
    console.log(daylen);
    var l_day = totalarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var l_stalen = l_day.length;
    var capnum = this.data.capnum;
    console.log(capnum);
    l_day.push({
      capnum: capnum[l_stalen],
      staid: l_stalen,
      striparr:[
        
      ]
    })
    console.log(totalarr);
    this.setData({
      totalarr: totalarr,
      thenadd:false,
      spreadsta:false,
      firstadd:true,
      recall:true,
    })
    wx.setStorageSync('totalarr', totalarr);
  },
  nextday:function(){ //进入下一天
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var daylen = totalarr.length; //有几天
    console.log(daylen);
    var l_day = totalarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var capnum = this.data.capnum;
    
    totalarr.push({
      dayid: daylen,
      capnum: capnum[daylen],
      staarr:[ //生成新的一天，一定会生成新的一站，新的一站是第一个，索引为一
        {
          capnum: '一',
          staid: 0,
          cutadd:0,
          spreadsta:0,
          striparr: [],
        }
      ]
    })
    console.log(totalarr);
    this.setData({
      totalarr: totalarr,
      thenadd: false,
      spreadsta: false,
      firstadd: true,
      recall:true
    })
    wx.setStorageSync('totalarr', totalarr);
  },
  continueaddcut:function(e){ //插入-继续本站
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var did = e.currentTarget.dataset.did;
    var aid = e.currentTarget.dataset.aid;
    console.log(did);
    console.log(aid);
    var the_srp = totalarr[did].staarr[aid].striparr;
    var thesrp_l = the_srp.length
    var stalen = totalarr[did].staarr.length;
    
    console.log(totalarr[did]);
    var the_sta = totalarr[did].staarr[aid];
    the_sta.listshow = true;
    console.log(totalarr);
    var capnum = this.data.capnum;
    this.setData({
      totalarr: totalarr,
      vedshow:false
    })

  },
  addcel:function(){
    this.setData({
      listhidden: false,
      listcuthidden:false
    })
  },
  covertap:function(e){ //选择封面主题
    console.log(e);
    var cid = parseInt(e.currentTarget.id);
    var coverarr = this.data.coverarr;
    this.setData({
      int: cid+1,
      coverimg: coverarr[cid]
    })
    var headarr = wx.getStorageSync('headarr');
    
    if (headarr.topimg_id){
      //修改封面图
      var temid = wx.getStorageSync('temid');
      wx.request({
        url: "https://youyue.huiur.com/updateflayerfoottopcache", //修改封面图
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          temfoot_id: temid,
          topimg_id: cid,
        },
        success: function (res) {
          console.log(res);
          headarr.topimg_id = parseInt(cid) + 1;
          wx.setStorageSync('headarr', headarr);
        }
      })
    }
  },
  addpic:function(){ //上传图片
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '载入中',
          mask:true,
        })
        initQiniu2();
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);
        var picsarr = res.tempFilePaths;
        var picnum = picsarr.length;
        var staarr = [];
        staarr.push(picsarr);
        console.log(staarr); //图片key的数组
        that.setData({
          num: picnum,
          picarr: picsarr,     
          listhidden:false,
          firstadd:false,
          thenadd:false,
          vedshow: true
        });
        var j = 0;
        var upinfor = [];
          var totalarr = that.data.totalarr;
          console.log(totalarr);
          var daylen = totalarr.length; //有几天
          var n = 0;
          var srpnum = 0;
          var f_staarr = [];
          for (n = 0; n < totalarr.length;n++){
            var s = 0;
            console.log(totalarr[n]);
            console.log(totalarr[n].staarr.length);
            for (s = 0; s < totalarr[n].staarr.length;s++){
              f_staarr.push(totalarr[n].staarr[s]);

              // that.srpnumfunc(n, s);
              // var r = 0;
              // for (r = 0; r < totalarr[n].staarr[s].striparr.length; r++) {
              //   // console.log(totalarr[0].staarr[0].striparr[0]);
              //   // srpnum+=1;
                
              // }
            }
          }
          console.log(f_staarr);
          var r = 0;
          for (r = 0; r < f_staarr.length;r++){
            console.log(f_staarr[r]);
            srpnum += f_staarr[r].striparr.length;
          }
          console.log(srpnum);
          var l_stalen = totalarr[daylen - 1].staarr.length; //最后一天有几站
          var l_sta = totalarr[daylen - 1].staarr[l_stalen - 1]; //最后一站的内容
          console.log(l_sta);
          var l_srplen = l_sta.striparr.length;
          console.log(l_srplen); //最后一站有几项
          var srpnum = (parseInt(l_srplen) + 1) >= 10 ? parseInt(l_srplen) + 1 : '0' + parseInt(l_srplen + 1);
          l_sta.striparr.push(
            {
              imgarr: picsarr,
              titlebox:true,
              isvideo: 2,
              c_pos: l_srplen+1,
              srpid: l_srplen,
              srpnum:srpnum
            }
          ); //在数组中加数据项
          console.log(totalarr);
          that.setData({
            totalarr: totalarr,
          })
          wx.setStorageSync('totalarr', totalarr);
          for (j = 0; j < picsarr.length; j++) {
            qiniuUploader.upload(picsarr[j], (res) => {
              var keys = res.key;
              console.log(res.key);
              upinfor.push(res.key);
              that.setData({
                upinfor: upinfor
              })
              // console.log(that.data.upinfor)
              wx.hideLoading();
            }, (error) => {
              console.error('error: ' + JSON.stringify(error));
            });
          }
          
      }
    })
  },
  srpnumfunc(d,s){
    var totalarr = this.data.totalarr;
    console.log(totalarr[d].staarr[s]);
  },
  addcutpic:function(e){ //插入-图片
    console.log(e);
    var that = this;
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        initQiniu2();
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);
        var picsarr = res.tempFilePaths;
        var picnum = picsarr.length;
        var staarr = [];
        staarr.push(picsarr);
        console.log(staarr); //图片key的数组
        that.setData({
          num: picnum,
          picarr: picsarr,
          listhidden: false,
          firstadd: false,
          thenadd: false,
        });
        var j = 0;
        var upinfor = [];
        var totalarr = that.data.totalarr;
        console.log(totalarr);
        var staid = e.currentTarget.dataset.aid; //插入的dayid
        var dayid = e.currentTarget.dataset.did; //插入的staid
        console.log(staid);
        console.log(dayid);
        var l_stat = totalarr[dayid]; //插入内容的该插入站
        console.log(l_stat);
        console.log(l_stat.staarr);
        console.log(l_stat.staarr[staid]);
        // var l_srplen = l_sta.striparr.length;
        // console.log(l_srplen); //这一站有几项
        l_stat.staarr[staid].listshow = false;
        var the_srp = totalarr[dayid].staarr[staid].striparr;
        totalarr[dayid].staarr[staid].listshow = false;
        totalarr[dayid].staarr[staid].spreadsta = 0;
        var thesrp_l = the_srp.length;
        totalarr[dayid].staarr[staid].cutadd = 0;
        var l_srplen = the_srp.length;
        var srpnum = (parseInt(l_srplen) + 1) >= 10 ? parseInt(l_srplen) + 1 : '0' + parseInt(l_srplen + 1);
        the_srp.push(
          {
            imgarr: picsarr,
            titlebox: true,
            isvideo: 2,
            c_pos: thesrp_l+1,
            srpnum: srpnum,
          }
        ); //在数组中加数据项
        console.log(totalarr);
        that.setData({
          totalarr: totalarr,
          listcuthidden:false,
          vedshow:true
        })
        wx.setStorageSync('totalarr', totalarr);
        for (j = 0; j < picsarr.length; j++) {
          qiniuUploader.upload(picsarr[j], (res) => {
            var keys = res.key;
            console.log(res.key);
            upinfor.push(res.key);
            that.setData({
              upinfor: upinfor
            })
            // console.log(that.data.upinfor)
          }, (error) => {
            console.error('error: ' + JSON.stringify(error));
          });
        }
      }
    })
  },
  addcutved:function(e){ //插入---视频
    var that = this;
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 60,
      // camera: 'back',
      success: function (res) {
        wx.showLoading({
          title: '载入中',
          mask: true,
        })
        that.setData({
          listhidden: false,
          firstadd: false,
          thenadd: false,
          vedshow:true,
        })
        console.log(res);
        var vedsrc = res.tempFilePath;
        initQiniu1();
        qiniuUploader.upload(vedsrc, (res) => {
          console.log(res)
          var totalarr = that.data.totalarr;
          console.log(totalarr);
          var staid = e.currentTarget.dataset.aid; //插入的dayid
          var dayid = e.currentTarget.dataset.did; //插入的staid
          console.log(staid);
          console.log(dayid);
          var l_stat = totalarr[dayid]; //插入内容的该插入站
          console.log(l_stat);
          console.log(l_stat.staarr);
          console.log(l_stat.staarr[staid]);
          l_stat.staarr[staid].listshow = false;
          var l_srplen = totalarr[dayid].staarr[staid].striparr.length;
          console.log(l_srplen); //这一站有几项
          var the_srp = totalarr[dayid].staarr[staid].striparr;
          totalarr[dayid].staarr[staid].listshow = false;
          totalarr[dayid].staarr[staid].cutadd = 0;
          var l_srplen = the_srp.length;
          var srpnum = (parseInt(l_srplen) + 1) >= 10 ? parseInt(l_srplen) + 1 : '0' + parseInt(l_srplen + 1);
          the_srp.push(
            {
              vedsrc: vedsrc,
              isvideo: 1,
              titlebox: true,
              c_pos: l_srplen+1,
              srpnum: srpnum,
            }
          ); //在数组中加数据项
          console.log(totalarr);
          that.setData({
            totalarr: totalarr,
            video_size: res.fsize,
            hash: res.hash,
            video_name: res.key,
            persistentId: res.persistentId,
            listshow:true
          })
          wx.setStorageSync('totalarr', totalarr);
          wx.hideLoading();
        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        });

      }
    })    
  },
  addcutcel:function(e){ //插入 选择图片还是视频list ---- 取消
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var did = e.currentTarget.dataset.did;
    var aid = e.currentTarget.dataset.aid;
    var the_srp = totalarr[did].staarr[aid].striparr;
    var thesrp_l = the_srp.length
    var stalen = totalarr[did].staarr.length;
    totalarr[did].staarr[aid].listshow = false;
    this.setData({
      totalarr: totalarr,
      vedshow:true
    })
  },
  addved:function(){ //上传视频
    var that = this;
    wx.chooseVideo({
      sourceType: ['album'],
      maxDuration: 60,
      // camera: 'back',
      success: function (res) {
        wx.showLoading({
          title: '载入中',
          mask: true,
        })
        that.setData({
          listhidden: false,
          firstadd: false,
          thenadd: false,
          vedshow:true,
        })
        console.log(res);
        var vedsrc = res.tempFilePath;
        initQiniu1();
        qiniuUploader.upload(vedsrc, (res) => {
          console.log(res)
          var totalarr = that.data.totalarr;
          var daylen = totalarr.length; //有几天
          var l_stalen = totalarr[daylen - 1].staarr.length; //最后一天有几站
          var l_sta = totalarr[daylen - 1].staarr[l_stalen - 1]; //最后一站的内容
          console.log(l_sta);
          var l_srplen = l_sta.striparr.length;
          console.log(l_srplen); //最后一站有几项
          var srpnum = (parseInt(l_srplen) + 1) >= 10 ? parseInt(l_srplen) + 1 : '0' + parseInt(l_srplen + 1);
          l_sta.striparr.push(
            {
              vedsrc: vedsrc,
              isvideo:1,
              titlebox: true,
              c_pos: l_srplen+1,
              srpid: l_srplen,
              srpnum: srpnum,
            }
          ); //在数组中加数据项
          console.log(totalarr);
          that.setData({
            totalarr: totalarr,
            video_size: res.fsize,
            hash: res.hash,
            video_name: res.key,
            persistentId: res.persistentId,
          })
          wx.setStorageSync('totalarr', totalarr);
          wx.hideLoading();
        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        });
        
      }
    })
  },
  inptitle:function(e){ //输入标题，第一次提交标题和主题
    console.log(e);
    var that = this;
    // console.log(e.timeStamp);
    // var stamp = wx.getStorageSync('timestamp');
    // if (stamp != ""){ //如果存在
    //   console.log(stamp);
    //   console.log('请求一次接口');
    // }else{ //如果不存在
    //   wx.setStorageSync('timestamp', e.timeStamp);
    //   console.log('不存在')
    // }
    
    // this.queryMultipleNodes();
    var title = this.data.pagetitle;
    var coverid = this.data.coverid;
    var user_id = wx.getStorageSync('user_id');

    var tem = wx.getStorageSync('temid');
    console.log(tem);
    if (tem != "") { //已经获取过footid 修改
      console.log('3333');
    }else{
      console.log('请求接口')
      wx.request({
        url: "https://youyue.huiur.com/flayerfoottopcache", //提交tem、title
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          user_id: user_id,
          title: title,
          topimg_id: 0,
        },
        success: function (res) {
          console.log(res);

          var temid = res.data.data.temfoot_id;
          wx.setStorageSync('temid', temid);
          that.setData({
            footid: temid
          })
        }
      })
    }
    
  },
  // queryMultipleNodes: function () { //节点DOM  【【不能删！！！！】】
  //   var query = wx.createSelectorQuery()
  //   query.select('#dayint1').boundingClientRect()
  //   query.selectViewport().scrollOffset()
  //   query.exec(function (res) {
  //     console.log(res);
  //     res[0].top       // #the-id节点的上边界坐标
  //     res[1].scrollTop // 显示区域的竖直滚动位置
  //     wx.pageScrollTo({
  //       scrollTop: res[0].top,
  //     })
  //   })
    
  // },
  stainput:function(e){ //视频或图片标题输入后 占位符消失
    if (e.detail.value == "") {
      this.setData({
        statithid: true,
        pagetitle: ''
        // 喜欢并去贯彻，就是意义，一场我的旅行，在这里记录下来！
      })
    } else {
      this.setData({
        statithid: false,
        pagetitle: e.detail.value,
      })
    }
  },
  formsub:function(e){ //图片或视频 标题确认
    console.log(e);
    var that = this;
    var title = e.detail.value.title;
    var temid = wx.getStorageSync('temid');
    var upinfor = this.data.upinfor;
    var picarr = this.data.picarr;
    console.log(upinfor);
    // var totalarr = wx.getStorageSync('totalarr');
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    // var daylen = totalarr.length; //有几天
    // console.log(daylen);
    // var l_day = totalarr[daylen - 1].staarr; //最后一天
    // console.log(l_day);
    // var l_stalen = totalarr[daylen - 1].staarr.length;
    // var l_sta = l_day[l_stalen - 1];
    // console.log(l_sta);
    // var position = l_sta.position;
    // var l_srplen = l_sta.striparr.length;
    // console.log(l_srplen);
    // var l_srp = l_sta.striparr[l_srplen-1];
    // console.log(l_srp);
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var srpid = e.currentTarget.dataset.srp-1; //点击确定的当前3个id
    console.log(srpid);
    var the_srp = totalarr[dayid].staarr[staid].striparr[srpid];
    console.log(totalarr[dayid]);
    var the_sta = totalarr[dayid].staarr[staid]
    console.log(the_sta);
    var position = totalarr[dayid].staarr[staid].position;
    var fixsrp = wx.getStorageSync('fixsrp');
    if (fixsrp){ //修改后的保存
      console.log('修改保存')
      // console.log(fixsrp);
      // fixsrp.title = title;
      var dayid = e.currentTarget.dataset.day;
      var staid = e.currentTarget.dataset.sta;
      var srpid = e.currentTarget.dataset.srp - 1;
      console.log(totalarr);
      console.log(dayid);
      console.log(staid);
      console.log(srpid);

      var thissrp = totalarr[dayid].staarr[staid].striparr[srpid];
      thissrp.title = title;
      thissrp.keep = 1;
      
      var temmedia_id = thissrp.temmedia_id;
      this.setData({
        totalarr: totalarr,
      })
      wx.setStorageSync('totalarr', totalarr);
      wx.removeStorageSync('fixsrp');
      wx.request({
        url: "https://youyue.huiur.com/updatemediatitle", //修改视频或图片标题
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          title: title,
          temmedia_id: temmedia_id
        },
        success: function (res) {
          console.log(res);
        }
      })
    }else{ //上传确定
      if (the_srp.isvideo == 1) { //【视频】 判断是视频还是图片，使用不同的上传接口参数
        wx.showLoading({
          title: '加载中',
          mask:true,
        })
        wx.request({
          url: "https://youyue.huiur.com/publishmedia", //上传视频
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            title: title,
            temfoot_id: temid,
            c_day: dayid + 1,
            c_station: staid + 1,
            c_position: srpid + 1,
            position: position,
            isvideo: 1,
            video_size: that.data.video_size,
            hash: that.data.hash,
            video_name: that.data.video_name,
            persistentId: that.data.persistentId,
            img_name: ''
          },
          success: function (res) {
            console.log('上传视频传值');
            console.log(dayid + 1);
            console.log(staid + 1);
            console.log(srpid + 1);
            console.log(res);
            var temmedia_id = res.data.data.temmedia_id;
            the_srp.srpid = srpid;
            the_srp.c_pos = srpid+1;
            the_srp.temmedia_id = temmedia_id;
            the_srp.position = position;
            the_srp.title = title;
            the_srp.keep = 1; //keep是干啥用的？
            the_srp.value = title;
            console.log(totalarr);
            wx.setStorageSync('totalarr', totalarr);
            if (totalarr[dayid].insert == true) { //插入 情况 insert判断显示插入还是完成
              totalarr[dayid].staarr[staid].cutadd = 1
            } else {
              totalarr[dayid].staarr[staid].cutadd = 0
            }
            that.setData({
              surebtn1: false,
              fixbtn1: true,
              thenadd: true,
              firstadd: false,
              totalarr: totalarr,
            })
            wx.setStorageSync('totalarr', totalarr);
            wx.hideLoading();
          }
        });
        var dayid = e.currentTarget.dataset.day;
        var staid = e.currentTarget.dataset.sta;
        var srpid = e.currentTarget.dataset.srp - 1;
        console.log(dayid);
        console.log(staid);
        console.log(srpid);
        var t_sta = totalarr[dayid].staarr[staid];
        var position = t_sta.position;
        console.log(position);
        if (srpid == 0) { //每站的第一个 点击确定按钮 请求positioncache接口
          console.log('请求position接口')
          wx.request({
            url: "https://youyue.huiur.com/flayerfootspositioncache", //上传图片或视频
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              temfoot_id: temid,
              c_day: dayid + 1,
              c_station: staid + 1,
              position: position,
            },
            success: function (res) {
              console.log(res);
            }
          });
        }
      } else { //图片
        wx.request({
          url: "https://youyue.huiur.com/publishmedia", //上传图片
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            title: title,
            temfoot_id: temid,
            c_day: dayid+1,
            c_station: staid+1,
            c_position: srpid+1,
            position: position,
            isvideo: 2,
            video_size: '',
            hash: '',
            video_name: '',
            persistentId: '',
            img_name: upinfor
          },
          success: function (res) {
            console.log('上传图片传值');
            console.log(dayid + 1);
            console.log(staid + 1);
            console.log(srpid + 1);
            console.log(res);
            var temmedia_id = res.data.data.temmedia_id;
            the_srp.srpid = srpid;
            the_srp.c_pos = srpid+1;
            the_srp.temmedia_id = temmedia_id;
            the_srp.position = position;
            the_srp.title = title;
            the_srp.img_name = upinfor;
            the_srp.keep = 1; //keep是干啥用的？
            console.log(totalarr);
            wx.setStorageSync('totalarr', totalarr);
            if (totalarr[dayid].insert == true) { //插入 情况
              totalarr[dayid].staarr[staid].cutadd = 1
            } else {
              totalarr[dayid].staarr[staid].cutadd = 0
            }
            that.setData({
              surebtn1: false,
              fixbtn1: true,
              thenadd: true,
              firstadd: false,
              totalarr: totalarr,
            })
            wx.setStorageSync('totalarr', totalarr);
            wx.hideLoading();
            
          }
        });
        var dayid = e.currentTarget.dataset.day;
        var staid = e.currentTarget.dataset.sta;
        var srpid = e.currentTarget.dataset.srp - 1;
        console.log(dayid);
        console.log(staid);
        console.log(srpid);
        var t_sta = totalarr[dayid].staarr[staid];
        var position = t_sta.position;
        console.log(position);
        if (srpid == 0){ //每站的第一个 点击确定按钮 请求positioncache接口
          console.log('请求position接口')
          wx.request({
            url: "https://youyue.huiur.com/flayerfootspositioncache", //上传图片或视频
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              temfoot_id: temid,
              c_day: dayid+1,
              c_station: staid+1,
              position: position,
            },
            success: function (res) {
              console.log(res);
            }
          });
        }
        
      }
      if (the_sta.cutstait == 1) { //插入的该站保存
        var stalen = totalarr[dayid].staarr.length;
        var i = 0;
        for (i = 0; i < stalen; i++) {
          totalarr[dayid].staarr[i].cutadd = 1;
        }
        that.setData({
          totalarr: totalarr,
        })
      }
    }
  },
  deleteved:function(e){ //删除视频
    console.log(e);
    var that = this;
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var srpid = e.currentTarget.dataset.srp - 1;
    var totalarr = this.data.totalarr;
    var thissrp = totalarr[dayid].staarr[staid].striparr[srpid];
    console.log(thissrp);
    var temmedia_id = thissrp.temmedia_id;
    var temid = wx.getStorageSync('temid');
    totalarr[dayid].staarr[staid].striparr.splice(srpid,1);
    wx.removeStorageSync('fixsrp');
    console.log(totalarr);
    if (totalarr[dayid].staarr[staid].striparr.length == 0) { //上一级 站的数组为空 需要删除天   
      if (dayid == 0 && totalarr.length == 1) { //第一天,且只有一天
        console.log('是第一天')
        if (totalarr[0].staarr.length == 1) { //第一天只剩一站，不能删除仅剩的第一站信息
          var obj = totalarr[dayid].staarr[staid];
          console.log(obj)
          delete obj.linkhid;
          delete obj.position;

          console.log(totalarr);
          that.setData({
            firstadd: true,
            thenadd: false,
            addexit: false, //判断是否填写了站的位置
          })
        } else { //第一天剩下超过一站
          totalarr[dayid].staarr.splice(staid, 1); //删除该站
        }


      } else { // 不是第一天或还有其他天 需要把整天都删除
        totalarr[dayid].staarr.splice(staid, 1);//删除该站
        if (totalarr[dayid].staarr.length == 0) { //该天 站为空
          totalarr.splice(dayid, 1); //删除该天
        }
        console.log(totalarr);
      }

    }
    console.log('修改ved索引')
    var capnum = that.data.capnum;
    var _daylen = totalarr.length;
    console.log(_daylen);
    var d = 0;
    for (d = 0; d < _daylen; d++) { //遍历day
      totalarr[d].dayid = d;
      totalarr[d].capnum = capnum[d];
      var _stalen = totalarr[d].staarr.length;
      console.log(_stalen);
      var s = 0;
      for (s = 0; s < _stalen; s++) { //遍历station
        var _srplen = totalarr[d].staarr[s].striparr.length;
        totalarr[d].staarr[s].staid = s;
        totalarr[d].staarr[s].capnum = capnum[s]
        var p = 0;
        for (p = 0; p < _srplen; p++) {
          var srp = totalarr[d].staarr[s].striparr[p];
          

          srp.c_pos = p + 1;
          console.log(srp);
        }
      }
    }
    console.log(totalarr);
    this.setData({
      totalarr: totalarr
    })
    wx.setStorageSync('totalarr', totalarr);
    wx.request({
      url: "https://youyue.huiur.com/delmedia", //删除视频
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        temmedia_id: temmedia_id,
        isvideo:1,
        img_name:'',
        temfoot_id: temid,
        c_day: dayid+1,
        c_station: staid+1,
        c_position: srpid+1,
      },
      success: function (res) {
        console.log('删除视频传值');
        console.log(dayid + 1);
        console.log(staid + 1);
        console.log(srpid + 1);
        console.log(res);
      }
    })
  },
  deleteimg:function(e){ //删除图片
  //点击图片 每个图片上dataset了 此张图片的
    console.log(e);
    var that = this;
    var dayid = e.currentTarget.dataset.day;
    var staid = e.currentTarget.dataset.sta;
    var srpid = e.currentTarget.dataset.srp - 1;
    var totalarr = this.data.totalarr;
    var thissrp = totalarr[dayid].staarr[staid].striparr[srpid];
    var imgidx = e.currentTarget.dataset.imgidx;
    console.log(imgidx);
    console.log(thissrp);
    thissrp.imgarr.splice(imgidx, 1);
    var img_name = thissrp.img_name;
    img_name.splice(imgidx, 1);
    var temmedia_id = thissrp.temmedia_id;
    var temid = wx.getStorageSync('temid');
    if (img_name === undefined || img_name.length == 0) { //图片都删除 删除本个内容，如果站内没有内容 就都删除
      // array empty or does not exist
      console.log('单项的图片全删除了'); 
      totalarr[dayid].staarr[staid].striparr.splice(srpid, 1);
      wx.removeStorageSync('fixsrp');//全删除之后没有点击修改 要清除修改缓存
      console.log(totalarr);
      if (totalarr[dayid].staarr[staid].striparr.length == 0){ //上一级 站的数组为空 需要删除天   
        if (dayid == 0 && totalarr.length == 1){ //第一天,且只有一天
         console.log('是第一天')  
         if (totalarr[0].staarr.length == 1) { //第一天只剩一站，不能删除仅剩的第一站信息
           var obj = totalarr[dayid].staarr[staid];
           console.log(obj)
           delete obj.linkhid;
           delete obj.position;
           obj.disabled = false;
           console.log(totalarr);

           that.setData({
             firstadd: true,
             thenadd: false,
             addexit: false, //判断是否填写了站
           })
         }else{ //第一天剩下超过一站
           totalarr[dayid].staarr.splice(staid, 1); //删除该站
         }
                  
          
        }else{ // 不是第一天或还有其他天 需要把整天都删除
          totalarr[dayid].staarr.splice(staid, 1);//删除该站
          if (totalarr[dayid].staarr.length == 0){ //该天 站为空
            totalarr.splice(dayid, 1); //删除该天
          }
          console.log(totalarr);
        }
        
      }
    }
    //修改索引 
    console.log('修改索引')
    var capnum = that.data.capnum;
    var _daylen = totalarr.length;
    console.log(_daylen);
    var d = 0;
    for (d = 0; d < _daylen; d++) { //遍历day
      totalarr[d].dayid = d;
      totalarr[d].capnum = capnum[d];
      var _stalen = totalarr[d].staarr.length;
      console.log(_stalen);
      var s = 0;
      for (s = 0; s < _stalen; s++) { //遍历station
        var _srplen = totalarr[d].staarr[s].striparr.length;
        totalarr[d].staarr[s].staid = s;
        totalarr[d].staarr[s].capnum = capnum[s]
        var p = 0;
        for (p = 0; p < _srplen; p++) {
          var srp = totalarr[d].staarr[s].striparr[p];
          console.log('修改索引')
          srp.srpid = p;
          srp.c_pos = p+1;
          console.log(srp);
        }
      }
    }
    console.log(totalarr);
    this.setData({
      totalarr: totalarr
    })
    wx.setStorageSync('totalarr', totalarr);
    wx.request({
      url: "https://youyue.huiur.com/delmedia", //删除图片
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        temmedia_id: temmedia_id,
        isvideo: 2,
        img_name: img_name,
        temfoot_id: temid,
        c_day: dayid + 1,
        c_station: staid + 1,
        c_position: srpid + 1,
      },
      success: function (res) {
        console.log(res);
        console.log('删除图片传值');
        console.log(dayid + 1);
        console.log(staid + 1);
        console.log(srpid + 1);
      }
    })
  },
  recalltap:function(){ //撤回 删除最后一个空数组
    var that = this;
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var day_len = totalarr.length;
    console.log(day_len);
    var day_l = totalarr[day_len-1];
    console.log(day_l);
    var sta_len = totalarr[day_len - 1].staarr.length;
    console.log(sta_len);
    var sta_l = day_l.staarr[sta_len-1];
    console.log(sta_l);
    if (sta_l.cutadd != undefined){ //新增为天
      totalarr.pop();
    }else{ //新增为站      
      day_l.staarr.pop();
    }
    that.setData({
      totalarr: totalarr,
      firstadd:false,
      thenadd:true
    })
    wx.setStorageSync('totalarr', totalarr);
  },
  compeletetap:function(){ //完成制作
    var temid = wx.getStorageSync('temid');
    var that = this;
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var latitude = wx.getStorageSync('_lat');  //获取当前定位数据缓存 坐标lat
    var longitude = wx.getStorageSync('_log');
    if (totalarr[0].staarr[0].striparr.length == 0) { //'srpid不存在' 用户还未添加内容，第一站为空或者删除到第一站为空
      console.log('srpid不存在')
      wx.showModal({
        title: '提示',
        content: '您还未添加足迹，请继续编辑哦',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      var srpid = totalarr[0].staarr[0].striparr[0].srpid;
      console.log(srpid);
      if (srpid == 0) { //第一个有视频或图片，可以提交
        wx.request({
          url: "https://youyue.huiur.com/makedoneflayerfoot",
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            temfoot_id: temid,
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res);
            wx.removeStorageSync('temid');
            wx.removeStorageSync('totalarr');
            wx.removeStorageSync('fixsrp');
            wx.removeStorageSync('headarr');
            wx.removeStorageSync('date1');
            var datas = res.data.data;
            var score = datas.score;
            var grade = datas.grade;
            var name = datas.name;
            wx.redirectTo({
              url: '../footprint/footprint?done=' + 1 + '&score=' + score + '&grade=' + grade + '&name=' + name,
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '您还未添加足迹，请继续编辑哦',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
    
  },
  continueyes:function(){ //选择继续编辑
    var totalarr = wx.getStorageSync('totalarr');
    wx.removeStorageSync('fixsrp');
    console.log(totalarr);
    var daylen = totalarr.length; //有几天
    console.log(daylen);
    var l_day = totalarr[daylen - 1].staarr; //最后一天
    console.log(l_day);
    var l_stalen = totalarr[daylen - 1].staarr.length;
    var l_sta = l_day[l_stalen - 1];
    console.log(l_sta);
    var headarr = wx.getStorageSync('headarr');
    console.log(headarr);
    var coverarr = this.data.coverarr;
    this.setData({
      titlevalue: headarr.title,
      int: headarr.topimg_id,
      coverimg: coverarr[headarr.topimg_id-1]
    })
    if (l_sta.striparr.length == 0){ //已经添加了内容
      this.setData({
        totalarr: totalarr,
        contiques: false,
        addexit: false,
        thenadd:false,
        firstadd:true,
        areashow:true,
      })
    }else{
      this.setData({
        totalarr: totalarr,
        contiques: false,
        addexit: true,
        thenadd: true,
        firstadd: false,
        areashow:true
      })
    }
    if(l_sta.position){
      this.setData({
        addexit:true
      })
    }
  },
  continueno: function () { //放弃继续编辑
    wx.removeStorageSync('temid');
    wx.removeStorageSync('totalarr');
    wx.removeStorageSync('fixsrp');
    wx.removeStorageSync('headarr');
    this.setData({
      contiques: false,
      areashow:true
    })
  },
  cutaddtap:function(e){ //点击插入
    console.log(e);
    var e_dayid = e.currentTarget.dataset.bid;
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var thisday = totalarr[e_dayid];
    thisday.insert = true;
    console.log(thisday);
    var the_staarr = thisday.staarr;
    console.log(the_staarr);
    var i = 0;
    for (i = 0; i < the_staarr.length;i++){
      the_staarr[i].cutadd = 1;
    }
    console.log(totalarr);
    this.setData({
      totalarr:totalarr
    })
    wx.setStorageSync('totalarr', totalarr);
  },
  cutadddone:function(e){ //插入 -- 点击完成 
    console.log(e);
    var e_dayid = e.currentTarget.dataset.bid;
    var totalarr = this.data.totalarr;
    console.log(totalarr);
    var thisday = totalarr[e_dayid];
    thisday.insert = false;
    console.log(thisday);
    var the_staarr = thisday.staarr;
    console.log(the_staarr);
    var i = 0;
    for (i = 0; i < the_staarr.length; i++) {
      the_staarr[i].cutadd = 0;
    }
    console.log(totalarr);
    this.setData({
      totalarr: totalarr
    })
    wx.setStorageSync('totalarr', totalarr);
  },
  cutaddfoot:function(e){ //插入继续 添加足迹 显示spread
    var this_staid = e.currentTarget.dataset.aid;
    var this_dayid = e.currentTarget.dataset.did;
    var totalarr = this.data.totalarr;
    totalarr[this_dayid].staarr[this_staid].spreadsta = 1;
    this.setData({
      totalarr: totalarr,
      cut_dayid: this_dayid,
      cut_staid: this_staid
    })
    wx.setStorageSync('totalarr', totalarr);
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