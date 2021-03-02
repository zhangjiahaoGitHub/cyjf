<template>
  <div class="wanttorecharge-style">
    <div style='height:1px'></div>
    <div class="top-price">
      <div class="black-color">请输入充值金额</div>
      <div>保证金余额：100.00</div>
    </div>
    <div class="price-input">
      <input type="text" v-model="price">
    </div>
    <div class="js-title">空卡额度档位介绍</div>
    <div class="dang-con">第1档 单笔限额500，单日最高限额2500，保证金范围在300-500（不含）</div>
    <div class="dang-con">第2档 单笔限额700，单日最高限额3500，保证金范围在500-1000（不含）</div>
    <div class="dang-con">第3档 单笔限额1000，单日最高限额5000，保证金范围在1000以上</div>

    <div class="zhifu-style">
      <div class="title">请选择支付方式:</div>
      <div class="row-zf-list">
        <div class="zf-name">
          <div class="img-box"><img src="../../assets/repay/bzj-wx.png" alt=""></div>
          <div>
            <p>微信支付</p>
            <p>最快捷的支付方式</p>
          </div>
        </div>
        <div class="xuanxiang">
          <el-radio v-model="radio" label="1"></el-radio>
        </div>
      </div>
      <div class="row-zf-list">
        <div class="zf-name">
          <div class="img-box"><img src="../../assets/repay/bzj-zfb.png" alt=""></div>
          <div>
            <p>支付宝支付</p>
            <p>最快捷的支付方式</p>
          </div>
        </div>
        <div class="xuanxiang">
          <el-radio v-model="radio" label="2"></el-radio>
        </div>
      </div>
    </div>
    <div :class="isphoneall ? 'zongji quanmianpin' : 'zongji'">
      <div class="hj">
        合计：300元
      </div>
      <div class="fk">立即付款</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      price: '200.00',
      radio: '1',
      isphoneall: false,
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
  },
  mounted () {
    let vm = this
    let isNewIphone = window && (navigator.userAgent.indexOf('iPhone') > -1) && window.screen.height >= 812 && window.devicePixelRatio >= 2
      if(isNewIphone) {
        vm.isphoneall = true
      }else {
        vm.isphoneall = false
      }
  },
  methods: {
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190932',
        '42': vm.merchantNo,
        '43': '0',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.cardList = JSON.parse(res.data[57])
            console.log(vm.cardList)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
