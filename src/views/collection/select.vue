<template>
  <div>
    <div style='height:1px'></div>
    <div>
        <div class='bankgroud' v-for='item in cardList' :key='item.ID'>
            <div>
                <img :src="banks[item.BANK_NAME]?require(`../../assets/bank/white/${banks[item.BANK_NAME]}.png`):require('../../assets/bank/white/yl.png')" class='bankLogo' />
                <span class='bankRight fourFont'>
                    {{item.short_cn_name}}
                </span>
            </div>
            <div class='allFlex choose'>
                <div class='garyChoose'>****</div>
                <div class='garyChoose'>****</div>
                <div class='garyChoose'>****</div>
                <div class='garyChoose whiteColor'>{{item.BANK_ACCOUNT.substring(item.BANK_ACCOUNT.length-4, item.BANK_ACCOUNT.length)}}</div>
            </div>
            <div class='allFlex choose border'>
                <div class='garyChoose smallFont'>
                    <p>{{item.BILL_DAY}}</p>
                    <p>账单日</p>
                </div>
                <div class='garyChoose smallFont'>
                    <p>{{item.REPAYMENT_DAY}}</p>
                    <p>还款日</p>
                </div>
                <div class='garyChoose smallFont'>
                    <p>{{item.LIMIT_MONEY}}</p>
                    <p>额度</p>
                </div>
                <router-link tag='div' :to="{name: 'aisle',query: { item: JSON.stringify(item), money: $route.query.money, aisle: 'WK' }}" class='garyChoose whiteColor smallFont'>
                    <img src='../../assets/immediately.png'  class='immediately'/>
                </router-link>
            </div>
        </div>
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
      merchantNoquery: '', // 这个是不同用户根据不同merchantNo传过来获取卡片的
      cardList: [],
      banks: {
        313003: 'bj',
        303: 'gd',
        306: 'gf',
        105: 'js',
        301: 'jt',
        305: 'ms',
        103: 'ny',
        307: 'pa',
        309: 'xy',
        310: 'pf',
        403: 'yz',
        308: 'zs',
        102: 'gs',
        104: 'zg',
        302: 'zx',
        313062: 'sh',
        304: 'hx'
      }
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.merchantNoquery = this.$route.query.merchantNo
    console.log(this.merchantNoquery)
    this.list()
  },
  methods: {
    list () {
      let vm = this
      console.log(vm.merchantNoquery !== '')
      if (vm.merchantNoquery) {
        vm.merchantNo = vm.merchantNoquery
      }
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
