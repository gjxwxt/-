// pages/cart/cart.js
let app=getApp()
Page({
    data: {
    baseUrl: app.globalData.baseConnected,
    productList:[],
    },
    onLoad(options) {
    },
    onReady() {
    },
    onShow() {
        let productList=wx.getStorageSync('cartList');
        this.setData({
            productList
        })
        this.distinguishSelectAll();
        this.totalAmount();
    },
    //加减去除的方法
    changeCart(e){
        var productlist=this.data.productList,fun=e.currentTarget.dataset.fun;
        for(let i=0;i<productlist.length;i++){
            if(productlist[i].id==parseInt(e.currentTarget.dataset.id)){
                if(fun=="minus"){
                    if(productlist[i].counts>=1){
                    productlist[i].counts--;
                    }
                }
                else if(fun=="add"){
                    productlist[i].counts++;
                }
                else if(fun="deleted"){
                    productlist.splice(i,1)
                }
                break
            }
        };
        this.setData({
            productList:productlist
        })
        wx.setStorageSync('cartList', productlist);
        this.totalAmount();
        // wx.setStorageSync('cartList', productlist)
    },
    //item的选中事件
    change(e){
        let productList=this.data.productList;
        if(e.detail.value[0]){
            for(var i=0;i<productList.length;i++){
                if(productList[i].id==parseInt(e.currentTarget.dataset.id)){
                    productList[i].selectStatus=true;
                }
            }
        }
        else{
            for(let i=0;i<productList.length;i++){
                if(productList[i].id==parseInt(e.currentTarget.dataset.id)){
                    productList[i].selectStatus=false;
                }
            }
    }
        wx.setStorageSync('cartList', productList);
        this.distinguishSelectAll();
        this.totalAmount()
    },
    distinguishSelectAll(){
        var productList=this.data.productList,selectAll;
        for(let i=0;i<productList.length;i++){
            //如果有一个没选中就为false
            if(productList[i].selectStatus==false){
                selectAll=false;
                break
            }
            else{
                selectAll=true
            }
        };
        this.setData({selectAll});
        
        // console.log(this.data.selectAll)
    },
    selectAll(e){
        var productList=this.data.productList,selectAll;
        //选中
        if(e.detail.value[0]){
            for(let i=0;i<productList.length;i++){
                productList[i].selectStatus=true;
            }
            selectAll=true;
        }
        else{
            for(let i=0;i<productList.length;i++){
                productList[i].selectStatus=false;
            }
            selectAll=false;
        }
        this.setData({productList,selectAll});
        this.totalAmount()
        wx.setStorageSync('cartList', productList)
        // console.log(this.data.selectAll)
    },
    totalAmount(){
        var productList=this.data.productList,totalAmount=0;
        for(let i=0;i<productList.length;i++){
            if(productList[i].selectStatus){
                totalAmount+=productList[i].counts*productList[i].price;
            }
        }
        this.setData({
            totalAmount:totalAmount.toFixed(2)
        })
    },
    topay(){
        wx.navigateTo({
          url: `/pages/pay/pay?totalAmount=${this.data.totalAmount}`,
        })
    },
})