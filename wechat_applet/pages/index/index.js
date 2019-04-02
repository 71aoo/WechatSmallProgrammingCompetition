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
    map_height:900,
    longitude: 103.92377,
    latitude:30.57447,
    scroll_height:300,
    markers:
    [{
      id:0,
      iconPath:"../images/sign.png",
      latitude: 30.57447,
      longtitude: 103.92377,
      width: 50,
      height: 50,
      title:"123",
      address:"123",
      dis:"123"

    }]
    
  }
  //show current position
  , onLoad: function (res) 
  {
      var that = this;
  
  
      wx.getLocation  //获得当前位置
      ({
          
          success: function (dis)
         {    
              that.setData
                ({
                  longitude: dis.longitude,
                  latitude: dis.latitude
                })      
              // console.log(res)
              qqmapsdk.search  //调用腾讯地图api以当前位置为中心搜索厕所
              ({
                  keyword:'厕所',
                  longitude:dis.longitude,
                  latitude:dis.latitude,
                  success:function(res)
                  { 
                    var mar = [];                    
                    for(var i = 0 ; i < res.data.length; i++)
                    {
                      
                      var dist = that.getDistance(dis.latitude,dis.longitude,res.data[i].location.lat,res.data[i].location.lng)
                      // console.log(res.data.length)
                      mar.push
                      ({
                        
                        
                          title: res.data[i].title,
                          id: res.data[i].id,
                          latitude: res.data[i].location.lat,
                          longitude: res.data[i].location.lng,
                          iconPath:"../images/locat.png",
                          width:20,
                          height:20,
                          address:res.data[i].address,
                          distance: dist.toFixed(2) * 1000
                        
                          
                        }),
                        that.setData
                        ({
                        markers:mar
                        })
                        
                      
                      
                     
                                    
                    }
                   
                  
                    
                    
                  },
                  fail:function(res)
                  {
                    console.log('地图错误，或请授权获取位置')

                  }
                 
                    
                    
              })
              
              
             
          }
        })
       
       
        
     

  },
  getDistance:function(lat1, lng1, lat2, lng2) //计算当前位置到目的地距离
    {
      // console.log(lat1, lng1, lat2, lng2)
      var radLat1 = lat1 * Math.PI / 180.0;
      var radLat2 = lat2 * Math.PI / 180.0;
      var a = radLat1 - radLat2;
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10000;
      return s;
    }

})