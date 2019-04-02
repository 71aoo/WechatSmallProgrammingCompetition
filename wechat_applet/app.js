var QQMapWX = require('/libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '5LYBZ-QC53D-NAA4G-HJN4A-V26MZ-OEB7H'//申请的开发者秘钥key
});


App({
 
data:
{
  all_city:[],
  globalData: {
    defaultCity: '成都市'
    
  }


},

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var gc = this.getCity();
    
    console.log(gc)//城市列表
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  getCity:function()
  {
    var that = this;
    var data_city = this.data.all_city;
    var city = [];
    //调用获取城市列表接口
    qqmapsdk.getCityList({
      success: function (res) 
      {//成功后的回调
        
        
        
        
        console.log('城市数据：', res.result[1]); //打印城市数据
        console.log(res.result[1].length);
        for(var i =0;i < res.result[1].length;i++)
        {
            city.push
            ({
                city: res.result[1][i]

            })
            // that.setData
            // ({
            //     all_city:city
            // })

        }
        
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
    return city;

  },
  globalData: {
    defaultCity: '成都市'  //全局城市变量
  }
})

