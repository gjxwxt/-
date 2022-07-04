// pages/pay/pay.js
let app = getApp();
Page({
    data: {
        userInfo: '',
        baseUrl: app.globalData.baseConnected,
        productList: [],
        orderInfo: ''
    },
    onLoad(options) {
        if(!options.id){
            let target = wx.getStorageSync('cartList'),
            productList = [],unselectedProducts=[],
            order = [];
        for (let i = 0; i < target.length; i++) {
            if (target[i].selectStatus) {
                productList.push(target[i]);
                let item = {
                    "product_id": target[i].id,
                    "count": target[i].counts
                };
                order.push(item)
            }
            else{
                unselectedProducts.push(target[i])
            }
        }
        this.setData({
            from:'detail',
            productList,
            totalAmount: options.totalAmount,
            order
        })
        wx.setStorageSync('cartList', unselectedProducts)
        }
        else{
            app.toRequest(`/api/v1/order/${options.id}`,'GET',{},2,{}).then(res=>this.setData({
                from:'pay',
                productList:res.data.data.snap_items,
                orderInfo:{create_time:res.data.data.create_time,order_no:res.data.data.order_no},
                userInfo:{userName:res.data.data.snap_address.name,telNumber:res.data.data.snap_address.mobile,
                    provinceName:res.data.data.snap_address.province||'',cityName:res.data.data.snap_address.city||'',
                    countyName:res.data.data.snap_address.countyName||'',detailInfo:res.data.data.snap_address.detail||''
                },
                totalAmount:res.data.data.total_price,
                product_id:options.id,
            }))
        }
    },
    // 获取地址
    //也可以用this备份，也可以用promise
    getaddress() {
        return new Promise(resolve => {
            wx.chooseAddress({
                success: (result) => {
                    resolve(result)
                },
            })
        })
    },
    pickAddress() {
        this.getaddress().then(res => {
            this.setData({
                userInfo: res
            })
            wx.setStorageSync('userInfo', this.data.userInfo)
        })
    },
    onShow() {
        // console.log(this.data.orderInfo)
    },
    // 点击去付款
    toPay() {
        if(this.data.from=='detail'){
            if (!this.data.userInfo) {
                wx.showModal({
                    title: '请输入地址'
                })
            } else {
                app.toRequest('/api/v1/order', 'POST', {
                    products: this.data.order
                }, 2).then(res => {
                    this.setData({
                        orderInfo: res.data.data
                    })
                    return Promise.resolve(res.data.data.order_id)
                }).then(res=>this.request(res))
            }
        }
        else{
            this.request(this.data.product_id)
        }
    },
    // 吊起微信付款页面
    request(res){
            app.toRequest('/api/v1/pay/pre_order', 'POST', {
                "id": res
            }, 2).then(res => {
                wx.requestPayment({
                    nonceStr: `${res.nonceStr}`,
                    package: `${this.data.id}`,
                    paySign: `${res.paySign}`,
                    timeStamp: `${res.timeStamp}`,
                    signType: 'md5',
                    fail: () => {
                        wx.navigateTo({
                            url: '/pages/payResult/payResult',
                        })
                    }
                })
            })
    },
    back() {
        wx.navigateBack({
            delta: 1,
        })
    },
})