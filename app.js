App({
    onLaunch() {
        //当本地缓存没有或者服务器token过期时重新获取并设置cookie
        // if(!(this.globalData.token)||!(this.verifyToken())){
        wx.login({
            success: req => {
                this.toRequest('/api/v1/token/user', 'POST', {
                    code: req.code
                },1)
            }
        })
    },
    //如果没有token就获取并存储在storage里
    verifyToken() {
        let token = wx.getStorageSync('token');
        // this.toRequest('/api/v1/token/verify','POST',{'token':token},res=>res.data.isValid)
        wx.request({
            url: this.globalData.baseConnected + '/api/v1/token/verify',
            method: 'POST',
            data: {
                'token': token
            },
            success: res => {
                return res.data.isValid
            }
        })
    },
    //发送请求
    //num为1时代表获取token，为2时代表获取数据
    toRequest(changeUrl, methodTo, data, num,headerd) {
        return new Promise(resolve => {
            //如果是请求数据携带token，请求token时不必携带token
            let carryToken = wx.getStorageSync('token'),
                method = methodTo ? methodTo : "GET",
                numb = num ? num : 2,
                header=headerd?headerd:{},
                callback;
            //如果不传则默认传res值，传则以传的function为主
            if (numb == 2) {
                data = data;
                header=Object.assign(header,{
                    'content-type': 'application/json',
                    "token":carryToken
                })
                callback = function (res) {
                    return resolve(res)
                }
            }
            else if(numb == 1) {
                callback = (res)=>{
                    wx.setStorageSync('token', res.data.token);
                    // console.log(res)
                }
            }
            let url = this.globalData.baseConnected + changeUrl;
            // console.log(url, method, data, callback)
            wx.request({
                url: `${url}`,
                method: `${method}`,
                header:header,
                data: data,
                success: callback
                
            })
        })
    },
    globalData: {
        token: wx.getStorageSync('token'),
        baseConnected: 'https://hanmashanghu.qiaomai365.com',
        details:[],
        nowfloor:1,
        paydetail:[]
    }
})