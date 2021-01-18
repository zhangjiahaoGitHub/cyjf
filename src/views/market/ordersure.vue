<template>
  <div class="ordersure-ordersure">
    <div class="order-box">
      <div class="adress" @click="toshopAddress()" v-if="addresscon">
        <div class="adress-detail">
          <p><span>{{addresscon.name}}</span><span class="mar-left">{{addresscon.phone}}</span></p>
          <p>{{addresscon.address.replace(/--/g,'')}}</p>
        </div>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="addadressbox" @click="toshopAddress()" v-if="!addresscon">
        <i class="el-icon-plus"></i>
        添加收货地址
      </div>
      <div class="order-goods">
        <div class="goods-img">
          <img :src="productdetails.url">
        </div>
        <div class="goods-con">
          <p class="con-title">{{productdetails.name}}</p>
          <p class="con-price">
            <span>×1</span>
            <span class='blueColor'>￥{{parseInt((productdetails.price + productdetails.freight)*100)/100}}{{productdetails.point ? ` + ${productdetails.point}积分` : ''}}</span>
          </p>
        </div>
      </div>
      <div class="remark">
        订单备注
        <el-input
          type="textarea"
          :rows="1"
          placeholder="请输入订单备注"
          v-model="textarea"
          class="remark-inp">
        </el-input>
      </div>
      <div class="select-title" v-if='productdetails.price'>选择支付方式</div>
      <div class='allFlex paySelect' v-if='productdetails.price'>
        <img src='../../assets/member/zfb.png' >
        <div class='payName'>
            <p>支付宝</p>
            <p>银行卡/信用卡均可用</p>
        </div>
        <el-radio v-model="radio" :label="YSZFBH5 == 1 ? 'YSZFBH5' : ZFBSM == 1 ? 'ZFBSM' : YSZFBSM == 1 ? 'YSZFBSM' : 'zfnone'"></el-radio>
    </div>
     <div class='allFlex paySelect' v-if='productdetails.price'>
        <img src='../../assets/member/wx.png' >
        <div class='payName'>
            <p>微信</p>
            <p>银行卡/信用卡均可用</p>
        </div>
        <el-radio v-model="radio" :label="YSWXH5 == 1 ? 'YSWXH5' : WXSM == 1 ? 'WXSM' : YSWXSM == 1 ? 'YSWXSM' : 'wxnone'"></el-radio>
    </div>
    </div>
    <!-- 下方立即购买 -->
    <ul class="allFlex-buy homeBanner-buy">
      <li class="promptly-buy-price">
        <p class="activity-price"><span>￥{{parseInt((productdetails.price + productdetails.freight)*100)/100}}{{productdetails.point ? `+${productdetails.point}积分` : ''}}</span></p>
      </li>
      <li class="promptly-buy" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading' @click="buy ()">
        <p class="activity-buy">立即购买</p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      merchantNo: '',
      noticelist: [],
      productdetails: [],
      textarea: '',
      radio: '',
      paytype: 'z',
      addressList: '',
      addresscon: '',
      addressselectid: '',
      selecttype: false,
      integralPrice: '', // 小蜜蜂数量
      tozfb: '',
      type: '',
      YSWXH5: 0,
      YSZFBH5: 0,
      WXSM: 0,
      ZFBSM: 0,
      YSWXSM: 0,
      YSZFBSM: 0,
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo // 获取商户号
    this.addressselectid = this.$route.query.addresstype
    this.selecttype = this.$route.query.selecttype
    this.integralPrice = JSON.parse(this.$stact.state.token)[0].integral
    this.type = this.$route.query.type
    this.message()
  },
  methods: {
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190112',
        '42': vm.merchantNo,
        '59': vm.version
      }
      vm.fullscreenLoading = true
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            this.YSWXH5 = JSON.parse(res.data[10]).YSWXH5
            this.YSZFBH5 = JSON.parse(res.data[10]).YSZFBH5
            this.WXSM = JSON.parse(res.data[10]).WXSM
            this.ZFBSM = JSON.parse(res.data[10]).ZFBSM
            this.YSWXSM = JSON.parse(res.data[10]).YSWXSM
            this.YSZFBSM = JSON.parse(res.data[10]).YSZFBSM
            this.getaddress()
            this.getnotice()
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    getnotice () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '680004',
        '5': '0',
        '6': '10',
        '7': vm.$route.query.id,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.fullscreenLoading = false
            vm.productdetails = JSON.parse(res.data[40])[0]
            vm.bannerList = vm.productdetails.detailUrl.split(',')
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    toshopAddress () {
      this.$router.push({ name: 'shopAddress', query: { getshopaddress: true, id: this.$route.query.id } })
    },
    // 获取商户收货地址
    getaddress () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '680003',
        '42': vm.merchantNo,
        '59': this.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            if (vm.selecttype) {
              vm.addresscon = JSON.parse(res.data[45])[vm.addressselectid]
            } else {
              vm.addresscon = JSON.parse(res.data[45]).filter((x, i) => {
                return Number(x.status) === 1
              })[0]
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 商品购买支付
    buy () {
      let vm = this
      if (!vm.addresscon) {
        vm.$message({
          message: '请添加收货地址',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.radio.match(/^[ ]*$/) && vm.productdetails.price) {
        vm.$message({
          message: '请选择支付方式',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.radio === 'zfnone' && vm.productdetails.price) {
        vm.$message({
          message: '暂无支付宝支付方式',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.radio === 'wxnone' && vm.productdetails.price) {
        vm.$message({
          message: '暂无微信支付方式',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.radio === 'zfnone' && vm.productdetails.price) {
        vm.$message({
          message: '暂无支付宝支付方式',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.radio === 'wxnone' && vm.productdetails.price) {
        vm.$message({
          message: '暂无微信支付方式',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      let parmas = {
        '0': '0700',
        '3': '680006',
        '5': 1,
        '6': vm.productdetails.price,
        '7': vm.productdetails.point,
        '8': vm.productdetails.freight,
        '9': '',
        '10': vm.textarea,
        '41': vm.productdetails.id,
        '42': vm.merchantNo,
        '43': vm.addresscon.id,
        '44': vm.radio,
        '59': this.version
      }
      vm.fullscreenLoading = true
      let url = vm.$mdata.mdGet(parmas)
      vm.$http.post(`request.app`, url)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            if (Number(vm.productdetails.price) === 0) {
              vm.$router.push({ name: 'shoparea' })
              return
            }
            if (Number(this.YSWXH5) === 1) {
              window.location.href = res.data[57]
              return
            }
            if (Number(this.YSZFBH5) === 1) {
              document.write(res.data[57])
              return
            }
            vm.$router.push({ name: 'code', query: { code: res.data[57], logo: vm.radio, money: parseInt((vm.productdetails.price + vm.productdetails.freight) * 100) / 100, shopingPayView: true } })
          } else {
            vm.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    }
  }
}
</script>
