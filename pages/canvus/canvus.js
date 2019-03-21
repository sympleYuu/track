// pages/canvus/canvus.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagetitle:'生成长图',
    screenWidth:'',
    dy:0,
    dx:0,
    canvus_h:7000,
    capnum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    j:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const ctx = wx.createCanvasContext('canvid');
    this.ctx = ctx;
    var token = wx.getStorageSync('token');
    wx.getSystemInfo({
      success(res) {
        console.log(res);
        that.setData({
          screenWidth: res.screenWidth
        })
      }
    })
    wx.request({ //
      url: "https://track.huiur.com/api/points",
      data: {
        trackid: 4
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      success: function (res) {
        console.log(res);
        var footarr = res.data;
        
        that.setData({
          footarr: footarr,
        })
        //绘制用户信息
        var ctx = that.ctx;
        var screenWidth = that.data.screenWidth;
        var imgH = screenWidth/750 * 335;
        ctx.drawImage('../../images/canvasbg.png', 0, 0, screenWidth, imgH);    
        var rectW = 723*screenWidth/750;
        var rectH = 134*screenWidth/750;
        var dx = (screenWidth - rectW + 2)/2;
        var dy = imgH - rectH/2;
        ctx.drawImage('../../images/canvasrect.png', dx, dy, rectW, rectH);        var title = footarr[0].track.title;
        ctx.setFillStyle('#150a04');
        ctx.setFontSize(16);
        ctx.setTextAlign('left');
        ctx.setTextBaseline('top');
        var l_dx = 24*screenWidth/750;
        var title_dy = 420*screenWidth/750;
        ctx.fillText(title, l_dx, title_dy);
        ctx.draw(true); //绘制banner图+标题
        var coverimg = 'https://track.huiur.com/' + footarr[0].track.banner;
        wx.downloadFile({
          url: coverimg,
          success(res) {
            var temp = res.tempFilePath;
            wx.getImageInfo({
              src: temp,
              success(res) {
                var x = res.width;
                var y = res.height;
                var a = 702*screenWidth/750;
                var b = 394*screenWidth/750;
                var sx,sy,sWidth,sHeight;
                var cover_dy = 490 * screenWidth / 750;
                if (x > a){ //封面宽度大于设定的框，
                  if(y > b){
                    sx = (x - a) / 2;
                    sy = (y - b) / 2;
                    sWidth = a;
                    sHeight = b;
                  } else {
                    x = b/y * x;
                    sx = (x - a) / 2;
                    sy = 0;
                    sWidth = a;
                    sHeight = b;
                  }
                }else{
                  if (y > b) {
                    y = a / x * y;
                    sx = 0;
                    sy = (y-b)/2;
                    sWidth = a;
                    sHeight = b;
                  } else {
                    if(x/y>a/b){
                      x = b/y*x;
                      sx = (x - a) / 2;
                      sy = 0;
                      sWidth = a;
                      sHeight = b;
                    }else{
                      y = a / x * y;
                      sx = 0;
                      sy = (y - b) / 2;
                      sWidth = a;
                      sHeight = b;
                    }
                  }
                
              }
                ctx.drawImage(temp, sx, sy, sWidth, sHeight, l_dx, cover_dy, a, b) 
                ctx.draw(true);
                // footarr.forEach(that.drawStation);
                that.drawStation(footarr,0);

              }
            })
          }
        })
        

        //var downtemp = footarr[0].images.forEach(that.download);
 
        // let title = {
        //   x: 40,
        //   y:1224,
        //   color: '#333333',
        //   size: 19,
        //   align: 'left',
        //   baseline: 'top',
        //   text: location,
        // };

    
      }
    })
  },
  drawStation: function (arr,i){ //站点循环绘制
    console.log(i);
    this.setData({
      stai:i
    })
    var length = arr.length;
    var that = this;
    if(i<length){
      var ctx = this.ctx;
      var _dy = this.data._dy + 40; //站点地址的dy
      var screenWidth = this.data.screenWidth;
      var _dx = 24 * screenWidth / 750;
      if (i == 0) {
        var _dy = 940 * screenWidth / 750;
      }
      //绘制站点名称
      var localtext = '第' + this.data.capnum[i] + '站:';
      var location = arr[i].location;
      const metrics = ctx.measureText(localtext);
      console.log(metrics.width);
      ctx.setFillStyle('#999999');
      ctx.setFontSize(12);
      ctx.setTextBaseline('middle');
      ctx.fillText(localtext, _dx, _dy);
      ctx.draw(true);

      ctx.setFillStyle('#150a04');
      ctx.setFontSize(16);
      ctx.setTextBaseline('middle');
      ctx.fillText(location, metrics.width + _dx - 2, _dy - 1);
      ctx.draw(true); //绘制banner图+标题
      // this.drawLocation(i);
      var textWidth = 700 * screenWidth / 750;
      var textlineheight = 36 * screenWidth / 750;

      var text = {
        x: _dx,
        y: _dy + 20, //描述首行的dy
        color: '#150a04',
        size: 14,
        align: 'left',
        baseline: 'top',
        text: arr[i].text,
        width: textWidth,
        height: textlineheight,
        line: 15,
      }
      that.textWrap(text);
      that.drawPicture(arr[i].images, 0);
    }else{
      var _dy = that.data._dy;
      that.setData({
        canvus_h: _dy+100
      })
    }
    

  },
  /**
    * 文本换行
    *
    * @param {Object} obj
    */
  textWrap: function (obj) {
    console.log('文本换行');
    console.log(obj);
    var that = this;
    let tr = this.getTextLine(obj);
    for (let i = 0; i < tr.length; i++) {
      if (i < obj.line) {
        let txt = {
          x: obj.x,
          y: obj.y + (i * obj.height),
          color: obj.color,
          size: obj.size,
          align: obj.align,
          baseline: obj.baseline,
          text: tr[i],
          bold: obj.bold
        };
        if (i == obj.line - 1) {
          txt.text = txt.text.substring(0, txt.text.length - 3) + '......';
        }
        console.log(txt);
        this.drawText(txt);
        
      }
    }
    console.log(tr.length);
    // var _dy = that.data._dy + tr.length * 40;
    // console.log(_dy)
    // this.setData({
    //   _dy: _dy
    // })
  },
  /**
   * 获取文本折行
   * @param {Object} obj
   * @return {Array} arrTr
   */
  getTextLine: function (obj) {
    this.ctx.setFontSize(obj.size);
    let arrText = obj.text.split('');
    let line = '';
    let arrTr = [];
    for (let i = 0; i < arrText.length; i++) {
      var testLine = line + arrText[i];
      var metrics = this.ctx.measureText(testLine);
      var width = metrics.width;
      if (width > obj.width && i > 0) {
        arrTr.push(line);
        line = arrText[i];
      } else {
        line = testLine;
      }
      if (i == arrText.length - 1) {
        arrTr.push(line);
      }
    }
    console.log(arrTr);
    return arrTr;
  },
  drawText: function (obj) {
    console.log('渲染文字')
    console.log(obj);
    this.ctx.setFillStyle(obj.color);
    this.ctx.setFontSize(obj.size);
    this.ctx.setTextAlign(obj.align);
    this.ctx.setTextBaseline(obj.baseline);

    this.ctx.fillText(obj.text, obj.x, obj.y);

    this.ctx.draw(true);
    this.setData({
      _dy: obj.y
    })
  },
  drawPicture: function (arr,j){
    var length = arr.length;
    console.log(length);
    console.log(j);
    var that = this;
    if(j<length){
      console.log('第'+j+'次调用');
      var ctx = this.ctx;
      var _dy = this.data._dy;
      
      var imgsrc = 'https://track.huiur.com/' + arr[j];
      wx.downloadFile({
        url: imgsrc,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          console.log(res);
          var temp = res.tempFilePath;
          wx.getImageInfo({
            src: temp,
            success(res) {
              var d_width = res.width;
              var d_height = res.height;
              var screenWidth = that.data.screenWidth;
              console.log(temp);
              
              d_height = screenWidth / d_width * d_height;
              d_width = screenWidth;

              var _dx = 24 * screenWidth / 750;
              if (j == 0) {
                _dy = _dy + 30;
              }else{
                _dy = _dy + 10;
              }
              
              ctx.drawImage(temp, _dx, _dy, d_width, d_height);
              ctx.draw(true);
              that.setData({
                _dy: _dy + d_height,
              })
              j=j+1;
              if (j < length){
                that.drawPicture(arr,j);
              }else{
                var footarr = that.data.footarr;
                var stai = that.data.stai+1;
                that.drawStation(footarr, stai);

              }
            }
          })
          }
      })
    }else{
      // var footarr = this.data.footarr;
      // var stai = this.data.stai;
      // that.drawStation(footarr, stai);
    }
    
    // this.downFile(imgsrc)
    // .then(jj => {
    //   //这里是将test方法中resolve返回值赋值给下一个方法,
    //   //在这里可以对数据进行判断是否继续进行
    //   return this.runAsync1(jj);
    // })
    //   .then(hh => {
    //     //这里是将runAsync1方法中resolve返回值赋值给下一个方法
    //     return this.runAsync2(hh);
    //   })
    //   .then(mm => {
    //     //这里是将runAsync2方法中resolve返回值赋值给下一个方法
    //     this.runAsync3(mm);
    //   })

      

  
      //         that.setData({
      //           // canvus_h: canvus_h,
      //           _dy: _dy,
      //           j:j+1

      //         })
      //         if(j==length){
      //           console.log('执行完毕');
      //         }else{
      //           that.drawPicture(arr);
      //         }
      //       }
      //     })
      //     // context.drawImage(temp, 0, 0, 150, 100)

      //     // if (res.statusCode === 200) {
      //     //   wx.playVoice({
      //     //     filePath: res.tempFilePath
      //     //   })
      //     // }
      //   }
      // })
    
  },
  downFile: function (imgsrc) {
    var p = new Promise(function (resolve, reject) {
      wx.downloadFile({
        url: imgsrc,
        success(res) {
          resolve(res);
          reject("调用失败");
        }
      })
      // setTimeout(function () {
      //   //注意:一旦你把promise的状态定义了哪他的状态就不会再改变.
      //   //比如我这里先写的resolve下面又跟着写了reject,
      //   //reject的代码会执行但是promise的状态是不会变的就是reject
        
      // }, 5000);
    })
    return p;
  },
  xuexi: function () {
    this.test()
      .then(jj => {
        //这里是将test方法中resolve返回值赋值给下一个方法,
        //在这里可以对数据进行判断是否继续进行
        return this.runAsync1(jj);
      })
      .then(hh => {
        //这里是将runAsync1方法中resolve返回值赋值给下一个方法
        return this.runAsync2(hh);
      })
      .then(mm => {
        //这里是将runAsync2方法中resolve返回值赋值给下一个方法
        this.runAsync3(mm);
      })
  },
  test: function () {
    var p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        //注意:一旦你把promise的状态定义了哪他的状态就不会再改变.
        //比如我这里先写的resolve下面又跟着写了reject,
        //reject的代码会执行但是promise的状态是不会变的就是reject
        resolve("调用成功");
        reject("调用失败");
      }, 5000);
    })
    return p;
  },
  runAsync1: function (jj) {
    var p = new Promise(function (resolve, reject) {
      //做一些异步操作
      setTimeout(function () {
        console.log(jj);
        resolve("测试的数据1");
      }, 3000);
    });
    return p;
  },
  runAsync2: function (hh) {
    var p = new Promise(function (resolve, reject) {
      //做一些异步操作
      setTimeout(function () {
        console.log(hh);
        resolve('随便什么数据2');
      }, 2000);
    });
    return p;
  },
  runAsync3: function (mm) {
    var p = new Promise(function (resolve, reject) {
      //做一些异步操作
      setTimeout(function () {
        console.log(mm);
        // resolve('随便什么数据6');
      }, 2000);
    });
    return p;
  },
  drawPicture2: function (i, idx, arr){
    const ctx = wx.createCanvasContext('canvid');
    var that = this;
    console.log('foreach');
    i = 'https://track.huiur.com/' + i;
    console.log(i);
    wx.downloadFile({
      url: i, 
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        console.log(res);
        var temp = res.tempFilePath;
        wx.getImageInfo({
          src: temp,
          success(res) {
            var d_width = res.width;
            var d_height = res.height;
            // var 
            var screenWidth = that.data.screenWidth;
            var dx = that.data.dx;
            var dy = that.data.dy;
            if (d_width > screenWidth){
              var d_h = screenWidth / d_width * d_height;
              d_width = screenWidth;
              d_height = d_h;
              
            }
            console.log(temp);
            var canvus_h = dy + d_height + 200;
            that.setData({
              // canvus_h: canvus_h,
            })
            ctx.drawImage(temp, dx, dy, d_width, d_height);
            ctx.draw(true);

            dy = dy + d_height + 10;
            
            console.log(dy);
            console.log(canvus_h);
            that.setData({
              // canvus_h: canvus_h,
              dy:dy,
              
            })
          }
        })
        // context.drawImage(temp, 0, 0, 150, 100)
        
        // if (res.statusCode === 200) {
        //   wx.playVoice({
        //     filePath: res.tempFilePath
        //   })
        // }
      }
    })
  },
  

   
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const ctx = wx.createCanvasContext('canvid');
    this.ctx = ctx;
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