<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div class='planContent exhaustiveContent'>
        <ul>
            <li class='allFlex flexPadding'>
                <div class='gary matterWidth'>
                    银行名称
                </div>
                <div>
                    {{card.short_cn_name}}
                </div>
            </li>
            <li class='allFlex flexPadding'>
                <div class='gary matterWidth'>
                    银行卡号
                </div>
                <div>
                    {{card.BANK_ACCOUNT}}
                </div>
            </li>
            <li class='allFlex flexPadding'>
                <div class='gary matterWidth'>
                    开户姓名
                </div>
                <div>
                    {{card.BANK_ACCOUNT_NAME}}
                </div>
            </li>
            <li class='allFlex flexPadding'>
                <div class='gary matterWidth'>
                    预留手机
                </div>
                <div>
                    {{card.BANK_PHONE}}
                </div>
            </li>
            <li class='allFlex flexPadding'>
                <div class='gary matterWidth'>
                    身份证号
                </div>
                <div>
                    {{card.ID_CARD_NUMBER}}
                </div>
            </li>
            <li class='allFlex flexPadding'>
                <div class='gary matterWidth'>
                    信用额度
                </div>
                <div>
                    {{card.LIMIT_MONEY}}
                </div>
            </li>
            <li class='allFlex flexPadding'>
                <div class='gary matterWidth'>
                    账单日期
                </div>
                <div>
                    {{card.BILL_DAY}}
                </div>
            </li>
            <li class='allFlex flexPadding'>
                <div class='gary matterWidth'>
                    还款日期
                </div>
                <div>
                    {{card.REPAYMENT_DAY}}
                </div>
            </li>
            <li class='allFlex flexPadding'>
                <div class='gary matterWidth'>
                    卡有效期
                </div>
                <div>
                    {{card.EXPDATE}}
                </div>
            </li>
            <li class='allFlex flexPadding'>
                <div class='gary matterWidth'>
                    cvv码
                </div>
                <div>
                    {{card.CVN}}
                </div>
            </li>
        </ul>
    </div>
    <div v-for='item in aisleList' :key='item.type' class='planContent exhaustiveContent'>
          <ul>
            <li class='allFlex justifyBetween flexPadding'>
              <div>{{item.acqName}}</div>
              <div class='gary'>{{item.status}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
              <div class='blueColor'>查看通道规则</div>
              <div>
                <a class='matterSubmit' :class="item.status == '未开通' ? '' : 'eeeBack'" @click="item.status == '未开通' ? toNext(1, item.type, item.category) : toNext(2, item.type, item.category) ">
                    {{item.status}}
                </a>
              </div>
            </li>
          </ul>
      </div>
    <div class='bottomLong'></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      card: [],
      aisleList: [],
      usermerchantNo: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.usermerchantNo = this.$route.query.merchantNo
    this.card = JSON.parse(this.$route.query.item)
    this.list()
  },
  mounted () {
    if (document.querySelector('.el-select-dropdown')) {
      document.querySelector('.el-select-dropdown').style.display = 'none'
    }
  },
  methods: {
    list () {
      let vm = this
      if (this.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      let parmas = {
        '0': '0700',
        '3': '390021',
        '41': vm.$route.query.type,
        '42': vm.merchantNo,
        '45': vm.card.BANK_ACCOUNT,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.aisleList = JSON.parse(res.data[36])
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    toNext (type, code, category) {
      let vm = this
      if (type === 1) {
        vm.$router.push({ name: 'tiedcard', query: { item: JSON.stringify(vm.card), code: code, category: category } })
      } else {
      }
    }
  }
}
</script>
