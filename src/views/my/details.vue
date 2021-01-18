<template>
    <div class='hundred'>
        <ul class='borderMagin'>
            <li class='allFlex paddProfit'>
                <div class='half gary'>
                    交易类型
                </div>
                <div class='half blueColor textRight'>
                    {{transaction[content.trade_type]?transaction[content.trade_type]:'其他'}}
                </div>
            </li>
            <li class='allFlex paddProfit'>
                <div class='half gary'>
                    金额来源
                </div>
                <div class='half blueColor textRight'>
                    {{content.NAME ? content.NAME.substr(0,1)+'**' : ''}}
                </div>
            </li>
            <li class='allFlex paddProfit' v-if="!(content.trade_type === 'JHJL' || content.trade_type === 'SMJL')">
                <div class='half gary'>
                    交易金额
                </div>
                <div class='half blueColor textRight'>
                    {{content.trxAmt}}
                </div>
            </li>
            <li class='allFlex paddProfit'>
                <div class='half gary'>
                    收益金额
                </div>
                <div class='half blueColor textRight'>
                    {{content.moneyAmt}}
                </div>
            </li>
            <li class='allFlex paddProfit' v-if="!(content.trade_type === 'JHJL' || content.trade_type === 'SMJL')">
                <div class='half gary'>
                    交易时间
                </div>
                <div class='half blueColor textRight'>
                    {{time}}
                </div>
            </li>
        </ul>
        <div class='bottomLong'></div>
    </div>
</template>
<script>

export default {
  data () {
    return {
      content: '',
      version: '',
      agentNo: '',
      transaction: {
        'AQYK': '全额还手续费',
        'BK': '申请信用卡',
        'CZWX': '微信充值',
        'CZZFB': '支付宝充值',
        'DK': '贷款',
        'HB': '花呗',
        'HK': '代还还款',
        'JF': '积分兑换',
        'JP': '领主竞拍',
        'QHK': '全额还款',
        'QYK': '全额代付',
        'TK': '退款',
        'WK': '银联快捷',
        'WXPAY': '微信',
        'WXSM': '亿贤微信',
        'YK': '代还消费',
        'YKXE': '代还消费（小额）',
        'YSWXSM': '微信扫码支付',
        'YSZFBSM': '支付宝扫码支付',
        'ZFB': '支付宝',
        'JHJL': '激活奖励',
        'SMJL': '实名奖励',
        'ZFBSM': '亿贤支付宝'
      },
      time: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.list()
  },
  methods: {
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '790007',
        '10': this.$route.query.tradetype,
        '11': this.$route.query.order,
        '12': this.$route.query.moneytype,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.content = JSON.parse(res.data[38])
            if (!(vm.content.trade_type === 'JHJL' || vm.content.trade_type === 'SMJL')) {
              vm.time = vm.$moment(vm.content.craetaTime.time).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
