<template>
  <div class='hundred'>
    <div style='height:1px' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'></div>
    <div class='aisleBack' v-for='item in aisleList' :key='item.acqcode'>
        <div>
            <div class='allFlex aisleJust'>
                <div>
                    <img src="../../assets/bank/yl.png" class='bankLogo bankLeft' />
                    <span class='bankRight weightFont'>{{item.channelName}}</span>
                </div>
                <span class='gary'>{{item.remark}}</span>
            </div>
        </div>
        <div class='aisleContent allFlex aisleJust border'>
            <div class='textCenter'>
                <p class='aisleBlue'>{{item.rate}}%</p>
                <p class='gary'>使用费率</p>
            </div>
            <div>
                <p class='gary'>单笔限额：{{item.limit}}</p>
                <p class='gary'>交易时间：{{item.T0date}}</p>
            </div>
            <div>
                <a class='aisleNext' @click="toMoney(item.acqcode, item.rate)">选择</a>
            </div>
        </div>
        <div class='allFlex gary aisleJust redColor' v-if='item.remarks'>
            <div class='aisleDescription'>通道说明</div>
            <div class='aisleRemarks'>{{item.remarks}}</div>
        </div>
    </div>
    <div class='loginTo makeTo' v-if='multi'>
      <div class='blue' @click='toYktrue()'>
          确认通道
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
      ykdhFlag: false,
      merchantNo: '',
      aisleList: [],
      bank: {},
      money: 0,
      mnum: 0,
      aisle: '',
      cardMore: [],
      usermerchantNo: '',
      merchantId: '',
      fullscreenLoading: false,
      multi: false,
      checked: false,
      checkList: []
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.money = this.$route.query.money
    this.aisle = this.$route.query.aisle
    this.list()
  },
  mounted () {
    if (document.querySelector('.el-cascader__dropdown')) {
      document.querySelector('.el-cascader__dropdown').style.display = 'none'
    }
    if (document.querySelector('.el-select-dropdown')) {
      document.querySelector('.el-select-dropdown').style.display = 'none'
    }
  },
  methods: {
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '390013',
        '41': 1,
        '42': vm.merchantNo,
        '43': 'HB',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.aisleList = JSON.parse(res.data[57]).acqData
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    toMoney (acqcode, rate) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190959',
        '5': vm.money * 100,
        '37': 'HB',
        '40': '',
        '42': vm.merchantNo,
        '43': acqcode,
        '44': rate,
        '59': vm.version
      }
      let url = vm.$mdata.mdGet(parmas)
      vm.$http.post('request.app', url)
        .then(res => {
          if (res.data[39] === '00') {
            window.location.href = res.data[30]
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
          console.log(err)
        })
    }
  }
}
</script>
