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
                <a class='aisleNext' v-if='!multi' @click="aisle === 'YK' ? ykdhFlag ? toYkdh(item.acqcode, item.rate, aisle) : toYk(item.acqcode, item.rate, aisle): aisle === 'QYK' ? toYk(item.acqcode, item.rate, aisle) : toNext(item.acqcode, item.rate, aisle, item.channelName)">选择</a>
                <el-checkbox-group class='groupCheck' v-if="multi && item.status === '开通'" v-model="checkList">
                  <el-checkbox :label="item.acqcode"></el-checkbox>
                </el-checkbox-group>
                <a class='aisleNext' v-if="multi && item.status === '未开通'" @click="toYk(item.acqcode, item.rate, aisle)">开通</a>
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
    this.bank = JSON.parse(this.$route.query.item)
    this.money = this.$route.query.money
    this.aisle = this.$route.query.aisle
    this.usermerchantNo = this.$route.query.merchantNo
    this.ykdhFlag = this.$route.query.ykdhFlag
    if (this.usermerchantNo) {
      this.merchantNo = this.usermerchantNo
    }
    console.log(this.$route.query.item)
    this.merchantId = this.$route.query.merchantId
    this.multi = this.$route.query.multi
    this.list()
  },
  mounted () {
    if (document.querySelector('.el-cascader__dropdown')) {
      document.querySelector('.el-cascader__dropdown').style.display = 'none'
    }
    if (document.querySelector('.el-select-dropdown')) {
      document.querySelector('.el-select-dropdown').style.display = 'none'
    }
    if (document.querySelector('.el-picker-panel')) {
      document.querySelector('.el-picker-panel').style.display = 'none'
    }
  },
  methods: {
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '390013',
        '5': vm.ykdhFlag ? 1 : '',
        '41': 1,
        '42': vm.merchantNo,
        '43': vm.aisle,
        '44': vm.bank.bankId,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.aisleList = JSON.parse(res.data[57]).acqData
            vm.cardList()
          } else {
            vm.fullscreenLoading = false
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    cardList () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '390021',
        '41': vm.aisle,
        '42': vm.merchantNo,
        '45': vm.bank.BANK_ACCOUNT,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.cardMore = JSON.parse(res.data[36])
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    toYk (acqcode, rate, aisle) {
      let vm = this
      vm.cardMore.map((x, i) => {
        if (x.type.toString() === acqcode.toString()) {
          if (x.status === '开通') {
            vm.$router.push({ name: 'make', query: { acqcode: acqcode, rate: rate, item: vm.$route.query.item, tong: aisle, merchantNo: vm.usermerchantNo, lazyPeople: vm.$route.query.lazyPeople } })
          } else {
            vm.$router.push({ name: 'tiedcard', query: { item: JSON.stringify(vm.bank), code: x.type, category: x.category, merchantNo: vm.usermerchantNo, merchantId: vm.merchantId } })
          }
        }
      })
    },
    toYktrue () {
      let vm = this
      console.log(vm.checkList.toString())
      if (vm.checkList.length < 2) {
        this.$message({
          message: '多通道计划通道不能低于2条',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      vm.$router.push({ name: 'make', query: { item: vm.$route.query.item, tong: 'YK', merchantNo: vm.usermerchantNo, multi: vm.multi, checkList: vm.checkList.toString() } })
    },
    toYkdh (acqcode, rate, aisle) {
      let vm = this
      vm.cardMore.map((x, i) => {
        if (x.type.toString() === acqcode.toString()) {
          if (x.status === '开通') {
            vm.$router.push({ name: 'ykdhMake', query: { acqcode: acqcode, rate: rate, item: vm.$route.query.item, tong: aisle } })
          } else {
            vm.$router.push({ name: 'tiedcard', query: { item: JSON.stringify(vm.bank), code: x.type, category: x.category, merchantId: vm.merchantId } })
          }
        }
      })
    },
    toNext (acqcode, rate, aisle, title) {
      let vm = this
      vm.cardMore.map((x, i) => {
        if (x.type.toString() === acqcode.toString()) {
          if (x.status === '开通') {
            vm.mnum = 1
            vm.toMoney(acqcode, rate, title)
          } else {
            vm.mnum = 1
            vm.$router.push({ name: 'tiedcard', query: { item: JSON.stringify(vm.bank), code: x.type, category: x.category, tong: aisle, merchantNo: vm.usermerchantNo, merchantId: vm.merchantId } })
          }
        } else {
          if (i === vm.cardMore.length - 1 && vm.mnum === 0) {
            vm.mnum = 0
            vm.toMoney(acqcode, rate, title)
          }
        }
      })
    },
    toMoney (acqcode, rate, title) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190959',
        '5': vm.money * 100,
        '40': '',
        '41': vm.bank.BANK_ACCOUNT,
        '42': vm.merchantNo,
        '43': acqcode,
        '44': rate,
        '45': vm.bank.CVN,
        '46': vm.bank.EXPDATE,
        '59': vm.version
      }
      let url = vm.$mdata.mdGet(parmas)
      vm.$http.post('request.app', url)
        .then(res => {
          if (res.data[39] === '00') {
            if (title.indexOf('花呗') === -1) {
              vm.$router.push({ name: 'ifarme', query: { url: res.data[30], title: '快捷交易', merchantNo: vm.usermerchantNo } })
            } else {
              window.location.href = res.data[30]
            }
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
