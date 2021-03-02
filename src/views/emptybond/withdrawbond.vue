<template>
  <div class="withdrawbond-style">
    <div style='height:1px'></div>
    <div class="top-price">
      <div>保证金余额：&yen; 1000.00</div>
      <div>可提现余额：800.00</div>
    </div>
    <div class="chart-input">
      <div class="yuan-icon">&yen;</div>
      <div>
        <input type="text" placeholder="请输入提现金额">
      </div>
    </div>
    <div class="notice">注：手续费0.06%</div>
    <div class="bank-select">
      <div><span class="bank-l-t">银行卡</span>：建设银行(0000)</div>
      <div>更换储蓄卡 <i class="el-icon-arrow-right"></i></div>
    </div>
    <div class="withdraw-btn">确认提现</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
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
