var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '5LYBZ-QC53D-NAA4G-HJN4A-V26MZ-OEB7H'//申请的开发者秘钥key
});

Page
({
  data: 
  {
    //map_width: 100%
    map_height:1150,
    longitude: 103.92377,
    latitude:30.57447,
    markers:
    [{
      
      iconPath:"../images/定位.png",
      latitude: 30.57447,
      longtitude: 103.92377,
      width: 50,
      height: 50

    }]
    
    
    

   
  }
  //show current position
  , onLoad: function (res) 
  {
    var that = this;
  
  
      wx.getLocation
      ({
          
          success: function (res)
         {
              console.log(res)
              qqmapsdk.search
              ({
                  keyword:'厕所',
                  longitude:res.longitude,
                  latitude:res.latitude,
                  success:function(res)
                  { 
                    var s_res = res;
                    console.log(res);
                    var mar = []
                    for(var i = 0;i < res.data.length; i++)
                    {
                      mar.push
                          ({
                            title: res.data[i].title,
                            id: s_res.data[i].id,
                            latitude: s_res.data[i].location.lat,
                            longitude: s_res.data[i].location.lng,
                            iconPath:"../images/sign.png",
                            width:15,
                            height:20,
                            


                          })

                      // qqmapsdk.calculateDistance
                      // ({
                      //   to:
                      //   [{
                      //     latitude:res.data[i].location.lat,
                      //     longitude:res.data[i].lng
                      //   }],
                      //   success:function(res)
                      //   {
                      //     comsole.log(res)
                      //     var res = res.result;
                      //     var mar = [];
                          
                      //   }
                      // })
                      
                      
                    }
                    that.setData
                    ({
                      markers:mar
                    })
                    

                  },
                  fail:function(res)
                  {
                    console.log('地图错误，或请授权获取位置')

                  }
                    
                    
              })
              
              // 调用sdk接口
          }
        })
     

  },
    sortPage: function () {
      wx.navigateTo
        ({
          url: '../sortPage/sort',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })


    },
})